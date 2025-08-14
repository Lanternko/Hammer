// src/game/Player.js - 平衡重錘機制版本
import { applyBadgeEffectToPlayer } from '../data/Badges.js';

class Player {
  constructor() {
    // 基礎屬性（只會被固定值修改）
    this.baseHp = 100;
    this.baseAttack = 20;
    this.baseAttackSpeed = 0.5;
    this.baseArmor = 20;
    this.baseFlatReduction = 5;
    this.baseCritChance = 0.1;
    
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
    
    // 🔧 修復：確保 badges 數組正確初始化
    this.badges = this.badges || [];
    this.currentFrame = 0;
    
    // 重錘BD相關狀態
    this.hammerEffects = {
      mastery: false,
      storm: false,
      shield: false,
      heal: false,
      fury: false,
      weight: false,
      duration: false
    };
    
    // 特殊效果
    this.hasReflectArmor = false;
    this.lifesteal = 0;
    this.lifestealPercent = 0;
    this.specialEffects = {};
    
    // 臨時狀態
    this.tempEffects = {
      guaranteedCrit: false,
      bonusArmor: 0,
      bonusArmorDuration: 0,
      speedBoost: 1.0,
      speedBoostDuration: 0,
      stunned: false,
      stunDuration: 0
    };
    
    // 經驗值系統
    this.level = 1;
    this.exp = 0;
    this.expToNext = 100;
    
    this.updateAttackFrame();
    
    console.log('✅ Player 初始化完成，badges 數組:', this.badges);
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
    return Math.round(20 / this.getEffectiveAttackSpeed());
  }

  // 修復：安全的裝備徽章方法
  equipBadge(badge) {
    try {
      // 🔧 確保 badges 數組存在
      if (!this.badges) {
        this.badges = [];
        console.warn('⚠️ badges 數組不存在，已重新初始化');
      }

      // 🔧 驗證 badge 對象
      if (!badge) {
        console.error('❌ 嘗試裝備空的徽章');
        return;
      }

      if (!badge.name) {
        console.error('❌ 徽章缺少名稱屬性:', badge);
        return;
      }

      // 添加徽章到數組
      this.badges.push(badge);
      
      // 🔧 安全應用徽章效果
      this.applyBadgeEffectSafe(badge);
      
      console.log(`✅ 裝備徽章: ${badge.name}, 當前徽章數: ${this.badges.length}`);
      
    } catch (error) {
      console.error('❌ 裝備徽章錯誤:', error, '徽章:', badge);
    }
  }

  // 新增：安全的徽章效果應用
  applyBadgeEffectSafe(badge) {
    try {
      // 檢查是否有徽章數據模組
      if (typeof applyBadgeEffectToPlayer === 'function') {
        applyBadgeEffectToPlayer(this, badge);
      } else {
        // 備用方案：直接應用基本效果
        this.applyBasicBadgeEffect(badge);
      }
    } catch (error) {
      console.error('❌ 應用徽章效果錯誤:', error);
      // 嘗試備用方案
      this.applyBasicBadgeEffect(badge);
    }
  }

  // 新增：基本徽章效果應用（備用方案）
  applyBasicBadgeEffect(badge) {
    try {
      if (!badge || !badge.effect) {
        return;
      }

      const effect = badge.effect;
      
      // 重錘效果
      if (effect.hammerMastery) this.hammerEffects.mastery = true;
      if (effect.hammerStorm) this.hammerEffects.storm = true;
      if (effect.hammerShield) this.hammerEffects.shield = true;
      if (effect.hammerHeal) this.hammerEffects.heal = true;
      if (effect.hammerFury) this.hammerEffects.fury = true;
      if (effect.hammerWeight) this.hammerEffects.weight = true;
      if (effect.hammerDuration) this.hammerEffects.duration = true;
      
      // 基礎屬性效果
      if (effect.flatHp) this.applyFlatBonus('hp', effect.flatHp);
      if (effect.flatAttack) this.applyFlatBonus('attack', effect.flatAttack);
      if (effect.flatArmor) this.applyFlatBonus('armor', effect.flatArmor);
      if (effect.flatAttackSpeed) this.applyFlatBonus('attackSpeed', effect.flatAttackSpeed);
      if (effect.flatCritChance) this.applyFlatBonus('critChance', effect.flatCritChance);
      if (effect.flatReduction) this.applyFlatBonus('flatReduction', effect.flatReduction);
      
      // 特殊效果
      if (effect.reflectArmor) this.hasReflectArmor = true;
      if (effect.lifestealPercent) this.lifestealPercent = (this.lifestealPercent || 0) + effect.lifestealPercent;
      if (effect.lifesteal) this.lifesteal = (this.lifesteal || 0) + effect.lifesteal;
      
      console.log(`✅ 基本徽章效果已應用: ${badge.name}`);
      
    } catch (error) {
      console.error('❌ 基本徽章效果應用錯誤:', error);
    }
  }

