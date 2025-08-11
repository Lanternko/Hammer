# 遊戲架構藍圖 (Architecture.md)

## 總體架構

本遊戲為網頁單機遊戲，使用 HTML5 + CSS + JavaScript 開發。核心引擎以純 JS 實現，支援 20 frames/秒 戰鬥系統。存儲使用 localStorage，無需後端。模組設計模組化，便於擴展。

- **技術棧**：
  - 前端：Canvas 繪製戰鬥 UI。
  - 引擎：requestAnimationFrame 驅動遊戲迴圈。
  - 存儲：localStorage 保存英雄、鑽石、金幣。

## 核心模組

### GameManager
管理遊戲流程，包括關卡進度 (20 關)、狀態切換 (戰鬥/事件/結算)。

資料結構：
```javascript
const GameState = {
  currentLevel: 1,
  player: null,
  enemy: null,
  state: 'battle',
  gold: 0,
  diamonds: 0
};
```

方法：`startGame()`、`nextLevel()`、`triggerEvent()`、`endGame()`。

### Player
處理巨鎚英雄屬性，如生命 100、攻擊 20、攻速 0.5。

資料結構：
```javascript
const Player = {
  hp: 100,
  attack: 20,
  attackSpeed: 0.5,
  armor: 20,
  flatReduction: 5,
  badges: [],
  attackFrame: 40
};
```

方法：`attack()`、`takeDamage()`、`equipBadge()`。

### Enemy
生成敵人，血量隨關卡膨脹 (基礎 × (1 + 關卡/5))。

資料結構：
```javascript
const Enemy = {
  hp: 72,
  attack: 8,
  attackSpeed: 1.5,
  attackFrame: 13,
  type: 'highSpeed'
};
```

方法：`attack()`、`takeDamage()`。

### BattleSystem
20 frames/秒 戰鬥邏輯，傷害結算：先防御、後固定減傷。

資料結構：
```javascript
const BattleState = {
  frameCount: 0,
  isActive: false
};
```

方法：`tick()`、`calculateDamage()`、`endBattle()`。

範例邏輯：
```javascript
function tick() {
  // 檢查攻擊 frame，結算傷害
  let damage = Math.max(0, (rawDamage / (1 + armor/100)) - flatReduction);
}
```

### EventSystem
事件與商店 (第 3、8、13、18 關)，隨機生成選項。

資料結構：
```javascript
const Event = {
  type: 'shop',
  options: [{ type: 'badge', cost: 5, effect: { armor: 10 } }]
};
```

方法：`generateEvent()`、`buyItem()`。

### UIManager
渲染 UI，如血條、進度條、傷害數字。

方法：`drawBattle()`、`showDamage()`、`renderEvent()`。

使用 Canvas 繪製血條與攻速進度條，每 0.05 秒更新。

### StorageManager
存取進度。

資料結構：
```javascript
const SaveData = {
  diamonds: 0,
  heroes: ['hammer']
};
```

方法：`save()`、`load()`。

## 經濟與平衡

- 金幣：每關 1，小 Boss 2，利息每 10 金 +1 (上限 3)。
- 徽章：+10 防御、+20 血量、+0.2 攻速。
- 敵人血量：基礎 60 × (1 + 關卡/5)，小 Boss ×2。

## 擴展性

- 新英雄：擴展 Player 類，添加被動技能。
- 新敵人：新增 Enemy 類型，如帶真實傷害。
- 排行榜：未來加 Node.js 後端，呼叫 API (https://x.ai/api)。