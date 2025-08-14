// src/data/enemies.js - 微調平衡版本（提升敵人威脅性）
export const EnemyData = {
  highSpeed: {
    name: '迅捷刺客',
    emoji: '💨',
    baseHp: 80,        // 稍微提升
    baseAttack: 12,     // 提升攻擊力
    attackSpeed: 1.6,   // 提升攻速
    defense: 6,         // 提升防禦
    description: '速度極快的刺客，攻擊頻繁但血量較少'
  },
  
  highDamage: {
    name: '重甲戰士',
    emoji: '🔥',
    baseHp: 105,        // 提升血量
    baseAttack: 30,     // 大幅提升攻擊力
    attackSpeed: 0.4,
    defense: 12,        // 提升防禦
    description: '攻擊力極高的戰士，攻擊緩慢但威脅巨大'
  },
  
  highHp: {
    name: '坦克守衛',
    emoji: '🛡️',
    baseHp: 120,        // 大幅提升血量
    baseAttack: 16,     // 提升攻擊力
    attackSpeed: 0.8,
    defense: 15,        // 大幅提升防禦
    description: '血厚防高的守衛，極其耐打且有一定威脅'
  },
  
  // 特殊敵人類型
  smallBoss: {
    name: '小型頭目',
    emoji: '👑',
    baseHp: 150,        // 大幅提升
    baseAttack: 28,     // 提升攻擊力
    attackSpeed: 1.0,
    defense: 18,        // 大幅提升防禦
    description: '小型頭目，各項屬性都很強'
  },
  
  // 新增敵人類型（中後期出現）
  berserker: {
    name: '狂戰士',
    emoji: '😡',
    baseHp: 90,
    baseAttack: 25,     // 提升攻擊力
    attackSpeed: 1.3,   // 提升攻速
    defense: 8,
    description: '瘋狂的戰士，血量越少攻擊越高'
  },
  
  spellcaster: {
    name: '法術師',
    emoji: '🧙',
    baseHp: 75,
    baseAttack: 22,     // 提升魔法攻擊
    attackSpeed: 0.8,
    defense: 6,
    description: '魔法攻擊無視部分護甲'
  },

  // 新增後期精英敵人
  assassin: {
    name: '暗影刺客',
    emoji: '🗡️',
    baseHp: 70,
    baseAttack: 35,     // 超高攻擊力
    attackSpeed: 1.3,
    defense: 4,
    description: '極致的攻擊力，但防禦薄弱'
  },

  guardian: {
    name: '遠古守護者',
    emoji: '🏛️',
    baseHp: 180,        // 超高血量
    baseAttack: 15,
    attackSpeed: 0.6,
    defense: 25,        // 超高防禦
    description: '遠古的守護者，幾乎刀槍不入'
  }
};

// 根據等級和類型生成敵人屬性 - 提升成長曲線
export function getEnemyStats(level, type) {
  const data = EnemyData[type] || EnemyData.highHp;
  
  // 更陡峭的等級成長曲線
  let growthFactor;
  if (level <= 3) {
    growthFactor = 1 + (level - 1) * 0.06; // 前3關每級+8%
  } else if (level <= 7) {
    growthFactor = 1.16 + (level - 4) * 0.10; // 4-7關每級+12%
  } else if (level <= 12) {
    growthFactor = 1.64 + (level - 8) * 0.15; // 8-12關每級+18%
  } else if (level <= 17) {
    growthFactor = 2.54 + (level - 13) * 0.20; // 13-17關每級+25%
  } else {
    growthFactor = 3.79 + (level - 18) * 0.30; // 18-20關每級+35%
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
    
    // 攻擊力成長較快
    attack: Math.floor(data.baseAttack * Math.pow(growthFactor, 0.95)),
    
    // 攻擊速度保持不變
    attackSpeed: data.attackSpeed,
    attackFrame: Math.round(20 / data.attackSpeed),
    
    // 防禦力中等成長
    defense: Math.floor(data.defense * Math.pow(growthFactor, 0.7)),
    
    // 戰鬥狀態
    currentFrame: 0
  };
}

