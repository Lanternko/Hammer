import { GAME_CONFIG, GameConfigUtils } from '../config/GameConfig.js';
import GameUtils from '../utils/GameUtils.js';
// src/ui/BattleUITemplates.js - 完整的戰鬥UI模板系統（明亮版本）
export class BattleUITemplates {
  
  // 🎯 戰力對比模板（明亮版本）
  static getCombatPowerComparisonHTML(playerPower, enemyPower, advantage) {
    return `
      <div style="background: rgba(81, 160, 212, 0.15); padding: 25px; border-radius: 15px; border: 2px solid #5a9fd4; margin-bottom: 25px; box-shadow: 0 4px 20px rgba(90, 159, 212, 0.3);">
        <h3 style="color: #87ceeb; margin-bottom: 18px; font-size: 20px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">⚔️ 戰力對比分析</h3>
        <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 25px; align-items: center;">
          
          <!-- 玩家戰力 -->
          <div style="text-align: center; background: rgba(78, 205, 196, 0.1); padding: 20px; border-radius: 12px; border: 1px solid rgba(78, 205, 196, 0.3);">
            <div style="color: #4ecdc4; font-size: 18px; font-weight: bold; margin-bottom: 10px;">
              👤 玩家戰力
            </div>
            <div style="color: #ffffff; font-size: 28px; font-weight: bold; margin-bottom: 8px; text-shadow: 0 2px 4px rgba(0,0,0,0.7);">
              ${playerPower.display}
            </div>
            <div style="color: #e0e0e0; font-size: 13px; background: rgba(0,0,0,0.2); padding: 5px 10px; border-radius: 8px;">
              DPS: ${playerPower.dps} | EHP: ${playerPower.ehp}
            </div>
          </div>
          
          <!-- VS 與優勢指示 -->
          <div style="text-align: center; background: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 12px;">
            <div style="font-size: 36px; margin-bottom: 12px; filter: drop-shadow(0 0 8px rgba(255,255,255,0.5));">⚔️</div>
            <div style="color: ${advantage.color}; font-weight: bold; font-size: 16px; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">
              ${advantage.text}
            </div>
            <div style="color: #d0d0d0; font-size: 13px; margin-top: 6px;">
              差距: ${advantage.difference}
            </div>
          </div>
          
          <!-- 敵人戰力 -->
          <div style="text-align: center; background: rgba(255, 107, 107, 0.1); padding: 20px; border-radius: 12px; border: 1px solid rgba(255, 107, 107, 0.3);">
            <div style="color: #ff6b6b; font-size: 18px; font-weight: bold; margin-bottom: 10px;">
              👹 敵人戰力
            </div>
            <div style="color: #ffffff; font-size: 28px; font-weight: bold; margin-bottom: 8px; text-shadow: 0 2px 4px rgba(0,0,0,0.7);">
              ${enemyPower.display}
            </div>
            <div style="color: #e0e0e0; font-size: 13px; background: rgba(0,0,0,0.2); padding: 5px 10px; border-radius: 8px;">
              DPS: ${enemyPower.dps} | EHP: ${enemyPower.ehp}
            </div>
          </div>
        </div>
        
        <!-- 戰力詳細說明 -->
        <div style="margin-top: 20px; padding: 15px; background: rgba(135, 206, 235, 0.1); border-radius: 10px; border-left: 4px solid #87ceeb;">
          <div style="color: #87ceeb; font-size: 14px; font-weight: bold; margin-bottom: 8px;">
            💡 戰力計算說明
          </div>
          <div style="color: #e8e8e8; font-size: 13px; line-height: 1.5;">
            <strong>顯示戰力 = √(DPS × EHP)</strong><br>
            DPS = 攻擊力 × 攻速 | EHP = 血量 ÷ (1 - 護甲減傷率)<br>
            <span style="color: #ffd700;">註：顯示的是開根號後的戰力值，更直觀易懂</span>
          </div>
        </div>
      </div>
    `;
  }
  
