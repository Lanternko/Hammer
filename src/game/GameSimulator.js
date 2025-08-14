// src/systems/GameSimulator.js - 瀏覽器版模擬器
import Player from '../game/Player.js';
import Enemy from '../game/Enemy.js';
import { selectEnemyType } from '../data/Enemies.js';
import { generateUpgradeOptions, applyUpgradeToPlayer } from '../data/upgradeRewards.js';
import { getRandomBadges } from '../data/Badges.js';

class GameSimulator {
  constructor() {
    this.strategies = [
      new RandomAI(),
      new BasicAI(), 
      new DefensiveAI(),
      new OffensiveAI()
    ];
    
    // 創建測試面板
    this.createTestPanel();
  }

  createTestPanel() {
    // 檢查是否已存在
    if (document.getElementById('simulatorPanel')) return;

    const panel = document.createElement('div');
    panel.id = 'simulatorPanel';
    panel.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 15px;
      border-radius: 10px;
      font-size: 12px;
      z-index: 9999;
      max-width: 300px;
      display: none;
      border: 2px solid #4ecdc4;
    `;

    panel.innerHTML = `
      <div style="margin-bottom: 10px; font-weight: bold; color: #4ecdc4;">
        🤖 遊戲平衡測試器
      </div>
      <button id="runTestBtn" style="
        background: #4ecdc4;
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 12px;
        margin-bottom: 10px;
        width: 100%;
      ">運行測試 (10局)</button>
      <button id="runLongTestBtn" style="
        background: #ff9800;
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 12px;
        margin-bottom: 10px;
        width: 100%;
      ">完整測試 (50局)</button>
      <div id="testResults" style="
        max-height: 400px;
        overflow-y: auto;
        font-size: 11px;
        line-height: 1.3;
      "></div>
    `;

    document.body.appendChild(panel);

    // 綁定事件
    document.getElementById('runTestBtn').onclick = () => this.runTests(10);
    document.getElementById('runLongTestBtn').onclick = () => this.runTests(50);

    // 添加開啟按鈕到現有控制面板
    this.addToggleButton();
  }

  addToggleButton() {
    const speedControl = document.getElementById('speedControl');
    if (speedControl) {
      const toggleBtn = document.createElement('button');
      toggleBtn.innerHTML = '🤖';
      toggleBtn.title = '開啟AI測試器';
      toggleBtn.style.cssText = `
        position: absolute;
        top: -35px;
        right: 0;
        background: #9C27B0;
        color: white;
        border: none;
        padding: 5px 8px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 12px;
      `;
      
      toggleBtn.onclick = () => {
        const panel = document.getElementById('simulatorPanel');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
      };
      
      speedControl.appendChild(toggleBtn);
    }
  }

  async runTests(runs = 10) {
    const resultsDiv = document.getElementById('testResults');
    resultsDiv.innerHTML = `<div style="color: #ffd700;">⏳ 運行 ${runs} 局測試中...</div>`;

    const results = {};
    
    for (const strategy of this.strategies) {
      console.log(`測試 ${strategy.name}...`);
      
      let victories = 0;
      let totalLevels = 0;
      const levelCounts = {};
      const sampleLogs = [];

      for (let i = 0; i < runs; i++) {
        const result = await this.simulateGame(strategy);
        
        if (result.won) victories++;
        totalLevels += result.level;
        levelCounts[result.level] = (levelCounts[result.level] || 0) + 1;
        
        if (i < 2) sampleLogs.push(result); // 保存前2局樣本
        
        // 每10局更新一次進度
        if (i % 10 === 9) {
          resultsDiv.innerHTML += `<div>${strategy.name}: ${i + 1}/${runs} 局完成</div>`;
        }
      }

      results[strategy.name] = {
        winRate: (victories / runs * 100).toFixed(1),
        avgLevel: (totalLevels / runs).toFixed(1),
        victories,
        runs,
        levelCounts,
        sampleLogs
      };
    }

    this.displayResults(results);
  }

  async simulateGame(strategy) {
    return new Promise(resolve => {
      // 使用 setTimeout 讓 UI 不卡頓
      setTimeout(() => {
        const result = this.simulateGameSync(strategy);
        resolve(result);
      }, 1);
    });
  }

  simulateGameSync(strategy) {
    const player = new Player();
    let gold = 0;
    let level = 1;
    const log = [];

    // 給開局徽章
    const hammerBadge = {
      key: 'hammerMastery',
      name: '重錘精通',
      description: '每次攻擊有25%機率造成150%傷害',
      icon: '🔨',
      effect: { hammerMastery: true },
      rarity: 'legendary'
    };
    player.equipBadge(hammerBadge);

    while (level <= 20) {
      try {
        // 商店關卡
        if ([3, 8, 13, 18].includes(level)) {
          const badges = getRandomBadges(3, level);
          const chosenBadge = strategy.chooseBadge(badges, gold, player, level);
          
          if (chosenBadge && gold >= chosenBadge.cost) {
            gold -= chosenBadge.cost;
            player.equipBadge(chosenBadge);
            log.push(`L${level}: 買 ${chosenBadge.name}`);
          } else {
            log.push(`L${level}: 跳過商店`);
          }
        } else {
          // 戰鬥關卡
          const enemyType = selectEnemyType(level);
          const enemy = new Enemy(level, enemyType);
          
          const won = this.simulateBattle(player, enemy);
          
          if (!won) {
            log.push(`L${level}: 敗於 ${enemy.getTypeName()}`);
            return { level, won: false, log };
          }
          
          // 獲得金幣
          const goldReward = level === 20 ? 5 : (level % 5 === 0 ? 2 : 1);
          gold += goldReward;
          player.hp = player.maxHp; // 血量回滿
          
          log.push(`L${level}: 勝 ${enemy.getTypeName()} (+${goldReward}g)`);
        }

        // 升級選擇
        const upgrades = generateUpgradeOptions(level);
        const chosenUpgrade = strategy.chooseUpgrade(upgrades, player, level);
        applyUpgradeToPlayer(player, chosenUpgrade);
        log.push(`L${level}: 升級 ${chosenUpgrade.name}`);

        // 里程碑徽章 (模擬版本直接給予)
        if (level % 5 === 0 && level <= 20) {
          const milestoneBadges = [
            { name: '重錘風暴', effect: { hammerStorm: true } },
            { name: '重錘護盾', effect: { hammerShield: true } },
            { name: '重錘恢復', effect: { hammerHeal: true } },
            { name: '重錘狂怒', effect: { hammerFury: true } }
          ];
          const milestoneIndex = (level / 5) - 1;
          if (milestoneIndex < milestoneBadges.length) {
            const badge = milestoneBadges[milestoneIndex];
            player.equipBadge(badge);
            log.push(`L${level}: 里程碑 ${badge.name}`);
          }
        }

        level++;
      } catch (error) {
        console.error(`模擬第${level}關時出錯:`, error);
        return { level, won: false, log };
      }
    }

    return { level: 21, won: true, log };
  }

  simulateBattle(player, enemy) {
    // 簡化戰鬥模擬
    const playerDPS = this.calculateDPS(player);
    const enemyDPS = this.calculateDPS(enemy);
    
    // 計算有效血量
    const playerArmorReduction = player.armor / (player.armor + 100);
    const playerEffectiveHP = player.hp / Math.max(0.1, 1 - playerArmorReduction);
    
    // 誰先死
    const playerKillTime = enemy.hp / Math.max(1, playerDPS);
    const enemyKillTime = playerEffectiveHP / Math.max(1, enemyDPS);
    
    return playerKillTime < enemyKillTime;
  }

  calculateDPS(unit) {
    if (unit.getDPS) {
      return unit.getDPS();
    }
    
    // 玩家DPS計算
    if (unit.getEffectiveAttack) {
      const attack = unit.getEffectiveAttack();
      const speed = unit.getEffectiveAttackSpeed();
      const critMult = 1 + unit.critChance;
      const hammerMult = unit.hammerEffects?.mastery ? 
        (unit.hammerEffects.weight ? 1.35 * 1.7 : 1.25 * 1.5) : 1;
      return attack * speed * critMult * hammerMult;
    }
    
    // 敵人DPS計算
    return unit.attack * unit.attackSpeed;
  }

  displayResults(results) {
    const resultsDiv = document.getElementById('testResults');
    let html = '<div style="color: #4ecdc4; font-weight: bold; margin-bottom: 10px;">📊 測試結果</div>';
    
    Object.entries(results).forEach(([name, data]) => {
      const color = data.winRate >= 70 ? '#4CAF50' : 
                   data.winRate >= 50 ? '#FF9800' : '#F44336';
      
      html += `
        <div style="margin-bottom: 15px; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 5px;">
          <div style="color: ${color}; font-weight: bold;">${name}</div>
          <div>勝率: ${data.winRate}% (${data.victories}/${data.runs})</div>
          <div>平均關卡: ${data.avgLevel}</div>
          <div style="font-size: 10px; margin-top: 5px;">
            分布: ${Object.entries(data.levelCounts)
              .sort((a,b) => parseInt(b[0]) - parseInt(a[0]))
              .slice(0, 3)
              .map(([lv, cnt]) => `L${lv}:${cnt}`)
              .join(' ')}
          </div>
        </div>
      `;
    });
    
    html += `
      <div style="margin-top: 15px; padding: 8px; background: rgba(255,215,0,0.2); border-radius: 5px; font-size: 10px;">
        💡 平衡標準:<br>
        🟢 60-80% = 良好<br>
        🟡 40-60% = 稍難<br>
        🔴 <40% = 過難
      </div>
    `;
    
    resultsDiv.innerHTML = html;
  }
}

// AI 策略類 (簡化版本)
class AIStrategy {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }
}

class RandomAI extends AIStrategy {
  constructor() {
    super('亂選型', '總是選最左邊');
  }
  
  chooseUpgrade(options) {
    return options[0];
  }
  
  chooseBadge(options, gold) {
    const affordable = options.filter(b => b.cost <= gold && !b.name.includes('法術') && !b.name.includes('遠程'));
    return affordable.length > 0 ? affordable.reduce((a, b) => a.cost > b.cost ? a : b) : null;
  }
}

class BasicAI extends AIStrategy {
  constructor() {
    super('基礎型', '專注基礎屬性');
  }
  
  chooseUpgrade(options) {
    const priority = ['maxHp', 'attack', 'attackSpeed'];
    for (const type of priority) {
      const opt = options.find(o => o.type === type);
      if (opt) return opt;
    }
    return options[0];
  }
  
  chooseBadge(options, gold) {
    const basicNames = ['生命', '力量', '攻速'];
    const affordable = options.filter(b => b.cost <= gold);
    for (const name of basicNames) {
      const badge = affordable.find(b => b.name.includes(name));
      if (badge) return badge;
    }
    return affordable[0] || null;
  }
}

class DefensiveAI extends AIStrategy {
  constructor() {
    super('防禦型', '專注防禦');
  }
  
  chooseUpgrade(options) {
    const priority = ['maxHp', 'armor', 'flatReduction'];
    for (const type of priority) {
      const opt = options.find(o => o.type === type);
      if (opt) return opt;
    }
    return options[0];
  }
  
  chooseBadge(options, gold) {
    const defenseNames = ['護甲', '生命', '減免', '守護'];
    const affordable = options.filter(b => b.cost <= gold);
    for (const name of defenseNames) {
      const badge = affordable.find(b => b.name.includes(name));
      if (badge) return badge;
    }
    return affordable[0] || null;
  }
}

class OffensiveAI extends AIStrategy {
  constructor() {
    super('進攻型', '專注輸出');
  }
  
  chooseUpgrade(options) {
    const priority = ['attack', 'critChance', 'attackSpeed'];
    for (const type of priority) {
      const opt = options.find(o => o.type === type);
      if (opt) return opt;
    }
    return options[0];
  }
  
  chooseBadge(options, gold) {
    const offenseNames = ['力量', '攻速', '暴擊', '重錘', '狂戰'];
    const affordable = options.filter(b => b.cost <= gold);
    for (const name of offenseNames) {
      const badge = affordable.find(b => b.name.includes(name));
      if (badge) return badge;
    }
    return affordable[0] || null;
  }
}

export default GameSimulator;