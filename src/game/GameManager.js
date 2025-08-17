// src/game/GameManager.js - 快速修復版（暫時向後兼容）
import Player from './Player.js';
import Enemy from './Enemy.js';
import BattleSystem from '../systems/BattleSystem.js';
import EventSystem from '../systems/EventSystem.js';
import { selectEnemyType } from '../data/Enemies.js';

class GameManager {
  constructor() {
    console.log('🏗️ GameManager constructor called');
    
    // 核心遊戲狀態
    this.currentLevel = 1;
    this.player = null;
    this.enemy = null;
    this.state = 'battle';
    this.battleSystem = null;
    this.eventSystem = null;
    
    // 遊戲設定
    this.battleSpeed = 1;
    this.isPaused = false;
    
    // 🔧 模組化系統 - 先內嵌實現，避免import錯誤
    this.uiManager = new GameUIManager(this);
    this.overlayManager = new OverlayManager(this);
    this.progressionSystem = new ProgressionSystem(this);
    this.deathSystem = new DeathSystem(this);
    this.rewardSystem = new RewardSystem(this);
    this.errorHandler = new ErrorHandler(this);
    
    this.initializeAfterLoad();
  }

  async initializeAfterLoad() {
    try {
      await this.waitForModules();
      
      this.player = new Player();
      this.eventSystem = new EventSystem(this);
      
      // 🔧 使用模組化系統
      this.rewardSystem.giveStartingBadge(this.player);
      this.deathSystem.handleInheritedBadges(this.player);
      
      console.log('✅ GameManager 初始化完成');
      
    } catch (error) {
      this.errorHandler.showInitializationError(error);
    }
  }

  async waitForModules() {
    return new Promise((resolve) => {
      const checkModules = () => {
        if (typeof Player !== 'undefined' && 
            typeof EventSystem !== 'undefined') {
          resolve();
        } else {
          setTimeout(checkModules, 100);
        }
      };
      checkModules();
    });
  }

  // 🎮 核心遊戲流程方法
  startGame() {
    try {
      if (!this.player) {
        console.error('❌ 無法開始遊戲：玩家未初始化');
        return;
      }
      
      console.log('🎮 遊戲啟動 - 準備第1關');
      this.uiManager.updateUI();
      this.nextLevel();
      
    } catch (error) {
      this.errorHandler.showInitializationError(error);
    }
  }

  nextLevel() {
    if (this.progressionSystem.isShowingLevelUpChoice) {
      console.log('⏳ 等待升級選擇完成...');
      return;
    }

    if (this.currentLevel > 20) {
      return this.endGame();
    }

    console.log(`🔄 進入關卡 ${this.currentLevel}`);

    // 事件關卡
    if ([3, 8, 13, 18].includes(this.currentLevel)) {
      this.triggerEvent();
      return;
    }

    // 戰鬥關卡
    this.startBattle();
  }

  startBattle() {
    const enemyType = selectEnemyType(this.currentLevel);
    this.enemy = new Enemy(this.currentLevel, enemyType);
    
    console.log(`⚔️ 關卡 ${this.currentLevel}: 遭遇 ${this.enemy.getDisplayName()}`);
    console.log(`📊 敵人屬性: HP ${this.enemy.hp}/${this.enemy.maxHp}, 攻擊 ${this.enemy.attack}, 攻速 ${this.enemy.attackSpeed}, 防禦 ${this.enemy.defense}`);
    
    this.uiManager.updateUI();
    this.uiManager.updateEnemyDisplay(this.enemy);
    
    // 啟動戰鬥系統
    if (this.battleSystem) {
      this.battleSystem.stop();
    }
    
    this.battleSystem = new BattleSystem(this.player, this.enemy, this);
    this.battleSystem.setBattleSpeed(this.battleSpeed);
    this.battleSystem.start();
  }

  // ⚔️ 戰鬥結束處理
  endBattle(won, battleStats = null) {
    console.log(`⚔️ 戰鬥結束 - ${won ? '✅ 勝利' : '❌ 失敗'}`);
    
    if (!won) {
      console.log('💀 玩家失敗，遊戲結束');
      this.deathSystem.showDeathSummary(this.player, this.currentLevel, battleStats);
      return;
    }

    // 勝利處理
    this.handleVictory(battleStats);
  }

