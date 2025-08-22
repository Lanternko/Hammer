// src/ui/BattleUITemplates.js - 戰鬥UI模板分離
export class BattleUITemplates {
  
  // 🎯 戰力對比模板（用於暫停頁面）
  static getCombatPowerComparisonHTML(playerPower, enemyPower, advantage) {
    return `
      <div style="background: rgba(255, 215, 0, 0.1); padding: 20px; border-radius: 15px; border-left: 4px solid #ffd700; margin-bottom: 20px;">
        <h3 style="color: #ffd700; margin-bottom: 15px;">⚔️ 戰力對比分析</h3>
        <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 20px; align-items: center;">
          
          <!-- 玩家戰力 -->
          <div style="text-align: center;">
            <div style="color: #4ecdc4; font-size: 18px; font-weight: bold; margin-bottom: 8px;">
              👤 玩家戰力
            </div>
            <div style="color: white; font-size: 24px; font-weight: bold; margin-bottom: 5px;">
              ${playerPower.display}
            </div>
            <div style="color: #ccc; font-size: 12px;">
              DPS: ${playerPower.dps} | EHP: ${playerPower.ehp}
            </div>
          </div>
          
          <!-- VS 與優勢指示 -->
          <div style="text-align: center;">
            <div style="font-size: 32px; margin-bottom: 10px;">⚔️</div>
            <div style="color: ${advantage.color}; font-weight: bold; font-size: 14px;">
              ${advantage.text}
            </div>
            <div style="color: #ccc; font-size: 12px; margin-top: 5px;">
              差距: ${advantage.difference}
            </div>
          </div>
          
          <!-- 敵人戰力 -->
          <div style="text-align: center;">
            <div style="color: #ff6b6b; font-size: 18px; font-weight: bold; margin-bottom: 8px;">
              👹 敵人戰力
            </div>
            <div style="color: white; font-size: 24px; font-weight: bold; margin-bottom: 5px;">
              ${enemyPower.display}
            </div>
            <div style="color: #ccc; font-size: 12px;">
              DPS: ${enemyPower.dps} | EHP: ${enemyPower.ehp}
            </div>
          </div>
        </div>
        
        <!-- 戰力詳細說明 -->
        <div style="margin-top: 15px; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 8px;">
          <div style="color: #ffd700; font-size: 13px; font-weight: bold; margin-bottom: 5px;">
            💡 戰力計算說明
          </div>
          <div style="color: #ccc; font-size: 12px; line-height: 1.4;">
            戰力 = √(DPS × EHP) | DPS = 攻擊力 × 攻速 | EHP = 血量 ÷ (1 - 護甲減傷率)
          </div>
        </div>
      </div>
    `;
  }
  
