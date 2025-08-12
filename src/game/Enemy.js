// src/game/Enemy.js
class Enemy {
  constructor(round) {
    // Base stats
    this.baseHp = 80;
    this.baseAttack = 12;
    this.baseSpeed = 0.4;
    
    // Scale stats based on round (7% growth per round both for HP and Attack)
    const scale = Math.pow(1.07, round - 1);
    
    this.maxHp = Math.floor(this.baseHp * scale);
    this.hp = this.maxHp;
    this.attack = Math.floor(this.baseAttack * scale);
    this.speed = this.baseSpeed;
    this.defense = 5; // Fixed defense
    this.critRate = 5; // Fixed crit rate
    
    this.attackFrame = Math.round(20 / this.speed);
    this.currentFrame = 0;
    this.round = round;
  }

  // Calculate damage dealt by enemy
  calculateDamage() {
    const isCrit = Math.random() * 100 < this.critRate;
    const baseDamage = this.attack;
    return {
      damage: isCrit ? Math.floor(baseDamage * 1.5) : baseDamage,
      isCrit
    };
  }

  // Take damage (simple HP reduction)
  takeDamage(rawDamage) {
    const reducedDamage = rawDamage - this.defense;
    const finalDamage = Math.max(1, reducedDamage);
    this.hp = Math.max(0, this.hp - finalDamage);
    return {
      finalDamage,
      isDead: this.hp <= 0
    };
  }

  // Check if enemy can attack this frame
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

  // Reset for combat
  reset() {
    this.currentFrame = 0;
  }

  // Get enemy type name for display
  getTypeName() {
    if (this.round <= 5) return 'Balanced Enemy';
    if (this.round <= 10) return 'Strong Enemy';
    if (this.round <= 15) return 'Elite Enemy';
    return 'Boss Enemy';
  }

  // Get enemy emoji for display
  getEmoji() {
    if (this.round <= 5) return '👹';
    if (this.round <= 10) return '🔥';
    if (this.round <= 15) return '⚡';
    return '💀';
  }
}

export default Enemy;