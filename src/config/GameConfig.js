// src/config/GameConfig.js - 遊戲配置文件
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
  
  // 💰 經濟系統
  GOLD_REWARDS: {
    NORMAL_LEVEL: 1,
    BOSS_LEVEL: 2,
    FINAL_LEVEL: 5,
    INTEREST_RATE: 0.1, // 每10金幣+1利息
    MAX_INTEREST: 3
  },
  
  DIAMOND_REWARDS: {
    PER_5_LEVELS: 1,      // 每5關給1鑽石
    COMPLETION_BONUS: 5   // 通關額外獎勵
  },
  
  // 🏪 事件關卡設定
  EVENT_LEVELS: [3, 8, 13, 18], // 商店關卡
  BOSS_LEVELS: [5, 10, 15, 20], // Boss關卡（里程碑徽章）
  
  // 🔨 重錘BD配置
  HAMMER_CONFIG: {
    // 基礎重錘精通效果
    BASE_PROC_CHANCE: 0.25,        // 25%觸發機率
    BASE_DAMAGE_MULTIPLIER: 1.5,   // 150%傷害倍率
    BASE_STUN_DURATION: 1.0,       // 1秒眩暈
    
    // 強化版重錘效果（重錘加重）
    ENHANCED_PROC_CHANCE: 0.35,    // 35%觸發機率
    ENHANCED_DAMAGE_MULTIPLIER: 1.7, // 170%傷害倍率
    ENHANCED_STUN_DURATION: 2.0,   // 2秒眩暈（重錘延續）
    
    // 眩暈開關（可用於平衡調整）
    STUN_ENABLED: false, // 🔧 設為 false 禁用眩暈效果
    
    // 其他重錘效果數值
    EFFECTS: {
      SHIELD_ARMOR: 10,           // 重錘護盾：+10護甲
      SHIELD_DURATION: 5.0,       // 重錘護盾：持續5秒
      HEAL_AMOUNT: 15,            // 重錘恢復：+15血量
      FURY_SPEED_BOOST: 1.5,      // 重錘狂怒：攻速+50%
      FURY_DURATION: 3.0          // 重錘狂怒：持續3秒
    }
  },
  
  // ⚡ 反甲護盾配置
  REFLECT_ARMOR_CONFIG: {
    TRIGGER_INTERVAL: 5,    // 每受傷5次觸發一次
    DAMAGE_PERCENT: 0.05    // 造成敵人最大血量5%的傷害
  },
  
  // 🎨 UI配置
  UI_CONFIG: {
    COLORS: {
      PRIMARY: '#4ecdc4',      // 主色調（青綠色）
      SECONDARY: '#ff6b6b',    // 次要色（紅色）
      SUCCESS: '#4CAF50',      // 成功色（綠色）
      WARNING: '#FF9800',      // 警告色（橙色）
      ERROR: '#F44336',        // 錯誤色（紅色）
      GOLD: '#ffd700'          // 金色
    },
    
    Z_INDEX: {
      PANELS: 100,             // 統計面板、Buff面板
      SPEED_CONTROL: 200,      // 速度控制按鈕
      OVERLAYS: 1000,          // 升級選擇、商店
      BATTLE_RESULTS: 1500,    // 戰鬥結果
      BADGES: 2000,            // 徽章獲得
      GAME_OVER: 2500          // 遊戲結束
    }
  },
  
  // ⏱️ 時間設定
  BATTLE_RESULT_DISPLAY_TIME: 0, // 🔧 設為0，完全由點擊控制
  DAMAGE_DISPLAY_DURATION: 2000,  // 傷害數字顯示2秒
  
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
    GROWTH_RATES: {
      EARLY_GAME: 0.06,    // 前3關每級+6%
      MID_GAME: 0.10,      // 4-7關每級+10%
      LATE_GAME: 0.15,     // 8-12關每級+15%
      END_GAME: 0.20       // 13關以後每級+20%
    },
    
    BOSS_MULTIPLIER: 2.0,  // Boss血量倍率
    SPECIAL_ABILITIES: {
      BERSERKER_RAGE: 0.8,     // 狂戰士血量低於50%時攻擊增幅
      MAGIC_ARMOR_PIERCE: 0.4,  // 法術師穿甲率
      ASSASSIN_CRIT: 0.25       // 刺客暴擊率
    }
  },

  // 🎯 平衡配置
  BALANCE_CONFIG: {
    DAMAGE_SCALING: {
      PLAYER_ATTACK_GROWTH: 1.0,    // 玩家攻擊成長率
      ENEMY_HP_GROWTH: 1.2,         // 敵人血量成長率
      ARMOR_EFFECTIVENESS: 1.0      // 護甲效果倍率
    },
    
    DIFFICULTY_CURVE: {
      LEVEL_1_TO_5: 1.0,     // 前期難度倍率
      LEVEL_6_TO_10: 1.2,    // 中期難度倍率
      LEVEL_11_TO_15: 1.5,   // 後期難度倍率
      LEVEL_16_TO_20: 2.0    // 最終難度倍率
    }
  },

  // 🔧 調試設定
  DEBUG: {
    ENABLED: false,                // 是否啟用調試模式
    LOG_BATTLE_STATS: false,       // 是否記錄戰鬥統計
    SHOW_PERFORMANCE_METRICS: false // 是否顯示性能指標
  }
};

