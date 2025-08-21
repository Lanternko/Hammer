// src/data/enemies.js - 配置化版本
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

// 根據等級和類型生成敵人屬性 - 使用配置化成長曲線
export function getEnemyStats(level, type) {
  const data = EnemyData[type] || EnemyData.highHp;
  
  // 使用配置的敵人成長系統
  const scaling = GameConfigUtils.getEnemyScalingFactor(level);
  const levelOffset = GameConfigUtils.getLevelOffset(level);
  const growthFactor = scaling.baseMultiplier + levelOffset * scaling.factor;
  
  // 計算血量（使用配置的計算方法）
  const calculatedHp = GameConfigUtils.calculateEnemyHp(data.baseHp, level);
  
  // 攻擊力成長較快（保持原有的 0.95 指數）
  const calculatedAttack = Math.floor(data.baseAttack * Math.pow(growthFactor, 0.95));
  
  // 防禦力中等成長（保持原有的 0.7 指數）
  const calculatedDefense = Math.floor(data.defense * Math.pow(growthFactor, 0.7));
  
  if (GAME_CONFIG.DEBUG.ENABLED) {
    console.log(`🔧 [DEBUG] 敵人生成: ${data.name} 等級${level}`, {
      原始屬性: { hp: data.baseHp, attack: data.baseAttack, defense: data.defense },
      成長因子: growthFactor.toFixed(2),
      最終屬性: { hp: calculatedHp, attack: calculatedAttack, defense: calculatedDefense }
    });
  }
  
  return {
    name: data.name,
    emoji: data.emoji,
    description: data.description,
    type: type,
    level: level,
    
    // 使用配置化計算的屬性
    maxHp: calculatedHp,
    hp: calculatedHp,
    attack: calculatedAttack,
    
    // 攻擊速度保持不變
    attackSpeed: data.attackSpeed,
    // 使用配置的戰鬥FPS
    attackFrame: Math.round(GAME_CONFIG.BATTLE_FPS / data.attackSpeed),
    
    // 防禦力配置化計算
    defense: calculatedDefense,
    
    // 戰鬥狀態
    currentFrame: 0
  };
}

// 根據等級選擇敵人類型 - 配置化敵人池
export function selectEnemyType(level) {
  // 最終關是小頭目
  if (level === GAME_CONFIG.TOTAL_LEVELS) {
    return 'smallBoss';
  }
  
  // 使用配置的敵人池（如果配置中有定義）
  if (GAME_CONFIG.ENEMY_POOLS) {
    return selectFromConfiguredPools(level);
  }
  
  // 回退到硬編碼的敵人選擇邏輯
  return selectFromHardcodedPools(level);
}

// 從配置的敵人池中選擇（如果配置中有定義）
function selectFromConfiguredPools(level) {
  const pools = GAME_CONFIG.ENEMY_POOLS;
  let pool;
  
  if (level <= 3) pool = pools.EARLY || ['highSpeed', 'highHp'];
  else if (level <= 6) pool = pools.MID_EARLY || ['highSpeed', 'highHp', 'highDamage'];
  else if (level <= 10) pool = pools.MID || ['highSpeed', 'highDamage', 'highHp', 'berserker'];
  else if (level <= 15) pool = pools.LATE || ['highDamage', 'highHp', 'berserker', 'spellcaster', 'assassin'];
  else pool = pools.END || ['berserker', 'spellcaster', 'assassin', 'guardian', 'highDamage'];
  
  return pool[Math.floor(Math.random() * pool.length)];
}

// 硬編碼的敵人選擇邏輯（備用方案）
function selectFromHardcodedPools(level) {
  if (level <= 3) {
    const types = ['highSpeed', 'highHp'];
    return types[Math.floor(Math.random() * types.length)];
  } else if (level <= 6) {
    const types = ['highSpeed', 'highHp', 'highDamage'];
    return types[Math.floor(Math.random() * types.length)];
  } else if (level <= 10) {
    const types = ['highSpeed', 'highDamage', 'highHp', 'berserker'];
    return types[Math.floor(Math.random() * types.length)];
  } else if (level <= 15) {
    const types = ['highDamage', 'highHp', 'berserker', 'spellcaster', 'assassin'];
    return types[Math.floor(Math.random() * types.length)];
  } else {
    const types = ['berserker', 'spellcaster', 'assassin', 'guardian', 'highDamage'];
    return types[Math.floor(Math.random() * types.length)];
  }
}

