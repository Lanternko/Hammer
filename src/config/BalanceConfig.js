// src/config/BalanceConfig.js - 修正版平衡配置
export const BALANCE_CONFIG = {
  // 🎯 核心：每級的目標戰力標準（原始DPS×EHP值）
  TARGET_COMBAT_POWER: {
    // 🔧 修正：基於玩家初始戰力 100血×20攻×0.5速×20甲 = 1200戰力
    BASE_POWER: 1200,      // 第1級的基準戰力（原始值）
    GROWTH_RATE: 0.25,     // 每級25%成長（快速膨脹）
    
    // 🔧 關鍵節點（原始戰力值）
    MILESTONES: {
      1: 1200,    // 第1級 - 玩家初始戰力
      5: 2930,    // 第5級 - 約2.4倍
      10: 9313,   // 第10級 - 約7.8倍
      15: 29623,  // 第15級 - 約24.7倍  
      20: 94176   // 第20級 - 約78.5倍
    }
  },

  // 🎮 遊戲難度調整
  DIFFICULTY_SETTINGS: {
    VERY_EASY: 0.7,    // 戰力×0.7
    EASY: 0.85,        // 戰力×0.85
    NORMAL: 1.0,       // 標準戰力
    HARD: 1.2,         // 戰力×1.2
    NIGHTMARE: 1.5,    // 戰力×1.5
    
    // 當前難度
    CURRENT: 'NORMAL'
  },

  // ⚖️ 平衡驗證標準
  BALANCE_TOLERANCE: {
    PERFECT: 0.02,     // 2%誤差內視為完美平衡
    GOOD: 0.05,        // 5%誤差內視為良好平衡
    ACCEPTABLE: 0.10,  // 10%誤差內視為可接受
    // 超過10%視為需要調整
  },

  // 🔧 數值計算參數
  CALCULATION_PARAMS: {
    // 護甲減傷公式：armor / (armor + ARMOR_CONSTANT)
    ARMOR_CONSTANT: 100,
    
    // 基準值設定（用於反推計算）
    BASE_VALUES: {
      HP: 100,          // 基準血量
      ATTACK_SPEED: 1.0, // 基準攻速
      ARMOR: 20         // 基準護甲
    },
    
    // 屬性最小值保護
    MIN_VALUES: {
      HP: 20,
      ATTACK: 5,
      ARMOR: 0
    },
    
    // 迭代計算參數
    SOLVER: {
      MAX_ITERATIONS: 50,        // 最大迭代次數
      SEARCH_RANGE: [0.1, 10.0], // 縮放係數搜索範圍
      PRECISION: 0.01            // 目標精度（1%）
    }
  },

  // 🎯 特殊能力平衡修正
  SPECIAL_ABILITY_MODIFIERS: {
    // 這些修正會影響最終戰力計算
    berserker_rage: 1.1,       // 狂戰士能力讓整體戰力+10%
    magic_pierce: 1.05,        // 魔法穿透+5%
    crit_chance: 1.08,         // 暴擊機率+8%
    damage_absorption: 0.95,   // 傷害吸收-5%（防禦性能力）
    stun_immunity: 0.97        // 眩暈免疫-3%
  },

  // 🏆 Boss強化設定
  BOSS_MODIFIERS: {
    POWER_MULTIPLIER: 1.3,     // Boss戰力為普通敵人的1.3倍
    STAT_DISTRIBUTION: {       // Boss如何分配額外戰力
      HP_WEIGHT: 0.6,          // 60%給血量
      ATTACK_WEIGHT: 0.4       // 40%給攻擊力
    }
  },

  // 🎨 UI顯示設定
  UI_DISPLAY: {
    // 戰力顯示方式
    SHOW_SQRT_POWER: true,     // 顯示開根號後的戰力（更友好）
    SHOW_RAW_POWER: false,     // 顯示原始戰力（調試用）
    
    // 格式化規則
    POWER_FORMATTING: {
      DECIMAL_PLACES: 1,       // 開根號後保留1位小數
      LARGE_NUMBER_THRESHOLD: 1000, // 大於1000時使用K/M格式
      USE_COMPACT_FORMAT: false // 是否使用緊湊格式（如1.2K）
    }
  }
};