  // 📊 詳細數據面板模板（明亮版本）
  static getDetailedStatsHTML(playerStats, enemyStats, battleStats, combatComparison) {
    return `
      <h2 style="text-align: center; color: #87ceeb; margin-bottom: 25px; font-size: 24px; text-shadow: 0 2px 6px rgba(0,0,0,0.7);">
        ⏸️ 遊戲暫停 - 詳細數據面板
      </h2>
      
      <!-- 戰力對比 -->
      ${this.getCombatPowerComparisonHTML(combatComparison.playerPower, combatComparison.enemyPower, combatComparison.advantage)}
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 25px;">
        <!-- 玩家面板 -->
        <div style="background: rgba(78, 205, 196, 0.15); padding: 25px; border-radius: 15px; border: 2px solid #4ecdc4; box-shadow: 0 4px 20px rgba(78, 205, 196, 0.2);">
          <h3 style="color: #4ecdc4; margin-bottom: 18px; font-size: 18px; text-shadow: 0 1px 3px rgba(0,0,0,0.5);">👤 玩家詳細數據</h3>
          
          <div style="margin-bottom: 18px;">
            <h4 style="color: #87ceeb; margin-bottom: 10px; font-size: 16px;">⚡ 有效屬性</h4>
            <div style="font-size: 14px; line-height: 1.8; background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px;">
              <div style="margin-bottom: 6px;">❤️ 血量: <span style="color: #ff6b6b; font-weight: bold;">${playerStats.effectiveStats.hp.toFixed(1)}/${playerStats.effectiveStats.maxHp}</span></div>
              <div style="margin-bottom: 6px;">⚔️ 攻擊: <span style="color: #ffd700; font-weight: bold;">${playerStats.effectiveStats.attack}</span></div>
              <div style="margin-bottom: 6px;">⚡ 攻速: <span style="color: #ff9800; font-weight: bold;">${playerStats.effectiveStats.attackSpeed.toFixed(2)}</span></div>
              <div style="margin-bottom: 6px;">🛡️ 護甲: <span style="color: #4ecdc4; font-weight: bold;">${playerStats.effectiveStats.armor}</span></div>
              <div style="margin-bottom: 6px;">🔰 固減: <span style="color: #4ecdc4; font-weight: bold;">${playerStats.effectiveStats.flatReduction}</span></div>
              <div>💥 暴擊: <span style="color: #ff1744; font-weight: bold;">${(playerStats.effectiveStats.critChance * 100).toFixed(1)}%</span></div>
            </div>
          </div>
          
          <div style="margin-bottom: 18px;">
            <h4 style="color: #87ceeb; margin-bottom: 10px; font-size: 16px;">📊 屬性分解</h4>
            <div style="font-size: 12px; opacity: 0.9; background: rgba(0,0,0,0.15); padding: 10px; border-radius: 6px; color: #e0e0e0;">
              <div style="margin-bottom: 4px;">基礎攻擊: ${playerStats.baseStats.attack} → 加成: +${playerStats.bonusStats.attack} → 倍率: ×${playerStats.multipliers.attack.toFixed(2)} = ${playerStats.effectiveStats.attack}</div>
              <div>基礎血量: ${playerStats.baseStats.hp} → 加成: +${playerStats.bonusStats.hp} → 倍率: ×${playerStats.multipliers.hp.toFixed(2)} = ${playerStats.effectiveStats.maxHp}</div>
            </div>
          </div>
          
          <div>
            <h4 style="color: #87ceeb; margin-bottom: 10px; font-size: 16px;">🔨 重錘BD狀態</h4>
            <div style="font-size: 13px; background: rgba(255, 152, 0, 0.1); padding: 10px; border-radius: 6px;">
              ${Object.entries(playerStats.hammerEffects).map(([key, value]) => 
                value ? `<div style="color: #ff9800; margin-bottom: 3px;">✅ ${this.getHammerEffectName(key)}</div>` : ''
              ).join('')}
            </div>
          </div>
        </div>
        
        <!-- 敵人面板 -->
        <div style="background: rgba(255, 107, 107, 0.15); padding: 25px; border-radius: 15px; border: 2px solid #ff6b6b; box-shadow: 0 4px 20px rgba(255, 107, 107, 0.2);">
          <h3 style="color: #ff6b6b; margin-bottom: 18px; font-size: 18px; text-shadow: 0 1px 3px rgba(0,0,0,0.5);">👹 敵人詳細數據</h3>
          
          <div style="margin-bottom: 18px;">
            <h4 style="color: #87ceeb; margin-bottom: 10px; font-size: 16px;">⚡ 當前屬性</h4>
            <div style="font-size: 14px; line-height: 1.8; background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px;">
              <div style="margin-bottom: 6px;">❤️ 血量: <span style="color: #ff6b6b; font-weight: bold;">${enemyStats.hp.toFixed(1)}/${enemyStats.maxHp}</span></div>
              <div style="margin-bottom: 6px;">⚔️ 攻擊: <span style="color: #ffd700; font-weight: bold;">${enemyStats.attack}</span></div>
              <div style="margin-bottom: 6px;">⚡ 攻速: <span style="color: #ff9800; font-weight: bold;">${enemyStats.attackSpeed.toFixed(2)}</span></div>
              <div style="margin-bottom: 6px;">🛡️ 防禦: <span style="color: #ff6b6b; font-weight: bold;">${enemyStats.defense}</span></div>
              <div>🏷️ 類型: <span style="color: white; font-weight: bold;">${enemyStats.emoji} ${enemyStats.name}</span></div>
            </div>
          </div>
          
          <!-- 三參數模型顯示 -->
          ${enemyStats.balanceInfo ? this.getEnemyBalanceInfoHTML(enemyStats.balanceInfo) : ''}
          
          <div style="margin-bottom: 18px;">
            <h4 style="color: #87ceeb; margin-bottom: 10px; font-size: 16px;">📈 威脅評估</h4>
            <div style="font-size: 13px; background: rgba(0,0,0,0.15); padding: 10px; border-radius: 6px; color: #e0e0e0;">
              <div style="margin-bottom: 4px;">DPS: <span style="color: #ff9800; font-weight: bold;">${(enemyStats.attack * enemyStats.attackSpeed).toFixed(1)}</span></div>
              <div style="margin-bottom: 4px;">血量池: <span style="color: #ff6b6b; font-weight: bold;">${((enemyStats.hp / enemyStats.maxHp) * 100).toFixed(1)}%</span></div>
              ${enemyStats.isStunned ? '<div style="color: #ff6b6b;">😵 當前被眩暈</div>' : ''}
            </div>
          </div>
        </div>
      </div>
      
      <!-- 戰鬥統計 -->
      ${this.getBattleStatsHTML(battleStats)}
      
      <div style="text-align: center; margin-top: 20px;">
        <button onclick="document.getElementById('pauseButton').click()" style="
          padding: 18px 35px;
          background: linear-gradient(45deg, #4ecdc4, #45b7b8);
          color: white;
          border: none;
          border-radius: 25px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(78, 205, 196, 0.4);
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        " onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 6px 20px rgba(78, 205, 196, 0.6)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 15px rgba(78, 205, 196, 0.4)'">
          ▶️ 繼續戰鬥
        </button>
      </div>
    `;
  }
  
