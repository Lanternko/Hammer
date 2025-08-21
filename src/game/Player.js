// src/game/Player.js - 配置化版本
import { applyBadgeEffectToPlayer } from '../data/Badges.js';
import { GAME_CONFIG, GameConfigUtils } from '../config/GameConfig.js';

class Player {
  constructor() {
    // 基礎屬性（使用配置）
    this.baseHp = GAME_CONFIG.PLAYER_BASE_STATS.HP;
    this.baseAttack = GAME_CONFIG.PLAYER_BASE_STATS.ATTACK;
    this.baseAttackSpeed = GAME_CONFIG.PLAYER_BASE_STATS.ATTACK_SPEED;
    this.baseArmor = GAME_CONFIG.PLAYER_BASE_STATS.ARMOR;
    this.baseFlatReduction = GAME_CONFIG.PLAYER_BASE_STATS.FLAT_REDUCTION;
    this.baseCritChance = GAME_CONFIG.PLAYER_BASE_STATS.CRIT_CHANCE;
    
    // 固定值增強（來自徽章）
    this.bonusHp = 0;
    this.bonusAttack = 0;
    this.bonusAttackSpeed = 0;
    this.bonusArmor = 0;
    this.bonusFlatReduction = 0;
    this.bonusCritChance = 0;
    
    // 百分比增強（來自升級）
    this.hpMultiplier = 1.0;
    this.attackMultiplier = 1.0;
    this.attackSpeedMultiplier = 1.0;
    this.armorMultiplier = 1.0;
    
    // 當前狀態
    this.hp = this.getMaxHp();
    this.badges = [];
    this.currentFrame = 0;
    
    // 重錘BD相關狀態
    this.hammerEffects = {
      mastery: false,        // 重錘精通
      storm: false,          // 重錘風暴
      shield: false,         // 重錘護盾
      heal: false,           // 重錘恢復
      fury: false,           // 重錘狂怒
      weight: false,         // 重錘加重
      duration: false        // 重錘延續
    };
    
    // 特殊效果
    this.hasReflectArmor = false;      // 反甲徽章
    this.lifesteal = 0;                // 生命汲取
    this.specialEffects = {};          // 其他特殊效果
    
    // 臨時狀態
    this.tempEffects = {
      guaranteedCrit: false,     // 保證暴擊
      bonusArmor: 0,            // 額外護甲
      bonusArmorDuration: 0,    // 額外護甲持續時間
      speedBoost: 1.0,          // 攻速加成
      speedBoostDuration: 0,    // 攻速加成持續時間
      stunned: false,           // 眩暈狀態
      stunDuration: 0           // 眩暈持續時間
    };
    
    // 經驗值系統
    this.level = 1;
    this.exp = 0;
    this.expToNext = 100;
    
    this.updateAttackFrame();
    
    // 如果開啟調試模式，輸出初始狀態
    if (GAME_CONFIG.DEBUG.ENABLED) {
      console.log('🔧 [DEBUG] Player 初始屬性:', this.getInfo());
    }
  }

  // 獲取有效屬性值
  getMaxHp() {
    return Math.floor((this.baseHp + this.bonusHp) * this.hpMultiplier);
  }

  getEffectiveAttack() {
    return Math.floor((this.baseAttack + this.bonusAttack) * this.attackMultiplier);
  }

  getEffectiveAttackSpeed() {
    return (this.baseAttackSpeed + this.bonusAttackSpeed) * this.attackSpeedMultiplier * this.tempEffects.speedBoost;
  }

  getEffectiveArmor() {
    return Math.floor((this.baseArmor + this.bonusArmor) * this.armorMultiplier) + this.tempEffects.bonusArmor;
  }

  get maxHp() {
    return this.getMaxHp();
  }

  get attack() {
    return this.getEffectiveAttack();
  }

  get attackSpeed() {
    return this.getEffectiveAttackSpeed();
  }

  get armor() {
    return this.getEffectiveArmor();
  }

  get flatReduction() {
    return this.baseFlatReduction + this.bonusFlatReduction;
  }

