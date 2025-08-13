class UIManager {
  constructor(onClick, onMouseMove) {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.damageLogs = [];
    this.buffButtons = [];
    this.mouseX = 0;
    this.mouseY = 0;

    this.canvas.addEventListener('click', (event) => {
      const rect = this.canvas.getBoundingClientRect();
      onClick(event.clientX - rect.left, event.clientY - rect.top);
    });

    this.canvas.addEventListener('mousemove', (event) => {
        const rect = this.canvas.getBoundingClientRect();
        onMouseMove(event.clientX - rect.left, event.clientY - rect.top);
    });
  }
  
  // --- 滑鼠事件處理 ---
  handleMouseMove(x, y) {
    this.mouseX = x;
    this.mouseY = y;
  }

  handleClick(x, y, callback) {
    this.buffButtons.forEach(button => {
        if (x > button.x && x < button.x + button.width && y > button.y && y < button.y + button.height) {
            callback(button.buff);
        }
    });
  }

  // --- 主繪製函數 ---
  draw(state, context) {
    // 🎨 修正閃爍：每次都先畫上背景色
    this.ctx.fillStyle = '#2c3e50';
    this.ctx.fillRect(0, 0, 800, 600);

    switch (state) {
      case 'battle':
        this.drawBattle(context);
        this.drawPlayerStats(context.player); // 顯示玩家屬性
        break;
      case 'buff_selection':
        this.drawBuffSelection(context.buffs);
        break;
      case 'game_over':
        this.drawGameOverScreen(context.level); // 💀 失敗畫面
        break;
      case 'victory':
        this.drawVictoryScreen(); // 👑 勝利畫面
        break;
    }
  }

  // --- 畫面繪製 ---
  drawBattle({ player, enemy, level, maxLevels }) {
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`第 ${level} / ${maxLevels} 關`, 400, 40);
    this.ctx.textAlign = 'left';

    // 玩家 & 敵人 血條等...
    const playerX = 50, playerY = 80;
    this.drawUnitInfo(player, '巨鎚英雄', playerX, playerY);

    const enemyX = 450, enemyY = 80;
    this.drawUnitInfo(enemy, `敵人 (${enemy.type})`, enemyX, enemyY, true);

    this.drawDamageLogs();
  }
  
  drawUnitInfo(unit, name, x, y, isEnemy = false) {
    this.ctx.font = '16px Arial';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(name, x, y - 10);
    
    // 血條
    const hpColor = isEnemy ? '#F44336' : '#4CAF50';
    this.drawBar(x, y, 300, 25, unit.hp / unit.maxHp, hpColor, '#333');
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(`${Math.round(unit.hp)} / ${Math.round(unit.maxHp)}`, x + 10, y + 18);
    
    // 攻速條
    this.drawBar(x, y + 35, 300, 15, unit.currentFrame / unit.attackFrame, '#2196F3', '#333');
    this.ctx.fillStyle = 'white';
    this.ctx.fillText('攻擊進度', x + 10, y + 49);
  }

  // ✨ 新增：繪製玩家屬性面板
  drawPlayerStats(player) {
    const x = 50, y = 500;
    const stats = [
        `⚔️ 攻擊: ${player.attackDamage.toFixed(1)}`,
        `⚡ 攻速: ${player.attackSpeed.toFixed(2)}`,
        `🛡️ 防禦: ${player.armor.toFixed(1)}`,
        `🎯 暴率: ${(player.critChance * 100).toFixed(0)}%`,
    ];

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(x - 10, y - 30, 200, 100);
    this.ctx.fillStyle = 'white';
    this.ctx.font = '16px Arial';
    stats.forEach((stat, index) => {
        this.ctx.fillText(stat, x, y + index * 22);
    });
  }
  
  // ✨ 大改版：繪製 Buff 選擇介面
  drawBuffSelection(buffs) {
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 36px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('選擇一個強化!', 400, 120);
    
    this.buffButtons = []; // 清空舊按鈕
    buffs.forEach((buff, index) => {
      const btn = {
        x: 150,
        y: 200 + index * 100,
        width: 500,
        height: 80,
        buff: buff,
      };
      
      const isHovered = this.mouseX > btn.x && this.mouseX < btn.x + btn.width && 
                        this.mouseY > btn.y && this.mouseY < btn.y + btn.height;

      // 繪製按鈕背景
      const gradient = this.ctx.createLinearGradient(btn.x, btn.y, btn.x + btn.width, btn.y);
      gradient.addColorStop(0, '#5D6D7E');
      gradient.addColorStop(1, '#34495E');
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(btn.x, btn.y, btn.width, btn.height);
      
      // 懸停效果
      if (isHovered) {
          this.ctx.fillStyle = 'rgba(255, 255, 0, 0.2)';
          this.ctx.fillRect(btn.x, btn.y, btn.width, btn.height);
      }

      // 繪製文字
      this.ctx.fillStyle = 'yellow';
      this.ctx.font = 'bold 28px Arial';
      this.ctx.fillText(`${buff.icon} ${buff.description}`, 400, btn.y + 50);
      
      this.buffButtons.push(btn);
    });
  }
  
  // ✨ 新增：勝利/失敗畫面
  drawGameOverScreen(level) {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, 800, 600);
    this.ctx.fillStyle = '#E74C3C';
    this.ctx.font = 'bold 60px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('遊戲結束', 400, 250);
    this.ctx.fillStyle = 'white';
    this.ctx.font = '30px Arial';
    this.ctx.fillText(`您在 第 ${level} 關 陣亡`, 400, 320);
  }

  drawVictoryScreen() {
    this.ctx.fillStyle = '#2ECC71';
    this.ctx.fillRect(0, 0, 800, 600);
    this.ctx.fillStyle = 'yellow';
    this.ctx.font = 'bold 72px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('恭喜勝利！', 400, 300);
  }

  // --- 輔助繪製 ---
  drawBar(x, y, width, height, progress, color, bgColor) {
    this.ctx.fillStyle = bgColor;
    this.ctx.fillRect(x, y, width, height);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width * Math.max(0, progress), height);
    this.ctx.strokeStyle = 'black';
    this.ctx.strokeRect(x, y, width, height);
  }
  
  drawDamageLogs() {
    this.damageLogs = this.damageLogs.filter(log => log.frame < 40);
    this.damageLogs.forEach(log => {
      const fontSize = log.isCrit ? 32 : 24;
      this.ctx.font = `bold ${fontSize}px Arial`;
      this.ctx.fillStyle = log.isCrit ? 'yellow' : 'white';
      this.ctx.globalAlpha = 1 - (log.frame / 40);
      this.ctx.fillText(`-${Math.round(log.value)}`, log.x, log.y - log.frame * 2);
      log.frame++;
    });
    this.ctx.globalAlpha = 1.0;
  }

  showDamage(value, isCrit, isEnemy) {
    this.damageLogs.push({
      x: isEnemy ? 600 : 150, y: 150, value, isCrit, frame: 0
    });
  }
  drawStatusEffects(entity, x, y) {
    const effects = entity.statusEffects.effects;
    let offsetY = 0;
    
    for (const [type, effectList] of effects.entries()) {
      if (effectList.length > 0) {
        this.drawStatusIcon(type, effectList.length, x, y + offsetY);
        offsetY += 25;
      }
    }
  }
  
  drawComboCounter(player, x, y) {
    if (player.statusEffects.comboCount > 0) {
      this.ctx.fillStyle = '#FFD700';
      this.ctx.font = 'bold 16px Arial';
      this.ctx.fillText(`連擊 ${player.statusEffects.comboCount}`, x, y);
    }
  }
  
  showSpecialEffect(type) {
    // 顯示特殊效果動畫
    switch(type) {
      case 'sympathy_link':
        this.createScreenFlash('#8A2BE2', 0.5);
        break;
    }
  }
}

export default UIManager;