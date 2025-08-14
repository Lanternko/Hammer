// src/game/GameManager.js - 護甲懸浮說明修復
import Player from './Player.js';
import Enemy from './Enemy.js';
import BattleSystem from '../systems/BattleSystem.js';
import EventSystem from '../systems/EventSystem.js';
import { selectEnemyType } from '../data/Enemies.js';
import { generateUpgradeOptions, applyUpgradeToPlayer } from '../data/upgradeRewards.js';

class GameManager {
  constructor() {
    console.log('🏗️ GameManager constructor called');
    
    this.currentLevel = 1;
    this.player = new Player();
    this.enemy = null;
    this.state = 'battle';
    this.gold = 0;
    this.diamonds = 0;
    this.battleSystem = null;
    this.eventSystem = new EventSystem(this);
    
    // 保存戰鬥速度設定
    this.battleSpeed = 1; // 預設1倍速
    
    // 創建增強的UI管理器
    this.enhancedUI = new EnhancedUIManager();
    
    // 給予開局徽章
    this.giveStartingBadge();
  }

  startGame() {
    console.log('🎮 遊戲啟動 - 準備第1關');
    this.updateUI();
    this.nextLevel();
  }

  nextLevel() {
    if (this.currentLevel > 20) {
      return this.endGame();
    }

    console.log(`🔄 進入關卡 ${this.currentLevel}`);

    // 檢查是否是事件關卡 (第3、8、13、18關)
    if ([3, 8, 13, 18].includes(this.currentLevel)) {
      this.triggerEvent();
      return;
    }

    // 使用新的敵人選擇系統
    const enemyType = selectEnemyType(this.currentLevel);
    this.enemy = new Enemy(this.currentLevel, enemyType);
    
    console.log(`⚔️ 關卡 ${this.currentLevel}: 遭遇 ${this.enemy.getDisplayName()}`);
    console.log(`📊 敵人屬性: HP ${this.enemy.hp}/${this.enemy.maxHp}, 攻擊 ${this.enemy.attack}, 攻速 ${this.enemy.attackSpeed}, 防禦 ${this.enemy.defense}`);
    
    this.updateUI();
    this.updateEnemyDisplay();
    
    // 停止舊的戰鬥系統
    if (this.battleSystem) {
      this.battleSystem.stop();
    }
    
    // 創建新的戰鬥系統並繼承速度設定
    this.battleSystem = new BattleSystem(this.player, this.enemy, this);
    this.battleSystem.setBattleSpeed(this.battleSpeed); // 繼承之前的速度設定
    this.battleSystem.start();
  }

  // 設定戰鬥速度的方法，供BattleSystem回調
  setBattleSpeed(speed) {
    this.battleSpeed = speed;
    if (this.battleSystem) {
      this.battleSystem.setBattleSpeed(speed);
    }
    console.log(`🎛️ 全局戰鬥速度設定為 ${speed}x`);
  }

  endBattle(won, battleStats = null) {
    console.log(`⚔️ 戰鬥結束 - ${won ? '✅ 勝利' : '❌ 失敗'}`);
    
    // 顯示戰鬥統計（延長顯示時間到8秒）
    if (battleStats && this.enhancedUI) {
      this.enhancedUI.showBattleResults(battleStats, this.player, 8000);
    }
    
    if (!won) {
      console.log('💀 玩家失敗，遊戲結束');
      return this.endGame();
    }

    // 獲得金幣獎勵
    let goldReward = 1;
    if (this.currentLevel === 20) {
      goldReward = 5;
    } else if (this.currentLevel % 5 === 0) {
      goldReward = 2;
    }
    
    this.gold += goldReward;
    console.log(`💰 關卡 ${this.currentLevel} 完成！獲得金幣: ${goldReward}，總金幣: ${this.gold}`);

    // 血量回滿
    this.player.hp = this.player.maxHp;
    console.log('💚 血量已回滿');

    // 延遲顯示升級選擇
    setTimeout(() => {
      this.showLevelUpChoice(goldReward);
    }, 3000);
  }

