// src/systems/ProgressionSystem.js - 升級和里程碑系統
import { generateUpgradeOptions, applyUpgradeToPlayer } from '../data/upgradeRewards.js';

class ProgressionSystem {
  constructor(gameManager) {
    this.gameManager = gameManager;
    this.isShowingLevelUpChoice = false;
    this.pendingMilestoneBadge = null;
  }

  // 🔄 重置進度狀態
  resetProgressionState() {
    this.isShowingLevelUpChoice = false;
    this.pendingMilestoneBadge = null;
  }

  // ⬆️ 顯示升級選擇
  showLevelUpChoice(currentLevel, goldReward) {
    this.isShowingLevelUpChoice = true;

    let upgradeOptions;
    try {
      upgradeOptions = generateUpgradeOptions(currentLevel);
      
      if (!upgradeOptions || upgradeOptions.length === 0) {
        throw new Error('升級選項生成失敗');
      }
      
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
      upgradeOptions = this.getBackupUpgradeOptions();
    }
    
    this.createUpgradeOverlay(currentLevel, goldReward, upgradeOptions);
  }

  getBackupUpgradeOptions() {
    return [
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

  createUpgradeOverlay(currentLevel, goldReward, upgradeOptions) {
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
          🎉 關卡 ${currentLevel} 完成！
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
    this.bindUpgradeEvents(upgradeOptions, upgradeDiv);
  }

  bindUpgradeEvents(upgradeOptions, upgradeDiv) {
    const upgradeOptionElements = document.querySelectorAll('.upgrade-option');
    upgradeOptionElements.forEach((element, index) => {
      if (index >= 0 && index < upgradeOptions.length) {
        const option = upgradeOptions[index];
        
        element.addEventListener('click', () => {
          if (!this.isShowingLevelUpChoice || !option) {
            console.warn('⚠️ 升級選擇已處理或選項無效');
            return;
          }
          
          try {
            console.log(`🔧 嘗試應用升級: ${option.name}`, option);
            
            applyUpgradeToPlayer(this.gameManager.player, option);
            
            if (upgradeDiv.parentNode) {
              upgradeDiv.remove();
            }
            
            this.checkForBadgeReward();
            
            this.isShowingLevelUpChoice = false;
            
            setTimeout(() => {
              this.gameManager.currentLevel++;
              this.gameManager.nextLevel();
            }, 300);
            
          } catch (error) {
            console.error('❌ 應用升級錯誤:', error);
            
            if (upgradeDiv.parentNode) {
              upgradeDiv.remove();
            }
            this.isShowingLevelUpChoice = false;
            
            setTimeout(() => {
              this.gameManager.currentLevel++;
              this.gameManager.nextLevel();
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

  // 🎖️ 里程碑徽章檢查
  checkForBadgeReward() {
    if (this.gameManager.currentLevel % 5 === 0) {
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

    const milestoneIndex = (this.gameManager.currentLevel / 5) - 1;
    const badge = milestoneBadges[milestoneIndex] || milestoneBadges[0];
    
    this.pendingMilestoneBadge = badge;
    this.gameManager.overlayManager.showMilestoneBadgeChoice(badge, this.gameManager);
  }

  acceptMilestoneBadge() {
    if (this.pendingMilestoneBadge) {
      this.gameManager.player.equipBadge(this.pendingMilestoneBadge);
      console.log(`🎁 獲得里程碑徽章: ${this.pendingMilestoneBadge.name}`);
      this.pendingMilestoneBadge = null;
    }
  }

  // 🔧 升級效果計算
  getUpgradeEffectDescription(upgrade) {
    try {
      if (!upgrade || !upgrade.type) {
        return '效果未知';
      }
      
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
          if (upgrade.value && typeof upgrade.value === 'object') {
            const currentArmor = this.getCurrentPlayerValue('armor');
            const currentFlatRed = this.getCurrentPlayerValue('flatReduction');
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

  getCurrentPlayerValue(type) {
    try {
      const player = this.gameManager.player;
      if (!player) {
        console.warn('⚠️ 玩家對象不存在');
        return 0;
      }
      
      switch(type) {
        case 'attack':
          return player.getEffectiveAttack ? player.getEffectiveAttack() : (player.attack || 20);
        case 'maxHp':
        case 'hp':
          return player.maxHp || 100;
        case 'armor':
          return player.getEffectiveArmor ? player.getEffectiveArmor() : (player.armor || 20);
        case 'attackSpeed':
          return player.getEffectiveAttackSpeed ? player.getEffectiveAttackSpeed() : (player.attackSpeed || 0.5);
        case 'critChance':
          return player.critChance || 0.1;
        case 'flatReduction':
          return player.flatReduction || 5;
        case 'lifesteal':
          return player.lifesteal || 0;
        default:
          console.warn(`⚠️ 未知的屬性類型: ${type}`);
          return 0;
      }
    } catch (error) {
      console.error('❌ 獲取玩家數值錯誤:', error);
      return 0;
    }
  }

  // 🔧 工具方法
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
}

export default ProgressionSystem;