// 文件位置：main.js
// 修復：確保模組載入順序正確

console.log('📁 main.js loaded');


// 在 main.js 頂部添加全局狀態追蹤
let gameInitializationState = {
  isInitializing: false,
  isInitialized: false,
  initializationAttempts: 0
};

// 全局錯誤處理
window.addEventListener('error', (event) => {
  console.error('🚨 全局錯誤:', event.error);
  showErrorMessage('載入錯誤', event.error.message);
});

// 未處理的 Promise 錯誤
window.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 未處理的 Promise 錯誤:', event.reason);
  showErrorMessage('Promise 錯誤', event.reason);
});

// 錯誤顯示函數
function showErrorMessage(title, message) {
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(255, 0, 0, 0.9);
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    z-index: 10000;
    font-family: Arial, sans-serif;
    max-width: 400px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  `;
  
  errorDiv.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 5px;">${title}</div>
    <div style="font-size: 14px; opacity: 0.9;">${message}</div>
  `;
  
  document.body.appendChild(errorDiv);
  
  // 5秒後自動移除
  setTimeout(() => {
    if (errorDiv.parentNode) {
      errorDiv.remove();
    }
  }, 5000);
}

// 文件位置：main.js（替換 checkBasicEnvironment 函數）

// 修復：正確的 CSS 選擇器
function checkBasicEnvironment() {
  try {
    console.log('🎮 檢查基礎環境...');
    
    // 修復：正確的 CSS 選擇器（沒有空格表示同一元素有多個 class）
    const requiredElements = [
      { selector: '.round-counter', name: '關卡計數器' },
      { selector: '.character-card.hero', name: '英雄卡片' },  // 修復：移除空格
      { selector: '.character-card.enemy', name: '敵人卡片' }, // 修復：移除空格
      { selector: '.stats-panel', name: '統計面板' },
      { selector: '.combat-log', name: '戰鬥日誌' }
    ];
    
    const missingElements = [];
    const foundElements = [];
    
    requiredElements.forEach(element => {
      const domElement = document.querySelector(element.selector);
      if (!domElement) {
        missingElements.push(element);
        console.error(`❌ 缺少元素: ${element.name} (${element.selector})`);
      } else {
        foundElements.push(element);
        console.log(`✅ 找到元素: ${element.name}`);
      }
    });
    
    // 詳細診斷信息
    console.log(`📊 DOM 檢查結果: ${foundElements.length}/${requiredElements.length} 元素存在`);
    
    if (missingElements.length > 0) {
      console.error('❌ 缺少必要的 DOM 元素:', missingElements.map(e => e.name));
      
      // 顯示詳細的 DOM 診斷
      showDOMDiagnostic(missingElements, foundElements);
      return false;
    }
    
    // 檢查基本的全局變數
    if (typeof window === 'undefined') {
      console.error('❌ window 對象不存在');
      return false;
    }
    
    if (typeof document === 'undefined') {
      console.error('❌ document 對象不存在');
      return false;
    }
    
    // 檢查是否在正確的環境中運行
    if (!document.body) {
      console.error('❌ document.body 不存在');
      return false;
    }
    
    console.log('✅ 基礎環境檢查通過');
    return true;
    
  } catch (error) {
    console.error('❌ 基礎環境檢查失敗:', error);
    showEnvironmentError(error);
    return false;
  }
}

