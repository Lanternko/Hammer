// src/data/Enemies.js - 完整配置化修復版本
import { GAME_CONFIG, GameConfigUtils } from '../config/GameConfig.js';

export const EnemyData = {
  highSpeed: {
    name: '迅捷刺客',
    emoji: '💨',
    baseHp: 80,
    baseAttack: 12,
    attackSpeed: 1.6,
    defense: 6,
    description: '速度極快的刺客，攻擊頻繁但血量較少'
  },
  
  highDamage: {
    name: '重甲戰士',
    emoji: '🔥',
    baseHp: 105,
    baseAttack: 30,
    attackSpeed: 0.4,
    defense: 12,
    description: '攻擊力極高的戰士，攻擊緩慢但威脅巨大'
  },
  
  highHp: {
    name: '坦克守衛',
    emoji: '🛡️',
    baseHp: 120,
    baseAttack: 16,
    attackSpeed: 0.8,
    defense: 15,
    description: '血厚防高的守衛，極其耐打且有一定威脅'
  },
  
  // 特殊敵人類型
  smallBoss: {
    name: '小型頭目',
    emoji: '👑',
    baseHp: 150,
    baseAttack: 28,
    attackSpeed: 1.0,
    defense: 18,
    description: '小型頭目，各項屬性都很強'
  },
  
  // 新增敵人類型（中後期出現）
  berserker: {
    name: '狂戰士',
    emoji: '😡',
    baseHp: 90,
    baseAttack: 25,
    attackSpeed: 1.3,
    defense: 8,
    description: '瘋狂的戰士，血量越少攻擊越高'
  },
  
  spellcaster: {
    name: '法術師',
    emoji: '🧙',
    baseHp: 75,
    baseAttack: 22,
    attackSpeed: 0.8,
    defense: 6,
    description: '魔法攻擊無視部分護甲'
  },

  // 新增後期精英敵人
  assassin: {
    name: '暗影刺客',
    emoji: '🗡️',
    baseHp: 70,
    baseAttack: 35,
    attackSpeed: 1.3,
    defense: 4,
    description: '極致的攻擊力，但防禦薄弱'
  },

  guardian: {
    name: '遠古守護者',
    emoji: '🏛️',
    baseHp: 180,
    baseAttack: 15,
    attackSpeed: 0.6,
    defense: 25,
    description: '遠古的守護者，幾乎刀槍不入'
  }
};

// 🔧 完整修復：根據等級和類型生成敵人屬性
export function getEnemyStats(level, type) {
  const data = EnemyData[type] || EnemyData.highHp;
  
  // 🔧 直接使用配置化的成長計算，移除不存在的函數調用
  return {
    name: data.name,
    emoji: data.emoji,
    description: data.description,
    type: type,
    level: level,
    
    // 🔧 使用配置化的成長計算
    maxHp: GameConfigUtils.calculateEnemyGrowth(data.baseHp, level, 'hp'),
    hp: GameConfigUtils.calculateEnemyGrowth(data.baseHp, level, 'hp'),
    
    // 攻擊力成長較快
    attack: GameConfigUtils.calculateEnemyGrowth(data.baseAttack, level, 'attack'),
    
    // 攻擊速度保持不變
    attackSpeed: data.attackSpeed,
    attackFrame: Math.round(GAME_CONFIG.BATTLE_FPS / data.attackSpeed),
    
    // 防禦力中等成長
    defense: GameConfigUtils.calculateEnemyGrowth(data.defense, level, 'defense'),
    
    // 戰鬥狀態
    currentFrame: 0,
    
    // 眩暈狀態
    isStunned: false,
    stunDuration: 0
  };
}

