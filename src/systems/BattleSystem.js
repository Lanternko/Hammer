// src/systems/BattleSystem.js - 完整修復版
class BattleSystem {
  constructor(player, enemy, gameManager) {
    this.player = player;
    this.enemy = enemy;
    this.gameManager = gameManager;
    this.frameCount = 0;
    this.isActive = false;
    this.animationId = null;
    this.lastFrameTime = 0;
    
    // 戰鬥速度控制（可選3倍速）
    this.battleSpeed = 1; // 1=正常, 3=三倍速
    this.baseDeltaTime = 0.1; // 基礎10fps
    this.deltaTime = this.baseDeltaTime / this.battleSpeed;
    
    // 戰鬥統計
    this.battleStats = {
      playerAttackCount: 0,
      playerTotalDamage: 0,
      playerDamageReceived: 0,
      enemyAttackCount: 0,
      hammerProcCount: 0,
      critCount: 0,
      playerDamageDealtCount: 0, // 反甲徽章計數器
      startTime: Date.now()
    };
    
    // 初始化Combat Log
    this.initializeCombatLog();
  }

  initializeCombatLog() {
    const combatLog = document.querySelector('.combat-log');
    if (combatLog) {
      // 清空舊日誌
      const existingEntries = combatLog.querySelectorAll('.log-entry');
      existingEntries.forEach(entry => entry.remove());
      
      this.addCombatLogEntry('⚔️ 戰鬥開始！');
      this.addCombatLogEntry(`👤 玩家: ${this.player.hp}/${this.player.maxHp} HP`);
      this.addCombatLogEntry(`👹 敵人: ${this.enemy.hp}/${this.enemy.maxHp} HP, ${this.enemy.attack} 攻擊`);
    }
  }

  // 設定戰鬥速度
  setBattleSpeed(speed) {
    this.battleSpeed = speed;
    this.deltaTime = this.baseDeltaTime / this.battleSpeed;
    console.log(`⚡ 戰鬥速度設定為 ${speed}x`);
    this.addCombatLogEntry(`⚡ 戰鬥速度: ${speed}x`);
  }

  start() {
    console.log('🔥 戰鬥開始！');
    console.log(`👤 玩家: ${this.player.hp}/${this.player.maxHp} HP, ${this.player.attack} 攻擊, ${this.player.getEffectiveArmor()} 護甲`);
    console.log(`👹 敵人: ${this.enemy.hp}/${this.enemy.maxHp} HP, ${this.enemy.attack} 攻擊, ${this.enemy.defense} 防禦`);
    
    this.isActive = true;
    this.battleStats.startTime = Date.now();
    this.lastFrameTime = performance.now();
    
    // 添加速度控制按鈕
    this.createSpeedControlUI();
    this.loop();
  }

  createSpeedControlUI() {
    // 檢查是否已存在
    if (document.getElementById('speedControl')) return;
    
    const speedControl = document.createElement('div');
    speedControl.id = 'speedControl';
    speedControl.style.cssText = `
      position: fixed;
      top: 20px;
      right: 300px;
      background: rgba(0, 0, 0, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      padding: 10px;
      color: white;
      font-size: 14px;
      z-index: 200;
    `;
    
    speedControl.innerHTML = `
      <div style="margin-bottom: 5px;">⚡ 戰鬥速度</div>
      <button onclick="window.battleSystem?.setBattleSpeed(1)" style="margin-right: 5px; padding: 5px 10px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">1x</button>
      <button onclick="window.battleSystem?.setBattleSpeed(3)" style="padding: 5px 10px; background: #FF9800; color: white; border: none; border-radius: 5px; cursor: pointer;">3x</button>
    `;
    
    document.body.appendChild(speedControl);
    window.battleSystem = this; // 讓按鈕可以訪問
  }

  stop() {
    this.isActive = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    // 清理速度控制UI
    const speedControl = document.getElementById('speedControl');
    if (speedControl) speedControl.remove();
    window.battleSystem = null;
  }