  // 攻擊方法 - 包含平衡的重錘效果和百分比生命汲取
  performAttack() {
    let damage = this.getEffectiveAttack();
    let isCrit = Math.random() < this.critChance || this.tempEffects.guaranteedCrit;
    let isHammerProc = false;
    
    // 狂戰士效果：血量低於50%時攻擊力提升
    if (this.specialEffects.berserker && this.hp / this.maxHp < 0.5) {
      damage *= 1.3; // +30%攻擊力
    }
    
    // 重錘精通：25%機率觸發（重錘加重提升至35%）
    const hammerChance = this.hammerEffects.weight ? 0.35 : 0.25;
    if (this.hammerEffects.mastery && Math.random() < hammerChance) {
      isHammerProc = true;
      // 重錘加重：傷害倍率170%，否則150%
      const damageMultiplier = this.hammerEffects.weight ? 1.7 : 1.5;
      damage *= damageMultiplier;
      console.log(`🔨 重錘精通觸發！${(damageMultiplier * 100).toFixed(0)}%傷害`);
      
      // 觸發其他重錘效果
      this.triggerHammerEffects();
    }
    
    // 暴擊計算
    if (isCrit) {
      damage *= 2;
    }
    
    // 平衡的生命汲取系統
    this.applyLifesteal(damage);
    
    // 重置保證暴擊狀態
    this.tempEffects.guaranteedCrit = false;
    
    return {
      damage: damage,
      isCrit: isCrit,
      isHammerProc: isHammerProc
    };
  }

  // 新增：平衡的生命汲取系統
  applyLifesteal(damage) {
    let totalLifesteal = 0;
    
    // 固定值生命汲取（舊系統相容性）
    if (this.lifesteal > 0) {
      totalLifesteal += this.lifesteal;
    }
    
    // 百分比生命汲取（新系統）
    if (this.lifestealPercent > 0) {
      totalLifesteal += this.getEffectiveAttack() * this.lifestealPercent;
    }
    
    if (totalLifesteal > 0) {
      this.hp = Math.min(this.maxHp, this.hp + totalLifesteal);
      console.log(`🩸 生命汲取：回復 ${totalLifesteal.toFixed(1)} 血量`);
    }
  }

  triggerHammerEffects() {
    // 重錘風暴：下次攻擊必定暴擊
    if (this.hammerEffects.storm) {
      this.tempEffects.guaranteedCrit = true;
      console.log('🌪️ 重錘風暴：下次攻擊必定暴擊');
    }
    
    // 重錘護盾：獲得10點護甲5秒
    if (this.hammerEffects.shield) {
      this.tempEffects.bonusArmor = 10;
      this.tempEffects.bonusArmorDuration = 5.0;
      console.log('🛡️ 重錘護盾：+10護甲 5秒');
    }
    
    // 重錘恢復：回復15點生命值
    if (this.hammerEffects.heal) {
      this.hp = Math.min(this.maxHp, this.hp + 15);
      console.log('💚 重錘恢復：+15生命值');
    }
    
    // 重錘狂怒：攻擊速度+50% 3秒
    if (this.hammerEffects.fury) {
      this.tempEffects.speedBoost = 1.5;
      this.tempEffects.speedBoostDuration = 3.0;
      console.log('🔥 重錘狂怒：攻速+50% 3秒');
    }
  }

  // 新增：計算平衡的重錘眩暈時間
  getHammerStunDuration() {
    // 基礎眩暈時間：重錘延續=2秒，否則1秒
    let baseDuration = this.hammerEffects.duration ? 2.0 : 1.0;
    
    // 根據攻速調整眩暈時間：攻速越慢，眩暈越久
    // 基準攻速0.5，眩暈時間乘數 = (0.5 / 當前攻速)^0.5
    const baseSpeed = 0.5;
    const currentSpeed = this.getEffectiveAttackSpeed();
    const speedRatio = Math.pow(baseSpeed / currentSpeed, 0.5);
    
    // 限制眩暈時間在合理範圍內 (0.5秒 到 4秒)
    const adjustedDuration = Math.max(0.5, Math.min(4.0, baseDuration * speedRatio));
    
    console.log(`🔨 重錘眩暈：基礎${baseDuration}s，攻速${currentSpeed.toFixed(2)}，調整至${adjustedDuration.toFixed(1)}s`);
    return adjustedDuration;
  }