  // 🎯 敵人平衡信息模板（明亮版本）
  static getEnemyBalanceInfoHTML(balanceInfo) {
    return `
      <div style="margin-bottom: 18px;">
        <h4 style="color: #87ceeb; margin-bottom: 10px; font-size: 16px;">🎯 三參數模型</h4>
        <div style="font-size: 13px; background: rgba(135, 206, 235, 0.1); padding: 12px; border-radius: 8px; border-left: 3px solid #87ceeb;">
          <div style="margin-bottom: 4px;">血量倍率: <span style="color: #ff6b6b; font-weight: bold;">×${balanceInfo.hpMultiplier}</span></div>
          <div style="margin-bottom: 4px;">攻速倍率: <span style="color: #ff9800; font-weight: bold;">×${balanceInfo.speedMultiplier}</span></div>
          <div style="margin-bottom: 4px;">強度倍率: <span style="color: #ffd700; font-weight: bold;">×${balanceInfo.strengthMultiplier}</span></div>
          <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.2); color: #e8e8e8;">
            目標戰力: <span style="color: white; font-weight: bold;">${balanceInfo.targetCombatPower.toFixed(0)}</span><br>
            實際戰力: <span style="color: white; font-weight: bold;">${balanceInfo.actualCombatPower.toFixed(0)}</span><br>
            誤差: <span style="color: ${balanceInfo.error < 0.05 ? '#4CAF50' : balanceInfo.error < 0.1 ? '#ff9800' : '#ff6b6b'}; font-weight: bold;">${(balanceInfo.error * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>
    `;
  }
  
  // 📊 戰鬥統計模板（明亮版本）
  static getBattleStatsHTML(battleStats) {
    return `
      <div style="background: rgba(255, 215, 0, 0.15); padding: 25px; border-radius: 15px; border: 2px solid #ffd700; margin-bottom: 25px; box-shadow: 0 4px 20px rgba(255, 215, 0, 0.2);">
        <h3 style="color: #ffd700; margin-bottom: 18px; font-size: 18px; text-shadow: 0 1px 3px rgba(0,0,0,0.5);">📊 當前戰鬥統計</h3>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; font-size: 14px;">
          <div style="background: rgba(0,0,0,0.15); padding: 12px; border-radius: 8px; text-align: center;">
            <div style="color: #87ceeb; font-size: 12px; margin-bottom: 4px;">⏱️ 戰鬥時長</div>
            <div style="color: white; font-weight: bold;">${battleStats.battleDuration.toFixed(1)}秒</div>
          </div>
          <div style="background: rgba(0,0,0,0.15); padding: 12px; border-radius: 8px; text-align: center;">
            <div style="color: #87ceeb; font-size: 12px; margin-bottom: 4px;">🗡️ 攻擊次數</div>
            <div style="color: white; font-weight: bold;">${battleStats.playerAttackCount}</div>
          </div>
          <div style="background: rgba(0,0,0,0.15); padding: 12px; border-radius: 8px; text-align: center;">
            <div style="color: #87ceeb; font-size: 12px; margin-bottom: 4px;">💥 暴擊次數</div>
            <div style="color: white; font-weight: bold;">${battleStats.critCount} (${battleStats.critRate.toFixed(1)}%)</div>
          </div>
          <div style="background: rgba(0,0,0,0.15); padding: 12px; border-radius: 8px; text-align: center;">
            <div style="color: #87ceeb; font-size: 12px; margin-bottom: 4px;">🔨 重錘次數</div>
            <div style="color: white; font-weight: bold;">${battleStats.hammerProcCount} (${battleStats.hammerRate.toFixed(1)}%)</div>
          </div>
          <div style="background: rgba(0,0,0,0.15); padding: 12px; border-radius: 8px; text-align: center;">
            <div style="color: #87ceeb; font-size: 12px; margin-bottom: 4px;">📈 平均DPS</div>
            <div style="color: white; font-weight: bold;">${battleStats.actualDPS.toFixed(1)}</div>
          </div>
          <div style="background: rgba(0,0,0,0.15); padding: 12px; border-radius: 8px; text-align: center;">
            <div style="color: #87ceeb; font-size: 12px; margin-bottom: 4px;">🛡️ 受擊次數</div>
            <div style="color: white; font-weight: bold;">${battleStats.enemyAttackCount}</div>
          </div>
          <div style="background: rgba(0,0,0,0.15); padding: 12px; border-radius: 8px; text-align: center;">
            <div style="color: #87ceeb; font-size: 12px; margin-bottom: 4px;">📉 平均受傷</div>
            <div style="color: white; font-weight: bold;">${battleStats.avgDamageTaken.toFixed(1)}</div>
          </div>
          <div style="background: rgba(0,0,0,0.15); padding: 12px; border-radius: 8px; text-align: center;">
            <div style="color: #87ceeb; font-size: 12px; margin-bottom: 4px;">⚡ 反甲觸發</div>
            <div style="color: white; font-weight: bold;">${battleStats.reflectArmorTriggerCount}</div>
          </div>
        </div>
      </div>
    `;
  }
  