  loop() {
    if (!this.isActive) return;
    
    const currentTime = performance.now();
    const realDeltaTime = (currentTime - this.lastFrameTime) / 1000;
    
    // 根據戰鬥速度調整更新頻率
    if (realDeltaTime >= this.deltaTime) {
      this.tick();
      this.lastFrameTime = currentTime;
    }
    
    this.animationId = requestAnimationFrame(() => this.loop());
  }

  tick() {
    if (!this.isActive) return;

    // 更新玩家臨時效果
    this.player.updateTempEffects(this.deltaTime);

    // 增加攻擊幀計數 - 修正進度條跳躍問題
    this.player.currentFrame = Math.min(this.player.attackFrame, this.player.currentFrame + 1);
    
    // 敵人只有在非眩暈狀態下才增加攻擊幀
    if (!this.enemy.isStunned) {
      this.enemy.currentFrame = Math.min(this.enemy.attackFrame, this.enemy.currentFrame + 1);
    }

    // 玩家攻擊檢查
    if (this.player.currentFrame >= this.player.attackFrame) {
      this.processPlayerAttack();
      this.player.currentFrame = 0; // 平滑重置，不會跳躍
    }

    // 敵人攻擊檢查
    if (this.enemy.currentFrame >= this.enemy.attackFrame && this.isActive && !this.enemy.isStunned) {
      this.processEnemyAttack();
      this.enemy.currentFrame = 0; // 平滑重置
    }

    // 更新敵人眩暈狀態
    if (this.enemy.isStunned && this.enemy.stunDuration > 0) {
      this.enemy.stunDuration -= this.deltaTime;
      if (this.enemy.stunDuration <= 0) {
        this.enemy.isStunned = false;
        this.enemy.currentFrame = 0;
        console.log('👹 敵人眩暈結束');
        this.addCombatLogEntry('👹 敵人眩暈結束');
      }
    }

    // 更新UI顯示
    this.updateBattleDisplay();
  }

  processPlayerAttack() {
    const attackResult = this.player.performAttack();
    const { damage, isCrit, isHammerProc } = attackResult;
    
    // 更新統計
    this.battleStats.playerAttackCount++;
    this.battleStats.playerTotalDamage += damage;
    if (isCrit) this.battleStats.critCount++;
    if (isHammerProc) this.battleStats.hammerProcCount++;
    
    const logMessage = `🗡️ 玩家攻擊: ${damage.toFixed(1)} 傷害${isCrit ? ' 💥暴擊' : ''}${isHammerProc ? ' 🔨重錘' : ''}`;
    console.log(logMessage);
    this.addCombatLogEntry(logMessage);
    
    // 計算敵人實際受到的傷害（敵人也有防禦力）
    const reducedDmg = Math.max(1, damage - this.enemy.defense);
    this.enemy.hp = Math.max(0, this.enemy.hp - reducedDmg);
    
    // 顯示傷害數字
    this.showDamageNumber(reducedDmg, isCrit || isHammerProc, false);
    
    // 重錘精通的眩暈效果
    if (isHammerProc && this.player.hammerEffects.mastery) {
      const stunDuration = this.player.hammerEffects.duration ? 2.0 : 1.0;
      this.enemy.isStunned = true;
      this.enemy.stunDuration = stunDuration;
      this.enemy.currentFrame = 0;
      console.log(`😵 敵人被重錘眩暈 ${stunDuration} 秒！`);
      this.addCombatLogEntry(`😵 敵人被眩暈 ${stunDuration}秒`);
    }
    
    // 檢查敵人是否死亡
    if (this.enemy.hp <= 0) {
      console.log('🏆 敵人被擊敗！');
      this.addCombatLogEntry('🏆 敵人被擊敗！');
      this.endBattle(true);
      return;
    }
  }

