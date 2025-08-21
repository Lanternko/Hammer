// src/config/GameConfig.js - 遊戲配置統一管理
export const GAME_CONFIG = {
  // 🎮 核心遊戲參數
  TOTAL_LEVELS: 20,
  BATTLE_FPS: 20,
  FRAME_INTERVAL: 50, // 1000ms / 20fps = 50ms
  
  // 📅 特殊關卡設定
  EVENT_LEVELS: [3, 8, 13, 18],
  BOSS_LEVELS: [5, 10, 15, 20],
  
  // ⚔️ 戰鬥系統
  BASE_DELTA_TIME: 0.05, // 每幀 0.05秒
  DAMAGE_DISPLAY_DURATION: 1500, // 傷害數字顯示時間
  BATTLE_RESULT_DISPLAY_TIME: 3000, // 戰鬥結果顯示時間
  
  // 🏃 戰鬥速度選項
  BATTLE_SPEEDS: {
    NORMAL: 1,
    FAST: 3,
    TURBO: 10
  },
  
  // 💰 經濟系統
  GOLD_REWARDS: {
    NORMAL_LEVEL: 1,
    BOSS_LEVEL: 2,
    FINAL_BOSS: 5,
    INTEREST_RATE: 0.1, // 每10金幣+1利息
    MAX_INTEREST: 3
  },
  
  // 💎 鑽石獎勵
  DIAMOND_REWARDS: {
    PER_5_LEVELS: 1,
    COMPLETION_BONUS: 5
  },
  
  // 🎲 隨機徽章權重
  BADGE_WEIGHTS: {
    EARLY_GAME: { // 第1-5關
      basic: 3,
      uncommon: 2,
      rare: 1
    },
    MID_GAME: { // 第6-10關
      basic: 2,
      uncommon: 3,
      rare: 2,
      epic: 1
    },
    LATE_GAME: { // 第11-20關
      uncommon: 2,
      rare: 3,
      epic: 2,
      legendary: 1
    }
  },
  
  // 🔨 重錘BD設定
  HAMMER_CONFIG: {
    BASE_PROC_CHANCE: 0.25, // 25%
    ENHANCED_PROC_CHANCE: 0.35, // 35% (重錘加重)
    BASE_DAMAGE_MULTIPLIER: 1.5, // 150%
    ENHANCED_DAMAGE_MULTIPLIER: 1.7, // 170%
    
    // 🔧 新增：眩暈控制開關
    STUN_ENABLED: false, // 設為 false 禁用眩暈
    BASE_STUN_DURATION: 1.0, // 1秒（禁用時不生效）
    ENHANCED_STUN_DURATION: 2.0, // 2秒（禁用時不生效）
    
    // 重錘效果
    EFFECTS: {
      STORM_CRIT: true, // 風暴必暴擊
      SHIELD_ARMOR: 10, // 護盾+10護甲
      SHIELD_DURATION: 5.0, // 護盾5秒
      HEAL_AMOUNT: 15, // 恢復15血
      FURY_SPEED_BOOST: 1.5, // 狂怒+50%攻速
      FURY_DURATION: 3.0 // 狂怒3秒
    }
  },
  
  // 🛡️ 反甲設定
  REFLECT_ARMOR_CONFIG: {
    TRIGGER_INTERVAL: 5, // 每5次受擊觸發
    DAMAGE_PERCENT: 0.05 // 反彈敵人5%最大血量
  },
  
  // 📊 玩家基礎屬性
  PLAYER_BASE_STATS: {
    HP: 100,
    ATTACK: 20,
    ATTACK_SPEED: 0.5,
    ARMOR: 20,
    FLAT_REDUCTION: 5,
    CRIT_CHANCE: 0.1
  },
  
  // 🔄 升級系統
  UPGRADE_CONFIG: {
    PERCENTAGE_BOOSTS: {
      SMALL: 0.15, // 15%
      MEDIUM: 0.25, // 25%
      LARGE: 0.35 // 35%
    },
    FLAT_BOOSTS: {
      HP: [35, 55, 75],
      ATTACK: [8, 12, 16],
      ARMOR: [12, 18, 25],
      ATTACK_SPEED: [0.15, 0.25, 0.35],
      CRIT_CHANCE: [0.08, 0.12, 0.16],
      FLAT_REDUCTION: [3, 5, 7]
    }
  },
  
  // 👹 敵人成長曲線
  ENEMY_SCALING: {
    EARLY_GAME: { // 1-3關
      factor: 0.08, // 每關+8%
      baseMultiplier: 1.0
    },
    MID_EARLY: { // 4-7關
      factor: 0.12, // 每關+12%
      baseMultiplier: 1.24
    },
    MID_GAME: { // 8-12關
      factor: 0.18, // 每關+18%
      baseMultiplier: 1.72
    },
    LATE_GAME: { // 13-17關
      factor: 0.25, // 每關+25%
      baseMultiplier: 2.62
    },
    END_GAME: { // 18-20關
      factor: 0.35, // 每關+35%
      baseMultiplier: 3.87
    }
  },
  
  // 🎨 UI 設定
  UI_CONFIG: {
    PARTICLE_COUNT: 30,
    LOADING_SCREEN_DURATION: 1000,
    NOTIFICATION_DURATION: 5000,
    TOOLTIP_DELAY: 500,
    
    // 顏色主題
    COLORS: {
      PRIMARY: '#4ecdc4',
      SECONDARY: '#ff6b6b',
      SUCCESS: '#4CAF50',
      WARNING: '#FF9800',
      ERROR: '#F44336',
      GOLD: '#ffd700'
    },
    
    // Z-Index 層級
    Z_INDEX: {
      BACKGROUND: 0,
      GAME_UI: 100,
      PANELS: 150,
      SPEED_CONTROL: 200,
      OVERLAYS: 1000,
      BATTLE_RESULTS: 1500,
      BADGES: 2000,
      GAME_OVER: 2000,
      ERRORS: 9997,
      LOADING: 9999
    }
  },
  
  // 🔧 調試模式
  DEBUG: {
    ENABLED: false, // 生產環境設為 false
    LOG_BATTLE_STATS: false,
    LOG_DAMAGE_CALCULATIONS: false,
    SHOW_PERFORMANCE_METRICS: false,
    BYPASS_ANIMATIONS: false
  },
  
  // 📱 響應式斷點
  BREAKPOINTS: {
    MOBILE: 480,
    TABLET: 768,
    DESKTOP: 1024,
    LARGE_DESKTOP: 1440
  },
  
  // 🎵 音效設定 (預留)
  AUDIO: {
    ENABLED: true,
    MASTER_VOLUME: 0.7,
    SFX_VOLUME: 0.8,
    MUSIC_VOLUME: 0.5
  }
};

