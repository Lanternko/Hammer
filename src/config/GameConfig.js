// src/config/GameConfig.js - 修正版遊戲配置文件
export const GAME_CONFIG = {
  // 🎮 基礎遊戲設定
  TOTAL_LEVELS: 20,
  BATTLE_FPS: 20,
  BASE_DELTA_TIME: 0.1, // 基礎時間間隔（10fps -> 0.1秒）
  
  // ⚡ 戰鬥速度設定
  BATTLE_SPEEDS: {
    NORMAL: 1,
    FAST: 3,
    TURBO: 10
  },
  
  // 🎯 戰力系統配置（修正版）
  COMBAT_POWER_CONFIG: {
    // 🔧 修正：玩家初始戰力 = 100血×20攻×0.5攻速 = 1000
    PLAYER_BASE_POWER: 1000,      // 第1級玩家基準戰力
    ENEMY_BASE_POWER: 1000,       // 第1級敵人基準戰力（匹配玩家）
    GROWTH_RATE: 0.25,            // 每級25%成長
    
    // 顯示設定
    DISPLAY_AS_SQRT: true,        // 顯示為根號值（更友好）
    SQRT_DECIMALS: 1,             // 根號值保留1位小數
    
    // 關鍵節點（原始戰力值）
    MILESTONES: {
      1: 1000,     // √1000 ≈ 31.6
      5: 2441,     // √2441 ≈ 49.4
      10: 9537,    // √9537 ≈ 97.7
      15: 37253,   // √37253 ≈ 193.0
      20: 145520   // √145520 ≈ 381.5
    }
  },
  
  // 🎯 遊戲難度設定
  DIFFICULTY_CONFIG: {
    // 整體遊戲難度倍率
    GAME_DIFFICULTY: 1.0,     // 1.0 = 標準難度, 1.2 = 困難, 0.8 = 簡單
    
    // 敵人強度設定（影響戰力計算）
    ENEMY_STRENGTH: {
      VERY_EASY: 0.7,         // 戰力×0.7
      EASY: 0.85,             // 戰力×0.85
      NORMAL: 1.0,            // 標準戰力
      HARD: 1.2,              // 戰力×1.2
      NIGHTMARE: 1.5          // 戰力×1.5
    },
    
    // 當前難度設定
    CURRENT_DIFFICULTY: 'NORMAL'
  },
  
  // 💰 經濟系統
  GOLD_REWARDS: {
    NORMAL_LEVEL: 1,
    BOSS_LEVEL: 2,
    FINAL_LEVEL: 5,
    INTEREST_RATE: 0.1,
    MAX_INTEREST: 3
  },
  
  DIAMOND_REWARDS: {
    PER_5_LEVELS: 1,
    COMPLETION_BONUS: 5
  },
  
  // 🏪 事件關卡設定
  EVENT_LEVELS: [3, 8, 13, 18],
  BOSS_LEVELS: [5, 10, 15, 20],
  
  // 🔨 重錘BD配置
  HAMMER_CONFIG: {
    BASE_PROC_CHANCE: 0.25,
    BASE_DAMAGE_MULTIPLIER: 1.5,
    BASE_STUN_DURATION: 1.0,
    
    ENHANCED_PROC_CHANCE: 0.35,
    ENHANCED_DAMAGE_MULTIPLIER: 1.7,
    ENHANCED_STUN_DURATION: 2.0,
    
    STUN_ENABLED: false, // 🔧 禁用眩暈
    
    EFFECTS: {
      SHIELD_ARMOR: 10,
      SHIELD_DURATION: 5.0,
      HEAL_AMOUNT: 15,
      FURY_SPEED_BOOST: 1.5,
      FURY_DURATION: 3.0
    }
  },
  
  // ⚡ 反甲護盾配置
  REFLECT_ARMOR_CONFIG: {
    TRIGGER_INTERVAL: 5,
    DAMAGE_PERCENT: 0.05
  },
  
  // 🎨 UI配置
  UI_CONFIG: {
    COLORS: {
      PRIMARY: '#4ecdc4',
      SECONDARY: '#ff6b6b',
      SUCCESS: '#4CAF50',
      WARNING: '#FF9800',
      ERROR: '#F44336',
      GOLD: '#ffd700'
    },
    
    Z_INDEX: {
      PANELS: 100,
      SPEED_CONTROL: 200,
      OVERLAYS: 1000,
      BATTLE_RESULTS: 1500,
      BADGES: 2000,
      GAME_OVER: 2500
    }
  },
  
  // ⏱️ 時間設定
  BATTLE_RESULT_DISPLAY_TIME: 0,
  DAMAGE_DISPLAY_DURATION: 2000,
  
  // 👤 玩家配置（修正版）
  PLAYER_CONFIG: {
    BASE_STATS: {
      HP: 100,            // 🔧 對應戰力計算
      ATTACK: 20,         // 🔧 對應戰力計算
      ATTACK_SPEED: 0.5,  // 🔧 對應戰力計算
      ARMOR: 20,
      FLAT_REDUCTION: 5,
      CRIT_CHANCE: 0.1
    },
    
    LEVEL_UP: {
      HP_GAIN: 10,
      ATTACK_GAIN: 2,
      EXP_MULTIPLIER: 1.2
    }
  },

  // 👹 敵人配置（整合三參數系統）
  ENEMY_CONFIG: {
    // 三參數系統設定
    THREE_PARAM_SYSTEM: {
      ENABLED: true,                    // 啟用三參數系統
      BASE_HP: 100,                     // 基準血量
      BASE_ATTACK_SPEED: 1.0,           // 基準攻速
      BASE_ARMOR: 20,                   // 基準護甲
      ARMOR_GROWTH_RATE: 0.5,           // 護甲成長速度（相對於其他屬性）
    },
    
    // 平衡系統設定
    BALANCE_SYSTEM: {
      ENABLED: true,
      TARGET_ERROR_TOLERANCE: 0.05,     // 5%誤差內視為平衡
      MAX_SOLVER_ITERATIONS: 50,
      SEARCH_RANGE: [0.1, 10.0],
      PRECISION: 0.01
    },
    
    // 舊版成長率（作為備用）
    GROWTH_RATES: {
      EARLY_GAME: 0.06,
      MID_GAME: 0.10,
      LATE_GAME: 0.15,
      END_GAME: 0.20
    },
    
    BOSS_MULTIPLIER: 1.3,  // Boss強度倍率
    
    SPECIAL_ABILITIES: {
      BERSERKER_RAGE: 0.8,
      MAGIC_ARMOR_PIERCE: 0.4,
      ASSASSIN_CRIT: 0.25
    }
  },

  // 🎯 平衡配置
  BALANCE_CONFIG: {
    DAMAGE_SCALING: {
      PLAYER_ATTACK_GROWTH: 1.0,
      ENEMY_HP_GROWTH: 1.2,
      ARMOR_EFFECTIVENESS: 1.0
    },
    
    DIFFICULTY_CURVE: {
      LEVEL_1_TO_5: 1.0,
      LEVEL_6_TO_10: 1.2,
      LEVEL_11_TO_15: 1.5,
      LEVEL_16_TO_20: 2.0
    },
    
    VALIDATION: {
      ENABLED: true,
      LOG_WARNINGS: true,
      AUTO_FIX: false
    }
  },

  // 🔧 調試設定
  DEBUG: {
    ENABLED: false,
    LOG_BATTLE_STATS: false,
    SHOW_PERFORMANCE_METRICS: false,
    SHOW_BALANCE_INFO: false,
    ENABLE_BALANCE_TESTING: false
  }
};

