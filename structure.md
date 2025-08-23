# 🏗️ Roguelike Numerical Showdown - 進化版分層架構設計

## 📊 整體架構樹狀圖

```
project/
├── index.html                    # 主頁面
├── main.js                      # 遊戲入口與錯誤處理
├── styles/                      # CSS 樣式系統
│   ├── main.css                # 主要基礎樣式
│   ├── character.css           # 角色卡片相關樣式
│   ├── ui-panels.css           # UI面板樣式
│   ├── overlays.css            # 覆蓋層和彈窗樣式
│   ├── z-index.css             # Z-Index層級管理
│   └── responsive.css          # 響應式設計
└── src/
    ├── game/
    │   ├── GameManager.js       # 🎮 遊戲總控 - 擴展為核心調度器
    │   ├── Player.js            # 👤 玩家系統 - 含重錘技能樹
    │   └── Enemy.js             # 👹 敵人系統 - 三參數智慧平衡
    ├── systems/
    │   ├── BattleSystem.js      # ⚔️ 戰鬥系統 - 20fps戰鬥引擎
    │   ├── EventSystem.js       # 🏪 事件系統 - 商店與隨機事件
    │   └── GameSimulator.js     # 🤖 AI測試器 - 自動平衡驗證
    ├── ui/
    │   └── UIManager.js         # 🎨 UI管理 - Canvas渲染與動畫
    ├── storage/
    │   └── StorageManager.js    # 💾 存檔系統 - localStorage管理
    ├── config/
    │   └── GameConfig.js        # ⚙️ 配置中心 - 統一配置管理
    └── data/
        ├── badges.js            # 🎖️ 徽章數據 - 重錘BD與多元流派
        ├── enemies.js           # 👾 敵人數據 - 三參數模板
        └── upgradeRewards.js    # 🎁 升級獎勵 - 關卡後選擇系統
```

## 🔄 依賴流向圖（進化版）

```
主入口 (main.js)
    ↓ 引用並初始化配置
配置中心 (GameConfig.js) ← 所有模組的參數來源
    ↓ 初始化並驗證
總控層 (GameManager.js)
    ↓ 管理核心循環
系統層 (BattleSystem, EventSystem, GameSimulator)
    ↓ 驅動遊戲邏輯
實體層 (Player, Enemy) + 數據層 (badges, enemies, upgradeRewards)
    ↓ 提供數據支援
UI層 (UIManager) & 存儲層 (StorageManager)
    ↓ 渲染與持久化
```

## 📋 各層職責詳述（2024進化版）

### 1. 主入口層 (Enhanced - ~100 lines)
- **新增職責**: 
  - 完整的錯誤處理與用戶友好錯誤顯示
  - 配置驗證與初始化流程
  - 全局事件監聽（頁面可見性變化）
- **特點**: 從極簡變為健壯的啟動器
- **修改頻率**: 穩定，偶爾優化錯誤處理

### 2. 配置中心層 (New - ~800 lines)
- **新增層級**: 統一的配置管理系統
- **職責**: 
  - 遊戲參數統一管理（戰力、重錘、三參數等）
  - 配置驗證與熱更新支援
  - 戰力計算工具集（統一開根號顯示）
- **特點**: 提供 GameConfigUtils 工具集
- **修改頻率**: 經常（新功能配置）

### 3. 總控層 (Evolved - ~600 lines)
- **進化職責**: 
  - 關卡進度管理（20關 + Boss關 + 事件關）
  - 重錘徽章系統整合
  - 戰力系統統一顯示與計算
  - 里程碑獎勵發放
- **新增功能**: 
  - 升級選擇界面
  - 遊戲結束畫面優化
  - 徽章獲得動畫
- **修改頻率**: 中等（新機制整合時）

### 4. 系統層 (Advanced - 200-400 lines each)
#### BattleSystem.js
- **核心升級**: 
  - 重錘技能觸發與特效系統
  - 反甲護盾機制
  - 暴擊與buff效果處理
- **特點**: 支援複雜的戰鬥特效鏈

#### EventSystem.js  
- **新增功能**: 
  - 智慧商店生成
  - 稀有度權重系統
- **特點**: 基於玩家進度動態調整

#### GameSimulator.js
- **AI功能**: 
  - 自動測試不同BD組合
  - 平衡性驗證
- **特點**: 開發輔助工具

### 5. 實體層 (Complex - 200-400 lines each)
#### Player.js
- **重大進化**: 
  - 完整的重錘技能樹系統
  - 多種徽章效果整合
  - 戰力計算與狀態管理
- **新增特性**: 
  - 重錘精通、風暴、護盾、恢復、狂怒等
  - 臨時buff系統
  - 效果優先級管理

#### Enemy.js
- **智慧升級**: 
  - 三參數平衡系統
  - 目標戰力自動適配
  - 不同敵人類型特化
