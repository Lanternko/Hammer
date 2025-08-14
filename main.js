// 文件位置：main.js
// 修復：確保模組載入順序和錯誤處理

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

// 使用模組檢查器進行全面診斷
async function initializeGame() {
  try {
    console.log('🔄 開始遊戲初始化診斷...');
    
    // 1. 檢查基礎環境
    const envCheck = await ModuleChecker.checkGameInitialization();
    if (!envCheck) {
      throw new Error('遊戲初始化環境檢查失敗');
    }
    
    // 2. 檢查網路連接
    const networkCheck = await ModuleChecker.checkNetworkConnectivity();
    if (!networkCheck) {
      console.warn('⚠️ 網路連接可能有問題，但嘗試繼續...');
    }
    
    // 3. 導入模組檢查器
    let ModuleChecker;
    try {
      const moduleCheckerModule = await import('./src/utils/ModuleChecker.js');
      ModuleChecker = moduleCheckerModule.ModuleChecker || moduleCheckerModule.default;
    } catch (checkerError) {
      console.warn('⚠️ 模組檢查器載入失敗，使用簡化檢查:', checkerError);
    }
    
    // 4. 進行全面模組檢查
    if (ModuleChecker) {
      const checker = new ModuleChecker();
      const report = await checker.checkAllModules();
      
      if (report.errorCount > 0) {
        throw new Error(`模組載入失敗: ${report.errorCount}/${report.totalModules} 個模組有問題`);
      }
    }
    
    // 5. 載入 GameManager
    console.log('📦 載入 GameManager...');
    const { default: GameManager } = await import('./src/game/GameManager.js');
    
    if (!GameManager || typeof GameManager !== 'function') {
      throw new Error('GameManager 不是有效的建構函數');
    }
    
    // 6. 創建遊戲實例
    console.log('🏗️ 創建遊戲實例...');
    const game = new GameManager();
    
    // 7. 設置全局變數
    window.game = game;
    window.GameManager = GameManager;
    
    // 8. 延遲啟動遊戲
    setTimeout(() => {
      try {
        console.log('🚀 啟動遊戲...');
        game.startGame();
        console.log('✅ 遊戲啟動成功');
      } catch (startError) {
        console.error('❌ 遊戲啟動失敗:', startError);
        showErrorMessage('啟動失敗', startError.message);
      }
    }, 300);
    
  } catch (error) {
    console.error('❌ 遊戲初始化失敗:', error);
    console.error('錯誤詳情:', error.stack);
    
    showErrorMessage('初始化失敗', error.message);
    
    // 顯示詳細錯誤信息
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
      max-width: 600px;
      width: 90%;
    `;
    
    detailsDiv.innerHTML = `
      <h2 style="margin-bottom: 15px;">🚨 遊戲載入失敗</h2>
      <p style="margin-bottom: 10px;"><strong>錯誤信息:</strong> ${error.message}</p>
      <p style="margin-bottom: 20px; font-size: 14px; opacity: 0.9;">
        請檢查：<br>
        1. 所有 .js 文件是否存在<br>
        2. 網路連接是否正常<br>
        3. 瀏覽器控制台是否有其他錯誤
      </p>
      <button onclick="location.reload()" style="
        padding: 12px 24px;
        background: white;
        color: red;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
        font-size: 16px;
        margin-right: 10px;
      ">🔄 重新載入</button>
      <button onclick="this.parentElement.remove()" style="
        padding: 12px 24px;
        background: transparent;
        color: white;
        border: 2px solid white;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
        font-size: 16px;
      ">❌ 關閉</button>
    `;
    
    document.body.appendChild(detailsDiv);
  }
}

// 頁面載入完成後初始化遊戲
document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM 載入完成');
  
  // 延遲執行，確保所有資源都已載入
  setTimeout(() => {
    initializeGame();
  }, 100);
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