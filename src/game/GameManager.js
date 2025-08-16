// src/game/GameManager.js - 修復版本
import Player from './Player.js';
import Enemy from './Enemy.js';
import BattleSystem from '../systems/BattleSystem.js';
import EventSystem from '../systems/EventSystem.js';
import { selectEnemyType } from '../data/Enemies.js';
import { generateUpgradeOptions, applyUpgradeToPlayer } from '../data/upgradeRewards.js';

class GameManager {
  constructor() {
    console.log('🏗️ GameManager constructor called');
    
    this.currentLevel = 1;
    this.player = null;
    this.enemy = null;
    this.state = 'battle';
    this.gold = 0;
    this.diamonds = 0;
    this.battleSystem = null;
    this.eventSystem = null;
    
    this.battleSpeed = 1;
    this.isPaused = false;
    
    this.inheritedBadges = [];
    this.maxInheritedBadges = 1;
    this.failureCount = 0;
    
    // 🔧 修復: 控制UI更新頻率，減少閃爍
    this.lastUIUpdate = 0;
    this.uiUpdateInterval = 200; // 200ms更新一次，減少閃爍
    
    // 🔧 修復: 等級升級狀態控制
    this.isShowingLevelUpChoice = false;
    
    this.initializeAfterLoad();
  }

  async initializeAfterLoad() {
    try {
      await this.waitForModules();
      
      this.player = new Player();
      this.eventSystem = new EventSystem(this);
      this.enhancedUI = new EnhancedUIManager();
      
      this.giveStartingBadgeSafe();
      
      console.log('✅ GameManager 初始化完成');
      
    } catch (error) {
      console.error('❌ GameManager 初始化失敗:', error);
      this.showInitializationError(error);
    }
  }

  async waitForModules() {
    return new Promise((resolve) => {
      const checkModules = () => {
        if (typeof Player !== 'undefined' && 
            typeof EventSystem !== 'undefined' &&
            typeof EnhancedUIManager !== 'undefined') {
          resolve();
        } else {
          setTimeout(checkModules, 100);
        }
      };
      checkModules();
    });
  }