// 敵人特殊能力處理 - 配置化特殊效果
export function applyEnemySpecialAbilities(enemy) {
  // 獲取特殊能力配置（如果存在）
  const specialConfig = GAME_CONFIG.ENEMY_SPECIAL_ABILITIES || {};
  
  switch(enemy.type) {
    case 'berserker':
      // 狂戰士：血量越少攻擊越高
      const berserkerConfig = specialConfig.berserker || { maxBonus: 0.8, threshold: 0.5 };
      const hpPercent = enemy.hp / enemy.maxHp;
      if (hpPercent < berserkerConfig.threshold) {
        const bonus = (berserkerConfig.threshold - hpPercent) * berserkerConfig.maxBonus;
        enemy.attack = Math.floor(enemy.attack * (1 + bonus));
        
        if (GAME_CONFIG.DEBUG.ENABLED) {
          console.log(`🔧 [DEBUG] 狂戰士效果: 血量${(hpPercent*100).toFixed(1)}% → 攻擊+${(bonus*100).toFixed(1)}%`);
        }
      }
      break;
      
    case 'spellcaster':
      // 法術師：魔法攻擊無視護甲
      const spellcasterConfig = specialConfig.spellcaster || { armorPiercing: 0.4 };
      enemy.magicAttack = true;
      enemy.armorPiercing = spellcasterConfig.armorPiercing;
      
      if (GAME_CONFIG.DEBUG.ENABLED) {
        console.log(`🔧 [DEBUG] 法術師效果: 無視${(spellcasterConfig.armorPiercing*100).toFixed(0)}%護甲`);
      }
      break;
      
    case 'assassin':
      // 暗影刺客：暴擊機率
      const assassinConfig = specialConfig.assassin || { critChance: 0.25 };
      enemy.critChance = assassinConfig.critChance;
      
      if (GAME_CONFIG.DEBUG.ENABLED) {
        console.log(`🔧 [DEBUG] 暗影刺客效果: ${(assassinConfig.critChance*100).toFixed(0)}%暴擊率`);
      }
      break;

    case 'guardian':
      // 遠古守護者：傷害吸收
      const guardianConfig = specialConfig.guardian || { damageThreshold: 100, healAmount: 10 };
      enemy.damageAbsorption = true;
      enemy.damageThreshold = guardianConfig.damageThreshold;
      enemy.healAmount = guardianConfig.healAmount;
      
      if (GAME_CONFIG.DEBUG.ENABLED) {
        console.log(`🔧 [DEBUG] 遠古守護者效果: 每受${guardianConfig.damageThreshold}傷害回復${guardianConfig.healAmount}血`);
      }
      break;
      
    case 'smallBoss':
      // 小頭目：全屬性提升
      const bossConfig = specialConfig.smallBoss || { 
        attackBonus: 1.15, 
        defenseBonus: 1.15, 
        hpBonus: 1.1 
      };
      
      enemy.attack = Math.floor(enemy.attack * bossConfig.attackBonus);
      enemy.defense = Math.floor(enemy.defense * bossConfig.defenseBonus);
      enemy.maxHp = Math.floor(enemy.maxHp * bossConfig.hpBonus);
      enemy.hp = enemy.maxHp;
      
      if (GAME_CONFIG.DEBUG.ENABLED) {
        console.log(`🔧 [DEBUG] 小頭目強化: 攻擊+${((bossConfig.attackBonus-1)*100).toFixed(0)}%, 防禦+${((bossConfig.defenseBonus-1)*100).toFixed(0)}%, 血量+${((bossConfig.hpBonus-1)*100).toFixed(0)}%`);
      }
      break;
  }
  
  return enemy;
}

