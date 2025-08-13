// src/data/badges.js - 重錘BD專用版本
export const BadgeData = {
  // === 重錘BD核心徽章 ===
  hammerMastery: {
    name: '重錘精通',
    description: '每次攻擊有25%機率造成150%傷害並眩暈敵人1秒',
    effect: { hammerMastery: true },
    cost: 0, // 開局免費
    rarity: 'legendary',
    icon: '🔨'
  },
  
  hammerStorm: {
    name: '重錘風暴',
    description: '重錘精通觸發時，下次攻擊必定暴擊',
    effect: { hammerStorm: true },
    cost: 0, // 里程碑獎勵
    rarity: 'legendary',
    icon: '🌪️'
  },
  
  hammerShield: {
    name: '重錘護盾',
    description: '重錘精通觸發時，獲得10點護甲持續5秒',
    effect: { hammerShield: true },
    cost: 0, // 里程碑獎勵
    rarity: 'epic',
    icon: '🛡️'
  },
  
  hammerHeal: {
    name: '重錘恢復',
    description: '重錘精通觸發時，回復15點生命值',
    effect: { hammerHeal: true },
    cost: 0, // 里程碑獎勵
    rarity: 'epic',
    icon: '💚'
  },
  
  hammerFury: {
    name: '重錘狂怒',
    description: '重錘精通觸發時，攻擊速度+50%持續3秒',
    effect: { hammerFury: true },
    cost: 0, // 里程碑獎勵
    rarity: 'legendary',
    icon: '🔥'
  },

  // === 商店中的強化徽章（針對重錘BD優化）===
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
  
  // === 通用強化徽章（湊數用）===
  armorBoost: {
    name: '護甲強化',
    description: '防禦力+8',
    effect: { armor: 8 },
    cost: 4,
    rarity: 'common',
    icon: '🛡️'
  },
  
  healthBoost: {
    name: '生命強化', 
    description: '最大生命值+25',
    effect: { maxHp: 25 },
    cost: 5,
    rarity: 'common',
    icon: '❤️'
  },
  
  speedBoost: {
    name: '攻速提升',
    description: '攻擊速度+15%',
    effect: { attackSpeed: 0.075 }, // 15% of base 0.5
    cost: 6,
    rarity: 'uncommon',
    icon: '⚡'
  },
  
  powerBoost: {
    name: '力量提升',
    description: '攻擊力+6',
    effect: { attack: 6 },
    cost: 5,
    rarity: 'common',
    icon: '⚔️'
  },
  
  critBoost: {
    name: '暴擊精通',
    description: '暴擊率+8%',
    effect: { critChance: 0.08 },
    cost: 7,
    rarity: 'uncommon',
    icon: '💥'
  },
  
  vampiric: {
    name: '生命汲取',
    description: '攻擊時回復4點生命值',
    effect: { lifesteal: 4 },
    cost: 8,
    rarity: 'rare',
    icon: '🩸'
  },

  // === 干擾徽章（陷阱選項）===
  magicFocus: {
    name: '法術專精',
    description: '魔法傷害+50%（但你是物理職業）',
    effect: { magicDamage: 0.5 }, // 無用效果
    cost: 10,
    rarity: 'rare',
    icon: '🔮'
  },
  
  rangedMastery: {
    name: '遠程精通',
    description: '射程+2，但重錘是近戰武器',
    effect: { range: 2 }, // 無用效果
    cost: 8,
    rarity: 'uncommon',
    icon: '🏹'
  },
  
  elementalRes: {
    name: '元素抗性',
    description: '元素傷害-30%（但敵人都是物理攻擊）',
    effect: { elementalResistance: 0.3 }, // 無用效果
    cost: 6,
    rarity: 'uncommon',
    icon: '🌈'
  }
};

// 商店徽章生成策略
export function getRandomBadges(count = 3) {
  const shopBadges = [
    'hammerWeight',    // 重錘BD核心強化
    'hammerDuration',  // 重錘BD核心強化
    'armorBoost',      // 通用防禦
    'healthBoost',     // 通用生存
    'speedBoost',      // 通用輸出
    'powerBoost',      // 通用輸出
    'critBoost',       // 通用輸出
    'vampiric',        // 高級生存
    'magicFocus',      // 陷阱選項
    'rangedMastery',   // 陷阱選項
    'elementalRes'     // 陷阱選項
  ];
  
  const selected = [];
  const availableBadges = [...shopBadges];
  
  for (let i = 0; i < count && availableBadges.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * availableBadges.length);
    const badgeKey = availableBadges.splice(randomIndex, 1)[0];
    selected.push({
      key: badgeKey,
      ...BadgeData[badgeKey]
    });
  }
  
  return selected;
}

