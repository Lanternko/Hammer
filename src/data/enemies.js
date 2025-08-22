// src/data/Enemies.js - 簡化的三參數模型
export const EnemyArchetypes = {
  // 🗡️ 高攻速刺客
  assassin: {
    name: '暗影刺客',
    emoji: '🗡️',
    description: '極高攻擊速度，低血量',
    
    // 🎯 只需要三個參數
    hpMultiplier: 0.6,      // 血量 = 基準 × 0.6 (脆皮)
    speedMultiplier: 1.8,   // 攻速 = 基準 × 1.8 (極快)
    strengthMultiplier: 1.0, // 強度 = 基準 × 1.0 (普通敵人)
    
    // 其他設定
    specialAbility: 'crit_chance'
  },
  
  // 🛡️ 高血量坦克
  tank: {
    name: '重甲守衛',
    emoji: '🛡️',
    description: '極高血量，低攻擊速度',
    
    hpMultiplier: 1.8,      // 血量 = 基準 × 1.8 (坦克)
    speedMultiplier: 0.5,   // 攻速 = 基準 × 0.5 (極慢)
    strengthMultiplier: 1.0, // 強度 = 基準 × 1.0 (普通敵人)
    
    specialAbility: null
  },
  
  // ⚔️ 平衡戰士
  warrior: {
    name: '平衡戰士',
    emoji: '⚔️',
    description: '標準屬性，平衡對手',
    
    hpMultiplier: 1.0,      // 血量 = 基準 × 1.0 (標準)
    speedMultiplier: 1.0,   // 攻速 = 基準 × 1.0 (標準)
    strengthMultiplier: 1.0, // 強度 = 基準 × 1.0 (普通敵人)
    
    specialAbility: null
  },
  
  // 💨 極速刺客
  speedster: {
    name: '迅捷殺手',
    emoji: '💨',
    description: '超高攻擊速度，中等血量',
    
    hpMultiplier: 0.8,      // 血量 = 基準 × 0.8 (較脆)
    speedMultiplier: 2.2,   // 攻速 = 基準 × 2.2 (超快)
    strengthMultiplier: 1.0, // 強度 = 基準 × 1.0 (普通敵人)
    
    specialAbility: null
  },
  
  // 🏔️ 超級坦克
  fortress: {
    name: '巨型魔像',
    emoji: '🏔️',
    description: '血量極厚，攻擊極慢',
    
    hpMultiplier: 2.5,      // 血量 = 基準 × 2.5 (超厚)
    speedMultiplier: 0.3,   // 攻速 = 基準 × 0.3 (超慢)
    strengthMultiplier: 1.0, // 強度 = 基準 × 1.0 (普通敵人)
    
    specialAbility: 'damage_absorption'
  },
  
  // 😡 狂戰士
  berserker: {
    name: '狂戰士',
    emoji: '😡',
    description: '血量越少攻擊越高',
    
    hpMultiplier: 0.7,      // 血量 = 基準 × 0.7 (較脆)
    speedMultiplier: 1.4,   // 攻速 = 基準 × 1.4 (較快)
    strengthMultiplier: 1.0, // 強度 = 基準 × 1.0 (普通敵人)
    
    specialAbility: 'berserker_rage'
  },
  
  // 🧙 法師
  mage: {
    name: '戰鬥法師',
    emoji: '🧙',
    description: '中等血量，中等攻速，穿甲攻擊',
    
    hpMultiplier: 0.9,      // 血量 = 基準 × 0.9 (略脆)
    speedMultiplier: 0.8,   // 攻速 = 基準 × 0.8 (較慢)
    strengthMultiplier: 1.0, // 強度 = 基準 × 1.0 (普通敵人)
    
    specialAbility: 'magic_pierce'
  },
  
  // 👑 小Boss - 精英敵人
  miniBoss: {
    name: '小型頭目',
    emoji: '👑',
    description: '精英敵人，全面強化',
    
    hpMultiplier: 1.2,      // 血量 = 基準 × 1.2 (較厚)
    speedMultiplier: 1.1,   // 攻速 = 基準 × 1.1 (較快)
    strengthMultiplier: 1.3, // 強度 = 基準 × 1.3 (精英敵人！)
    
    specialAbility: null
  },
  
  // 💀 精英刺客
  eliteAssassin: {
    name: '精英刺客',
    emoji: '💀',
    description: '精英級刺客，極度危險',
    
    hpMultiplier: 0.5,      // 血量 = 基準 × 0.5 (極脆)
    speedMultiplier: 2.0,   // 攻速 = 基準 × 2.0 (極快)
    strengthMultiplier: 1.4, // 強度 = 基準 × 1.4 (精英敵人！)
    
    specialAbility: 'crit_chance'
  },
  
  // 🏰 精英守衛
  eliteGuard: {
    name: '精英守衛',
    emoji: '🏰',
    description: '精英級守衛，堅不可摧',
    
    hpMultiplier: 2.0,      // 血量 = 基準 × 2.0 (很厚)
    speedMultiplier: 0.4,   // 攻速 = 基準 × 0.4 (很慢)
    strengthMultiplier: 1.4, // 強度 = 基準 × 1.4 (精英敵人！)
    
    specialAbility: 'damage_absorption'
  }
};

