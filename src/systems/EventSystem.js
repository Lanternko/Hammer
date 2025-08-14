// src/systems/EventSystem.js - 徽章可選擇
import { getRandomBadges } from '../data/badges.js';

class EventSystem {
  constructor(gameManager) {
    this.gameManager = gameManager;
    this.currentEvent = null;
  }

  generateShopEvent() {
    // 使用徽章系統生成三個選項
    const badges = getRandomBadges(3, this.gameManager.currentLevel);
    
    this.currentEvent = {
      type: 'shop',
      title: '🏪 神秘商店',
      description: '一位神秘商人出現了，他有一些有趣的物品... (三選一)',
      options: badges
    };
    
    this.showEventUI();
  }

  showEventUI() {
    this.createEventOverlay();
  }

  createEventOverlay() {
    // 移除舊的事件界面
    const existing = document.getElementById('eventOverlay');
    if (existing) existing.remove();

    // 創建事件遮罩
    const overlay = document.createElement('div');
    overlay.id = 'eventOverlay';
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

    // 創建事件面板
    const panel = document.createElement('div');
    panel.style.cssText = `
      background: linear-gradient(135deg, #2a2a40 0%, #1a1a2e 100%);
      border: 2px solid #4ecdc4;
      border-radius: 20px;
      padding: 30px;
      max-width: 800px;
      width: 90%;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    `;

    panel.innerHTML = `
      <h2 style="color: #4ecdc4; margin-bottom: 10px; font-size: 24px;">
        ${this.currentEvent.title}
      </h2>
      <p style="color: #ccc; margin-bottom: 30px; font-size: 16px;">
        ${this.currentEvent.description}
      </p>
      <p style="color: #ffd700; margin-bottom: 20px; font-size: 18px;">
        💰 金幣: ${this.gameManager.gold}
      </p>
      <div id="optionContainer" style="display: flex; gap: 20px; justify-content: center; margin-bottom: 20px;">
        ${this.renderOptions()}
      </div>
      <button id="skipBtn" style="
        padding: 10px 20px;
        background: #666;
        color: white;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-size: 16px;
        transition: background 0.3s ease;
      " 
      onmouseover="this.style.background='#888'" 
      onmouseout="this.style.background='#666'">跳過 (不購買任何徽章)</button>
    `;

    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    // 綁定事件
    this.bindEventHandlers();
  }

  renderOptions() {
    return this.currentEvent.options.map((option, index) => {
      const canAfford = this.gameManager.gold >= option.cost;
      
      return `
        <div class="shop-item" data-index="${index}" style="
          flex: 1;
          max-width: 250px;
          padding: 20px;
          background: ${canAfford ? 'rgba(78, 205, 196, 0.1)' : 'rgba(128, 128, 128, 0.1)'};
          border: 2px solid ${canAfford ? '#4ecdc4' : '#666'};
          border-radius: 12px;
          cursor: ${canAfford ? 'pointer' : 'not-allowed'};
          transition: all 0.3s ease;
          text-align: center;
          opacity: ${canAfford ? '1' : '0.6'};
        ">
          <div style="font-size: 40px; margin-bottom: 15px;">
            ${option.icon}
          </div>
          <div style="color: ${canAfford ? '#4ecdc4' : '#999'}; font-weight: bold; font-size: 18px; margin-bottom: 8px;">
            ${option.name}
          </div>
          <div style="color: #ccc; font-size: 14px; margin-bottom: 10px; line-height: 1.4;">
            ${option.description}
          </div>
          <div style="
            margin-bottom: 10px;
            padding: 5px 10px;
            background: ${this.getRarityColor(option.rarity)};
            color: white;
            border-radius: 15px;
            font-size: 12px;
            font-weight: bold;
          ">
            ${this.getRarityText(option.rarity)}
          </div>
          <div style="
            background: ${canAfford ? '#ffd700' : '#666'};
            color: ${canAfford ? '#000' : '#ccc'};
            padding: 10px 15px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 16px;
          ">
            ${option.cost} 💰
          </div>
          ${!canAfford ? '<div style="color: #ff6b6b; font-size: 12px; margin-top: 8px;">金幣不足</div>' : ''}
        </div>
      `;
    }).join('');
  }

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

  bindEventHandlers() {
    // 徽章購買
    document.querySelectorAll('.shop-item').forEach((item, index) => {
      const option = this.currentEvent.options[index];
      const canAfford = this.gameManager.gold >= option.cost;
      
      if (canAfford) {
        item.addEventListener('click', () => {
          this.buyBadge(option);
        });

        item.addEventListener('mouseenter', () => {
          item.style.transform = 'scale(1.05)';
          item.style.boxShadow = '0 8px 25px rgba(78, 205, 196, 0.4)';
        });

        item.addEventListener('mouseleave', () => {
          item.style.transform = 'scale(1)';
          item.style.boxShadow = 'none';
        });
      }
    });

    // 跳過按鈕
    document.getElementById('skipBtn').addEventListener('click', () => {
      this.closeEvent();
    });
  }

  buyBadge(badge) {
    if (this.gameManager.gold >= badge.cost) {
      this.gameManager.gold -= badge.cost;
      this.gameManager.player.equipBadge(badge);
      
      console.log(`購買徽章: ${badge.name}, 剩餘金幣: ${this.gameManager.gold}`);
      
      // 顯示購買成功動畫
      this.showPurchaseSuccess(badge);
      
      setTimeout(() => {
        this.closeEvent();
      }, 2000);
    }
  }

  showPurchaseSuccess(badge) {
    const overlay = document.getElementById('eventOverlay');
    overlay.innerHTML = `
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
          background: ${this.getRarityColor(badge.rarity)};
          color: white;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
          display: inline-block;
        ">
          ${this.getRarityText(badge.rarity)} 徽章
        </div>
        <p style="color: #ffd700; font-size: 16px;">
          剩餘金幣: ${this.gameManager.gold} 💰
        </p>
      </div>
    `;

    // 添加脈衝動畫
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(0.8); opacity: 0; }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    // 清理動畫樣式
    setTimeout(() => {
      if (style.parentNode) {
        style.remove();
      }
    }, 2000);
  }

  closeEvent() {
    const overlay = document.getElementById('eventOverlay');
    if (overlay) overlay.remove();
    
    this.gameManager.finishEvent();
  }
}

export default EventSystem;