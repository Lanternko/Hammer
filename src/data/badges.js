// src/data/badges.js - 包含反甲徽章
export const BadgeData = {
  // === 重錘BD核心徽章 ===
  hammerMastery: {
    name: '重錘精通',
    description: '每次攻擊有25%機率造成150%傷害並眩暈敵人1秒',
    effect: { hammerMastery: true },
    cost: 0,
    rarity: 'legendary',
    icon: '🔨'
  },
  
  hammerStorm: {
    name: '重錘風暴',
    description: '重錘精通觸發時，下次攻擊必定暴擊',
    effect: { hammerStorm: true },
    cost: 0,
    rarity: 'legendary',
    icon: '🌪️'
  },
  
  hammerShield: {
    name: '重錘護盾',
    description: '重錘精通觸發時，獲得10點護甲持續5秒',
    effect: { hammerShield: true },
    cost: 0,
    rarity: 'epic',
    icon: '🛡️'
  },
  
  hammerHeal: {
    name: '重錘恢復',
    description: '重錘精通觸發時，回復15點生命值',
    effect: { hammerHeal: true },
    cost: 0,
    rarity: 'epic',
    icon: '💚'
  },
  
  hammerFury: {
    name: '重錘狂怒',
    description: '重錘精通觸發時，攻擊速度+50%持續3秒',
    effect: { hammerFury: true },
    cost: 0,
    rarity: 'legendary',
    icon: '🔥'
  },

  // === 商店強化徽章 ===
  hammerWeight: {
    name: '重錘加重',
    description: '重錘精通觸發機率+10%，傷害倍率提升至170%',
    effect: { hammerWeight: true },
    cost: 12,
    rarity: 'legendary',
    icon: '⚡'
  },
  
  hammerDuration: {
    name: '重錘延續',
    description: '重錘精通的眩暈時間延長至2秒',
    effect: { hammerDuration: true },
    cost: 8,
    rarity: 'epic',
    icon: '⏱️'
  },
  
  // === 新增反甲徽章 ===
  reflectArmor: {
    name: '反甲護盾',
    description: '每受到5次攻擊，對敵人造成其最大血量5%的傷害',
    effect: { reflectArmor: true },
    cost: 10,
    rarity: 'epic',
    icon: '⚡'
  },
  
  // === 防禦類徽章（固定值）===
  armorBoost: {
    name: '護甲強化',
    description: '防禦力+10 (固定值)',
    effect: { armor: 10 },
    cost: 5,
    rarity: 'common',
    icon: '🛡️'
  },
  
  armorMajor: {
    name: '護甲精通',
    description: '防禦力+15 (固定值)',
    effect: { armor: 15 },
    cost: 8,
    rarity: 'uncommon',
    icon: '🛡️'
  },
  
  // === 血量類徽章（固定值）===
  healthBoost: {
    name: '生命強化', 
    description: '最大生命值+30 (固定值)',
    effect: { maxHp: 30 },
    cost: 5,
    rarity: 'common',
    icon: '❤️'
  },
  
  healthMajor: {
    name: '生命精通',
    description: '最大生命值+50 (固定值)',
    effect: { maxHp: 50 },
    cost: 8,
    rarity: 'uncommon',
    icon: '❤️'
  },
  
  // === 輸出類徽章（百分比）===
  powerBoost: {
    name: '力量提升',
    description: '攻擊力+15% (百分比)',
    effect: { attackPercent: 0.15 },
    cost: 6,
    rarity: 'common',
    icon: '⚔️'
  },
  
  speedBoost: {
    name: '攻速提升',
    description: '攻擊速度+20% (百分比)',
    effect: { attackSpeedPercent: 0.20 },
    cost: 7,
    rarity: 'uncommon',
    icon: '⚡'
  },
  
  // === 其他有用徽章 ===
  critBoost: {
    name: '暴擊精通',
    description: '暴擊率+10% (固定值)',
    effect: { critChance: 0.10 },
    cost: 8,
    rarity: 'uncommon',
    icon: '💥'
  },
  
  vampiric: {
    name: '生命汲取',
    description: '攻擊時回復5點生命值 (固定值)',
    effect: { lifesteal: 5 },
    cost: 9,
    rarity: 'rare',
    icon: '🩸'
  },
  
  damageReduction: {
    name: '傷害減免',
    description: '固定減傷+4 (固定值)',
    effect: { flatReduction: 4 },
    cost: 7,
    rarity: 'uncommon',
    icon: '🔰'
  },

  // === 高級組合徽章 ===
  berserker: {
    name: '狂戰士之怒',
    description: '生命值低於50%時，攻擊力+30%，攻速+25%',
    effect: { berserker: true },
    cost: 12,
    rarity: 'legendary',
    icon: '🔴'
  },
  
  guardian: {
    name: '守護者意志',
    description: '護甲+8，固減+3，生命值+25',
    effect: { armor: 8, flatReduction: 3, maxHp: 25 },
    cost: 15,
    rarity: 'legendary',
    icon: '🛡️'
  },

  // === 陷阱徽章（低成本誘惑）===
  magicFocus: {
    name: '法術專精',
    description: '魔法傷害+50% (但你是物理職業)',
    effect: { magicDamage: 0.5 },
    cost: 3,
    rarity: 'rare',
    icon: '🔮'
  },
  
  rangedMastery: {
    name: '遠程精通',
    description: '射程+2 (但重錘是近戰武器)',
    effect: { range: 2 },
    cost: 4,
    rarity: 'uncommon',
    icon: '🏹'
  },
  
  elementalRes: {
    name: '元素抗性',
    description: '元素傷害-30% (但敵人都是物理攻擊)',
    effect: { elementalResistance: 0.3 },
    cost: 2,
    rarity: 'uncommon',
    icon: '🌈'
  }
};

