// src/systems/BattleSystem.js - 修復版本
class BattleSystem {
  constructor(player, enemy, gameManager) {
    this.player = player;
    this.enemy = enemy;
    this.gameManager = gameManager;
    this.frameCount = 0;
    this.isActive = false;
    this.animationId = null;
    this.lastFrameTime = 0;
    
    // 戰鬥速度控制
    this.battleSpeed = 1;
    this.baseDeltaTime = 0.1;
    this.deltaTime = this.baseDeltaTime / this.battleSpeed;
    
    // 戰鬥統計
    this.battleStats = {
      playerAttackCount: 0,
      playerTotalDamage: 0,
      playerDamageReceived: 0,
      enemyAttackCount: 0,
      hammerProcCount: 0,
      critCount: 0,
      playerDamageDealtCount: 0,
      startTime: Date.now()
    };
    
    // 🔧 修復: 控制 UI 更新頻率
    this.lastUIUpdate = 0;
    this.uiUpdateInterval = 100; // 每100ms更新一次UI，減少閃爍
    
    this.initializeCombatInfo();
  }

  initializeCombatInfo() {
    const combatInfo = document.querySelector('.combat-log');
    if (combatInfo) {
      const existingEntries = combatInfo.querySelectorAll('.log-entry');
      existingEntries.forEach(entry => entry.remove());
      
      const logTitle = combatInfo.querySelector('.log-title');
      if (logTitle) {
        logTitle.textContent = '📊 戰鬥數據';
      }
      
      this.createRealTimeStats();
    }
  }

  createRealTimeStats() {
    const combatInfo = document.querySelector('.combat-log');
    const logTitle = combatInfo.querySelector('.log-title');
    
    // 🔧 修復: 避免重複創建
    let statsContainer = document.getElementById('realTimeStats');
    if (statsContainer) {
      statsContainer.remove();
    }
    
    statsContainer = document.createElement('div');
    statsContainer.id = 'realTimeStats';
    statsContainer.style.cssText = `
      padding: 10px 0;
      font-size: 13px;
      line-height: 1.4;
    `;
    
    logTitle.insertAdjacentElement('afterend', statsContainer);
    this.updateRealTimeStats();
  }

  updateRealTimeStats() {
    const statsContainer = document.getElementById('realTimeStats');
    if (!statsContainer) return;
    
    // 計算玩家 DPS 和防禦能力
    const playerDPS = this.calculatePlayerDPS();
    const playerDefense = this.calculatePlayerDefense();
    const enemyDPS = this.calculateEnemyDPS();
    const enemyDefense = this.calculateEnemyDefense();
    const expectedBattleTime = this.calculateExpectedBattleTime(playerDPS, enemyDPS, playerDefense, enemyDefense);
    
    statsContainer.innerHTML = `
      <div style="margin-bottom: 12px; padding: 8px; background: rgba(78, 205, 196, 0.1); border-radius: 8px; border-left: 3px solid #4ecdc4;">
        <div style="color: #4ecdc4; font-weight: bold; margin-bottom: 6px;">👤 玩家數據</div>
        <div>🗡️ DPS: <span style="color: #ffd700; font-weight: bold;">${playerDPS.toFixed(1)}</span></div>
        <div>🛡️ 護甲減傷: <span style="color: #4ecdc4; font-weight: bold;">${playerDefense.reduction}%</span> | 固減: <span style="color: #4ecdc4; font-weight: bold;">${playerDefense.flatReduction}</span></div>
        <div>💥 暴擊率: <span style="color: #ff6b6b; font-weight: bold;">${(this.player.critChance * 100).toFixed(1)}%</span> | 🔨 重錘率: <span style="color: #ff6b6b; font-weight: bold;">${this.getHammerRate()}%</span></div>
      </div>
      
      <div style="margin-bottom: 12px; padding: 8px; background: rgba(255, 107, 107, 0.1); border-radius: 8px; border-left: 3px solid #ff6b6b;">
        <div style="color: #ff6b6b; font-weight: bold; margin-bottom: 6px;">👹 敵人數據</div>
        <div>🗡️ DPS: <span style="color: #ffd700; font-weight: bold;">${enemyDPS.toFixed(1)}</span></div>
        <div>🛡️ 防禦力: <span style="color: #ff6b6b; font-weight: bold;">${enemyDefense}</span></div>
        <div>⚡ 攻速: <span style="color: #ffb347; font-weight: bold;">${this.enemy.attackSpeed.toFixed(2)}</span></div>
      </div>
      
      <div style="padding: 8px; background: rgba(255, 215, 0, 0.1); border-radius: 8px; border-left: 3px solid #ffd700;">
        <div style="color: #ffd700; font-weight: bold; margin-bottom: 6px;">⏱️ 預期戰鬥</div>
        <div>預估時長: <span style="color: #ffd700; font-weight: bold;">${expectedBattleTime}秒</span></div>
        <div>優勢方: <span style="color: ${playerDPS > enemyDPS ? '#4ecdc4' : '#ff6b6b'}; font-weight: bold;">${playerDPS > enemyDPS ? '玩家 (+' + ((playerDPS/enemyDPS - 1) * 100).toFixed(1) + '%)' : '敵人 (+' + ((enemyDPS/playerDPS - 1) * 100).toFixed(1) + '%)'}</span></div>
      </div>
    `;
  }

