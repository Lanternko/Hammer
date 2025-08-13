// src/game/GameManager.js
import Player from './Player.js';
import Enemy from './Enemy.js';
import BattleSystem from '../systems/BattleSystem.js';
import EventSystem from '../systems/EventSystem.js';
import { selectEnemyType } from '../data/enemies.js';

class GameManager {
  constructor() {
    this.currentLevel = 1;
    this.player = new Player();
    this.enemy = null;
    this.state = 'battle';
    this.gold = 0;
    this.diamonds = 0;
    this.battleSystem = null;
    this.eventSystem = new EventSystem(this);
  }

  startGame() {
    console.log('🎮 遊戲啟動 - 準備第1關');
    this.updateUI();
    this.nextLevel();
  }

  nextLevel() {
    if (this.currentLevel > 20) {
      return this.endGame();
    }

    // 檢查是否是事件關卡 (第3、8、13、18關)
    if ([3, 8, 13, 18].includes(this.currentLevel)) {
      this.triggerEvent();
      return;
    }

    // 使用新的敵人選擇系統
    const enemyType = selectEnemyType(this.currentLevel);
    this.enemy = new Enemy(this.currentLevel, enemyType);
    
    console.log(`⚔️ 關卡 ${this.currentLevel}: 遭遇 ${this.enemy.getDisplayName()}`);
    console.log(`📊 敵人屬性: HP ${this.enemy.hp}/${this.enemy.maxHp}, 攻擊 ${this.enemy.attack}, 攻速 ${this.enemy.attackSpeed}, 防禦 ${this.enemy.defense}`);
    
    this.updateUI();
    this.updateEnemyDisplay();
    
    // 停止舊的戰鬥系統
    if (this.battleSystem) {
      this.battleSystem.stop();
    }
    
    this.battleSystem = new BattleSystem(this.player, this.enemy, this);
    this.battleSystem.start();
  }

  endBattle(won) {
    console.log(`⚔️ 戰鬥結束 - ${won ? '✅ 勝利' : '❌ 失敗'}`);
    
    if (!won) {
      console.log('💀 玩家失敗，遊戲結束');
      return this.endGame();
    }

    // 獲得金幣獎勵
    let goldReward = 1;
    if (this.currentLevel === 20) {
      goldReward = 5; // 最終Boss給5金幣
    } else if (this.currentLevel % 5 === 0) {
      goldReward = 2; // 每5關的倍數給2金幣
    }
    
    this.gold += goldReward;
    console.log(`💰 關卡 ${this.currentLevel} 完成！獲得金幣: ${goldReward}，總金幣: ${this.gold}`);

    // 顯示勝利信息
    this.showVictoryMessage(goldReward);

    // 關卡完成後的短暫延遲
    setTimeout(() => {
      this.currentLevel++;
      this.nextLevel();
    }, 2000); // 2秒後進入下一關
  }

  showVictoryMessage(goldReward) {
    // 創建勝利提示
    const victoryDiv = document.createElement('div');
    victoryDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #2ECC71, #27AE60);
      color: white;
      padding: 20px 30px;
      border-radius: 15px;
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      z-index: 1000;
      box-shadow: 0 10px 30px rgba(46, 204, 113, 0.4);
      animation: victoryPulse 0.5s ease-out;
    `;

    victoryDiv.innerHTML = `
      <div>🎉 關卡 ${this.currentLevel} 完成！</div>
      <div style="margin-top: 10px; font-size: 16px;">
        💰 +${goldReward} 金幣
      </div>
    `;

    // 添加動畫
    const style = document.createElement('style');
    style.textContent = `
      @keyframes victoryPulse {
        0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.1); }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(victoryDiv);