- **特點**: 數學模型驅動的動態平衡

### 6. UI層 (Enhanced - ~400 lines)
- **視覺升級**: 
  - 戰力統一顯示（開根號模式）
  - 重錘特效與buff顯示
  - 徽章獲得動畫系統
- **新增功能**: 
  - 暫停界面優化
  - 即時戰力對比
  - 詳細數據面板

### 7. 存儲層 (Stable - ~50 lines)
- **職責不變**: localStorage操作
- **修改頻率**: 很少

### 8. 數據層 (Expanded - 100-300 lines each)
#### badges.js
- **大幅擴展**: 
  - 重錘BD完整技能樹
  - 多流派徽章支援
  - 策略分析工具
- **特點**: 固定值+百分比混合系統

#### enemies.js
- **智慧升級**: 
  - 三參數模板系統
  - 動態平衡演算法
- **特點**: 數學公式驅動

#### upgradeRewards.js (New)
- **新增系統**: 
  - 關卡後升級選擇
  - 稀有度權重
  - 效果描述生成

## 🎯 核心系統整合

### 戰力系統 2.0
```javascript
// 統一戰力計算與顯示
const playerPower = GameConfigUtils.calculatePlayerCombatPower(player);
console.log(`戰力: ${playerPower.displayPower} (DPS:${playerPower.dps}, EHP:${playerPower.ehp})`);
```

### 重錘BD系統
```javascript
// 技能樹進化路徑
基礎: 重錘精通 (🔨)
  ├─ 攻擊分支: 重錘風暴 (🌪️) → 重錘狂怒 (🔥)
  ├─ 防禦分支: 重錘護盾 (🛡️) → 重錘恢復 (💚)  
  └─ 強化分支: 重錘加重 (⚡) → 重錘延續 (⏱️)
```

### 三參數平衡系統
```javascript
// 智慧敵人生成
const enemyType = selectEnemyType(level);           // 選擇類型
const enemy = new Enemy(level, enemyType);          // 生成敵人
const balanced = autoBalance(enemy, targetPower);   // 自動平衡
```

## 🏗️ 文件規模統計（進化版）

| 層級 | 文件數量 | 單文件行數 | 總行數預估 | 複雜度 |
|------|----------|------------|------------|--------|
| 主入口 | 1 | ~100 | 100 | 中等 |
| 配置層 | 1 | ~800 | 800 | 高 |
| 總控層 | 1 | ~600 | 600 | 高 |
| 系統層 | 3 | 200-400 | 900 | 高 |
| 實體層 | 2 | 200-400 | 600 | 中高 |
| UI層 | 1 | ~400 | 400 | 中等 |
| 存儲層 | 1 | ~50 | 50 | 低 |
| 數據層 | 3 | 100-300 | 600 | 中等 |
| **總計** | **13** | - | **4050** | **中高** |

## 🔧 開發工作流程（2024版）

### 平衡調整 (60%的工作)
1. 修改 `config/GameConfig.js` 數值參數
2. 使用 GameSimulator.js 驗證平衡性
3. 調整 `data/` 中的徽章效果
4. 測試不同BD組合
5. 完成！⚖️

### 新徽章開發 (20%的工作)
1. 在 `data/badges.js` 添加徽章定義
2. 更新 Player.js 效果處理邏輯
3. 在 BattleSystem.js 添加觸發機制
4. 更新 UIManager.js 顯示效果
5. 完成！🎖️

### 新機制開發 (15%的工作)
1. 更新 `config/GameConfig.js` 配置
2. 修改 `systems/` 核心邏輯
3. 調整實體層支援
4. 更新數據層
5. 完成！🛠️

### UI優化 (5%的工作)
1. 修改 `ui/UIManager.js` 渲染邏輯
2. 調整 `styles/` CSS樣式
3. 測試視覺效果
4. 完成！🎨

## 🎨 代碼風格約定（進化版）

- **配置驅動**: 所有數值通過 GameConfig 統一管理
- **事件驅動**: 使用 EventSystem 解耦模組通信
- **戰力統一**: 使用 GameConfigUtils 統一戰力計算與顯示
- **分層清晰**: 配置→總控→系統→實體→UI→數據
- **測試友好**: GameSimulator 提供自動化驗證

## 🚀 架構優勢

- ✅ **配置統一**: 一處修改，全局生效
- ✅ **智慧平衡**: 三參數系統自動適配
- ✅ **擴展性強**: 新徽章只需數據層修改
- ✅ **開發效率**: 80%工作只需調參數
- ✅ **視覺統一**: 戰力顯示標準化
- ✅ **測試完善**: AI驗證確保平衡性

這種進化架構確保了遊戲在保持簡潔的同時，擁有豐富的功能深度和良好的可維護性。