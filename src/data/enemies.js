// src/data/Enemies.js - 提高敵人攻擊力
export const EnemyData = {
  highSpeed: {
    name: '迅捷刺客',
    emoji: '💨',
    baseHp: 60,
    baseAttack: 15, // 從8提高到15
    attackSpeed: 1.5,
    defense: 5, // 增加防禦力
    description: '速度極快的刺客，攻擊頻繁但血量較少'
  },
  
  highDamage: {
    name: '重甲戰士',
    emoji: '🔥',
    baseHp: 80,
    baseAttack: 35, // 從25提高到35
    attackSpeed: 0.4,
    defense: 12, // 增加防禦力
    description: '攻擊力極高的戰士，攻擊緩慢但傷害可怖'
  },
  
  highHp: {
    name: '坦克守衛',
    emoji: '🛡️',
    baseHp: 120,
    baseAttack: 18, // 從10提高到18
    attackSpeed: 0.8,
    defense: 15, // 增加防禦力
    description: '血厚防高的守衛，全方位平衡但攻擊力不俗'
  },
  
  // 特殊敵人類型
  smallBoss: {
    name: '小型頭目',
    emoji: '👑',
    baseHp: 150,
    baseAttack: 25, // 從15提高到25
    attackSpeed: 1.0,
    defense: 18, // 增加防禦力
    description: '小型頭目，各項屬性都很出色'
  },
  
  // 新增敵人類型
  berserker: {
    name: '狂戰士',
    emoji: '😡',
    baseHp: 90,
    baseAttack: 30, // 高攻擊
    attackSpeed: 1.2,
    defense: 8,
    description: '瘋狂的戰士，血量越少攻擊越高'
  },
  
  spellcaster: {
    name: '法術師',
    emoji: '🧙',
    baseHp: 70,
    baseAttack: 22, // 中等攻擊
    attackSpeed: 0.7,
    defense: 6,
    description: '魔法攻擊無視部分護甲'
  }
};

// 根據等級和類型生成敵人屬性
export function getEnemyStats(level, type) {
  const data = EnemyData[type] || EnemyData.highHp;
  
  // 等級成長：每級+6%（從+4%提高）
  const growthFactor = 1 + (level - 1) * 0.06;
  
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
    attack: Math.floor(data.baseAttack * Math.pow(growthFactor, 0.85)),
    
    // 攻擊速度保持不變
    attackSpeed: data.attackSpeed,
    attackFrame: Math.round(20 / data.attackSpeed),
    
    // 防禦力輕微成長
    defense: Math.floor(data.defense * Math.pow(growthFactor, 0.7)),
    
    // 戰鬥狀態
    currentFrame: 0
  };
}

// 根據等級選擇敵人類型（增加變化）
export function selectEnemyType(level) {
  if (level === 20) {
    return 'smallBoss'; // 最終關是小頭目
  }
  
  // 根據關卡範圍決定敵人池
  if (level <= 3) {
    // 前期：較簡單的敵人
    const types = ['highSpeed', 'highHp'];
    return types[Math.floor(Math.random() * types.length)];
  } else if (level <= 7) {
    // 早期：引入高傷害敵人
    const types = ['highSpeed', 'highDamage', 'highHp'];
    return types[Math.floor(Math.random() * types.length)];
  } else if (level <= 12) {
    // 中期：引入特殊敵人
    const types = ['highSpeed', 'highDamage', 'highHp', 'berserker'];
    return types[Math.floor(Math.random() * types.length)];
  } else if (level <= 17) {
    // 後期：更多特殊敵人
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
        enemy.attack = Math.floor(enemy.baseAttack * (1 + (0.5 - hpPercent)));
      }
      break;
      
    case 'spellcaster':
      // 法術師：魔法攻擊無視50%護甲
      enemy.magicAttack = true;
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
      info.specialAbilities.push('魔法攻擊：無視50%護甲');
      break;
    case 'smallBoss':
      info.specialAbilities.push('頭目：全屬性強化');
      break;
  }
  
  return info;
}