  handleVictory(battleStats) {
    // 顯示戰鬥結果
    if (battleStats) {
      this.overlayManager.showBattleResults(battleStats, this.player, 2000);
    }

    // 計算獎勵
    const goldReward = this.rewardSystem.calculateGoldReward(this.currentLevel);
    this.rewardSystem.addGold(goldReward);
    
    // 回復血量
    this.player.hp = this.player.maxHp;
    console.log('💚 血量已回滿');

    // 顯示升級選擇
    setTimeout(() => {
      if (!this.progressionSystem.isShowingLevelUpChoice) {
        this.progressionSystem.showLevelUpChoice(this.currentLevel, goldReward);
      }
    }, 1000);
  }

  // 🏪 事件系統
  triggerEvent() {
    console.log(`🏪 觸發事件關卡 ${this.currentLevel}`);
    this.state = 'shop';
    this.eventSystem.generateShopEvent();
  }

  finishEvent() {
    this.state = 'battle';
    this.progressionSystem.showLevelUpChoice(this.currentLevel, 0);
  }

  // 🎯 遊戲結束
  endGame() {
    const diamonds = Math.floor(this.currentLevel / 5) + (this.currentLevel >= 20 ? 5 : 0);
    console.log(`🎯 遊戲結束！到達關卡: ${this.currentLevel}, 獲得鑽石: ${diamonds}`);
    this.rewardSystem.addDiamonds(diamonds);
    
    this.overlayManager.showGameOverScreen(this.currentLevel, this.player, diamonds);
    
    setTimeout(() => {
      this.resetGame();
    }, 8000);
  }

  // 🔄 重置遊戲
  resetGame() {
    console.log('🔄 無縫重新開始...');
    
    this.progressionSystem.resetProgressionState();
    
    if (this.battleSystem) {
      this.battleSystem.stop();
      this.battleSystem = null;
    }
    
    this.currentLevel = 1;
    this.player = new Player();
    this.enemy = null;
    this.state = 'battle';
    
    this.overlayManager.clearAllOverlays();
    this.uiManager.resetBaseUI();
    this.rewardSystem.giveStartingBadge(this.player);
    this.deathSystem.handleInheritedBadges(this.player);
    
    this.uiManager.updateUI();
    this.nextLevel();
    
    console.log('✅ 無縫重開完成！');
  }

  // 🎛️ 控制方法
  togglePause() {
    if (this.battleSystem) {
      this.battleSystem.togglePause();
    }
  }

  setBattleSpeed(speed) {
    this.battleSpeed = speed;
    if (this.battleSystem) {
      this.battleSystem.setBattleSpeed(speed);
    }
    console.log(`🎛️ 全局戰鬥速度設定為 ${speed}x`);
  }

  // 🔧 便利方法 (委託給相應模組)
  updateUI() {
    this.uiManager.updateUI();
  }

  updatePlayerStats() {
    this.uiManager.updatePlayerStats(this.player);
  }

  // 🔧 Getter 方法
  get gold() {
    return this.rewardSystem.gold;
  }

  get diamonds() {
    return this.rewardSystem.diamonds;
  }

  get inheritedBadges() {
    return this.deathSystem.inheritedBadges;
  }

  set inheritedBadges(badges) {
    this.deathSystem.inheritedBadges = badges;
  }

  // 🔧 公開方法給外部調用
  restartWithInheritance() {
    this.deathSystem.restartWithInheritance();
  }

  restartWithoutInheritance() {
    this.deathSystem.restartWithoutInheritance();
  }

  acceptMilestoneBadge() {
    this.progressionSystem.acceptMilestoneBadge();
  }
}

// =====================================================================
// 🔧 內嵌模組實現（暫時方案，避免 import 錯誤）
// =====================================================================

// 簡化版的 GameUIManager
class GameUIManager {
  constructor(gameManager) {
    this.gameManager = gameManager;
    this.lastUIUpdate = 0;
    this.uiUpdateInterval = 200;
  }

