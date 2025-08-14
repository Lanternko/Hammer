// src/systems/BattleSystem.js - 優化版本
class BattleSystem {
  constructor(player, enemy, gameManager) {
    this.player = player;
    this.enemy = enemy;
    this.gameManager = gameManager;
    this.frameCount = 0;
    this.isActive = false;
    this.animationId = null;
    this.lastFrameTime = 0;
    
    // 戰鬥速度控制（新增10倍速）
    this.battleSpeed = 1; // 預設1倍速
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
      playerDamageDealtCount: 0,
      startTime: Date.now()
    };
    
    // 初始化戰鬥信息面板
    this.initializeCombatInfo();
  }

  // 新增：創建戰鬥信息面板（替代原本的 Combat Log）
  initializeCombatInfo() {
    const combatInfo = document.querySelector('.combat-log');
    if (combatInfo) {
      // 清空舊內容
      const existingEntries = combatInfo.querySelectorAll('.log-entry');
      existingEntries.forEach(entry => entry.remove());
      
      // 修改標題
      const logTitle = combatInfo.querySelector('.log-title');
      if (logTitle) {
        logTitle.textContent = '📊 戰鬥數據';
      }
      
      // 創建實時數據顯示區域
      this.createRealTimeStats();
    }
  }

  createRealTimeStats() {
    const combatInfo = document.querySelector('.combat-log');
    const logTitle = combatInfo.querySelector('.log-title');
    
    // 創建實時統計容器
    const statsContainer = document.createElement('div');
    statsContainer.id = 'realTimeStats';
    statsContainer.style.cssText = `
      padding: 10px 0;
      font-size: 13px;
      line-height: 1.4;
    `;
    
    logTitle.insertAdjacentElement('afterend', statsContainer);
    
    // 初始化顯示
    this.updateRealTimeStats();
  }

  updateRealTimeStats() {
    const statsContainer = document.getElementById('realTimeStats');
    if (!statsContainer) return;
    
    // 只在第一次創建時設置標題，避免重複顯示
    if (!statsContainer.hasAttribute('data-initialized')) {
      statsContainer.setAttribute('data-initialized', 'true');
    }
    
    // 計算玩家 DPS 和防禦能力
    const playerDPS = this.calculatePlayerDPS();
    const playerDefense = this.calculatePlayerDefense();
    
    // 計算敵人 DPS 和防禦能力
    const enemyDPS = this.calculateEnemyDPS();
    const enemyDefense = this.calculateEnemyDefense();
    
    // 計算預期戰鬥時間
    const expectedBattleTime = this.calculateExpectedBattleTime(playerDPS, enemyDPS, playerDefense, enemyDefense);
    
    statsContainer.innerHTML = `
      <div style="margin-bottom: 10px; padding: 6px; background: rgba(78, 205, 196, 0.15); border-radius: 6px; border-left: 2px solid #4ecdc4;">
        <div style="color: #4ecdc4; font-weight: bold; font-size: 12px; margin-bottom: 4px;">👤 玩家</div>
        <div style="font-size: 11px; line-height: 1.3;">
          🗡️ DPS: <span style="color: #ffd700; font-weight: bold;">${playerDPS.toFixed(1)}</span><br>
          🛡️ 減傷: <span style="color: #4ecdc4; font-weight: bold;">${playerDefense.reduction}%</span> | 固減: <span style="color: #4ecdc4; font-weight: bold;">${playerDefense.flatReduction}</span><br>
          💥 暴擊: <span style="color: #ff6b6b; font-weight: bold;">${(this.player.critChance * 100).toFixed(0)}%</span> | 🔨 重錘: <span style="color: #ff6b6b; font-weight: bold;">${this.getHammerRate()}%</span>
        </div>
      </div>
      
      <div style="margin-bottom: 10px; padding: 6px; background: rgba(255, 107, 107, 0.15); border-radius: 6px; border-left: 2px solid #ff6b6b;">
        <div style="color: #ff6b6b; font-weight: bold; font-size: 12px; margin-bottom: 4px;">👹 敵人</div>
        <div style="font-size: 11px; line-height: 1.3;">
          🗡️ DPS: <span style="color: #ffd700; font-weight: bold;">${enemyDPS.toFixed(1)}</span><br>
          🛡️ 防禦: <span style="color: #ff6b6b; font-weight: bold;">${enemyDefense}</span> | ⚡ 攻速: <span style="color: #ffb347; font-weight: bold;">${this.enemy.attackSpeed.toFixed(1)}</span>
        </div>
      </div>
      
      <div style="padding: 6px; background: rgba(255, 215, 0, 0.15); border-radius: 6px; border-left: 2px solid #ffd700;">
        <div style="color: #ffd700; font-weight: bold; font-size: 12px; margin-bottom: 4px;">⏱️ 戰況</div>
        <div style="font-size: 11px; line-height: 1.3;">
          預估: <span style="color: #ffd700; font-weight: bold;">${expectedBattleTime}s</span><br>
          優勢: <span style="color: ${playerDPS > enemyDPS ? '#4ecdc4' : '#ff6b6b'}; font-weight: bold;">${playerDPS > enemyDPS ? '玩家' : '敵人'} (+${Math.abs(((playerDPS - enemyDPS) / Math.min(playerDPS, enemyDPS)) * 100).toFixed(0)}%)</span>
        </div>
      </div>
    `;
  }

  calculatePlayerDPS() {
    const attack = this.player.getEffectiveAttack();
    const attackSpeed = this.player.getEffectiveAttackSpeed();
    const critMultiplier = 1 + (this.player.critChance * 1.0); // 暴擊額外100%傷害
    const hammerMultiplier = 1 + (this.getHammerRate() / 100 * 0.5); // 重錘額外50%傷害
    
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
    // 簡化計算：基於雙方DPS和血量
    const playerEffectiveHP = this.player.hp;
    const enemyEffectiveHP = this.enemy.hp;
    
    const playerTimeToKill = enemyEffectiveHP / Math.max(1, playerDPS - enemyDefense);
    const enemyTimeToKill = playerEffectiveHP / Math.max(1, enemyDPS * (1 - playerDefense.reduction/100) - playerDefense.flatReduction);
    
    return Math.min(playerTimeToKill, enemyTimeToKill).toFixed(1);
  }

  // 設定戰鬥速度 - 新增10倍速
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
    
    // 添加速度控制按鈕（包含10倍速）
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
      <div style="margin-bottom: 5px;">⚡ 戰鬥控制</div>
      <div style="margin-bottom: 8px;">
        <button id="pauseBtn" onclick="window.gameManager?.togglePause()" style="padding: 5px 12px; background: #FF6B6B; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px; margin-right: 5px;">⏸️ 暫停</button>
      </div>
      <div>
        <button onclick="window.gameManager?.setBattleSpeed(1)" style="margin-right: 5px; padding: 5px 8px; background: ${this.battleSpeed === 1 ? '#4CAF50' : '#666'}; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">1x</button>
        <button onclick="window.gameManager?.setBattleSpeed(3)" style="margin-right: 5px; padding: 5px 8px; background: ${this.battleSpeed === 3 ? '#FF9800' : '#666'}; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">3x</button>
        <button onclick="window.gameManager?.setBattleSpeed(10)" style="padding: 5px 8px; background: ${this.battleSpeed === 10 ? '#E91E63' : '#666'}; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">10x</button>
      </div>
    `;
    
    document.body.appendChild(speedControl);
    window.gameManager = this.gameManager;
    window.gameManager.isPaused = false;
  }

  // 新增暫停功能
  togglePause() {
    if (!this.gameManager) return;
    
    this.gameManager.isPaused = !this.gameManager.isPaused;
    const pauseBtn = document.getElementById('pauseBtn');
    
    if (this.gameManager.isPaused) {
      pauseBtn.textContent = '▶️ 繼續';
      pauseBtn.style.background = '#4CAF50';
      this.showPauseOverlay();
    } else {
      pauseBtn.textContent = '⏸️ 暫停';
      pauseBtn.style.background = '#FF6B6B';
      this.hidePauseOverlay();
    }
  }

  showPauseOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'pauseOverlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    `;

    overlay.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #2a2a40 0%, #1a1a2e 100%);
        border: 2px solid #4ecdc4;
        border-radius: 20px;
        padding: 30px;
        max-width: 900px;
        width: 90%;
        color: white;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
      ">
        <h2 style="color: #4ecdc4; margin-bottom: 20px; text-align: center; font-size: 24px;">⏸️ 遊戲暫停</h2>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 20px;">
          <div>
            <h3 style="color: #ffd700; margin-bottom: 15px; font-size: 18px;">📊 當前戰鬥狀況</h3>
            <div style="background: rgba(0, 0, 0, 0.3); padding: 15px; border-radius: 10px; font-size: 14px; line-height: 1.6;">
              <div>👤 玩家血量: <span style="color: #4ecdc4; font-weight: bold;">${Math.round(this.player.hp)}/${this.player.maxHp}</span></div>
              <div>👹 敵人血量: <span style="color: #ff6b6b; font-weight: bold;">${Math.round(this.enemy.hp)}/${this.enemy.maxHp}</span></div>
              <div>🗡️ 玩家 DPS: <span style="color: #ffd700; font-weight: bold;">${this.calculatePlayerDPS().toFixed(1)}</span></div>
              <div>🗡️ 敵人 DPS: <span style="color: #ffd700; font-weight: bold;">${this.calculateEnemyDPS().toFixed(1)}</span></div>
              <div>⏱️ 戰鬥時長: <span style="color: #ccc; font-weight: bold;">${((Date.now() - this.battleStats.startTime) / 1000).toFixed(1)}秒</span></div>
            </div>
          </div>
          
          <div>
            <h3 style="color: #ffd700; margin-bottom: 15px; font-size: 18px;">🔨 玩家屬性</h3>
            <div style="background: rgba(0, 0, 0, 0.3); padding: 15px; border-radius: 10px; font-size: 14px; line-height: 1.6;">
              <div>⚔️ 攻擊力: <span style="color: #ffd700; font-weight: bold;">${this.player.getEffectiveAttack()}</span></div>
              <div>⚡ 攻擊速度: <span style="color: #ffd700; font-weight: bold;">${this.player.getEffectiveAttackSpeed().toFixed(2)}</span></div>
              <div>🛡️ 護甲: <span style="color: #4ecdc4; font-weight: bold;">${this.player.getEffectiveArmor()}</span> (${(this.player.getEffectiveArmor() / (this.player.getEffectiveArmor() + 100) * 100).toFixed(1)}% 減傷)</div>
              <div>🔰 固定減傷: <span style="color: #4ecdc4; font-weight: bold;">${this.player.flatReduction}</span></div>
              <div>💥 暴擊率: <span style="color: #ff6b6b; font-weight: bold;">${(this.player.critChance * 100).toFixed(1)}%</span></div>
              <div>🔨 重錘率: <span style="color: #ff6b6b; font-weight: bold;">${this.getHammerRate()}%</span></div>
            </div>
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #ffd700; margin-bottom: 15px; font-size: 18px;">🎖️ 當前徽章效果</h3>
          <div style="background: rgba(0, 0, 0, 0.3); padding: 15px; border-radius: 10px; font-size: 13px; line-height: 1.5;">
            ${this.getPlayerBuffsForPause()}
          </div>
        </div>
        
        <div style="text-align: center;">
          <button onclick="window.gameManager?.battleSystem?.togglePause()" style="
            background: #4CAF50;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 10px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: background 0.3s ease;
          " 
          onmouseover="this.style.background='#45a049'" 
          onmouseout="this.style.background='#4CAF50'">▶️ 繼續戰鬥</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
  }

  getPlayerBuffsForPause() {
    const buffs = [];
    
    // 重錘效果
    if (this.player.hammerEffects.mastery) buffs.push('🔨 重錘精通: 25%機率150%傷害+眩暈');
    if (this.player.hammerEffects.storm) buffs.push('🌪️ 重錘風暴: 重錘觸發時下次必暴擊');
    if (this.player.hammerEffects.shield) buffs.push('🛡️ 重錘護盾: 重錘觸發時+10護甲5秒');
    if (this.player.hammerEffects.heal) buffs.push('💚 重錘恢復: 重錘觸發時+15血量');
    if (this.player.hammerEffects.fury) buffs.push('🔥 重錘狂怒: 重錘觸發時+50%攻速3秒');
    if (this.player.hammerEffects.weight) buffs.push('⚡ 重錘加重: 觸發率35%，傷害170%');
    if (this.player.hammerEffects.duration) buffs.push('⏱️ 重錘延續: 眩暈時間2秒');
    
    // 其他效果
    if (this.player.hasReflectArmor) buffs.push('⚡ 反甲護盾: 每受傷5次反彈5%敵人血量');
    if (this.player.lifesteal > 0) buffs.push(`🩸 生命汲取: 攻擊時回復${this.player.lifesteal}點血量`);
    if (this.player.specialEffects?.berserker) buffs.push('🔴 狂戰士: 血量<50%時攻擊力+30%，攻速+25%');
    
    // 臨時效果
    const tempEffects = this.player.getStatusInfo();
    buffs.push(...tempEffects);

    return buffs.length > 0 
      ? buffs.map(buff => `<div style="margin-bottom: 3px;">• ${buff}</div>`).join('')
      : '<div style="opacity: 0.6;">暫無特殊效果</div>';
  }

  hidePauseOverlay() {
    const overlay = document.getElementById('pauseOverlay');
    if (overlay) overlay.remove();
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
    window.gameManager = null;
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
    if (!this.isActive || this.gameManager.isPaused) return;

    // 更新玩家臨時效果
    this.player.updateTempEffects(this.deltaTime);

    // 增加攻擊幀計數
    this.player.currentFrame = Math.min(this.player.attackFrame, this.player.currentFrame + 1);
    
    // 敵人只有在非眩暈狀態下才增加攻擊幀
    if (!this.enemy.isStunned) {
      this.enemy.currentFrame = Math.min(this.enemy.attackFrame, this.enemy.currentFrame + 1);
    }

    // 玩家攻擊檢查
    if (this.player.currentFrame >= this.player.attackFrame) {
      this.processPlayerAttack();
      this.player.currentFrame = 0;
    }

    // 敵人攻擊檢查
    if (this.enemy.currentFrame >= this.enemy.attackFrame && this.isActive && !this.enemy.isStunned) {
      this.processEnemyAttack();
      this.enemy.currentFrame = 0;
    }

    // 更新敵人眩暈狀態
    if (this.enemy.isStunned && this.enemy.stunDuration > 0) {
      this.enemy.stunDuration -= this.deltaTime;
      if (this.enemy.stunDuration <= 0) {
        this.enemy.isStunned = false;
        this.enemy.currentFrame = 0;
        console.log('👹 敵人眩暈結束');
      }
    }

    // 更新UI顯示
    this.updateBattleDisplay();
    
    // 每60幀更新一次實時統計（降低更新頻率）
    if (this.frameCount % 60 === 0) {
      this.updateRealTimeStats();
    }
    
    this.frameCount++;
  }

  processPlayerAttack() {
    const attackResult = this.player.performAttack();
    const { damage, isCrit, isHammerProc } = attackResult;
    
    // 更新統計
    this.battleStats.playerAttackCount++;
    this.battleStats.playerTotalDamage += damage;
    if (isCrit) this.battleStats.critCount++;
    if (isHammerProc) this.battleStats.hammerProcCount++;
    
    // 計算敵人實際受到的傷害
    const reducedDmg = Math.max(1, damage - this.enemy.defense);
    this.enemy.hp = Math.max(0, this.enemy.hp - reducedDmg);
    
    // 顯示傷害數字
    this.showDamageNumber(reducedDmg, isCrit || isHammerProc, false);
    
    // 重錘精通的眩暈效果 - 使用新的平衡眩暈時間
    if (isHammerProc && this.player.hammerEffects.mastery) {
      const stunDuration = this.player.getHammerStunDuration();
      this.enemy.isStunned = true;
      this.enemy.stunDuration = stunDuration;
      this.enemy.currentFrame = 0;
      console.log(`😵 敵人被重錘眩暈 ${stunDuration.toFixed(1)} 秒！`);
    }
    
    // 檢查敵人是否死亡
    if (this.enemy.hp <= 0) {
      console.log('🏆 敵人被擊敗！');
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
    this.battleStats.playerDamageDealtCount++;
    
    // 顯示傷害數字（新增：顯示受到的傷害量）
    this.showDamageNumber(finalDmg, false, true);
    this.showFloatingDamage(finalDmg, true); // 新增浮動傷害顯示
    
    // 檢查反甲徽章效果
    this.checkReflectArmor();
    
    // 檢查玩家是否死亡
    if (this.player.hp <= 0) {
      console.log('💀 玩家被擊敗！');
      this.endBattle(false);
      return;
    }
  }

  // 新增：浮動傷害顯示（在血條旁邊）
  showFloatingDamage(damage, isPlayerTaking) {
    const healthContainer = document.querySelector(isPlayerTaking ? '.hero .health-container' : '.enemy .health-container');
    if (!healthContainer) return;

    const floatingDamage = document.createElement('div');
    floatingDamage.className = 'floating-damage';
    
    floatingDamage.textContent = `-${damage.toFixed(0)}`;
    floatingDamage.style.cssText = `
      position: absolute;
      right: -30px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 16px;
      font-weight: bold;
      color: ${isPlayerTaking ? '#ff6b6b' : '#4ecdc4'};
      text-shadow: 0 0 8px ${isPlayerTaking ? '#ff6b6b' : '#4ecdc4'}80;
      animation: floatRight 2s ease-out forwards;
      pointer-events: none;
      z-index: 1000;
    `;
    
    // 確保容器是相對定位
    healthContainer.style.position = 'relative';
    healthContainer.appendChild(floatingDamage);

    // 2秒後移除
    setTimeout(() => {
      if (floatingDamage.parentNode) {
        floatingDamage.remove();
      }
    }, 2000);
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
    
    // 立即傳遞戰鬥統計給GameManager（縮短延遲）
    setTimeout(() => {
      this.gameManager.endBattle(won, this.battleStats);
    }, 100); // 從原來的可能更長時間縮短到100ms
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
    
    // 隨機位置偏移，避免重疊
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
    // 更新敵人名稱和狀態
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

    // 更新攻擊進度條
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

    // 更新敵人攻擊進度條
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

    // 更新速度控制按鈕顏色
    this.updateSpeedControlButtons();

    // 更新GameManager的統計顯示
    this.gameManager.updatePlayerStats();
  }

  updateSpeedControlButtons() {
    const speedControl = document.getElementById('speedControl');
    if (speedControl) {
      const buttons = speedControl.querySelectorAll('button');
      // 只有暫停按鈕是第一個，速度按鈕從第2個開始
      if (buttons.length >= 4) {
        buttons[1].style.background = this.battleSpeed === 1 ? '#4CAF50' : '#666';
        buttons[2].style.background = this.battleSpeed === 3 ? '#FF9800' : '#666';
        buttons[3].style.background = this.battleSpeed === 10 ? '#E91E63' : '#666';
      }
    }
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
  `;
  document.head.appendChild(style);
}

export default BattleSystem;