  showLevelUpChoice(goldReward) {
    // 使用新的升級獎勵系統
    const upgradeOptions = generateUpgradeOptions(this.currentLevel);
    
    // 創建升級選擇界面
    const upgradeDiv = document.createElement('div');
    upgradeDiv.id = 'levelUpOverlay';
    upgradeDiv.style.cssText = `
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

    upgradeDiv.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #2a2a40 0%, #1a1a2e 100%);
        border: 2px solid #4ecdc4;
        border-radius: 20px;
        padding: 30px;
        max-width: 800px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
      ">
        <h2 style="color: #4ecdc4; margin-bottom: 10px; font-size: 24px;">
          🎉 關卡 ${this.currentLevel} 完成！
        </h2>
        <p style="color: #ffd700; margin-bottom: 20px; font-size: 18px;">
          💰 +${goldReward} 金幣 | 💚 血量回滿
        </p>
        <h3 style="color: #fff; margin-bottom: 20px;">選擇一個升級獎勵（三選一）：</h3>
        <div style="display: flex; gap: 20px; justify-content: center; margin-bottom: 20px;">
          ${upgradeOptions.map((option, index) => `
            <div class="upgrade-option" data-index="${index}" style="
              flex: 1;
              max-width: 250px;
              padding: 20px;
              background: rgba(78, 205, 196, 0.1);
              border: 2px solid #4ecdc4;
              border-radius: 12px;
              cursor: pointer;
              transition: all 0.3s ease;
              text-align: center;
            ">
              <div style="font-size: 30px; margin-bottom: 15px;">
                ${option.icon}
              </div>
              <div style="color: #4ecdc4; font-weight: bold; font-size: 18px; margin-bottom: 5px;">
                ${option.name}
              </div>
              <div style="color: #ccc; font-size: 14px; line-height: 1.4; margin-bottom: 10px;">
                ${option.description}
              </div>
              <div style="color: #ffd700; font-size: 12px; font-weight: bold;">
                詳細效果：${this.getUpgradeEffectDescription(option)}
              </div>
              <div style="
                margin-top: 10px;
                padding: 5px 10px;
                background: ${this.getRarityColor(option.rarity)};
                color: white;
                border-radius: 15px;
                font-size: 12px;
                font-weight: bold;
              ">
                ${this.getRarityText(option.rarity)}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    document.body.appendChild(upgradeDiv);

    // 綁定點擊事件
    document.querySelectorAll('.upgrade-option').forEach((option, index) => {
      option.addEventListener('click', () => {
        applyUpgradeToPlayer(this.player, upgradeOptions[index]);
        upgradeDiv.remove();
        
        // 檢查是否該給徽章
        this.checkForBadgeReward();
        
        // 繼續下一關
        setTimeout(() => {
          this.currentLevel++;
          this.nextLevel();
        }, 1000);
      });

      option.addEventListener('mouseenter', () => {
        option.style.transform = 'scale(1.05)';
        option.style.boxShadow = '0 8px 25px rgba(78, 205, 196, 0.4)';
      });

      option.addEventListener('mouseleave', () => {
        option.style.transform = 'scale(1)';
        option.style.boxShadow = 'none';
      });
    });
  }

  // 修復：獲取升級效果詳細描述
  getUpgradeEffectDescription(upgrade) {
    const currentValue = this.getCurrentPlayerValue(upgrade.type);
    let newValue;
    
    if (upgrade.isPercentage) {
      newValue = Math.floor(currentValue * (1 + upgrade.value));
      return `${currentValue} → ${newValue} (+${(upgrade.value * 100).toFixed(1)}%)`;
    } else {
      newValue = currentValue + upgrade.value;
      return `${currentValue} → ${newValue} (+${upgrade.value})`;
    }
  }