// 🛠️ 遊戲配置工具類（更新版）
export class GameConfigUtils {
  
  // 🎯 獲取戰力相關方法
  static getTargetCombatPower(level, difficulty = null) {
    const basePower = GAME_CONFIG.COMBAT_POWER_CONFIG.ENEMY_BASE_POWER;
    const growthRate = GAME_CONFIG.COMBAT_POWER_CONFIG.GROWTH_RATE;
    
    // 使用里程碑數值或公式計算
    const milestones = GAME_CONFIG.COMBAT_POWER_CONFIG.MILESTONES;
    let targetPower;
    
    if (milestones[level]) {
      targetPower = milestones[level];
    } else {
      targetPower = basePower * Math.pow(1 + growthRate, level - 1);
    }
    
    // 應用難度修正
    const currentDifficulty = difficulty || GAME_CONFIG.DIFFICULTY_CONFIG.CURRENT_DIFFICULTY;
    const difficultyMultiplier = GAME_CONFIG.DIFFICULTY_CONFIG.ENEMY_STRENGTH[currentDifficulty] || 1.0;
    
    return targetPower * difficultyMultiplier;
  }
  
  // 🎨 格式化戰力顯示
  static formatCombatPowerForDisplay(rawPower) {
    if (GAME_CONFIG.COMBAT_POWER_CONFIG.DISPLAY_AS_SQRT) {
      const sqrtPower = Math.sqrt(rawPower);
      const decimals = GAME_CONFIG.COMBAT_POWER_CONFIG.SQRT_DECIMALS;
      return sqrtPower.toFixed(decimals);
    } else {
      // 顯示原始戰力
      if (rawPower >= 1000000) {
        return (rawPower / 1000000).toFixed(1) + 'M';
      } else if (rawPower >= 1000) {
        return (rawPower / 1000).toFixed(1) + 'K';
      }
      return rawPower.toFixed(0);
    }
  }
  
