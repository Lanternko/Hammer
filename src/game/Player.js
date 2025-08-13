// src/game/Player.js
class Player {
  constructor() {
    this.hp = 100;
    this.maxHp = 100;
<<<<<<< HEAD
    this.attackDamage = 20;
    this.attackSpeed = 0.5;
    this.armor = 20;
    this.flatReduction = 5;
    this.critChance = 0.1;
    this.badges = [];
    this.attackFrame = Math.round(20 / this.attackSpeed);
=======
    this.attackDamage = 10;
    this.defense = 10;
    this.speed = 0.5;
    this.critRate = 5; // percentage
    this.attackFrame = Math.round(20 / this.speed); // 20 frames/second
>>>>>>> a4f7d26e54d25ca90d429092c220c79698ce667a
    this.currentFrame = 0;
    // 新增狀態效果系統
    this.statusEffects = new StatusEffectManager(this);
    
    // 攻擊屬性機率
    this.bleedChance = 0;      // 流血觸發率
    this.comboEnabled = false;  // 是否啟用連擊
    this.poisonChance = 0;     // 中毒觸發率
    
    // 戰鬥狀態
    this.nextAttackCrit = false;
    this.attackSpeedBoost = null;
    this.pendingTrueDamage = 0;
    
    // 同命連結
    this.sympathyLinkEnabled = false;
    this.sympathyLinkTriggered = false;
    this.maxHpLocked = false;
    this.lockedMaxHp = 0;
  }

<<<<<<< HEAD
  attack(target) {
    let damage = this.attack;
    let isCrit = this.nextAttackCrit || Math.random() < this.critChance;
    
    if (isCrit) {
      damage *= 2;
      this.nextAttackCrit = false;
    }
    
    // 處理真實傷害
    if (this.pendingTrueDamage > 0) {
      damage += this.pendingTrueDamage;
      this.pendingTrueDamage = 0;
    }
    
    // 觸發狀態效果
    this.triggerStatusEffects(target, damage);
    
    return damage;
  }

  triggerStatusEffects(target, damage) {
    // 連擊
    if (this.comboEnabled) {
      this.statusEffects.addCombo();
    }
    
    // 流血
    if (Math.random() < this.bleedChance) {
      target.statusEffects.addEffect('bleed', damage * 0.4, 3.0, this.attack);
    }
    
    // 中毒
    if (Math.random() < this.poisonChance) {
      target.statusEffects.addEffect('poison', 0, 5.0);
    }
  }

  takeDamage(rawDamage, ignoreArmor = false) {
    // 同命連結觸發檢查
    this.checkSympathyLink();
    
    let finalDamage;
    if (ignoreArmor) {
      finalDamage = rawDamage;
    } else {
      const reduced = rawDamage / (1 + this.armor / 100);
      finalDamage = Math.max(0, reduced - this.flatReduction);
    }
    
    this.hp = Math.max(0, this.hp - finalDamage);
    
    // 檢查生命值上限鎖定
    if (this.maxHpLocked && this.hp > this.lockedMaxHp) {
      this.hp = this.lockedMaxHp;
    }
    
    return finalDamage;
  }

  checkSympathyLink() {
    if (this.sympathyLinkEnabled && 
        !this.sympathyLinkTriggered && 
        this.hp <= this.maxHp * 0.5) {
      
      this.sympathyLinkTriggered = true;
      this.maxHpLocked = true;
      this.lockedMaxHp = this.maxHp * 0.5;
      
      // 觸發同命連結效果
=======
  // Calculate damage dealt by player
  calculateDamage() {
    const isCrit = Math.random() * 100 < this.critRate;
    const baseDamage = this.attackDamage;
    return {
      damage: isCrit ? Math.floor(baseDamage * 1.5) : baseDamage,
      isCrit
    };
  }

  // Take damage with defense calculation
  takeDamage(rawDamage) {
    const reducedDamage = rawDamage - this.defense;
    const finalDamage = Math.max(1, reducedDamage); // Minimum 1 damage
    this.hp = Math.max(0, this.hp - finalDamage);
    return {
      finalDamage,
      isDead: this.hp <= 0
    };
  }

  // Apply stat boost (for level up rewards)
  applyStatBoost(stat, increasePercent) {
    const currentValue = this[stat];
    const newValue = currentValue * (1 + increasePercent);
    this[stat] = newValue;
    
    // If max HP increased, heal to full
    if (stat === 'maxHp') {
      this.hp = this.maxHp;
    }
    
    // Recalculate attack frame if speed changed
    if (stat === 'speed') {
      this.attackFrame = Math.round(20 / this.speed);
    }
  }

  // Check if player can attack this frame
  canAttack() {
    this.currentFrame++;
    if (this.currentFrame >= this.attackFrame) {
      this.currentFrame = 0;
>>>>>>> a4f7d26e54d25ca90d429092c220c79698ce667a
      return true;
    }
    return false;
  }

<<<<<<< HEAD
  update(deltaTime) {
    this.statusEffects.update(deltaTime);
    
    // 處理攻速加成
    if (this.attackSpeedBoost) {
      this.attackSpeedBoost.duration -= deltaTime;
      if (this.attackSpeedBoost.duration <= 0) {
        this.attackSpeedBoost = null;
      }
    }
  }

  getCurrentAttackSpeed() {
    let speed = this.attackSpeed;
    if (this.attackSpeedBoost) {
      speed *= this.attackSpeedBoost.multiplier;
    }
    return speed;
  }
  
  // ✨ 擴充 Buff 類型
  applyBuff(buff) {
    switch (buff.type) {
      case 'attackDamage':
        this.attackDamage *= buff.value;
        break;
      case 'maxHp':
        this.maxHp *= buff.value;
        this.hp = this.maxHp;
        break;
      case 'armor':
        this.armor *= buff.value;
        break;
      case 'attackSpeed':
        this.attackSpeed *= buff.value;
        this.attackFrame = Math.round(20 / this.attackSpeed); // 更新攻擊幀數
        break;
      case 'critChance':
        this.critChance += buff.value; // 暴擊率是直接相加
        break;
    }
    console.log(`${buff.description} 已應用！`);
=======
  // Get attack progress percentage
  getAttackProgress() {
    return (this.currentFrame / this.attackFrame) * 100;
  }

  attack(isCrit) { // 接收 isCrit 參數
    const damage = this.attackDamage;
    return isCrit ? damage * 2 : damage; // 假設暴擊為2倍傷害
  }

  // Reset for new round
  reset() {
    this.currentFrame = 0;
>>>>>>> a4f7d26e54d25ca90d429092c220c79698ce667a
  }
}

export default Player;