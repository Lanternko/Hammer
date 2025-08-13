<<<<<<< HEAD
// 修復後的 GameManager.js
=======
>>>>>>> a4f7d26e54d25ca90d429092c220c79698ce667a
// src/game/GameManager.js
import Player from './Player.js';
import Enemy from './Enemy.js';
import BattleSystem from '../systems/BattleSystem.js';
<<<<<<< HEAD
=======
import UIManager from '../ui/UIManager.js'; // 新增：引入 UIManager
>>>>>>> a4f7d26e54d25ca90d429092c220c79698ce667a

class GameManager {
  constructor() {
    this.currentLevel = 1; // 從第1關開始，不是第7關
    this.player = new Player();
    this.enemy = null;
    this.state = 'battle';
    this.gold = 0;
    this.diamonds = 0;
<<<<<<< HEAD
    this.battleSystem = null;
  }

  startGame() {
    console.log('遊戲啟動 - 第1關開始');
    this.updateUI(); // 更新UI顯示
=======
    this.uiManager = new UIManager(); // 在這裡創建 UIManager 的唯一實例
  }

  startGame() {
    console.log('遊戲啟動');
    this.uiManager.createBackgroundParticles(); // 在遊戲開始時呼叫，創建背景特效
>>>>>>> a4f7d26e54d25ca90d429092c220c79698ce667a
    this.nextLevel();
  }

