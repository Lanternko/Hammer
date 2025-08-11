// src/systems/BattleSystem.js
import UIManager from '../ui/UIManager.js';

class BattleSystem {
  constructor(player, enemy, gameManager) {
    this.player = player;
    this.enemy = enemy;
    this.gameManager = gameManager;
    this.frameCount = 0;
    this.isActive = true;
    this.uiManager = new UIManager();
  }

  start() {
    const loop = () => {
      if (!this.isActive) return;
      this.tick();
      this.uiManager.drawBattle(this.player, this.enemy);
      requestAnimationFrame(loop);
    };
    loop();
  }

  tick() {
    this.player.currentFrame++;
    this.enemy.currentFrame++;

    if (this.player.currentFrame >= this.player.attackFrame) {
      if (typeof this.player.attack !== 'function') {
        console.error('Player attack is not a function:', this.player);
        this.isActive = false;
        return;
      }
      const dmg = this.player.attack();
      console.log(`Player deals ${dmg} damage`); // 診斷
      if (this.enemy.takeDamage(dmg)) {
        this.isActive = false;
        this.gameManager.endBattle(true);
      }
      this.player.currentFrame = 0;
      this.uiManager.showDamage(dmg, this.player.critChance > Math.random(), false);
    }

    if (this.enemy.currentFrame >= this.enemy.attackFrame && this.isActive) {
      if (typeof this.enemy.attack !== 'function') {
        console.error('Enemy attack is not a function:', this.enemy);
        this.isActive = false;
        return;
      }
      const rawDmg = this.enemy.attack();
      const finalDmg = this.player.takeDamage(rawDmg);
      console.log(`Enemy deals ${finalDmg} damage`); // 診斷
      if (this.player.hp <= 0) {
        this.isActive = false;
        this.gameManager.endBattle(false);
      }
      this.enemy.currentFrame = 0;
      this.uiManager.showDamage(finalDmg, false, true);
    }
  }
}

export default BattleSystem;