  calculatePlayerDPS() {
    const attack = this.player.getEffectiveAttack();
    const attackSpeed = this.player.getEffectiveAttackSpeed();
    const critMultiplier = 1 + (this.player.critChance * 1.0);
    const hammerMultiplier = 1 + (this.getHammerRate() / 100 * 0.5);
    
    return attack * attackSpeed * critMultiplier * hammerMultiplier;
  }

  calculatePlayerDefense() {
    const armor = this.player.getEffectiveArmor();
    const reduction = (armor / (armor + 100) * 100).toFixed(1);
    return {
      reduction: reduction,
      flatReduction: this.player.flatReduction
    };
  }

  calculateEnemyDPS() {
    return this.enemy.attack * this.enemy.attackSpeed;
  }

  calculateEnemyDefense() {
    return this.enemy.defense || 0;
  }

  getHammerRate() {
    if (!this.player.hammerEffects.mastery) return 0;
    return this.player.hammerEffects.weight ? 35 : 25;
  }

  calculateExpectedBattleTime(playerDPS, enemyDPS, playerDefense, enemyDefense) {
    const playerEffectiveHP = this.player.hp;
    const enemyEffectiveHP = this.enemy.hp;
    
    const playerTimeToKill = enemyEffectiveHP / Math.max(1, playerDPS - enemyDefense);
    const enemyTimeToKill = playerEffectiveHP / Math.max(1, enemyDPS * (1 - playerDefense.reduction/100) - playerDefense.flatReduction);
    
    return Math.min(playerTimeToKill, enemyTimeToKill).toFixed(1);
  }

  setBattleSpeed(speed) {
    this.battleSpeed = speed;
    this.deltaTime = this.baseDeltaTime / this.battleSpeed;
    console.log(`⚡ 戰鬥速度設定為 ${speed}x`);
  }

  start() {
    console.log('🔥 戰鬥開始！');
    console.log(`👤 玩家: ${this.player.hp}/${this.player.maxHp} HP, ${this.player.attack} 攻擊, ${this.player.getEffectiveArmor()} 護甲`);
    console.log(`👹 敵人: ${this.enemy.hp}/${this.enemy.maxHp} HP, ${this.enemy.attack} 攻擊, ${this.enemy.defense} 防禦`);
    
    this.isActive = true;
    this.battleStats.startTime = Date.now();
    this.lastFrameTime = performance.now();
    this.lastUIUpdate = performance.now();
    
    this.createSpeedControlUI();
    this.loop();
  }