// 獲取敵人顯示信息 - 配置化描述
export function getEnemyDisplayInfo(enemy) {
  const colors = GAME_CONFIG.UI_CONFIG.COLORS;
  
  let info = {
    name: `${enemy.emoji} ${enemy.name}`,
    stats: `HP: ${enemy.hp}/${enemy.maxHp} | 攻擊: ${enemy.attack} | 防禦: ${enemy.defense}`,
    specialAbilities: []
  };
  
  // 根據類型添加特殊能力說明
  const abilityDescriptions = GAME_CONFIG.ENEMY_ABILITY_DESCRIPTIONS || {
    berserker: '狂暴：血量越少攻擊越高',
    spellcaster: '魔法攻擊：無視40%護甲',
    assassin: '致命一擊：25%機率雙倍傷害',
    guardian: '吸收：受傷時回復血量',
    smallBoss: '頭目：全屬性強化'
  };
  
  if (abilityDescriptions[enemy.type]) {
    info.specialAbilities.push(abilityDescriptions[enemy.type]);
  }
  
  // 添加顏色信息（用於UI顯示）
  info.colors = {
    name: colors.SECONDARY,
    stats: colors.GOLD,
    abilities: colors.WARNING
  };
  
  return info;
}

// 計算敵人難度評估 - 配置化難度系統
export function getEnemyDifficultyRating(enemy, playerLevel) {
  // 使用配置的玩家基礎屬性來估算
  const expectedPlayerHp = GAME_CONFIG.PLAYER_BASE_STATS.HP + (playerLevel - 1) * 15;
  const expectedPlayerAttack = GAME_CONFIG.PLAYER_BASE_STATS.ATTACK + (playerLevel - 1) * 3;
  
  // 計算威脅係數
  const enemyThreat = (enemy.attack / expectedPlayerHp) + (enemy.maxHp / expectedPlayerAttack);
  
  // 使用配置的難度閾值（如果存在）
  const difficultyThresholds = GAME_CONFIG.DIFFICULTY_THRESHOLDS || {
    easy: 1.0,
    normal: 1.5,
    hard: 2.0
  };
  
  const colors = GAME_CONFIG.UI_CONFIG.COLORS;
  
  if (enemyThreat < difficultyThresholds.easy) {
    return { 
      rating: 'easy', 
      color: colors.SUCCESS, 
      text: '簡單',
      threat: enemyThreat.toFixed(2)
    };
  }
  if (enemyThreat < difficultyThresholds.normal) {
    return { 
      rating: 'normal', 
      color: colors.WARNING, 
      text: '普通',
      threat: enemyThreat.toFixed(2)
    };
  }
  if (enemyThreat < difficultyThresholds.hard) {
    return { 
      rating: 'hard', 
      color: '#FF9800', 
      text: '困難',
      threat: enemyThreat.toFixed(2)
    };
  }
  return { 
    rating: 'extreme', 
    color: colors.ERROR, 
    text: '極難',
    threat: enemyThreat.toFixed(2)
  };
}

// 驗證敵人數據完整性
export function validateEnemyData() {
  try {
    const issues = [];
    
    // 檢查每個敵人類型的必要屬性
    const requiredFields = ['name', 'emoji', 'baseHp', 'baseAttack', 'attackSpeed', 'defense', 'description'];
    
    Object.entries(EnemyData).forEach(([type, data]) => {
      requiredFields.forEach(field => {
        if (data[field] === undefined || data[field] === null) {
          issues.push(`敵人類型 ${type} 缺少必要欄位: ${field}`);
        }
      });
      
      // 檢查數值合理性
      if (data.baseHp <= 0) issues.push(`${type} 的 baseHp 必須大於 0`);
      if (data.baseAttack <= 0) issues.push(`${type} 的 baseAttack 必須大於 0`);
      if (data.attackSpeed <= 0) issues.push(`${type} 的 attackSpeed 必須大於 0`);
      if (data.defense < 0) issues.push(`${type} 的 defense 不能小於 0`);
    });
    
    // 檢查是否有重複的名稱或表情符號
    const names = Object.values(EnemyData).map(d => d.name);
    const emojis = Object.values(EnemyData).map(d => d.emoji);
    
    const duplicateNames = names.filter((name, index) => names.indexOf(name) !== index);
    const duplicateEmojis = emojis.filter((emoji, index) => emojis.indexOf(emoji) !== index);
    
    if (duplicateNames.length > 0) {
      issues.push(`重複的敵人名稱: ${[...new Set(duplicateNames)].join(', ')}`);
    }
    
    if (duplicateEmojis.length > 0) {
      issues.push(`重複的敵人表情符號: ${[...new Set(duplicateEmojis)].join(', ')}`);
    }
    
    if (issues.length > 0) {
      console.warn('⚠️ 敵人數據問題:', issues);
      return false;
    }
    
    console.log('✅ 敵人數據完整性檢查通過');
    return true;
    
  } catch (error) {
    console.error('❌ 敵人數據檢查失敗:', error);
    return false;
  }
}

