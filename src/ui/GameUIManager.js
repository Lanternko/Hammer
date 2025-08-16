// src/ui/GameUIManager.js - UI 管理模組
class GameUIManager {
  constructor(gameManager) {
    this.gameManager = gameManager;
    this.lastUIUpdate = 0;
    this.uiUpdateInterval = 200; // 200ms更新一次，減少閃爍
    
    this.createBuffDisplayArea();
    this.createHoverTooltips();
  }

  // 🎨 創建 Buff 顯示區域
  createBuffDisplayArea() {
    const buffPanel = document.createElement('div');
    buffPanel.id = 'buffPanel';
    buffPanel.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 15px;
      padding: 15px;
      color: white;
      min-width: 250px;
      max-height: 300px;
      overflow-y: auto;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      z-index: 150;
    `;

    buffPanel.innerHTML = `
      <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #4ecdc4; border-bottom: 1px solid rgba(78, 205, 196, 0.3); padding-bottom: 5px;">
        🔥 當前效果
      </div>
      <div id="buffList"></div>
    `;

    document.body.appendChild(buffPanel);
  }

  // 🔧 創建懸浮提示
  createHoverTooltips() {
    setTimeout(() => {
      if (document.querySelector('[data-tooltip-created="true"]')) {
        return;
      }

      const statsPanel = document.querySelector('.stats-panel');
      if (statsPanel) {
        const statRows = statsPanel.querySelectorAll('.stat-row');
        
        statRows.forEach(row => {
          const label = row.querySelector('.stat-label');
          if (label && label.textContent.includes('Defense')) {
            label.setAttribute('data-tooltip-created', 'true');
            
            if (!label.querySelector('.help-icon')) {
              this.addDefenseTooltip(label);
            }
          }
        });
      }
    }, 3000);
  }

  addDefenseTooltip(label) {
    const helpIcon = document.createElement('span');
    helpIcon.className = 'help-icon';
    helpIcon.innerHTML = ' ❓';
    helpIcon.style.cssText = `
      cursor: help;
      margin-left: 5px;
      font-size: 14px;
      opacity: 0.9;
      position: relative;
      color: #4ecdc4;
    `;
    
    const tooltip = document.createElement('div');
    tooltip.style.cssText = `
      position: absolute;
      bottom: 25px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.95);
      color: white;
      padding: 15px;
      border-radius: 10px;
      font-size: 13px;
      line-height: 1.5;
      width: 250px;
      z-index: 1000;
      border: 2px solid #4ecdc4;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.8);
      display: none;
      backdrop-filter: blur(10px);
    `;
    
    tooltip.innerHTML = `
      <div style="text-align: center; margin-bottom: 10px;">
        <strong style="color: #4ecdc4; font-size: 14px;">🛡️ 護甲減傷機制</strong>
      </div>
      <div style="margin-bottom: 8px;">
        <strong style="color: #ffd700;">計算公式：</strong><br>
        減傷% = 護甲 ÷ (護甲 + 100)
      </div>
      <div style="margin-bottom: 8px;">
        <strong style="color: #ffd700;">舉例說明：</strong><br>
        • 50護甲 = 33.3%減傷<br>
        • 100護甲 = 50%減傷<br>
        • 200護甲 = 66.7%減傷
      </div>
      <div style="background: rgba(78, 205, 196, 0.2); padding: 8px; border-radius: 6px; margin-top: 10px;">
        <strong style="color: #4ecdc4;">傷害計算順序：</strong><br>
        原始傷害 → 護甲減傷 → 固定減傷 → 最終傷害
      </div>
    `;
    
    helpIcon.appendChild(tooltip);
    label.appendChild(helpIcon);
    
    helpIcon.addEventListener('mouseenter', () => {
      tooltip.style.display = 'block';
    });
    
    helpIcon.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });
  }

  // 📊 更新主要UI
  updateUI() {
    const now = Date.now();
    if (now - this.lastUIUpdate < this.uiUpdateInterval) {
      return;
    }
    this.lastUIUpdate = now;

    const roundCounter = document.querySelector('.round-counter');
    if (roundCounter) {
      roundCounter.textContent = `Round ${this.gameManager.currentLevel} / 20`;
    }

    this.updatePlayerStats(this.gameManager.player);
  }

  // 👤 更新玩家統計
  updatePlayerStats(player) {
    if (!player) return;

    // 更新英雄名稱
    const heroName = document.querySelector('.hero .character-name');
    if (heroName) {
      heroName.textContent = `🔨 重錘英雄 (${Math.round(player.hp)}/${player.maxHp})`;
    }

    // 確保固定減傷行存在
    this.ensureFlatReductionRow(player);

    // 更新統計數值
    const stats = document.querySelectorAll('.stat-value');
    if (stats.length >= 4) {
      stats[0].textContent = player.getEffectiveAttack().toFixed(1);
      stats[1].textContent = player.getEffectiveAttackSpeed().toFixed(2);
      stats[2].textContent = player.getEffectiveArmor().toFixed(1);
      stats[3].textContent = (player.critChance * 100).toFixed(0) + '%';
      
      if (stats[4]) {
        stats[4].textContent = player.flatReduction.toString();
      }
    }

    // 更新血量條
    this.updateHealthBar(player);
    
    // 更新 Buff 顯示
    this.updateBuffDisplay(player);
  }

  ensureFlatReductionRow(player) {
    const statsPanel = document.querySelector('.stats-panel');
    if (statsPanel) {
      const statRows = statsPanel.querySelectorAll('.stat-row');
      const hasFixedReduction = Array.from(statRows).some(row => 
        row.querySelector('.stat-label')?.textContent?.includes('固定減傷')
      );
      
      if (!hasFixedReduction && statRows.length >= 4) {
        const newRow = document.createElement('div');
        newRow.className = 'stat-row';
        newRow.innerHTML = `
          <div class="stat-label">
            <span>🔰</span>
            固定減傷
          </div>
          <div class="stat-value">${player.flatReduction}</div>
        `;
        statsPanel.appendChild(newRow);
      }
    }
  }

  updateHealthBar(player) {
    const heroHealthFill = document.querySelector('.hero .health-fill');
    const heroHealthText = document.querySelector('.hero .health-text');
    if (heroHealthFill && heroHealthText) {
      const hpPercent = Math.max(0, (player.hp / player.maxHp) * 100);
      heroHealthFill.style.width = `${hpPercent}%`;
      heroHealthText.textContent = `${Math.round(player.hp)} / ${player.maxHp}`;
    }
  }

  // 👹 更新敵人顯示
  updateEnemyDisplay(enemy) {
    if (!enemy) return;

    const enemyName = document.querySelector('.enemy .character-name');
    if (enemyName) {
      enemyName.textContent = `${enemy.emoji} ${enemy.getTypeName()} 攻擊${enemy.attack}`;
    }

    const enemyHealthText = document.querySelector('.enemy .health-text');
    if (enemyHealthText) {
      enemyHealthText.textContent = `${enemy.hp} / ${enemy.maxHp}`;
    }

    const enemyHealthFill = document.querySelector('.enemy .health-fill');
    if (enemyHealthFill) {
      enemyHealthFill.style.width = '100%';
    }

    const enemyAttackFill = document.querySelector('.enemy .attack-fill');
    if (enemyAttackFill) {
      enemyAttackFill.style.width = '0%';
    }
  }

  // 🔥 更新 Buff 顯示
  updateBuffDisplay(player) {
    const buffList = document.getElementById('buffList');
    if (!buffList) return;

    const buffs = [];
    
    // 重錘系列效果
    if (player.hammerEffects.mastery) buffs.push('🔨 重錘精通 (25%觸發，150%傷害，眩暈1秒)');
    if (player.hammerEffects.storm) buffs.push('🌪️ 重錘風暴 (重錘觸發時下次必暴擊)');
    if (player.hammerEffects.shield) buffs.push('🛡️ 重錘護盾 (重錘觸發時+10護甲5秒)');
    if (player.hammerEffects.heal) buffs.push('💚 重錘恢復 (重錘觸發時+15血量)');
    if (player.hammerEffects.fury) buffs.push('🔥 重錘狂怒 (重錘觸發時+50%攻速3秒)');
    if (player.hammerEffects.weight) buffs.push('⚡ 重錘加重 (觸發率35%，傷害170%)');
    if (player.hammerEffects.duration) buffs.push('⏱️ 重錘延續 (眩暈時間2秒)');
    
    // 特殊效果
    if (player.hasReflectArmor) buffs.push('⚡ 反甲護盾 (每受傷5次反彈5%敵人血量)');
    
    // 臨時狀態
    const statusInfo = player.getStatusInfo();
    buffs.push(...statusInfo);
    
    // 其他徽章
    player.badges.forEach(badge => {
      if (!badge.key || !badge.key.includes('hammer')) {
        buffs.push(`${badge.icon} ${badge.name}`);
      }
    });

    buffList.innerHTML = buffs.length > 0 
      ? buffs.map(buff => `<div style="margin-bottom: 5px; font-size: 13px; padding: 3px 0;">${buff}</div>`).join('')
      : '<div style="opacity: 0.6; font-size: 13px;">暫無效果</div>';
  }

  // 🔄 重置基礎UI
  resetBaseUI() {
    const roundCounter = document.querySelector('.round-counter');
    if (roundCounter) {
      roundCounter.textContent = 'Round 1 / 20';
    }

    const heroHealthFill = document.querySelector('.hero .health-fill');
    const heroHealthText = document.querySelector('.hero .health-text');
    if (heroHealthFill && heroHealthText) {
      heroHealthFill.style.width = '100%';
      heroHealthText.textContent = '100 / 100';
    }

    const heroAttackFill = document.querySelector('.hero .attack-fill');
    if (heroAttackFill) {
      heroAttackFill.style.width = '0%';
    }

    const enemyName = document.querySelector('.enemy .character-name');
    if (enemyName) {
      enemyName.textContent = '👹 Loading...';
    }

    const enemyHealthFill = document.querySelector('.enemy .health-fill');
    const enemyHealthText = document.querySelector('.enemy .health-text');
    if (enemyHealthFill && enemyHealthText) {
      enemyHealthFill.style.width = '100%';
      enemyHealthText.textContent = '--- / ---';
    }

    const enemyAttackFill = document.querySelector('.enemy .attack-fill');
    if (enemyAttackFill) {
      enemyAttackFill.style.width = '0%';
    }
  }
}

export default GameUIManager;