  // 🎮 速度控制UI模板（明亮版本）
  static getSpeedControlHTML(currentSpeed, colors) {
    const speeds = { NORMAL: 1, FAST: 3, TURBO: 10 };
    
    return `
      <div style="margin-bottom: 8px; color: #87ceeb; font-weight: bold;">⚡ 戰鬥速度</div>
      <button onclick="window.gameManager?.setBattleSpeed(${speeds.NORMAL})" style="margin-right: 6px; padding: 8px 12px; background: ${currentSpeed === speeds.NORMAL ? colors.SUCCESS : 'rgba(255,255,255,0.2)'}; color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: bold; transition: all 0.3s ease;">${speeds.NORMAL}x</button>
      <button onclick="window.gameManager?.setBattleSpeed(${speeds.FAST})" style="margin-right: 6px; padding: 8px 12px; background: ${currentSpeed === speeds.FAST ? colors.WARNING : 'rgba(255,255,255,0.2)'}; color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: bold; transition: all 0.3s ease;">${speeds.FAST}x</button>
      <button onclick="window.gameManager?.setBattleSpeed(${speeds.TURBO})" style="padding: 8px 12px; background: ${currentSpeed === speeds.TURBO ? '#E91E63' : 'rgba(255,255,255,0.2)'}; color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: bold; transition: all 0.3s ease;">${speeds.TURBO}x</button>
    `;
  }
  
  // 🏆 戰鬥結果模板（明亮版本）
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
      <h2 style="color: #87ceeb; margin-bottom: 25px; font-size: 22px; text-shadow: 0 2px 4px rgba(0,0,0,0.7);">⚔️ 戰鬥總結</h2>
      <div style="text-align: left; margin-bottom: 25px; display: grid; grid-template-columns: 1fr 1fr; gap: 18px; font-size: 15px;">
        <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px;">⏱️ 戰鬥時長: <span style="color: #ffd700; font-weight: bold;">${battleDuration.toFixed(1)}秒</span></div>
        <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px;">❤️ 剩餘血量: <span style="color: #ff6b6b; font-weight: bold;">${player.hp.toFixed(1)}/${player.maxHp}</span></div>
        <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px;">🗡️ 攻擊次數: <span style="color: #ffd700; font-weight: bold;">${battleStats.playerAttackCount}</span></div>
        <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px;">📊 平均傷害: <span style="color: #ffd700; font-weight: bold;">${avgDamage.toFixed(1)}</span></div>
        <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px;">💥 暴擊率: <span style="color: #ff6b6b; font-weight: bold;">${critRate.toFixed(1)}%</span></div>
        <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px;">🔨 重錘率: <span style="color: #ff6b6b; font-weight: bold;">${hammerRate.toFixed(1)}%</span></div>
        <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px;">🛡️ 受擊次數: <span style="color: #ccc; font-weight: bold;">${battleStats.enemyAttackCount}</span></div>
        <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px;">📉 平均受傷: <span style="color: #ccc; font-weight: bold;">${avgDamageTaken.toFixed(1)}</span></div>
      </div>
      