// 🧮 三參數反推算法
export function getEnemyStats(level, archetypeName) {
  const archetype = EnemyArchetypes[archetypeName];
  if (!archetype) {
    console.error(`❌ 未知敵人原型: ${archetypeName}`);
    return getEnemyStats(level, 'warrior'); // 備用方案
  }
  
  // 🎯 從配置獲取目標戰力（修正後的起始值）
  const targetCombatPower = getTargetCombatPowerForLevel(level) * archetype.strengthMultiplier;
  
  // 🧮 三參數反推計算
  const calculatedStats = calculateStatsFromThreeParams(
    targetCombatPower,
    archetype.hpMultiplier,
    archetype.speedMultiplier
  );
  
  console.log(`🎯 生成 ${archetype.name} 等級${level}`);
  console.log(`📊 目標戰力: ${targetCombatPower.toFixed(0)} (基礎×${archetype.strengthMultiplier})`);
  console.log(`⚔️ 屬性: HP=${calculatedStats.hp}, ATK=${calculatedStats.attack}, 攻速=${calculatedStats.attackSpeed.toFixed(1)}`);
  console.log(`🎮 實際戰力: ${calculatedStats.actualCombatPower.toFixed(0)}, 誤差: ${(calculatedStats.error * 100).toFixed(1)}%`);
  
  return {
    // 基本信息
    name: archetype.name,
    emoji: archetype.emoji,
    description: archetype.description,
    type: archetypeName,
    level: level,
    
    // 🎯 計算出的具體屬性
    maxHp: calculatedStats.hp,
    hp: calculatedStats.hp,
    attack: calculatedStats.attack,
    attackSpeed: calculatedStats.attackSpeed,
    armor: calculatedStats.armor,
    
    // 戰鬥機制
    attackFrame: Math.round(20 / calculatedStats.attackSpeed), // 假設20FPS
    defense: calculatedStats.armor, // 向後兼容
    currentFrame: 0,
    
    // 狀態
    isStunned: false,
    stunDuration: 0,
    
    // 特殊能力
    specialAbility: archetype.specialAbility,
    
    // 🔍 計算結果驗證
    balanceInfo: {
      targetCombatPower: targetCombatPower,
      actualCombatPower: calculatedStats.actualCombatPower,
      error: calculatedStats.error,
      dps: calculatedStats.dps,
      ehp: calculatedStats.ehp,
      
      // 三參數
      hpMultiplier: archetype.hpMultiplier,
      speedMultiplier: archetype.speedMultiplier,
      strengthMultiplier: archetype.strengthMultiplier,
      
      // 計算過程
      baseHp: calculatedStats.baseHp,
      baseAttackSpeed: calculatedStats.baseAttackSpeed
    }
  };
}

// 🎯 從統一配置獲取目標戰力
function getTargetCombatPowerForLevel(level) {
  // 🔧 從統一配置導入
  try {
    // 這裡應該 import { BalanceCalculator } from '../config/BalanceConfig.js';
    // 暫時用內聯實現避免循環依賴
    const basePower = 1200;  // 修正：玩家初始戰力 100×20×0.5×(120EHP) = 1200
    const growthRate = 0.25; // 每級25%成長（快速膨脹）
    return basePower * Math.pow(1 + growthRate, level - 1);
  } catch (error) {
    console.warn('⚠️ 無法獲取統一配置，使用備用數值');
    return 1200 * Math.pow(1.25, level - 1);
  }
}

