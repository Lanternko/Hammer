// src/data/upgradeRewards.js - 修復護甲獎勵為固定值
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

// 根據關卡生成升級選項
export function generateUpgradeOptions(currentLevel) {
  const allUpgrades = [...UpgradeRewards.baseUpgrades];
  
  // 第10關後開始出現高級升級
  if (currentLevel >= 10) {
    allUpgrades.push(...UpgradeRewards.advancedUpgrades);
  }
  
  // 隨機選擇3個不同的升級選項
  const shuffled = [...allUpgrades].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

// 應用升級效果到玩家
export function applyUpgradeToPlayer(player, upgrade) {
  switch(upgrade.type) {
    case 'attack':
      if (upgrade.isPercentage) {
        player.applyPercentageBonus('attack', upgrade.value);
      } else {
        player.applyFlatBonus('attack', upgrade.value);
      }
      break;
      
    case 'maxHp':
      if (upgrade.isPercentage) {
        player.applyPercentageBonus('hp', upgrade.value);
      } else {
        player.applyFlatBonus('hp', upgrade.value);
      }
      break;
      
    case 'armor':
      if (upgrade.isPercentage) {
        player.applyPercentageBonus('armor', upgrade.value);
      } else {
        player.applyFlatBonus('armor', upgrade.value);
      }
      break;
      
    case 'attackSpeed':
      if (upgrade.isPercentage) {
        player.applyPercentageBonus('attackSpeed', upgrade.value);
      } else {
        player.applyFlatBonus('attackSpeed', upgrade.value);
      }
      break;
      
    case 'critChance':
      player.applyFlatBonus('critChance', upgrade.value);
      break;
      
    case 'flatReduction':
      player.applyFlatBonus('flatReduction', upgrade.value);
      break;
      
    case 'lifesteal':
      player.lifesteal = (player.lifesteal || 0) + upgrade.value;
      break;
      
    case 'berserker':
      player.specialEffects = player.specialEffects || {};
      player.specialEffects.berserker = upgrade.value;
      break;
      
    case 'fortress':
      player.applyFlatBonus('armor', upgrade.value.armor);
      player.applyFlatBonus('flatReduction', upgrade.value.flatReduction);
      break;
  }
  
  console.log(`🔺 升級選擇: ${upgrade.name}`);
}

// 獲取升級稀有度顏色
export function getUpgradeRarityColor(rarity) {
  switch(rarity) {
    case 'common': return '#A0A0A0';
    case 'uncommon': return '#4CAF50';
    case 'rare': return '#2196F3';
    case 'epic': return '#9C27B0';
    case 'legendary': return '#FF9800';
    default: return '#FFFFFF';
  }
}