      <div style="background: rgba(78, 205, 196, 0.15); padding: 18px; border-radius: 12px; margin-bottom: 25px; border: 2px solid rgba(78, 205, 196, 0.3);">
        <div style="color: #4ecdc4; font-size: 16px; font-weight: bold; margin-bottom: 8px;">
          💡 操作提示
        </div>
        <div style="color: #e8e8e8; font-size: 14px;">
          點擊畫面任意位置繼續下一關
        </div>
      </div>
    `;
  }
  
  // 🎨 購買成功動畫模板（明亮版本）
  static getBadgePurchaseSuccessHTML(badge, remainingGold, rarityColor, rarityText) {
    return `
      <div style="
        background: linear-gradient(135deg, rgba(45, 55, 75, 0.95), rgba(35, 45, 65, 0.95));
        border: 3px solid #5a9fd4;
        border-radius: 20px;
        padding: 40px;
        text-align: center;
        animation: pulse 0.5s ease-in-out;
        box-shadow: 0 10px 40px rgba(90, 159, 212, 0.4);
      ">
        <div style="font-size: 60px; margin-bottom: 20px; filter: drop-shadow(0 0 10px rgba(255,255,255,0.5));">
          ${badge.icon}
        </div>
        <h2 style="color: #87ceeb; margin-bottom: 12px; font-size: 24px; text-shadow: 0 2px 4px rgba(0,0,0,0.7);">
          購買成功！
        </h2>
        <h3 style="color: #ffd700; font-size: 20px; margin-bottom: 12px; text-shadow: 0 1px 3px rgba(0,0,0,0.5);">
          ${badge.name}
        </h3>
        <p style="color: #e8e8e8; font-size: 16px; margin-bottom: 18px; line-height: 1.4;">
          ${badge.description}
        </p>
        <div style="
          margin-bottom: 18px;
          padding: 10px 18px;
          background: ${rarityColor};
          color: white;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
          display: inline-block;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">
          ${rarityText} 徽章
        </div>
        <p style="color: #ffd700; font-size: 18px; font-weight: bold; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">
          剩餘金幣: ${remainingGold} 💰
        </p>
      </div>
    `;
  }
  
  // 🎊 升級選擇界面模板
  static getUpgradeSelectionHTML(upgradeOptions, playerPowerInfo, currentLevel, goldReward) {
    return `
      <div style="
        background: linear-gradient(135deg, rgba(45, 55, 75, 0.95), rgba(35, 45, 65, 0.95));
        border: 3px solid #5a9fd4;
        border-radius: 20px;
        padding: 35px;
        max-width: 900px;
        width: 90%;
        text-align: center;
        box-shadow: 0 10px 40px rgba(90, 159, 212, 0.4);
        backdrop-filter: blur(15px);
      ">
        <h2 style="color: #87ceeb; margin-bottom: 12px; font-size: 26px; text-shadow: 0 2px 6px rgba(0,0,0,0.7);">
          🎉 關卡 ${currentLevel} 完成！
        </h2>
        <p style="color: #ffd700; margin-bottom: 18px; font-size: 20px; font-weight: bold;">
          💰 +${goldReward} 金幣 | 💚 血量回滿
        </p>
        ${playerPowerInfo}
        <h3 style="color: #ffffff; margin-bottom: 25px; font-size: 20px;">選擇一個升級獎勵（三選一）：</h3>
        <div style="display: flex; gap: 25px; justify-content: center; margin-bottom: 25px; flex-wrap: wrap;">
          ${upgradeOptions}
        </div>
      </div>
    `;
  }
  
  // 🎯 升級選項模板
  static getUpgradeOptionHTML(option, index, effectDescription) {
    return `
      <div class="upgrade-option" data-index="${index}" style="
        flex: 1;
        max-width: 280px;
        min-width: 250px;
        padding: 25px;
        background: rgba(78, 205, 196, 0.12);
        border: 2px solid #4ecdc4;
        border-radius: 15px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: center;
        position: relative;
        overflow: hidden;
      ">
        <div style="font-size: 36px; margin-bottom: 18px; filter: drop-shadow(0 0 8px rgba(255,255,255,0.3));">
          ${option.icon}
        </div>
        <div style="color: #4ecdc4; font-weight: bold; font-size: 20px; margin-bottom: 8px; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">
          ${option.name}
        </div>
        <div style="color: #e8e8e8; font-size: 15px; line-height: 1.5; margin-bottom: 12px;">
          ${option.description}
        </div>
        <div style="color: #ffd700; font-size: 13px; font-weight: bold; background: rgba(0,0,0,0.2); padding: 8px 12px; border-radius: 8px; margin-bottom: 12px;">
          詳細效果：${effectDescription}
        </div>
        <div style="
          padding: 8px 15px;
          background: ${GameUtils.getRarityColor(option.rarity)};
          color: white;
          border-radius: 20px;
          font-size: 13px;
          font-weight: bold;
          display: inline-block;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        ">
          ${GameUtils.getRarityText(option.rarity)}
        </div>
        