  updateUI() {
    const now = Date.now();
    if (now - this.lastUIUpdate < this.uiUpdateInterval) {
      return;
    }
    this.lastUIUpdate = now;

    const roundCounter = document.querySelector('.round-counter');
    if (roundCounter) {
      roundCounter.textContent = `Round ${this.gameManager.currentLevel} / 20`;
    }

    this.updatePlayerStats(this.gameManager.player);
  }

  updatePlayerStats(player) {
    if (!player) return;

    const heroName = document.querySelector('.hero .character-name');
    if (heroName) {
      heroName.textContent = `🔨 重錘英雄 (${Math.round(player.hp)}/${player.maxHp})`;
    }

    const stats = document.querySelectorAll('.stat-value');
    if (stats.length >= 4) {
      stats[0].textContent = player.getEffectiveAttack().toFixed(1);
      stats[1].textContent = player.getEffectiveAttackSpeed().toFixed(2);
      stats[2].textContent = player.getEffectiveArmor().toFixed(1);
      stats[3].textContent = (player.critChance * 100).toFixed(0) + '%';
    }

    this.updateHealthBar(player);
  }

  updateHealthBar(player) {
    const heroHealthFill = document.querySelector('.hero .health-fill');
    const heroHealthText = document.querySelector('.hero .health-text');
    if (heroHealthFill && heroHealthText) {
      const hpPercent = Math.max(0, (player.hp / player.maxHp) * 100);
      heroHealthFill.style.width = `${hpPercent}%`;
      heroHealthText.textContent = `${Math.round(player.hp)} / ${player.maxHp}`;
    }
  }

  updateEnemyDisplay(enemy) {
    if (!enemy) return;

    const enemyName = document.querySelector('.enemy .character-name');
    if (enemyName) {
      enemyName.textContent = `${enemy.emoji} ${enemy.getTypeName()} 攻擊${enemy.attack}`;
    }

    const enemyHealthText = document.querySelector('.enemy .health-text');
    if (enemyHealthText) {
      enemyHealthText.textContent = `${enemy.hp} / ${enemy.maxHp}`;
    }

    const enemyHealthFill = document.querySelector('.enemy .health-fill');
    if (enemyHealthFill) {
      enemyHealthFill.style.width = '100%';
    }
  }

  resetBaseUI() {
    const roundCounter = document.querySelector('.round-counter');
    if (roundCounter) {
      roundCounter.textContent = 'Round 1 / 20';
    }

    const heroHealthFill = document.querySelector('.hero .health-fill');
    const heroHealthText = document.querySelector('.hero .health-text');
    if (heroHealthFill && heroHealthText) {
      heroHealthFill.style.width = '100%';
      heroHealthText.textContent = '100 / 100';
    }
  }
}

// 簡化版的 OverlayManager
class OverlayManager {
  constructor(gameManager) {
    this.gameManager = gameManager;
  }

  clearAllOverlays() {
    const overlaySelectors = [
      '#deathSummaryOverlay',
      '#levelUpOverlay', 
      '#eventOverlay',
      '#pauseOverlay',
      '[class*="overlay"]',
      '[class*="screen"]'
    ];

    overlaySelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (element.parentNode) {
          element.remove();
        }
      });
    });
  }

  showBattleResults(battleStats, player, displayTime = 0) {
    // 簡化實現 - 只顯示基本信息
    console.log('⚔️ 戰鬥勝利！');
  }

  showGameOverScreen(currentLevel, player, diamonds) {
    // 簡化實現
    console.log(`🎯 遊戲結束！關卡: ${currentLevel}, 鑽石: ${diamonds}`);
  }
}

// 簡化版的 ProgressionSystem
class ProgressionSystem {
  constructor(gameManager) {
    this.gameManager = gameManager;
    this.isShowingLevelUpChoice = false;
  }

  resetProgressionState() {
    this.isShowingLevelUpChoice = false;
  }