  get critChance() {
    return Math.min(1.0, this.baseCritChance + this.bonusCritChance);
  }

  get attackFrame() {
    return Math.round(GAME_CONFIG.BATTLE_FPS / this.getEffectiveAttackSpeed());
  }

  // 裝備徽章
  equipBadge(badge) {
    this.badges.push(badge);
    applyBadgeEffectToPlayer(this, badge);
    console.log(`裝備徽章: ${badge.name}`);
    
    // 調試模式下輸出詳細信息
    if (GAME_CONFIG.DEBUG.ENABLED) {
      console.log('🔧 [DEBUG] 裝備徽章後屬性:', this.getInfo());
    }
  }

  // 攻擊方法 - 包含重錘效果和生命汲取
  performAttack() {
    let damage = this.getEffectiveAttack();
    let isCrit = Math.random() < this.critChance || this.tempEffects.guaranteedCrit;
    let isHammerProc = false;
    
    // 狂戰士效果：血量低於50%時攻擊力提升
    if (this.specialEffects.berserker && this.hp / this.maxHp < 0.5) {
      damage *= 1.3; // +30%攻擊力
      if (GAME_CONFIG.DEBUG.LOG_DAMAGE_CALCULATIONS) {
        console.log('🔧 [DEBUG] 狂戰士效果觸發，攻擊力+30%');
      }
    }
    
    // 重錘精通：使用配置化的機率和傷害
    if (this.hammerEffects.mastery) {
      const hammerConfig = GameConfigUtils.getHammerConfig(
        this.hammerEffects.weight, 
        this.hammerEffects.duration
      );
      
      if (Math.random() < hammerConfig.procChance) {
        isHammerProc = true;
        damage *= hammerConfig.damageMultiplier;
        console.log(`🔨 重錘精通觸發！${(hammerConfig.damageMultiplier * 100).toFixed(0)}%傷害`);
        
        // 觸發其他重錘效果
        this.triggerHammerEffects();
        
        if (GAME_CONFIG.DEBUG.LOG_DAMAGE_CALCULATIONS) {
          console.log(`🔧 [DEBUG] 重錘傷害: ${damage.toFixed(1)} (倍率: ${hammerConfig.damageMultiplier})`);
        }
      }
    }
    
    // 暴擊計算
    if (isCrit) {
      damage *= 2;
      if (GAME_CONFIG.DEBUG.LOG_DAMAGE_CALCULATIONS) {
        console.log(`🔧 [DEBUG] 暴擊觸發，最終傷害: ${damage.toFixed(1)}`);
      }
    }
    
    // 生命汲取
    if (this.lifesteal > 0) {
      this.hp = Math.min(this.maxHp, this.hp + this.lifesteal);
      console.log(`🩸 生命汲取：回復 ${this.lifesteal} 血量`);
    }
    
    // 重置保證暴擊狀態
    this.tempEffects.guaranteedCrit = false;
    
    return {
      damage: damage,
      isCrit: isCrit,
      isHammerProc: isHammerProc
    };
  }

