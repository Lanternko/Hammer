// src/systems/BattleSystem.js - 整合版本
import { GAME_CONFIG, GameConfigUtils } from '../config/GameConfig.js';
import { BattleUITemplates, BattleUIManager } from '../ui/BattleUITemplates.js';

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
    this.battleSpeed = GAME_CONFIG.BATTLE_SPEEDS.NORMAL;
    this.baseDeltaTime = GAME_CONFIG.BASE_DELTA_TIME;
    this.deltaTime = this.baseDeltaTime / this.battleSpeed;
    
    // 🎨 UI管理器
    this.uiManager = new BattleUIManager(this);
    
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
    
    if (GAME_CONFIG.DEBUG.ENABLED) {
      console.log('🔧 [DEBUG] BattleSystem 初始化:', {
        battleSpeed: this.battleSpeed,
        baseDeltaTime: this.baseDeltaTime,
        deltaTime: this.deltaTime,
        battleFPS: GAME_CONFIG.BATTLE_FPS
      });
    }
  }

  // 創建戰鬥信息面板 - 簡化版本 (不再需要重複的戰鬥數據)
  initializeCombatInfo() {
    // 戰鬥數據現在顯示在專門的統計面板中，這裡不再需要重複顯示
  }

  createRealTimeStats() {
    // 實時戰鬥數據現在顯示在專門的左右統計面板中
    // 不再需要在戰鬥日誌區域重複顯示
  }

  updateRealTimeStats() {
    // 實時數據更新現在通過 GameManager.updatePlayerStats() 和 updateEnemyStatsPanel() 處理
    // 不再需要重複的戰鬥數據顯示
  }

  // 🧮 戰力對比輔助方法
  getArmorReduction() {
    const armor = this.player.getEffectiveArmor();
    return (armor / (armor + 100) * 100).toFixed(1);
  }

  getHammerRate() {
    if (!this.player.hammerEffects.mastery) return 0;
    const hammerConfig = this.player.hammerEffects.weight ? 
      GAME_CONFIG.HAMMER_CONFIG.ENHANCED_PROC_CHANCE : 
      GAME_CONFIG.HAMMER_CONFIG.BASE_PROC_CHANCE;
    return (hammerConfig * 100).toFixed(0);
  }

  getCombatAdvantageColor(playerPower, enemyPower) {
    const ratio = playerPower / enemyPower;
    if (ratio > 1.2) return GAME_CONFIG.UI_CONFIG.COLORS.SUCCESS;
    if (ratio > 1.05) return GAME_CONFIG.UI_CONFIG.COLORS.PRIMARY;
    if (ratio > 0.95) return GAME_CONFIG.UI_CONFIG.COLORS.GOLD;
    if (ratio > 0.8) return GAME_CONFIG.UI_CONFIG.COLORS.WARNING;
    return GAME_CONFIG.UI_CONFIG.COLORS.SECONDARY;
  }

  getCombatAdvantageText(playerPower, enemyPower) {
    const ratio = playerPower / enemyPower;
    const diff = Math.abs((ratio - 1) * 100).toFixed(0);
    
    if (ratio > 1.2) return `玩家領先 +${diff}%`;
    if (ratio > 1.05) return `玩家略勝 +${diff}%`;
    if (ratio > 0.95) return '勢均力敵';
    if (ratio > 0.8) return `敵人略勝 -${diff}%`;
    return `敵人領先 -${diff}%`;
  }

  calculateExpectedBattleTime(playerDPS, enemyDPS, playerEHP, enemyEHP) {
    const playerTimeToKill = enemyEHP / Math.max(1, playerDPS);
    const enemyTimeToKill = playerEHP / Math.max(1, enemyDPS * (1 - this.getArmorReduction()/100) - this.player.flatReduction);
    
    return Math.min(playerTimeToKill, enemyTimeToKill).toFixed(1);
  }

  // 設定戰鬥速度
  setBattleSpeed(speed) {
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
    
    if (GAME_CONFIG.DEBUG.ENABLED) {
      console.log(`⚡ 戰鬥速度設定為 ${speed}x`);
    }
  }

  start() {
    console.log('🔥 戰鬥開始！');
    console.log(`👤 玩家: ${this.player.hp}/${this.player.maxHp} HP, ${this.player.attack} 攻擊, ${this.player.getEffectiveArmor()} 護甲`);
    console.log(`👹 敵人: ${this.enemy.hp}/${this.enemy.maxHp} HP, ${this.enemy.attack} 攻擊, ${this.enemy.defense || this.enemy.armor || 0} 防禦`);
    
    // 🎯 顯示戰力對比
    const playerPower = GameConfigUtils.calculatePlayerCombatPower(this.player);
    const enemyPower = GameConfigUtils.calculateEnemyCombatPower(this.enemy);
    console.log(`⚔️ 戰力對比: 玩家 ${playerPower.displayPower} vs 敵人 ${enemyPower.displayPower}`);
    
    this.isActive = true;
    this.battleStats.startTime = Date.now();
    this.lastFrameTime = performance.now();
    
    // 🎨 使用UI管理器創建控制界面 - 添加安全檢查
    if (this.uiManager && typeof this.uiManager.createSpeedControlUI === 'function') {
      this.uiManager.createSpeedControlUI();
    } else {
      if (GAME_CONFIG.DEBUG.ENABLED) {
        console.warn('⚠️ UI Manager not properly initialized or missing createSpeedControlUI method');
      }
      // 創建一個簡單的速度控制作為後備
      this.createFallbackSpeedControl();
    }
    
    this.createPauseButton();
    this.loop();
  }


  createPauseButton() {
    if (document.getElementById('pauseButton')) return;
    
    const pauseButton = document.createElement('button');
    pauseButton.id = 'pauseButton';
    pauseButton.innerHTML = this.isActive ? '⏸️' : '▶️';
    pauseButton.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      background: rgba(0, 0, 0, 0.8);
      border: 2px solid ${GAME_CONFIG.UI_CONFIG.COLORS.PRIMARY};
      border-radius: 50%;
      color: white;
      font-size: 20px;
      cursor: pointer;
      z-index: ${GAME_CONFIG.UI_CONFIG.Z_INDEX.SPEED_CONTROL + 1};
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    `;
    
    pauseButton.addEventListener('mouseenter', () => {
      pauseButton.style.transform = 'scale(1.1)';
      pauseButton.style.boxShadow = `0 0 20px ${GAME_CONFIG.UI_CONFIG.COLORS.PRIMARY}60`;
    });
    
    pauseButton.addEventListener('mouseleave', () => {
      pauseButton.style.transform = 'scale(1)';
      pauseButton.style.boxShadow = 'none';
    });
    
    pauseButton.addEventListener('click', () => {
      this.togglePause();
    });
    
    document.body.appendChild(pauseButton);
  }

  // 在 src/systems/BattleSystem.js 中修復 togglePause 方法
  
  togglePause() {
    if (this.isActive) {
      this.pause();
      // 🔧 保持使用現有的 UI 管理器，但修改其行為
      if (this.uiManager && typeof this.uiManager.showDetailedPanel === 'function') {
        this.uiManager.showDetailedPanel();
        
        // 修復面板的點擊行為
        setTimeout(() => {
          const panel = document.getElementById('detailedPanel');
          if (panel) {
            // 移除原有的事件監聽器
            const newPanel = panel.cloneNode(true);
            panel.parentNode.replaceChild(newPanel, panel);
            
            // 添加修復後的事件監聽器
            newPanel.addEventListener('click', () => {
              this.resume();
              newPanel.remove();
              const pauseButton = document.getElementById('pauseButton');
              if (pauseButton) {
                pauseButton.innerHTML = '⏸️';
              }
            });
          }
        }, 100);
      }
    } else {
      this.resume();
      this.hideDetailedPanel();
    }
    
    // 更新暫停按鈕狀態
    const pauseButton = document.getElementById('pauseButton');
    if (pauseButton) {
      pauseButton.innerHTML = this.isActive ? '⏸️' : '▶️';
    }
  }

  // 新增後備暫停面板方法
  createFallbackPausePanel() {
    // 移除已存在的面板
    const existingPanel = document.getElementById('detailedPanel');
    if (existingPanel) existingPanel.remove();
    
    const panel = document.createElement('div');
    panel.id = 'detailedPanel';
    panel.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 1000;
      display: flex;
      justify-content: center;
      align-items: center;
    `;
    
    panel.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
        padding: 30px;
        border-radius: 15px;
        text-align: center;
        color: white;
        max-width: 400px;
        width: 90%;
      ">
        <h2 style="margin-bottom: 20px; color: #4ecdc4;">⏸️ 遊戲暫停</h2>
        <button onclick="this.closest('#detailedPanel').remove(); document.getElementById('pauseButton').click();" 
                style="
                  padding: 15px 30px;
                  background: linear-gradient(45deg, #4ecdc4, #45b7b8);
                  color: white;
                  border: none;
                  border-radius: 25px;
                  font-size: 16px;
                  cursor: pointer;
                  transition: all 0.3s ease;
                ">
          ▶️ 繼續遊戲
        </button>
      </div>
    `;
    
    document.body.appendChild(panel);
  }

  // 修復按鈕狀態更新
  updatePauseButton() {
    const pauseButton = document.getElementById('pauseButton');
    if (pauseButton) {
      pauseButton.innerHTML = this.isActive ? '⏸️' : '▶️';
      pauseButton.style.pointerEvents = 'auto'; // 確保按鈕可點擊
      pauseButton.style.cursor = 'pointer';
    }
  }

  // 修復隱藏面板方法
  hideDetailedPanel() {
    const panel = document.getElementById('detailedPanel');
    if (panel) {
      panel.remove();
      console.log('🔧 暫停面板已移除');
    }
  }

  stop() {
    this.isActive = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    // 清理UI元素
    const elementsToClean = ['speedControl', 'pauseButton', 'detailedPanel'];
    elementsToClean.forEach(id => {
      const element = document.getElementById(id);
      if (element) element.remove();
    });
    
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
        if (GAME_CONFIG.DEBUG.ENABLED) {
          console.log('👹 敵人眩暈結束');
        }
      }
    }

    // 更新UI顯示
    this.updateBattleDisplay();
    
    // 定期更新實時統計
    if (this.frameCount % (GAME_CONFIG.BATTLE_FPS * 3) === 0) {
      this.updateRealTimeStats();
    }
    
    this.frameCount++;
  }

  // 在 src/systems/BattleSystem.js 的 processPlayerAttack 方法中修復
  processPlayerAttack() {
    const attackResult = this.player.performAttack();
    const { damage, isCrit, isHammerProc } = attackResult;
    
    // 更新統計
    this.battleStats.playerAttackCount++;
    this.battleStats.playerTotalDamage += damage;
    if (isCrit) this.battleStats.critCount++;
    if (isHammerProc) this.battleStats.hammerProcCount++;
    
    // 🔧 修復：正確的護甲減傷計算
    // 護甲減傷公式應該是：減傷率 = 護甲值 / (護甲值 + 100)
    // 而不是直接用護甲值減少傷害
    const enemyArmor = this.enemy.armor || this.enemy.defense || 0;
    
    // 正確的百分比減傷計算
    const damageReduction = enemyArmor / (enemyArmor + 100);
    const finalDamage = damage * (1 - damageReduction);
    const reducedDmg = Math.max(1, Math.floor(finalDamage)); // 確保至少造成1點傷害
    
    if (GAME_CONFIG.DEBUG.ENABLED) {
      console.log(`🔧 傷害計算詳情:`);
      console.log(`   原始傷害: ${damage}`);
      console.log(`   敵人護甲: ${enemyArmor}`);
      console.log(`   減傷率: ${(damageReduction * 100).toFixed(1)}%`);
      console.log(`   最終傷害: ${finalDamage.toFixed(1)} → ${reducedDmg}`);
    }
    
    this.enemy.hp = Math.max(0, this.enemy.hp - reducedDmg);
    
    // 顯示傷害數字
    this.showDamageNumber(reducedDmg, isCrit || isHammerProc, false);
    
    // 重錘精通的眩暈效果
    if (isHammerProc && this.player.hammerEffects.mastery) {
      if (GAME_CONFIG.HAMMER_CONFIG.STUN_ENABLED) {
        const stunDuration = this.player.hammerEffects.duration ? 
          GAME_CONFIG.HAMMER_CONFIG.ENHANCED_STUN_DURATION : 
          GAME_CONFIG.HAMMER_CONFIG.BASE_STUN_DURATION;
        
        this.enemy.isStunned = true;
        this.enemy.stunDuration = stunDuration;
        this.enemy.currentFrame = 0;
        if (GAME_CONFIG.DEBUG.ENABLED) {
          console.log(`😵 敵人被重錘眩暈 ${stunDuration} 秒！`);
        }
      }
    }
    
    // 檢查敵人是否死亡
    if (this.enemy.hp <= 0) {
      if (GAME_CONFIG.DEBUG.ENABLED) {
        console.log('🏆 敵人被擊敗！');
      }
      this.endBattle(true);
      return;
    }
  }

  // 修復敵人攻擊玩家的護甲計算
  processEnemyAttack() {
    const rawDmg = this.enemy.attack;
    
    // 🔧 修復：正確計算玩家護甲減傷
    const playerArmor = this.player.getEffectiveArmor();
    const armorReduction = playerArmor / (playerArmor + 100); // 百分比減傷
    const armorReducedDamage = rawDmg * (1 - armorReduction);
    
    // 然後扣除固定減傷
    const finalDmg = Math.max(1, armorReducedDamage - this.player.flatReduction);
    
    console.log(`🛡️ 玩家受傷計算:`);
    console.log(`   敵人攻擊: ${rawDmg}`);
    console.log(`   玩家護甲: ${playerArmor} (減傷${(armorReduction * 100).toFixed(1)}%)`);
    console.log(`   護甲後傷害: ${armorReducedDamage.toFixed(1)}`);
    console.log(`   固定減傷: ${this.player.flatReduction}`);
    console.log(`   最終傷害: ${finalDmg.toFixed(1)}`);
    
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
    
    // 檢查玩家是否死亡
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

    setTimeout(() => {
      if (floatingDamage.parentNode) {
        floatingDamage.remove();
      }
    }, GAME_CONFIG.DAMAGE_DISPLAY_DURATION);
  }

  checkReflectArmor() {
    const reflectConfig = GAME_CONFIG.REFLECT_ARMOR_CONFIG;
    
    if (this.player.hasReflectArmor && this.battleStats.playerDamageDealtCount % reflectConfig.TRIGGER_INTERVAL === 0) {
      const reflectDamage = Math.floor(this.enemy.maxHp * reflectConfig.DAMAGE_PERCENT);
      this.enemy.hp = Math.max(0, this.enemy.hp - reflectDamage);
      
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
    }, GAME_CONFIG.DAMAGE_DISPLAY_DURATION);
  }

  endBattle(won) {
    this.isActive = false;
    const battleDuration = (Date.now() - this.battleStats.startTime) / 1000;
    
    // 戰鬥報告
    console.log('\n📊 === 戰鬥報告 ===');
    console.log(`⏱️ 戰鬥時長: ${battleDuration.toFixed(1)}秒`);
    console.log(`🗡️ 玩家攻擊次數: ${this.battleStats.playerAttackCount}`);
    console.log(`💥 暴擊次數: ${this.battleStats.critCount} (${this.battleStats.playerAttackCount > 0 ? (this.battleStats.critCount/this.battleStats.playerAttackCount*100).toFixed(1) : 0}%)`);
    console.log(`🔨 重錘觸發次數: ${this.battleStats.hammerProcCount} (${this.battleStats.playerAttackCount > 0 ? (this.battleStats.hammerProcCount/this.battleStats.playerAttackCount*100).toFixed(1) : 0}%)`);
    console.log(`⚡ 反甲觸發次數: ${this.battleStats.reflectArmorTriggerCount}`);
    console.log(`❤️ 剩餘血量: ${this.player.hp.toFixed(1)}/${this.player.maxHp}`);
    console.log(`📈 平均DPS: ${this.battleStats.playerAttackCount > 0 ? (this.battleStats.playerTotalDamage / battleDuration).toFixed(1) : 0}`);
    console.log('==================\n');
    
    setTimeout(() => {
      this.gameManager.endBattle(won, this.battleStats);
    }, 100);
  }

  // 🎨 使用UI管理器顯示戰鬥結果
  showBattleResults(battleStats, player, displayTime = 0) {
    this.uiManager.showBattleResults(battleStats, player);
  }

  updateBattleDisplay() {
    // 更新敵人名稱和狀態
    const enemyName = document.querySelector('.enemy .character-name');
    if (enemyName && this.enemy) {
      let nameText = `${this.enemy.emoji} ${this.enemy.getTypeName()}`;
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

    // 更新GameManager的統計顯示
    this.gameManager.updatePlayerStats();
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

  // 戰鬥暫停/恢復功能
  pause() {
    if (this.isActive) {
      this.isActive = false;
      console.log('⏸️ 戰鬥已暫停');
      
      if (GAME_CONFIG.DEBUG.ENABLED) {
        console.log('🔧 [DEBUG] 暫停時戰力對比:', {
          player: GameConfigUtils.calculatePlayerCombatPower(this.player),
          enemy: GameConfigUtils.calculateEnemyCombatPower(this.enemy)
        });
      }
    }
  }

  resume() {
    if (!this.isActive) {
      this.isActive = true;
      this.lastFrameTime = performance.now();
      console.log('▶️ 戰鬥已恢復');
      this.loop();
    }
  }

  // 獲取性能指標（調試用）
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

  // 清理方法
  cleanup() {
    this.stop();
    
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
    
    if (window.gameManager === this.gameManager) {
      window.gameManager = null;
    }
    
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

// 添加CSS動畫（如果尚未存在）
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
    
    @keyframes pulse {
      0%, 100% { 
        transform: translate(-50%, -50%) scale(1); 
        opacity: 0.7; 
      }
      50% { 
        transform: translate(-50%, -50%) scale(1.1); 
        opacity: 1; 
      }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideInFromLeft {
      from { transform: translateX(-100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideInFromRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes scaleIn {
      from { transform: scale(0); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    
    @keyframes bounce {
      0%, 20%, 53%, 80%, 100% {
        transform: translate3d(0, 0, 0);
      }
      40%, 43% {
        transform: translate3d(0, -30px, 0);
      }
      70% {
        transform: translate3d(0, -15px, 0);
      }
      90% {
        transform: translate3d(0, -4px, 0);
      }
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    /* 通用動畫類 */
    .animate-fadeIn { animation: fadeIn 0.3s ease-in; }
    .animate-slideInLeft { animation: slideInFromLeft 0.3s ease-out; }
    .animate-slideInRight { animation: slideInFromRight 0.3s ease-out; }
    .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
    .animate-bounce { animation: bounce 0.6s ease-out; }
    .animate-shake { animation: shake 0.5s ease-in-out; }
    .animate-pulse { animation: pulse 2s infinite; }
    .animate-spin { animation: spin 1s linear infinite; }
  `;
  document.head.appendChild(style);
}

export default BattleSystem;