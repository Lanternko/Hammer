// src/data/enemies.js - 前期平衡調整
export const EnemyData = {
  highSpeed: {
    name: '迅捷刺客',
    emoji: '💨',
    baseHp: 80,        // 稍微降低
    baseAttack: 12,     // 大幅降低前期攻擊力
    attackSpeed: 1.6,
    defense: 4,        // 降低防禦力
    description: '速度極快的刺客，攻擊頻繁但血量較少'
  },
  
  highDamage: {
    name: '重甲戰士',
    emoji: '🔥',
    baseHp: 100,        // 稍微降低
    baseAttack: 31,    // 大幅降低前期攻擊力
    attackSpeed: 0.4,
    defense: 9,        // 降低防禦力
    description: '攻擊力較高的戰士，攻擊緩慢但有一定威脅'
  },
  
  highHp: {
    name: '坦克守衛',
    emoji: '🛡️',
    baseHp: 120,       // 稍微降低
    baseAttack: 15,    // 大幅降低前期攻擊力
    attackSpeed: 0.8,
    defense: 11,       // 降低防禦力
    description: '血厚防高的守衛，攻擊力適中但很耐打'
  },
  
  // 特殊敵人類型
  smallBoss: {
    name: '小型頭目',
    emoji: '👑',
    baseHp: 125,
    baseAttack: 19,    // 降低頭目攻擊力
    attackSpeed: 1.0,
    defense: 12,       // 降低防禦力
    description: '小型頭目，各項屬性都不錯'
  },
  
  // 新增敵人類型（中後期出現）
  berserker: {
    name: '狂戰士',
    emoji: '😡',
    baseHp: 80,
    baseAttack: 20,    // 中期開始有威脅
    attackSpeed: 1.2,
    defense: 5,
    description: '瘋狂的戰士，血量越少攻擊越高'
  },
  
  spellcaster: {
    name: '法術師',
    emoji: '🧙',
    baseHp: 65,
    baseAttack: 16,    // 中期魔法攻擊
    attackSpeed: 0.7,
    defense: 4,
    description: '魔法攻擊無視部分護甲'
  }
};

// 根據等級和類型生成敵人屬性
export function getEnemyStats(level, type) {
  const data = EnemyData[type] || EnemyData.highHp;
  
  // 等級成長：前期較緩，後期較快
  let growthFactor;
  if (level <= 5) {
    growthFactor = 1 + (level - 1) * 0.05; // 前5關每級+3%
  } else if (level <= 10) {
    growthFactor = 1.15 + (level - 6) * 0.10; // 6-10關每級+6%
  } else if (level <= 15) {
    growthFactor = 1.4 + (level - 11) * 0.15; // 11-15關每級+9%
  } else {
    growthFactor = 1.75 + (level - 16) * 0.20; // 16-20關每級+12%
  }
  
  return {
    name: data.name,
    emoji: data.emoji,
    description: data.description,
    type: type,
    level: level,
    
    // 血量成長最顯著
    maxHp: Math.floor(data.baseHp * growthFactor),
    hp: Math.floor(data.baseHp * growthFactor),
    
    // 攻擊力成長適中
    attack: Math.floor(data.baseAttack * Math.pow(growthFactor, 0.9)),
    
    // 攻擊速度保持不變
    attackSpeed: data.attackSpeed,
    attackFrame: Math.round(20 / data.attackSpeed),
    
    // 防禦力輕微成長
    defense: Math.floor(data.defense * Math.pow(growthFactor, 0.6)),
    
    // 戰鬥狀態
    currentFrame: 0
  };
}