  triggerHammerEffects() {
    // 重錘風暴：下次攻擊必定暴擊
    if (this.hammerEffects.storm) {
      this.tempEffects.guaranteedCrit = true;
      console.log('🌪️ 重錘風暴：下次攻擊必定暴擊');
    }
    
    // 重錘護盾：使用配置的護甲值和持續時間
    if (this.hammerEffects.shield) {
      this.tempEffects.bonusArmor = GAME_CONFIG.HAMMER_CONFIG.EFFECTS.SHIELD_ARMOR;
      this.tempEffects.bonusArmorDuration = GAME_CONFIG.HAMMER_CONFIG.EFFECTS.SHIELD_DURATION;
      console.log(`🛡️ 重錘護盾：+${GAME_CONFIG.HAMMER_CONFIG.EFFECTS.SHIELD_ARMOR}護甲 ${GAME_CONFIG.HAMMER_CONFIG.EFFECTS.SHIELD_DURATION}秒`);
    }
    
    // 重錘恢復：使用配置的回復量
    if (this.hammerEffects.heal) {
      const healAmount = GAME_CONFIG.HAMMER_CONFIG.EFFECTS.HEAL_AMOUNT;
      this.hp = Math.min(this.maxHp, this.hp + healAmount);
      console.log(`💚 重錘恢復：+${healAmount}生命值`);
    }
    
    // 重錘狂怒：使用配置的攻速加成和持續時間
    if (this.hammerEffects.fury) {
      this.tempEffects.speedBoost = GAME_CONFIG.HAMMER_CONFIG.EFFECTS.FURY_SPEED_BOOST;
      this.tempEffects.speedBoostDuration = GAME_CONFIG.HAMMER_CONFIG.EFFECTS.FURY_DURATION;
      const speedBoostPercent = ((GAME_CONFIG.HAMMER_CONFIG.EFFECTS.FURY_SPEED_BOOST - 1) * 100).toFixed(0);
      console.log(`🔥 重錘狂怒：攻速+${speedBoostPercent}% ${GAME_CONFIG.HAMMER_CONFIG.EFFECTS.FURY_DURATION}秒`);
    }
  }

  // 更新攻擊間隔
  updateAttackFrame() {
    let effectiveSpeed = this.getEffectiveAttackSpeed();
    
    // 狂戰士效果：血量低於50%時攻速也提升
    if (this.specialEffects.berserker && this.hp / this.maxHp < 0.5) {
      effectiveSpeed *= 1.25; // +25%攻速
    }
    
    // 使用配置的戰鬥FPS
    this.currentAttackFrame = Math.round(GAME_CONFIG.BATTLE_FPS / effectiveSpeed);
    
    if (GAME_CONFIG.DEBUG.LOG_DAMAGE_CALCULATIONS) {
      console.log(`🔧 [DEBUG] 攻擊間隔更新: ${this.currentAttackFrame} 幀 (攻速: ${effectiveSpeed.toFixed(2)})`);
    }
  }

  // 受到傷害
  takeDamage(damage, ignoresArmor = false) {
    let finalDamage = damage;
    
    if (!ignoresArmor) {
      const effectiveArmor = this.getEffectiveArmor();
      const reduced = damage / (1 + effectiveArmor / 100);
      finalDamage = Math.max(1, reduced - this.flatReduction);
      
      if (GAME_CONFIG.DEBUG.LOG_DAMAGE_CALCULATIONS) {
        console.log(`🔧 [DEBUG] 傷害計算: ${damage.toFixed(1)} → 護甲減傷 → ${reduced.toFixed(1)} → 固減 → ${finalDamage.toFixed(1)}`);
      }
    }
    
    this.hp = Math.max(0, this.hp - finalDamage);
    console.log(`受到 ${finalDamage.toFixed(1)} 傷害，剩餘 HP: ${this.hp}/${this.maxHp}`);
    
    return this.hp <= 0; // 返回是否死亡
  }

  // 每幀更新（處理臨時效果）
  updateTempEffects(deltaTime = GAME_CONFIG.BASE_DELTA_TIME) {
    // 更新護甲加成持續時間
    if (this.tempEffects.bonusArmorDuration > 0) {
      this.tempEffects.bonusArmorDuration -= deltaTime;
      if (this.tempEffects.bonusArmorDuration <= 0) {
        this.tempEffects.bonusArmor = 0;
        console.log('🛡️ 重錘護盾效果結束');
      }
    }
    
    // 更新攻速加成持續時間
    if (this.tempEffects.speedBoostDuration > 0) {
      this.tempEffects.speedBoostDuration -= deltaTime;
      if (this.tempEffects.speedBoostDuration <= 0) {
        this.tempEffects.speedBoost = 1.0;
        console.log('🔥 重錘狂怒效果結束');
      }
    }
    
    // 更新眩暈持續時間
    if (this.tempEffects.stunDuration > 0) {
      this.tempEffects.stunDuration -= deltaTime;
      if (this.tempEffects.stunDuration <= 0) {
        this.tempEffects.stunned = false;
        console.log('😵 眩暈效果結束');
      }
    }
  }