// 🔧 輔助函數
export class GameConfigUtils {
  // 根據關卡獲取敵人成長因子
  static getEnemyScalingFactor(level) {
    if (level <= 3) return GAME_CONFIG.ENEMY_SCALING.EARLY_GAME;
    if (level <= 7) return GAME_CONFIG.ENEMY_SCALING.MID_EARLY;
    if (level <= 12) return GAME_CONFIG.ENEMY_SCALING.MID_GAME;
    if (level <= 17) return GAME_CONFIG.ENEMY_SCALING.LATE_GAME;
    return GAME_CONFIG.ENEMY_SCALING.END_GAME;
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
      return GAME_CONFIG.GOLD_REWARDS.FINAL_BOSS;
    }
    if (this.isBossLevel(level)) {
      return GAME_CONFIG.GOLD_REWARDS.BOSS_LEVEL;
    }
    return GAME_CONFIG.GOLD_REWARDS.NORMAL_LEVEL;
  }
  
  // 獲取徽章權重配置
  static getBadgeWeights(level) {
    if (level <= 5) return GAME_CONFIG.BADGE_WEIGHTS.EARLY_GAME;
    if (level <= 10) return GAME_CONFIG.BADGE_WEIGHTS.MID_GAME;
    return GAME_CONFIG.BADGE_WEIGHTS.LATE_GAME;
  }
  
  // 獲取重錘配置
  static getHammerConfig(hasWeight = false, hasDuration = false) {
    return {
      procChance: hasWeight ? 
        GAME_CONFIG.HAMMER_CONFIG.ENHANCED_PROC_CHANCE : 
        GAME_CONFIG.HAMMER_CONFIG.BASE_PROC_CHANCE,
      damageMultiplier: hasWeight ? 
        GAME_CONFIG.HAMMER_CONFIG.ENHANCED_DAMAGE_MULTIPLIER : 
        GAME_CONFIG.HAMMER_CONFIG.BASE_DAMAGE_MULTIPLIER,
      stunDuration: hasDuration ? 
        GAME_CONFIG.HAMMER_CONFIG.ENHANCED_STUN_DURATION : 
        GAME_CONFIG.HAMMER_CONFIG.BASE_STUN_DURATION
    };
  }
  
  // 計算敵人血量
  static calculateEnemyHp(baseHp, level) {
    const scaling = this.getEnemyScalingFactor(level);
    const levelOffset = this.getLevelOffset(level);
    return Math.floor(baseHp * (scaling.baseMultiplier + levelOffset * scaling.factor));
  }
  
  // 獲取關卡偏移量
  static getLevelOffset(level) {
    if (level <= 3) return level - 1;
    if (level <= 7) return level - 4;
    if (level <= 12) return level - 8;
    if (level <= 17) return level - 13;
    return level - 18;
  }
  
  // 驗證配置完整性
  static validateConfig() {
    const issues = [];
    
    // 檢查基本數值
    if (GAME_CONFIG.TOTAL_LEVELS <= 0) {
      issues.push('TOTAL_LEVELS 必須大於 0');
    }
    
    if (GAME_CONFIG.BATTLE_FPS <= 0) {
      issues.push('BATTLE_FPS 必須大於 0');
    }
    
    // 檢查事件關卡是否在有效範圍內
    const invalidEventLevels = GAME_CONFIG.EVENT_LEVELS.filter(
      level => level < 1 || level > GAME_CONFIG.TOTAL_LEVELS
    );
    if (invalidEventLevels.length > 0) {
      issues.push(`無效的事件關卡: ${invalidEventLevels.join(', ')}`);
    }
    
    if (issues.length > 0) {
      console.warn('⚠️ 遊戲配置問題:', issues);
      return false;
    }
    
    console.log('✅ 遊戲配置驗證通過');
    return true;
  }
}

// 🔍 在開發模式下驗證配置
if (GAME_CONFIG.DEBUG.ENABLED) {
  GameConfigUtils.validateConfig();
}

console.log('⚙️ 遊戲配置已載入');