  // 🧮 玩家戰力計算
  static calculatePlayerCombatPower(player) {
    const dps = player.getEffectiveAttack() * player.getEffectiveAttackSpeed();
    const armor = player.getEffectiveArmor();
    const damageReduction = armor / (armor + 100);
    const ehp = player.maxHp / (1 - damageReduction);
    
    const rawPower = dps * ehp;
    
    return {
      rawPower: rawPower,
      displayPower: this.formatCombatPowerForDisplay(rawPower),
      dps: dps.toFixed(1),
      ehp: ehp.toFixed(0)
    };
  }
  
  // 🧮 敵人戰力計算
  static calculateEnemyCombatPower(enemy) {
    const dps = enemy.attack * enemy.attackSpeed;
    const armor = enemy.armor || enemy.defense || 0;
    const damageReduction = armor / (armor + 100);
    const ehp = enemy.maxHp / (1 - damageReduction);
    
    const rawPower = dps * ehp;
    
    return {
      rawPower: rawPower,
      displayPower: this.formatCombatPowerForDisplay(rawPower),
      dps: dps.toFixed(1),
      ehp: ehp.toFixed(0)
    };
  }
  
  // 檢查是否為事件關卡
  static isEventLevel(level) {
    return GAME_CONFIG.EVENT_LEVELS.includes(level);
  }
  
  // 檢查是否為Boss關卡
  static isBossLevel(level) {
    return GAME_CONFIG.BOSS_LEVELS.includes(level);
  }
  
  // 獲取金幣獎勵
  static getGoldReward(level) {
    if (level === GAME_CONFIG.TOTAL_LEVELS) {
      return GAME_CONFIG.GOLD_REWARDS.FINAL_LEVEL;
    } else if (this.isBossLevel(level)) {
      return GAME_CONFIG.GOLD_REWARDS.BOSS_LEVEL;
    } else {
      return GAME_CONFIG.GOLD_REWARDS.NORMAL_LEVEL;
    }
  }
  
  // 獲取重錘觸發機率
  static getHammerProcChance(hasWeight = false) {
    return hasWeight ? 
      GAME_CONFIG.HAMMER_CONFIG.ENHANCED_PROC_CHANCE : 
      GAME_CONFIG.HAMMER_CONFIG.BASE_PROC_CHANCE;
  }
  
  // 獲取重錘傷害倍率
  static getHammerDamageMultiplier(hasWeight = false) {
    return hasWeight ? 
      GAME_CONFIG.HAMMER_CONFIG.ENHANCED_DAMAGE_MULTIPLIER : 
      GAME_CONFIG.HAMMER_CONFIG.BASE_DAMAGE_MULTIPLIER;
  }
  
  // 獲取重錘眩暈時間
  static getHammerStunDuration(hasDuration = false) {
    if (!GAME_CONFIG.HAMMER_CONFIG.STUN_ENABLED) return 0;
    
    return hasDuration ? 
      GAME_CONFIG.HAMMER_CONFIG.ENHANCED_STUN_DURATION : 
      GAME_CONFIG.HAMMER_CONFIG.BASE_STUN_DURATION;
  }