  createSpeedControlUI() {
    if (document.getElementById('speedControl')) return;
    
    const speedControl = document.createElement('div');
    speedControl.id = 'speedControl';
    speedControl.style.cssText = `
      position: fixed;
      top: 20px;
      right: 330px;
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
      <button onclick="window.gameManager?.setBattleSpeed(1)" style="margin-right: 5px; padding: 5px 8px; background: ${this.battleSpeed === 1 ? '#4CAF50' : '#666'}; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">1x</button>
      <button onclick="window.gameManager?.setBattleSpeed(3)" style="margin-right: 5px; padding: 5px 8px; background: ${this.battleSpeed === 3 ? '#FF9800' : '#666'}; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">3x</button>
      <button onclick="window.gameManager?.setBattleSpeed(10)" style="padding: 5px 8px; background: ${this.battleSpeed === 10 ? '#E91E63' : '#666'}; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">10x</button>
    `;
    
    document.body.appendChild(speedControl);
    window.gameManager = this.gameManager;
  }

  stop() {
    this.isActive = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    const speedControl = document.getElementById('speedControl');
    if (speedControl) speedControl.remove();
    window.gameManager = null;
  }

  loop() {
    if (!this.isActive) return;
    
    const currentTime = performance.now();
    const realDeltaTime = (currentTime - this.lastFrameTime) / 1000;
    
    if (realDeltaTime >= this.deltaTime) {
      this.tick();
      this.lastFrameTime = currentTime;
    }
    
    this.animationId = requestAnimationFrame(() => this.loop());
  }

  tick() {
    if (!this.isActive) return;

    this.player.updateTempEffects(this.deltaTime);

    this.player.currentFrame = Math.min(this.player.attackFrame, this.player.currentFrame + 1);
    
    if (!this.enemy.isStunned) {
      this.enemy.currentFrame = Math.min(this.enemy.attackFrame, this.enemy.currentFrame + 1);
    }

    if (this.player.currentFrame >= this.player.attackFrame) {
      this.processPlayerAttack();
      this.player.currentFrame = 0;
    }

    if (this.enemy.currentFrame >= this.enemy.attackFrame && this.isActive && !this.enemy.isStunned) {
      this.processEnemyAttack();
      this.enemy.currentFrame = 0;
    }

    if (this.enemy.isStunned && this.enemy.stunDuration > 0) {
      this.enemy.stunDuration -= this.deltaTime;
      if (this.enemy.stunDuration <= 0) {
        this.enemy.isStunned = false;
        this.enemy.currentFrame = 0;
        console.log('👹 敵人眩暈結束');
      }
    }

    // 🔧 修復: 降低UI更新頻率，減少閃爍
    const currentTime = performance.now();
    if (currentTime - this.lastUIUpdate >= this.uiUpdateInterval) {
      this.updateBattleDisplay();
      this.lastUIUpdate = currentTime;
    }
    
    if (this.frameCount % 60 === 0) {
      this.updateRealTimeStats();
    }
    
    this.frameCount++;
  }

  processPlayerAttack() {
    const attackResult = this.player.performAttack();
    const { damage, isCrit, isHammerProc } = attackResult;
    
    this.battleStats.playerAttackCount++;
    this.battleStats.playerTotalDamage += damage;
    if (isCrit) this.battleStats.critCount++;
    if (isHammerProc) this.battleStats.hammerProcCount++;
    
    const reducedDmg = Math.max(1, damage - this.enemy.defense);
    this.enemy.hp = Math.max(0, this.enemy.hp - reducedDmg);
    
    this.showDamageNumber(reducedDmg, isCrit || isHammerProc, false);
    
    // 重錘精通的眩暈效果
    if (isHammerProc && this.player.hammerEffects.mastery) {
      const stunDuration = this.player.hammerEffects.duration ? 2.0 : 1.0;
      this.enemy.isStunned = true;
      this.enemy.stunDuration = stunDuration;
      this.enemy.currentFrame = 0;
      console.log(`😵 敵人被重錘眩暈 ${stunDuration} 秒！`);
    }
    
    if (this.enemy.hp <= 0) {
      console.log('🏆 敵人被擊敗！');
      this.endBattle(true);
      return;
    }
  }

