// src/systems/BattleSystem.js
class BattleSystem {
  constructor(player, enemy, gameManager) {
    this.player = player;
    this.enemy = enemy;
    this.gameManager = gameManager;
    this.frameCount = 0;
    this.isActive = false;
    this.animationId = null;
  }

  start() {
    console.log('戰鬥開始');
    this.isActive = true;
    this.updateUIElements();
    this.loop();
  }

  stop() {
    this.isActive = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  loop() {
    if (!this.isActive) return;
    
    this.tick();
    this.updateUIElements();
    
    this.animationId = requestAnimationFrame(() => this.loop());
  }

  tick() {
    if (!this.isActive) return;

    this.player.currentFrame++;
    this.enemy.currentFrame++;

    // 玩家攻擊
    if (this.player.currentFrame >= this.player.attackFrame) {
      const isCrit = Math.random() < this.player.critChance;
      const baseDmg = this.player.attack;
      const dmg = isCrit ? baseDmg * 2 : baseDmg;
      
      console.log(`玩家攻擊造成 ${dmg} 傷害 ${isCrit ? '(暴擊!)' : ''}`);
      
      // 敵人受到傷害
      const reducedDmg = Math.max(1, dmg - this.enemy.defense);
      this.enemy.hp = Math.max(0, this.enemy.hp - reducedDmg);
      
      this.showDamage(reducedDmg, isCrit, false);
      
      if (this.enemy.hp <= 0) {
        console.log('敵人被擊敗！');
        this.isActive = false;
        this.gameManager.endBattle(true);
        return;
      }
      this.player.currentFrame = 0;
    }

    // 敵人攻擊
    if (this.enemy.currentFrame >= this.enemy.attackFrame && this.isActive) {
      const rawDmg = this.enemy.attack;
      
      // 玩家受到傷害
      const reduced = rawDmg / (1 + this.player.armor / 100);
      const finalDmg = Math.max(1, reduced - this.player.flatReduction);
      this.player.hp = Math.max(0, this.player.hp - finalDmg);
      
      console.log(`敵人攻擊造成 ${finalDmg.toFixed(1)} 傷害`);
      this.showDamage(finalDmg, false, true);
      
      if (this.player.hp <= 0) {
        console.log('玩家被擊敗！');
        this.isActive = false;
        this.gameManager.endBattle(false);
        return;
      }
      this.enemy.currentFrame = 0;
    }

    // 更新UI
    this.gameManager.updatePlayerStats();
  }

  updateUIElements() {
    // 更新敵人名稱和血量
    const enemyName = document.querySelector('.enemy .character-name');
    if (enemyName && this.enemy) {
      enemyName.textContent = `👹 ${this.enemy.getTypeName()} (${Math.round(this.enemy.hp)}/${this.enemy.maxHp})`;
    }

    // 更新血條
    const heroHealthFill = document.querySelector('.hero .health-fill');
    const heroHealthText = document.querySelector('.hero .health-text');
    if (heroHealthFill && heroHealthText) {
      const hpPercent = Math.max(0, (this.player.hp / this.player.maxHp) * 100);
      heroHealthFill.style.width = `${hpPercent}%`;
      heroHealthText.textContent = `${Math.round(this.player.hp)} / ${this.player.maxHp}`;
    }

    const enemyHealthFill = document.querySelector('.enemy .health-fill');
    const enemyHealthText = document.querySelector('.enemy .health-text');
    if (enemyHealthFill && enemyHealthText && this.enemy) {
      const hpPercent = Math.max(0, (this.enemy.hp / this.enemy.maxHp) * 100);
      enemyHealthFill.style.width = `${hpPercent}%`;
      enemyHealthText.textContent = `${Math.round(this.enemy.hp)} / ${this.enemy.maxHp}`;
    }

    // 更新攻擊進度條
    const heroAttackFill = document.querySelector('.hero .attack-fill');
    if (heroAttackFill) {
      const attackPercent = (this.player.currentFrame / this.player.attackFrame) * 100;
      heroAttackFill.style.width = `${attackPercent}%`;
    }

    const enemyAttackFill = document.querySelector('.enemy .attack-fill');
    if (enemyAttackFill && this.enemy) {
      const attackPercent = (this.enemy.currentFrame / this.enemy.attackFrame) * 100;
      enemyAttackFill.style.width = `${attackPercent}%`;
    }
  }

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
      if (damageIndicator.parentNode) {
        damageIndicator.remove();
      }
    }, 1500);

    // 添加戰鬥日誌
    this.addLogEntry(
      isEnemy ? `Player takes ${value.toFixed(1)} damage` : `Enemy takes ${value.toFixed(1)} ${isCrit ? 'CRIT' : ''} damage`,
      isEnemy
    );
  }

  addLogEntry(message, isEnemyAttack = false) {
    const logTitle = document.querySelector('.combat-log .log-title');
    if (!logTitle) return;

    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${isEnemyAttack ? 'enemy' : ''}`;
    logEntry.textContent = message;

    // 將日誌插入標題下方
    logTitle.insertAdjacentElement('afterend', logEntry);

    // 保持日誌滾動到底部
    const logContainer = document.querySelector('.combat-log');
    logContainer.scrollTop = logContainer.scrollHeight;
  }
}

export default BattleSystem;