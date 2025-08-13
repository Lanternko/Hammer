// 徽章數據
// src/data/badges.js
export const BadgeData = {
  armorBoost: {
    name: '護甲強化',
    description: '防禦力+10',
    effect: { armor: 10 },
    cost: 5,
    rarity: 'common',
    icon: '🛡️'
  },
  
  healthBoost: {
    name: '生命強化', 
    description: '最大生命值+20',
    effect: { maxHp: 20 },
    cost: 6,
    rarity: 'common',
    icon: '❤️'
  },
  
  speedBoost: {
    name: '攻速提升',
    description: '攻擊速度+0.2',
    effect: { attackSpeed: 0.2 },
    cost: 8,
    rarity: 'uncommon',
    icon: '⚡'
  },
  
  powerBoost: {
    name: '力量提升',
    description: '攻擊力+5',
    effect: { attack: 5 },
    cost: 7,
    rarity: 'common',
    icon: '⚔️'
  },
  
  critBoost: {
    name: '暴擊精通',
    description: '暴擊率+10%',
    effect: { critChance: 0.1 },
    cost: 10,
    rarity: 'rare',
    icon: '💥'
  },
  
  vampiric: {
    name: '吸血',
    description: '攻擊時回復5點生命值',
    effect: { lifesteal: 5 },
    cost: 12,
    rarity: 'rare',
    icon: '🩸'
  }
};

export function getRandomBadges(count = 3) {
  const badges = Object.keys(BadgeData);
  const selected = [];
  
  for (let i = 0; i < count && badges.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * badges.length);
    const badgeKey = badges.splice(randomIndex, 1)[0];
    selected.push({
      key: badgeKey,
      ...BadgeData[badgeKey]
    });
  }
  
  return selected;
}

// ========================

// 事件系統
// src/systems/EventSystem.js
import { getRandomBadges } from '../data/badges.js';

class EventSystem {
  constructor(gameManager) {
    this.gameManager = gameManager;
    this.currentEvent = null;
  }

  generateShopEvent() {
    const badges = getRandomBadges(3);
    
    this.currentEvent = {
      type: 'shop',
      title: '🏪 神秘商店',
      description: '一位神秘商人出現了，他有一些有趣的物品...',
      options: badges.map(badge => ({
        ...badge,
        type: 'badge'
      }))
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
      max-width: 600px;
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
      <div id="optionContainer" style="display: flex; flex-direction: column; gap: 15px;">
        ${this.renderOptions()}
      </div>
      <button id="skipBtn" style="
        margin-top: 20px;
        padding: 10px 20px;
        background: #666;
        color: white;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-size: 16px;
      ">跳過</button>
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
          display: flex;
          align-items: center;
          padding: 15px;
          background: ${canAfford ? 'rgba(78, 205, 196, 0.1)' : 'rgba(128, 128, 128, 0.1)'};
          border: 2px solid ${canAfford ? '#4ecdc4' : '#666'};
          border-radius: 12px;
          cursor: ${canAfford ? 'pointer' : 'not-allowed'};
          transition: all 0.3s ease;
        ">
          <div style="font-size: 30px; margin-right: 15px;">
            ${option.icon}
          </div>
          <div style="flex: 1; text-align: left;">
            <div style="color: ${canAfford ? '#4ecdc4' : '#999'}; font-weight: bold; font-size: 18px;">
              ${option.name}
            </div>
            <div style="color: #ccc; font-size: 14px; margin-top: 5px;">
              ${option.description}
            </div>
          </div>
          <div style="
            background: ${canAfford ? '#ffd700' : '#666'};
            color: ${canAfford ? '#000' : '#ccc'};
            padding: 8px 15px;
            border-radius: 20px;
            font-weight: bold;
          ">
            ${option.cost} 💰
          </div>
        </div>
      `;
    }).join('');
  }

  bindEventHandlers() {
    // 徽章購買
    document.querySelectorAll('.shop-item').forEach((item, index) => {
      item.addEventListener('click', () => {
        const option = this.currentEvent.options[index];
        if (this.gameManager.gold >= option.cost) {
          this.buyBadge(option);
        }
      });

      item.addEventListener('mouseenter', () => {
        if (this.gameManager.gold >= this.currentEvent.options[index].cost) {
          item.style.transform = 'scale(1.02)';
          item.style.boxShadow = '0 5px 15px rgba(78, 205, 196, 0.3)';
        }
      });

      item.addEventListener('mouseleave', () => {
        item.style.transform = 'scale(1)';
        item.style.boxShadow = 'none';
      });
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
      }, 1500);
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
        <p style="color: #ffd700; font-size: 18px;">
          獲得徽章: ${badge.name}
        </p>
        <p style="color: #ccc; font-size: 14px;">
          ${badge.description}
        </p>
      </div>
    `;
  }

  closeEvent() {
    const overlay = document.getElementById('eventOverlay');
    if (overlay) overlay.remove();
    
    this.gameManager.finishEvent();
  }
}

export default EventSystem;

// ========================

// 更新後的 GameManager.js (只顯示修改的部分)
// 在 GameManager 類別中添加:

import EventSystem from '../systems/EventSystem.js';

// 在 constructor 中添加:
this.eventSystem = new EventSystem(this);

// 修改 triggerEvent 方法:
triggerEvent() {
  console.log(`觸發事件關卡 ${this.currentLevel}`);
  this.state = 'shop';
  this.eventSystem.generateShopEvent();
}

// 添加 finishEvent 方法:
finishEvent() {
  this.state = 'battle';
  setTimeout(() => {
    this.currentLevel++;
    this.nextLevel();
  }, 1000);
}