// 更新的 DOM 診斷信息
function showDOMDiagnostic(missingElements, foundElements) {
  const diagnosticDiv = document.createElement('div');
  diagnosticDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 0, 0, 0.95);
    color: white;
    padding: 30px;
    border-radius: 15px;
    text-align: left;
    z-index: 10000;
    font-family: 'Consolas', 'Monaco', monospace;
    max-width: 80%;
    max-height: 80%;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  `;
  
  const missingList = missingElements.map(e => 
    `<div style="color: #ffcccb; margin: 5px 0;">❌ ${e.name} (${e.selector})</div>`
  ).join('');
  
  const foundList = foundElements.map(e => 
    `<div style="color: #90EE90; margin: 5px 0;">✅ ${e.name}</div>`
  ).join('');
  
  diagnosticDiv.innerHTML = `
    <h2 style="color: #ff6b6b; margin-bottom: 20px;">🚨 DOM 元素檢查失敗</h2>
    
    <div style="margin-bottom: 20px;">
      <h3 style="color: #ffcccb; margin-bottom: 10px;">❌ 缺少的元素:</h3>
      ${missingList}
    </div>
    
    ${foundList ? `
      <div style="margin-bottom: 20px;">
        <h3 style="color: #90EE90; margin-bottom: 10px;">✅ 存在的元素:</h3>
        ${foundList}
      </div>
    ` : ''}
    
    <div style="margin-bottom: 20px; padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 10px;">
      <h3 style="color: #ffd700; margin-bottom: 10px;">🔧 修復建議:</h3>
      <div style="font-size: 14px; line-height: 1.6;">
        1. 確認 HTML 元素使用正確的 class 名稱<br>
        2. 檢查是否有重複的元素ID或class衝突<br>
        3. 確認 CSS 載入完成<br>
        4. 檢查 JavaScript 錯誤是否阻止 DOM 渲染<br>
        5. 嘗試清除瀏覽器快取並重新載入
      </div>
    </div>
    
    <div style="margin-bottom: 20px; padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 10px;">
      <h3 style="color: #ffd700; margin-bottom: 10px;">📋 預期的 HTML 結構:</h3>
      <pre style="font-size: 12px; color: #ccc; overflow-x: auto;">
&lt;div class="round-counter"&gt;Round 1 / 20&lt;/div&gt;
&lt;div class="character-card hero"&gt;...&lt;/div&gt;
&lt;div class="character-card enemy"&gt;...&lt;/div&gt;
&lt;div class="stats-panel"&gt;...&lt;/div&gt;
&lt;div class="combat-log"&gt;...&lt;/div&gt;
      </pre>
    </div>
    
    <div style="text-align: center;">
      <button onclick="this.parentElement.remove()" style="
        padding: 10px 20px;
        background: white;
        color: red;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
        margin-right: 10px;
      ">關閉診斷</button>
      <button onclick="location.reload()" style="
        padding: 10px 20px;
        background: #ff6b6b;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
      ">重新載入</button>
    </div>
  `;
  
  document.body.appendChild(diagnosticDiv);
}

// 顯示環境錯誤
function showEnvironmentError(error) {
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 0, 0, 0.95);
    color: white;
    padding: 30px;
    border-radius: 15px;
    text-align: center;
    z-index: 10000;
    font-family: Arial, sans-serif;
    max-width: 500px;
    width: 90%;
  `;
  
  errorDiv.innerHTML = `
    <h2 style="margin-bottom: 15px;">🚨 環境檢查錯誤</h2>
    <p style="margin-bottom: 15px;">錯誤信息: ${error.message}</p>
    <p style="margin-bottom: 20px; font-size: 14px; opacity: 0.9;">
      這可能是因為瀏覽器環境不支持或頁面載入不完整。
    </p>
    <button onclick="location.reload()" style="
      padding: 10px 20px;
      background: white;
      color: red;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      font-size: 16px;
    ">🔄 重新載入</button>
  `;
  
  document.body.appendChild(errorDiv);
}

// 簡化版本的網路檢查
async function checkBasicNetwork() {
  try {
    console.log('🌐 檢查網路連接...');
    
    // 簡單的網路檢查
    if (navigator.onLine === false) {
      console.warn('⚠️ 瀏覽器顯示離線狀態');
      return false;
    }
    
    console.log('✅ 基礎網路檢查通過');
    return true;
    
  } catch (error) {
    console.error('❌ 網路檢查錯誤:', error);
    return false;
  }
}