// 獲取敵人統計信息（調試用）
export function getEnemyStatistics() {
  if (!GAME_CONFIG.DEBUG.ENABLED) return null;
  
  const stats = {
    totalTypes: Object.keys(EnemyData).length,
    averageStats: {},
    typeDistribution: {},
    difficultySpread: {}
  };
  
  // 計算平均屬性
  const allEnemies = Object.values(EnemyData);
  stats.averageStats = {
    hp: allEnemies.reduce((sum, e) => sum + e.baseHp, 0) / allEnemies.length,
    attack: allEnemies.reduce((sum, e) => sum + e.baseAttack, 0) / allEnemies.length,
    attackSpeed: allEnemies.reduce((sum, e) => sum + e.attackSpeed, 0) / allEnemies.length,
    defense: allEnemies.reduce((sum, e) => sum + e.defense, 0) / allEnemies.length
  };
  
  // 類型分布
  allEnemies.forEach(enemy => {
    const category = getEnemyCategory(enemy);
    stats.typeDistribution[category] = (stats.typeDistribution[category] || 0) + 1;
  });
  
  return stats;
}

// 獲取敵人類別（用於統計）
function getEnemyCategory(enemy) {
  if (enemy.baseHp > 120) return 'Tank';
  if (enemy.baseAttack > 25) return 'Damage Dealer';
  if (enemy.attackSpeed > 1.2) return 'Speed Fighter';
  if (enemy.defense > 15) return 'Defender';
  return 'Balanced';
}

// 平衡策略和建議（配置化）
export const BalanceStrategy = {
  // 從配置獲取平衡建議
  getBalanceRecommendations() {
    const config = GAME_CONFIG.BALANCE_RECOMMENDATIONS || {};
    
    return {
      levelRanges: config.levelRanges || {
        '1-3': '前期敵人適度提升，讓玩家感受到成長的重要性',
        '4-7': '中前期開始具有真正威脅，需要合理使用徽章',
        '8-12': '中期敵人大幅強化，考驗玩家的BD搭配',
        '13+': '後期敵人極具挑戰性，需要完善的重錘BD才能通關'
      },
      
      powerLevels: config.powerLevels || [
        '第1-3關：敵人攻擊力 16-20，適應期結束',
        '第4-7關：敵人攻擊力 20-30，開始需要策略',
        '第8-12關：敵人攻擊力 30-50，重錘BD變得關鍵',
        '第13關以後：敵人攻擊力 50+，需要完整的BD才能生存'
      ],
      
      counterMeasures: config.counterMeasures || [
        '提升敵人血量：讓重錘的眩暈效果不那麼OP',
        '增加敵人防禦：降低重錘的爆發傷害效果',
        '提升敵人攻速：縮短被眩暈的安全期',
        '特殊能力：某些敵人有反制重錘的機制'
      ]
    };
  },
  
  // 獲取特定等級的平衡建議
  getLevelBalanceAdvice(level) {
    const recommendations = this.getBalanceRecommendations();
    
    if (level <= 3) return recommendations.levelRanges['1-3'];
    if (level <= 7) return recommendations.levelRanges['4-7'];
    if (level <= 12) return recommendations.levelRanges['8-12'];
    return recommendations.levelRanges['13+'];
  }
};

// 在模組載入時執行驗證
if (GAME_CONFIG.DEBUG.ENABLED) {
  validateEnemyData();
  
  const statistics = getEnemyStatistics();
  if (statistics) {
    console.log('📊 敵人統計信息:', statistics);
  }
  
  const balance = BalanceStrategy.getBalanceRecommendations();
  console.log('⚖️ 平衡策略已載入:', balance);
}

console.log('👹 敵人系統配置化完成 - 使用動態成長曲線');