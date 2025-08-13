// src/data/enemies.js - 敵人數據配置
export const EnemyData = {
  highSpeed: {
    name: 'Swift Assassin',
    emoji: '💨',
    baseHp: 60,
    baseAttack: 8,
    attackSpeed: 1.5, // 快速攻擊
    defense: 3,
    description: '敏捷的刺客，攻擊速度極快但血量較低'
  },
  
  highDamage: {
    name: 'Heavy Warrior',
    emoji: '🔥',
    baseHp: 80,
    baseAttack: 25,
    attackSpeed: 0.4, // 緩慢但重擊
    defense: 8,
    description: '強力的戰士，攻擊力極高但攻擊速度慢'
  },
  
  highHp: {
    name: 'Tank Guardian',
    emoji: '🛡️',
    baseHp: 120,
    baseAttack: 10,
    attackSpeed: 0.8,
    defense: 12,
    description: '堅固的守護者，血量和防禦都很高'
  },
  
  // 特殊敵人類型
  smallBoss: {
    name: 'Mini Boss',
    emoji: '👑',
    baseHp: 150,
    baseAttack: 15,
    attackSpeed: 1.0,
    defense: 10,
    description: '小型頭目，各項屬性都很均衡但偏強'
  }
};

// 根據關卡和類型生成敵人屬性
export function getEnemyStats(level, type) {
  const data = EnemyData[type] || EnemyData.highHp;
  
  // 關卡成長公式：每5關增加20%屬性
  const growthFactor = 1 + (level - 1) * 0.04; // 每關增加4%
  
  return {
    name: data.name,
    emoji: data.emoji,
    description: data.description,
    type: type,
    level: level,
    
    // 血量成長最明顯
    maxHp: Math.floor(data.baseHp * growthFactor),
    hp: Math.floor(data.baseHp * growthFactor),
    
    // 攻擊力適度成長
    attack: Math.floor(data.baseAttack * Math.pow(growthFactor, 0.8)),
    
    // 攻擊速度保持不變
    attackSpeed: data.attackSpeed,
    attackFrame: Math.round(20 / data.attackSpeed),
    
    // 防禦輕微成長
    defense: Math.floor(data.defense * Math.pow(growthFactor, 0.6)),
    
    // 戰鬥狀態
    currentFrame: 0
  };
}

// 根據關卡選擇合適的敵人類型
export function selectEnemyType(level) {
  if (level === 20) {
    return 'smallBoss'; // 最終關卡是小頭目
  }
  
  // 根據關卡範圍選擇敵人類型，確保遊戲有變化性
  const types = ['highSpeed', 'highDamage', 'highHp'];
  
  if (level <= 5) {
    // 前期以高速敵人為主，較容易應對
    return Math.random() < 0.5 ? 'highSpeed' : types[Math.floor(Math.random() * types.length)];
  } else if (level <= 10) {
    // 中期引入更多變化
    return types[Math.floor(Math.random() * types.length)];
  } else if (level <= 15) {
    // 後期以困難敵人為主
    return Math.random() < 0.3 ? 'highSpeed' : (Math.random() < 0.5 ? 'highDamage' : 'highHp');
  } else {
    // 最後階段，困難敵人居多
    return Math.random() < 0.2 ? 'highSpeed' : (Math.random() < 0.5 ? 'highDamage' : 'highHp');
  }
}