  processEnemyAttack() {
    const rawDmg = this.enemy.attack;
    
    // 計算傷害：先護甲百分比減傷，再固定減傷
    const armorReduction = rawDmg / (1 + this.player.getEffectiveArmor() / 100);
    const finalDmg = Math.max(1, armorReduction - this.player.flatReduction);
    this.player.hp = Math.max(0, this.player.hp - finalDmg);
    
    // 更新統計
    this.battleStats.enemyAttackCount++;
    this.battleStats.playerDamageReceived += finalDmg;
    this.battleStats.playerDamageDealtCount++; // 反甲計數
    
    const logMessage = `👹 敵人攻擊: ${finalDmg.toFixed(1)} 傷害`;
    console.log(logMessage);
    this.addCombatLogEntry(logMessage);
    
    // 顯示傷害數字
    this.showDamageNumber(finalDmg, false, true);
    
    // 檢查反甲徽章效果
    this.checkReflectArmor();
    
    // 檢查玩家是否死亡
    if (this.player.hp <= 0) {
      console.log('💀 玩家被擊敗！');
      this.addCombatLogEntry('💀 玩家被擊敗！');
      this.endBattle(false);
      return;
    }
  }

  // 反甲徽章效果檢查
  checkReflectArmor() {
    if (this.player.hasReflectArmor && this.battleStats.playerDamageDealtCount % 5 === 0) {
      const reflectDamage = Math.floor(this.enemy.maxHp * 0.05); // 5%最大血量
      this.enemy.hp = Math.max(0, this.enemy.hp - reflectDamage);
      
      console.log(`⚡ 反甲觸發！對敵人造成 ${reflectDamage} 反彈傷害`);
      this.addCombatLogEntry(`⚡ 反甲觸發：${reflectDamage} 傷害`);
      this.showDamageNumber(reflectDamage, true, false, '⚡');
      
      if (this.enemy.hp <= 0) {
        console.log('🏆 敵人被反甲擊敗！');
        this.addCombatLogEntry('🏆 敵人被反甲擊敗！');
        this.endBattle(true);
        return;
      }
    }
  }

  endBattle(won) {
    this.isActive = false;
    const battleDuration = (Date.now() - this.battleStats.startTime) / 1000;
    
    // 詳細戰鬥報告
    console.log('\n📊 === 戰鬥報告 ===');
    console.log(`⏱️ 戰鬥時長: ${battleDuration.toFixed(1)}秒`);
    console.log(`🗡️ 玩家攻擊次數: ${this.battleStats.playerAttackCount}`);
    console.log(`💥 暴擊次數: ${this.battleStats.critCount} (${this.battleStats.playerAttackCount > 0 ? (this.battleStats.critCount/this.battleStats.playerAttackCount*100).toFixed(1) : 0}%)`);
    console.log(`🔨 重錘觸發次數: ${this.battleStats.hammerProcCount} (${this.battleStats.playerAttackCount > 0 ? (this.battleStats.hammerProcCount/this.battleStats.playerAttackCount*100).toFixed(1) : 0}%)`);
    console.log(`📈 總輸出傷害: ${this.battleStats.playerTotalDamage.toFixed(1)}`);
    console.log(`📊 平均攻擊傷害: ${this.battleStats.playerAttackCount > 0 ? (this.battleStats.playerTotalDamage/this.battleStats.playerAttackCount).toFixed(1) : 0}`);
    console.log(`🛡️ 受到攻擊次數: ${this.battleStats.enemyAttackCount}`);
    console.log(`💔 總受傷: ${this.battleStats.playerDamageReceived.toFixed(1)}`);
    console.log(`📉 平均受傷: ${this.battleStats.enemyAttackCount > 0 ? (this.battleStats.playerDamageReceived/this.battleStats.enemyAttackCount).toFixed(1) : 0}`);
    console.log(`❤️ 剩餘血量: ${this.player.hp.toFixed(1)}/${this.player.maxHp}`);
    console.log('==================\n');
    
    this.addCombatLogEntry(won ? '🏆 戰鬥勝利！' : '💀 戰鬥失敗！');
    
    // 傳遞戰鬥統計給GameManager
    this.gameManager.endBattle(won, this.battleStats);
  }