  showLevelUpChoice(currentLevel, goldReward) {
    this.isShowingLevelUpChoice = true;
    
    // 使用原有的升級系統
    import('../data/upgradeRewards.js').then(module => {
      const upgradeOptions = module.generateUpgradeOptions(currentLevel);
      this.createUpgradeOverlay(currentLevel, goldReward, upgradeOptions);
    }).catch(error => {
      console.error('升級選項載入失敗:', error);
      // 直接跳到下一關
      this.isShowingLevelUpChoice = false;
      setTimeout(() => {
        this.gameManager.currentLevel++;
        this.gameManager.nextLevel();
      }, 300);
    });
  }

  createUpgradeOverlay(currentLevel, goldReward, upgradeOptions) {
    // 使用原有的升級選擇邏輯...
    console.log('顯示升級選擇...');
    
    // 暫時自動選擇第一個選項
    setTimeout(() => {
      this.isShowingLevelUpChoice = false;
      this.gameManager.currentLevel++;
      this.gameManager.nextLevel();
    }, 1000);
  }
}

// 簡化版的 DeathSystem
class DeathSystem {
  constructor(gameManager) {
    this.gameManager = gameManager;
    this.inheritedBadges = [];
  }

  handleInheritedBadges(player) {
    // 簡化實現
    console.log('處理繼承徽章...');
  }

  showDeathSummary(player, currentLevel, battleStats) {
    // 簡化實現 - 直接重新開始
    setTimeout(() => {
      this.gameManager.resetGame();
    }, 2000);
  }

  restartWithInheritance() {
    this.gameManager.resetGame();
  }

  restartWithoutInheritance() {
    this.inheritedBadges = [];
    this.gameManager.resetGame();
  }
}

// 簡化版的 RewardSystem
class RewardSystem {
  constructor(gameManager) {
    this.gameManager = gameManager;
    this.gold = 0;
    this.diamonds = 0;
  }

  giveStartingBadge(player) {
    try {
      if (!player || !player.equipBadge) {
        console.error('❌ Player not initialized or missing equipBadge method');
        return;
      }

      const hammerBadge = {
        key: 'hammerMastery',
        name: '重錘精通',
        description: '每次攻擊有25%機率造成150%傷害並眩暈敵人',
        icon: '🔨',
        effect: { hammerMastery: true },
        rarity: 'legendary',
        cost: 0
      };
      
      player.equipBadge(hammerBadge);
      console.log('🔨 獲得開局徽章: 重錘精通');
      
    } catch (error) {
      console.error('❌ giveStartingBadge 錯誤:', error);
    }
  }

  addGold(amount) {
    this.gold += amount;
    console.log(`💰 獲得金幣: +${amount}，總金幣: ${this.gold}`);
  }

  addDiamonds(amount) {
    this.diamonds += amount;
    console.log(`💎 獲得鑽石: +${amount}，總鑽石: ${this.diamonds}`);
  }

  calculateGoldReward(level) {
    let goldReward = 1;
    if (level === 20) {
      goldReward = 5;
    } else if (level % 5 === 0) {
      goldReward = 2;
    }

    const interestBonus = Math.min(3, Math.floor(this.gold / 10));
    if (interestBonus > 0) {
      goldReward += interestBonus;
    }

    return goldReward;
  }
}

// 簡化版的 ErrorHandler
class ErrorHandler {
  constructor(gameManager) {
    this.gameManager = gameManager;
  }

  showInitializationError(error) {
    console.error('❌ 遊戲初始化錯誤:', error);
    
    // 簡化的錯誤顯示
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 0, 0, 0.9);
      color: white;
      padding: 30px;
      border-radius: 15px;
      text-align: center;
      z-index: 9999;
      font-family: Arial, sans-serif;
      max-width: 500px;
      width: 90%;
    `;
    
    errorDiv.innerHTML = `
      <h2>🚨 遊戲初始化錯誤</h2>
      <p><strong>錯誤:</strong> ${error.message}</p>
      <button onclick="location.reload()" style="
        padding: 10px 20px;
        background: white;
        color: red;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        margin-top: 15px;
      ">🔄 重新載入遊戲</button>
    `;
    
    document.body.appendChild(errorDiv);
  }
}

export default GameManager;