// src/data/badges.js
export const BadgeData = {
  armorBoost: {
    name: '護甲強化',
    description: '防禦力+10',
    effect: { armor: 10 },
    cost: 5,
    rarity: 'common',
    icon: '🛡️'
  },
  
  healthBoost: {
    name: '生命強化', 
    description: '最大生命值+20',
    effect: { maxHp: 20 },
    cost: 6,
    rarity: 'common',
    icon: '❤️'
  },
  
  speedBoost: {
    name: '攻速提升',
    description: '攻擊速度+0.2',
    effect: { attackSpeed: 0.2 },
    cost: 8,
    rarity: 'uncommon',
    icon: '⚡'
  },
  
  powerBoost: {
    name: '力量提升',
    description: '攻擊力+5',
    effect: { attack: 5 },
    cost: 7,
    rarity: 'common',
    icon: '⚔️'
  },
  
  critBoost: {
    name: '暴擊精通',
    description: '暴擊率+10%',
    effect: { critChance: 0.1 },
    cost: 10,
    rarity: 'rare',
    icon: '💥'
  },
  
  vampiric: {
    name: '吸血',
    description: '攻擊時回復5點生命值',
    effect: { lifesteal: 5 },
    cost: 12,
    rarity: 'rare',
    icon: '🩸'
  }
};

export function getRandomBadges(count = 3) {
  const badges = Object.keys(BadgeData);
  const selected = [];
  
  for (let i = 0; i < count && badges.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * badges.length);
    const badgeKey = badges.splice(randomIndex, 1)[0];
    selected.push({
      key: badgeKey,
      ...BadgeData[badgeKey]
    });
  }
  
  return selected;
}