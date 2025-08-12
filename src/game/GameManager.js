// src/game/GameManager.js
import Player from './Player.js';
import Enemy from './Enemy.js';
import BattleSystem from '../systems/BattleSystem.js';
import UIManager from '../ui/UIManager.js'; // 新增：引入 UIManager

class GameManager {
  constructor() {
    this.currentLevel = 1;
    this.player = new Player();
    this.enemy = null;
    this.state = 'battle';
    this.gold = 0;
    this.diamonds = 0;
    this.uiManager = new UIManager(); // 在這裡創建 UIManager 的唯一實例
  }

  startGame() {
    console.log('遊戲啟動');
    this.uiManager.createBackgroundParticles(); // 在遊戲開始時呼叫，創建背景特效
    this.nextLevel();
  }

  // Get a random enemy type based on current level
  nextLevel() {
    if (this.currentLevel > 5) {
      return this.endGame();
    }
    const enemyType = this.currentLevel === 5 ? 'smallBoss' : this.getRandomEnemyType();
    this.enemy = new Enemy(this.currentLevel, enemyType);
    console.log(`進入關卡 ${this.currentLevel}, 敵人: ${enemyType}`);
    // 將 uiManager 實例傳遞給 BattleSystem
    new BattleSystem(this.player, this.enemy, this, this.uiManager).start();
  }

  // Start a new round
  startRound() {
    if (this.currentRound > this.maxRounds) {
      this.endGame(true); // Player completed all rounds
      return;
    }

    // Create new enemy for this round
    this.enemy = new Enemy(this.currentRound);
    
    // Update UI
    this.uiManager.updateRoundCounter(this.currentRound, this.maxRounds);
    this.uiManager.updateEnemyDisplay(this.enemy);
    this.uiManager.updateHealthBars(this.player, this.enemy);
    this.uiManager.updateStatsPanel(this.player);
    
    this.uiManager.addLogEntry(`🎯 Round ${this.currentRound} begins!`);
    this.uiManager.addLogEntry(`👹 Enemy: ${this.enemy.maxHp} HP, ${this.enemy.attack} ATK`);
    
    // Start battle
    this.startBattle();
  }

  // Start battle system
  startBattle() {
    this.gameState = 'battle';
    
    // Create battle system with callback
    this.battleSystem = new BattleSystem(
      this.player,
      this.enemy,
      this.uiManager,
      (playerWins) => this.onBattleEnd(playerWins)
    );
    
    // Start battle after short delay
    setTimeout(() => {
      this.battleSystem.start();
    }, 1000);
  }

  // Handle battle end
  onBattleEnd(playerWins) {
    if (playerWins) {
      this.gameState = 'levelUp';
      this.showLevelUpRewards();
    } else {
      this.endGame(false); // Player died
    }
  }

  // Show level up rewards
  showLevelUpRewards() {
    const options = this.generateLevelUpOptions();
    
    this.uiManager.showLevelUpModal(options, (selectedIndex) => {
      this.applyLevelUpReward(options[selectedIndex]);
    });
  }

  // Generate level up options (10% avg with variance)
  generateLevelUpOptions() {
    const stats = [
      { stat: 'attack', display: 'Attack', icon: '⚔️' },
      { stat: 'defense', display: 'Defense', icon: '🛡️' },
      { stat: 'maxHp', display: 'Max HP', icon: '❤️' },
      { stat: 'speed', display: 'Speed', icon: '⚡' },
      { stat: 'critRate', display: 'Crit Rate', icon: '💥' }
    ];
    
    const options = [];
    
    // Generate 4 random options
    for (let i = 0; i < 4; i++) {
      const randomStat = stats[Math.floor(Math.random() * stats.length)];
      const baseIncrease = 0.10; // 10% base
      const variance = (Math.random() - 0.5) * 0.04; // ±2% variance
      const increase = baseIncrease + variance; // 8-12% range
      
      options.push({
        ...randomStat,
        increase,
        boostText: `+${(increase * 100).toFixed(1)}%`
      });
    }
    
    return options;
  }

  // Apply selected level up reward
  applyLevelUpReward(option) {
    const oldValue = this.player[option.stat];
    this.player.applyStatBoost(option.stat, option.increase);
    const newValue = this.player[option.stat];
    
    this.uiManager.addLogEntry(
      `🔥 ${option.display} increased: ${oldValue.toFixed(1)} → ${newValue.toFixed(1)}`
    );
    
    // Update displays
    this.uiManager.updateStatsPanel(this.player);
    
    // Continue to next round
    setTimeout(() => {
      this.currentRound++;
      this.startRound();
    }, 1500);
  }

  // End game
  endGame(victory) {
    this.gameState = 'gameOver';
    
    if (victory) {
      this.uiManager.addLogEntry('🏆 VICTORY! You completed all 20 rounds!');
      this.uiManager.addLogEntry('🎉 You are the ultimate champion!');
    } else {
      this.uiManager.addLogEntry('💀 GAME OVER! You were defeated!');
      this.uiManager.addLogEntry(`📊 You reached Round ${this.currentRound}`);
    }
    
    // Show game over options after delay
    setTimeout(() => {
      this.showGameOverOptions(victory);
    }, 2000);
  }

  // Show game over options
  showGameOverOptions(victory) {
    const modal = document.createElement('div');
    modal.className = 'level-up-modal';
    modal.innerHTML = `
      <div class="level-up-content">
        <div class="level-up-title">${victory ? '🏆 VICTORY!' : '💀 GAME OVER'}</div>
        <div style="margin: 20px 0; color: white; font-size: 16px;">
          ${victory ? 
            'Congratulations! You conquered all 20 rounds!' : 
            `You reached Round ${this.currentRound}`
          }
        </div>
        <button class="continue-btn" onclick="location.reload()">
          🔄 Play Again
        </button>
      </div>
    `;
    
    document.body.appendChild(modal);
  }

  // Get current game statistics
  getGameStats() {
    return {
      currentRound: this.currentRound,
      playerStats: {
        hp: this.player.hp,
        maxHp: this.player.maxHp,
        attack: this.player.attack,
        defense: this.player.defense,
        speed: this.player.speed,
        critRate: this.player.critRate
      },
      enemyStats: this.enemy ? {
        hp: this.enemy.hp,
        maxHp: this.enemy.maxHp,
        attack: this.enemy.attack,
        defense: this.enemy.defense
      } : null
    };
  }

  // 👇 --- 請將這個方法加回來 --- 👇
  getRandomEnemyType() {
    const types = ['highSpeed', 'highDamage', 'balanced'];
    return types[Math.floor(Math.random() * types.length)];
  }
}

export default GameManager;