// 🧮 三參數反推核心算法
function calculateStatsFromThreeParams(targetCombatPower, hpMult, speedMult) {
  // 🎯 目標：找到基準值，使得 √(DPS × EHP) = targetCombatPower
  // 其中：
  // DPS = attack × attackSpeed = attack × (baseSpeed × speedMult)  
  // EHP = hp / (1 - armorReduction) = (baseHp × hpMult) / (1 - armor/(armor+100))
  // attack = DPS / attackSpeed（攻擊力由DPS和攻速反推）
  
  // 🔧 設定基準值（這些會被調整以達到目標戰力）
  let baseHp = 100;        // 基準血量
  let baseAttackSpeed = 1.0; // 基準攻速
  let baseArmor = 20;       // 基準護甲
  
  // 📐 二分法求解最佳縮放係數
  let low = 0.1;
  let high = 10.0;
  let bestScale = 1.0;
  let bestError = Infinity;
  
  for (let iter = 0; iter < 50; iter++) {
    const scale = (low + high) / 2;
    
    // 計算縮放後的屬性
    const hp = Math.round(baseHp * hpMult * scale);
    const attackSpeed = baseAttackSpeed * speedMult;
    const armor = Math.round(baseArmor * scale * 0.5); // 護甲成長較慢
    
    // 計算DPS和EHP
    const damageReduction = armor / (armor + 100);
    const ehp = hp / (1 - damageReduction);
    
    // 🔧 關鍵：從目標戰力反推DPS
    // 因為 √(DPS × EHP) = targetCombatPower
    // 所以 DPS = targetCombatPower² / EHP
    const requiredDPS = (targetCombatPower * targetCombatPower) / ehp;
    const attack = Math.round(requiredDPS / attackSpeed);
    
    // 驗證實際戰力
    const actualDPS = attack * attackSpeed;
    const actualCombatPower = Math.sqrt(actualDPS * ehp);
    const error = Math.abs(actualCombatPower - targetCombatPower);
    
    if (error < bestError) {
      bestError = error;
      bestScale = scale;
    }
    
    // 調整搜索範圍
    if (actualCombatPower < targetCombatPower) {
      low = scale;
    } else {
      high = scale;
    }
    
    // 精度檢查
    if (error < targetCombatPower * 0.01) { // 1%誤差內
      break;
    }
  }
  
  // 🎯 用最佳縮放係數計算最終屬性
  const finalHp = Math.max(20, Math.round(baseHp * hpMult * bestScale));
  const finalAttackSpeed = baseAttackSpeed * speedMult;
  const finalArmor = Math.max(0, Math.round(baseArmor * bestScale * 0.5));
  
  const finalDamageReduction = finalArmor / (finalArmor + 100);
  const finalEHP = finalHp / (1 - finalDamageReduction);
  const requiredDPS = (targetCombatPower * targetCombatPower) / finalEHP;
  const finalAttack = Math.max(5, Math.round(requiredDPS / finalAttackSpeed));
  
  // 驗證最終結果
  const finalDPS = finalAttack * finalAttackSpeed;
  const finalCombatPower = Math.sqrt(finalDPS * finalEHP);
  const finalError = Math.abs(finalCombatPower - targetCombatPower) / targetCombatPower;
  
  return {
    hp: finalHp,
    attack: finalAttack,
    attackSpeed: finalAttackSpeed,
    armor: finalArmor,
    dps: finalDPS,
    ehp: finalEHP,
    actualCombatPower: finalCombatPower,
    error: finalError,
    
    // 調試信息
    baseHp: baseHp,
    baseAttackSpeed: baseAttackSpeed,
    scale: bestScale
  };
}

// 🎮 智能敵人選擇（基於三參數）
export function selectEnemyType(level) {
  if (level === 20) {
    return 'miniBoss'; // 最終Boss
  }
  
  // 🎯 根據關卡範圍提供不同敵人組合
  if (level <= 3) {
    // 前期：只有普通敵人，熟悉不同類型
    const types = ['warrior', 'assassin', 'tank'];
    return types[Math.floor(Math.random() * types.length)];
  } else if (level <= 8) {
    // 中前期：加入更極端的類型
    const types = ['warrior', 'assassin', 'tank', 'speedster', 'berserker'];
    return types[Math.floor(Math.random() * types.length)];
  } else if (level <= 15) {
    // 中後期：開始出現精英敵人
    const types = ['assassin', 'tank', 'fortress', 'berserker', 'mage', 'eliteAssassin'];
    return types[Math.floor(Math.random() * types.length)];
  } else {
    // 最終階段：以精英敵人為主
    const types = ['eliteAssassin', 'eliteGuard', 'fortress', 'berserker', 'mage'];
    return types[Math.floor(Math.random() * types.length)];
  }
}

