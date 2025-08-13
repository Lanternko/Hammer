// src/data/upgradeRewards.js - 升級獎勵系統
export const UpgradeRewards = {
  // 基礎升級選項
  baseUpgrades: [
    {
      id: 'power_boost',
      name: '力量增強',
      icon: '⚔️',
      description: '攻擊力 +10% (百分比)',
      type: 'attack',
      value: 0.1,
      isPercentage: true,
      rarity: 'common'
    },
    {
      id: 'health_boost',
      name: '生命強化',
      icon: '❤️',
      description: '最大生命值 +10% (百分比)',
      type: 'maxHp',
      value: 0.1,
      isPercentage: true,
      rarity: 'common'
    },
    {
      id: 'armor_mastery',
      name: '護甲精通',
      icon: '🛡️',
      description: '護甲值 +8 (固定值)',
      type: 'armor',
      value: 8,
      isPercentage: false,
      rarity: 'common'
    },
    {
      id: 'speed_boost',
      name: '速度提升',
      icon: '⚡',
      description: '攻擊速度 +10% (百分比)',
      type: 'attackSpeed',
      value: 0.1,
      isPercentage: true,
      rarity: 'common'
    },
    {
      id: 'crit_mastery',
      name: '精準打擊',
      icon: '💥',
      description: '暴擊率 +5% (固定值)',
      type: 'critChance',
      value: 0.05,
      isPercentage: false,
      rarity: 'uncommon'
    },
    {
      id: 'damage_reduction',
      name: '堅韌體質',
      icon: '🔰',
      description: '固定減傷 +2 (固定值)',
      type: 'flatReduction',
      value: 2,
      isPercentage: false,
      rarity: 'uncommon'
    },
    {
      id: 'lifesteal',
      name: '生命汲取',
      icon: '🩸',
      description: '攻擊時回復3點生命值',
      type: 'lifesteal',
      value: 3,
      isPercentage: false,
      rarity: 'rare'
    },
    {
      id: 'berserker',
      name: '狂戰士',
      icon: '🔴',
      description: '生命值低於50%時攻擊力+20%',
      type: 'berserker',
      value: 0.2,
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
      description: '攻擊力 +25% (強化版)',
      type: 'attack',
      value: 0.25,
      isPercentage: true,
      rarity: 'rare'
    },
    {
      id: 'massive_health',
      name: '巨大生命',
      icon: '💗',
      description: '最大生命值 +25% (強化版)',
      type: 'maxHp',
      value: 0.25,
      isPercentage: true,
      rarity: 'rare'
    },
    {
      id: 'super_speed',
      name: '極速強化',
      icon: '⚡',
      description: '攻擊速度 +25% (強化版)',
      type: 'attackSpeed',
      value: 0.25,
      isPercentage: true,
      rarity: 'rare'
    },
    {
      id: 'fortress',
      name: '要塞體質',
      icon: '🏰',
      description: '護甲+15，固減+3',
      type: 'fortress',
      value: { armor: 15, flatReduction: 3 },
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
        player.attack = Math.floor(player.attack * (1 + upgrade.value));
      } else {
        player.attack += upgrade.value;
      }
      break;
      
    case 'maxHp':
      if (upgrade.isPercentage) {
        const oldMaxHp = player.maxHp;
        player.maxHp = Math.floor(player.maxHp * (1 + upgrade.value));
        player.hp = player.maxHp; // 回滿血
      } else {
        player.maxHp += upgrade.value;
        player.hp += upgrade.value;
      }
      break;
      
    case 'armor':
      if (upgrade.isPercentage) {
        player.armor = Math.floor(player.armor * (1 + upgrade.value));
      } else {
        player.armor += upgrade.value;
      }
      break;
      
    case 'attackSpeed':
      if (upgrade.isPercentage) {
        player.attackSpeed = player.attackSpeed * (1 + upgrade.value);
      } else {
        player.attackSpeed += upgrade.value;
      }
      player.attackFrame = Math.round(20 / player.attackSpeed);
      break;
      
    case 'critChance':
      player.critChance = Math.min(1.0, player.critChance + upgrade.value);
      break;
      
    case 'flatReduction':
      player.flatReduction += upgrade.value;
      break;
      
    case 'lifesteal':
      player.lifesteal = (player.lifesteal || 0) + upgrade.value;
      break;
      
    case 'berserker':
      player.specialEffects = player.specialEffects || {};
      player.specialEffects.berserker = upgrade.value;
      break;
      
    case 'fortress':
      player.armor += upgrade.value.armor;
      player.flatReduction += upgrade.value.flatReduction;
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