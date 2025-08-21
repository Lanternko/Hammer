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
    
    // 保存戰鬥速度設定
    this.battleSpeed = 1; // 預設1倍速
    
    // 🔧 模組化系統 - 先內嵌實現，避免import錯誤
    this.uiManager = new GameUIManager(this);
    this.overlayManager = new OverlayManager(this);
    this.progressionSystem = new ProgressionSystem(this);
    this.deathSystem = new DeathSystem(this);
    this.rewardSystem = new RewardSystem(this);
    this.errorHandler = new ErrorHandler(this);
    
    this.initializeAfterLoad();
  }

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
    
    // 縮短戰鬥結果顯示時間到3秒
    if (battleStats && this.enhancedUI) {
      this.enhancedUI.showBattleResults(battleStats, this.player, 3000);
    }
    
    if (!won) {
      console.log('💀 玩家失敗，遊戲結束');
      return this.endGame();
    }

    // 計算獎勵
    const goldReward = this.rewardSystem.calculateGoldReward(this.currentLevel);
    this.rewardSystem.addGold(goldReward);
    
    // 回復血量
    this.player.hp = this.player.maxHp;
    console.log('💚 血量已回滿');

    // 顯示升級選擇
    setTimeout(() => {
      this.showLevelUpChoice(goldReward);
    }, 1000);
  }

  showLevelUpChoice(goldReward) {
    // 使用新的升級獎勵系統
    const upgradeOptions = generateUpgradeOptions(this.currentLevel);
    
    // 創建升級選擇界面
    const upgradeDiv = document.createElement('div');
    upgradeDiv.id = 'levelUpOverlay';
    upgradeDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    `;

    upgradeDiv.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #2a2a40 0%, #1a1a2e 100%);
        border: 2px solid #4ecdc4;
        border-radius: 20px;
        padding: 30px;
        max-width: 800px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
      ">
        <h2 style="color: #4ecdc4; margin-bottom: 10px; font-size: 24px;">
          🎉 關卡 ${this.currentLevel} 完成！
        </h2>
        <p style="color: #ffd700; margin-bottom: 20px; font-size: 18px;">
          💰 +${goldReward} 金幣 | 💚 血量回滿
        </p>
        <h3 style="color: #fff; margin-bottom: 20px;">選擇一個升級獎勵（三選一）：</h3>
        <div style="display: flex; gap: 20px; justify-content: center; margin-bottom: 20px;">
          ${upgradeOptions.map((option, index) => `
            <div class="upgrade-option" data-index="${index}" style="
              flex: 1;
              max-width: 250px;
              padding: 20px;
              background: rgba(78, 205, 196, 0.1);
              border: 2px solid #4ecdc4;
              border-radius: 12px;
              cursor: pointer;
              transition: all 0.3s ease;
              text-align: center;
            ">
              <div style="font-size: 30px; margin-bottom: 15px;">
                ${option.icon}
              </div>
              <div style="color: #4ecdc4; font-weight: bold; font-size: 18px; margin-bottom: 5px;">
                ${option.name}
              </div>
              <div style="color: #ccc; font-size: 14px; line-height: 1.4; margin-bottom: 10px;">
                ${option.description}
              </div>
              <div style="color: #ffd700; font-size: 12px; font-weight: bold;">
                詳細效果：${this.getUpgradeEffectDescription(option)}
              </div>
              <div style="
                margin-top: 10px;
                padding: 5px 10px;
                background: ${this.getRarityColor(option.rarity)};
                color: white;
                border-radius: 15px;
                font-size: 12px;
                font-weight: bold;
              ">
                ${this.getRarityText(option.rarity)}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    document.body.appendChild(upgradeDiv);

    // 綁定點擊事件
    document.querySelectorAll('.upgrade-option').forEach((option, index) => {
      option.addEventListener('click', () => {
        applyUpgradeToPlayer(this.player, upgradeOptions[index]);
        upgradeDiv.remove();
        
        // 檢查是否該給徽章
        this.checkForBadgeReward();
        
        // 繼續下一關
        setTimeout(() => {
          this.currentLevel++;
          this.nextLevel();
        }, 500); // 縮短延遲
      });

      option.addEventListener('mouseenter', () => {
        option.style.transform = 'scale(1.05)';
        option.style.boxShadow = '0 8px 25px rgba(78, 205, 196, 0.4)';
      });

      option.addEventListener('mouseleave', () => {
        option.style.transform = 'scale(1)';
        option.style.boxShadow = 'none';
      });
    });
  }

  // 修復：獲取升級效果詳細描述
  getUpgradeEffectDescription(upgrade) {
    const currentValue = this.getCurrentPlayerValue(upgrade.type);
    let newValue;
    
    if (upgrade.isPercentage) {
      newValue = Math.floor(currentValue * (1 + upgrade.value));
      return `${Math.floor(currentValue)} → ${newValue} (+${(upgrade.value * 100).toFixed(0)}%)`;
    } else {
      if (upgrade.type === 'critChance') {
        // 暴擊率特殊處理：顯示百分比
        const currentPercent = (currentValue * 100).toFixed(0);
        const newPercent = ((currentValue + upgrade.value) * 100).toFixed(0);
        return `${currentPercent}% → ${newPercent}% (+${(upgrade.value * 100).toFixed(0)}%)`;
      } else if (upgrade.type === 'attackSpeed') {
        // 攻速保留小數點
        newValue = (currentValue + upgrade.value).toFixed(2);
        return `${currentValue.toFixed(2)} → ${newValue} (+${upgrade.value.toFixed(2)})`;
      } else {
        newValue = Math.floor(currentValue + upgrade.value);
        return `${Math.floor(currentValue)} → ${newValue} (+${upgrade.value})`;
      }
    }
  }

  getCurrentPlayerValue(type) {
    switch(type) {
      case 'attack': return this.player.getEffectiveAttack();
      case 'maxHp': return this.player.maxHp;
      case 'armor': return this.player.getEffectiveArmor();
      case 'attackSpeed': return this.player.getEffectiveAttackSpeed();
      case 'critChance': return this.player.critChance;
      case 'flatReduction': return this.player.flatReduction;
      case 'lifesteal': return this.player.lifesteal || 0;
      default: return 0;
    }
  }

  getRarityColor(rarity) {
    switch(rarity) {
      case 'common': return '#A0A0A0';
      case 'uncommon': return '#4CAF50';
      case 'rare': return '#2196F3';
      case 'epic': return '#9C27B0';
      case 'legendary': return '#FF9800';
      default: return '#FFFFFF';
    }
  }

  getRarityText(rarity) {
    switch(rarity) {
      case 'common': return '普通';
      case 'uncommon': return '罕見';
      case 'rare': return '稀有';
      case 'epic': return '史詩';
      case 'legendary': return '傳說';
      default: return '';
    }
  }

  giveStartingBadge() {
    // 開局給重錘徽章
    const hammerBadge = {
      key: 'hammerMastery',
      name: '重錘精通',
      description: '每次攻擊有25%機率造成150%傷害並眩暈敵人1秒',
      icon: '🔨',
      effect: { hammerMastery: true },
      rarity: 'legendary'
    };
    
    this.player.equipBadge(hammerBadge);
    console.log('🔨 獲得開局徽章: 重錘精通');
  }

  checkForBadgeReward() {
    // 每5關給一個徽章 (第5, 10, 15, 20關)
    if (this.currentLevel % 5 === 0) {
      this.giveMilestoneBadge();
    }
  }

  giveMilestoneBadge() {
    const milestoneBadges = [
      {
        key: 'hammerStorm',
        name: '重錘風暴',
        description: '重錘精通觸發時，下次攻擊必定暴擊',
        icon: '🌪️',
        effect: { hammerStorm: true },
        rarity: 'legendary'
      },
      {
        key: 'hammerShield',
        name: '重錘護盾',
        description: '重錘精通觸發時，獲得10點護甲持續5秒',
        icon: '🛡️',
        effect: { hammerShield: true },
        rarity: 'epic'
      },
      {
        key: 'hammerHeal',
        name: '重錘恢復',
        description: '重錘精通觸發時，回復15點生命值',
        icon: '💚',
        effect: { hammerHeal: true },
        rarity: 'epic'
      },
      {
        key: 'hammerFury',
        name: '重錘狂怒',
        description: '重錘精通觸發時，攻擊速度+50%持續3秒',
        icon: '🔥',
        effect: { hammerFury: true },
        rarity: 'legendary'
      }
    ];

    const milestoneIndex = (this.currentLevel / 5) - 1;
    const badge = milestoneBadges[milestoneIndex] || milestoneBadges[0];
    
    this.player.equipBadge(badge);
    
    // 顯示徽章獲得動畫
    this.showBadgeReward(badge);
  }

  showBadgeReward(badge) {
    const badgeDiv = document.createElement('div');
    badgeDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #FFD700, #FFA500);
      color: white;
      padding: 30px;
      border-radius: 20px;
      text-align: center;
      z-index: 2000;
      box-shadow: 0 20px 40px rgba(255, 215, 0, 0.4);
      animation: badgePulse 0.6s ease-out;
    `;

    badgeDiv.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 15px;">
        ${badge.icon}
      </div>
      <h2 style="font-size: 24px; margin-bottom: 10px;">
        里程碑獎勵！
      </h2>
      <h3 style="font-size: 20px; margin-bottom: 10px;">
        ${badge.name}
      </h3>
      <p style="font-size: 16px; opacity: 0.9;">
        ${badge.description}
      </p>
    `;

    // 添加動畫
    const style = document.createElement('style');
    style.textContent = `
      @keyframes badgePulse {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.1); }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(badgeDiv);

    // 3秒後移除
    setTimeout(() => {
      if (badgeDiv.parentNode) {
        badgeDiv.remove();
      }
      if (style.parentNode) {
        style.remove();
      }
    }, 3000);

    console.log(`🎁 獲得里程碑徽章: ${badge.name}`);
  }

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

    // 更新統計面板
    const stats = document.querySelectorAll('.stat-value');
    if (stats.length >= 4) {
      stats[0].textContent = this.player.getEffectiveAttack().toFixed(1);
      stats[1].textContent = this.player.getEffectiveAttackSpeed().toFixed(2);
      stats[2].textContent = this.player.getEffectiveArmor().toFixed(1);
      stats[3].textContent = (this.player.critChance * 100).toFixed(0) + '%';
    }

    // 更新玩家血條
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

  // 縮短戰鬥結果顯示時間
  showBattleResults(battleStats, player, displayTime = 3000) {
    const resultsDiv = document.createElement('div');
    resultsDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 0, 0, 0.9);
      color: white;
      padding: 30px;
      border-radius: 15px;
      text-align: center;
      z-index: 1500;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    `;

    const battleDuration = (Date.now() - battleStats.startTime) / 1000;
    const avgDamage = battleStats.playerAttackCount > 0 ? 
      (battleStats.playerTotalDamage / battleStats.playerAttackCount) : 0;
    const avgDamageTaken = battleStats.enemyAttackCount > 0 ? 
      (battleStats.playerDamageReceived / battleStats.enemyAttackCount) : 0;
    const critRate = battleStats.playerAttackCount > 0 ? 
      (battleStats.critCount / battleStats.playerAttackCount * 100) : 0;
    const hammerRate = battleStats.playerAttackCount > 0 ? 
      (battleStats.hammerProcCount / battleStats.playerAttackCount * 100) : 0;

    resultsDiv.innerHTML = `
      <h2 style="color: #4ecdc4; margin-bottom: 20px;">⚔️ 戰鬥總結</h2>
      <div style="text-align: left; margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 15px;">
        <div>⏱️ 戰鬥時長: <span style="color: #ffd700; font-weight: bold;">${battleDuration.toFixed(1)}秒</span></div>
        <div>❤️ 剩餘血量: <span style="color: #ff6b6b; font-weight: bold;">${player.hp.toFixed(1)}/${player.maxHp}</span></div>
        <div>🗡️ 攻擊次數: <span style="color: #ffd700; font-weight: bold;">${battleStats.playerAttackCount}</span></div>
        <div>📊 平均傷害: <span style="color: #ffd700; font-weight: bold;">${avgDamage.toFixed(1)}</span></div>
        <div>💥 暴擊率: <span style="color: #ff6b6b; font-weight: bold;">${critRate.toFixed(1)}%</span></div>
        <div>🔨 重錘率: <span style="color: #ff6b6b; font-weight: bold;">${hammerRate.toFixed(1)}%</span></div>
        <div>🛡️ 受擊次數: <span style="color: #ccc; font-weight: bold;">${battleStats.enemyAttackCount}</span></div>
        <div>📉 平均受傷: <span style="color: #ccc; font-weight: bold;">${avgDamageTaken.toFixed(1)}</span></div>
      </div>
      <button onclick="this.parentElement.remove()" style="
        background: #4ecdc4;
        color: white;
        border: none;
        padding: 12px 25px;
        border-radius: 10px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        transition: background 0.3s ease;
      " 
      onmouseover="this.style.background='#45b7b8'" 
      onmouseout="this.style.background='#4ecdc4'">繼續 (${(displayTime/1000).toFixed(0)}秒後自動關閉)</button>
    `;

    document.body.appendChild(resultsDiv);

    // 倒數計時
    let timeLeft = displayTime / 1000;
    const button = resultsDiv.querySelector('button');
    const countdown = setInterval(() => {
      timeLeft--;
      if (timeLeft > 0) {
        button.textContent = `繼續 (${timeLeft}秒後自動關閉)`;
      } else {
        clearInterval(countdown);
        button.textContent = '繼續';
      }
    }, 1000);

    // 縮短自動關閉時間
    setTimeout(() => {
      if (resultsDiv.parentNode) {
        resultsDiv.remove();
      }
      clearInterval(countdown);
    }, displayTime);
  }
}

export default GameManager;