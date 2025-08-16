// src/ui/OverlayManager.js - 覆蓋層管理模組
class OverlayManager {
  constructor(gameManager) {
    this.gameManager = gameManager;
  }

  // 🧹 清理所有覆蓋層
  clearAllOverlays() {
    const overlaySelectors = [
      '#deathSummaryOverlay',
      '#levelUpOverlay', 
      '#eventOverlay',
      '#pauseOverlay',
      '[class*="overlay"]',
      '[class*="screen"]'
    ];

    overlaySelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (element.parentNode) {
          element.remove();
        }
      });
    });

    this.clearFloatingElements();
  }

  clearFloatingElements() {
    const floatingSelectors = [
      '.damage-indicator',
      '.floating-damage',
      '.inheritance-badge',
      '[class*="notification"]',
      '[class*="popup"]'
    ];

    floatingSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (element.parentNode) {
          element.remove();
        }
      });
    });
  }

  // ⚔️ 戰鬥結果覆蓋層
  showBattleResults(battleStats, player, displayTime = 0) {
    const resultsDiv = document.createElement('div');
    resultsDiv.className = 'battle-results-overlay';
    resultsDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(15px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1500;
      cursor: pointer;
    `;

    const contentPanel = document.createElement('div');
    contentPanel.className = 'content-panel';
    contentPanel.style.cssText = `
      background: linear-gradient(135deg, #2a2a40 0%, #1a1a2e 100%);
      border: 2px solid #4ecdc4;
      border-radius: 20px;
      padding: 30px;
      color: white;
      min-width: 500px;
      max-width: 600px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
      pointer-events: none;
    `;

    const battleDuration = (Date.now() - battleStats.startTime) / 1000;
    const avgDamage = battleStats.playerAttackCount > 0 ? 
      (battleStats.playerTotalDamage / battleStats.playerAttackCount) : 0;
    const critRate = battleStats.playerAttackCount > 0 ? 
      (battleStats.critCount / battleStats.playerAttackCount * 100) : 0;
    const hammerRate = battleStats.playerAttackCount > 0 ? 
      (battleStats.hammerProcCount / battleStats.playerAttackCount * 100) : 0;

    contentPanel.innerHTML = `
      <h2 style="color: #4ecdc4; margin-bottom: 20px; font-size: 24px;">⚔️ 戰鬥總結</h2>
      <div style="text-align: left; margin-bottom: 25px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 15px;">
        <div>⏱️ 戰鬥時長: <span style="color: #ffd700; font-weight: bold;">${battleDuration.toFixed(1)}秒</span></div>
        <div>❤️ 剩餘血量: <span style="color: #4ecdc4; font-weight: bold;">${Math.round(player.hp)}/${player.maxHp}</span></div>
        <div>🗡️ 攻擊次數: <span style="color: #ffd700; font-weight: bold;">${battleStats.playerAttackCount}</span></div>
        <div>📊 平均傷害: <span style="color: #ffd700; font-weight: bold;">${avgDamage.toFixed(1)}</span></div>
        <div>💥 暴擊率: <span style="color: #ff6b6b; font-weight: bold;">${critRate.toFixed(1)}%</span></div>
        <div>🔨 重錘率: <span style="color: #ff6b6b; font-weight: bold;">${hammerRate.toFixed(1)}%</span></div>
      </div>
      <div class="click-hint" style="
        background: linear-gradient(135deg, rgba(78, 205, 196, 0.2), rgba(68, 160, 141, 0.2));
        border: 1px solid rgba(78, 205, 196, 0.4);
        padding: 15px 25px;
        border-radius: 15px;
        margin-bottom: 0;
      ">
        <p style="color: #4ecdc4; font-size: 16px; font-weight: bold; margin: 0;">
          💡 點擊螢幕任意位置繼續
        </p>
      </div>
    `;

    resultsDiv.appendChild(contentPanel);

    resultsDiv.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      resultsDiv.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => {
        if (resultsDiv.parentNode) {
          resultsDiv.remove();
        }
      }, 300);
    }, true);

    document.body.appendChild(resultsDiv);
  }

  // 🎯 遊戲結束畫面
  showGameOverScreen(currentLevel, player, diamonds) {
    const gameOverDiv = document.createElement('div');
    gameOverDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000;
    `;

    const isVictory = currentLevel > 20;
    const badgeCount = player.badges.length;
    
    gameOverDiv.innerHTML = `
      <div style="
        background: linear-gradient(135deg, ${isVictory ? '#2ECC71, #27AE60' : '#E74C3C, #C0392B'});
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        color: white;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
      ">
        <div style="font-size: 48px; margin-bottom: 20px;">
          ${isVictory ? '🏆' : '💀'}
        </div>
        <h2 style="font-size: 32px; margin-bottom: 15px;">
          ${isVictory ? '重錘之王！' : '征程結束'}
        </h2>
        <p style="font-size: 20px; margin-bottom: 20px;">
          ${isVictory ? '你用重錘征服了所有敵人！' : `你在第 ${currentLevel} 關倒下了`}
        </p>
        <div style="font-size: 16px; opacity: 0.9; margin-bottom: 20px;">
          <p>💎 鑽石: ${diamonds}</p>
          <p>🎖️ 徽章: ${badgeCount}</p>
          <p>💰 金幣: ${this.gameManager.gold}</p>
        </div>
        <p style="font-size: 14px; margin-top: 20px; opacity: 0.7;">
          遊戲將在幾秒後重新開始...
        </p>
      </div>
    `;

    document.body.appendChild(gameOverDiv);

    setTimeout(() => {
      if (gameOverDiv.parentNode) {
        gameOverDiv.remove();
      }
    }, 7500);
  }

  // 🎁 里程碑徽章展示
  showMilestoneBadgeChoice(badge, gameManager) {
    const badgeDiv = document.createElement('div');
    badgeDiv.style.cssText = `
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
      z-index: 2000;
    `;

    badgeDiv.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #FFD700, #FFA500);
        color: white;
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        box-shadow: 0 20px 40px rgba(255, 215, 0, 0.4);
        animation: badgePulse 0.6s ease-out;
        max-width: 500px;
        width: 90%;
      ">
        <div style="font-size: 48px; margin-bottom: 15px;">
          ${badge.icon}
        </div>
        <h2 style="font-size: 24px; margin-bottom: 10px;">
          🎉 里程碑獎勵！
        </h2>
        <h3 style="font-size: 20px; margin-bottom: 15px;">
          ${badge.name}
        </h3>
        <p style="font-size: 16px; opacity: 0.9; margin-bottom: 20px; line-height: 1.4;">
          ${badge.description}
        </p>
        <div style="
          margin-bottom: 20px;
          padding: 8px 15px;
          background: ${this.getRarityColor(badge.rarity)};
          color: white;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
          display: inline-block;
        ">
          ${this.getRarityText(badge.rarity)} 徽章
        </div>
        <button onclick="this.parentElement.parentElement.remove(); window.gameManager.acceptMilestoneBadge()" style="
          background: #4CAF50;
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 18px;
          font-weight: bold;
          transition: background 0.3s ease;
        " 
        onmouseover="this.style.background='#45a049'" 
        onmouseout="this.style.background='#4CAF50'">✅ 獲得徽章</button>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes badgePulse {
        0% { transform: scale(0.5); opacity: 0; }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(badgeDiv);

    setTimeout(() => {
      if (style.parentNode) {
        style.remove();
      }
    }, 1000);
  }

  // 🔧 工具方法
  getRarityColor(rarity) {
    switch(rarity) {
      case 'common': return '#A0A0A0';
      case 'uncommon': return '#4CAF50';
      case 'rare': return '#2196F3';
      case 'epic': return '#9C27B0';
      case 'legendary': return '#FF9800';
      default: return '#FFFFFF';
    }
  }

  getRarityText(rarity) {
    switch(rarity) {
      case 'common': return '普通';
      case 'uncommon': return '罕見';
      case 'rare': return '稀有';
      case 'epic': return '史詩';
      case 'legendary': return '傳說';
      default: return '';
    }
  }
}

export default OverlayManager;