  // 📊 詳細數據面板模板
  static getDetailedStatsHTML(playerStats, enemyStats, battleStats, combatComparison) {
    return `
      <h2 style="text-align: center; color: #4ecdc4; margin-bottom: 20px;">
        ⏸️ 遊戲暫停 - 詳細數據面板
      </h2>
      
      <!-- 戰力對比 -->
      ${this.getCombatPowerComparisonHTML(combatComparison.playerPower, combatComparison.enemyPower, combatComparison.advantage)}
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 20px;">
        <!-- 玩家面板 -->
        <div style="background: rgba(78, 205, 196, 0.1); padding: 20px; border-radius: 15px; border-left: 4px solid #4ecdc4;">
          <h3 style="color: #4ecdc4; margin-bottom: 15px;">👤 玩家詳細數據</h3>
          
          <div style="margin-bottom: 15px;">
            <h4 style="color: #ffd700; margin-bottom: 8px;">⚡ 有效屬性</h4>
            <div style="font-size: 14px; line-height: 1.6;">
              <div>❤️ 血量: <span style="color: #ff6b6b; font-weight: bold;">${playerStats.effectiveStats.hp.toFixed(1)}/${playerStats.effectiveStats.maxHp}</span></div>
              <div>⚔️ 攻擊: <span style="color: #ffd700; font-weight: bold;">${playerStats.effectiveStats.attack}</span></div>
              <div>⚡ 攻速: <span style="color: #ff9800; font-weight: bold;">${playerStats.effectiveStats.attackSpeed.toFixed(2)}</span></div>
              <div>🛡️ 護甲: <span style="color: #4ecdc4; font-weight: bold;">${playerStats.effectiveStats.armor}</span></div>
              <div>🔰 固減: <span style="color: #4ecdc4; font-weight: bold;">${playerStats.effectiveStats.flatReduction}</span></div>
              <div>💥 暴擊: <span style="color: #ff1744; font-weight: bold;">${(playerStats.effectiveStats.critChance * 100).toFixed(1)}%</span></div>
            </div>
          </div>
          
          <div style="margin-bottom: 15px;">
            <h4 style="color: #ffd700; margin-bottom: 8px;">📊 屬性分解</h4>
            <div style="font-size: 12px; opacity: 0.9;">
              <div>基礎攻擊: ${playerStats.baseStats.attack} → 加成: +${playerStats.bonusStats.attack} → 倍率: ×${playerStats.multipliers.attack.toFixed(2)} = ${playerStats.effectiveStats.attack}</div>
              <div>基礎血量: ${playerStats.baseStats.hp} → 加成: +${playerStats.bonusStats.hp} → 倍率: ×${playerStats.multipliers.hp.toFixed(2)} = ${playerStats.effectiveStats.maxHp}</div>
            </div>
          </div>
          
          <div>
            <h4 style="color: #ffd700; margin-bottom: 8px;">🔨 重錘BD狀態</h4>
            <div style="font-size: 13px;">
              ${Object.entries(playerStats.hammerEffects).map(([key, value]) => 
                value ? `<div style="color: #ff9800;">✅ ${this.getHammerEffectName(key)}</div>` : ''
              ).join('')}
            </div>
          </div>
        </div>
        
        <!-- 敵人面板 -->
        <div style="background: rgba(255, 107, 107, 0.1); padding: 20px; border-radius: 15px; border-left: 4px solid #ff6b6b;">
          <h3 style="color: #ff6b6b; margin-bottom: 15px;">👹 敵人詳細數據</h3>
          
          <div style="margin-bottom: 15px;">
            <h4 style="color: #ffd700; margin-bottom: 8px;">⚡ 當前屬性</h4>
            <div style="font-size: 14px; line-height: 1.6;">
              <div>❤️ 血量: <span style="color: #ff6b6b; font-weight: bold;">${enemyStats.hp.toFixed(1)}/${enemyStats.maxHp}</span></div>
              <div>⚔️ 攻擊: <span style="color: #ffd700; font-weight: bold;">${enemyStats.attack}</span></div>
              <div>⚡ 攻速: <span style="color: #ff9800; font-weight: bold;">${enemyStats.attackSpeed.toFixed(2)}</span></div>
              <div>🛡️ 防禦: <span style="color: #ff6b6b; font-weight: bold;">${enemyStats.defense}</span></div>
              <div>🏷️ 類型: <span style="color: white; font-weight: bold;">${enemyStats.emoji} ${enemyStats.name}</span></div>
            </div>
          </div>
          
          <!-- 🎯 新增：三參數模型顯示 -->
          ${enemyStats.balanceInfo ? this.getEnemyBalanceInfoHTML(enemyStats.balanceInfo) : ''}
          
          <div style="margin-bottom: 15px;">
            <h4 style="color: #ffd700; margin-bottom: 8px;">📈 威脅評估</h4>
            <div style="font-size: 13px;">
              <div>DPS: <span style="color: #ff9800; font-weight: bold;">${(enemyStats.attack * enemyStats.attackSpeed).toFixed(1)}</span></div>
              <div>血量池: <span style="color: #ff6b6b; font-weight: bold;">${((enemyStats.hp / enemyStats.maxHp) * 100).toFixed(1)}%</span></div>
              ${enemyStats.isStunned ? '<div style="color: #ff6b6b;">😵 當前被眩暈</div>' : ''}
            </div>
          </div>
        </div>
      </div>
      
      <!-- 戰鬥統計 -->
      ${this.getBattleStatsHTML(battleStats)}
      
      <div style="text-align: center;">
        <button onclick="document.getElementById('pauseButton').click()" style="
          padding: 15px 30px;
          background: #4ecdc4;
          color: white;
          border: none;
          border-radius: 25px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        " onmouseover="this.style.background='#45b7b8'" onmouseout="this.style.background='#4ecdc4'">
          ▶️ 繼續戰鬥
        </button>
      </div>
    `;
  }
  