        <!-- 鼠標懸浮效果層 -->
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(78, 205, 196, 0.1), rgba(69, 183, 184, 0.1));
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          border-radius: 15px;
        " class="hover-overlay"></div>
      </div>
    `;
  }
  
  // 🏆 遊戲結束畫面模板
  static getGameOverHTML(isVictory, currentLevel, badgeCount, finalPowerInfo, diamonds, gold) {
    return `
      <div style="
        background: ${isVictory ? 
          'linear-gradient(135deg, rgba(46, 204, 113, 0.95), rgba(39, 174, 96, 0.95))' : 
          'linear-gradient(135deg, rgba(231, 76, 60, 0.95), rgba(192, 57, 43, 0.95))'
        };
        padding: 50px;
        border-radius: 25px;
        text-align: center;
        color: white;
        box-shadow: 0 15px 50px rgba(0, 0, 0, 0.6);
        cursor: default;
        position: relative;
        max-width: 600px;
        width: 90%;
        backdrop-filter: blur(20px);
      ">
        <div style="font-size: 64px; margin-bottom: 25px; filter: drop-shadow(0 0 15px rgba(255,255,255,0.6));">
          ${isVictory ? '🏆' : '💀'}
        </div>
        <h2 style="font-size: 36px; margin-bottom: 18px; text-shadow: 0 3px 6px rgba(0,0,0,0.5);">
          ${isVictory ? '重錘之王！' : '征程結束'}
        </h2>
        <p style="font-size: 22px; margin-bottom: 25px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
          ${isVictory ? '你用重錘征服了所有敵人！' : `你在第 ${currentLevel} 關倒下了`}
        </p>
        
        <!-- 最終戰力顯示 -->
        <div style="background: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 15px; margin-bottom: 25px; border: 2px solid rgba(255, 255, 255, 0.2);">
          <div style="color: #ffffff; font-size: 18px; font-weight: bold; margin-bottom: 10px;">
            ⚔️ 最終戰力資訊
          </div>
          ${finalPowerInfo}
        </div>
        
        <!-- 成就統計 -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; font-size: 18px; margin-bottom: 30px;">
          <div style="background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 12px;">
            <div style="font-size: 24px; margin-bottom: 5px;">💎</div>
            <div style="font-weight: bold;">${diamonds}</div>
            <div style="font-size: 14px; opacity: 0.9;">鑽石</div>
          </div>
          <div style="background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 12px;">
            <div style="font-size: 24px; margin-bottom: 5px;">🎖️</div>
            <div style="font-weight: bold;">${badgeCount}</div>
            <div style="font-size: 14px; opacity: 0.9;">徽章</div>
          </div>
          <div style="background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 12px;">
            <div style="font-size: 24px; margin-bottom: 5px;">💰</div>
            <div style="font-weight: bold;">${gold}</div>
            <div style="font-size: 14px; opacity: 0.9;">金幣</div>
          </div>
          <div style="background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 12px;">
            <div style="font-size: 24px; margin-bottom: 5px;">🏁</div>
            <div style="font-weight: bold;">${currentLevel}</div>
            <div style="font-size: 14px; opacity: 0.9;">關卡</div>
          </div>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.12); padding: 18px; border-radius: 12px; margin-top: 25px;">
          <div style="color: #ffffff; font-size: 16px; font-weight: bold; margin-bottom: 8px;">
            💡 操作提示
          </div>
          <div style="font-size: 15px; opacity: 0.95;">
            點擊畫面任意位置重新開始遊戲
          </div>
        </div>
      </div>
    `;
  }
  
  // 🎁 徽章獲得動畫模板
  static getBadgeRewardHTML(badge) {
    return `
      <div style="
        background: linear-gradient(135deg, rgba(255, 215, 0, 0.95), rgba(255, 165, 0, 0.95));
        color: white;
        padding: 40px;
        border-radius: 25px;
        text-align: center;
        box-shadow: 0 15px 50px rgba(255, 215, 0, 0.5);
        animation: badgePulse 0.6s ease-out;
        backdrop-filter: blur(10px);
        border: 3px solid rgba(255, 255, 255, 0.3);
      ">
        <div style="font-size: 64px; margin-bottom: 20px; filter: drop-shadow(0 0 15px rgba(255,255,255,0.8));">
          ${badge.icon}
        </div>
        <h2 style="font-size: 28px; margin-bottom: 12px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
          里程碑獎勵！
        </h2>
        <h3 style="font-size: 22px; margin-bottom: 12px; text-shadow: 0 1px 3px rgba(0,0,0,0.2);">
          ${badge.name}
        </h3>
        <p style="font-size: 16px; opacity: 0.95; line-height: 1.5; text-shadow: 0 1px 2px rgba(0,0,0,0.2);">
          ${badge.description}
        </p>
      </div>
    `;
  }
  
  // 🏪 商店事件模板
  static getShopEventHTML(eventData, shopOptions) {
    return `
      <div style="
        background: linear-gradient(135deg, rgba(45, 55, 75, 0.95), rgba(35, 45, 65, 0.95));
        border: 3px solid #5a9fd4;
        border-radius: 20px;
        padding: 35px;
        max-width: 900px;
        width: 90%;
        text-align: center;
        box-shadow: 0 10px 40px rgba(90, 159, 212, 0.4);
        backdrop-filter: blur(15px);
      ">
        <h2 style="color: #87ceeb; margin-bottom: 12px; font-size: 26px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">
          ${eventData.title}
        </h2>
        <p style="color: #e8e8e8; margin-bottom: 25px; font-size: 18px; line-height: 1.4;">
          ${eventData.description}
        </p>
        <p style="color: #ffd700; margin-bottom: 25px; font-size: 20px; font-weight: bold;">
          💰 金幣: ${eventData.currentGold}
        </p>
        <div style="display: flex; gap: 25px; justify-content: center; margin-bottom: 25px; flex-wrap: wrap;">
          ${shopOptions}
        </div>
        <button id="skipBtn" style="
          padding: 12px 25px;
          background: rgba(102, 102, 102, 0.8);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          transition: all 0.3s ease;
          backdrop-filter: blur(5px);
        " 
        onmouseover="this.style.background='rgba(136, 136, 136, 0.8)'; this.style.transform='scale(1.05)'" 
        onmouseout="this.style.background='rgba(102, 102, 102, 0.8)'; this.style.transform='scale(1)'">
          跳過 (不購買任何徽章)
        </button>
      </div>
    `;
  }
  
  // 🛍️ 商店物品模板
  static getShopItemHTML(item, index, canAfford) {
    return `
      <div class="shop-item" data-index="${index}" style="
        flex: 1;
        max-width: 280px;
        min-width: 250px;
        padding: 25px;
        background: ${canAfford ? 'rgba(78, 205, 196, 0.12)' : 'rgba(128, 128, 128, 0.12)'};
        border: 2px solid ${canAfford ? '#4ecdc4' : '#666'};
        border-radius: 15px;
        cursor: ${canAfford ? 'pointer' : 'not-allowed'};
        transition: all 0.3s ease;
        text-align: center;
        opacity: ${canAfford ? '1' : '0.6'};
        position: relative;
        overflow: hidden;
      ">
        <div style="font-size: 48px; margin-bottom: 18px; filter: ${canAfford ? 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' : 'grayscale(50%)'};">
          ${item.icon}
        </div>
        <div style="color: ${canAfford ? '#4ecdc4' : '#999'}; font-weight: bold; font-size: 20px; margin-bottom: 10px;">
          ${item.name}
        </div>
        <div style="color: ${canAfford ? '#e8e8e8' : '#ccc'}; font-size: 15px; margin-bottom: 12px; line-height: 1.4;">
          ${item.description}
        </div>
        <div style="
          margin-bottom: 12px;
          padding: 8px 15px;
          background: ${GameUtils.getRarityColor(item.rarity)};
          color: white;
          border-radius: 20px;
          font-size: 13px;
          font-weight: bold;
          display: inline-block;
        ">
          ${GameUtils.getRarityText(item.rarity)}
        </div>
        <div style="
          background: ${canAfford ? '#ffd700' : '#666'};
          color: ${canAfford ? '#000' : '#ccc'};
          padding: 12px 18px;
          border-radius: 25px;
          font-weight: bold;
          font-size: 18px;
          box-shadow: ${canAfford ? '0 3px 10px rgba(255, 215, 0, 0.4)' : 'none'};
        ">
          ${item.cost} 💰
        </div>
        ${!canAfford ? '<div style="color: #ff6b6b; font-size: 14px; margin-top: 10px; font-weight: bold;">金幣不足</div>' : ''}
        
        <!-- 鼠標懸浮效果層 -->
        ${canAfford ? `
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(78, 205, 196, 0.1), rgba(69, 183, 184, 0.1));
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          border-radius: 15px;
        " class="hover-overlay"></div>
        ` : ''}
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
  // rarity helpers centralized in GameUtils
}

