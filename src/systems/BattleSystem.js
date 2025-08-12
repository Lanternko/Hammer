// src/systems/BattleSystem.js

class BattleSystem {
  // 修改 constructor 來接收 uiManager
  constructor(player, enemy, gameManager, uiManager) {
    this.player = player;
    this.enemy = enemy;
    this.gameManager = gameManager;
    this.isActive = false;
    this.uiManager = uiManager; // 使用從 GameManager 傳入的實例
  }

  start() {
    this.isActive = true;
    this.uiManager.updateRound(this.gameManager.currentLevel);
    this.uiManager.addLogEntry(`⚔️ Combat begins!`);

    const loop = (timestamp) => {
      if (!this.isActive) return;
      this.tick();
      this.uiManager.drawBattle(this.player, this.enemy);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  tick() {
    // 只有在戰鬥進行中才增加 frame
    if(!this.isActive) return;

    this.player.currentFrame++;
    this.enemy.currentFrame++;

    // 玩家攻擊
    if (this.player.currentFrame >= this.player.attackFrame) {
      this.player.currentFrame = 0;
      const dmg = this.player.attack(); // 傷害在 Player 內部計算
      const isCrit = Math.random() < this.player.critChance;
      const finalDmg = isCrit ? dmg * 2 : dmg; // 假設暴擊兩倍

      this.uiManager.showDamage(finalDmg, isCrit, false);
      this.uiManager.addLogEntry(`Player deals ${finalDmg.toFixed(1)} ${isCrit ? 'CRIT' : ''} damage!`);
      
      if (this.enemy.takeDamage(finalDmg)) { // takeDamage 回傳是否死亡
        this.isActive = false;
        this.uiManager.addLogEntry('🏆 Player Wins!');
        setTimeout(() => this.gameManager.endBattle(true), 1500); // 延遲一點結束，讓動畫跑完
      }
    }

    // 敵人攻擊 (如果玩家攻擊後還活著)
    if (this.isActive && this.enemy.currentFrame >= this.enemy.attackFrame) {
      this.enemy.currentFrame = 0;
      const rawDmg = this.enemy.attack();
      const finalDmg = this.player.takeDamage(rawDmg); // 傷害在 Player 內部計算

      this.uiManager.showDamage(finalDmg, false, true);
      this.uiManager.addLogEntry(`Enemy deals ${finalDmg.toFixed(1)} damage.`, true);

      if (this.player.hp <= 0) {
        this.isActive = false;
        this.uiManager.addLogEntry('Player is defeated...');
        setTimeout(() => this.gameManager.endBattle(false), 1500);
      }
    }
  }
}

export default BattleSystem;