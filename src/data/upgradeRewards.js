// src/data/upgradeRewards.js - 修復版本
export const UpgradeRewards = {
  // 基礎升級選項 - 主要給百分比增強
  baseUpgrades: [
    {
      id: 'power_boost',
      name: '力量增強',
      icon: '💪',
      description: '攻擊力 +15% (百分比)',
      type: 'attack',
      value: 0.15,
      isPercentage: true,
      rarity: 'common'
    },
    {
      id: 'health_boost',
      name: '生命強化',
      icon: '❤️',
      description: '最大生命值 +15% (百分比)',
      type: 'maxHp',
      value: 0.15,
      isPercentage: true,
      rarity: 'common'
    },
    {
      id: 'armor_boost',
      name: '護甲強化',
      icon: '🛡️',
      description: '護甲值 +10 (固定值)',
      type: 'armor',
      value: 10,
      isPercentage: false,
      rarity: 'common'
    },
    {
      id: 'speed_boost',
      name: '速度提升',
      icon: '⚡',
      description: '攻擊速度 +15% (百分比)',
      type: 'attackSpeed',
      value: 0.15,
      isPercentage: true,
      rarity: 'common'
    },
    {
      id: 'crit_mastery',
      name: '精準打擊',
      icon: '💥',
      description: '暴擊率 +8% (固定值)',
      type: 'critChance',
      value: 0.08,
      isPercentage: false,
      rarity: 'uncommon'
    },
    {
      id: 'damage_reduction',
      name: '堅韌體質',
      icon: '🔰',
      description: '固定減傷 +3 (固定值)',
      type: 'flatReduction',
      value: 3,
      isPercentage: false,
      rarity: 'uncommon'
    },
    {
      id: 'lifesteal',
      name: '生命汲取',
      icon: '🩸',
      description: '攻擊時回復4點生命值',
      type: 'lifesteal',
      value: 4,
      isPercentage: false,
      rarity: 'rare'
    },
    {
      id: 'berserker',
      name: '狂戰士',
      icon: '🔴',
      description: '生命值低於50%時攻擊力+25%',
      type: 'berserker',
      value: 0.25,
      isPercentage: false,
      rarity: 'legendary'
    }
  ],

  // 高級升級選項（後期出現）
  advancedUpgrades: [
    {
      id: 'massive_power',
      name: '巨力強化',
      icon: '💪',
      description: '攻擊力 +30% (強化版)',
      type: 'attack',
      value: 0.30,
      isPercentage: true,
      rarity: 'rare'
    },
    {
      id: 'massive_health',
      name: '巨大生命',
      icon: '💗',
      description: '最大生命值 +30% (強化版)',
      type: 'maxHp',
      value: 0.30,
      isPercentage: true,
      rarity: 'rare'
    },
    {
      id: 'super_speed',
      name: '極速強化',
      icon: '⚡',
      description: '攻擊速度 +30% (強化版)',
      type: 'attackSpeed',
      value: 0.30,
      isPercentage: true,
      rarity: 'rare'
    },
    {
      id: 'fortress',
      name: '要塞體質',
      icon: '🏰',
      description: '護甲+15，固減+5',
      type: 'fortress',
      value: { armor: 15, flatReduction: 5 },
      isPercentage: false,
      rarity: 'legendary'
    }
  ]
};