  // 應用固定值增強（來自徽章）
  applyFlatBonus(type, value) {
    const oldValue = this.getCurrentStatValue(type);
    
    switch(type) {
      case 'hp':
        this.bonusHp += value;
        this.hp += value; // 同時增加當前血量
        break;
      case 'attack':
        this.bonusAttack += value;
        break;
      case 'attackSpeed':
        this.bonusAttackSpeed += value;
        break;
      case 'armor':
        this.bonusArmor += value;
        break;
      case 'flatReduction':
        this.bonusFlatReduction += value;
        break;
      case 'critChance':
        this.bonusCritChance += value;
        break;
    }
    
    // 調試模式下記錄屬性變化
    if (GAME_CONFIG.DEBUG.ENABLED) {
      const newValue = this.getCurrentStatValue(type);
      console.log(`🔧 [DEBUG] 固定值加成 ${type}: ${oldValue.toFixed(2)} → ${newValue.toFixed(2)} (+${value})`);
    }
  }

  // 應用百分比增強（來自升級）
  applyPercentageBonus(type, multiplier) {
    const oldMaxHp = this.maxHp;
    const oldValue = this.getCurrentStatValue(type);
    
    switch(type) {
      case 'hp':
        this.hpMultiplier *= (1 + multiplier);
        // 血量百分比增加時，同時增加當前血量
        this.hp = Math.min(this.maxHp, this.hp + (this.maxHp - oldMaxHp));
        break;
      case 'attack':
        this.attackMultiplier *= (1 + multiplier);
        break;
      case 'attackSpeed':
        this.attackSpeedMultiplier *= (1 + multiplier);
        break;
      case 'armor':
        this.armorMultiplier *= (1 + multiplier);
        break;
    }
    
    // 調試模式下記錄屬性變化
    if (GAME_CONFIG.DEBUG.ENABLED) {
      const newValue = this.getCurrentStatValue(type);
      const percentChange = ((newValue / oldValue - 1) * 100).toFixed(1);
      console.log(`🔧 [DEBUG] 百分比加成 ${type}: ${oldValue.toFixed(2)} → ${newValue.toFixed(2)} (+${percentChange}%)`);
    }
  }

  // 獲取當前屬性值（用於調試）
  getCurrentStatValue(type) {
    switch(type) {
      case 'hp': return this.maxHp;
      case 'attack': return this.getEffectiveAttack();
      case 'attackSpeed': return this.getEffectiveAttackSpeed();
      case 'armor': return this.getEffectiveArmor();
      case 'flatReduction': return this.flatReduction;
      case 'critChance': return this.critChance;
      default: return 0;
    }
  }

  // 獲取當前狀態信息
  getStatusInfo() {
    const status = [];
    
    if (this.tempEffects.guaranteedCrit) {
      status.push('⚡ 下次攻擊必定暴擊');
    }
    
    if (this.tempEffects.bonusArmor > 0) {
      status.push(`🛡️ 護甲 +${this.tempEffects.bonusArmor} (${this.tempEffects.bonusArmorDuration.toFixed(1)}s)`);
    }
    
    if (this.tempEffects.speedBoost > 1.0) {
      const boost = ((this.tempEffects.speedBoost - 1.0) * 100).toFixed(0);
      status.push(`🔥 攻速 +${boost}% (${this.tempEffects.speedBoostDuration.toFixed(1)}s)`);
    }
    
    if (this.tempEffects.stunned) {
      status.push(`😵 眩暈 (${this.tempEffects.stunDuration.toFixed(1)}s)`);
    }
    
    // 狂戰士狀態
    if (this.specialEffects.berserker && this.hp / this.maxHp < 0.5) {
      status.push('🔴 狂戰士：攻擊+30%，攻速+25%');
    }
    
    // 生命汲取
    if (this.lifesteal > 0) {
      status.push(`🩸 生命汲取: +${this.lifesteal}/攻擊`);
    }
    
    return status;
  }

