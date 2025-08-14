// 文件位置：main.js
// 修復：確保模組載入順序正確

console.log('📁 main.js loaded');

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

// 簡化版本的基礎檢查（不依賴外部模組）
function checkBasicEnvironment() {
  try {
    console.log('🎮 檢查基礎環境...');
    
    // 檢查必要的 DOM 元素
    const requiredElements = [
      '.round-counter',
      '.hero .character-card',
      '.enemy .character-card',
      '.stats-panel',
      '.combat-log'
    ];
    
    const missingElements = requiredElements.filter(selector => !document.querySelector(selector));
    
    if (missingElements.length > 0) {
      console.error('❌ 缺少必要的 DOM 元素:', missingElements);
      return false;
    }
    
    // 檢查全局變數
    if (typeof window === 'undefined') {
      console.error('❌ window 對象不存在');
      return false;
    }
    
    console.log('✅ 基礎環境檢查通過');
    return true;
    
  } catch (error) {
    console.error('❌ 基礎環境檢查失敗:', error);
    return false;
  }
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
    
    // 3. 嘗試導入和使用 ModuleChecker（可選）
    let moduleReport = null;
    try {
      console.log('📦 嘗試載入模組檢查器...');
      const { ModuleChecker } = await import('./src/utils/ModuleChecker.js');
      
      if (ModuleChecker) {
        const checker = new ModuleChecker();
        moduleReport = await checker.checkAllModules();
        
        if (moduleReport.errorCount > 0) {
          console.warn(`⚠️ 發現 ${moduleReport.errorCount} 個模組問題，但嘗試繼續...`);
        }
      }
    } catch (checkerError) {
      console.warn('⚠️ 模組檢查器載入失敗，使用簡化初始化:', checkerError.message);
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