// 根據等級選擇敵人類型 - 更有挑戰性的分布
export function selectEnemyType(level) {
  if (level === 20) {
    return 'smallBoss'; // 最終關是小頭目
  }
  
  // 根據關卡範圍決定敵人池
  if (level <= 3) {
    // 前期：基礎敵人
    const types = ['highSpeed', 'highHp'];
    return types[Math.floor(Math.random() * types.length)];
  } else if (level <= 6) {
    // 早期：引入高傷害敵人
    const types = ['highSpeed', 'highHp', 'highDamage'];
    return types[Math.floor(Math.random() * types.length)];
  } else if (level <= 10) {
    // 中前期：平衡分布
    const types = ['highSpeed', 'highDamage', 'highHp', 'berserker'];
    return types[Math.floor(Math.random() * types.length)];
  } else if (level <= 15) {
    // 中後期：更多特殊敵人
    const types = ['highDamage', 'highHp', 'berserker', 'spellcaster', 'assassin'];
    return types[Math.floor(Math.random() * types.length)];
  } else {
    // 最後階段：最強敵人組合
    const types = ['berserker', 'spellcaster', 'assassin', 'guardian', 'highDamage'];
    return types[Math.floor(Math.random() * types.length)];
  }
}

// 敵人特殊能力處理 - 增強特殊效果
export function applyEnemySpecialAbilities(enemy) {
  switch(enemy.type) {
    case 'berserker':
      // 狂戰士：血量越少攻擊越高
      const hpPercent = enemy.hp / enemy.maxHp;
      if (hpPercent < 0.5) {
        enemy.attack = Math.floor(enemy.attack * (1 + (0.5 - hpPercent) * 0.8)); // 提升增幅
      }
      break;
      
    case 'spellcaster':
      // 法術師：魔法攻擊無視40%護甲
      enemy.magicAttack = true;
      enemy.armorPiercing = 0.4; // 提升穿甲
      break;
      
    case 'assassin':
      // 暗影刺客：25%機率造成雙倍傷害
      enemy.critChance = 0.25;
      break;

    case 'guardian':
      // 遠古守護者：每受到100點傷害回復10點血量
      enemy.damageAbsorption = true;
      break;
      
    case 'smallBoss':
      // 小頭目：全屬性提升
      enemy.attack = Math.floor(enemy.attack * 1.15);
      enemy.defense = Math.floor(enemy.defense * 1.15);
      enemy.maxHp = Math.floor(enemy.maxHp * 1.1);
      enemy.hp = enemy.maxHp;
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
      info.specialAbilities.push('魔法攻擊：無視40%護甲');
      break;
    case 'assassin':
      info.specialAbilities.push('致命一擊：25%機率雙倍傷害');
      break;
    case 'guardian':
      info.specialAbilities.push('吸收：受傷時回復血量');
      break;
    case 'smallBoss':
      info.specialAbilities.push('頭目：全屬性強化');
      break;
  }
  
  return info;
}

// 計算敵人難度評估 - 更準確的評估
export function getEnemyDifficultyRating(enemy, playerLevel) {
  const expectedPlayerHp = 100 + (playerLevel - 1) * 15;
  const expectedPlayerAttack = 20 + (playerLevel - 1) * 3;
  
  const enemyThreat = (enemy.attack / expectedPlayerHp) + (enemy.maxHp / expectedPlayerAttack);
  
  if (enemyThreat < 1.0) return { rating: 'easy', color: '#4CAF50', text: '簡單' };
  if (enemyThreat < 1.5) return { rating: 'normal', color: '#FFC107', text: '普通' };
  if (enemyThreat < 2.0) return { rating: 'hard', color: '#FF9800', text: '困難' };
  return { rating: 'extreme', color: '#F44336', text: '極難' };
}

// 更新後的平衡策略
export const BalanceNotes = {
  level1to3: '前期敵人適度提升，讓玩家感受到成長的重要性',
  level4to7: '中前期開始具有真正威脅，需要合理使用徽章',
  level8to12: '中期敵人大幅強化，考驗玩家的BD搭配',
  level13plus: '後期敵人極具挑戰性，需要完善的重錘BD才能通關',
  
  recommendations: [
    '第1-3關：敵人攻擊力 16-20，適應期結束',
    '第4-7關：敵人攻擊力 20-30，開始需要策略',
    '第8-12關：敵人攻擊力 30-50，重錘BD變得關鍵',
    '第13關以後：敵人攻擊力 50+，需要完整的BD才能生存'
  ],

  hammerBDCounters: [
    '提升敵人血量：讓重錘的眩暈效果不那麼OP',
    '增加敵人防禦：降低重錘的爆發傷害效果',
    '提升敵人攻速：縮短被眩暈的安全期',
    '特殊能力：某些敵人有反制重錘的機制'
  ]
};

console.log('⚖️ 敵人平衡調整完成 - 提升挑戰性以平衡重錘BD');
console.log('📊 新策略：', BalanceNotes.recommendations);
console.log('🔨 重錘反制：', BalanceNotes.hammerBDCounters);