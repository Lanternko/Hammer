// src/game/Player.js
class Player {
  constructor() {
    this.hp = 100;
    this.maxHp = 100;
    this.attackDamage = 10;
    this.defense = 10;
    this.speed = 0.5;
    this.critRate = 5; // percentage
    this.attackFrame = Math.round(20 / this.speed); // 20 frames/second
    this.currentFrame = 0;
  }

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
      return true;
    }
    return false;
  }

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
  }
}

export default Player;