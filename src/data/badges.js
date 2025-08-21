// src/data/badges.js - 修復徽章系統 (徽章給固定值，升級給百分比)
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
    description: '防禦力+12 (固定值)',
    effect: { flatArmor: 12 },
    cost: 5,
    rarity: 'common',
    icon: '🛡️'
  },
  
  armorMajor: {
    name: '護甲精通',
    description: '防禦力+18 (固定值)',
    effect: { flatArmor: 18 },
    cost: 8,
    rarity: 'uncommon',
    icon: '🛡️'
  },
  
  // === 血量類徽章（固定值）===
  healthBoost: {
    name: '生命強化', 
    description: '最大生命值+35 (固定值)',
    effect: { flatHp: 35 },
    cost: 5,
    rarity: 'common',
    icon: '❤️'
  },
  
  healthMajor: {
    name: '生命精通',
    description: '最大生命值+55 (固定值)',
    effect: { flatHp: 55 },
    cost: 8,
    rarity: 'uncommon',
    icon: '❤️'
  },
  
  // === 輸出類徽章（固定值）===
  powerBoost: {
    name: '力量提升',
    description: '攻擊力+8 (固定值)',
    effect: { flatAttack: 8 },
    cost: 6,
    rarity: 'common',
    icon: '⚔️'
  },
  
  speedBoost: {
    name: '攻速提升',
    description: '攻擊速度+0.15 (固定值)',
    effect: { flatAttackSpeed: 0.15 },
    cost: 7,
    rarity: 'uncommon',
    icon: '⚡'
  },
  
  // === 其他有用徽章 ===
  critBoost: {
    name: '暴擊精通',
    description: '暴擊率+12% (固定值)',
    effect: { flatCritChance: 0.12 },
    cost: 8,
    rarity: 'uncommon',
    icon: '💥'
  },
  
  vampiric: {
    name: '生命汲取',
    description: '攻擊時回復3點生命值 (固定值)',
    effect: { lifesteal: 3 },
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
    description: '護甲+10，固減+4，生命值+30 (固定值)',
    effect: { flatArmor: 10, flatReduction: 4, flatHp: 30 },
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

// 🔧 修復：安全的徽章效果應用函數
export function applyBadgeEffectToPlayer(player, badge) {
  const effect = badge.effect;
  
  // 固定值效果 (徽章專用)
  if (effect.flatHp) {
    player.applyFlatBonus('hp', effect.flatHp);
  }
  if (effect.flatAttack) {
    player.applyFlatBonus('attack', effect.flatAttack);
  }
  if (effect.flatArmor) {
    player.applyFlatBonus('armor', effect.flatArmor);
  }
  if (effect.flatAttackSpeed) {
    player.applyFlatBonus('attackSpeed', effect.flatAttackSpeed);
  }
  if (effect.flatCritChance) {
    player.applyFlatBonus('critChance', effect.flatCritChance);
  }
  if (effect.flatReduction) {
    player.applyFlatBonus('flatReduction', effect.flatReduction);
  }
  if (effect.lifesteal) {
    player.lifesteal = (player.lifesteal || 0) + effect.lifesteal;
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
}

// 🔧 修復：安全的隨機徽章生成
export function getRandomBadges(count = 3, playerLevel = 1) {
  try {
    // 檢查 BadgeData 是否存在
    if (!BadgeData || typeof BadgeData !== 'object') {
      console.error('❌ BadgeData 未正確載入');
      return [];
    }

    let availableBadges = [];
    
    if (playerLevel <= 5) {
      // 前期：更多基礎徽章
      availableBadges = [
        { key: 'armorBoost', weight: 3 },
        { key: 'healthBoost', weight: 3 },
        { key: 'powerBoost', weight: 3 },
        { key: 'damageReduction', weight: 2 },
        { key: 'hammerDuration', weight: 4 },
        { key: 'reflectArmor', weight: 3 },
        { key: 'critBoost', weight: 2 }
      ];
    } else if (playerLevel <= 10) {
      // 中期：混合徽章
      availableBadges = [
        { key: 'hammerWeight', weight: 4 },
        { key: 'hammerDuration', weight: 3 },
        { key: 'reflectArmor', weight: 4 },
        { key: 'armorMajor', weight: 2 },
        { key: 'healthMajor', weight: 2 },
        { key: 'powerBoost', weight: 3 },
        { key: 'speedBoost', weight: 3 },
        { key: 'vampiric', weight: 2 }
      ];
    } else {
      // 後期：更多高級徽章
      availableBadges = [
        { key: 'hammerWeight', weight: 5 },
        { key: 'armorMajor', weight: 3 },
        { key: 'healthMajor', weight: 3 },
        { key: 'speedBoost', weight: 4 },
        { key: 'reflectArmor', weight: 3 },
        { key: 'berserker', weight: 2 },
        { key: 'guardian', weight: 2 },
        { key: 'vampiric', weight: 3 },
        { key: 'critBoost', weight: 2 }
      ];
    }
    
    const selected = [];
    const weightedPool = [];
    
    // 創建權重池
    availableBadges.forEach(item => {
      if (BadgeData[item.key]) {
        for (let i = 0; i < item.weight; i++) {
          weightedPool.push(item.key);
        }
      } else {
        console.warn(`⚠️ 徽章 ${item.key} 在 BadgeData 中不存在`);
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
      
      if (!usedKeys.has(selectedKey) && BadgeData[selectedKey]) {
        usedKeys.add(selectedKey);
        selected.push({
          key: selectedKey,
          ...BadgeData[selectedKey]
        });
      }
    }
    
    console.log(`✅ 生成 ${selected.length} 個徽章選項 (等級 ${playerLevel})`);
    return selected;
    
  } catch (error) {
    console.error('❌ 生成隨機徽章時發生錯誤:', error);
    return [];
  }
}

// 🔧 修復：安全的稀有度顏色獲取
export function getBadgeRarityColor(rarity) {
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

// 🔧 檢查模組載入狀態
export function checkBadgeDataIntegrity() {
  try {
    const requiredBadges = [
      'hammerMastery', 'hammerStorm', 'hammerShield', 'hammerHeal',
      'hammerFury', 'hammerWeight', 'hammerDuration', 'reflectArmor',
      'armorBoost', 'healthBoost', 'powerBoost', 'vampiric'
    ];
    
    const missingBadges = requiredBadges.filter(key => !BadgeData[key]);
    
    if (missingBadges.length > 0) {
      console.error('❌ 缺少必要的徽章數據:', missingBadges);
      return false;
    }
    
    console.log('✅ 徽章數據完整性檢查通過');
    return true;
    
  } catch (error) {
    console.error('❌ 徽章數據完整性檢查失敗:', error);
    return false;
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
    // 反甲流派 (固定值堆疊)
    reflectBuild: ['hammerMastery', 'hammerShield', 'reflectArmor', 'armorMajor', 'healthMajor'],
    // 爆發流派  
    burstBuild: ['hammerMastery', 'hammerStorm', 'hammerWeight', 'critBoost', 'speedBoost'],
    // 控制流派
    controlBuild: ['hammerMastery', 'hammerDuration', 'hammerShield', 'vampiric', 'damageReduction']
  }
};

console.log('🔨 重錘BD徽章系統已載入 (固定值版本)');
console.log('⚡ 升級給百分比，徽章給固定值，兩者相乘效果更好');