// Fixed BattleUIManager Constructor
// Replace the existing BattleUIManager constructor in BattleUITemplates.js with this:

export class BattleUIManager {
  constructor(battleSystem) {
    // Store reference to the battle system
    this.battleSystem = battleSystem;
    
    console.log('✅ BattleUIManager initialized successfully');
  }
  
  // 🎮 創建速度控制UI（明亮版本）
  createSpeedControlUI() {
    if (document.getElementById('speedControl')) return;
    
    const speedControl = document.createElement('div');
    speedControl.id = 'speedControl';
    speedControl.style.cssText = `
      position: fixed;
      top: 20px;
      right: 330px;
      background: rgba(45, 55, 75, 0.95);
      border: 2px solid #5a9fd4;
      border-radius: 12px;
      padding: 15px;
      color: white;
      font-size: 14px;
      z-index: 200;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 20px rgba(90, 159, 212, 0.3);
    `;
    
    const colors = { SUCCESS: '#4CAF50', WARNING: '#FF9800' };
    speedControl.innerHTML = BattleUITemplates.getSpeedControlHTML(
      this.battleSystem.battleSpeed, 
      colors
    );
    
    document.body.appendChild(speedControl);
    window.gameManager = this.battleSystem.gameManager;
  }
  
  // 🏆 顯示戰鬥結果（明亮版本）
  showBattleResults(battleStats, player) {
    const resultsDiv = this.createModalPanel();
    resultsDiv.style.cursor = 'pointer';
    
    const contentDiv = document.createElement('div');
    contentDiv.style.cssText = `
      background: linear-gradient(135deg, rgba(45, 55, 75, 0.95), rgba(35, 45, 65, 0.95));
      border: 3px solid #5a9fd4;
      border-radius: 20px;
      padding: 35px;
      color: white;
      min-width: 500px;
      text-align: center;
      box-shadow: 0 10px 40px rgba(90, 159, 212, 0.4);
      cursor: default;
      position: relative;
      backdrop-filter: blur(15px);
    `;
    
    contentDiv.innerHTML = BattleUITemplates.getBattleResultsHTML(battleStats, player);
    
    resultsDiv.appendChild(contentDiv);
    
    // 點擊關閉事件
    resultsDiv.addEventListener('click', (e) => {
      if (e.target === resultsDiv || e.target === contentDiv) {
        resultsDiv.remove();
      }
    });
    
    document.body.appendChild(resultsDiv);
  }