  // 🎯 敵人平衡信息模板（新增）
  static getEnemyBalanceInfoHTML(balanceInfo) {
    return `
      <div style="margin-bottom: 15px;">
        <h4 style="color: #ffd700; margin-bottom: 8px;">🎯 三參數模型</h4>
        <div style="font-size: 13px;">
          <div>血量倍率: <span style="color: #ff6b6b; font-weight: bold;">×${balanceInfo.hpMultiplier}</span></div>
          <div>攻速倍率: <span style="color: #ff9800; font-weight: bold;">×${balanceInfo.speedMultiplier}</span></div>
          <div>強度倍率: <span style="color: #ffd700; font-weight: bold;">×${balanceInfo.strengthMultiplier}</span></div>
          <div style="margin-top: 5px; padding-top: 5px; border-top: 1px solid rgba(255,255,255,0.2);">
            目標戰力: <span style="color: white; font-weight: bold;">${balanceInfo.targetCombatPower.toFixed(0)}</span><br>
            實際戰力: <span style="color: white; font-weight: bold;">${balanceInfo.actualCombatPower.toFixed(0)}</span><br>
            誤差: <span style="color: ${balanceInfo.error < 0.05 ? '#4CAF50' : balanceInfo.error < 0.1 ? '#ff9800' : '#ff6b6b'}; font-weight: bold;">${(balanceInfo.error * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>
    `;
  }
  
  // 📊 戰鬥統計模板
  static getBattleStatsHTML(battleStats) {
    return `
      <div style="background: rgba(255, 215, 0, 0.1); padding: 20px; border-radius: 15px; border-left: 4px solid #ffd700; margin-bottom: 20px;">
        <h3 style="color: #ffd700; margin-bottom: 15px;">📊 當前戰鬥統計</h3>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; font-size: 14px;">
          <div>⏱️ 戰鬥時長: <strong>${battleStats.battleDuration.toFixed(1)}秒</strong></div>
          <div>🗡️ 攻擊次數: <strong>${battleStats.playerAttackCount}</strong></div>
          <div>💥 暴擊次數: <strong>${battleStats.critCount} (${battleStats.critRate.toFixed(1)}%)</strong></div>
          <div>🔨 重錘次數: <strong>${battleStats.hammerProcCount} (${battleStats.hammerRate.toFixed(1)}%)</strong></div>
          <div>📈 平均DPS: <strong>${battleStats.actualDPS.toFixed(1)}</strong></div>
          <div>🛡️ 受擊次數: <strong>${battleStats.enemyAttackCount}</strong></div>
          <div>📉 平均受傷: <strong>${battleStats.avgDamageTaken.toFixed(1)}</strong></div>
          <div>⚡ 反甲觸發: <strong>${battleStats.reflectArmorTriggerCount}</strong></div>
        </div>
      </div>
    `;
  }
  
  // 🎮 速度控制UI模板
  static getSpeedControlHTML(currentSpeed, colors) {
    const speeds = { NORMAL: 1, FAST: 3, TURBO: 10 };
    
    return `
      <div style="margin-bottom: 5px;">⚡ 戰鬥速度</div>
      <button onclick="window.gameManager?.setBattleSpeed(${speeds.NORMAL})" style="margin-right: 5px; padding: 5px 8px; background: ${currentSpeed === speeds.NORMAL ? colors.SUCCESS : '#666'}; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">${speeds.NORMAL}x</button>
      <button onclick="window.gameManager?.setBattleSpeed(${speeds.FAST})" style="margin-right: 5px; padding: 5px 8px; background: ${currentSpeed === speeds.FAST ? colors.WARNING : '#666'}; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">${speeds.FAST}x</button>
      <button onclick="window.gameManager?.setBattleSpeed(${speeds.TURBO})" style="padding: 5px 8px; background: ${currentSpeed === speeds.TURBO ? '#E91E63' : '#666'}; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">${speeds.TURBO}x</button>
    `;
  }
  