  // 獲取玩家基礎屬性
  static getPlayerBaseStat(statName) {
    return GAME_CONFIG.PLAYER_CONFIG.BASE_STATS[statName.toUpperCase()] || 0;
  }

  // 🎯 新增：設定遊戲難度
  static setGameDifficulty(difficulty) {
    const validDifficulties = Object.keys(GAME_CONFIG.DIFFICULTY_CONFIG.ENEMY_STRENGTH);
    
    if (validDifficulties.includes(difficulty)) {
      GAME_CONFIG.DIFFICULTY_CONFIG.CURRENT_DIFFICULTY = difficulty;
      console.log(`🎯 遊戲難度設定為: ${difficulty} (${GAME_CONFIG.DIFFICULTY_CONFIG.ENEMY_STRENGTH[difficulty]}x)`);
      return true;
    } else {
      console.warn(`⚠️ 無效的難度設定: ${difficulty}`);
      return false;
    }
  }

  // 獲取有效的戰鬥速度
  static getValidBattleSpeed(speed) {
    const validSpeeds = Object.values(GAME_CONFIG.BATTLE_SPEEDS);
    return validSpeeds.includes(speed) ? speed : GAME_CONFIG.BATTLE_SPEEDS.NORMAL;
  }
  
  // 驗證配置完整性
  static validateConfig() {
    const issues = [];
    
    // 檢查必要的配置項
    if (!GAME_CONFIG.TOTAL_LEVELS || GAME_CONFIG.TOTAL_LEVELS < 1) {
      issues.push('TOTAL_LEVELS must be a positive number');
    }
    
    if (!GAME_CONFIG.BATTLE_FPS || GAME_CONFIG.BATTLE_FPS < 1) {
      issues.push('BATTLE_FPS must be a positive number');
    }
    
    // 檢查戰力配置
    if (!GAME_CONFIG.COMBAT_POWER_CONFIG) {
      issues.push('COMBAT_POWER_CONFIG is required');
    } else {
      // 驗證玩家初始戰力計算
      const configuredBasePower = GAME_CONFIG.COMBAT_POWER_CONFIG.PLAYER_BASE_POWER;
      const calculatedBasePower = this.calculatePlayerBasePower();
      
      if (Math.abs(configuredBasePower - calculatedBasePower) > calculatedBasePower * 0.05) {
        issues.push(`Player base power mismatch: configured=${configuredBasePower}, calculated=${calculatedBasePower}`);
      }
    }
    
    // 檢查事件關卡
    const invalidEventLevels = GAME_CONFIG.EVENT_LEVELS.filter(
      level => level < 1 || level > GAME_CONFIG.TOTAL_LEVELS
    );
    if (invalidEventLevels.length > 0) {
      issues.push(`Invalid event levels: ${invalidEventLevels.join(', ')}`);
    }
    
    // 檢查Boss關卡
    const invalidBossLevels = GAME_CONFIG.BOSS_LEVELS.filter(
      level => level < 1 || level > GAME_CONFIG.TOTAL_LEVELS
    );
    if (invalidBossLevels.length > 0) {
      issues.push(`Invalid boss levels: ${invalidBossLevels.join(', ')}`);
    }

    if (issues.length > 0) {
      console.error('❌ 遊戲配置驗證失敗:', issues);
      return false;
    }
    
    console.log('✅ 遊戲配置驗證通過');
    return true;
  }
  
  // 計算玩家基礎戰力（用於驗證）
  static calculatePlayerBasePower() {
    const hp = GAME_CONFIG.PLAYER_CONFIG.BASE_STATS.HP;
    const attack = GAME_CONFIG.PLAYER_CONFIG.BASE_STATS.ATTACK;
    const attackSpeed = GAME_CONFIG.PLAYER_CONFIG.BASE_STATS.ATTACK_SPEED;
    const armor = GAME_CONFIG.PLAYER_CONFIG.BASE_STATS.ARMOR;
    
    const dps = attack * attackSpeed;
    const damageReduction = armor / (armor + 100);
    const ehp = hp / (1 - damageReduction);
    
    return dps * ehp;
  }
  
