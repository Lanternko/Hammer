// src/game/Player.js - 升級版
class Player {
  constructor() {
    this.hp = 100;
    this.maxHp = 100;
    this.attack = 20;
    this.attackSpeed = 0.5;
    this.armor = 20;
    this.flatReduction = 5;
    this.critChance = 0.1;
    this.badges = [];
    this.attackFrame = Math.round(20 / this.attackSpeed);
    this.currentFrame = 0;
    
    // 重錘BD相關狀態
    this.hammerEffects = {
      mastery: false,        // 重錘精通
      storm: false,          // 重錘風暴
      shield: false,         // 重錘護盾
      heal: false,           // 重錘恢復
      fury: false            // 重錘狂怒
    };
    
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
  }

  // 裝備徽章
  equipBadge(badge) {
    this.badges.push(badge);
    this.applyBadgeEffect(badge);
    console.log(`裝備徽章: ${badge.name}`);
  }

  applyBadgeEffect(badge) {
    if (badge.effect.maxHp) {
      this.maxHp += badge.effect.maxHp;
      this.hp += badge.effect.maxHp; // 也增加當前血量
    }
    if (badge.effect.attack) this.attack += badge.effect.attack;
    if (badge.effect.armor) this.armor += badge.effect.armor;
    if (badge.effect.attackSpeed) {
      this.attackSpeed += badge.effect.attackSpeed;
      this.attackFrame = Math.round(20 / this.attackSpeed);
    }
    if (badge.effect.critChance) this.critChance += badge.effect.critChance;
    if (badge.effect.lifesteal) {
      // 吸血效果暫時只記錄，之後在攻擊時實現
      this.lifesteal = (this.lifesteal || 0) + badge.effect.lifesteal;
    }
    
    // 重錘BD效果
    if (badge.effect.hammerMastery) this.hammerEffects.mastery = true;
    if (badge.effect.hammerStorm) this.hammerEffects.storm = true;
    if (badge.effect.hammerShield) this.hammerEffects.shield = true;
    if (badge.effect.hammerHeal) this.hammerEffects.heal = true;
    if (badge.effect.hammerFury) this.hammerEffects.fury = true;
  }

  // 攻擊方法 - 加入重錘效果
  performAttack() {
    let damage = this.attack;
    let isCrit = Math.random() < this.critChance || this.tempEffects.guaranteedCrit;
    let isHammerProc = false;
    
    // 重錘精通：25%機率觸發
    if (this.hammerEffects.mastery && Math.random() < 0.25) {
      isHammerProc = true;
      damage *= 1.5; // 150%傷害
      console.log('🔨 重錘精通觸發！150%傷害');
      
      // 觸發其他重錘效果
      this.triggerHammerEffects();
    }
    
    // 暴擊計算
    if (isCrit) {
      damage *= 2;
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
    
    // 重錘護盾：獲得10點護甲5秒
    if (this.hammerEffects.shield) {
      this.tempEffects.bonusArmor = 10;
      this.tempEffects.bonusArmorDuration = 5.0; // 5秒 = 100 frames (20fps)
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
      this.tempEffects.speedBoostDuration = 3.0; // 3秒 = 60 frames
      this.updateAttackFrame();
      console.log('🔥 重錘狂怒：攻速+50% 3秒');
    }
  }

  // 更新攻擊間隔
  updateAttackFrame() {
    const effectiveSpeed = this.attackSpeed * this.tempEffects.speedBoost;
    this.attackFrame = Math.round(20 / effectiveSpeed);
  }

  // 獲取當前有效護甲值
  getEffectiveArmor() {
    return this.armor + this.tempEffects.bonusArmor;
  }

  // 受到傷害
  takeDamage(damage) {
    const effectiveArmor = this.getEffectiveArmor();
    const reduced = damage / (1 + effectiveArmor / 100);
    const finalDamage = Math.max(1, reduced - this.flatReduction);
    
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
        this.updateAttackFrame();
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

  // 獲取徽章描述（用於UI顯示）
  getBadgeDescriptions() {
    return this.badges.map(badge => `${badge.icon} ${badge.name}: ${badge.description}`);
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
    
    return status;
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
    this.expToNext = Math.floor(this.expToNext * 1.2); // 每級需要更多經驗
    
    // 升級獎勵
    this.maxHp += 10;
    this.hp += 10; // 升級時回復血量
    this.attack += 2;
    
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
      effectiveArmor: this.getEffectiveArmor(),
      critChance: this.critChance,
      badges: this.badges.length,
      hammerEffects: this.hammerEffects,
      tempEffects: this.tempEffects
    };
  }
}