// 修復後的初始化函數
async function initializeGame() {
  try {
    console.log('🔄 開始遊戲初始化...');
    
    // 1. 基礎環境檢查（不依賴外部模組）
    const envCheck = checkBasicEnvironment();
    if (!envCheck) {
      throw new Error('基礎環境檢查失敗');
    }
    
    // 2. 基礎網路檢查
    const networkCheck = await checkBasicNetwork();
    if (!networkCheck) {
      console.warn('⚠️ 網路連接可能有問題，但嘗試繼續...');
    }
    
    // 4. 載入核心遊戲模組
    console.log('📦 載入核心遊戲模組...');
    
    // 先載入依賴模組
    const [
      playerModule,
      enemyModule,
      battleSystemModule,
      eventSystemModule
    ] = await Promise.all([
      import('./src/game/Player.js'),
      import('./src/game/Enemy.js'),
      import('./src/systems/BattleSystem.js'),
      import('./src/systems/EventSystem.js')
    ]);
    
    console.log('✅ 依賴模組載入完成');
    
    // 載入 GameManager
    const { default: GameManager } = await import('./src/game/GameManager.js');
    
    if (!GameManager || typeof GameManager !== 'function') {
      throw new Error('GameManager 不是有效的建構函數');
    }
    
    console.log('✅ GameManager 載入成功');
    
    // 5. 創建遊戲實例
    console.log('🏗️ 創建遊戲實例...');
    const game = new GameManager();
    
    // 6. 設置全局變數
    window.game = game;
    window.GameManager = GameManager;
    
    console.log('✅ 遊戲實例創建成功');
    
    // 7. 啟動遊戲（延遲確保所有初始化完成）
    setTimeout(() => {
      try {
        console.log('🚀 啟動遊戲...');
        game.startGame();
        console.log('✅ 遊戲啟動成功');
      } catch (startError) {
        console.error('❌ 遊戲啟動失敗:', startError);
        showErrorMessage('啟動失敗', startError.message);
        showDetailedError('遊戲啟動失敗', startError);
      }
    }, 500); // 增加延遲時間確保初始化完成
    
  } catch (error) {
    console.error('❌ 遊戲初始化失敗:', error);
    console.error('錯誤詳情:', error.stack);
    
    showErrorMessage('初始化失敗', error.message);
    showDetailedError('遊戲初始化失敗', error);
  }
}