  // 獲取配置摘要
  static getConfigSummary() {
    const playerBasePower = this.calculatePlayerBasePower();
    
    return {
      levels: GAME_CONFIG.TOTAL_LEVELS,
      battleFPS: GAME_CONFIG.BATTLE_FPS,
      eventLevels: GAME_CONFIG.EVENT_LEVELS,
      bossLevels: GAME_CONFIG.BOSS_LEVELS,
      hammerStunEnabled: GAME_CONFIG.HAMMER_CONFIG.STUN_ENABLED,
      debugMode: GAME_CONFIG.DEBUG.ENABLED,
      
      // 戰力相關
      playerBasePower: playerBasePower,
      playerDisplayPower: this.formatCombatPowerForDisplay(playerBasePower),
      enemyBasePower: GAME_CONFIG.COMBAT_POWER_CONFIG.ENEMY_BASE_POWER,
      growthRate: GAME_CONFIG.COMBAT_POWER_CONFIG.GROWTH_RATE,
      displayAsRoot: GAME_CONFIG.COMBAT_POWER_CONFIG.DISPLAY_AS_SQRT,
      
      // 三參數系統
      threeParamSystemEnabled: GAME_CONFIG.ENEMY_CONFIG.THREE_PARAM_SYSTEM.ENABLED,
      balanceSystemEnabled: GAME_CONFIG.ENEMY_CONFIG.BALANCE_SYSTEM.ENABLED,
      currentDifficulty: GAME_CONFIG.DIFFICULTY_CONFIG.CURRENT_DIFFICULTY
    };
  }
}

// 🔧 配置預設值檢查
export function initializeGameConfig() {
  console.log('🔧 初始化遊戲配置...');
  
  // 驗證配置
  const isValid = GameConfigUtils.validateConfig();
  
  if (isValid) {
    console.log('📊 配置摘要:', GameConfigUtils.getConfigSummary());
    
    // 輸出重要設定狀態
    const playerBasePower = GameConfigUtils.calculatePlayerBasePower();
    const displayPower = GameConfigUtils.formatCombatPowerForDisplay(playerBasePower);
    
    console.log(`🔨 重錘眩暈: ${GAME_CONFIG.HAMMER_CONFIG.STUN_ENABLED ? '啟用' : '禁用'}`);
    console.log(`🔧 調試模式: ${GAME_CONFIG.DEBUG.ENABLED ? '啟用' : '禁用'}`);
    console.log(`⚡ 戰鬥FPS: ${GAME_CONFIG.BATTLE_FPS}`);
    console.log(`🎯 玩家初始戰力: ${playerBasePower.toFixed(0)} (顯示: ${displayPower})`);
    console.log(`👹 敵人基準戰力: ${GAME_CONFIG.COMBAT_POWER_CONFIG.ENEMY_BASE_POWER} (匹配玩家)`);
    console.log(`📈 戰力成長率: ${(GAME_CONFIG.COMBAT_POWER_CONFIG.GROWTH_RATE * 100).toFixed(0)}%/級`);
    console.log(`🎨 戰力顯示: ${GAME_CONFIG.COMBAT_POWER_CONFIG.DISPLAY_AS_SQRT ? '根號模式' : '原始值'}`);
    console.log(`⚖️ 三參數系統: ${GAME_CONFIG.ENEMY_CONFIG.THREE_PARAM_SYSTEM.ENABLED ? '啟用' : '禁用'}`);
    console.log(`🎯 遊戲難度: ${GAME_CONFIG.DIFFICULTY_CONFIG.CURRENT_DIFFICULTY}`);
  }
  
  return isValid;
}

// 🎯 配置熱更新功能（開發用）
export function updateGameConfig(path, value) {
  if (GAME_CONFIG.DEBUG.ENABLED) {
    const keys = path.split('.');
    let current = GAME_CONFIG;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        console.error(`❌ 配置路徑不存在: ${path}`);
        return false;
      }
      current = current[keys[i]];
    }
    
    const lastKey = keys[keys.length - 1];
    const oldValue = current[lastKey];
    current[lastKey] = value;
    
    console.log(`🔧 配置更新: ${path} = ${oldValue} → ${value}`);
    return true;
  } else {
    console.warn('⚠️ 配置熱更新僅在調試模式下可用');
    return false;
  }
}

// 自動初始化配置
setTimeout(() => {
  initializeGameConfig();
}, 50);