// 🛠️ 遊戲配置工具類
export class GameConfigUtils {
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
  
  // 計算利息
  static calculateInterest(gold) {
    const baseInterest = Math.floor(gold / 10) * GAME_CONFIG.GOLD_REWARDS.INTEREST_RATE;
    return Math.min(baseInterest, GAME_CONFIG.GOLD_REWARDS.MAX_INTEREST);
  }
  
  // 獲取有效的戰鬥速度
  static getValidBattleSpeed(speed) {
    const validSpeeds = Object.values(GAME_CONFIG.BATTLE_SPEEDS);
    return validSpeeds.includes(speed) ? speed : GAME_CONFIG.BATTLE_SPEEDS.NORMAL;
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

  // 獲取敵人成長率
  static getEnemyGrowthRate(level) {
    if (level <= 3) return GAME_CONFIG.ENEMY_CONFIG.GROWTH_RATES.EARLY_GAME;
    if (level <= 7) return GAME_CONFIG.ENEMY_CONFIG.GROWTH_RATES.MID_GAME;
    if (level <= 12) return GAME_CONFIG.ENEMY_CONFIG.GROWTH_RATES.LATE_GAME;
    return GAME_CONFIG.ENEMY_CONFIG.GROWTH_RATES.END_GAME;
  }

  // 獲取難度倍率
  static getDifficultyMultiplier(level) {
    if (level <= 5) return GAME_CONFIG.BALANCE_CONFIG.DIFFICULTY_CURVE.LEVEL_1_TO_5;
    if (level <= 10) return GAME_CONFIG.BALANCE_CONFIG.DIFFICULTY_CURVE.LEVEL_6_TO_10;
    if (level <= 15) return GAME_CONFIG.BALANCE_CONFIG.DIFFICULTY_CURVE.LEVEL_11_TO_15;
    return GAME_CONFIG.BALANCE_CONFIG.DIFFICULTY_CURVE.LEVEL_16_TO_20;
  }

  // 獲取敵人縮放因子 (修復缺失的函數)
  static getEnemyScalingFactor(level) {
    // 更陡峭的等級成長曲線
    let growthFactor;
    if (level <= 3) {
      growthFactor = 1 + (level - 1) * 0.06; // 前3關每級+6%
    } else if (level <= 7) {
      growthFactor = 1.16 + (level - 4) * 0.10; // 4-7關每級+10%
    } else if (level <= 12) {
      growthFactor = 1.64 + (level - 8) * 0.15; // 8-12關每級+15%
    } else if (level <= 17) {
      growthFactor = 2.54 + (level - 13) * 0.20; // 13-17關每級+20%
    } else {
      growthFactor = 3.79 + (level - 18) * 0.30; // 18-20關每級+30%
    }
    
    return growthFactor;
  }

  // 獲取敵人數值成長 (配置化版本)
  static calculateEnemyGrowth(baseValue, level, statType = 'hp') {
    const scalingFactor = this.getEnemyScalingFactor(level);
    
    // 根據屬性類型調整成長率
    switch(statType) {
      case 'hp':
        // 血量成長最顯著
        return Math.floor(baseValue * scalingFactor);
      case 'attack':
        // 攻擊力成長較快
        return Math.floor(baseValue * Math.pow(scalingFactor, 0.95));
      case 'defense':
        // 防禦力中等成長
        return Math.floor(baseValue * Math.pow(scalingFactor, 0.7));
      default:
        return Math.floor(baseValue * scalingFactor);
    }
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
    
    // 檢查事件關卡是否在有效範圍內
    const invalidEventLevels = GAME_CONFIG.EVENT_LEVELS.filter(
      level => level < 1 || level > GAME_CONFIG.TOTAL_LEVELS
    );
    if (invalidEventLevels.length > 0) {
      issues.push(`Invalid event levels: ${invalidEventLevels.join(', ')}`);
    }
    
    // 檢查Boss關卡是否在有效範圍內
    const invalidBossLevels = GAME_CONFIG.BOSS_LEVELS.filter(
      level => level < 1 || level > GAME_CONFIG.TOTAL_LEVELS
    );
    if (invalidBossLevels.length > 0) {
      issues.push(`Invalid boss levels: ${invalidBossLevels.join(', ')}`);
    }

    // 檢查玩家配置
    if (!GAME_CONFIG.PLAYER_CONFIG || !GAME_CONFIG.PLAYER_CONFIG.BASE_STATS) {
      issues.push('PLAYER_CONFIG.BASE_STATS is required');
    }

    // 檢查敵人配置
    if (!GAME_CONFIG.ENEMY_CONFIG || !GAME_CONFIG.ENEMY_CONFIG.GROWTH_RATES) {
      issues.push('ENEMY_CONFIG.GROWTH_RATES is required');
    }
    
    if (issues.length > 0) {
      console.error('❌ 遊戲配置驗證失敗:', issues);
      return false;
    }
    
    console.log('✅ 遊戲配置驗證通過');
    return true;
  }
  
  // 獲取配置摘要（用於調試）
  static getConfigSummary() {
    return {
      levels: GAME_CONFIG.TOTAL_LEVELS,
      battleFPS: GAME_CONFIG.BATTLE_FPS,
      eventLevels: GAME_CONFIG.EVENT_LEVELS,
      bossLevels: GAME_CONFIG.BOSS_LEVELS,
      hammerStunEnabled: GAME_CONFIG.HAMMER_CONFIG.STUN_ENABLED,
      debugMode: GAME_CONFIG.DEBUG.ENABLED,
      playerBaseHP: GAME_CONFIG.PLAYER_CONFIG.BASE_STATS.HP,
      playerBaseAttack: GAME_CONFIG.PLAYER_CONFIG.BASE_STATS.ATTACK
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
    console.log(`🔨 重錘眩暈: ${GAME_CONFIG.HAMMER_CONFIG.STUN_ENABLED ? '啟用' : '禁用'}`);
    console.log(`🔧 調試模式: ${GAME_CONFIG.DEBUG.ENABLED ? '啟用' : '禁用'}`);
    console.log(`⏱️ 戰鬥結果顯示: ${GAME_CONFIG.BATTLE_RESULT_DISPLAY_TIME === 0 ? '點擊關閉' : GAME_CONFIG.BATTLE_RESULT_DISPLAY_TIME + 'ms'}`);
    console.log(`👤 玩家基礎血量: ${GAME_CONFIG.PLAYER_CONFIG.BASE_STATS.HP}`);
    console.log(`⚔️ 玩家基礎攻擊: ${GAME_CONFIG.PLAYER_CONFIG.BASE_STATS.ATTACK}`);
    console.log(`⚡ 戰鬥FPS: ${GAME_CONFIG.BATTLE_FPS}`);
  }
  
  return isValid;
}

// 🎯 配置熱更新功能（開發用）
export function updateGameConfig(path, value) {
  if (GAME_CONFIG.DEBUG.ENABLED) {
    const keys = path.split('.');
    let current = GAME_CONFIG;
    
    // 導航到目標位置
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