  // 🏆 戰鬥結果模板
  static getBattleResultsHTML(battleStats, player) {
    const battleDuration = (Date.now() - battleStats.startTime) / 1000;
    const avgDamage = battleStats.playerAttackCount > 0 ? 
      (battleStats.playerTotalDamage / battleStats.playerAttackCount) : 0;
    const avgDamageTaken = battleStats.enemyAttackCount > 0 ? 
      (battleStats.playerDamageReceived / battleStats.enemyAttackCount) : 0;
    const critRate = battleStats.playerAttackCount > 0 ? 
      (battleStats.critCount / battleStats.playerAttackCount * 100) : 0;
    const hammerRate = battleStats.playerAttackCount > 0 ? 
      (battleStats.hammerProcCount / battleStats.playerAttackCount * 100) : 0;

    return `
      <h2 style="color: #4ecdc4; margin-bottom: 20px;">⚔️ 戰鬥總結</h2>
      <div style="text-align: left; margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 15px;">
        <div>⏱️ 戰鬥時長: <span style="color: #ffd700; font-weight: bold;">${battleDuration.toFixed(1)}秒</span></div>
        <div>❤️ 剩餘血量: <span style="color: #ff6b6b; font-weight: bold;">${player.hp.toFixed(1)}/${player.maxHp}</span></div>
        <div>🗡️ 攻擊次數: <span style="color: #ffd700; font-weight: bold;">${battleStats.playerAttackCount}</span></div>
        <div>📊 平均傷害: <span style="color: #ffd700; font-weight: bold;">${avgDamage.toFixed(1)}</span></div>
        <div>💥 暴擊率: <span style="color: #ff6b6b; font-weight: bold;">${critRate.toFixed(1)}%</span></div>
        <div>🔨 重錘率: <span style="color: #ff6b6b; font-weight: bold;">${hammerRate.toFixed(1)}%</span></div>
        <div>🛡️ 受擊次數: <span style="color: #ccc; font-weight: bold;">${battleStats.enemyAttackCount}</span></div>
        <div>📉 平均受傷: <span style="color: #ccc; font-weight: bold;">${avgDamageTaken.toFixed(1)}</span></div>
      </div>
      
      <div style="background: rgba(78, 205, 196, 0.1); padding: 15px; border-radius: 10px; margin-bottom: 20px; border-left: 3px solid #4ecdc4;">
        <div style="color: #4ecdc4; font-size: 14px; font-weight: bold; margin-bottom: 5px;">
          💡 操作提示
        </div>
        <div style="color: #ccc; font-size: 13px;">
          點擊畫面任意位置繼續下一關
        </div>
      </div>
    `;
  }
  
  // 🎨 購買成功動畫模板
  static getBadgePurchaseSuccessHTML(badge, remainingGold, rarityColor, rarityText) {
    return `
      <div style="
        background: linear-gradient(135deg, #2a2a40 0%, #1a1a2e 100%);
        border: 2px solid #4ecdc4;
        border-radius: 20px;
        padding: 40px;
        text-align: center;
        animation: pulse 0.5s ease-in-out;
      ">
        <div style="font-size: 60px; margin-bottom: 20px;">
          ${badge.icon}
        </div>
        <h2 style="color: #4ecdc4; margin-bottom: 10px;">
          購買成功！
        </h2>
        <h3 style="color: #ffd700; font-size: 20px; margin-bottom: 10px;">
          ${badge.name}
        </h3>
        <p style="color: #ccc; font-size: 16px; margin-bottom: 15px;">
          ${badge.description}
        </p>
        <div style="
          margin-bottom: 15px;
          padding: 8px 15px;
          background: ${rarityColor};
          color: white;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
          display: inline-block;
        ">
          ${rarityText} 徽章
        </div>
        <p style="color: #ffd700; font-size: 16px;">
          剩餘金幣: ${remainingGold} 💰
        </p>
      </div>
    `;
  }
  
  // 🔧 工具方法：重錘效果名稱
  static getHammerEffectName(key) {
    const names = {
      mastery: '重錘精通',
      storm: '重錘風暴', 
      shield: '重錘護盾',
      heal: '重錘恢復',
      fury: '重錘狂怒',
      weight: '重錘加重',
      duration: '重錘延續'
    };
    return names[key] || key;
  }
  
  // 🔧 工具方法：稀有度顏色
  static getRarityColor(rarity) {
    const colors = {
      'common': '#A0A0A0',
      'uncommon': '#4CAF50',
      'rare': '#2196F3',
      'epic': '#9C27B0',
      'legendary': '#FF9800'
    };
    return colors[rarity] || '#FFFFFF';
  }
  
  // 🔧 工具方法：稀有度文字
  static getRarityText(rarity) {
    const texts = {
      'common': '普通',
      'uncommon': '罕見',
      'rare': '稀有',
      'epic': '史詩',
      'legendary': '傳說'
    };
    return texts[rarity] || '未知';
  }
}

// 🎯 戰鬥UI管理器 - 簡化版
export class BattleUIManager {
  constructor(battleSystem) {
    this.battleSystem = battleSystem;
  }
  