  showInitializationError(error) {
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
      <h2 style="margin-bottom: 15px;">🚨 遊戲初始化錯誤</h2>
      <p style="margin-bottom: 15px;">錯誤信息: ${error.message}</p>
      <p style="margin-bottom: 20px; font-size: 14px; opacity: 0.9;">
        這通常是因為模組載入順序問題或依賴缺失。
      </p>
      <button onclick="location.reload()" style="
        padding: 10px 20px;
        background: white;
        color: red;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
        font-size: 16px;
      ">🔄 重新載入遊戲</button>
    `;
    
    document.body.appendChild(errorDiv);
  }

  togglePause() {
    if (this.battleSystem) {
      this.battleSystem.togglePause();
    }
  }

  giveStartingBadgeSafe() {
    try {
      if (!this.player) {
        console.error('❌ Player not initialized');
        return;
      }

      if (!this.player.badges) {
        this.player.badges = [];
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
      
      if (this.player.equipBadge && typeof this.player.equipBadge === 'function') {
        this.player.equipBadge(hammerBadge);
        console.log('🔨 獲得開局徽章: 重錘精通');
      } else {
        console.error('❌ Player.equipBadge method not found');
      }

      this.handleInheritedBadges();
      
    } catch (error) {
      console.error('❌ giveStartingBadge 錯誤:', error);
    }
  }

  handleInheritedBadges() {
    try {
      if (this.inheritedBadges && this.inheritedBadges.length > 0) {
        this.inheritedBadges.forEach(badge => {
          if (badge && this.player && this.player.equipBadge) {
            this.player.equipBadge(badge);
            console.log(`🎁 繼承徽章: ${badge.name}`);
            this.showInheritanceNotification(badge);
          }
        });
        
        this.inheritedBadges = [];
      }
    } catch (error) {
      console.error('❌ 處理繼承徽章錯誤:', error);
    }
  }

  startGame() {
    try {
      if (!this.player) {
        console.error('❌ 無法開始遊戲：玩家未初始化');
        return;
      }
      
      console.log('🎮 遊戲啟動 - 準備第1關');
      this.updateUI();
      this.nextLevel();
      
    } catch (error) {
      console.error('❌ 遊戲啟動錯誤:', error);
      this.showInitializationError(error);
    }
  }

  nextLevel() {
    // 🔧 修復: 防止在顯示升級選擇時進入下一關
    if (this.isShowingLevelUpChoice) {
      console.log('⏳ 等待升級選擇完成...');
      return;
    }

    if (this.currentLevel > 20) {
      return this.endGame();
    }

    console.log(`🔄 進入關卡 ${this.currentLevel}`);

    if ([3, 8, 13, 18].includes(this.currentLevel)) {
      this.triggerEvent();
      return;
    }

    const enemyType = selectEnemyType(this.currentLevel);
    this.enemy = new Enemy(this.currentLevel, enemyType);
    
    console.log(`⚔️ 關卡 ${this.currentLevel}: 遭遇 ${this.enemy.getDisplayName()}`);
    console.log(`📊 敵人屬性: HP ${this.enemy.hp}/${this.enemy.maxHp}, 攻擊 ${this.enemy.attack}, 攻速 ${this.enemy.attackSpeed}, 防禦 ${this.enemy.defense}`);
    
    this.updateUI();
    this.updateEnemyDisplay();
    
    if (this.battleSystem) {
      this.battleSystem.stop();
    }
    
    this.battleSystem = new BattleSystem(this.player, this.enemy, this);
    this.battleSystem.setBattleSpeed(this.battleSpeed);
    this.battleSystem.start();
  }

  setBattleSpeed(speed) {
    this.battleSpeed = speed;
    if (this.battleSystem) {
      this.battleSystem.setBattleSpeed(speed);
    }
    console.log(`🎛️ 全局戰鬥速度設定為 ${speed}x`);
  }

  endBattle(won, battleStats = null) {
    console.log(`⚔️ 戰鬥結束 - ${won ? '✅ 勝利' : '❌ 失敗'}`);
    
    if (!won) {
      console.log('💀 玩家失敗，遊戲結束');
      this.showDeathSummary(battleStats);
      return;
    }

    // 🔧 修復: 縮短戰鬥結果顯示時間
    if (battleStats && this.enhancedUI) {
      this.enhancedUI.showBattleResults(battleStats, this.player, 2000);
    }

    let goldReward = 1;
    if (this.currentLevel === 20) {
      goldReward = 5;
    } else if (this.currentLevel % 5 === 0) {
      goldReward = 2;
    }
    
    this.gold += goldReward;
    console.log(`💰 關卡 ${this.currentLevel} 完成！獲得金幣: ${goldReward}，總金幣: ${this.gold}`);

    this.player.hp = this.player.maxHp;
    console.log('💚 血量已回滿');

    // 🔧 修復: 確保等級升級選擇不會被跳過
    setTimeout(() => {
      if (!this.isShowingLevelUpChoice) {
        this.showLevelUpChoice(goldReward);
      }
    }, 1000);
  }

  showDeathSummary(battleStats) {
    // 🔧 修復: 確保先清理所有現有覆蓋層
    this.clearAllOverlays();

    const deathDiv = document.createElement('div');
    deathDiv.id = 'deathSummaryOverlay';
    deathDiv.className = 'death-screen';
    deathDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000;
    `;

    const inheritableBadges = this.player.badges.filter(badge => 
      badge.key !== 'hammerMastery' && badge.cost > 0
    );

    const hasInheritableBadges = inheritableBadges.length > 0;
    
    const contentPanel = document.createElement('div');
    contentPanel.style.cssText = `
      background: linear-gradient(135deg, #8B0000, #4B0000);
      padding: 40px;
      border-radius: 20px;
      text-align: center;
      color: white;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
      border: 2px solid #ff6b6b;
      max-width: 800px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
    `;

    contentPanel.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 20px;">💀</div>
      <h2 style="font-size: 32px; margin-bottom: 15px; color: #ff6b6b;">征程結束</h2>
      <p style="font-size: 20px; margin-bottom: 20px;">你在第 ${this.currentLevel} 關倒下了</p>
      
      <div style="background: rgba(0, 0, 0, 0.5); padding: 15px; border-radius: 15px; margin-bottom: 20px;">
        <h4 style="color: #ffd700; margin-bottom: 10px;">🎯 戰敗分析</h4>
        <div style="font-size: 14px; line-height: 1.6; text-align: left;">
          ${this.getDeathAnalysis()}
        </div>
      </div>
      
      ${hasInheritableBadges ? `
        <div style="background: rgba(255, 215, 0, 0.1); border: 1px solid rgba(255, 215, 0, 0.3); border-radius: 15px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #ffd700; margin-bottom: 15px;">🎁 選擇一個徽章帶到下一輪</h3>
          <p style="font-size: 14px; opacity: 0.9; margin-bottom: 15px;">失敗並不可怕，選擇一個徽章開始新的征程！</p>
          <div id="inheritanceBadges" style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
            ${this.renderInheritanceBadges(inheritableBadges)}
          </div>
        </div>
      ` : `
        <div style="background: rgba(255, 107, 107, 0.1); border: 1px solid rgba(255, 107, 107, 0.3); border-radius: 15px; padding: 15px; margin-bottom: 20px;">
          <p style="color: #ff6b6b; font-size: 16px; margin: 0;">
            💡 通過商店購買徽章，失敗時可以繼承到下一輪！
          </p>
        </div>
      `}
      
      <div style="font-size: 16px; opacity: 0.9; margin-bottom: 20px;">
        <p>💎 本輪獲得鑽石: ${Math.floor(this.currentLevel / 5)}</p>
        <p>🎖️ 擁有徽章: ${this.player.badges.length}</p>
        <p>💰 剩餘金幣: ${this.gold}</p>
      </div>
      
      ${!hasInheritableBadges ? `
        <button onclick="window.gameManager.restartWithoutInheritance()" style="
          background: #ff6b6b;
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 18px;
          font-weight: bold;
          transition: background 0.3s ease;
        " 
        onmouseover="this.style.background='#ff5252'" 
        onmouseout="this.style.background='#ff6b6b'">
          🔄 重新開始
        </button>
      ` : ''}
    `;

    deathDiv.appendChild(contentPanel);
    document.body.appendChild(deathDiv);

    if (hasInheritableBadges) {
      this.bindInheritanceEvents(inheritableBadges, deathDiv);
    }
  }

  // 🔧 修復: 新增清理所有覆蓋層的函數
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

  renderInheritanceBadges(badges) {
    return badges.map((badge, index) => `
      <div class="inheritance-badge" data-index="${index}" style="
        flex: 0 0 auto;
        min-width: 200px;
        padding: 15px;
        background: rgba(255, 215, 0, 0.1);
        border: 2px solid rgba(255, 215, 0, 0.3);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: center;
      ">
        <div style="font-size: 24px; margin-bottom: 8px;">
          ${badge.icon}
        </div>
        <div style="color: #ffd700; font-weight: bold; font-size: 14px; margin-bottom: 5px;">
          ${badge.name}
        </div>
        <div style="color: #ccc; font-size: 12px; line-height: 1.3;">
          ${badge.description}
        </div>
        <div style="
          margin-top: 8px;
          padding: 4px 8px;
          background: ${this.getRarityColor(badge.rarity)};
          color: white;
          border-radius: 10px;
          font-size: 11px;
          font-weight: bold;
        ">
          ${this.getRarityText(badge.rarity)}
        </div>
      </div>
    `).join('');
  }

  bindInheritanceEvents(badges, deathDiv) {
    document.querySelectorAll('.inheritance-badge').forEach((element, index) => {
      element.addEventListener('click', () => {
        this.selectInheritanceBadge(badges[index], deathDiv);
      });

      element.addEventListener('mouseenter', () => {
        element.style.transform = 'scale(1.05)';
        element.style.borderColor = '#ffd700';
        element.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.4)';
      });

      element.addEventListener('mouseleave', () => {
        element.style.transform = 'scale(1)';
        element.style.borderColor = 'rgba(255, 215, 0, 0.3)';
        element.style.boxShadow = 'none';
      });
    });
  }

  selectInheritanceBadge(badge, deathDiv) {
    this.inheritedBadges = [badge];
    
    deathDiv.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #2ECC71, #27AE60);
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        color: white;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
        animation: confirmPulse 0.6s ease-out;
      ">
        <div style="font-size: 48px; margin-bottom: 20px;">
          ${badge.icon}
        </div>
        <h2 style="font-size: 24px; margin-bottom: 15px;">
          ✅ 已選擇繼承
        </h2>
        <h3 style="font-size: 20px; margin-bottom: 15px; color: #ffd700;">
          ${badge.name}
        </h3>
        <p style="font-size: 16px; opacity: 0.9; margin-bottom: 20px;">
          下一輪將自動擁有此徽章！
        </p>
        <button onclick="window.gameManager.restartWithInheritance()" style="
          background: #4CAF50;
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 18px;
          font-weight: bold;
          transition: background 0.3s ease;
        " 
        onmouseover="this.style.background='#45a049'" 
        onmouseout="this.style.background='#4CAF50'">
          🚀 開始新征程
        </button>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes confirmPulse {
        0% { transform: scale(0.8); opacity: 0; }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
      if (style.parentNode) {
        style.remove();
      }
    }, 1000);
  }

  restartWithInheritance() {
    // 🔧 修復: 確保完全清理覆蓋層
    this.clearAllOverlays();
    this.resetGame();
  }

  restartWithoutInheritance() {
    this.inheritedBadges = [];
    // 🔧 修復: 確保完全清理覆蓋層
    this.clearAllOverlays();
    this.resetGame();
  }

  getDeathAnalysis() {
    const analyses = [];
    
    if (this.enemy) {
      const enemyDPS = this.enemy.attack * this.enemy.attackSpeed;
      const playerDPS = this.player.getEffectiveAttack() * this.player.getEffectiveAttackSpeed();
      
      if (enemyDPS > playerDPS * 1.5) {
        analyses.push('• 敵人的 DPS 遠超過你，考慮提升攻擊力或攻速');
      }
      
      if (this.player.getEffectiveArmor() < this.enemy.attack * 0.5) {
        analyses.push('• 護甲不足以抵擋敵人攻擊，建議提升防禦');
      }
      
      if (this.player.flatReduction < 5) {
        analyses.push('• 固定減傷偏低，考慮購買相關徽章');
      }
      
      if (!this.player.hammerEffects.mastery) {
        analyses.push('• 缺少重錘精通，這是核心徽章');
      } else if (!this.player.hammerEffects.weight) {
        analyses.push('• 考慮購買重錘加重來提升觸發率');
      }
      
      if (this.player.lifesteal === 0) {
        analyses.push('• 沒有生命汲取，考慮購買吸血徽章');
      }
      
      if (this.currentLevel > 10 && this.player.badges.length < 4) {
        analyses.push('• 徽章數量不足，多利用商店強化');
      }
    }
    
    if (analyses.length === 0) {
      analyses.push('• 這是一場勢均力敵的戰鬥，運氣也很重要');
      analyses.push('• 嘗試不同的徽章組合或提升屬性');
    }
    
    return analyses.join('<br>');
  }

  // 在 showLevelUpChoice 方法中的修復版本
  showLevelUpChoice(goldReward) {
    // 🔧 修復: 設置升級選擇狀態，防止重複調用
    this.isShowingLevelUpChoice = true;

    // 🔧 修復: 安全的升級選項生成
    let upgradeOptions;
    try {
      upgradeOptions = generateUpgradeOptions(this.currentLevel);
      
      // 驗證生成的選項
      if (!upgradeOptions || upgradeOptions.length === 0) {
        throw new Error('升級選項生成失敗');
      }
      
      // 確保每個選項都有必要的屬性
      upgradeOptions = upgradeOptions.map((option, index) => ({
        id: option.id || `option_${index}`,
        name: option.name || '未知升級',
        icon: option.icon || '❓',
        description: option.description || '無描述',
        type: option.type || 'attack',
        value: option.value !== undefined ? option.value : 0.1,
        isPercentage: option.isPercentage !== undefined ? option.isPercentage : true,
        rarity: option.rarity || 'common'
      }));
      
      console.log('✅ 升級選項生成成功:', upgradeOptions);
      
    } catch (error) {
      console.error('❌ 升級選項生成錯誤:', error);
      
      // 🔧 備用選項
      upgradeOptions = [
        {
          id: 'backup_attack',
          name: '力量提升',
          icon: '💪',
          description: '攻擊力 +10%',
          type: 'attack',
          value: 0.1,
          isPercentage: true,
          rarity: 'common'
        },
        {
          id: 'backup_health',
          name: '生命提升',
          icon: '❤️',
          description: '最大生命值 +10%',
          type: 'maxHp',
          value: 0.1,
          isPercentage: true,
          rarity: 'common'
        },
        {
          id: 'backup_armor',
          name: '護甲提升',
          icon: '🛡️',
          description: '護甲值 +5',
          type: 'armor',
          value: 5,
          isPercentage: false,
          rarity: 'common'
        }
      ];
    }
    
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
                詳細效果：${this.getUpgradeEffectDescriptionSafe(option)}
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

    // 🔧 修復: 更安全的事件綁定
    const upgradeOptionElements = document.querySelectorAll('.upgrade-option');
    upgradeOptionElements.forEach((element, index) => {
      // 確保索引有效
      if (index >= 0 && index < upgradeOptions.length) {
        const option = upgradeOptions[index];
        
        element.addEventListener('click', () => {
          // 🔧 修復: 防止重複點擊和確保選項有效
          if (!this.isShowingLevelUpChoice || !option) {
            console.warn('⚠️ 升級選擇已處理或選項無效');
            return;
          }
          
          try {
            console.log(`🔧 嘗試應用升級: ${option.name}`, option);
            
            // 🔧 安全的升級應用
            applyUpgradeToPlayer(this.player, option);
            
            // 移除界面
            if (upgradeDiv.parentNode) {
              upgradeDiv.remove();
            }
            
            // 檢查徽章獎勵
            this.checkForBadgeReward();
            
            // 🔧 修復: 重置狀態並延遲進入下一關
            this.isShowingLevelUpChoice = false;
            
            setTimeout(() => {
              this.currentLevel++;
              this.nextLevel();
            }, 300);
            
          } catch (error) {
            console.error('❌ 應用升級錯誤:', error);
            
            // 即使出錯也要繼續遊戲
            if (upgradeDiv.parentNode) {
              upgradeDiv.remove();
            }
            this.isShowingLevelUpChoice = false;
            
            setTimeout(() => {
              this.currentLevel++;
              this.nextLevel();
            }, 300);
          }
        });

        element.addEventListener('mouseenter', () => {
          element.style.transform = 'scale(1.05)';
          element.style.boxShadow = '0 8px 25px rgba(78, 205, 196, 0.4)';
        });

        element.addEventListener('mouseleave', () => {
          element.style.transform = 'scale(1)';
          element.style.boxShadow = 'none';
        });
      }
    });
  }

  // 🔧 修復: 安全的升級效果描述
  getUpgradeEffectDescriptionSafe(upgrade) {
    try {
      if (!upgrade || !upgrade.type) {
        return '效果未知';
      }
      
      const currentValue = this.getCurrentPlayerValueSafe(upgrade.type);
      let newValue;
      
      if (upgrade.isPercentage) {
        newValue = currentValue * (1 + upgrade.value);
        
        if (upgrade.type === 'attackSpeed') {
          return `${currentValue.toFixed(2)} → ${newValue.toFixed(2)} (+${(upgrade.value * 100).toFixed(0)}%)`;
        } else {
          return `${Math.floor(currentValue)} → ${Math.floor(newValue)} (+${(upgrade.value * 100).toFixed(0)}%)`;
        }
      } else {
        // 固定值效果
        if (upgrade.type === 'critChance') {
          const currentPercent = (currentValue * 100).toFixed(0);
          const newPercent = ((currentValue + upgrade.value) * 100).toFixed(0);
          return `${currentPercent}% → ${newPercent}% (+${(upgrade.value * 100).toFixed(0)}%)`;
        } else if (upgrade.type === 'attackSpeed') {
          newValue = currentValue + upgrade.value;
          return `${currentValue.toFixed(2)} → ${newValue.toFixed(2)} (+${upgrade.value.toFixed(2)})`;
        } else if (upgrade.type === 'lifesteal') {
          newValue = currentValue + upgrade.value;
          return `${currentValue} → ${newValue} (+${upgrade.value})`;
        } else if (upgrade.type === 'flatReduction') {
          newValue = currentValue + upgrade.value;
          return `${currentValue} → ${newValue} (+${upgrade.value})`;
        } else if (upgrade.type === 'berserker') {
          return `解鎖狂戰士效果 (血量<50%時攻擊+${(upgrade.value * 100).toFixed(0)}%)`;
        } else if (upgrade.type === 'fortress') {
          if (upgrade.value && typeof upgrade.value === 'object') {
            const currentArmor = this.getCurrentPlayerValueSafe('armor');
            const currentFlatRed = this.getCurrentPlayerValueSafe('flatReduction');
            const newArmor = currentArmor + (upgrade.value.armor || 0);
            const newFlatRed = currentFlatRed + (upgrade.value.flatReduction || 0);
            return `護甲: ${currentArmor} → ${newArmor} (+${upgrade.value.armor || 0}), 固減: ${currentFlatRed} → ${newFlatRed} (+${upgrade.value.flatReduction || 0})`;
          }
          return '複合效果提升';
        } else {
          newValue = Math.floor(currentValue + upgrade.value);
          return `${Math.floor(currentValue)} → ${newValue} (+${upgrade.value})`;
        }
      }
    } catch (error) {
      console.error('❌ 獲取升級效果描述錯誤:', error);
      return '效果計算錯誤';
    }
  }

  // 🔧 修復: 安全的玩家數值獲取
  getCurrentPlayerValueSafe(type) {
    try {
      if (!this.player) {
        console.warn('⚠️ 玩家對象不存在');
        return 0;
      }
      
      switch(type) {
        case 'attack':
          return this.player.getEffectiveAttack ? this.player.getEffectiveAttack() : (this.player.attack || 20);
        case 'maxHp':
        case 'hp':
          return this.player.maxHp || 100;
        case 'armor':
          return this.player.getEffectiveArmor ? this.player.getEffectiveArmor() : (this.player.armor || 20);
        case 'attackSpeed':
          return this.player.getEffectiveAttackSpeed ? this.player.getEffectiveAttackSpeed() : (this.player.attackSpeed || 0.5);
        case 'critChance':
          return this.player.critChance || 0.1;
        case 'flatReduction':
          return this.player.flatReduction || 5;
        case 'lifesteal':
          return this.player.lifesteal || 0;
        default:
          console.warn(`⚠️ 未知的屬性類型: ${type}`);
          return 0;
      }
    } catch (error) {
      console.error('❌ 獲取玩家數值錯誤:', error);
      return 0;
    }
  }
  
  getUpgradeEffectDescription(upgrade) {
    const currentValue = this.getCurrentPlayerValue(upgrade.type);
    let newValue;
    
    if (upgrade.isPercentage) {
      newValue = currentValue * (1 + upgrade.value);
      
      if (upgrade.type === 'attackSpeed') {
        return `${currentValue.toFixed(2)} → ${newValue.toFixed(2)} (+${(upgrade.value * 100).toFixed(0)}%)`;
      } else {
        return `${Math.floor(currentValue)} → ${Math.floor(newValue)} (+${(upgrade.value * 100).toFixed(0)}%)`;
      }
    } else {
      if (upgrade.type === 'critChance') {
        const currentPercent = (currentValue * 100).toFixed(0);
        const newPercent = ((currentValue + upgrade.value) * 100).toFixed(0);
        return `${currentPercent}% → ${newPercent}% (+${(upgrade.value * 100).toFixed(0)}%)`;
      } else if (upgrade.type === 'attackSpeed') {
        newValue = currentValue + upgrade.value;
        return `${currentValue.toFixed(2)} → ${newValue.toFixed(2)} (+${upgrade.value.toFixed(2)})`;
      } else if (upgrade.type === 'lifesteal') {
        newValue = currentValue + upgrade.value;
        return `${currentValue} → ${newValue} (+${upgrade.value})`;
      } else if (upgrade.type === 'flatReduction') {
        newValue = currentValue + upgrade.value;
        return `${currentValue} → ${newValue} (+${upgrade.value})`;
      } else if (upgrade.type === 'berserker') {
        return `解鎖狂戰士效果 (血量<50%時攻擊+${(upgrade.value * 100).toFixed(0)}%)`;
      } else if (upgrade.type === 'fortress') {
        const currentArmor = this.player.getEffectiveArmor();
        const currentFlatRed = this.player.flatReduction;
        const newArmor = currentArmor + upgrade.value.armor;
        const newFlatRed = currentFlatRed + upgrade.value.flatReduction;
        return `護甲: ${currentArmor} → ${newArmor} (+${upgrade.value.armor}), 固減: ${currentFlatRed} → ${newFlatRed} (+${upgrade.value.flatReduction})`;
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

  checkForBadgeReward() {
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
    
    this.showMilestoneBadgeChoice(badge);
  }

  showMilestoneBadgeChoice(badge) {
    const badgeDiv = document.createElement('div');
    badgeDiv.style.cssText = `
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
      z-index: 2000;
    `;

    badgeDiv.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #FFD700, #FFA500);
        color: white;
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        box-shadow: 0 20px 40px rgba(255, 215, 0, 0.4);
        animation: badgePulse 0.6s ease-out;
        max-width: 500px;
        width: 90%;
      ">
        <div style="font-size: 48px; margin-bottom: 15px;">
          ${badge.icon}
        </div>
        <h2 style="font-size: 24px; margin-bottom: 10px;">
          🎉 里程碑獎勵！
        </h2>
        <h3 style="font-size: 20px; margin-bottom: 15px;">
          ${badge.name}
        </h3>
        <p style="font-size: 16px; opacity: 0.9; margin-bottom: 20px; line-height: 1.4;">
          ${badge.description}
        </p>
        <div style="
          margin-bottom: 20px;
          padding: 8px 15px;
          background: ${this.getRarityColor(badge.rarity)};
          color: white;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
          display: inline-block;
        ">
          ${this.getRarityText(badge.rarity)} 徽章
        </div>
        <button onclick="this.parentElement.parentElement.remove(); window.gameManager.acceptMilestoneBadge()" style="
          background: #4CAF50;
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 18px;
          font-weight: bold;
          transition: background 0.3s ease;
        " 
        onmouseover="this.style.background='#45a049'" 
        onmouseout="this.style.background='#4CAF50'">✅ 獲得徽章</button>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes badgePulse {
        0% { transform: scale(0.5); opacity: 0; }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(badgeDiv);
    
    this.pendingMilestoneBadge = badge;

    setTimeout(() => {
      if (style.parentNode) {
        style.remove();
      }
    }, 1000);
  }

  acceptMilestoneBadge() {
    if (this.pendingMilestoneBadge) {
      this.player.equipBadge(this.pendingMilestoneBadge);
      console.log(`🎁 獲得里程碑徽章: ${this.pendingMilestoneBadge.name}`);
      this.pendingMilestoneBadge = null;
    }
  }

  triggerEvent() {
    console.log(`🏪 觸發事件關卡 ${this.currentLevel}`);
    this.state = 'shop';
    this.eventSystem.generateShopEvent();
  }

  finishEvent() {
    this.state = 'battle';
    this.showLevelUpChoice(0);
  }

  endGame() {
    const diamonds = Math.floor(this.currentLevel / 5) + (this.currentLevel >= 20 ? 5 : 0);
    console.log(`🎯 遊戲結束！到達關卡: ${this.currentLevel}, 獲得鑽石: ${diamonds}`);
    this.diamonds += diamonds;
    
    this.showGameOverScreen();
    
    setTimeout(() => {
      this.resetGame();
    }, 8000);
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
    const badgeCount = this.player.badges.length;
    
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
          ${isVictory ? '重錘之王！' : '征程結束'}
        </h2>
        <p style="font-size: 20px; margin-bottom: 20px;">
          ${isVictory ? '你用重錘征服了所有敵人！' : `你在第 ${this.currentLevel} 關倒下了`}
        </p>
        <div style="font-size: 16px; opacity: 0.9; margin-bottom: 20px;">
          <p>💎 鑽石: ${Math.floor(this.currentLevel / 5)}</p>
          <p>🎖️ 徽章: ${badgeCount}</p>
          <p>💰 金幣: ${this.gold}</p>
        </div>
        <p style="font-size: 14px; margin-top: 20px; opacity: 0.7;">
          遊戲將在幾秒後重新開始...
        </p>
      </div>
    `;

    document.body.appendChild(gameOverDiv);

    setTimeout(() => {
      if (gameOverDiv.parentNode) {
        gameOverDiv.remove();
      }
    }, 7500);
  }