  getCurrentPlayerValue(type) {
    switch(type) {
      case 'attack': return this.player.getEffectiveAttack();
      case 'maxHp': return this.player.maxHp;
      case 'armor': return this.player.getEffectiveArmor();
      case 'attackSpeed': return this.player.getEffectiveAttackSpeed();
      case 'critChance': return (this.player.critChance * 100).toFixed(1);
      case 'flatReduction': return this.player.flatReduction;
      default: return 0;
    }
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

  giveStartingBadge() {
    // 開局給重錘徽章
    const hammerBadge = {
      key: 'hammerMastery',
      name: '重錘精通',
      description: '每次攻擊有25%機率造成150%傷害並眩暈敵人1秒',
      icon: '🔨',
      effect: { hammerMastery: true },
      rarity: 'legendary'
    };
    
    this.player.equipBadge(hammerBadge);
    console.log('🔨 獲得開局徽章: 重錘精通');
  }

  checkForBadgeReward() {
    // 每5關給一個徽章 (第5, 10, 15, 20關)
    if (this.currentLevel % 5 === 0) {
      this.giveMilestoneBadge();
    }
  }

  giveMilestoneBadge() {
    const milestoneBadges = [
      {
        key: 'hammerStorm',
        name: '重錘風暴',
        description: '重錘精通觸發時，下次攻擊必定暴擊',
        icon: '🌪️',
        effect: { hammerStorm: true },
        rarity: 'legendary'
      },
      {
        key: 'hammerShield',
        name: '重錘護盾',
        description: '重錘精通觸發時，獲得10點護甲持續5秒',
        icon: '🛡️',
        effect: { hammerShield: true },
        rarity: 'epic'
      },
      {
        key: 'hammerHeal',
        name: '重錘恢復',
        description: '重錘精通觸發時，回復15點生命值',
        icon: '💚',
        effect: { hammerHeal: true },
        rarity: 'epic'
      },
      {
        key: 'hammerFury',
        name: '重錘狂怒',
        description: '重錘精通觸發時，攻擊速度+50%持續3秒',
        icon: '🔥',
        effect: { hammerFury: true },
        rarity: 'legendary'
      }
    ];

    const milestoneIndex = (this.currentLevel / 5) - 1;
    const badge = milestoneBadges[milestoneIndex] || milestoneBadges[0];
    
    this.player.equipBadge(badge);
    
    // 顯示徽章獲得動畫
    this.showBadgeReward(badge);
  }

  showBadgeReward(badge) {
    const badgeDiv = document.createElement('div');
    badgeDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #FFD700, #FFA500);
      color: white;
      padding: 30px;
      border-radius: 20px;
      text-align: center;
      z-index: 2000;
      box-shadow: 0 20px 40px rgba(255, 215, 0, 0.4);
      animation: badgePulse 0.6s ease-out;
    `;

    badgeDiv.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 15px;">
        ${badge.icon}
      </div>
      <h2 style="font-size: 24px; margin-bottom: 10px;">
        里程碑獎勵！
      </h2>
      <h3 style="font-size: 20px; margin-bottom: 10px;">
        ${badge.name}
      </h3>
      <p style="font-size: 16px; opacity: 0.9;">
        ${badge.description}
      </p>
    `;

    // 添加動畫
    const style = document.createElement('style');
    style.textContent = `
      @keyframes badgePulse {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.1); }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(badgeDiv);

    // 3秒後移除
    setTimeout(() => {
      if (badgeDiv.parentNode) {
        badgeDiv.remove();
      }
      if (style.parentNode) {
        style.remove();
      }
    }, 3000);

    console.log(`🎁 獲得里程碑徽章: ${badge.name}`);
  }

  triggerEvent() {
    console.log(`🏪 觸發事件關卡 ${this.currentLevel}`);
    this.state = 'shop';
    this.eventSystem.generateShopEvent();
  }

  finishEvent() {
    this.state = 'battle';
    
    // 商店關也要升級選擇
    this.showLevelUpChoice(0);
  }

  endGame() {
    const diamonds = Math.floor(this.currentLevel / 5) + (this.currentLevel >= 20 ? 5 : 0);
    console.log(`🎯 遊戲結束！到達關卡: ${this.currentLevel}, 獲得鑽石: ${diamonds}`);
    this.diamonds += diamonds;
    
    this.showGameOverScreen();
    
    // 5秒後重置遊戲
    setTimeout(() => {
      this.resetGame();
    }, 8000);
  }

  showGameOverScreen() {
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

    const isVictory = this.currentLevel > 20;
    const badgeCount = this.player.badges.length;
    
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
          ${isVictory ? '你用重錘征服了所有敵人！' : `你在第 ${this.currentLevel} 關倒下了`}
        </p>
        <div style="font-size: 16px; opacity: 0.9; margin-bottom: 20px;">
          <p>💎 鑽石: ${Math.floor(this.currentLevel / 5)}</p>
          <p>🎖️ 徽章: ${badgeCount}</p>
          <p>💰 金幣: ${this.gold}</p>
        </div>
        <p style="font-size: 14px; margin-top: 20px; opacity: 0.7;">
          遊戲將在幾秒後重新開始...
        </p>
      </div>
    `;

    document.body.appendChild(gameOverDiv);

    // 8秒後移除
    setTimeout(() => {
      if (gameOverDiv.parentNode) {
        gameOverDiv.remove();
      }
    }, 7500);
  }

  resetGame() {
    console.log('🔄 重新開始遊戲...');
    this.currentLevel = 1;
    this.player = new Player();
    this.enemy = null;
    this.state = 'battle';
    this.gold = 0;
    // 保持戰鬥速度設定不重置
    
    // 清理UI
    const existingOverlays = document.querySelectorAll('[id*="Overlay"], .damage-indicator, #speedControl');
    existingOverlays.forEach(overlay => overlay.remove());
    
    // 重新給開局徽章
    this.giveStartingBadge();
    
    this.startGame();
  }

  updateUI() {
    // 更新關卡顯示
    const roundCounter = document.querySelector('.round-counter');
    if (roundCounter) {
      roundCounter.textContent = `Round ${this.currentLevel} / 20`;
    }

    // 更新玩家資訊
    this.updatePlayerStats();
  }

  updateEnemyDisplay() {
    if (!this.enemy) return;

    // 更新敵人名稱（包含攻擊力）
    const enemyName = document.querySelector('.enemy .character-name');
    if (enemyName) {
      enemyName.textContent = `${this.enemy.emoji} ${this.enemy.getTypeName()} 攻擊${this.enemy.attack}`;
    }

    // 更新敵人血量顯示
    const enemyHealthText = document.querySelector('.enemy .health-text');
    if (enemyHealthText) {
      enemyHealthText.textContent = `${this.enemy.hp} / ${this.enemy.maxHp}`;
    }

    // 重置血條
    const enemyHealthFill = document.querySelector('.enemy .health-fill');
    if (enemyHealthFill) {
      enemyHealthFill.style.width = '100%';
    }

    // 重置攻擊進度條
    const enemyAttackFill = document.querySelector('.enemy .attack-fill');
    if (enemyAttackFill) {
      enemyAttackFill.style.width = '0%';
    }
  }

  updatePlayerStats() {
    // 更新角色名稱顯示血量
    const heroName = document.querySelector('.hero .character-name');
    if (heroName) {
      heroName.textContent = `🔨 重錘英雄 (${Math.round(this.player.hp)}/${this.player.maxHp})`;
    }

    // 更新統計面板 - 修復顯示問題
    const stats = document.querySelectorAll('.stat-value');
    if (stats.length >= 4) {
      stats[0].textContent = this.player.getEffectiveAttack().toFixed(1);
      stats[1].textContent = this.player.getEffectiveAttackSpeed().toFixed(2);
      stats[2].textContent = this.player.getEffectiveArmor().toFixed(1);
      stats[3].textContent = (this.player.critChance * 100).toFixed(0) + '%';
    }

    // 更新玩家血條
    const heroHealthFill = document.querySelector('.hero .health-fill');
    const heroHealthText = document.querySelector('.hero .health-text');
    if (heroHealthFill && heroHealthText) {
      const hpPercent = Math.max(0, (this.player.hp / this.player.maxHp) * 100);
      heroHealthFill.style.width = `${hpPercent}%`;
      heroHealthText.textContent = `${Math.round(this.player.hp)} / ${this.player.maxHp}`;
    }

    // 更新 Buff 显示
    if (this.enhancedUI) {
      this.enhancedUI.updateBuffDisplay(this.player);
    }
  }

  // 計算護甲減傷百分比
  calculateDamageReduction() {
    const armor = this.player.getEffectiveArmor();
    const reduction = armor / (armor + 100) * 100;
    return reduction.toFixed(1);
  }
}

// 增強的UI管理器類 - 修復護甲說明位置
class EnhancedUIManager {
  constructor() {
    this.createBuffDisplayArea();
    this.createHoverTooltips(); // 新增懸浮提示
  }