  processEnemyAttack() {
    const rawDmg = this.enemy.attack;
    
    const armorReduction = rawDmg / (1 + this.player.getEffectiveArmor() / 100);
    const finalDmg = Math.max(1, armorReduction - this.player.flatReduction);
    this.player.hp = Math.max(0, this.player.hp - finalDmg);
    
    this.battleStats.enemyAttackCount++;
    this.battleStats.playerDamageReceived += finalDmg;
    this.battleStats.playerDamageDealtCount++;
    
    this.showDamageNumber(finalDmg, false, true);
    this.showFloatingDamage(finalDmg, true);
    
    this.checkReflectArmor();
    
    if (this.player.hp <= 0) {
      console.log('💀 玩家被擊敗！');
      this.endBattle(false);
      return;
    }
  }

  showFloatingDamage(damage, isPlayerTaking) {
    const targetCard = document.querySelector(isPlayerTaking ? '.hero .character-card' : '.enemy .character-card');
    if (!targetCard) return;

    const floatingDamage = document.createElement('div');
    floatingDamage.className = 'floating-damage';
    
    floatingDamage.textContent = `-${damage.toFixed(1)}`;
    floatingDamage.style.cssText = `
      position: absolute;
      right: -20px;
      top: 40%;
      font-size: 16px;
      font-weight: bold;
      color: ${isPlayerTaking ? '#ff6b6b' : '#4ecdc4'};
      text-shadow: 0 0 8px ${isPlayerTaking ? '#ff6b6b' : '#4ecdc4'}80;
      animation: floatRight 1.5s ease-out forwards;
      pointer-events: none;
      z-index: 1000;
    `;
    
    targetCard.style.position = 'relative';
    targetCard.appendChild(floatingDamage);

    // 1.5秒後移除
    setTimeout(() => {
      if (floatingDamage.parentNode) {
        floatingDamage.remove();
      }
    }, 1500);
  }

  checkReflectArmor() {
    if (this.player.hasReflectArmor && this.battleStats.playerDamageDealtCount % 5 === 0) {
      const reflectDamage = Math.floor(this.enemy.maxHp * 0.05);
      this.enemy.hp = Math.max(0, this.enemy.hp - reflectDamage);
      
      console.log(`⚡ 反甲觸發！對敵人造成 ${reflectDamage} 反彈傷害`);
      this.showDamageNumber(reflectDamage, true, false, '⚡');
      
      if (this.enemy.hp <= 0) {
        console.log('🏆 敵人被反甲擊敗！');
        this.endBattle(true);
        return;
      }
    }
  }

  endBattle(won) {
    this.isActive = false;
    const battleDuration = (Date.now() - this.battleStats.startTime) / 1000;
    
    console.log('\n📊 === 戰鬥報告 ===');
    console.log(`⏱️ 戰鬥時長: ${battleDuration.toFixed(1)}秒`);
    console.log(`🗡️ 玩家攻擊次數: ${this.battleStats.playerAttackCount}`);
    console.log(`💥 暴擊次數: ${this.battleStats.critCount} (${this.battleStats.playerAttackCount > 0 ? (this.battleStats.critCount/this.battleStats.playerAttackCount*100).toFixed(1) : 0}%)`);
    console.log(`🔨 重錘觸發次數: ${this.battleStats.hammerProcCount} (${this.battleStats.playerAttackCount > 0 ? (this.battleStats.hammerProcCount/this.battleStats.playerAttackCount*100).toFixed(1) : 0}%)`);
    console.log(`❤️ 剩餘血量: ${this.player.hp.toFixed(1)}/${this.player.maxHp}`);
    console.log('==================\n');
    
    setTimeout(() => {
      this.gameManager.endBattle(won, this.battleStats);
    }, 100);
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
    
    const randomOffset = Math.random() * 60 - 30;
    
    damageIndicator.style.cssText = `
      position: absolute;
      font-size: ${fontSize};
      font-weight: bold;
      color: ${color};
      text-shadow: 0 0 10px ${color}80;
      animation: damageFloat 2s ease-out forwards;
      pointer-events: none;
      z-index: 1000;
      left: calc(50% + ${randomOffset}px);
      top: 20%;
      transform: translateX(-50%);
    `;
    
    targetCard.style.position = 'relative';
    targetCard.appendChild(damageIndicator);

    setTimeout(() => {
      if (damageIndicator.parentNode) {
        damageIndicator.remove();
      }
    }, 2000);
  }

