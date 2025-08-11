import { getEnemyStats } from '../data/enemies.js';

class Enemy {
  constructor(level, type) {
    Object.assign(this, getEnemyStats(level, type));
  }

  attack() {
    return this.attackDamage;
  }

  takeDamage(damage) {
    this.hp -= damage;
    return this.hp <= 0;
  }
}

export default Enemy;