// 🔧 修復：安全的升級選項生成
export function generateUpgradeOptions(currentLevel) {
  try {
    const allUpgrades = [...UpgradeRewards.baseUpgrades];
    
    // 第10關後開始出現高級升級
    if (currentLevel >= 10) {
      allUpgrades.push(...UpgradeRewards.advancedUpgrades);
    }
    
    // 隨機選擇3個不同的升級選項
    const shuffled = [...allUpgrades].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);
    
    // 🔧 修復：確保每個選項都有必要的屬性
    return selected.map(option => ({
      id: option.id || 'unknown',
      name: option.name || '未知升級',
      icon: option.icon || '❓',
      description: option.description || '無描述',
      type: option.type || 'attack',
      value: option.value || 0,
      isPercentage: option.isPercentage || false,
      rarity: option.rarity || 'common'
    }));
    
  } catch (error) {
    console.error('❌ 生成升級選項錯誤:', error);
    
    // 🔧 備用方案：返回基本升級選項
    return [
      {
        id: 'backup_power',
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
}

// 🔧 修復：安全的升級應用函數
export function applyUpgradeToPlayer(player, upgrade) {
  try {
    // 🔧 詳細的參數驗證
    if (!player) {
      console.error('❌ applyUpgradeToPlayer: player 參數為空');
      return;
    }
    
    if (!upgrade) {
      console.error('❌ applyUpgradeToPlayer: upgrade 參數為空');
      return;
    }
    
    if (!upgrade.type) {
      console.error('❌ applyUpgradeToPlayer: upgrade.type 缺失', upgrade);
      return;
    }
    
    if (upgrade.value === undefined || upgrade.value === null) {
      console.error('❌ applyUpgradeToPlayer: upgrade.value 缺失', upgrade);
      return;
    }
    
    console.log(`🔧 應用升級: ${upgrade.name} (${upgrade.type}, ${upgrade.value})`);
    
    // 🔧 安全的類型處理
    switch(upgrade.type) {
      case 'attack':
        if (upgrade.isPercentage) {
          if (typeof player.applyPercentageBonus === 'function') {
            player.applyPercentageBonus('attack', upgrade.value);
          } else {
            console.warn('⚠️ player.applyPercentageBonus 方法不存在');
          }
        } else {
          if (typeof player.applyFlatBonus === 'function') {
            player.applyFlatBonus('attack', upgrade.value);
          } else {
            console.warn('⚠️ player.applyFlatBonus 方法不存在');
          }
        }
        break;
        
      case 'maxHp':
      case 'hp':
        if (upgrade.isPercentage) {
          if (typeof player.applyPercentageBonus === 'function') {
            player.applyPercentageBonus('hp', upgrade.value);
          }
        } else {
          if (typeof player.applyFlatBonus === 'function') {
            player.applyFlatBonus('hp', upgrade.value);
          }
        }
        break;
        
      case 'armor':
        if (upgrade.isPercentage) {
          if (typeof player.applyPercentageBonus === 'function') {
            player.applyPercentageBonus('armor', upgrade.value);
          }
        } else {
          if (typeof player.applyFlatBonus === 'function') {
            player.applyFlatBonus('armor', upgrade.value);
          }
        }
        break;
        
      case 'attackSpeed':
        if (upgrade.isPercentage) {
          if (typeof player.applyPercentageBonus === 'function') {
            player.applyPercentageBonus('attackSpeed', upgrade.value);
          }
        } else {
          if (typeof player.applyFlatBonus === 'function') {
            player.applyFlatBonus('attackSpeed', upgrade.value);
          }
        }
        break;
        
      case 'critChance':
        if (typeof player.applyFlatBonus === 'function') {
          player.applyFlatBonus('critChance', upgrade.value);
        }
        break;
        
      case 'flatReduction':
        if (typeof player.applyFlatBonus === 'function') {
          player.applyFlatBonus('flatReduction', upgrade.value);
        }
        break;
        
      case 'lifesteal':
        player.lifesteal = (player.lifesteal || 0) + upgrade.value;
        break;
        
      case 'berserker':
        if (!player.specialEffects) player.specialEffects = {};
        player.specialEffects.berserker = upgrade.value;
        break;
        
      case 'fortress':
        if (upgrade.value && typeof upgrade.value === 'object') {
          if (typeof player.applyFlatBonus === 'function') {
            if (upgrade.value.armor) {
              player.applyFlatBonus('armor', upgrade.value.armor);
            }
            if (upgrade.value.flatReduction) {
              player.applyFlatBonus('flatReduction', upgrade.value.flatReduction);
            }
          }
        }
        break;
        
      default:
        console.warn(`⚠️ 未知的升級類型: ${upgrade.type}`);
        break;
    }
    
    console.log(`✅ 升級應用成功: ${upgrade.name}`);
    
  } catch (error) {
    console.error('❌ 應用升級時發生錯誤:', error);
    console.error('升級信息:', upgrade);
    console.error('玩家信息:', player);
  }
}

// 🔧 修復：安全的稀有度顏色獲取
export function getUpgradeRarityColor(rarity) {
  try {
    const colors = {
      'common': '#A0A0A0',
      'uncommon': '#4CAF50',
      'rare': '#2196F3',
      'epic': '#9C27B0',
      'legendary': '#FF9800'
    };
    
    return colors[rarity] || '#FFFFFF';
    
  } catch (error) {
    console.error('❌ 獲取稀有度顏色錯誤:', error);
    return '#FFFFFF';
  }
}

// 🔧 修復：安全的稀有度文字獲取
export function getUpgradeRarityText(rarity) {
  try {
    const texts = {
      'common': '普通',
      'uncommon': '罕見',
      'rare': '稀有',
      'epic': '史詩',
      'legendary': '傳說'
    };
    
    return texts[rarity] || '未知';
    
  } catch (error) {
    console.error('❌ 獲取稀有度文字錯誤:', error);
    return '未知';
  }
}

// 🔧 數據完整性檢查
export function validateUpgradeData() {
  try {
    const allUpgrades = [...UpgradeRewards.baseUpgrades, ...UpgradeRewards.advancedUpgrades];
    const missingFields = [];
    
    allUpgrades.forEach((upgrade, index) => {
      const requiredFields = ['id', 'name', 'icon', 'description', 'type', 'value', 'rarity'];
      
      requiredFields.forEach(field => {
        if (!upgrade[field] && upgrade[field] !== 0) {
          missingFields.push(`升級 ${index}: 缺少 ${field}`);
        }
      });
    });
    
    if (missingFields.length > 0) {
      console.warn('⚠️ 升級數據不完整:', missingFields);
      return false;
    }
    
    console.log('✅ 升級數據完整性檢查通過');
    return true;
    
  } catch (error) {
    console.error('❌ 升級數據檢查錯誤:', error);
    return false;
  }
}

// 🔧 在模組載入時進行檢查
setTimeout(() => {
  validateUpgradeData();
}, 100);

console.log('✅ upgradeRewards.js 修復版載入完成');