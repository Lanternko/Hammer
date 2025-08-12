// src/ui/UIManager.js

export default class UIManager {
  constructor() {
    // 獲取所有需要操作的 DOM 元素
    this.roundCounter = document.querySelector('.round-counter');

    this.particleContainer = document.querySelector('.bg-particles'); // 新增：獲取粒子容器
    this.heroName = document.querySelector('.hero .character-name');
    this.heroHpFill = document.querySelector('.hero .health-fill');
    this.heroHpText = document.querySelector('.hero .health-text');
    this.heroAttackFill = document.querySelector('.hero .attack-fill');
    
    this.enemyName = document.querySelector('.enemy .character-name');
    this.enemyHpFill = document.querySelector('.enemy .health-fill');
    this.enemyHpText = document.querySelector('.enemy .health-text');
    this.enemyAttackFill = document.querySelector('.enemy .attack-fill');

    this.combatLog = document.querySelector('.combat-log .log-title');
  }

  // 新增：創建背景粒子的方法
  createBackgroundParticles() {
    if (!this.particleContainer) return; // 如果找不到容器，就直接返回

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        this.particleContainer.appendChild(particle);
    }
  }
  
  // 根據 player 和 enemy 物件的資料，一次性更新整個戰鬥畫面
  drawBattle(player, enemy) {
    // 更新血條和數字
    const playerHpPercent = Math.max(0, (player.hp / player.maxHp) * 100);
    this.heroHpFill.style.width = `${playerHpPercent}%`;
    this.heroHpText.textContent = `${Math.ceil(player.hp)} / ${player.maxHp}`;
    
    const enemyHpPercent = Math.max(0, (enemy.hp / enemy.maxHp) * 100);
    this.enemyHpFill.style.width = `${enemyHpPercent}%`;
    this.enemyHpText.textContent = `${Math.ceil(enemy.hp)} / ${enemy.maxHp}`;

    // 更新攻擊進度條
    const playerAttackPercent = (player.currentFrame / player.attackFrame) * 100;
    this.heroAttackFill.style.width = `${playerAttackPercent}%`;
    
    const enemyAttackPercent = (enemy.currentFrame / enemy.attackFrame) * 100;
    this.enemyAttackFill.style.width = `${enemyAttackPercent}%`;
  }
  
  // 更新回合標題
  updateRound(level) {
    this.roundCounter.textContent = `Round ${level} / 5`;
  }

  // 顯示傷害數字動畫
  showDamage(value, isCrit, isEnemy) {
    const targetCard = document.querySelector(isEnemy ? '.hero .character-card' : '.enemy .character-card');
    if (!targetCard) return;

    const damageIndicator = document.createElement('div');
    damageIndicator.className = 'damage-indicator';
    damageIndicator.textContent = isCrit ? `CRIT! -${value.toFixed(1)}` : `-${value.toFixed(1)}`;
    if (isCrit) {
      damageIndicator.style.color = '#ff1744';
      damageIndicator.style.fontSize = '28px';
    }
    
    targetCard.appendChild(damageIndicator);

    // 動畫結束後移除元素
    setTimeout(() => {
      damageIndicator.remove();
    }, 1500);
  }

  // 新增一條戰鬥日誌
  addLogEntry(message, isEnemyAttack = false) {
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${isEnemyAttack ? 'enemy' : ''}`;
    logEntry.textContent = message;

    // 將日誌插入標題下方
    this.combatLog.insertAdjacentElement('afterend', logEntry);

    // 保持日誌滾動到底部
    const logContainer = document.querySelector('.combat-log');
    logContainer.scrollTop = logContainer.scrollHeight;
  }
}