// 根據等級選擇敵人類型（前期更簡單）
export function selectEnemyType(level) {
  if (level === 20) {
    return 'smallBoss'; // 最終關是小頭目
  }
  
  // 根據關卡範圍決定敵人池
  if (level <= 5) {
    // 前期：只有最簡單的敵人
    const types = ['highSpeed', 'highHp'];
    return types[Math.floor(Math.random() * types.length)];
  } else if (level <= 8) {
    // 早期：引入高傷害敵人，但權重較低
    const types = ['highSpeed', 'highSpeed', 'highHp', 'highDamage']; // 高速和坦克權重更高
    return types[Math.floor(Math.random() * types.length)];
  } else if (level <= 12) {
    // 中期：平衡分布
    const types = ['highSpeed', 'highDamage', 'highHp'];
    return types[Math.floor(Math.random() * types.length)];
  } else if (level <= 16) {
    // 後期：引入特殊敵人
    const types = ['highDamage', 'highHp', 'berserker', 'spellcaster'];
    return types[Math.floor(Math.random() * types.length)];
  } else {
    // 最後階段：只有困難敵人
    const types = ['berserker', 'spellcaster', 'highDamage'];
    return types[Math.floor(Math.random() * types.length)];
  }
}

// 敵人特殊能力處理
export function applyEnemySpecialAbilities(enemy) {
  switch(enemy.type) {
    case 'berserker':
      // 狂戰士：血量越少攻擊越高
      const hpPercent = enemy.hp / enemy.maxHp;
      if (hpPercent < 0.5) {
        enemy.attack = Math.floor(enemy.attack * (1 + (0.5 - hpPercent) * 0.5)); // 降低增幅
      }
      break;
      
    case 'spellcaster':
      // 法術師：魔法攻擊無視30%護甲（降低從50%）
      enemy.magicAttack = true;
      enemy.armorPiercing = 0.3;
      break;
      
    case 'smallBoss':
      // 小頭目：全屬性略微提升
      enemy.attack = Math.floor(enemy.attack * 1.1);
      enemy.defense = Math.floor(enemy.defense * 1.1);
      break;
  }
  
  return enemy;
}

// 獲取敵人顯示信息
export function getEnemyDisplayInfo(enemy) {
  let info = {
    name: `${enemy.emoji} ${enemy.name}`,
    stats: `HP: ${enemy.hp}/${enemy.maxHp} | 攻擊: ${enemy.attack} | 防禦: ${enemy.defense}`,
    specialAbilities: []
  };
  
  // 根據類型添加特殊能力說明
  switch(enemy.type) {
    case 'berserker':
      info.specialAbilities.push('狂暴：血量越少攻擊越高');
      break;
    case 'spellcaster':
      info.specialAbilities.push('魔法攻擊：無視30%護甲');
      break;
    case 'smallBoss':
      info.specialAbilities.push('頭目：全屬性強化');
      break;
  }
  
  return info;
}

// 新增：計算敵人難度評估
export function getEnemyDifficultyRating(enemy, playerLevel) {
  const expectedPlayerHp = 100 + (playerLevel - 1) * 10; // 假設玩家每級+10血
  const expectedPlayerAttack = 20 + (playerLevel - 1) * 2; // 假設玩家每級+2攻擊
  
  const enemyThreat = (enemy.attack / expectedPlayerHp) + (enemy.maxHp / expectedPlayerAttack);
  
  if (enemyThreat < 0.8) return { rating: 'easy', color: '#4CAF50', text: '簡單' };
  if (enemyThreat < 1.2) return { rating: 'normal', color: '#FFC107', text: '普通' };
  if (enemyThreat < 1.6) return { rating: 'hard', color: '#FF9800', text: '困難' };
  return { rating: 'extreme', color: '#F44336', text: '極難' };
}

// 新增：前期敵人弱化建議
export const BalanceNotes = {
  level1to3: '前期敵人攻擊力大幅降低，讓玩家熟悉遊戲機制',
  level4to6: '逐漸增加難度，但仍保持在可管理範圍內',
  level7to10: '引入更多敵人類型，但攻擊力適中',
  level11plus: '後期敵人開始具有真正威脅性',
  
  recommendations: [
    '第1-3關：敵人攻擊力 6-8，讓玩家適應',
    '第4-6關：敵人攻擊力 8-12，學習徽章搭配',
    '第7-10關：敵人攻擊力 12-16，需要策略規劃',
    '第11關以後：敵人攻擊力快速增長，考驗玩家build'
  ]
};

console.log('⚖️ 敵人平衡調整完成 - 前期大幅降低難度');
console.log('📊 建議：', BalanceNotes.recommendations);