// 顯示詳細錯誤信息
function showDetailedError(title, error) {
  const detailsDiv = document.createElement('div');
  detailsDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 0, 0, 0.95);
    color: white;
    padding: 30px;
    border-radius: 15px;
    text-align: center;
    z-index: 9999;
    font-family: Arial, sans-serif;
    max-width: 700px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
  `;
  
  detailsDiv.innerHTML = `
    <h2 style="margin-bottom: 15px;">🚨 ${title}</h2>
    <p style="margin-bottom: 10px;"><strong>錯誤信息:</strong> ${error.message}</p>
    <details style="margin-bottom: 20px; text-align: left;">
      <summary style="cursor: pointer; color: #ffcccb;">點擊查看詳細錯誤堆疊</summary>
      <pre style="margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 5px; font-size: 12px; overflow-x: auto;">${error.stack || '無堆疊信息'}</pre>
    </details>
    <p style="margin-bottom: 20px; font-size: 14px; opacity: 0.9;">
      <strong>常見解決方案：</strong><br>
      1. 檢查所有 .js 文件是否存在於正確路徑<br>
      2. 清除瀏覽器快取並重新載入<br>
      3. 檢查瀏覽器控制台是否有其他錯誤<br>
      4. 確認網路連接正常<br>
      5. 檢查文件權限是否正確
    </p>
    <div style="display: flex; gap: 10px; justify-content: center;">
      <button onclick="location.reload()" style="
        padding: 12px 24px;
        background: white;
        color: red;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
        font-size: 16px;
      ">🔄 重新載入</button>
      <button onclick="this.parentElement.parentElement.remove()" style="
        padding: 12px 24px;
        background: transparent;
        color: white;
        border: 2px solid white;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
        font-size: 16px;
      ">❌ 關閉</button>
    </div>
  `;
  
  document.body.appendChild(detailsDiv);
}

// 頁面載入完成後初始化遊戲
document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM 載入完成');
  
  // 增加延遲時間，確保所有資源都已載入
  setTimeout(() => {
    initializeGame();
  }, 200);
});

// 處理頁面可見性變化（暫停/恢復）
document.addEventListener('visibilitychange', () => {
  if (window.game && window.game.battleSystem) {
    if (document.hidden) {
      console.log('⏸️ 遊戲暫停 (標籤頁隱藏)');
    } else {
      console.log('▶️ 遊戲恢復 (標籤頁可見)');
    }
  }
});

console.log('✅ main.js 初始化完成，等待 DOM 載入...');

// 文件位置：main.js（更新頁面載入邏輯）

// 確保 DOM 完全載入的函數
function waitForDOMReady() {
  return new Promise((resolve) => {
    if (document.readyState === 'complete') {
      // 如果頁面已經載入完成
      resolve();
    } else if (document.readyState === 'interactive') {
      // 如果 DOM 已載入但資源可能還在載入
      setTimeout(resolve, 100); // 稍等一下確保所有元素都已渲染
    } else {
      // 如果頁面還在載入
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(resolve, 100); // DOM 載入後再等待一點時間
      });
    }
  });
}

// 同時修復 waitForElementsReady 函數
async function waitForElementsReady() {
  const maxAttempts = 10;
  const delay = 200;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`🔍 DOM 元素檢查 (第 ${attempt}/${maxAttempts} 次)...`);
    
    // 修復：使用正確的選擇器
    const elements = [
      document.querySelector('.round-counter'),
      document.querySelector('.character-card.hero'),     // 修復：移除空格
      document.querySelector('.character-card.enemy'),    // 修復：移除空格
      document.querySelector('.stats-panel'),
      document.querySelector('.combat-log')
    ];
    
    const allElementsFound = elements.every(el => el !== null);
    
    if (allElementsFound) {
      console.log(`✅ 所有 DOM 元素在第 ${attempt} 次嘗試中找到`);
      return true;
    }
    
    // 詳細診斷哪些元素缺失
    const selectors = [
      '.round-counter',
      '.character-card.hero',
      '.character-card.enemy', 
      '.stats-panel',
      '.combat-log'
    ];
    
    elements.forEach((el, index) => {
      if (!el) {
        console.log(`⏳ 缺少元素: ${selectors[index]}`);
      }
    });
    
    console.log(`⏳ 第 ${attempt} 次嘗試中缺少元素，等待 ${delay}ms 後重試...`);
    
    // 等待一段時間後重試
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  console.error(`❌ 經過 ${maxAttempts} 次嘗試，仍有 DOM 元素缺失`);
  return false;
}

// 更新的 DOM 載入完成處理
document.addEventListener('DOMContentLoaded', async () => {
  console.log('📄 DOMContentLoaded 事件觸發');
  
  // 檢查是否已經處理過
  if (gameInitializationState.initializationAttempts > 0) {
    console.log('⏭️ DOMContentLoaded: 已處理過，跳過');
    return;
  }
  
  try {
    // 1. 等待 DOM 完全準備好
    await waitForDOMReady();
    console.log('✅ DOM 基礎載入完成');
    
    // 2. 等待所有必要元素準備好
    const elementsReady = await waitForElementsReady();
    
    if (!elementsReady) {
      throw new Error('DOM 元素載入超時，某些必要元素缺失');
    }
    
    // 3. 再額外等待一段時間確保渲染完成
    console.log('⏳ 等待頁面完全渲染...');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 4. 開始遊戲初始化
    console.log('🚀 開始遊戲初始化...');
    await initializeGame();
    
  } catch (error) {
    console.error('❌ DOM 載入或遊戲初始化失敗:', error);
    showErrorMessage('載入失敗', error.message);
  }
});

// 修復的備用方案：添加狀態檢查
window.addEventListener('load', async () => {
  console.log('📄 window.load 事件觸發（備用方案）');
  
  // 檢查遊戲是否已經初始化或正在初始化
  if (gameInitializationState.isInitialized || gameInitializationState.isInitializing) {
    console.log('⏭️ window.load: 遊戲已初始化或正在初始化，跳過備用方案');
    return;
  }
  
  console.log('🔄 使用備用方案初始化遊戲...');
  
  try {
    await new Promise(resolve => setTimeout(resolve, 500)); // 額外等待
    await initializeGame();
  } catch (error) {
    console.error('❌ 備用初始化也失敗:', error);
    showErrorMessage('備用載入失敗', error.message);
  }
});

// 頁面可見性檢查
if (document.hidden) {
  console.warn('⚠️ 頁面當前不可見，這可能影響初始化');
}

console.log('✅ main.js DOM 處理邏輯已載入');