  // 🖥️ 顯示詳細暫停面板
  showDetailedPanel() {
    this.removeExistingPanel();
    
    const panel = this.createModalPanel();
    const playerStats = this.battleSystem.player.getInfo();
    const enemyStats = this.battleSystem.enemy.getInfo();
    const battleStats = this.battleSystem.getCurrentStats();
    
    // 🎯 計算戰力對比
    const combatComparison = this.calculateCombatComparison();
    
    // 使用模板生成HTML
    panel.innerHTML = BattleUITemplates.getDetailedStatsHTML(
      playerStats, 
      enemyStats, 
      battleStats, 
      combatComparison
    );
    
    document.body.appendChild(panel);
  }
  
  // 🎮 創建速度控制UI
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
    
    const colors = { SUCCESS: '#4CAF50', WARNING: '#FF9800' };
    speedControl.innerHTML = BattleUITemplates.getSpeedControlHTML(
      this.battleSystem.battleSpeed, 
      colors
    );
    
    document.body.appendChild(speedControl);
    window.gameManager = this.battleSystem.gameManager;
  }
  
  // 🏆 顯示戰鬥結果
  showBattleResults(battleStats, player) {
    const resultsDiv = this.createModalPanel();
    resultsDiv.style.cursor = 'pointer';
    
    const contentDiv = document.createElement('div');
    contentDiv.style.cssText = `
      background: linear-gradient(135deg, #2a2a40 0%, #1a1a2e 100%);
      border: 2px solid #4ecdc4;
      border-radius: 20px;
      padding: 30px;
      color: white;
      min-width: 500px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
      cursor: default;
      position: relative;
    `;
    
    contentDiv.innerHTML = BattleUITemplates.getBattleResultsHTML(battleStats, player);
    
    resultsDiv.appendChild(contentDiv);
    
    // 點擊關閉事件
    resultsDiv.addEventListener('click', (e) => {
      if (e.target === resultsDiv || e.target === contentDiv) {
        resultsDiv.remove();
      }
    });
    
    contentDiv.addEventListener('click', (e) => {
      e.stopPropagation();
      if (e.target === contentDiv) {
        resultsDiv.remove();
      }
    });
    
    document.body.appendChild(resultsDiv);
  }
  
  // 🔧 工具方法
  createModalPanel() {
    const panel = document.createElement('div');
    panel.style.cssText = `
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
    return panel;
  }
  
  removeExistingPanel() {
    const existing = document.getElementById('detailedPanel');
    if (existing) existing.remove();
  }
  
  calculateCombatComparison() {
    const playerDPS = this.battleSystem.player.getEffectiveAttack() * this.battleSystem.player.getEffectiveAttackSpeed();
    const playerArmor = this.battleSystem.player.getEffectiveArmor();
    const playerEHP = this.battleSystem.player.maxHp / (1 - playerArmor / (playerArmor + 100));
    const playerPower = Math.sqrt(playerDPS * playerEHP);
    
    const enemyDPS = this.battleSystem.enemy.attack * this.battleSystem.enemy.attackSpeed;
    const enemyEHP = this.battleSystem.enemy.maxHp / (1 - this.battleSystem.enemy.armor / (this.battleSystem.enemy.armor + 100));
    const enemyPower = Math.sqrt(enemyDPS * enemyEHP);
    
    const ratio = playerPower / enemyPower;
    let advantage, color;
    
    if (ratio > 1.2) {
      advantage = { text: '玩家大幅領先', color: '#4CAF50', difference: `+${((ratio - 1) * 100).toFixed(0)}%` };
    } else if (ratio > 1.05) {
      advantage = { text: '玩家略勝', color: '#4ecdc4', difference: `+${((ratio - 1) * 100).toFixed(0)}%` };
    } else if (ratio > 0.95) {
      advantage = { text: '勢均力敵', color: '#ffd700', difference: '相近' };
    } else if (ratio > 0.8) {
      advantage = { text: '敵人略勝', color: '#FF9800', difference: `-${((1 - ratio) * 100).toFixed(0)}%` };
    } else {
      advantage = { text: '敵人大幅領先', color: '#ff6b6b', difference: `-${((1 - ratio) * 100).toFixed(0)}%` };
    }
    
    return {
      playerPower: {
        display: playerPower.toFixed(1),
        dps: playerDPS.toFixed(1),
        ehp: playerEHP.toFixed(0)
      },
      enemyPower: {
        display: enemyPower.toFixed(1),
        dps: enemyDPS.toFixed(1),
        ehp: enemyEHP.toFixed(0)
      },
      advantage: advantage
    };
  }
}

console.log('🎨 戰鬥UI模板分離完成');
console.log('📱 BattleSystem HTML部分已模組化');