// 📊 三參數分析工具
export function analyzeThreeParamBalance(level = 10) {
  console.log(`📊 === 三參數平衡分析 (等級 ${level}) ===`);
  
  const archetypes = Object.keys(EnemyArchetypes);
  const targetBasePower = getTargetCombatPowerForLevel(level);
  
  console.log(`基準戰力: ${targetBasePower.toFixed(0)}\n`);
  
  const results = [];
  
  archetypes.forEach(archetype => {
    const enemy = getEnemyStats(level, archetype);
    const info = enemy.balanceInfo;
    
    results.push({
      name: enemy.name,
      hpMult: info.hpMultiplier,
      speedMult: info.speedMultiplier,
      strengthMult: info.strengthMultiplier,
      targetPower: info.targetCombatPower.toFixed(0),
      actualPower: info.actualCombatPower.toFixed(0),
      error: (info.error * 100).toFixed(1) + '%',
      status: info.error < 0.05 ? '✅' : info.error < 0.1 ? '⚠️' : '❌'
    });
  });
  
  // 按強度分組顯示
  const normal = results.filter(r => r.strengthMult === 1.0);
  const elite = results.filter(r => r.strengthMult > 1.0);
  
  console.log('🎯 普通敵人:');
  normal.forEach(r => {
    console.log(`${r.status} ${r.name}: HP×${r.hpMult}, 攻速×${r.speedMult}, 戰力=${r.actualPower}, 誤差=${r.error}`);
  });
  
  if (elite.length > 0) {
    console.log('\n👑 精英敵人:');
    elite.forEach(r => {
      console.log(`${r.status} ${r.name}: HP×${r.hpMult}, 攻速×${r.speedMult}, 強度×${r.strengthMult}, 戰力=${r.actualPower}, 誤差=${r.error}`);
    });
  }
  
  // 整體統計
  const allErrors = results.map(r => parseFloat(r.error));
  const avgError = allErrors.reduce((a, b) => a + b) / allErrors.length;
  const balancedCount = results.filter(r => r.status === '✅').length;
  
  console.log(`\n📈 總結: ${balancedCount}/${results.length} 平衡良好, 平均誤差: ${avgError.toFixed(1)}%`);
  
  return results;
}

// 🧪 快速測試
export function testThreeParamSystem() {
  console.log('🧪 === 三參數系統測試 ===\n');
  
  // 測試戰力成長
  console.log('📈 戰力成長曲線:');
  [1, 3, 5, 8, 10, 15, 20].forEach(level => {
    const power = getTargetCombatPowerForLevel(level);
    console.log(`等級 ${level}: ${power.toFixed(0)}`);
  });
  
  console.log('\n');
  
  // 測試敵人生成
  analyzeThreeParamBalance(10);
  
  return '三參數系統測試完成！';
}

// 其他函數保持兼容...
export function applyEnemySpecialAbilities(enemy) {
  // 保持現有的特殊能力處理邏輯
  if (!enemy.specialAbility) return enemy;
  
  switch(enemy.specialAbility) {
    case 'berserker_rage':
      const hpPercent = enemy.hp / enemy.maxHp;
      if (hpPercent < 0.5) {
        const rageBonus = 1 + (0.5 - hpPercent);
        enemy.currentAttack = Math.round(enemy.attack * rageBonus);
      } else {
        enemy.currentAttack = enemy.attack;
      }
      break;
      
    case 'magic_pierce':
      enemy.magicAttack = true;
      enemy.armorPiercing = 0.4;
      break;
      
    case 'crit_chance':
      enemy.critChance = 0.25;
      break;
      
    case 'damage_absorption':
      enemy.damageAbsorption = true;
      enemy.absorptionRate = 0.1;
      break;
  }
  
  return enemy;
}

console.log('🎯 三參數敵人系統載入完成');
console.log('📊 模型: 血量乘積 × 攻速乘積 × 強度乘積');
console.log('🎮 第1關戰力: 1000 (匹配玩家初始戰力)');