  createBuffDisplayArea() {
    // 在現有的統計面板旁邊創建Buff顯示區域
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
      z-index: 100;
    `;

    buffPanel.innerHTML = `
      <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #4ecdc4; border-bottom: 1px solid rgba(78, 205, 196, 0.3); padding-bottom: 5px;">
        🔥 當前效果
      </div>
      <div id="buffList"></div>
    `;

    document.body.appendChild(buffPanel);
  }

  // 新增：創建懸浮提示系統
  createHoverTooltips() {
    // 為統計面板添加問號圖標和懸浮說明
    setTimeout(() => {
      const statsPanel = document.querySelector('.stats-panel');
      if (statsPanel) {
        // 找到防禦行
        const statRows = statsPanel.querySelectorAll('.stat-row');
        statRows.forEach(row => {
          const label = row.querySelector('.stat-label');
          if (label && label.textContent.includes('Defense')) {
            // 添加問號圖標
            const helpIcon = document.createElement('span');
            helpIcon.innerHTML = ' ❓';
            helpIcon.style.cssText = `
              cursor: help;
              margin-left: 5px;
              font-size: 12px;
              opacity: 0.7;
              position: relative;
            `;
            
            // 創建懸浮提示
            const tooltip = document.createElement('div');
            tooltip.style.cssText = `
              position: absolute;
              bottom: 25px;
              left: 50%;
              transform: translateX(-50%);
              background: rgba(0, 0, 0, 0.9);
              color: white;
              padding: 10px;
              border-radius: 8px;
              font-size: 12px;
              line-height: 1.4;
              width: 200px;
              z-index: 1000;
              border: 1px solid rgba(255, 255, 255, 0.2);
              display: none;
            `;
            
            tooltip.innerHTML = `
              <strong>🛡️ 減傷機制</strong><br>
              護甲減傷% = 護甲 ÷ (護甲 + 100)<br>
              <span style="color: #ffd700;">例: 50護甲 = 33.3%減傷</span><br><br>
              <strong>計算順序:</strong><br>
              原始傷害 → 護甲減傷 → 固定減傷 → 最終傷害
            `;
            
            helpIcon.appendChild(tooltip);
            label.appendChild(helpIcon);
            
            // 添加懸浮事件
            helpIcon.addEventListener('mouseenter', () => {
              tooltip.style.display = 'block';
            });
            
            helpIcon.addEventListener('mouseleave', () => {
              tooltip.style.display = 'none';
            });
          }
        });
      }
    }, 1000); // 延遲1秒確保DOM加載完成
  }

  updateBuffDisplay(player) {
    const buffList = document.getElementById('buffList');
    if (!buffList) return;

    const buffs = [];
    
    // 重錘效果
    if (player.hammerEffects.mastery) buffs.push('🔨 重錘精通 (25%觸發，150%傷害，眩暈1秒)');
    if (player.hammerEffects.storm) buffs.push('🌪️ 重錘風暴 (重錘觸發時下次必暴擊)');
    if (player.hammerEffects.shield) buffs.push('🛡️ 重錘護盾 (重錘觸發時+10護甲5秒)');
    if (player.hammerEffects.heal) buffs.push('💚 重錘恢復 (重錘觸發時+15血量)');
    if (player.hammerEffects.fury) buffs.push('🔥 重錘狂怒 (重錘觸發時+50%攻速3秒)');
    if (player.hammerEffects.weight) buffs.push('⚡ 重錘加重 (觸發率35%，傷害170%)');
    if (player.hammerEffects.duration) buffs.push('⏱️ 重錘延續 (眩暈時間2秒)');
    
    // 反甲效果
    if (player.hasReflectArmor) buffs.push('⚡ 反甲護盾 (每受傷5次反彈5%敵人血量)');
    
    // 臨時效果
    const statusInfo = player.getStatusInfo();
    buffs.push(...statusInfo);
    
    // 徽章效果（只顯示非重錘的）
    player.badges.forEach(badge => {
      if (!badge.key || !badge.key.includes('hammer')) {
        buffs.push(`${badge.icon} ${badge.name}`);
      }
    });

    buffList.innerHTML = buffs.length > 0 
      ? buffs.map(buff => `<div style="margin-bottom: 5px; font-size: 13px; padding: 3px 0;">${buff}</div>`).join('')
      : '<div style="opacity: 0.6; font-size: 13px;">暫無效果</div>';
  }

  // 顯示戰鬥結束的詳細統計（延長顯示時間）
  showBattleResults(battleStats, player, displayTime = 8000) {
    const resultsDiv = document.createElement('div');
    resultsDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #2a2a40 0%, #1a1a2e 100%);
      border: 2px solid #4ecdc4;
      border-radius: 20px;
      padding: 30px;
      color: white;
      min-width: 500px;
      text-align: center;
      z-index: 1500;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    `;

    const battleDuration = (Date.now() - battleStats.startTime) / 1000;
    const avgDamage = battleStats.playerAttackCount > 0 ? 
      (battleStats.playerTotalDamage / battleStats.playerAttackCount) : 0;
    const avgDamageTaken = battleStats.enemyAttackCount > 0 ? 
      (battleStats.playerDamageReceived / battleStats.enemyAttackCount) : 0;
    const critRate = battleStats.playerAttackCount > 0 ? 
      (battleStats.critCount / battleStats.playerAttackCount * 100) : 0;
    const hammerRate = battleStats.playerAttackCount > 0 ? 
      (battleStats.hammerProcCount / battleStats.playerAttackCount * 100) : 0;

    resultsDiv.innerHTML = `
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
      <button onclick="this.parentElement.remove()" style="
        background: #4ecdc4;
        color: white;
        border: none;
        padding: 12px 25px;
        border-radius: 10px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        transition: background 0.3s ease;
      " 
      onmouseover="this.style.background='#45b7b8'" 
      onmouseout="this.style.background='#4ecdc4'">繼續 (${(displayTime/1000).toFixed(0)}秒後自動關閉)</button>
    `;

    document.body.appendChild(resultsDiv);

    // 倒數計時
    let timeLeft = displayTime / 1000;
    const button = resultsDiv.querySelector('button');
    const countdown = setInterval(() => {
      timeLeft--;
      if (timeLeft > 0) {
        button.textContent = `繼續 (${timeLeft}秒後自動關閉)`;
      } else {
        clearInterval(countdown);
        button.textContent = '繼續';
      }
    }, 1000);

    // 延長時間後自動關閉
    setTimeout(() => {
      if (resultsDiv.parentNode) {
        resultsDiv.remove();
      }
      clearInterval(countdown);
    }, displayTime);
  }
}

export default GameManager;