// 重錘BD最佳策略
export const HammerBDStrategy = {
  priority: [
    'hammerWeight',    // 第一優先：提升觸發率和傷害
    'hammerDuration',  // 第二優先：延長控制時間
    'healthBoost',     // 第三優先：生存能力
    'vampiric',        // 第四優先：續航能力
    'critBoost',       // 第五優先：額外輸出
    'speedBoost',      // 第六優先：更頻繁觸發
    'armorBoost',      // 第七優先：基礎防禦
    'powerBoost'       // 第八優先：基礎攻擊
  ],
  
  avoid: [
    'magicFocus',      // 完全無用
    'rangedMastery',   // 完全無用
    'elementalRes'     // 基本無用
  ],
  
  budgetStrategy: {
    // 預算分配建議
    totalGold: 23,
    ideal: [
      { badge: 'hammerWeight', cost: 12, priority: 1 },
      { badge: 'hammerDuration', cost: 8, priority: 2 },
      { badge: 'vampiric', cost: 8, priority: 3 } // 超預算但值得
    ],
    conservative: [
      { badge: 'hammerWeight', cost: 12, priority: 1 },
      { badge: 'healthBoost', cost: 5, priority: 2 },
      { badge: 'critBoost', cost: 7, priority: 3 } // 總計24，剛好超一點
    ],
    budget: [
      { badge: 'hammerDuration', cost: 8, priority: 1 },
      { badge: 'healthBoost', cost: 5, priority: 2 },
      { badge: 'speedBoost', cost: 6, priority: 3 },
      { badge: 'armorBoost', cost: 4, priority: 4 } // 總計23，完美
    ]
  }
};

// 模擬勝率計算（用於測試平衡性）
export function calculateWinRate(selectedBadges, playerSkill = 'random') {
  let score = 0;
  
  // 基礎重錘BD得分
  if (selectedBadges.includes('hammerMastery')) score += 40;
  if (selectedBadges.includes('hammerStorm')) score += 15;
  if (selectedBadges.includes('hammerShield')) score += 10;
  if (selectedBadges.includes('hammerHeal')) score += 10;
  if (selectedBadges.includes('hammerFury')) score += 15;
  
  // 商店徽章得分
  if (selectedBadges.includes('hammerWeight')) score += 25;  // 核心強化
  if (selectedBadges.includes('hammerDuration')) score += 15; // 控制強化
  if (selectedBadges.includes('vampiric')) score += 12;      // 續航
  if (selectedBadges.includes('critBoost')) score += 8;     // 輸出
  if (selectedBadges.includes('healthBoost')) score += 6;   // 生存
  if (selectedBadges.includes('speedBoost')) score += 8;    // 頻率
  if (selectedBadges.includes('armorBoost')) score += 5;    // 防禦
  if (selectedBadges.includes('powerBoost')) score += 4;    // 攻擊
  
  // 陷阱徽章懲分
  if (selectedBadges.includes('magicFocus')) score -= 10;
  if (selectedBadges.includes('rangedMastery')) score -= 8;
  if (selectedBadges.includes('elementalRes')) score -= 5;
  
  // 根據玩家技能調整
  let skillMultiplier = 1.0;
  switch(playerSkill) {
    case 'optimal':      skillMultiplier = 1.2; break;  // 最佳選擇
    case 'good':         skillMultiplier = 1.1; break;  // 良好選擇
    case 'random':       skillMultiplier = 1.0; break;  // 隨機選擇
    case 'poor':         skillMultiplier = 0.9; break;  // 糟糕選擇
    case 'worst':        skillMultiplier = 0.8; break;  // 最差選擇
  }
  
  const finalScore = score * skillMultiplier;
  
  // 轉換為勝率 (0-100%)
  let winRate = Math.min(95, Math.max(5, finalScore));
  
  return {
    score: finalScore,
    winRate: winRate,
    evaluation: getEvaluation(winRate)
  };
}

function getEvaluation(winRate) {
  if (winRate >= 85) return '🏆 重錘之王';
  if (winRate >= 75) return '⚔️ 重錘大師';
  if (winRate >= 65) return '🔨 重錘戰士';
  if (winRate >= 50) return '💪 初學者';
  if (winRate >= 35) return '😅 需要練習';
  return '💀 重新開始';
}

// 測試案例
export const TestCases = {
  optimal: ['hammerMastery', 'hammerStorm', 'hammerShield', 'hammerHeal', 'hammerFury', 'hammerWeight', 'hammerDuration'],
  good: ['hammerMastery', 'hammerStorm', 'hammerShield', 'hammerHeal', 'hammerFury', 'hammerWeight', 'vampiric'],
  average: ['hammerMastery', 'hammerStorm', 'hammerShield', 'hammerHeal', 'hammerFury', 'healthBoost', 'critBoost'],
  poor: ['hammerMastery', 'hammerStorm', 'hammerShield', 'hammerHeal', 'hammerFury', 'armorBoost', 'powerBoost'],
  worst: ['hammerMastery', 'hammerStorm', 'hammerShield', 'hammerHeal', 'hammerFury', 'magicFocus', 'rangedMastery']
};

console.log('🔨 重錘BD徽章系統已載入');
console.log('📊 測試勝率:');
Object.entries(TestCases).forEach(([name, badges]) => {
  const result = calculateWinRate(badges, name === 'optimal' ? 'optimal' : 'random');
  console.log(`${name}: ${result.winRate.toFixed(1)}% - ${result.evaluation}`);
});