  // 更新攻擊間隔
  updateAttackFrame() {
    let effectiveSpeed = this.getEffectiveAttackSpeed();
    
    // 狂戰士效果：血量低於50%時攻速也提升
    if (this.specialEffects.berserker && this.hp / this.maxHp < 0.5) {
      effectiveSpeed *= 1.25; // +25%攻速
    }
    
    this.currentAttackFrame = Math.round(20 / effectiveSpeed);
  }

  // 受到傷害
  takeDamage(damage, ignoresArmor = false) {
    let finalDamage = damage;
    
    if (!ignoresArmor) {
      const effectiveArmor = this.getEffectiveArmor();
      const reduced = damage / (1 + effectiveArmor / 100);
      finalDamage = Math.max(1, reduced - this.flatReduction);
    }
    
    this.hp = Math.max(0, this.hp - finalDamage);
    console.log(`受到 ${finalDamage.toFixed(1)} 傷害，剩餘 HP: ${this.hp}/${this.maxHp}`);
    
    return this.hp <= 0; // 返回是否死亡
  }

  // 每幀更新（處理臨時效果）
  updateTempEffects(deltaTime = 0.05) {
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
  }

  // 應用百分比增強（來自升級）
  applyPercentageBonus(type, multiplier) {
    const oldMaxHp = this.maxHp;
    
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
    
    // 生命汲取顯示
    const lifestealDisplay = [];
    if (this.lifesteal > 0) {
      lifestealDisplay.push(`固定${this.lifesteal}`);
    }
    if (this.lifestealPercent > 0) {
      lifestealDisplay.push(`${(this.lifestealPercent * 100).toFixed(0)}%攻擊力`);
    }
    if (lifestealDisplay.length > 0) {
      status.push(`🩸 生命汲取: ${lifestealDisplay.join(' + ')}`);
    }
    
    return status;
  }

  // 修復：安全的獲取徽章描述
  getBadgeDescriptions() {
    try {
      if (!this.badges || !Array.isArray(this.badges)) {
        console.warn('⚠️ badges 不是有效數組，返回空數組');
        return [];
      }
      
      return this.badges.map(badge => {
        if (!badge) return '未知徽章';
        return `${badge.icon || '❓'} ${badge.name || '未知'}: ${badge.description || '無描述'}`;
      });
      
    } catch (error) {
      console.error('❌ 獲取徽章描述錯誤:', error);
      return [];
    }
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
    
    // 升級獎勵
    this.bonusHp += 10;
    this.bonusAttack += 2;
    this.hp += 10; // 增加當前血量
    
    console.log(`升級！等級: ${this.level}, 血量+10, 攻擊+2`);
  }

  // 重置當前攻擊框架
  reset() {
    this.currentFrame = 0;
  }

  // 獲取詳細信息（用於調試）
  getInfo() {
    return {
      hp: this.hp,
      maxHp: this.maxHp,
      attack: this.attack,
      attackSpeed: this.attackSpeed,
      armor: this.armor,
      flatReduction: this.flatReduction,
      critChance: this.critChance,
      badges: this.badges.length,
      hammerEffects: this.hammerEffects,
      tempEffects: this.tempEffects,
      hasReflectArmor: this.hasReflectArmor,
      lifesteal: this.lifesteal,
      lifestealPercent: this.lifestealPercent,
      specialEffects: this.specialEffects,
      // 分離的屬性
      baseStats: {
        hp: this.baseHp,
        attack: this.baseAttack,
        attackSpeed: this.baseAttackSpeed,
        armor: this.baseArmor
      },
      bonusStats: {
        hp: this.bonusHp,
        attack: this.bonusAttack,
        attackSpeed: this.bonusAttackSpeed,
        armor: this.bonusArmor
      },
      multipliers: {
        hp: this.hpMultiplier,
        attack: this.attackMultiplier,
        attackSpeed: this.attackSpeedMultiplier,
        armor: this.armorMultiplier
      }
    };
  }
}

export default Player;