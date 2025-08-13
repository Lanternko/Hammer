// src/systems/BattleSystem.js - 簡化版
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
    this.updateEnemyDisplay();
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
    
    if (this.player.hp <= 0) {
      console.log('玩家被擊敗！');
      this.isActive = false;
      this.gameManager.endBattle(false);
      return;
    }
  }

  updateEnemyDisplay() {
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
  }
}

export default BattleSystem;