// 🧮 核心計算函數
export class BalanceCalculator {
  
  // 🎯 獲取指定等級的目標戰力
  static getTargetCombatPower(level, difficulty = null) {
    // 使用當前難度設定
    const currentDifficulty = difficulty || BALANCE_CONFIG.DIFFICULTY_SETTINGS.CURRENT;
    const difficultyMultiplier = BALANCE_CONFIG.DIFFICULTY_SETTINGS[currentDifficulty] || 1.0;
    
    // 計算基礎戰力
    let basePower;
    
    // 優先使用里程碑數值，否則用公式計算
    const milestones = BALANCE_CONFIG.TARGET_COMBAT_POWER.MILESTONES;
    if (milestones[level]) {
      basePower = milestones[level];
    } else {
      // 使用成長公式
      const base = BALANCE_CONFIG.TARGET_COMBAT_POWER.BASE_POWER;
      const rate = BALANCE_CONFIG.TARGET_COMBAT_POWER.GROWTH_RATE;
      basePower = base * Math.pow(1 + rate, level - 1);
    }
    
    return basePower * difficultyMultiplier;
  }
  
  // 🎨 格式化戰力用於顯示
  static formatCombatPowerForDisplay(rawPower) {
    if (BALANCE_CONFIG.UI_DISPLAY.SHOW_SQRT_POWER) {
      const sqrtPower = Math.sqrt(rawPower);
      const decimals = BALANCE_CONFIG.UI_DISPLAY.POWER_FORMATTING.DECIMAL_PLACES;
      
      if (BALANCE_CONFIG.UI_DISPLAY.POWER_FORMATTING.USE_COMPACT_FORMAT && sqrtPower >= 100) {
        if (sqrtPower >= 1000) {
          return (sqrtPower / 1000).toFixed(1) + 'K';
        }
        return sqrtPower.toFixed(0);
      }
      
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
  
  // 🧮 三參數敵人屬性計算（與Enemies.js整合）
  static calculateEnemyStatsFromThreeParams(targetPower, hpMultiplier, speedMultiplier) {
    const baseValues = BALANCE_CONFIG.CALCULATION_PARAMS.BASE_VALUES;
    const solver = BALANCE_CONFIG.CALCULATION_PARAMS.SOLVER;
    const minValues = BALANCE_CONFIG.CALCULATION_PARAMS.MIN_VALUES;
    const armorConstant = BALANCE_CONFIG.CALCULATION_PARAMS.ARMOR_CONSTANT;
    
    // 📐 二分法求解最佳縮放係數
    let [low, high] = solver.SEARCH_RANGE;
    let bestScale = 1.0;
    let bestError = Infinity;
    
    for (let iter = 0; iter < solver.MAX_ITERATIONS; iter++) {
      const scale = (low + high) / 2;
      
      // 計算縮放後的屬性
      const hp = Math.round(baseValues.HP * hpMultiplier * scale);
      const attackSpeed = baseValues.ATTACK_SPEED * speedMultiplier;
      const armor = Math.round(baseValues.ARMOR * scale * 0.5); // 護甲成長較慢
      
      // 計算DPS和EHP
      const damageReduction = armor / (armor + armorConstant);
      const ehp = hp / (1 - damageReduction);
      
      // 🔧 關鍵：從目標戰力反推DPS
      // 因為 DPS × EHP = targetPower (原始戰力)
      // 所以 DPS = targetPower / EHP
      const requiredDPS = targetPower / ehp;
      const attack = Math.round(requiredDPS / attackSpeed);
      
      // 驗證實際戰力
      const actualDPS = attack * attackSpeed;
      const actualPower = actualDPS * ehp; // 原始戰力
      const error = Math.abs(actualPower - targetPower);
      
      if (error < bestError) {
        bestError = error;
        bestScale = scale;
      }
      
      // 調整搜索範圍
      if (actualPower < targetPower) {
        low = scale;
      } else {
        high = scale;
      }
      
      // 精度檢查
      if (error < targetPower * solver.PRECISION) {
        break;
      }
    }
    
    // 🎯 用最佳縮放係數計算最終屬性
    const finalHp = Math.max(minValues.HP, Math.round(baseValues.HP * hpMultiplier * bestScale));
    const finalAttackSpeed = baseValues.ATTACK_SPEED * speedMultiplier;
    const finalArmor = Math.max(minValues.ARMOR, Math.round(baseValues.ARMOR * bestScale * 0.5));
    
    const finalDamageReduction = finalArmor / (finalArmor + armorConstant);
    const finalEHP = finalHp / (1 - finalDamageReduction);
    const requiredDPS = targetPower / finalEHP;
    const finalAttack = Math.max(minValues.ATTACK, Math.round(requiredDPS / finalAttackSpeed));
    
    // 驗證最終結果
    const finalDPS = finalAttack * finalAttackSpeed;
    const finalPower = finalDPS * finalEHP; // 原始戰力
    const finalError = Math.abs(finalPower - targetPower) / targetPower;
    
    return {
      hp: finalHp,
      attack: finalAttack,
      attackSpeed: finalAttackSpeed,
      armor: finalArmor,
      dps: finalDPS,
      ehp: finalEHP,
      actualCombatPower: finalPower,      // 原始戰力
      displayPower: this.formatCombatPowerForDisplay(finalPower), // 顯示戰力
      error: finalError,
      
      // 調試信息
      baseValues: baseValues,
      scale: bestScale,
      targetPower: targetPower
    };
  }
  
  // 📊 驗證平衡性
  static validateBalance(actualPower, targetPower) {
    const error = Math.abs(actualPower - targetPower) / targetPower;
    const tolerance = BALANCE_CONFIG.BALANCE_TOLERANCE;
    
    let status, recommendation;
    
    if (error <= tolerance.PERFECT) {
      status = 'perfect';
      recommendation = '✅ 完美平衡';
    } else if (error <= tolerance.GOOD) {
      status = 'good';
      recommendation = '✅ 良好平衡';
    } else if (error <= tolerance.ACCEPTABLE) {
      status = 'acceptable';
      recommendation = '⚠️ 可接受範圍';
    } else {
      status = 'poor';
      recommendation = actualPower > targetPower ? 
        '❌ 過強，需要削弱' : '❌ 過弱，需要強化';
    }
    
    return {
      status,
      recommendation,
      error,
      errorPercent: (error * 100).toFixed(1) + '%'
    };
  }
  
  // 🏆 計算Boss屬性
  static calculateBossStats(targetPower, hpMultiplier, speedMultiplier, specialAbility = null) {
    const bossConfig = BALANCE_CONFIG.BOSS_MODIFIERS;
    const enhancedTarget = targetPower * bossConfig.POWER_MULTIPLIER;
    
    // Boss有特殊的屬性分配邏輯
    const bossHpMultiplier = hpMultiplier * (1 + bossConfig.STAT_DISTRIBUTION.HP_WEIGHT * 0.3);
    const bossSpeedMultiplier = speedMultiplier; // 攻速保持不變
    
    const stats = this.calculateEnemyStatsFromThreeParams(enhancedTarget, bossHpMultiplier, bossSpeedMultiplier);
    
    // 應用特殊能力修正
    if (specialAbility && BALANCE_CONFIG.SPECIAL_ABILITY_MODIFIERS[specialAbility]) {
      const modifier = BALANCE_CONFIG.SPECIAL_ABILITY_MODIFIERS[specialAbility];
      stats.specialAbilityModifier = modifier;
    }
    
    return stats;
  }
  
  // 🎮 計算玩家戰力（用於對比）
  static calculatePlayerCombatPower(player) {
    const dps = player.getEffectiveAttack() * player.getEffectiveAttackSpeed();
    const armor = player.getEffectiveArmor();
    const damageReduction = armor / (armor + BALANCE_CONFIG.CALCULATION_PARAMS.ARMOR_CONSTANT);
    const ehp = player.maxHp / (1 - damageReduction);
    
    const rawPower = dps * ehp;
    
    return {
      dps: dps,
      ehp: ehp,
      rawPower: rawPower,
      displayPower: this.formatCombatPowerForDisplay(rawPower),
      sqrtPower: Math.sqrt(rawPower)
    };
  }
  
  // 🎮 計算敵人戰力（用於對比）
  static calculateEnemyCombatPower(enemy) {
    const dps = enemy.attack * enemy.attackSpeed;
    const damageReduction = enemy.armor / (enemy.armor + BALANCE_CONFIG.CALCULATION_PARAMS.ARMOR_CONSTANT);
    const ehp = enemy.maxHp / (1 - damageReduction);
    
    const rawPower = dps * ehp;
    
    return {
      dps: dps,
      ehp: ehp,
      rawPower: rawPower,
      displayPower: this.formatCombatPowerForDisplay(rawPower),
      sqrtPower: Math.sqrt(rawPower)
    };
  }
}

// 🎛️ 配置管理工具
export class BalanceConfigManager {
  
  // 設定遊戲難度
  static setDifficulty(difficulty) {
    if (BALANCE_CONFIG.DIFFICULTY_SETTINGS[difficulty]) {
      BALANCE_CONFIG.DIFFICULTY_SETTINGS.CURRENT = difficulty;
      console.log(`🎯 難度設定為: ${difficulty} (${BALANCE_CONFIG.DIFFICULTY_SETTINGS[difficulty]}x)`);
      return true;
    } else {
      console.error(`❌ 無效的難度設定: ${difficulty}`);
      return false;
    }
  }
  
  // 設定顯示模式
  static setDisplayMode(showSqrt = true) {
    BALANCE_CONFIG.UI_DISPLAY.SHOW_SQRT_POWER = showSqrt;
    BALANCE_CONFIG.UI_DISPLAY.SHOW_RAW_POWER = !showSqrt;
    console.log(`🎨 戰力顯示模式: ${showSqrt ? '開根號' : '原始值'}`);
  }
  
  // 獲取當前配置摘要
  static getConfigSummary() {
    const current = BALANCE_CONFIG.DIFFICULTY_SETTINGS.CURRENT;
    const multiplier = BALANCE_CONFIG.DIFFICULTY_SETTINGS[current];
    
    return {
      currentDifficulty: current,
      difficultyMultiplier: multiplier,
      basePower: BALANCE_CONFIG.TARGET_COMBAT_POWER.BASE_POWER,
      growthRate: BALANCE_CONFIG.TARGET_COMBAT_POWER.GROWTH_RATE,
      balanceTolerance: BALANCE_CONFIG.BALANCE_TOLERANCE.ACCEPTABLE,
      bossMultiplier: BALANCE_CONFIG.BOSS_MODIFIERS.POWER_MULTIPLIER,
      displayMode: BALANCE_CONFIG.UI_DISPLAY.SHOW_SQRT_POWER ? '開根號' : '原始值'
    };
  }
  
  // 驗證配置完整性
  static validateConfig() {
    const issues = [];
    
    // 檢查玩家初始戰力計算是否正確
    const playerBasePower = this.calculatePlayerBasePower();
    const configBasePower = BALANCE_CONFIG.TARGET_COMBAT_POWER.BASE_POWER;
    
    if (Math.abs(playerBasePower - configBasePower) > configBasePower * 0.1) {
      issues.push(`玩家初始戰力計算不匹配: 計算值=${playerBasePower}, 配置值=${configBasePower}`);
    }
    
    // 檢查里程碑數值是否遞增
    const milestones = BALANCE_CONFIG.TARGET_COMBAT_POWER.MILESTONES;
    const levels = Object.keys(milestones).map(Number).sort((a, b) => a - b);
    for (let i = 1; i < levels.length; i++) {
      if (milestones[levels[i]] <= milestones[levels[i-1]]) {
        issues.push(`里程碑數值錯誤: 等級${levels[i]}的戰力不應低於等級${levels[i-1]}`);
      }
    }
    
    if (issues.length > 0) {
      console.error('❌ 配置驗證失敗:', issues);
      return false;
    } else {
      console.log('✅ 配置驗證通過');
      return true;
    }
  }
  
  // 計算玩家基礎戰力（用於驗證）
  static calculatePlayerBasePower() {
    // 玩家初始：100血 × 20攻 × 0.5攻速 × 20護甲
    const hp = 100;
    const attack = 20;
    const attackSpeed = 0.5;
    const armor = 20;
    
    const dps = attack * attackSpeed;
    const damageReduction = armor / (armor + 100);
    const ehp = hp / (1 - damageReduction);
    
    return dps * ehp;
  }
}

// 🧪 測試套件
export class BalanceTestSuite {
  
  // 🧪 測試戰力成長曲線
  static testGrowthCurve() {
    console.log('📈 === 戰力成長曲線測試 ===');
    
    const testLevels = [1, 3, 5, 8, 10, 13, 15, 18, 20];
    
    console.log('等級 | 原始戰力 | 顯示戰力 | 成長率');
    console.log('-----|----------|----------|--------');
    
    let previousPower = 0;
    testLevels.forEach(level => {
      const rawPower = BalanceCalculator.getTargetCombatPower(level);
      const displayPower = BalanceCalculator.formatCombatPowerForDisplay(rawPower);
      const growthRate = previousPower > 0 ? 
        ((rawPower / previousPower - 1) * 100).toFixed(1) + '%' : 
        '-';
      
      console.log(`${level.toString().padStart(4)} | ${rawPower.toFixed(0).padStart(8)} | ${displayPower.padStart(8)} | ${growthRate.padStart(6)}`);
      previousPower = rawPower;
    });
  }
  
  // 🔬 驗證玩家初始戰力
  static validatePlayerBasePower() {
    console.log('\n🔬 === 玩家初始戰力驗證 ===');
    
    const calculated = BalanceConfigManager.calculatePlayerBasePower();
    const configured = BALANCE_CONFIG.TARGET_COMBAT_POWER.BASE_POWER;
    const displayPower = BalanceCalculator.formatCombatPowerForDisplay(calculated);
    
    console.log(`計算結果: ${calculated.toFixed(0)} (顯示: ${displayPower})`);
    console.log(`配置數值: ${configured}`);
    console.log(`差異: ${Math.abs(calculated - configured).toFixed(0)} (${((Math.abs(calculated - configured) / configured) * 100).toFixed(1)}%)`);
    
    if (Math.abs(calculated - configured) < configured * 0.05) {
      console.log('✅ 驗證通過');
    } else {
      console.log('❌ 驗證失敗，需要調整配置');
    }
  }
  
  // 🔄 完整測試套件
  static runFullTest() {
    console.log('🧪 === 修正配置完整測試 ===\n');
    
    // 驗證配置
    BalanceConfigManager.validateConfig();
    
    // 各項測試
    this.validatePlayerBasePower();
    this.testGrowthCurve();
    
    console.log('\n✅ 完整測試完成！');
  }
}

// 🎮 快速接口函數
export function getTargetCombatPower(level) {
  return BalanceCalculator.getTargetCombatPower(level);
}

export function formatCombatPower(rawPower) {
  return BalanceCalculator.formatCombatPowerForDisplay(rawPower);
}

export function setGameDifficulty(difficulty) {
  return BalanceConfigManager.setDifficulty(difficulty);
}

export function runBalanceTest() {
  return BalanceTestSuite.runFullTest();
}

// 自動驗證配置
setTimeout(() => {
  BalanceConfigManager.validateConfig();
  console.log('🎯 修正版平衡配置載入完成');
  console.log('📊 玩家初始戰力: 1200 (顯示: ~34.6)');
  console.log('🎨 戰力顯示: 開根號模式');
}, 50);