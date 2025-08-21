// src/systems/BattleSystem.js - 配置化版本
import { GAME_CONFIG } from '../config/GameConfig.js';

class BattleSystem {
  constructor(player, enemy, gameManager) {
    this.player = player;
    this.enemy = enemy;
    this.gameManager = gameManager;
    this.frameCount = 0;
    this.isActive = false;
    this.animationId = null;
    this.lastFrameTime = 0;
    
    // 戰鬥速度控制（使用配置）
    this.battleSpeed = GAME_CONFIG.BATTLE_SPEEDS.NORMAL;
    this.baseDeltaTime = GAME_CONFIG.BASE_DELTA_TIME;
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
      reflectArmorTriggerCount: 0,
      startTime: Date.now()
    };
    
    // 初始化戰鬥信息面板
    this.initializeCombatInfo();
    
    // 調試模式初始化
    if (GAME_CONFIG.DEBUG.ENABLED) {
      console.log('🔧 [DEBUG] BattleSystem 初始化:', {
        battleSpeed: this.battleSpeed,
        baseDeltaTime: this.baseDeltaTime,
        deltaTime: this.deltaTime,
        battleFPS: GAME_CONFIG.BATTLE_FPS
      });
    }
  }

  // 創建戰鬥信息面板（替代原本的 Combat Log）
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
    
    // 計算玩家 DPS 和防禦能力
    const playerDPS = this.calculatePlayerDPS();
    const playerDefense = this.calculatePlayerDefense();
    
    // 計算敵人 DPS 和防禦能力
    const enemyDPS = this.calculateEnemyDPS();
    const enemyDefense = this.calculateEnemyDefense();
    
    // 計算預期戰鬥時間
    const expectedBattleTime = this.calculateExpectedBattleTime(playerDPS, enemyDPS, playerDefense, enemyDefense);
    
    // 使用配置的顏色
    const colors = GAME_CONFIG.UI_CONFIG.COLORS;
    
    statsContainer.innerHTML = `
      <div style="margin-bottom: 12px; padding: 8px; background: rgba(78, 205, 196, 0.1); border-radius: 8px; border-left: 3px solid ${colors.PRIMARY};">
        <div style="color: ${colors.PRIMARY}; font-weight: bold; margin-bottom: 6px;">👤 玩家數據</div>
        <div>🗡️ DPS: <span style="color: ${colors.GOLD}; font-weight: bold;">${playerDPS.toFixed(1)}</span></div>
        <div>🛡️ 護甲減傷: <span style="color: ${colors.PRIMARY}; font-weight: bold;">${playerDefense.reduction}%</span> | 固減: <span style="color: ${colors.PRIMARY}; font-weight: bold;">${playerDefense.flatReduction}</span></div>
        <div>💥 暴擊率: <span style="color: ${colors.SECONDARY}; font-weight: bold;">${(this.player.critChance * 100).toFixed(1)}%</span> | 🔨 重錘率: <span style="color: ${colors.SECONDARY}; font-weight: bold;">${this.getHammerRate()}%</span></div>
      </div>
      
      <div style="margin-bottom: 12px; padding: 8px; background: rgba(255, 107, 107, 0.1); border-radius: 8px; border-left: 3px solid ${colors.SECONDARY};">
        <div style="color: ${colors.SECONDARY}; font-weight: bold; margin-bottom: 6px;">👹 敵人數據</div>
        <div>🗡️ DPS: <span style="color: ${colors.GOLD}; font-weight: bold;">${enemyDPS.toFixed(1)}</span></div>
        <div>🛡️ 防禦力: <span style="color: ${colors.SECONDARY}; font-weight: bold;">${enemyDefense}</span></div>
        <div>⚡ 攻速: <span style="color: #ffb347; font-weight: bold;">${this.enemy.attackSpeed.toFixed(2)}</span></div>
      </div>
      
      <div style="padding: 8px; background: rgba(255, 215, 0, 0.1); border-radius: 8px; border-left: 3px solid ${colors.GOLD};">
        <div style="color: ${colors.GOLD}; font-weight: bold; margin-bottom: 6px;">⏱️ 預期戰鬥</div>
        <div>預估時長: <span style="color: ${colors.GOLD}; font-weight: bold;">${expectedBattleTime}秒</span></div>
        <div>優勢方: <span style="color: ${playerDPS > enemyDPS ? colors.PRIMARY : colors.SECONDARY}; font-weight: bold;">${playerDPS > enemyDPS ? '玩家 (+' + ((playerDPS/enemyDPS - 1) * 100).toFixed(1) + '%)' : '敵人 (+' + ((enemyDPS/playerDPS - 1) * 100).toFixed(1) + '%)'}</span></div>
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
    // 使用配置獲取重錘機率
    const hammerConfig = this.player.hammerEffects.weight ? 
      GAME_CONFIG.HAMMER_CONFIG.ENHANCED_PROC_CHANCE : 
      GAME_CONFIG.HAMMER_CONFIG.BASE_PROC_CHANCE;
    return (hammerConfig * 100).toFixed(0);
  }

  calculateExpectedBattleTime(playerDPS, enemyDPS, playerDefense, enemyDefense) {
    // 簡化計算：基於雙方DPS和血量
    const playerEffectiveHP = this.player.hp;
    const enemyEffectiveHP = this.enemy.hp;
    
    const playerTimeToKill = enemyEffectiveHP / Math.max(1, playerDPS - enemyDefense);
    const enemyTimeToKill = playerEffectiveHP / Math.max(1, enemyDPS * (1 - playerDefense.reduction/100) - playerDefense.flatReduction);
    
    return Math.min(playerTimeToKill, enemyTimeToKill).toFixed(1);
  }

  // 設定戰鬥速度
  setBattleSpeed(speed) {
    // 驗證速度是否有效
    const validSpeeds = Object.values(GAME_CONFIG.BATTLE_SPEEDS);
    if (!validSpeeds.includes(speed)) {
      console.warn(`⚠️ 無效的戰鬥速度: ${speed}, 使用預設值`);
      speed = GAME_CONFIG.BATTLE_SPEEDS.NORMAL;
    }
    
    this.battleSpeed = speed;
    this.deltaTime = this.baseDeltaTime / this.battleSpeed;
    
    if (GAME_CONFIG.DEBUG.ENABLED) {
      console.log(`🔧 [DEBUG] 戰鬥速度設定: ${speed}x, deltaTime: ${this.deltaTime.toFixed(3)}`);
    }
    
    console.log(`⚡ 戰鬥速度設定為 ${speed}x`);
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
      right: 330px;
      background: rgba(0, 0, 0, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      padding: 10px;
      color: white;
      font-size: 14px;
      z-index: ${GAME_CONFIG.UI_CONFIG.Z_INDEX.SPEED_CONTROL};
    `;
    
    // 使用配置的速度選項
    const speeds = GAME_CONFIG.BATTLE_SPEEDS;
    const colors = GAME_CONFIG.UI_CONFIG.COLORS;
    
    speedControl.innerHTML = `
      <div style="margin-bottom: 5px;">⚡ 戰鬥速度</div>
      <button onclick="window.gameManager?.setBattleSpeed(${speeds.NORMAL})" style="margin-right: 5px; padding: 5px 8px; background: ${this.battleSpeed === speeds.NORMAL ? colors.SUCCESS : '#666'}; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">${speeds.NORMAL}x</button>
      <button onclick="window.gameManager?.setBattleSpeed(${speeds.FAST})" style="margin-right: 5px; padding: 5px 8px; background: ${this.battleSpeed === speeds.FAST ? colors.WARNING : '#666'}; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">${speeds.FAST}x</button>
      <button onclick="window.gameManager?.setBattleSpeed(${speeds.TURBO})" style="padding: 5px 8px; background: ${this.battleSpeed === speeds.TURBO ? '#E91E63' : '#666'}; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">${speeds.TURBO}x</button>
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
    
    // 清理速度控制UI
    const speedControl = document.getElementById('speedControl');
    if (speedControl) speedControl.remove();
    window.gameManager = null;
    
    if (GAME_CONFIG.DEBUG.ENABLED) {
      console.log('🔧 [DEBUG] 戰鬥系統已停止');
    }
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
    
    // 定期更新實時統計（降低更新頻率以提升性能）
    if (this.frameCount % (GAME_CONFIG.BATTLE_FPS * 3) === 0) { // 每3秒更新一次
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
    
    // 重錘精通的眩暈效果 - 使用配置
    if (isHammerProc && this.player.hammerEffects.mastery) {
      // 🔧 添加眩暈開關檢查
      if (GAME_CONFIG.HAMMER_CONFIG.STUN_ENABLED) {
        const stunDuration = this.player.hammerEffects.duration ? 
          GAME_CONFIG.HAMMER_CONFIG.ENHANCED_STUN_DURATION : 
          GAME_CONFIG.HAMMER_CONFIG.BASE_STUN_DURATION;
        
        this.enemy.isStunned = true;
        this.enemy.stunDuration = stunDuration;
        this.enemy.currentFrame = 0;
        console.log(`😵 敵人被重錘眩暈 ${stunDuration} 秒！`);
      } else {
        // 眩暈被禁用，只記錄重錘觸發
        console.log(`🔨 重錘精通觸發！(眩暈已禁用)`);
      }
    }

    
    // 調試模式記錄攻擊詳情
    if (GAME_CONFIG.DEBUG.LOG_BATTLE_STATS) {
      console.log(`🔧 [DEBUG] 玩家攻擊: ${damage.toFixed(1)}傷害 → ${reducedDmg.toFixed(1)}實際傷害 (${isCrit ? '暴擊' : ''}${isHammerProc ? ' 重錘' : ''})`);
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
    
    // 顯示傷害數字
    this.showDamageNumber(finalDmg, false, true);
    this.showFloatingDamage(finalDmg, true);
    
    // 檢查反甲徽章效果
    this.checkReflectArmor();
    
    // 調試模式記錄攻擊詳情
    if (GAME_CONFIG.DEBUG.LOG_BATTLE_STATS) {
      console.log(`🔧 [DEBUG] 敵人攻擊: ${rawDmg}原始 → ${armorReduction.toFixed(1)}護甲減傷 → ${finalDmg.toFixed(1)}最終傷害`);
    }
    
    // 檢查玩家是否死亡
    if (this.player.hp <= 0) {
      console.log('💀 玩家被擊敗！');
      this.endBattle(false);
      return;
    }
  }

  // 浮動傷害顯示（在血條旁邊）
  showFloatingDamage(damage, isPlayerTaking) {
    const targetCard = document.querySelector(isPlayerTaking ? '.hero .character-card' : '.enemy .character-card');
    if (!targetCard) return;

    const floatingDamage = document.createElement('div');
    floatingDamage.className = 'floating-damage';
    
    const color = isPlayerTaking ? GAME_CONFIG.UI_CONFIG.COLORS.SECONDARY : GAME_CONFIG.UI_CONFIG.COLORS.PRIMARY;
    
    floatingDamage.textContent = `-${damage.toFixed(1)}`;
    floatingDamage.style.cssText = `
      position: absolute;
      right: -20px;
      top: 40%;
      font-size: 16px;
      font-weight: bold;
      color: ${color};
      text-shadow: 0 0 8px ${color}80;
      animation: floatRight 1.5s ease-out forwards;
      pointer-events: none;
      z-index: 1000;
    `;
    
    targetCard.style.position = 'relative';
    targetCard.appendChild(floatingDamage);

    // 使用配置的顯示時間
    setTimeout(() => {
      if (floatingDamage.parentNode) {
        floatingDamage.remove();
      }
    }, GAME_CONFIG.DAMAGE_DISPLAY_DURATION);
  }

  checkReflectArmor() {
    // 使用配置的反甲設定
    const reflectConfig = GAME_CONFIG.REFLECT_ARMOR_CONFIG;
    
    if (this.player.hasReflectArmor && this.battleStats.playerDamageDealtCount % reflectConfig.TRIGGER_INTERVAL === 0) {
      const reflectDamage = Math.floor(this.enemy.maxHp * reflectConfig.DAMAGE_PERCENT);
      this.enemy.hp = Math.max(0, this.enemy.hp - reflectDamage);
      
      // 更新反甲統計
      this.battleStats.reflectArmorTriggerCount++;
      
      console.log(`⚡ 反甲觸發！對敵人造成 ${reflectDamage} 反彈傷害 (第${this.battleStats.reflectArmorTriggerCount}次)`);
      this.showDamageNumber(reflectDamage, true, false, '⚡');
      
      if (GAME_CONFIG.DEBUG.LOG_BATTLE_STATS) {
        console.log(`🔧 [DEBUG] 反甲觸發: ${reflectDamage}傷害 (${reflectConfig.DAMAGE_PERCENT * 100}% 最大血量)`);
      }
      
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
    
    // 完整的戰鬥報告
    console.log('\n📊 === 戰鬥報告 ===');
    console.log(`⏱️ 戰鬥時長: ${battleDuration.toFixed(1)}秒`);
    console.log(`🗡️ 玩家攻擊次數: ${this.battleStats.playerAttackCount}`);
    console.log(`💥 暴擊次數: ${this.battleStats.critCount} (${this.battleStats.playerAttackCount > 0 ? (this.battleStats.critCount/this.battleStats.playerAttackCount*100).toFixed(1) : 0}%)`);
    console.log(`🔨 重錘觸發次數: ${this.battleStats.hammerProcCount} (${this.battleStats.playerAttackCount > 0 ? (this.battleStats.hammerProcCount/this.battleStats.playerAttackCount*100).toFixed(1) : 0}%)`);
    console.log(`⚡ 反甲觸發次數: ${this.battleStats.reflectArmorTriggerCount}`);
    console.log(`❤️ 剩餘血量: ${this.player.hp.toFixed(1)}/${this.player.maxHp}`);
    console.log(`📈 平均DPS: ${this.battleStats.playerAttackCount > 0 ? (this.battleStats.playerTotalDamage / battleDuration).toFixed(1) : 0}`);
    console.log('==================\n');
    
    // 立即傳遞戰鬥統計給GameManager
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
    let color = isEnemyAttack ? GAME_CONFIG.UI_CONFIG.COLORS.SECONDARY : GAME_CONFIG.UI_CONFIG.COLORS.PRIMARY;
    let fontSize = '24px';
    
    if (isCritical) {
      displayText = `CRIT! ${displayText}`;
      color = GAME_CONFIG.UI_CONFIG.COLORS.GOLD;
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

    // 使用配置的顯示時間
    setTimeout(() => {
      if (damageIndicator.parentNode) {
        damageIndicator.remove();
      }
    }, GAME_CONFIG.DAMAGE_DISPLAY_DURATION);
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
        heroAttackFill.style.boxShadow = `0 0 15px ${GAME_CONFIG.UI_CONFIG.COLORS.GOLD}80`;
      } else {
        heroAttackFill.style.boxShadow = `0 0 10px ${GAME_CONFIG.UI_CONFIG.COLORS.GOLD}50`;
      }
    }

    // 更新敵人攻擊進度條
    const enemyAttackFill = document.querySelector('.enemy .attack-fill');
    if (enemyAttackFill && this.enemy) {
      if (this.enemy.isStunned) {
        enemyAttackFill.style.background = `linear-gradient(90deg, ${GAME_CONFIG.UI_CONFIG.COLORS.SECONDARY}, #ee5a24)`;
        enemyAttackFill.style.boxShadow = `0 0 15px ${GAME_CONFIG.UI_CONFIG.COLORS.SECONDARY}80`;
      } else {
        enemyAttackFill.style.background = `linear-gradient(90deg, ${GAME_CONFIG.UI_CONFIG.COLORS.GOLD}, #ffb347)`;
        const attackPercent = Math.min(100, (this.enemy.currentFrame / this.enemy.attackFrame) * 100);
        enemyAttackFill.style.width = `${attackPercent}%`;
        enemyAttackFill.style.transition = 'width 0.1s linear';
        
        if (attackPercent > 90) {
          enemyAttackFill.style.boxShadow = `0 0 15px ${GAME_CONFIG.UI_CONFIG.COLORS.GOLD}80`;
        } else {
          enemyAttackFill.style.boxShadow = `0 0 10px ${GAME_CONFIG.UI_CONFIG.COLORS.GOLD}50`;
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
      const speeds = GAME_CONFIG.BATTLE_SPEEDS;
      const colors = GAME_CONFIG.UI_CONFIG.COLORS;
      
      // 動態更新按鈕顏色
      if (buttons.length >= 3) {
        buttons[0].style.background = this.battleSpeed === speeds.NORMAL ? colors.SUCCESS : '#666';
        buttons[1].style.background = this.battleSpeed === speeds.FAST ? colors.WARNING : '#666';
        buttons[2].style.background = this.battleSpeed === speeds.TURBO ? '#E91E63' : '#666';
      }
    }
  }

  getCurrentStats() {
    const currentTime = Date.now();
    const battleDuration = (currentTime - this.battleStats.startTime) / 1000;
    
    return {
      ...this.battleStats,
      battleDuration: battleDuration,
      avgDamage: this.battleStats.playerAttackCount > 0 ? 
        this.battleStats.playerTotalDamage / this.battleStats.playerAttackCount : 0,
      avgDamageTaken: this.battleStats.enemyAttackCount > 0 ? 
        this.battleStats.playerDamageReceived / this.battleStats.enemyAttackCount : 0,
      critRate: this.battleStats.playerAttackCount > 0 ? 
        (this.battleStats.critCount / this.battleStats.playerAttackCount) * 100 : 0,
      hammerRate: this.battleStats.playerAttackCount > 0 ? 
        (this.battleStats.hammerProcCount / this.battleStats.playerAttackCount) * 100 : 0,
      actualDPS: battleDuration > 0 ? this.battleStats.playerTotalDamage / battleDuration : 0,
      reflectArmorEfficiency: this.battleStats.reflectArmorTriggerCount > 0 ? 
        (this.battleStats.reflectArmorTriggerCount * GAME_CONFIG.REFLECT_ARMOR_CONFIG.DAMAGE_PERCENT * this.enemy.maxHp) : 0
    };
  }

  // 性能監控方法（調試用）
  getPerformanceMetrics() {
    if (!GAME_CONFIG.DEBUG.SHOW_PERFORMANCE_METRICS) return null;
    
    const currentTime = performance.now();
    const battleDuration = (currentTime - this.battleStats.startTime) / 1000;
    
    return {
      frameRate: this.frameCount / battleDuration,
      expectedFrameRate: GAME_CONFIG.BATTLE_FPS,
      battleSpeed: this.battleSpeed,
      deltaTime: this.deltaTime,
      totalFrames: this.frameCount,
      averageFrameTime: battleDuration / this.frameCount * 1000, // ms
      uiUpdateFrequency: 3, // 每3秒更新一次UI
      memoryUsage: performance.memory ? {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
      } : null
    };
  }

  // 戰鬥暫停/恢復功能（可選）
  pause() {
    if (this.isActive) {
      this.isActive = false;
      console.log('⏸️ 戰鬥已暫停');
      
      if (GAME_CONFIG.DEBUG.ENABLED) {
        const metrics = this.getPerformanceMetrics();
        console.log('🔧 [DEBUG] 暫停時性能指標:', metrics);
      }
    }
  }

  resume() {
    if (!this.isActive) {
      this.isActive = true;
      this.lastFrameTime = performance.now(); // 重置時間以避免大幅跳躍
      console.log('▶️ 戰鬥已恢復');
      this.loop();
    }
  }

  // 手動觸發統計更新（調試用）
  forceStatsUpdate() {
    if (GAME_CONFIG.DEBUG.ENABLED) {
      console.log('🔧 [DEBUG] 強制更新統計');
      this.updateRealTimeStats();
      
      const currentStats = this.getCurrentStats();
      const performanceMetrics = this.getPerformanceMetrics();
      
      console.table({
        '戰鬥統計': currentStats,
        '性能指標': performanceMetrics
      });
    }
  }

  // 清理方法（確保所有資源都被正確釋放）
  cleanup() {
    this.stop();
    
    // 清理所有創建的DOM元素
    const elementsToClean = [
      '#speedControl',
      '#realTimeStats',
      '.damage-indicator',
      '.floating-damage'
    ];
    
    elementsToClean.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
    });
    
    // 清理全局變量
    if (window.gameManager === this.gameManager) {
      window.gameManager = null;
    }
    
    // 重置統計
    this.battleStats = {
      playerAttackCount: 0,
      playerTotalDamage: 0,
      playerDamageReceived: 0,
      enemyAttackCount: 0,
      hammerProcCount: 0,
      critCount: 0,
      playerDamageDealtCount: 0,
      reflectArmorTriggerCount: 0,
      startTime: Date.now()
    };
    
    if (GAME_CONFIG.DEBUG.ENABLED) {
      console.log('🔧 [DEBUG] BattleSystem 清理完成');
    }
  }
}

// 添加新的CSS動畫（如果尚未存在）
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