  showDamageNumber(damage, isCritical, isEnemyAttack, prefix = '') {
    const targetCard = document.querySelector(isEnemyAttack ? '.hero .character-card' : '.enemy .character-card');
    if (!targetCard) return;

    const damageIndicator = document.createElement('div');
    damageIndicator.className = 'damage-indicator';
    
    let displayText = `${prefix}-${damage.toFixed(1)}`;
    let color = isEnemyAttack ? '#ff6b6b' : '#4ecdc4';
    let fontSize = '24px';
    
    if (isCritical) {
      displayText = `CRIT! ${displayText}`;
      color = '#FFD700';
      fontSize = '28px';
    }
    
    damageIndicator.textContent = displayText;
    damageIndicator.style.cssText = `
      position: absolute;
      font-size: ${fontSize};
      font-weight: bold;
      color: ${color};
      text-shadow: 0 0 10px ${color}80;
      animation: damageFloat 2s ease-out forwards;
      pointer-events: none;
      z-index: 1000;
      left: 50%;
      top: 20%;
      transform: translateX(-50%);
    `;
    
    targetCard.style.position = 'relative';
    targetCard.appendChild(damageIndicator);

    // 2秒後移除元素
    setTimeout(() => {
      if (damageIndicator.parentNode) {
        damageIndicator.remove();
      }
    }, 2000);
  }

