// 實現Canvas血條、攻速進度條、傷害數字動畫。
// 這個UIManager類別負責繪製戰鬥界面，包括玩家和敵人的血條、攻速進度條以及傷害數字動畫。
class UIManager {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.damageLogs = []; // { x, y, value, isCrit, frame }
  }

  drawBattle(player, enemy) {
    this.ctx.clearRect(0, 0, 800, 600);

    // 玩家血條
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(50, 50, 200 * (player.hp / player.maxHp), 20);
    this.ctx.fillStyle = 'black';
    this.ctx.strokeRect(50, 50, 200, 20);
    this.ctx.fillText(`玩家 HP: ${Math.round(player.hp)}`, 50, 40);

    // 敵人血條
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(550, 50, 200 * (enemy.hp / enemy.maxHp), 20);
    this.ctx.strokeRect(550, 50, 200, 20);
    this.ctx.fillText(`敵人 HP: ${Math.round(enemy.hp)}`, 550, 40);

    // 玩家攻速進度條
    this.ctx.fillStyle = 'blue';
    this.ctx.fillRect(50, 80, 200 * (player.currentFrame / player.attackFrame), 10);
    this.ctx.strokeRect(50, 80, 200, 10);

    // 敵人攻速進度條
    this.ctx.fillStyle = 'blue';
    this.ctx.fillRect(550, 80, 200 * (enemy.currentFrame / enemy.attackFrame), 10);
    this.ctx.strokeRect(550, 80, 200, 10);

    // 傷害數字
    this.damageLogs = this.damageLogs.filter(log => log.frame < 20);
    this.damageLogs.forEach(log => {
      this.ctx.fillStyle = log.isCrit ? 'yellow' : 'white';
      this.ctx.fillText(`-${Math.round(log.value)}`, log.x, log.y - log.frame * 2);
      log.frame++;
    });
  }

  showDamage(value, isCrit, isEnemy) {
    this.damageLogs.push({
      x: isEnemy ? 600 : 100,
      y: 100,
      value,
      isCrit,
      frame: 0
    });
  }
}

export default UIManager;