  updateBattleDisplay() {
    const enemyName = document.querySelector('.enemy .character-name');
    if (enemyName && this.enemy) {
      let nameText = `${this.enemy.emoji} ${this.enemy.getTypeName()} 攻擊${this.enemy.attack}`;
      if (this.enemy.isStunned) {
        nameText += ' 😵💫';
      }
      enemyName.textContent = nameText;
    }

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

    const heroAttackFill = document.querySelector('.hero .attack-fill');
    if (heroAttackFill) {
      const attackPercent = Math.min(100, (this.player.currentFrame / this.player.attackFrame) * 100);
      heroAttackFill.style.width = `${attackPercent}%`;
      heroAttackFill.style.transition = 'width 0.1s linear';
      
      if (attackPercent > 90) {
        heroAttackFill.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.8)';
      } else {
        heroAttackFill.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.5)';
      }
    }

    const enemyAttackFill = document.querySelector('.enemy .attack-fill');
    if (enemyAttackFill && this.enemy) {
      if (this.enemy.isStunned) {
        enemyAttackFill.style.background = 'linear-gradient(90deg, #ff6b6b, #ee5a24)';
        enemyAttackFill.style.boxShadow = '0 0 15px rgba(255, 107, 107, 0.8)';
      } else {
        enemyAttackFill.style.background = 'linear-gradient(90deg, #ffd700, #ffb347)';
        const attackPercent = Math.min(100, (this.enemy.currentFrame / this.enemy.attackFrame) * 100);
        enemyAttackFill.style.width = `${attackPercent}%`;
        enemyAttackFill.style.transition = 'width 0.1s linear';
        
        if (attackPercent > 90) {
          enemyAttackFill.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.8)';
        } else {
          enemyAttackFill.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.5)';
        }
      }
    }

    // 🔧 修復: 避免過度更新速度控制按鈕，減少閃爍
    this.updateSpeedControlButtonsThrottled();
    this.gameManager.updatePlayerStats();
  }

  updateSpeedControlButtons() {
    const speedControl = document.getElementById('speedControl');
    if (speedControl) {
      const buttons = speedControl.querySelectorAll('button');
      buttons[0].style.background = this.battleSpeed === 1 ? '#4CAF50' : '#666';
      buttons[1].style.background = this.battleSpeed === 3 ? '#FF9800' : '#666';
      buttons[2].style.background = this.battleSpeed === 10 ? '#E91E63' : '#666';
    }
  }

  updateSpeedControlButtons() {
    const speedButtons = document.querySelectorAll('.speed-btn');
    speedButtons.forEach(button => {
      const speed = parseInt(button.dataset.speed);
      if (speed === this.battleSpeed) {
        button.style.background = speed === 1 ? '#4CAF50' : speed === 3 ? '#FF9800' : '#E91E63';
      } else {
        button.style.background = '#666';
      }
    });
  }

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

// 添加新的CSS動畫
if (!document.querySelector('#enhancedBattleAnimations')) {
  const style = document.createElement('style');
  style.id = 'enhancedBattleAnimations';
  style.textContent = `
    @keyframes floatRight {
      0% {
        opacity: 1;
        transform: translateX(0) translateY(0) scale(1);
      }
      50% {
        transform: translateX(30px) translateY(-10px) scale(1.1);
      }
      100% {
        opacity: 0;
        transform: translateX(60px) translateY(-20px) scale(0.9);
      }
    }
    
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
    
    .floating-damage {
      user-select: none;
      pointer-events: none;
    }
    
    .damage-indicator {
      user-select: none;
      pointer-events: none;
    }
    
    .attack-fill {
      transition: width 0.1s linear !important;
    }

    /* 🔧 修復: 減少按鈕閃爍的過渡效果 */
    .speed-btn {
      transition: background-color 0.3s ease !important;
    }
  `;
  document.head.appendChild(style);
}

export default BattleSystem;