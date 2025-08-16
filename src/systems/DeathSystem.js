// src/systems/DeathSystem.js - 死亡和繼承系統
class DeathSystem {
  constructor(gameManager) {
    this.gameManager = gameManager;
    this.inheritedBadges = [];
    this.maxInheritedBadges = 1;
    this.failureCount = 0;
  }

  // 🎁 處理繼承徽章
  handleInheritedBadges(player) {
    try {
      if (this.inheritedBadges && this.inheritedBadges.length > 0) {
        this.inheritedBadges.forEach(badge => {
          if (badge && player && player.equipBadge) {
            player.equipBadge(badge);
            console.log(`🎁 繼承徽章: ${badge.name}`);
            this.showInheritanceNotification(badge);
          }
        });
        
        this.inheritedBadges = [];
      }
    } catch (error) {
      console.error('❌ 處理繼承徽章錯誤:', error);
    }
  }

  // 💀 顯示死亡總結
  showDeathSummary(player, currentLevel, battleStats) {
    this.gameManager.overlayManager.clearAllOverlays();

    const deathDiv = document.createElement('div');
    deathDiv.id = 'deathSummaryOverlay';
    deathDiv.className = 'death-screen';
    deathDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000;
    `;

    const inheritableBadges = player.badges.filter(badge => 
      badge.key !== 'hammerMastery' && badge.cost > 0
    );

    const hasInheritableBadges = inheritableBadges.length > 0;
    
    const contentPanel = document.createElement('div');
    contentPanel.style.cssText = `
      background: linear-gradient(135deg, #8B0000, #4B0000);
      padding: 40px;
      border-radius: 20px;
      text-align: center;
      color: white;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
      border: 2px solid #ff6b6b;
      max-width: 800px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
    `;

    contentPanel.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 20px;">💀</div>
      <h2 style="font-size: 32px; margin-bottom: 15px; color: #ff6b6b;">征程結束</h2>
      <p style="font-size: 20px; margin-bottom: 20px;">你在第 ${currentLevel} 關倒下了</p>
      
      <div style="background: rgba(0, 0, 0, 0.5); padding: 15px; border-radius: 15px; margin-bottom: 20px;">
        <h4 style="color: #ffd700; margin-bottom: 10px;">🎯 戰敗分析</h4>
        <div style="font-size: 14px; line-height: 1.6; text-align: left;">
          ${this.getDeathAnalysis(player, currentLevel)}
        </div>
      </div>
      
      ${hasInheritableBadges ? `
        <div style="background: rgba(255, 215, 0, 0.1); border: 1px solid rgba(255, 215, 0, 0.3); border-radius: 15px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #ffd700; margin-bottom: 15px;">🎁 選擇一個徽章帶到下一輪</h3>
          <p style="font-size: 14px; opacity: 0.9; margin-bottom: 15px;">失敗並不可怕，選擇一個徽章開始新的征程！</p>
          <div id="inheritanceBadges" style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
            ${this.renderInheritanceBadges(inheritableBadges)}
          </div>
        </div>
      ` : `
        <div style="background: rgba(255, 107, 107, 0.1); border: 1px solid rgba(255, 107, 107, 0.3); border-radius: 15px; padding: 15px; margin-bottom: 20px;">
          <p style="color: #ff6b6b; font-size: 16px; margin: 0;">
            💡 通過商店購買徽章，失敗時可以繼承到下一輪！
          </p>
        </div>
      `}
      
      <div style="font-size: 16px; opacity: 0.9; margin-bottom: 20px;">
        <p>💎 本輪獲得鑽石: ${Math.floor(currentLevel / 5)}</p>
        <p>🎖️ 擁有徽章: ${player.badges.length}</p>
        <p>💰 剩餘金幣: ${this.gameManager.gold}</p>
      </div>
      
      ${!hasInheritableBadges ? `
        <button onclick="window.gameManager.restartWithoutInheritance()" style="
          background: #ff6b6b;
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 18px;
          font-weight: bold;
          transition: background 0.3s ease;
        " 
        onmouseover="this.style.background='#ff5252'" 
        onmouseout="this.style.background='#ff6b6b'">
          🔄 重新開始
        </button>
      ` : ''}
    `;

    deathDiv.appendChild(contentPanel);
    document.body.appendChild(deathDiv);

    if (hasInheritableBadges) {
      this.bindInheritanceEvents(inheritableBadges, deathDiv);
    }
  }

  // 🎨 渲染繼承徽章選項
  renderInheritanceBadges(badges) {
    return badges.map((badge, index) => `
      <div class="inheritance-badge" data-index="${index}" style="
        flex: 0 0 auto;
        min-width: 200px;
        padding: 15px;
        background: rgba(255, 215, 0, 0.1);
        border: 2px solid rgba(255, 215, 0, 0.3);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: center;
      ">
        <div style="font-size: 24px; margin-bottom: 8px;">
          ${badge.icon}
        </div>
        <div style="color: #ffd700; font-weight: bold; font-size: 14px; margin-bottom: 5px;">
          ${badge.name}
        </div>
        <div style="color: #ccc; font-size: 12px; line-height: 1.3;">
          ${badge.description}
        </div>
        <div style="
          margin-top: 8px;
          padding: 4px 8px;
          background: ${this.getRarityColor(badge.rarity)};
          color: white;
          border-radius: 10px;
          font-size: 11px;
          font-weight: bold;
        ">
          ${this.getRarityText(badge.rarity)}
        </div>
      </div>
    `).join('');
  }

  // 🔗 綁定繼承事件
  bindInheritanceEvents(badges, deathDiv) {
    document.querySelectorAll('.inheritance-badge').forEach((element, index) => {
      element.addEventListener('click', () => {
        this.selectInheritanceBadge(badges[index], deathDiv);
      });

      element.addEventListener('mouseenter', () => {
        element.style.transform = 'scale(1.05)';
        element.style.borderColor = '#ffd700';
        element.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.4)';
      });

      element.addEventListener('mouseleave', () => {
        element.style.transform = 'scale(1)';
        element.style.borderColor = 'rgba(255, 215, 0, 0.3)';
        element.style.boxShadow = 'none';
      });
    });
  }

