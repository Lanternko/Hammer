// src/game/GameManager.js - 重構精簡版
import Player from './Player.js';
import Enemy from './Enemy.js';
import BattleSystem from '../systems/BattleSystem.js';
import EventSystem from '../systems/EventSystem.js';
import { selectEnemyType } from '../data/Enemies.js';

// 新的模組化導入
import GameUIManager from '../ui/GameUIManager.js';
import OverlayManager from '../ui/OverlayManager.js';
import ProgressionSystem from '../systems/ProgressionSystem.js';
import DeathSystem from '../systems/DeathSystem.js';
import RewardSystem from '../systems/RewardSystem.js';
import ErrorHandler from '../utils/ErrorHandler.js';

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
    
    // 🔧 模組化系統
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

export default GameManager;