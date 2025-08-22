// src/config/GameConfig.js - 修復戰力顯示一致性
export const GAME_CONFIG = {
  // 🎮 基礎遊戲設定
  TOTAL_LEVELS: 20,
  BATTLE_FPS: 20,
  BASE_DELTA_TIME: 0.1,
  
  // ⚡ 戰鬥速度設定
  BATTLE_SPEEDS: {
    NORMAL: 1,
    FAST: 3,
    TURBO: 10
  },
  
  // 🎯 戰力系統配置 - 統一使用開根號顯示
  COMBAT_POWER_CONFIG: {
    // 🔧 修正：使用原始戰力值進行計算，但顯示開根號
    PLAYER_BASE_POWER: 1250,      // 原始戰力：100血×20攻×0.5攻速×(125EHP) = 1250
    ENEMY_BASE_POWER: 1250,       // 匹配玩家初始戰力
    GROWTH_RATE: 0.25,            // 每級25%成長
    
    // 🎨 統一顯示設定 - 一律開根號
    DISPLAY_AS_SQRT: true,        // 統一使用開根號顯示
    SQRT_DECIMALS: 1,             // 保留1位小數
    SHOW_RAW_IN_DEBUG: true,      // 調試時顯示原始值
    
    // 關鍵節點（原始戰力值，但顯示時會開根號）
    MILESTONES: {
      1: 1250,     // 顯示為 √1250 ≈ 35.4
      5: 3052,     // 顯示為 √3052 ≈ 55.2
      10: 11920,   // 顯示為 √11920 ≈ 109.2
      15: 46539,   // 顯示為 √46539 ≈ 215.7
      20: 181677   // 顯示為 √181677 ≈ 426.2
    }
  },
  
  // 🎯 遊戲難度設定
  DIFFICULTY_CONFIG: {
    GAME_DIFFICULTY: 1.0,
    ENEMY_STRENGTH: {
      VERY_EASY: 0.7,
      EASY: 0.85,
      NORMAL: 1.0,
      HARD: 1.2,
      NIGHTMARE: 1.5
    },
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
    
    STUN_ENABLED: false, // 禁用眩暈
    
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
  
  // 🎨 UI配置 - 增亮暫停界面
  UI_CONFIG: {
    COLORS: {
      PRIMARY: '#4ecdc4',
      SECONDARY: '#ff6b6b',
      SUCCESS: '#4CAF50',
      WARNING: '#FF9800',
      ERROR: '#F44336',
      GOLD: '#ffd700',
      // 🔧 新增：暫停界面專用顏色
      PAUSE_BG: 'rgba(45, 55, 75, 0.95)',      // 更亮的背景
      PAUSE_PANEL: 'rgba(255, 255, 255, 0.1)', // 更亮的面板
      PAUSE_BORDER: '#5a9fd4',                  // 更亮的邊框
      PAUSE_TEXT: '#ffffff'                     // 純白文字
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
  
  // 👤 玩家配置
  PLAYER_CONFIG: {
    BASE_STATS: {
      HP: 100,
      ATTACK: 20,
      ATTACK_SPEED: 0.5,
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

  // 👹 敵人配置
  ENEMY_CONFIG: {
    // 三參數系統設定
    THREE_PARAM_SYSTEM: {
      ENABLED: true,
      BASE_HP: 100,
      BASE_ATTACK_SPEED: 1.0,
      BASE_ARMOR: 20,
      ARMOR_GROWTH_RATE: 0.5,
    },
    
    // 平衡系統設定
    BALANCE_SYSTEM: {
      ENABLED: true,
      TARGET_ERROR_TOLERANCE: 0.05,
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
    
    BOSS_MULTIPLIER: 1.3,
    
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

// 🛠️ 遊戲配置工具類 - 統一戰力顯示
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
  
  // 🎨 統一戰力顯示格式化
  static formatCombatPowerForDisplay(rawPower, forceRaw = false) {
    // 🔧 修復：統一使用開根號顯示
    if (GAME_CONFIG.COMBAT_POWER_CONFIG.DISPLAY_AS_SQRT && !forceRaw) {
      const sqrtPower = Math.sqrt(rawPower);
      const decimals = GAME_CONFIG.COMBAT_POWER_CONFIG.SQRT_DECIMALS;
      return sqrtPower.toFixed(decimals);
    } else {
      // 原始戰力顯示（僅調試時使用）
      if (rawPower >= 1000000) {
        return (rawPower / 1000000).toFixed(1) + 'M';
      } else if (rawPower >= 1000) {
        return (rawPower / 1000).toFixed(1) + 'K';
      }
      return rawPower.toFixed(0);
    }
  }
  
  // 🎨 帶調試信息的戰力顯示
  static formatCombatPowerWithDebug(rawPower) {
    const displayPower = this.formatCombatPowerForDisplay(rawPower);
    
    if (GAME_CONFIG.DEBUG.ENABLED && GAME_CONFIG.COMBAT_POWER_CONFIG.SHOW_RAW_IN_DEBUG) {
      return `${displayPower} (原始:${rawPower.toFixed(0)})`;
    }
    
    return displayPower;
  }
  
  // 🧮 玩家戰力計算 - 統一格式
  static calculatePlayerCombatPower(player) {
    const dps = player.getEffectiveAttack() * player.getEffectiveAttackSpeed();
    const armor = player.getEffectiveArmor();
    const damageReduction = armor / (armor + 100);
    const ehp = player.maxHp / (1 - damageReduction);
    
    const rawPower = dps * ehp;
    
    return {
      rawPower: rawPower,
      displayPower: this.formatCombatPowerForDisplay(rawPower),
      displayWithDebug: this.formatCombatPowerWithDebug(rawPower),
      dps: dps.toFixed(1),
      ehp: ehp.toFixed(0)
    };
  }
  
  // 🧮 敵人戰力計算 - 統一格式
  static calculateEnemyCombatPower(enemy) {
    const dps = enemy.attack * enemy.attackSpeed;
    const armor = enemy.armor || enemy.defense || 0;
    const damageReduction = armor / (armor + 100);
    const ehp = enemy.maxHp / (1 - damageReduction);
    
    const rawPower = dps * ehp;
    
    return {
      rawPower: rawPower,
      displayPower: this.formatCombatPowerForDisplay(rawPower),
      displayWithDebug: this.formatCombatPowerWithDebug(rawPower),
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

  // 🎯 設定遊戲難度
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
      const configuredBasePower = GAME_CONFIG.COMBAT_POWER_CONFIG.PLAYER_BASE_POWER;
      
      // 只做基本檢查，不做精確計算
      if (!configuredBasePower || configuredBasePower <= 0) {
        issues.push('Player base power must be a positive number');
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

    // 檢查陣列是否存在
    if (!Array.isArray(GAME_CONFIG.EVENT_LEVELS)) {
      issues.push('EVENT_LEVELS must be an array');
    }
    
    if (!Array.isArray(GAME_CONFIG.BOSS_LEVELS)) {
      issues.push('BOSS_LEVELS must be an array');
    }

    if (issues.length > 0) {
      console.error('❌ 遊戲配置驗證失敗:', issues);
      return false;
    }
    
    console.log('✅ 遊戲配置驗證通過');
    return true;
  }
  
  // 簡化計算玩家基礎戰力
  static calculatePlayerBasePower() {
    const hp = GAME_CONFIG.PLAYER_CONFIG.BASE_STATS.HP || 100;
    const attack = GAME_CONFIG.PLAYER_CONFIG.BASE_STATS.ATTACK || 20;
    const attackSpeed = GAME_CONFIG.PLAYER_CONFIG.BASE_STATS.ATTACK_SPEED || 0.5;
    const armor = GAME_CONFIG.PLAYER_CONFIG.BASE_STATS.ARMOR || 20;
    
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
      
      // 戰力相關 - 統一顯示
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
    console.log(`🎯 玩家初始戰力: ${displayPower} (原始: ${playerBasePower.toFixed(0)})`);
    console.log(`👹 敵人基準戰力: ${GameConfigUtils.formatCombatPowerForDisplay(GAME_CONFIG.COMBAT_POWER_CONFIG.ENEMY_BASE_POWER)}`);
    console.log(`📈 戰力成長率: ${(GAME_CONFIG.COMBAT_POWER_CONFIG.GROWTH_RATE * 100).toFixed(0)}%/級`);
    console.log(`🎨 戰力顯示: 統一開根號模式 (√原始值)`);
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