  // ✅ 選擇繼承徽章
  selectInheritanceBadge(badge, deathDiv) {
    this.inheritedBadges = [badge];
    
    deathDiv.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #2ECC71, #27AE60);
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        color: white;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
        animation: confirmPulse 0.6s ease-out;
      ">
        <div style="font-size: 48px; margin-bottom: 20px;">
          ${badge.icon}
        </div>
        <h2 style="font-size: 24px; margin-bottom: 15px;">
          ✅ 已選擇繼承
        </h2>
        <h3 style="font-size: 20px; margin-bottom: 15px; color: #ffd700;">
          ${badge.name}
        </h3>
        <p style="font-size: 16px; opacity: 0.9; margin-bottom: 20px;">
          下一輪將自動擁有此徽章！
        </p>
        <button onclick="window.gameManager.restartWithInheritance()" style="
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
        onmouseout="this.style.background='#4CAF50'">
          🚀 開始新征程
        </button>
      </div>
    `;

    this.addConfirmPulseAnimation();
  }

  addConfirmPulseAnimation() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes confirmPulse {
        0% { transform: scale(0.8); opacity: 0; }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
      if (style.parentNode) {
        style.remove();
      }
    }, 1000);
  }

  // 📊 死亡分析
  getDeathAnalysis(player, currentLevel) {
    const analyses = [];
    const enemy = this.gameManager.enemy;
    
    if (enemy) {
      const enemyDPS = enemy.attack * enemy.attackSpeed;
      const playerDPS = player.getEffectiveAttack() * player.getEffectiveAttackSpeed();
      
      if (enemyDPS > playerDPS * 1.5) {
        analyses.push('• 敵人的 DPS 遠超過你，考慮提升攻擊力或攻速');
      }
      
      if (player.getEffectiveArmor() < enemy.attack * 0.5) {
        analyses.push('• 護甲不足以抵擋敵人攻擊，建議提升防禦');
      }
      
      if (player.flatReduction < 5) {
        analyses.push('• 固定減傷偏低，考慮購買相關徽章');
      }
      
      if (!player.hammerEffects.mastery) {
        analyses.push('• 缺少重錘精通，這是核心徽章');
      } else if (!player.hammerEffects.weight) {
        analyses.push('• 考慮購買重錘加重來提升觸發率');
      }
      
      if (player.lifesteal === 0) {
        analyses.push('• 沒有生命汲取，考慮購買吸血徽章');
      }
      
      if (currentLevel > 10 && player.badges.length < 4) {
        analyses.push('• 徽章數量不足，多利用商店強化');
      }
    }
    
    if (analyses.length === 0) {
      analyses.push('• 這是一場勢均力敵的戰鬥，運氣也很重要');
      analyses.push('• 嘗試不同的徽章組合或提升屬性');
    }
    
    return analyses.join('<br>');
  }

  // 🔄 重新開始方法
  restartWithInheritance() {
    this.gameManager.overlayManager.clearAllOverlays();
    this.gameManager.resetGame();
  }

  restartWithoutInheritance() {
    this.inheritedBadges = [];
    this.gameManager.overlayManager.clearAllOverlays();
    this.gameManager.resetGame();
  }

  // 🎁 顯示繼承通知
  showInheritanceNotification(badge) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 50px;
      right: 50px;
      background: linear-gradient(135deg, #FFD700, #FFA500);
      color: white;
      padding: 20px;
      border-radius: 15px;
      box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
      z-index: 1000;
      animation: slideInRight 0.5s ease-out;
    `;

    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 15px;">
        <div style="font-size: 24px;">${badge.icon}</div>
        <div>
          <div style="font-weight: bold; margin-bottom: 5px;">🎁 繼承徽章</div>
          <div style="font-size: 14px;">${badge.name}</div>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.5s ease-out';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 500);
    }, 3000);

    this.addInheritanceAnimations();
  }

  addInheritanceAnimations() {
    if (!document.querySelector('#inheritanceAnimations')) {
      const style = document.createElement('style');
      style.id = 'inheritanceAnimations';
      style.textContent = `
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
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

export default DeathSystem;