  // 獲取徽章描述（用於UI顯示）
  getBadgeDescriptions() {
    return this.badges.map(badge => {
      // 根據當前配置動態生成描述
      let description = badge.description;
      
      // 如果是重錘相關徽章，使用配置生成動態描述
      if (badge.key === 'hammerMastery') {
        const config = GameConfigUtils.getHammerConfig(
          this.hammerEffects.weight, 
          this.hammerEffects.duration
        );
        description = `每次攻擊有${(config.procChance * 100).toFixed(0)}%機率造成${(config.damageMultiplier * 100).toFixed(0)}%傷害並眩暈敵人${config.stunDuration}秒`;
      }
      
      return `${badge.icon} ${badge.name}: ${description}`;
    });
  }

  gainExp(amount) {
    this.exp += amount;
    if (this.exp >= this.expToNext) {
      this.levelUp();
    }
  }

  levelUp() {
    this.level++;
    this.exp = 0;
    this.expToNext = Math.floor(this.expToNext * 1.2);
    
    // 升級獎勵 - 可以考慮配置化
    const hpBonus = 10;
    const attackBonus = 2;
    
    this.bonusHp += hpBonus;
    this.bonusAttack += attackBonus;
    this.hp += hpBonus; // 增加當前血量
    
    console.log(`升級！等級: ${this.level}, 血量+${hpBonus}, 攻擊+${attackBonus}`);
    
    if (GAME_CONFIG.DEBUG.ENABLED) {
      console.log('🔧 [DEBUG] 升級後屬性:', this.getInfo());
    }
  }

  // 重置當前攻擊框架
  reset() {
    this.currentFrame = 0;
  }

  // 獲取詳細信息（用於調試）
  getInfo() {
    return {
      // 基礎屬性
      baseStats: {
        hp: this.baseHp,
        attack: this.baseAttack,
        attackSpeed: this.baseAttackSpeed,
        armor: this.baseArmor,
        flatReduction: this.baseFlatReduction,
        critChance: this.baseCritChance
      },
      
      // 固定值加成
      bonusStats: {
        hp: this.bonusHp,
        attack: this.bonusAttack,
        attackSpeed: this.bonusAttackSpeed,
        armor: this.bonusArmor,
        flatReduction: this.bonusFlatReduction,
        critChance: this.bonusCritChance
      },
      
      // 百分比倍率
      multipliers: {
        hp: this.hpMultiplier,
        attack: this.attackMultiplier,
        attackSpeed: this.attackSpeedMultiplier,
        armor: this.armorMultiplier
      },
      
      // 有效屬性
      effectiveStats: {
        hp: this.hp,
        maxHp: this.maxHp,
        attack: this.attack,
        attackSpeed: this.attackSpeed,
        armor: this.armor,
        flatReduction: this.flatReduction,
        critChance: this.critChance,
        attackFrame: this.attackFrame
      },
      
      // 重錘BD狀態
      hammerEffects: { ...this.hammerEffects },
      
      // 臨時效果
      tempEffects: { ...this.tempEffects },
      
      // 特殊效果
      specialEffects: { ...this.specialEffects },
      hasReflectArmor: this.hasReflectArmor,
      lifesteal: this.lifesteal,
      
      // 其他信息
      badges: this.badges.length,
      level: this.level,
      exp: `${this.exp}/${this.expToNext}`
    };
  }

  // 性能監控方法（調試用）
  getPerformanceStats() {
    if (!GAME_CONFIG.DEBUG.SHOW_PERFORMANCE_METRICS) return null;
    
    return {
      effectiveDPS: this.getEffectiveAttack() * this.getEffectiveAttackSpeed(),
      tankiness: this.maxHp * (1 + this.getEffectiveArmor() / 100),
      hammerProcChance: this.hammerEffects.mastery ? 
        GameConfigUtils.getHammerConfig(this.hammerEffects.weight, this.hammerEffects.duration).procChance : 0,
      totalCritChance: Math.min(1.0, this.critChance + (this.tempEffects.guaranteedCrit ? 1.0 : 0))
    };
  }
}

export default Player;