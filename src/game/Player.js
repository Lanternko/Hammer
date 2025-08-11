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
    this.attackFrame = Math.round(20 / this.attackSpeed); // 20 frames/秒
    this.currentFrame = 0;
  }

  attack() {
    const isCrit = Math.random() < this.critChance;
    return this.attack * (isCrit ? 2 : 1);
  }

  takeDamage(rawDamage) {
    const reduced = rawDamage / (1 + this.armor / 100);
    const final = Math.max(0, reduced - this.flatReduction);
    this.hp -= final;
    return final;
  }
}

export default Player;