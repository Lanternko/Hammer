// 更新 src/systems/BattleSystem.js
class BattleSystem {
  constructor(player, enemy, gameManager) {
    this.player = player;
    this.enemy = enemy;
    this.gameManager = gameManager;
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
    
    this.player.currentFrame++;
    this.enemy.currentFrame++;

    // 玩家攻擊
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
      
      if (this.player.hp <= 0) {
        this.isActive = false;
        this.gameManager.endBattle(false);
      }
      this.enemy.currentFrame = 0;
    }
  }
}