// 應用徽章效果到玩家
export function applyBadgeEffectToPlayer(player, badge) {
  const effect = badge.effect;
  
  // 固定值效果
  if (effect.maxHp) {
    player.maxHp += effect.maxHp;
    player.hp += effect.maxHp;
  }
  if (effect.attack) player.attack += effect.attack;
  if (effect.armor) player.armor += effect.armor;
  if (effect.attackSpeed) {
    player.attackSpeed += effect.attackSpeed;
    player.attackFrame = Math.round(20 / player.attackSpeed);
  }
  if (effect.critChance) player.critChance += effect.critChance;
  if (effect.flatReduction) player.flatReduction += effect.flatReduction;
  if (effect.lifesteal) {
    player.lifesteal = (player.lifesteal || 0) + effect.lifesteal;
  }
  
  // 百分比效果
  if (effect.attackPercent) {
    player.attack = Math.floor(player.attack * (1 + effect.attackPercent));
  }
  if (effect.attackSpeedPercent) {
    player.attackSpeed = player.attackSpeed * (1 + effect.attackSpeedPercent);
    player.attackFrame = Math.round(20 / player.attackSpeed);
  }
  if (effect.maxHpPercent) {
    const oldMaxHp = player.maxHp;
    player.maxHp = Math.floor(player.maxHp * (1 + effect.maxHpPercent));
    player.hp += (player.maxHp - oldMaxHp);
  }
  
  // 重錘BD效果
  if (effect.hammerMastery) player.hammerEffects.mastery = true;
  if (effect.hammerStorm) player.hammerEffects.storm = true;
  if (effect.hammerShield) player.hammerEffects.shield = true;
  if (effect.hammerHeal) player.hammerEffects.heal = true;
  if (effect.hammerFury) player.hammerEffects.fury = true;
  if (effect.hammerWeight) player.hammerEffects.weight = true;
  if (effect.hammerDuration) player.hammerEffects.duration = true;
  
  // 反甲效果
  if (effect.reflectArmor) {
    player.hasReflectArmor = true;
  }
  
  // 特殊效果
  if (effect.berserker) {
    player.specialEffects = player.specialEffects || {};
    player.specialEffects.berserker = true;
  }
  if (effect.guardian) {
    player.specialEffects = player.specialEffects || {};
    player.specialEffects.guardian = true;
  }
}