  resetGame() {
    console.log('🔄 無縫重新開始...');
    
    // 🔧 修復: 徹底清理所有狀態
    this.isShowingLevelUpChoice = false;
    
    if (this.battleSystem) {
      this.battleSystem.stop();
      this.battleSystem = null;
    }
    
    this.currentLevel = 1;
    this.player = new Player();
    this.enemy = null;
    this.state = 'battle';
    this.gold = 0;
    
    // 🔧 修復: 強力清理所有覆蓋層和浮動元素
    this.clearAllOverlays();
    this.clearFloatingElements();
    
    this.resetBaseUI();
    this.giveStartingBadge();
    
    this.updateUI();
    this.nextLevel();
    
    console.log('✅ 無縫重開完成！');
  }

  // 🔧 修復: 新增清理浮動元素的函數
  clearFloatingElements() {
    const floatingSelectors = [
      '.damage-indicator',
      '.floating-damage',
      '.inheritance-badge',
      '[class*="notification"]',
      '[class*="popup"]'
    ];

    floatingSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (element.parentNode) {
          element.remove();
        }
      });
    });
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

    const heroAttackFill = document.querySelector('.hero .attack-fill');
    if (heroAttackFill) {
      heroAttackFill.style.width = '0%';
    }

    const enemyName = document.querySelector('.enemy .character-name');
    if (enemyName) {
      enemyName.textContent = '👹 Loading...';
    }

    const enemyHealthFill = document.querySelector('.enemy .health-fill');
    const enemyHealthText = document.querySelector('.enemy .health-text');
    if (enemyHealthFill && enemyHealthText) {
      enemyHealthFill.style.width = '100%';
      enemyHealthText.textContent = '--- / ---';
    }

    const enemyAttackFill = document.querySelector('.enemy .attack-fill');
    if (enemyAttackFill) {
      enemyAttackFill.style.width = '0%';
    }
  }

  updateUI() {
    // 🔧 修復: 控制UI更新頻率
    const now = Date.now();
    if (now - this.lastUIUpdate < this.uiUpdateInterval) {
      return;
    }
    this.lastUIUpdate = now;

    const roundCounter = document.querySelector('.round-counter');
    if (roundCounter) {
      roundCounter.textContent = `Round ${this.currentLevel} / 20`;
    }

    this.updatePlayerStats();
  }

  updateEnemyDisplay() {
    if (!this.enemy) return;

    const enemyName = document.querySelector('.enemy .character-name');
    if (enemyName) {
      enemyName.textContent = `${this.enemy.emoji} ${this.enemy.getTypeName()} 攻擊${this.enemy.attack}`;
    }

    const enemyHealthText = document.querySelector('.enemy .health-text');
    if (enemyHealthText) {
      enemyHealthText.textContent = `${this.enemy.hp} / ${this.enemy.maxHp}`;
    }

    const enemyHealthFill = document.querySelector('.enemy .health-fill');
    if (enemyHealthFill) {
      enemyHealthFill.style.width = '100%';
    }

    const enemyAttackFill = document.querySelector('.enemy .attack-fill');
    if (enemyAttackFill) {
      enemyAttackFill.style.width = '0%';
    }
  }

  updatePlayerStats() {
    // 🔧 修復: 控制角色資訊更新頻率，減少閃爍
    const heroName = document.querySelector('.hero .character-name');
    if (heroName) {
      heroName.textContent = `🔨 重錘英雄 (${Math.round(this.player.hp)}/${this.player.maxHp})`;
    }

    const statsPanel = document.querySelector('.stats-panel');
    if (statsPanel) {
      const statRows = statsPanel.querySelectorAll('.stat-row');
      const hasFixedReduction = Array.from(statRows).some(row => 
        row.querySelector('.stat-label')?.textContent?.includes('Fixed Damage Reduction') ||
        row.querySelector('.stat-label')?.textContent?.includes('固定減傷')
      );
      
      if (!hasFixedReduction && statRows.length >= 4) {
        const newRow = document.createElement('div');
        newRow.className = 'stat-row';
        newRow.innerHTML = `
          <div class="stat-label">
            <span>🔰</span>
            固定減傷
          </div>
          <div class="stat-value">${this.player.flatReduction}</div>
        `;
        statsPanel.appendChild(newRow);
      }
    }

    const stats = document.querySelectorAll('.stat-value');
    if (stats.length >= 4) {
      stats[0].textContent = this.player.getEffectiveAttack().toFixed(1);
      stats[1].textContent = this.player.getEffectiveAttackSpeed().toFixed(2);
      stats[2].textContent = this.player.getEffectiveArmor().toFixed(1);
      stats[3].textContent = (this.player.critChance * 100).toFixed(0) + '%';
      
      if (stats[4]) {
        stats[4].textContent = this.player.flatReduction.toString();
      }
    }

    const heroHealthFill = document.querySelector('.hero .health-fill');
    const heroHealthText = document.querySelector('.hero .health-text');
    if (heroHealthFill && heroHealthText) {
      const hpPercent = Math.max(0, (this.player.hp / this.player.maxHp) * 100);
      heroHealthFill.style.width = `${hpPercent}%`;
      heroHealthText.textContent = `${Math.round(this.player.hp)} / ${this.player.maxHp}`;
    }

    if (this.enhancedUI) {
      this.enhancedUI.updateBuffDisplay(this.player);
    }
  }

  giveStartingBadge() {
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

    if (this.inheritedBadges.length > 0) {
      this.inheritedBadges.forEach(badge => {
        this.player.equipBadge(badge);
        console.log(`🎁 繼承徽章: ${badge.name}`);
        this.showInheritanceNotification(badge);
      });
      
      this.inheritedBadges = [];
    }
  }

  showInheritanceNotification(badge) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 50px;
      right: 50px;
      background: linear-gradient(135deg, #FFD700, #FFA500);
      color: white;
      padding: 20px;
      border-radius: 15px;
      box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
      z-index: 1000;
      animation: slideInRight 0.5s ease-out;
    `;

    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 15px;">
        <div style="font-size: 24px;">${badge.icon}</div>
        <div>
          <div style="font-weight: bold; margin-bottom: 5px;">🎁 繼承徽章</div>
          <div style="font-size: 14px;">${badge.name}</div>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.5s ease-out';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 500);
    }, 3000);

    if (!document.querySelector('#inheritanceAnimations')) {
      const style = document.createElement('style');
      style.id = 'inheritanceAnimations';
      style.textContent = `
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// 🔧 修復版增強UI管理器
class EnhancedUIManager {
  constructor() {
    this.createBuffDisplayArea();
    // 🔧 修復: 延遲創建且避免重複創建懸浮提示
    setTimeout(() => {
      this.createHoverTooltipsOnce();
    }, 3000);
  }

  createBuffDisplayArea() {
    // 🔧 修復: 調整z-index避免被遮住
    const buffPanel = document.createElement('div');
    buffPanel.id = 'buffPanel';
    buffPanel.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 15px;
      padding: 15px;
      color: white;
      min-width: 250px;
      max-height: 300px;
      overflow-y: auto;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      z-index: 150;
    `;

    buffPanel.innerHTML = `
      <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #4ecdc4; border-bottom: 1px solid rgba(78, 205, 196, 0.3); padding-bottom: 5px;">
        🔥 當前效果
      </div>
      <div id="buffList"></div>
    `;

    document.body.appendChild(buffPanel);
  }

  // 🔧 修復: 只創建一次懸浮提示，避免重複
  createHoverTooltipsOnce() {
    // 檢查是否已經創建過
    if (document.querySelector('[data-tooltip-created="true"]')) {
      return;
    }

    const statsPanel = document.querySelector('.stats-panel');
    if (statsPanel) {
      const statRows = statsPanel.querySelectorAll('.stat-row');
      let defenseRowFound = false;

      statRows.forEach(row => {
        const label = row.querySelector('.stat-label');
        if (label && label.textContent.includes('Defense') && !defenseRowFound) {
          defenseRowFound = true;
          
          // 標記已創建，避免重複
          label.setAttribute('data-tooltip-created', 'true');
          
          // 🔧 修復: 只創建一個問號圖標
          if (!label.querySelector('.help-icon')) {
            const helpIcon = document.createElement('span');
            helpIcon.className = 'help-icon';
            helpIcon.innerHTML = ' ❓';
            helpIcon.style.cssText = `
              cursor: help;
              margin-left: 5px;
              font-size: 14px;
              opacity: 0.9;
              position: relative;
              color: #4ecdc4;
            `;
            
            const tooltip = document.createElement('div');
            tooltip.style.cssText = `
              position: absolute;
              bottom: 25px;
              left: 50%;
              transform: translateX(-50%);
              background: rgba(0, 0, 0, 0.95);
              color: white;
              padding: 15px;
              border-radius: 10px;
              font-size: 13px;
              line-height: 1.5;
              width: 250px;
              z-index: 1000;
              border: 2px solid #4ecdc4;
              box-shadow: 0 8px 25px rgba(0, 0, 0, 0.8);
              display: none;
              backdrop-filter: blur(10px);
            `;
            
            tooltip.innerHTML = `
              <div style="text-align: center; margin-bottom: 10px;">
                <strong style="color: #4ecdc4; font-size: 14px;">🛡️ 護甲減傷機制</strong>
              </div>
              <div style="margin-bottom: 8px;">
                <strong style="color: #ffd700;">計算公式：</strong><br>
                減傷% = 護甲 ÷ (護甲 + 100)
              </div>
              <div style="margin-bottom: 8px;">
                <strong style="color: #ffd700;">舉例說明：</strong><br>
                • 50護甲 = 33.3%減傷<br>
                • 100護甲 = 50%減傷<br>
                • 200護甲 = 66.7%減傷
              </div>
              <div style="background: rgba(78, 205, 196, 0.2); padding: 8px; border-radius: 6px; margin-top: 10px;">
                <strong style="color: #4ecdc4;">傷害計算順序：</strong><br>
                原始傷害 → 護甲減傷 → 固定減傷 → 最終傷害
              </div>
            `;
            
            helpIcon.appendChild(tooltip);
            label.appendChild(helpIcon);
            
            helpIcon.addEventListener('mouseenter', () => {
              tooltip.style.display = 'block';
            });
            
            helpIcon.addEventListener('mouseleave', () => {
              tooltip.style.display = 'none';
            });
          }
        }
      });
    }
  }

  updateBuffDisplay(player) {
    const buffList = document.getElementById('buffList');
    if (!buffList) return;

    const buffs = [];
    
    if (player.hammerEffects.mastery) buffs.push('🔨 重錘精通 (25%觸發，150%傷害，眩暈1秒)');
    if (player.hammerEffects.storm) buffs.push('🌪️ 重錘風暴 (重錘觸發時下次必暴擊)');
    if (player.hammerEffects.shield) buffs.push('🛡️ 重錘護盾 (重錘觸發時+10護甲5秒)');
    if (player.hammerEffects.heal) buffs.push('💚 重錘恢復 (重錘觸發時+15血量)');
    if (player.hammerEffects.fury) buffs.push('🔥 重錘狂怒 (重錘觸發時+50%攻速3秒)');
    if (player.hammerEffects.weight) buffs.push('⚡ 重錘加重 (觸發率35%，傷害170%)');
    if (player.hammerEffects.duration) buffs.push('⏱️ 重錘延續 (眩暈時間2秒)');
    
    if (player.hasReflectArmor) buffs.push('⚡ 反甲護盾 (每受傷5次反彈5%敵人血量)');
    
    const statusInfo = player.getStatusInfo();
    buffs.push(...statusInfo);
    
    player.badges.forEach(badge => {
      if (!badge.key || !badge.key.includes('hammer')) {
        buffs.push(`${badge.icon} ${badge.name}`);
      }
    });

    buffList.innerHTML = buffs.length > 0 
      ? buffs.map(buff => `<div style="margin-bottom: 5px; font-size: 13px; padding: 3px 0;">${buff}</div>`).join('')
      : '<div style="opacity: 0.6; font-size: 13px;">暫無效果</div>';
  }

  showBattleResults(battleStats, player, displayTime = 0) {
    const resultsDiv = document.createElement('div');
    resultsDiv.className = 'battle-results-overlay';
    resultsDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(15px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1500;
      cursor: pointer;
    `;

    const contentPanel = document.createElement('div');
    contentPanel.className = 'content-panel';
    contentPanel.style.cssText = `
      background: linear-gradient(135deg, #2a2a40 0%, #1a1a2e 100%);
      border: 2px solid #4ecdc4;
      border-radius: 20px;
      padding: 30px;
      color: white;
      min-width: 500px;
      max-width: 600px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
      pointer-events: none;
    `;

    const battleDuration = (Date.now() - battleStats.startTime) / 1000;
    const avgDamage = battleStats.playerAttackCount > 0 ? 
      (battleStats.playerTotalDamage / battleStats.playerAttackCount) : 0;
    const critRate = battleStats.playerAttackCount > 0 ? 
      (battleStats.critCount / battleStats.playerAttackCount * 100) : 0;
    const hammerRate = battleStats.playerAttackCount > 0 ? 
      (battleStats.hammerProcCount / battleStats.playerAttackCount * 100) : 0;

    contentPanel.innerHTML = `
      <h2 style="color: #4ecdc4; margin-bottom: 20px; font-size: 24px;">⚔️ 戰鬥總結</h2>
      <div style="text-align: left; margin-bottom: 25px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 15px;">
        <div>⏱️ 戰鬥時長: <span style="color: #ffd700; font-weight: bold;">${battleDuration.toFixed(1)}秒</span></div>
        <div>❤️ 剩餘血量: <span style="color: #4ecdc4; font-weight: bold;">${Math.round(player.hp)}/${player.maxHp}</span></div>
        <div>🗡️ 攻擊次數: <span style="color: #ffd700; font-weight: bold;">${battleStats.playerAttackCount}</span></div>
        <div>📊 平均傷害: <span style="color: #ffd700; font-weight: bold;">${avgDamage.toFixed(1)}</span></div>
        <div>💥 暴擊率: <span style="color: #ff6b6b; font-weight: bold;">${critRate.toFixed(1)}%</span></div>
        <div>🔨 重錘率: <span style="color: #ff6b6b; font-weight: bold;">${hammerRate.toFixed(1)}%</span></div>
      </div>
      <div class="click-hint" style="
        background: linear-gradient(135deg, rgba(78, 205, 196, 0.2), rgba(68, 160, 141, 0.2));
        border: 1px solid rgba(78, 205, 196, 0.4);
        padding: 15px 25px;
        border-radius: 15px;
        margin-bottom: 0;
      ">
        <p style="color: #4ecdc4; font-size: 16px; font-weight: bold; margin: 0;">
          💡 點擊螢幕任意位置繼續
        </p>
      </div>
    `;

    resultsDiv.appendChild(contentPanel);

    resultsDiv.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      resultsDiv.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => {
        if (resultsDiv.parentNode) {
          resultsDiv.remove();
        }
      }, 300);
    }, true);

    document.body.appendChild(resultsDiv);
  }
}

export default GameManager;