  updateBattleDisplay() {
    // 更新敵人名稱和狀態（顯示攻擊力）
    const enemyName = document.querySelector('.enemy .character-name');
    if (enemyName && this.enemy) {
      let nameText = `${this.enemy.emoji} ${this.enemy.getTypeName()} 攻擊${this.enemy.attack}`;
      if (this.enemy.isStunned) {
        nameText += ' 😵💫';
      }
      enemyName.textContent = nameText;
    }

    // 更新玩家血條
    const heroHealthFill = document.querySelector('.hero .health-fill');
    const heroHealthText = document.querySelector('.hero .health-text');
    if (heroHealthFill && heroHealthText) {
      const hpPercent = Math.max(0, (this.player.hp / this.player.maxHp) * 100);
      heroHealthFill.style.width = `${hpPercent}%`;
      heroHealthText.textContent = `${Math.round(this.player.hp)} / ${this.player.maxHp}`;
    }

    // 更新敵人血條
    const enemyHealthFill = document.querySelector('.enemy .health-fill');
    const enemyHealthText = document.querySelector('.enemy .health-text');
    if (enemyHealthFill && enemyHealthText && this.enemy) {
      const hpPercent = Math.max(0, (this.enemy.hp / this.enemy.maxHp) * 100);
      enemyHealthFill.style.width = `${hpPercent}%`;
      enemyHealthText.textContent = `${Math.round(this.enemy.hp)} / ${this.enemy.maxHp}`;
    }

    // 修復攻擊進度條動畫 - 平滑更新，無跳躍
    const heroAttackFill = document.querySelector('.hero .attack-fill');
    if (heroAttackFill) {
      const attackPercent = Math.min(100, (this.player.currentFrame / this.player.attackFrame) * 100);
      heroAttackFill.style.width = `${attackPercent}%`;
      heroAttackFill.style.transition = 'width 0.1s linear'; // 平滑過渡
      
      // 攻擊即將完成時的視覺效果
      if (attackPercent > 90) {
        heroAttackFill.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.8)';
      } else {
        heroAttackFill.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.5)';
      }
    }

    // 修復敵人攻擊進度條動畫
    const enemyAttackFill = document.querySelector('.enemy .attack-fill');
    if (enemyAttackFill && this.enemy) {
      if (this.enemy.isStunned) {
        // 眩暈時進度條變紅色並保持當前進度
        enemyAttackFill.style.background = 'linear-gradient(90deg, #ff6b6b, #ee5a24)';
        enemyAttackFill.style.boxShadow = '0 0 15px rgba(255, 107, 107, 0.8)';
        // 不重置進度，保持眩暈前的狀態
      } else {
        // 正常時金色進度條
        enemyAttackFill.style.background = 'linear-gradient(90deg, #ffd700, #ffb347)';
        const attackPercent = Math.min(100, (this.enemy.currentFrame / this.enemy.attackFrame) * 100);
        enemyAttackFill.style.width = `${attackPercent}%`;
        enemyAttackFill.style.transition = 'width 0.1s linear'; // 平滑過渡
        
        // 攻擊即將完成時的視覺效果
        if (attackPercent > 90) {
          enemyAttackFill.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.8)';
        } else {
          enemyAttackFill.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.5)';
        }
      }
    }

    // 更新GameManager的統計顯示
    this.gameManager.updatePlayerStats();
  }

  // 添加戰鬥日誌
  addCombatLogEntry(message, isEnemyAction = false) {
    const combatLog = document.querySelector('.combat-log');
    const logTitle = document.querySelector('.log-title');
    
    if (!combatLog || !logTitle) {
      console.warn('Combat log elements not found');
      return;
    }

    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${isEnemyAction ? 'enemy' : ''}`;
    logEntry.textContent = message;
    logEntry.style.cssText = `
      font-size: 13px;
      margin-bottom: 5px;
      padding: 5px 8px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
      border-left: 3px solid ${isEnemyAction ? '#ff6b6b' : '#4ecdc4'};
      animation: logFadeIn 0.3s ease-in;
    `;

    // 將日誌插入到標題下方
    logTitle.insertAdjacentElement('afterend', logEntry);

    // 保持日誌滾動到底部
    combatLog.scrollTop = combatLog.scrollHeight;

    // 如果日誌太多，移除舊的
    const allEntries = combatLog.querySelectorAll('.log-entry');
    if (allEntries.length > 15) {
      allEntries[0].remove();
    }
  }

  // 獲取當前戰鬥統計（用於實時顯示）
  getCurrentStats() {
    return {
      ...this.battleStats,
      battleDuration: (Date.now() - this.battleStats.startTime) / 1000,
      avgDamage: this.battleStats.playerAttackCount > 0 ? 
        this.battleStats.playerTotalDamage / this.battleStats.playerAttackCount : 0,
      avgDamageTaken: this.battleStats.enemyAttackCount > 0 ? 
        this.battleStats.playerDamageReceived / this.battleStats.enemyAttackCount : 0,
      critRate: this.battleStats.playerAttackCount > 0 ? 
        (this.battleStats.critCount / this.battleStats.playerAttackCount) * 100 : 0,
      hammerRate: this.battleStats.playerAttackCount > 0 ? 
        (this.battleStats.hammerProcCount / this.battleStats.playerAttackCount) * 100 : 0
    };
  }
}

// 添加必要的CSS動畫
if (!document.querySelector('#battleAnimations')) {
  const style = document.createElement('style');
  style.id = 'battleAnimations';
  style.textContent = `
    @keyframes damageFloat {
      0% {
        opacity: 1;
        transform: translateX(-50%) translateY(0) scale(0.8);
      }
      20% {
        transform: translateX(-50%) translateY(-10px) scale(1.2);
      }
      100% {
        opacity: 0;
        transform: translateX(-50%) translateY(-40px) scale(1);
      }
    }
    
    @keyframes logFadeIn {
      0% { opacity: 0; transform: translateX(-20px); }
      100% { opacity: 1; transform: translateX(0); }
    }
    
    .damage-indicator {
      user-select: none;
      pointer-events: none;
    }
    
    .attack-fill {
      transition: width 0.1s linear !important;
    }
  `;
  document.head.appendChild(style);
}

export default BattleSystem;