  // Get a random enemy type based on current level
  nextLevel() {
<<<<<<< HEAD
    if (this.currentLevel > 20) { // 改為20關
=======
    if (this.currentLevel > 5) {
>>>>>>> a4f7d26e54d25ca90d429092c220c79698ce667a
      return this.endGame();
    }

    // 檢查是否是事件關卡 (第3、8、13、18關)
    if ([3, 8, 13, 18].includes(this.currentLevel)) {
      this.triggerEvent();
      return;
    }

    const enemyType = this.currentLevel === 20 ? 'smallBoss' : this.getRandomEnemyType();
    this.enemy = new Enemy(this.currentLevel, enemyType);
    
    console.log(`進入關卡 ${this.currentLevel}, 敵人: ${enemyType}`);
<<<<<<< HEAD
    console.log(`敵人血量: ${this.enemy.hp}, 攻擊力: ${this.enemy.attackDamage}`);
    
    this.updateUI();
    
    // 停止舊的戰鬥系統
    if (this.battleSystem) {
      this.battleSystem.stop();
    }
    
    this.battleSystem = new BattleSystem(this.player, this.enemy, this);
    this.battleSystem.start();
  }

  endBattle(won) {
    console.log(`戰鬥結束 - ${won ? '勝利' : '失敗'}`);
    
    if (!won) {
      console.log('玩家失敗，遊戲結束');
      return this.endGame();
    }

    // 獲得金幣獎勵
    const goldReward = this.currentLevel === 20 ? 3 : 1; // 最終Boss給3金幣
    this.gold += goldReward;
    console.log(`關卡 ${this.currentLevel} 完成，獲得金幣: ${goldReward}，總金幣: ${this.gold}`);

    // 關卡完成後的短暫延遲
    setTimeout(() => {
      this.currentLevel++;
      this.nextLevel();
    }, 1500); // 1.5秒後進入下一關
  }

  triggerEvent() {
    console.log(`觸發事件關卡 ${this.currentLevel}`);
    
    // 簡單的商店系統
    this.state = 'shop';
    this.showShop();
  }

  showShop() {
    // 暫時用console模擬商店，之後會實現真正的UI
    console.log('=== 商店 ===');
    console.log('1. 護甲強化 (+10防禦) - 5金幣');
    console.log('2. 生命強化 (+20血量) - 6金幣');
    console.log('3. 攻速提升 (+0.2攻速) - 8金幣');
    console.log(`你有 ${this.gold} 金幣`);
    
    // 自動購買第一個可購買的物品 (暫時)
    if (this.gold >= 5) {
      this.buyItem('armor');
    } else {
      console.log('金幣不足，跳過商店');
      this.finishEvent();
    }
  }

  buyItem(itemType) {
    switch(itemType) {
      case 'armor':
        if (this.gold >= 5) {
          this.gold -= 5;
          this.player.armor += 10;
          console.log('購買護甲強化！防禦力+10');
        }
        break;
      case 'health':
        if (this.gold >= 6) {
          this.gold -= 6;
          this.player.maxHp += 20;
          this.player.hp += 20; // 也回復當前血量
          console.log('購買生命強化！最大血量+20');
        }
        break;
      case 'speed':
        if (this.gold >= 8) {
          this.gold -= 8;
          this.player.attackSpeed += 0.2;
          console.log('購買攻速提升！攻擊速度+0.2');
        }
        break;
    }
    
    this.finishEvent();
  }

  finishEvent() {
    this.state = 'battle';
    setTimeout(() => {
      this.currentLevel++;
      this.nextLevel();
    }, 1000);
  }

  endGame() {
    const diamonds = Math.floor(this.currentLevel / 5) + (this.currentLevel > 20 ? 5 : 0);
    console.log(`遊戲結束！到達關卡: ${this.currentLevel}, 獲得鑽石: ${diamonds}`);
    this.diamonds += diamonds;
    
    // 重置遊戲
    setTimeout(() => {
      this.resetGame();
    }, 3000);
  }

  resetGame() {
    console.log('重新開始遊戲...');
    this.currentLevel = 1;
    this.player = new Player();
    this.state = 'battle';
    this.gold = 0;
    this.startGame();
=======
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
>>>>>>> a4f7d26e54d25ca90d429092c220c79698ce667a
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

  updateUI() {
    // 更新關卡顯示
    const roundCounter = document.querySelector('.round-counter');
    if (roundCounter) {
      roundCounter.textContent = `Round ${this.currentLevel} / 20`;
    }

    // 更新玩家資訊
    this.updatePlayerStats();
  }

  updatePlayerStats() {
    // 更新角色名稱顯示血量
    const heroName = document.querySelector('.hero .character-name');
    if (heroName) {
      heroName.textContent = `🛡️ Giant Hero (${Math.round(this.player.hp)}/${this.player.maxHp})`;
    }

    // 更新統計面板
    const stats = document.querySelectorAll('.stat-value');
    if (stats.length >= 4) {
      stats[0].textContent = this.player.attack.toFixed(1);
      stats[1].textContent = this.player.attackSpeed.toFixed(2);
      stats[2].textContent = this.player.armor.toFixed(1);
      stats[3].textContent = (this.player.critChance * 100).toFixed(0) + '%';
    }
  }
}

export default GameManager;

// ========================

// 修復後的 BattleSystem.js
// src/systems/BattleSystem.js
import UIManager from '../ui/UIManager.js';

class BattleSystem {
  constructor(player, enemy, gameManager) {
    this.player = player;
    this.enemy = enemy;
    this.gameManager = gameManager;
    this.frameCount = 0;
    this.isActive = true;
    this.uiManager = new UIManager();
    this.animationId = null;
  }

  start() {
    console.log('戰鬥開始');
    this.isActive = true;
    this.loop();
  }

  stop() {
    this.isActive = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  loop() {
    if (!this.isActive) return;
    
    this.tick();
    this.uiManager.drawBattle(this.player, this.enemy);
    
    this.animationId = requestAnimationFrame(() => this.loop());
  }

  tick() {
    // 檢查遊戲是否還在進行
    if (!this.isActive) return;

    this.player.currentFrame++;
    this.enemy.currentFrame++;

    // 玩家攻擊
    if (this.player.currentFrame >= this.player.attackFrame) {
      const dmg = this.player.attack();
      console.log(`玩家攻擊造成 ${dmg} 傷害`);
      
      const isDead = this.enemy.takeDamage(dmg);
      this.uiManager.showDamage(dmg, this.player.critChance > Math.random(), false);
      
      if (isDead) {
        console.log('敵人被擊敗！');
        this.isActive = false;
        this.gameManager.endBattle(true);
        return;
      }
      this.player.currentFrame = 0;
    }

    // 敵人攻擊
    if (this.enemy.currentFrame >= this.enemy.attackFrame && this.isActive) {
      const rawDmg = this.enemy.attack();
      const finalDmg = this.player.takeDamage(rawDmg);
      console.log(`敵人攻擊造成 ${finalDmg} 傷害`);
      
      this.uiManager.showDamage(finalDmg, false, true);
      
      if (this.player.hp <= 0) {
        console.log('玩家被擊敗！');
        this.isActive = false;
        this.gameManager.endBattle(false);
        return;
      }
      this.enemy.currentFrame = 0;
    }

    // 更新UI中的玩家狀態
    this.gameManager.updatePlayerStats();
  }
}

export default BattleSystem;

// ========================

// 修復後的 Player.js - 添加升級機制
// src/game/Player.js
class Player {
  constructor() {
    this.hp = 100;
    this.maxHp = 100;
    this.attack = 20;
    this.attackSpeed = 0.5;
    this.armor = 20;
    this.flatReduction = 5;
    this.critChance = 0.1;
    this.badges = [];
    this.attackFrame = Math.round(20 / this.attackSpeed);
    this.currentFrame = 0;
    
    // 經驗值系統
    this.level = 1;
    this.exp = 0;
    this.expToNext = 100;
  }

  attack() {
    const isCrit = Math.random() < this.critChance;
    const damage = this.attack * (isCrit ? 2 : 1);
    
    // 獲得經驗值
    this.gainExp(5);
    
    return damage;
  }

  takeDamage(rawDamage) {
    const reduced = rawDamage / (1 + this.armor / 100);
    const final = Math.max(1, reduced - this.flatReduction); // 最少1點傷害
    this.hp = Math.max(0, this.hp - final);
    return final;
  }

  gainExp(amount) {
    this.exp += amount;
    if (this.exp >= this.expToNext) {
      this.levelUp();
    }
  }

  levelUp() {
    this.level++;
    this.exp = 0;
    this.expToNext = Math.floor(this.expToNext * 1.2); // 每級需要更多經驗
    
    // 升級獎勵
    this.maxHp += 10;
    this.hp += 10; // 升級時回復血量
    this.attack += 2;
    
    console.log(`升級！等級: ${this.level}, 血量+10, 攻擊+2`);
  }

  // 裝備徽章
  equipBadge(badge) {
    this.badges.push(badge);
    this.applyBadgeEffect(badge);
  }

  applyBadgeEffect(badge) {
    if (badge.effect.maxHp) this.maxHp += badge.effect.maxHp;
    if (badge.effect.attack) this.attack += badge.effect.attack;
    if (badge.effect.armor) this.armor += badge.effect.armor;
    if (badge.effect.attackSpeed) {
      this.attackSpeed += badge.effect.attackSpeed;
      this.attackFrame = Math.round(20 / this.attackSpeed);
    }
    if (badge.effect.critChance) this.critChance += badge.effect.critChance;
    
    console.log(`裝備徽章: ${badge.name}`);
  }
}

export default Player;