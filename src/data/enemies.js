// src/data/Enemies.js - 修復導出問題的完整版本

export const EnemyArchetypes = {
  // 🗡️ 高攻速刺客
  assassin: {
    name: '暗影刺客',
    emoji: '🗡️',
    description: '極高攻擊速度，低血量',
    
    hpMultiplier: 0.6,      // 血量 = 基準 × 0.6 (脆皮)
    speedMultiplier: 1.8,   // 攻速 = 基準 × 1.8 (極快)
    strengthMultiplier: 1.0, // 強度 = 基準 × 1.0 (普通敵人)
    
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

// 🎯 從統一配置獲取目標戰力
function getTargetCombatPowerForLevel(level) {
  try {
    const basePower = 1200;  // 修正：玩家初始戰力
    const growthRate = 0.25; // 每級25%成長
    return basePower * Math.pow(1 + growthRate, level - 1);
  } catch (error) {
    console.warn('⚠️ 無法獲取統一配置，使用備用數值');
    return 1200 * Math.pow(1.25, level - 1);
  }
}

// ===== 修復後的三參數計算算法 =====
function calculateStatsFromThreeParams(targetCombatPower, hpMult, speedMult) {
  console.log(`🔧 開始修復計算: 目標戰力=${targetCombatPower}, HP倍率=${hpMult}, 攻速倍率=${speedMult}`);
  
  // ✅ 正確的基準值設定
  const baseHp = 100;        // 基準血量
  const baseAttackSpeed = 1.0; // 基準攻速
  const baseArmor = 20;      // 基準護甲
  
  // ✅ 第一步：直接計算血量（不需要二分法）
  const hp = Math.round(baseHp * hpMult);
  console.log(`💚 血量計算: ${baseHp} × ${hpMult} = ${hp}`);
  
  // ✅ 第二步：直接計算攻速（不需要二分法）
  const attackSpeed = baseAttackSpeed * speedMult;
  console.log(`⚡ 攻速計算: ${baseAttackSpeed} × ${speedMult} = ${attackSpeed}`);
  
  // ✅ 第三步：使用簡化的護甲計算
  const armor = Math.round(baseArmor * Math.sqrt(hpMult));
  console.log(`🛡️ 護甲計算: ${baseArmor} × √${hpMult} = ${armor}`);
  
  // ✅ 第四步：計算EHP
  const damageReduction = armor / (armor + 100);
  const ehp = hp / (1 - damageReduction);
  console.log(`🔰 EHP計算: ${hp} ÷ (1 - ${damageReduction.toFixed(3)}) = ${ehp.toFixed(1)}`);
  
  // ✅ 第五步：反推攻擊力
  // 戰力 = DPS × EHP，所以 DPS = 戰力 ÷ EHP
  const requiredDPS = targetCombatPower / ehp;
  const attack = Math.round(requiredDPS / attackSpeed);
  console.log(`⚔️ 攻擊力計算: ${targetCombatPower} ÷ ${ehp.toFixed(1)} ÷ ${attackSpeed} = ${attack}`);
  
  // ✅ 第六步：驗證實際戰力
  const actualDPS = attack * attackSpeed;
  const actualCombatPower = actualDPS * ehp;
  const error = Math.abs(actualCombatPower - targetCombatPower) / targetCombatPower;
  
  console.log(`🎯 戰力驗證:`);
  console.log(`   實際DPS: ${actualDPS.toFixed(1)}`);
  console.log(`   實際戰力: ${actualCombatPower.toFixed(0)}`);
  console.log(`   目標戰力: ${targetCombatPower}`);
  console.log(`   誤差: ${(error * 100).toFixed(1)}%`);
  
  return {
    hp: Math.max(20, hp),
    attack: Math.max(1, attack),
    attackSpeed: attackSpeed,
    armor: Math.max(0, armor),
    
    // 驗證信息
    actualCombatPower: actualCombatPower,
    error: error,
    dps: actualDPS.toFixed(1),
    ehp: ehp.toFixed(0),
    
    // 調試信息
    damageReduction: (damageReduction * 100).toFixed(1) + '%',
    baseHp: baseHp,
    baseAttackSpeed: baseAttackSpeed
  };
}


export function getEnemyStats(level, archetypeName) {
  const archetype = EnemyArchetypes[archetypeName];
  if (!archetype) {
    console.error(`❌ 未知敵人原型: ${archetypeName}`);
    return getEnemyStats(level, 'warrior'); // 備用方案
  }
  
  // ✅ 獲取目標戰力（原始值，不開根號）
  const targetCombatPower = getTargetCombatPowerForLevel(level) * archetype.strengthMultiplier;
  
  console.log(`🎯 === 創建 ${archetype.name} 等級${level} ===`);
  console.log(`📊 基礎目標戰力: ${getTargetCombatPowerForLevel(level)}`);
  console.log(`⚡ 強度倍率: ${archetype.strengthMultiplier}`);
  console.log(`🎯 最終目標戰力: ${targetCombatPower}`);
  
  // ✅ 使用修復後的三參數算法
  const calculatedStats = calculateStatsFromThreeParams(
    targetCombatPower,
    archetype.hpMultiplier,
    archetype.speedMultiplier
  );
  
  return {
    // 基本信息
    name: archetype.name,
    emoji: archetype.emoji,
    description: archetype.description,
    type: archetypeName,
    level: level,
    
    // ✅ 修復後的屬性
    maxHp: calculatedStats.hp,
    hp: calculatedStats.hp,
    attack: calculatedStats.attack,
    attackSpeed: calculatedStats.attackSpeed,
    armor: calculatedStats.armor,
    
    // 戰鬥機制
    attackFrame: Math.round(20 / calculatedStats.attackSpeed),
    defense: calculatedStats.armor, // 向後兼容
    currentFrame: 0,
    
    // 狀態
    isStunned: false,
    stunDuration: 0,
    
    // 特殊能力
    specialAbility: archetype.specialAbility,
    
    // 驗證信息
    balanceInfo: {
      targetCombatPower: targetCombatPower,
      actualCombatPower: calculatedStats.actualCombatPower,
      error: calculatedStats.error,
      dps: calculatedStats.dps,
      ehp: calculatedStats.ehp,
      
      // 三參數
      hpMultiplier: archetype.hpMultiplier,
      speedMultiplier: archetype.speedMultiplier,
      strengthMultiplier: archetype.strengthMultiplier
    }
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

console.log('🎯 三參數敵人系統載入完成 - 修復導出版本');
console.log('📊 模型: 血量乘積 × 攻速乘積 × 強度乘積');
console.log('🎮 第1關戰力: 1200 (匹配玩家初始戰力)');
console.log('✅ getEnemyStats 函數已正確導出');