  // 🖥️ 顯示詳細暫停面板
  showDetailedPanel() {
    this.removeExistingPanel();
    
    const panel = this.createModalPanel();
    
    // Create content using simplified approach
    const contentDiv = document.createElement('div');
    contentDiv.style.cssText = `
      background: rgba(45, 55, 75, 0.95);
      border: 3px solid #5a9fd4;
      border-radius: 20px;
      padding: 30px;
      color: white;
      max-width: 900px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 10px 40px rgba(90, 159, 212, 0.4);
    `;
    
    // Simple panel content without complex calculations
    contentDiv.innerHTML = `
      <div style="text-align: center; margin-bottom: 25px;">
        <h2 style="color: #5a9fd4; font-size: 28px; margin-bottom: 10px;">⏸️ 戰鬥暫停</h2>
        <p style="color: #87ceeb; font-size: 16px;">詳細戰鬥數據</p>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
        <!-- 玩家數據 -->
        <div style="background: rgba(78, 205, 196, 0.1); padding: 20px; border-radius: 12px; border: 1px solid rgba(78, 205, 196, 0.3);">
          <h3 style="color: #4ecdc4; margin-bottom: 15px;">👤 玩家狀態</h3>
          <div style="font-size: 14px;">
            血量: ${this.battleSystem.player.hp.toFixed(1)}/${this.battleSystem.player.maxHp}<br>
            攻擊: ${this.battleSystem.player.attack}<br>
            攻速: ${this.battleSystem.player.attackSpeed.toFixed(2)}<br>
            護甲: ${this.battleSystem.player.armor}
          </div>
        </div>
        
        <!-- 敵人數據 -->
        <div style="background: rgba(255, 107, 107, 0.1); padding: 20px; border-radius: 12px; border: 1px solid rgba(255, 107, 107, 0.3);">
          <h3 style="color: #ff6b6b; margin-bottom: 15px;">👹 敵人狀態</h3>
          <div style="font-size: 14px;">
            血量: ${this.battleSystem.enemy.hp.toFixed(1)}/${this.battleSystem.enemy.maxHp}<br>
            攻擊: ${this.battleSystem.enemy.attack}<br>
            攻速: ${this.battleSystem.enemy.attackSpeed.toFixed(2)}<br>
            防禦: ${this.battleSystem.enemy.armor || this.battleSystem.enemy.defense || 0}
          </div>
        </div>
      </div>
      
      <!-- 戰鬥統計 -->
      <div style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <h3 style="color: #87ceeb; margin-bottom: 15px;">📊 戰鬥統計</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px;">
          <div style="text-align: center;">
            <div style="color: #4ecdc4; font-size: 12px;">攻擊次數</div>
            <div style="font-size: 16px; font-weight: bold;">${this.battleSystem.battleStats.playerAttackCount}</div>
          </div>
          <div style="text-align: center;">
            <div style="color: #4ecdc4; font-size: 12px;">暴擊次數</div>
            <div style="font-size: 16px; font-weight: bold;">${this.battleSystem.battleStats.critCount}</div>
          </div>
          <div style="text-align: center;">
            <div style="color: #4ecdc4; font-size: 12px;">重錘次數</div>
            <div style="font-size: 16px; font-weight: bold;">${this.battleSystem.battleStats.hammerProcCount}</div>
          </div>
          <div style="text-align: center;">
            <div style="color: #4ecdc4; font-size: 12px;">受擊次數</div>
            <div style="font-size: 16px; font-weight: bold;">${this.battleSystem.battleStats.enemyAttackCount}</div>
          </div>
        </div>
      </div>
      
      <div style="text-align: center;">
        <button onclick="document.getElementById('pauseButton').click()" style="
          padding: 18px 35px;
          background: linear-gradient(45deg, #4ecdc4, #45b7b8);
          color: white;
          border: none;
          border-radius: 25px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(78, 205, 196, 0.4);
        ">
          ▶️ 繼續戰鬥
        </button>
      </div>
    `;
    
    panel.appendChild(contentDiv);
    document.body.appendChild(panel);
  }
  
  // Helper methods
  createModalPanel() {
    const panel = document.createElement('div');
    panel.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
    `;
    
    // Close on click outside
    panel.addEventListener('click', (e) => {
      if (e.target === panel) {
        panel.remove();
      }
    });
    
    return panel;
  }
  
  removeExistingPanel() {
    const existingPanel = document.querySelector('[style*="position: fixed"][style*="z-index: 1000"]');
    if (existingPanel) {
      existingPanel.remove();
    }
  }
}

// 🎨 動畫樣式自動注入
if (!document.querySelector('#battleUIAnimations')) {
  const style = document.createElement('style');
  style.id = 'battleUIAnimations';
  style.textContent = `
    @keyframes badgePulse {
      0% { transform: scale(0.8); opacity: 0; }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); opacity: 1; }
    }
    
    .upgrade-option:hover .hover-overlay,
    .shop-item:hover .hover-overlay {
      opacity: 1 !important;
    }
    
    .upgrade-option:hover,
    .shop-item:hover {
      transform: scale(1.02) translateY(-2px);
      box-shadow: 0 8px 25px rgba(78, 205, 196, 0.4);
    }
    
    .shop-item:not(.disabled):hover {
      border-color: #45b7b8 !important;
    }
    
    /* 響應式設計 */
    @media (max-width: 768px) {
      .upgrade-option,
      .shop-item {
        max-width: none !important;
        min-width: 100% !important;
        margin-bottom: 15px;
      }
    }
    
    /* 漸變動畫 */
    @keyframes shimmer {
      0% { background-position: -200px 0; }
      100% { background-position: calc(200px + 100%) 0; }
    }
    
    .shimmer-effect {
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
      background-size: 200px 100%;
      animation: shimmer 2s infinite;
    }
  `;
  document.head.appendChild(style);
}

console.log('🎨 完整戰鬥UI模板系統載入完成 - 明亮優化版本');
console.log('📱 包含暫停界面、升級選擇、商店事件、遊戲結束等完整模板');
console.log('⚡ 戰力顯示已統一為開根號格式，UI更加明亮清晰');