    // 1.5秒後移除
    setTimeout(() => {
      if (victoryDiv.parentNode) {
        victoryDiv.remove();
      }
      if (style.parentNode) {
        style.remove();
      }
    }, 1500);
  }

  triggerEvent() {
    console.log(`🏪 觸發事件關卡 ${this.currentLevel}`);
    this.state = 'shop';
    this.eventSystem.generateShopEvent();
  }

  finishEvent() {
    this.state = 'battle';
    setTimeout(() => {
      this.currentLevel++;
      this.nextLevel();
    }, 1000);
  }

  endGame() {
    const diamonds = Math.floor(this.currentLevel / 5) + (this.currentLevel >= 20 ? 5 : 0);
    console.log(`🎯 遊戲結束！到達關卡: ${this.currentLevel}, 獲得鑽石: ${diamonds}`);
    this.diamonds += diamonds;
    
    this.showGameOverScreen();
    
    // 3秒後重置遊戲
    setTimeout(() => {
      this.resetGame();
    }, 5000);
  }

  showGameOverScreen() {
    const gameOverDiv = document.createElement('div');
    gameOverDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000;
    `;

    const isVictory = this.currentLevel > 20;
    
    gameOverDiv.innerHTML = `
      <div style="
        background: linear-gradient(135deg, ${isVictory ? '#2ECC71, #27AE60' : '#E74C3C, #C0392B'});
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        color: white;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
      ">
        <div style="font-size: 48px; margin-bottom: 20px;">
          ${isVictory ? '🏆' : '💀'}
        </div>
        <h2 style="font-size: 32px; margin-bottom: 15px;">
          ${isVictory ? '恭喜勝利！' : '遊戲結束'}
        </h2>
        <p style="font-size: 20px; margin-bottom: 20px;">
          ${isVictory ? '你征服了所有20關！' : `你在第 ${this.currentLevel} 關倒下了`}
        </p>
        <p style="font-size: 16px; opacity: 0.9;">
          💎 獲得鑽石: ${Math.floor(this.currentLevel / 5)}
        </p>
        <p style="font-size: 14px; margin-top: 20px; opacity: 0.7;">
          遊戲將在幾秒後重新開始...
        </p>
      </div>
    `;

    document.body.appendChild(gameOverDiv);

    // 5秒後移除
    setTimeout(() => {
      if (gameOverDiv.parentNode) {
        gameOverDiv.remove();
      }
    }, 4500);
  }

  resetGame() {
    console.log('🔄 重新開始遊戲...');
    this.currentLevel = 1;
    this.player = new Player();
    this.enemy = null;
    this.state = 'battle';
    this.gold = 0;
    // 鑽石保留不重置
    
    // 清理UI
    const existingOverlays = document.querySelectorAll('[id*="Overlay"], .damage-indicator');
    existingOverlays.forEach(overlay => overlay.remove());
    
    this.startGame();
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

  updateEnemyDisplay() {
    if (!this.enemy) return;

    // 更新敵人名稱
    const enemyName = document.querySelector('.enemy .character-name');
    if (enemyName) {
      enemyName.textContent = this.enemy.getDisplayName();
    }

    // 更新敵人血量顯示
    const enemyHealthText = document.querySelector('.enemy .health-text');
    if (enemyHealthText) {
      enemyHealthText.textContent = `${this.enemy.hp} / ${this.enemy.maxHp}`;
    }

    // 重置血條
    const enemyHealthFill = document.querySelector('.enemy .health-fill');
    if (enemyHealthFill) {
      enemyHealthFill.style.width = '100%';
    }

    // 重置攻擊進度條
    const enemyAttackFill = document.querySelector('.enemy .attack-fill');
    if (enemyAttackFill) {
      enemyAttackFill.style.width = '0%';
    }
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

    // 更新玩家血條
    const heroHealthFill = document.querySelector('.hero .health-fill');
    const heroHealthText = document.querySelector('.hero .health-text');
    if (heroHealthFill && heroHealthText) {
      const hpPercent = Math.max(0, (this.player.hp / this.player.maxHp) * 100);
      heroHealthFill.style.width = `${hpPercent}%`;
      heroHealthText.textContent = `${Math.round(this.player.hp)} / ${this.player.maxHp}`;
    }
  }
}

export default GameManager;