// 商店徽章生成策略（三選一）
export function getRandomBadges(count = 3, playerLevel = 1) {
  let availableBadges = [];
  
  if (playerLevel <= 5) {
    // 前期：更多固定值徽章和反甲
    availableBadges = [
      { key: 'armorBoost', weight: 3 },
      { key: 'healthBoost', weight: 3 },
      { key: 'damageReduction', weight: 2 },
      { key: 'hammerDuration', weight: 4 },
      { key: 'reflectArmor', weight: 3 }, // 反甲在前期很有用
      { key: 'critBoost', weight: 2 },
      { key: 'magicFocus', weight: 1 },
      { key: 'elementalRes', weight: 1 }
    ];
  } else if (playerLevel <= 10) {
    // 中期：混合徽章
    availableBadges = [
      { key: 'hammerWeight', weight: 4 },
      { key: 'hammerDuration', weight: 3 },
      { key: 'reflectArmor', weight: 4 }, // 反甲持續有用
      { key: 'armorMajor', weight: 2 },
      { key: 'healthMajor', weight: 2 },
      { key: 'powerBoost', weight: 3 },
      { key: 'speedBoost', weight: 3 },
      { key: 'vampiric', weight: 2 },
      { key: 'rangedMastery', weight: 1 }
    ];
  } else {
    // 後期：更多百分比和高級徽章
    availableBadges = [
      { key: 'hammerWeight', weight: 5 },
      { key: 'powerBoost', weight: 4 },
      { key: 'speedBoost', weight: 4 },
      { key: 'reflectArmor', weight: 3 }, // 後期也有用，對高血量敵人
      { key: 'berserker', weight: 2 },
      { key: 'guardian', weight: 2 },
      { key: 'vampiric', weight: 3 },
      { key: 'critBoost', weight: 2 },
      { key: 'magicFocus', weight: 1 }
    ];
  }
  
  const selected = [];
  const weightedPool = [];
  
  // 創建權重池
  availableBadges.forEach(item => {
    for (let i = 0; i < item.weight; i++) {
      weightedPool.push(item.key);
    }
  });
  
  // 選擇不重複的徽章
  const usedKeys = new Set();
  for (let i = 0; i < count && weightedPool.length > 0; i++) {
    let attempts = 0;
    let selectedKey;
    
    do {
      const randomIndex = Math.floor(Math.random() * weightedPool.length);
      selectedKey = weightedPool[randomIndex];
      attempts++;
    } while (usedKeys.has(selectedKey) && attempts < 20);
    
    if (!usedKeys.has(selectedKey)) {
      usedKeys.add(selectedKey);
      selected.push({
        key: selectedKey,
        ...BadgeData[selectedKey]
      });
    }
  }
  
  return selected;
}

// 獲取徽章稀有度顏色
export function getBadgeRarityColor(rarity) {
  switch(rarity) {
    case 'common': return '#A0A0A0';
    case 'uncommon': return '#4CAF50';
    case 'rare': return '#2196F3';
    case 'epic': return '#9C27B0';
    case 'legendary': return '#FF9800';
    default: return '#FFFFFF';
  }
}

// 更新後的策略分析
export const HammerBDStrategy = {
  priority: [
    'hammerWeight',    // 核心強化
    'hammerDuration',  // 控制強化
    'reflectArmor',    // 新的強力徽章
    'vampiric',        // 續航
    'critBoost',       // 爆發
    'speedBoost',      // 頻率
    'healthMajor',     // 生存
    'armorMajor'       // 防禦
  ],
  
  newStrategy: {
    // 反甲流派
    reflectBuild: ['hammerMastery', 'hammerShield', 'reflectArmor', 'armorMajor', 'healthMajor'],
    // 爆發流派  
    burstBuild: ['hammerMastery', 'hammerStorm', 'hammerWeight', 'critBoost', 'speedBoost'],
    // 控制流派
    controlBuild: ['hammerMastery', 'hammerDuration', 'hammerShield', 'vampiric', 'damageReduction']
  }
};

console.log('🔨 重錘BD徽章系統已載入 (包含反甲)');
console.log('⚡ 新增反甲徽章：每受到5次攻擊，對敵人造成其最大血量5%的傷害');