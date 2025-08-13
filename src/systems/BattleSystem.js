<<<<<<< HEAD
// 更新 src/systems/BattleSystem.js
=======
// src/systems/BattleSystem.js

>>>>>>> a4f7d26e54d25ca90d429092c220c79698ce667a
class BattleSystem {
  // 修改 constructor 來接收 uiManager
  constructor(player, enemy, gameManager, uiManager) {
    this.player = player;
    this.enemy = enemy;
    this.gameManager = gameManager;
<<<<<<< HEAD
    this.frameCount = 0;
    this.isActive = true;
    this.uiManager = new UIManager();
    this.lastFrameTime = performance.now();
  }

  tick() {
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastFrameTime) / 1000;
    this.lastFrameTime = currentTime;
    
    // 更新狀態效果
    this.player.update(deltaTime);
    this.enemy.update(deltaTime);
    
    // 更新攻擊幀計數
    const playerAttackSpeed = this.player.getCurrentAttackSpeed();
    const playerAttackFrame = Math.round(20 / playerAttackSpeed);
    
=======
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

>>>>>>> a4f7d26e54d25ca90d429092c220c79698ce667a
    this.player.currentFrame++;
    this.enemy.currentFrame++;

    // 玩家攻擊
<<<<<<< HEAD
    if (this.player.currentFrame >= playerAttackFrame) {
      const dmg = this.player.attack(this.enemy);
      
      // 檢查同命連結觸發
      if (this.player.checkSympathyLink() && this.enemy.hp > this.player.hp) {
        console.log('同命連結觸發！');
        this.enemy.hp = this.player.hp;
        this.uiManager.showSpecialEffect('sympathy_link');
      }
      
      if (this.enemy.takeDamage(dmg)) {
        this.isActive = false;
        this.gameManager.endBattle(true);
      }
      this.player.currentFrame = 0;
    }

    // 敵人攻擊
    if (this.enemy.currentFrame >= this.enemy.attackFrame && this.isActive) {
      const rawDmg = this.enemy.attack(this.player);
      const finalDmg = this.player.takeDamage(rawDmg);
      
=======
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

>>>>>>> a4f7d26e54d25ca90d429092c220c79698ce667a
      if (this.player.hp <= 0) {
        this.isActive = false;
        this.uiManager.addLogEntry('Player is defeated...');
        setTimeout(() => this.gameManager.endBattle(false), 1500);
      }
<<<<<<< HEAD
      this.enemy.currentFrame = 0;
=======
>>>>>>> a4f7d26e54d25ca90d429092c220c79698ce667a
    }
  }
}