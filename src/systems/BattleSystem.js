// src/systems/BattleSystem.js - 升級版
class BattleSystem {
  constructor(player, enemy, gameManager) {
    this.player = player;
    this.enemy = enemy;
    this.gameManager = gameManager;
    this.frameCount = 0;
    this.isActive = false;
    this.animationId = null;
    this.deltaTime = 0.05; // 20fps = 0.05秒每幀
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

    // 更新玩家臨時效果
    this.player.updateTempEffects(this.deltaTime);

    this.player.currentFrame++;
    this.enemy.currentFrame++;

    // 玩家攻擊
    if (this.player.currentFrame >= this.player.attackFrame) {
      this.processPlayerAttack();
      this.player.currentFrame = 0;
    }

    // 敵人攻擊 (檢查眩暈狀態)
    if (this.enemy.currentFrame >= this.enemy.attackFrame && this.isActive && !this.enemy.isStunned) {
      this.processEnemyAttack();
      this.enemy.currentFrame = 0;
    }

    // 更新敵人眩暈狀態
    if (this.enemy.isStunned && this.enemy.stunDuration > 0) {
      this.enemy.stunDuration -= this.deltaTime;
      if (this.enemy.stunDuration <= 0) {
        this.enemy.isStunned = false;
        console.log('👹 敵人眩暈結束');
      }
    }

    // 更新UI
    this.gameManager.updatePlayerStats();
  }

  processPlayerAttack() {
    const attackResult = this.player.performAttack();
    const { damage, isCrit, isHammerProc } = attackResult;
    
    console.log(`玩家攻擊造成 ${damage.toFixed(1)} 傷害 ${isCrit ? '(暴擊!)' : ''} ${isHammerProc ? '(重錘!)' : ''}`);
    
    // 敵人受到傷害
    const reducedDmg = Math.max(1, damage - this.enemy.defense);
    this.enemy.hp = Math.max(0, this.enemy.hp - reducedDmg);
    
    // 重錘精通的眩暈效果
    if (isHammerProc && this.player.hammerEffects.mastery) {
      this.enemy.isStunned = true;
      this.enemy.stunDuration = 1.0; // 1秒眩暈
      console.log('😵 敵人被重錘眩暈！');
    }
    
    this.showDamage(reducedDmg, isCrit, isHammerProc, false);
    
    if (this.enemy.hp <= 0) {
      console.log('敵人被擊敗！');
      this.isActive = false;
      this.gameManager.endBattle(true);
      return;
    }
  }

  processEnemyAttack() {
    const rawDmg = this.enemy.attack;
    
    // 玩家受到傷害
    const reduced = rawDmg / (1 + this.player.getEffectiveArmor() / 100);
    const finalDmg = Math.max(1, reduced - this.player.flatReduction);
    this.player.hp = Math.max(0, this.player.hp - finalDmg);
    
    console.log(`敵人攻擊造成 ${finalDmg.toFixed(1)} 傷害`);
    this.showDamage(finalDmg, false, false, true);
    
    if (this.player.hp <= 0) {
      console.log('玩家被擊敗！');
      this.isActive = false;
      this.gameManager.endBattle(false);
      return;
    }
  }

  updateUIElements() {
    // 更新敵人名稱和血量
    const enemyName = document.querySelector('.enemy .character-name');
    if (enemyName && this.enemy) {
      let nameText = `${this.enemy.emoji} ${this.enemy.getTypeName()} (${Math.round(this.enemy.hp)}/${this.enemy.maxHp})`;
      if (this.enemy.isStunned) {
        nameText += ' 😵';
      }
      enemyName.textContent = nameText;
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
      if (this.enemy.isStunned) {
        // 眩暈時進度條變紅色並停止
        enemyAttackFill.style.background = 'linear-gradient(90deg, #ff6b6b, #ee5a24)';
      } else {
        // 正常時金色進度條
        enemyAttackFill.style.background = 'linear-gradient(90deg, #ffd700, #ffb347)';
        const attackPercent = (this.enemy.currentFrame / this.enemy.attackFrame) * 100;
        enemyAttackFill.style.width = `${attackPercent}%`;
      }
    }

    // 更新玩家狀態效果顯示
    this.updateStatusEffectsDisplay();
  }

  updateStatusEffectsDisplay() {
    // 在統計面板下方顯示狀態效果
    let statusPanel = document.querySelector('.status-effects');
    if (!statusPanel) {
      statusPanel = document.createElement('div');
      statusPanel.className = 'status-effects';
      statusPanel.style.cssText = `
        position: fixed;
        bottom: 240px;
        left: 20px;
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 10px;
        padding: 10px;
        color: white;
        min-width: 250px;
        font-size: 12px;
      `;
      document.body.appendChild(statusPanel);
    }

    const statusEffects = this.player.getStatusInfo();
    if (statusEffects.length > 0) {
      statusPanel.innerHTML = `
        <div style="color: #4ecdc4; font-weight: bold; margin-bottom: 5px;">狀態效果:</div>
        ${statusEffects.map(effect => `<div style="margin-bottom: 2px;">${effect}</div>`).join('')}
      `;
      statusPanel.style.display = 'block';
    } else {
      statusPanel.style.display = 'none';
    }
  }

  showDamage(value, isCrit, isHammerProc, isEnemy) {
    const targetCard = document.querySelector(isEnemy ? '.hero .character-card' : '.enemy .character-card');
    if (!targetCard) return;

    const damageIndicator = document.createElement('div');
    damageIndicator.className = 'damage-indicator';
    
    let text = `-${value.toFixed(1)}`;
    let color = '#ff4757';
    let fontSize = '24px';
    
    if (isHammerProc) {
      text = `🔨 HAMMER! ${text}`;
      color = '#FFD700';
      fontSize = '32px';
    } else if (isCrit) {
      text = `CRIT! ${text}`;
      color = '#ff1744';
      fontSize = '28px';
    }
    
    damageIndicator.textContent = text;
    damageIndicator.style.color = color;
    damageIndicator.style.fontSize = fontSize;
    
    // 隨機位置避免重疊
    const randomX = (Math.random() - 0.5) * 100;
    const randomY = (Math.random() - 0.5) * 50;
    damageIndicator.style.left = `calc(50% + ${randomX}px)`;
    damageIndicator.style.top = `calc(50% + ${randomY}px)`;
    
    targetCard.appendChild(damageIndicator);

    // 動畫結束後移除元素
    setTimeout(() => {
      if (damageIndicator.parentNode) {
        damageIndicator.remove();
      }
    }, 1500);

    // 添加戰鬥日誌
    this.addLogEntry(
      isEnemy ? 
        `Player takes ${value.toFixed(1)} damage` : 
        `Enemy takes ${value.toFixed(1)} ${isHammerProc ? 'HAMMER' : (isCrit ? 'CRIT' : '')} damage`,
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
    
    // 限制日誌條目數量
    const logEntries = logContainer.querySelectorAll('.log-entry');
    if (logEntries.length > 15) {
      logEntries[0].remove();
    }
  }
}

export default BattleSystem;