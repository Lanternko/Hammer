// src/game/Player.js
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
}

export default Player;