// 根據等級選擇敵人類型 - 更有挑戰性的分布
export function selectEnemyType(level) {
  if (level === GAME_CONFIG.TOTAL_LEVELS) {
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

// 敵人特殊能力處理 - 使用配置
export function applyEnemySpecialAbilities(enemy) {
  const specialConfig = GAME_CONFIG.ENEMY_CONFIG.SPECIAL_ABILITIES;
  
  switch(enemy.type) {
    case 'berserker':
      // 狂戰士：血量越少攻擊越高
      const hpPercent = enemy.hp / enemy.maxHp;
      if (hpPercent < 0.5) {
        enemy.attack = Math.floor(enemy.attack * (1 + (0.5 - hpPercent) * specialConfig.BERSERKER_RAGE));
      }
      break;
      
    case 'spellcaster':
      // 法術師：魔法攻擊無視部分護甲
      enemy.magicAttack = true;
      enemy.armorPiercing = specialConfig.MAGIC_ARMOR_PIERCE;
      break;
      
    case 'assassin':
      // 暗影刺客：暴擊機率
      enemy.critChance = specialConfig.ASSASSIN_CRIT;
      break;

    case 'guardian':
      // 遠古守護者：每受到100點傷害回復10點血量
      enemy.damageAbsorption = true;
      break;
      
    case 'smallBoss':
      // 小頭目：全屬性提升 - 使用配置
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
      info.specialAbilities.push(`魔法攻擊：無視${(GAME_CONFIG.ENEMY_CONFIG.SPECIAL_ABILITIES.MAGIC_ARMOR_PIERCE * 100).toFixed(0)}%護甲`);
      break;
    case 'assassin':
      info.specialAbilities.push(`致命一擊：${(GAME_CONFIG.ENEMY_CONFIG.SPECIAL_ABILITIES.ASSASSIN_CRIT * 100).toFixed(0)}%機率雙倍傷害`);
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

// 計算敵人難度評估 - 使用配置
export function getEnemyDifficultyRating(enemy, playerLevel) {
  const expectedPlayerHp = GAME_CONFIG.PLAYER_CONFIG.BASE_STATS.HP + (playerLevel - 1) * GAME_CONFIG.PLAYER_CONFIG.LEVEL_UP.HP_GAIN;
  const expectedPlayerAttack = GAME_CONFIG.PLAYER_CONFIG.BASE_STATS.ATTACK + (playerLevel - 1) * GAME_CONFIG.PLAYER_CONFIG.LEVEL_UP.ATTACK_GAIN;
  
  const enemyThreat = (enemy.attack / expectedPlayerHp) + (enemy.maxHp / expectedPlayerAttack);
  
  if (enemyThreat < 1.0) return { rating: 'easy', color: GAME_CONFIG.UI_CONFIG.COLORS.SUCCESS, text: '簡單' };
  if (enemyThreat < 1.5) return { rating: 'normal', color: GAME_CONFIG.UI_CONFIG.COLORS.WARNING, text: '普通' };
  if (enemyThreat < 2.0) return { rating: 'hard', color: '#FF9800', text: '困難' };
  return { rating: 'extreme', color: GAME_CONFIG.UI_CONFIG.COLORS.ERROR, text: '極難' };
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

// 驗證敵人數據完整性
export function validateEnemyData() {
  try {
    let isValid = true;
    const missingData = [];
    
    // 檢查所有敵人類型是否有必要的屬性
    Object.entries(EnemyData).forEach(([type, data]) => {
      const requiredFields = ['name', 'emoji', 'baseHp', 'baseAttack', 'attackSpeed', 'defense'];
      
      requiredFields.forEach(field => {
        if (data[field] === undefined || data[field] === null) {
          missingData.push(`${type}.${field}`);
          isValid = false;
        }
      });
    });
    
    if (!isValid) {
      console.error('❌ 敵人數據不完整:', missingData);
    } else {
      console.log('✅ 敵人數據完整性檢查通過');
    }
    
    return isValid;
    
  } catch (error) {
    console.error('❌ 敵人數據檢查錯誤:', error);
    return false;
  }
}

// 配置化完成提示
if (GAME_CONFIG.DEBUG.ENABLED) {
  console.log('🔧 [DEBUG] Enemies.js 配置化完成:', {
    enemyTypes: Object.keys(EnemyData).length,
    battleFPS: GAME_CONFIG.BATTLE_FPS,
    specialAbilities: Object.keys(GAME_CONFIG.ENEMY_CONFIG.SPECIAL_ABILITIES)
  });
}

console.log('👹 敵人系統配置化完成 - 使用動態成長曲線');

// 自動驗證數據完整性
setTimeout(() => {
  validateEnemyData();
}, 100);