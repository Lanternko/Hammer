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
    this.player = new Player();
    this.enemy = null;
    this.state = 'battle';
    this.gold = 0;
    this.diamonds = 0;
    this.battleSystem = null;
    this.eventSystem = new EventSystem(this);
    
    // 保存戰鬥速度設定和暫停狀態
    this.battleSpeed = 1; // 預設1倍速
    this.isPaused = false; // 暫停狀態
    
    // 創建增強的UI管理器
    this.enhancedUI = new EnhancedUIManager();
    
    // 給予開局徽章
    this.giveStartingBadge();
    // 新增：繼承徽章系統
    this.inheritedBadges = []; // 從上一輪繼承的徽章
    this.maxInheritedBadges = 1; // 最多繼承1個徽章
    this.failureCount = 0; // 連續失敗次數
  }

  // 新增：暫停切換功能
  togglePause() {
    if (this.battleSystem) {
      this.battleSystem.togglePause();
    }
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

    console.log(`🔄 進入關卡 ${this.currentLevel}`);

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
    
    // 創建新的戰鬥系統並繼承速度設定
    this.battleSystem = new BattleSystem(this.player, this.enemy, this);
    this.battleSystem.setBattleSpeed(this.battleSpeed); // 繼承之前的速度設定
    this.battleSystem.start();
  }

  // 設定戰鬥速度的方法，供BattleSystem回調
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
      // 顯示死亡摘要
      this.showDeathSummary(battleStats);
      return;
    }

    // 縮短戰鬥結果顯示時間到3秒
    if (battleStats && this.enhancedUI) {
      this.enhancedUI.showBattleResults(battleStats, this.player, 3000);
    }

    // 獲得金幣獎勵
    let goldReward = 1;
    if (this.currentLevel === 20) {
      goldReward = 5;
    } else if (this.currentLevel % 5 === 0) {
      goldReward = 2;
    }
    
    this.gold += goldReward;
    console.log(`💰 關卡 ${this.currentLevel} 完成！獲得金幣: ${goldReward}，總金幣: ${this.gold}`);

    // 血量回滿
    this.player.hp = this.player.maxHp;
    console.log('💚 血量已回滿');

    // 縮短延遲到1秒
    setTimeout(() => {
      this.showLevelUpChoice(goldReward);
    }, 1000);
  }

  // 修改：死亡畫面增加徽章選擇
  showDeathSummary(battleStats) {
    const deathDiv = document.createElement('div');
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

    // 可繼承的徽章（排除重錘精通，因為是開局必給）
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
      
      <!-- 戰鬥分析 -->
      <div style="background: rgba(0, 0, 0, 0.5); padding: 15px; border-radius: 15px; margin-bottom: 20px;">
        <h4 style="color: #ffd700; margin-bottom: 10px;">🎯 戰敗分析</h4>
        <div style="font-size: 14px; line-height: 1.6; text-align: left;">
          ${this.getDeathAnalysis()}
        </div>
      </div>
      
      ${hasInheritableBadges ? `
        <!-- 徽章繼承選擇 -->
        <div style="background: rgba(255, 215, 0, 0.1); border: 1px solid rgba(255, 215, 0, 0.3); border-radius: 15px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #ffd700; margin-bottom: 15px;">🎁 選擇一個徽章帶到下一輪</h3>
          <p style="font-size: 14px; opacity: 0.9; margin-bottom: 15px;">失敗並不可怕，選擇一個徽章開始新的征程！</p>
          <div id="inheritanceBadges" style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
            ${this.renderInheritanceBadges(inheritableBadges)}
          </div>
        </div>
      ` : `
        <!-- 無徽章可繼承 -->
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

    // 如果有可繼承徽章，綁定選擇事件
    if (hasInheritableBadges) {
      this.bindInheritanceEvents(inheritableBadges, deathDiv);
    }
  }

  // 渲染可繼承的徽章
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

  // 綁定徽章選擇事件
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

  // 選擇繼承徽章
  selectInheritanceBadge(badge, deathDiv) {
    this.inheritedBadges = [badge]; // 只能繼承一個
    
    // 顯示選擇確認
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

    // 添加確認動畫
    const style = document.createElement('style');
    style.textContent = `
      @keyframes confirmPulse {
        0% { transform: scale(0.8); opacity: 0; }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    // 清理動畫樣式
    setTimeout(() => {
      if (style.parentNode) {
        style.remove();
      }
    }, 1000);
  }

  // 帶繼承重開
  restartWithInheritance() {
    const overlay = document.querySelector('[style*="position: fixed"]');
    if (overlay) overlay.remove();
    
    this.resetGame();
  }

  // 無繼承重開
  restartWithoutInheritance() {
    this.inheritedBadges = [];
    const overlay = document.querySelector('[style*="position: fixed"]');
    if (overlay) overlay.remove();
    
    this.resetGame();
  }
  // 新增：死亡分析
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
      newValue = currentValue * (1 + upgrade.value);
      
      // 根據類型決定顯示格式
      if (upgrade.type === 'attackSpeed') {
        return `${currentValue.toFixed(2)} → ${newValue.toFixed(2)} (+${(upgrade.value * 100).toFixed(0)}%)`;
      } else {
        return `${Math.floor(currentValue)} → ${Math.floor(newValue)} (+${(upgrade.value * 100).toFixed(0)}%)`;
      }
    } else {
      // 固定值效果
      if (upgrade.type === 'critChance') {
        // 暴擊率特殊處理：顯示百分比
        const currentPercent = (currentValue * 100).toFixed(0);
        const newPercent = ((currentValue + upgrade.value) * 100).toFixed(0);
        return `${currentPercent}% → ${newPercent}% (+${(upgrade.value * 100).toFixed(0)}%)`;
      } else if (upgrade.type === 'attackSpeed') {
        // 攻速保留小數點
        newValue = currentValue + upgrade.value;
        return `${currentValue.toFixed(2)} → ${newValue.toFixed(2)} (+${upgrade.value.toFixed(2)})`;
      } else if (upgrade.type === 'lifesteal') {
        // 生命汲取
        newValue = currentValue + upgrade.value;
        return `${currentValue} → ${newValue} (+${upgrade.value})`;
      } else if (upgrade.type === 'flatReduction') {
        // 固定減傷
        newValue = currentValue + upgrade.value;
        return `${currentValue} → ${newValue} (+${upgrade.value})`;
      } else if (upgrade.type === 'berserker') {
        // 狂戰士特殊效果
        return `解鎖狂戰士效果 (血量<50%時攻擊+${(upgrade.value * 100).toFixed(0)}%)`;
      } else if (upgrade.type === 'fortress') {
        // 要塞體質組合效果
        const currentArmor = this.player.getEffectiveArmor();
        const currentFlatRed = this.player.flatReduction;
        const newArmor = currentArmor + upgrade.value.armor;
        const newFlatRed = currentFlatRed + upgrade.value.flatReduction;
        return `護甲: ${currentArmor} → ${newArmor} (+${upgrade.value.armor}), 固減: ${currentFlatRed} → ${newFlatRed} (+${upgrade.value.flatReduction})`;
      } else {
        // 其他固定值效果
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

  // 修改：開局徽章給予，加入繼承邏輯
  giveStartingBadge() {
    // 先給重錘精通
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

    // 如果有繼承徽章，也給予
    if (this.inheritedBadges.length > 0) {
      this.inheritedBadges.forEach(badge => {
        this.player.equipBadge(badge);
        console.log(`🎁 繼承徽章: ${badge.name}`);
        
        // 顯示繼承通知
        this.showInheritanceNotification(badge);
      });
      
      // 清空繼承列表
      this.inheritedBadges = [];
    }
  }
  // 顯示繼承通知
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

    // 3秒後自動消失
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.5s ease-out';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 500);
    }, 3000);

    // 添加滑入滑出動畫
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

// 新增：徽章繼承數據配置
const InheritanceConfig = {
  // 推薦繼承的徽章（按優先級排序）
  recommendedBadges: [
    'hammerWeight',      // 重錘加重 - 核心強化
    'hammerDuration',    // 重錘延續 - 控制強化
    'reflectArmor',      // 反甲護盾 - 新機制
    'vampiric',          // 生命汲取 - 續航
    'armorMajor',        // 護甲精通 - 防禦
    'healthMajor',       // 生命精通 - 血量
    'critBoost',         // 暴擊精通 - 爆發
    'speedBoost'         // 攻速提升 - 頻率
  ],

  // 不建議繼承的徽章（陷阱徽章等）
  excludedBadges: [
    'magicFocus',        // 法術專精 - 無用
    'rangedMastery',     // 遠程精通 - 無用
    'elementalRes'       // 元素抗性 - 無用
  ],

  // 獲取徽章推薦度
  getBadgeRecommendation(badgeKey) {
    if (this.excludedBadges.includes(badgeKey)) {
      return { priority: 0, reason: '此徽章對重錘英雄無效' };
    }
    
    const index = this.recommendedBadges.indexOf(badgeKey);
    if (index !== -1) {
      const priority = this.recommendedBadges.length - index;
      const reasons = {
        'hammerWeight': '大幅提升重錘觸發率和傷害',
        'hammerDuration': '延長眩暈時間，提升控制效果',
        'reflectArmor': '被動反擊，適合新手',
        'vampiric': '提供持續回血能力',
        'armorMajor': '大幅提升生存能力',
        'healthMajor': '增加血量上限',
        'critBoost': '提升爆發傷害',
        'speedBoost': '增加攻擊頻率'
      };
      return { priority, reason: reasons[badgeKey] || '有效的輔助徽章' };
    }
    
    return { priority: 3, reason: '普通輔助徽章' };
  },



  checkForBadgeReward() {
    // 每5關給一個徽章 (第5, 10, 15, 20關)
    if (this.currentLevel % 5 === 0) {
      this.giveMilestoneBadge();
    }
  },

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
    
    // 顯示里程碑徽章選擇界面，而不是自動給予
    this.showMilestoneBadgeChoice(badge);
  },

  // 新增：里程碑徽章選擇界面
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

    // 添加動畫
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
    
    // 保存當前徽章供接受時使用
    this.pendingMilestoneBadge = badge;

    // 清理動畫樣式
    setTimeout(() => {
      if (style.parentNode) {
        style.remove();
      }
    }, 1000);
  },

  // 新增：接受里程碑徽章
  acceptMilestoneBadge() {
    if (this.pendingMilestoneBadge) {
      this.player.equipBadge(this.pendingMilestoneBadge);
      console.log(`🎁 獲得里程碑徽章: ${this.pendingMilestoneBadge.name}`);
      this.pendingMilestoneBadge = null;
    }
  },

  triggerEvent() {
    console.log(`🏪 觸發事件關卡 ${this.currentLevel}`);
    this.state = 'shop';
    this.eventSystem.generateShopEvent();
  },

  finishEvent() {
    this.state = 'battle';
    
    // 商店關也要升級選擇
    this.showLevelUpChoice(0);
  },

  endGame() {
    const diamonds = Math.floor(this.currentLevel / 5) + (this.currentLevel >= 20 ? 5 : 0);
    console.log(`🎯 遊戲結束！到達關卡: ${this.currentLevel}, 獲得鑽石: ${diamonds}`);
    this.diamonds += diamonds;
    
    this.showGameOverScreen();
    
    // 5秒後重置遊戲
    setTimeout(() => {
      this.resetGame();
    }, 8000);
  },

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

    // 8秒後移除
    setTimeout(() => {
      if (gameOverDiv.parentNode) {
        gameOverDiv.remove();
      }
    }, 7500);
  },

  resetGame() {
    console.log('🔄 無縫重新開始...');
    
    // 1. 立即清理當前狀態
    if (this.battleSystem) {
      this.battleSystem.stop();
      this.battleSystem = null;
    }
    
    // 2. 重置遊戲狀態
    this.currentLevel = 1;
    this.player = new Player();
    this.enemy = null;
    this.state = 'battle';
    this.gold = 0;
    // 保持戰鬥速度設定不重置
    
    // 3. 清理所有UI覆蓋層（但不清理基礎UI）
    const overlays = document.querySelectorAll(`
      [id*="Overlay"], 
      [id*="overlay"], 
      .damage-indicator,
      .floating-damage,
      #pauseOverlay,
      #levelUpOverlay,
      #eventOverlay
    `);
    overlays.forEach(overlay => {
      if (overlay.parentNode) {
        overlay.remove();
      }
    });
    
    // 4. 重置基礎UI狀態
    this.resetBaseUI();
    
    // 5. 給予開局徽章
    this.giveStartingBadge();
    
    // 6. 直接開始遊戲（無載入畫面）
    this.updateUI();
    this.nextLevel();
    
    console.log('✅ 無縫重開完成！');
  },

  updateUI() {
    // 更新關卡顯示
    const roundCounter = document.querySelector('.round-counter');
    if (roundCounter) {
      roundCounter.textContent = `Round ${this.currentLevel} / 20`;
    }

    // 更新玩家資訊
    this.updatePlayerStats();
  },

  updateEnemyDisplay() {
    if (!this.enemy) return;

    // 更新敵人名稱（包含攻擊力）
    const enemyName = document.querySelector('.enemy .character-name');
    if (enemyName) {
      enemyName.textContent = `${this.enemy.emoji} ${this.enemy.getTypeName()} 攻擊${this.enemy.attack}`;
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
  },

  updatePlayerStats() {
    // 更新角色名稱顯示血量
    const heroName = document.querySelector('.hero .character-name');
    if (heroName) {
      heroName.textContent = `🔨 重錘英雄 (${Math.round(this.player.hp)}/${this.player.maxHp})`;
    }

    // 更新統計面板 - 添加固定減傷
    const statsPanel = document.querySelector('.stats-panel');
    if (statsPanel) {
      // 檢查是否需要添加固定減傷行
      const statRows = statsPanel.querySelectorAll('.stat-row');
      const hasFixedReduction = Array.from(statRows).some(row => 
        row.querySelector('.stat-label')?.textContent?.includes('Fixed Damage Reduction') ||
        row.querySelector('.stat-label')?.textContent?.includes('固定減傷')
      );
      
      if (!hasFixedReduction && statRows.length >= 4) {
        // 在最後一個統計行後添加固定減傷
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

    // 更新現有統計值
    const stats = document.querySelectorAll('.stat-value');
    if (stats.length >= 4) {
      stats[0].textContent = this.player.getEffectiveAttack().toFixed(1);
      stats[1].textContent = this.player.getEffectiveAttackSpeed().toFixed(2);
      stats[2].textContent = this.player.getEffectiveArmor().toFixed(1);
      stats[3].textContent = (this.player.critChance * 100).toFixed(0) + '%';
      
      // 更新固定減傷（如果存在第5個統計值）
      if (stats[4]) {
        stats[4].textContent = this.player.flatReduction.toString();
      }
    }

    // 更新玩家血條
    const heroHealthFill = document.querySelector('.hero .health-fill');
    const heroHealthText = document.querySelector('.hero .health-text');
    if (heroHealthFill && heroHealthText) {
      const hpPercent = Math.max(0, (this.player.hp / this.player.maxHp) * 100);
      heroHealthFill.style.width = `${hpPercent}%`;
      heroHealthText.textContent = `${Math.round(this.player.hp)} / ${this.player.maxHp}`;
    }

    // 更新 Buff 显示
    if (this.enhancedUI) {
      this.enhancedUI.updateBuffDisplay(this.player);
    }
  }
}

// 修復增強的UI管理器類 - 護甲提示更清楚
class EnhancedUIManager {
  constructor() {
    this.createBuffDisplayArea();
    setTimeout(() => {
      this.createHoverTooltips(); // 延遲創建，確保DOM載入
    }, 2000);
  }

  createBuffDisplayArea() {
    // 在現有的統計面板旁邊創建Buff顯示區域
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
      z-index: 100;
    `;

    buffPanel.innerHTML = `
      <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #4ecdc4; border-bottom: 1px solid rgba(78, 205, 196, 0.3); padding-bottom: 5px;">
        🔥 當前效果
      </div>
      <div id="buffList"></div>
    `;

    document.body.appendChild(buffPanel);
  }

  // 修復：創建更清楚的護甲懸浮提示
  createHoverTooltips() {
    const statsPanel = document.querySelector('.stats-panel');
    if (statsPanel) {
      const statRows = statsPanel.querySelectorAll('.stat-row');
      statRows.forEach(row => {
        const label = row.querySelector('.stat-label');
        if (label && label.textContent.includes('Defense')) {
          // 添加問號圖標
          const helpIcon = document.createElement('span');
          helpIcon.innerHTML = ' ❓';
          helpIcon.style.cssText = `
            cursor: help;
            margin-left: 5px;
            font-size: 14px;
            opacity: 0.9;
            position: relative;
            color: #4ecdc4;
          `;
          
          // 創建更清楚的懸浮提示
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
          
          // 添加懸浮事件
          helpIcon.addEventListener('mouseenter', () => {
            tooltip.style.display = 'block';
          });
          
          helpIcon.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
          });
        }
      });
    }
  }

  updateBuffDisplay(player) {
    const buffList = document.getElementById('buffList');
    if (!buffList) return;

    const buffs = [];
    
    // 重錘效果
    if (player.hammerEffects.mastery) buffs.push('🔨 重錘精通 (25%觸發，150%傷害，眩暈1秒)');
    if (player.hammerEffects.storm) buffs.push('🌪️ 重錘風暴 (重錘觸發時下次必暴擊)');
    if (player.hammerEffects.shield) buffs.push('🛡️ 重錘護盾 (重錘觸發時+10護甲5秒)');
    if (player.hammerEffects.heal) buffs.push('💚 重錘恢復 (重錘觸發時+15血量)');
    if (player.hammerEffects.fury) buffs.push('🔥 重錘狂怒 (重錘觸發時+50%攻速3秒)');
    if (player.hammerEffects.weight) buffs.push('⚡ 重錘加重 (觸發率35%，傷害170%)');
    if (player.hammerEffects.duration) buffs.push('⏱️ 重錘延續 (眩暈時間2秒)');
    
    // 反甲效果
    if (player.hasReflectArmor) buffs.push('⚡ 反甲護盾 (每受傷5次反彈5%敵人血量)');
    
    // 臨時效果
    const statusInfo = player.getStatusInfo();
    buffs.push(...statusInfo);
    
    // 徽章效果（只顯示非重錘的）
    player.badges.forEach(badge => {
      if (!badge.key || !badge.key.includes('hammer')) {
        buffs.push(`${badge.icon} ${badge.name}`);
      }
    });

    buffList.innerHTML = buffs.length > 0 
      ? buffs.map(buff => `<div style="margin-bottom: 5px; font-size: 13px; padding: 3px 0;">${buff}</div>`).join('')
      : '<div style="opacity: 0.6; font-size: 13px;">暫無效果</div>';
  }

  // 修復：BattleSystem.js - 擴大點擊區域到整個頁面
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

    // 全螢幕點擊事件
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