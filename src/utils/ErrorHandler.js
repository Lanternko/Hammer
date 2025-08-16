// src/utils/ErrorHandler.js - 錯誤處理模組
class ErrorHandler {
  constructor(gameManager) {
    this.gameManager = gameManager;
    this.errorLog = [];
    this.maxErrorLog = 50;
  }

  // 🚨 顯示初始化錯誤
  showInitializationError(error) {
    console.error('❌ 遊戲初始化錯誤:', error);
    this.logError('initialization', error);
    
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 0, 0, 0.9);
      color: white;
      padding: 30px;
      border-radius: 15px;
      text-align: center;
      z-index: 9999;
      font-family: Arial, sans-serif;
      max-width: 500px;
      width: 90%;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7);
    `;
    
    errorDiv.innerHTML = `
      <h2 style="margin-bottom: 15px;">🚨 遊戲初始化錯誤</h2>
      <p style="margin-bottom: 15px;"><strong>錯誤信息:</strong> ${error.message}</p>
      <p style="margin-bottom: 20px; font-size: 14px; opacity: 0.9;">
        這通常是因為模組載入順序問題或依賴缺失。
      </p>
      
      <div style="margin-bottom: 20px; text-align: left; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 10px;">
        <strong style="color: #ffcccb;">常見解決方案:</strong><br>
        <ul style="margin: 10px 0; padding-left: 20px; font-size: 14px;">
          <li>檢查瀏覽器控制台是否有其他錯誤</li>
          <li>清除瀏覽器快取並重新載入</li>
          <li>確認所有 .js 文件路徑正確</li>
          <li>檢查網路連接是否正常</li>
        </ul>
      </div>
      
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
        ">🔄 重新載入遊戲</button>
        <button onclick="this.parentElement.parentElement.remove()" style="
          padding: 12px 24px;
          background: transparent;
          color: white;
          border: 2px solid white;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          font-size: 16px;
        ">❌ 關閉錯誤</button>
      </div>
      
      <details style="margin-top: 20px; text-align: left;">
        <summary style="cursor: pointer; color: #ffcccb; font-size: 14px;">點擊查看技術詳情</summary>
        <pre style="margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 5px; font-size: 12px; overflow-x: auto; white-space: pre-wrap;">${error.stack || '無堆疊信息'}</pre>
      </details>
    `;
    
    document.body.appendChild(errorDiv);
  }

  // ⚠️ 顯示運行時錯誤
  showRuntimeError(error, context = 'unknown') {
    console.error(`❌ 運行時錯誤 [${context}]:`, error);
    this.logError(context, error);
    
    // 對於非關鍵錯誤，只顯示簡單通知
    if (this.isNonCriticalError(error, context)) {
      this.showErrorNotification(error.message, context);
      return;
    }
    
    // 關鍵錯誤顯示完整錯誤對話框
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
      z-index: 9998;
      font-family: Arial, sans-serif;
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7);
    `;
    
    errorDiv.innerHTML = `
      <h2 style="margin-bottom: 15px;">⚠️ 運行時錯誤</h2>
      <p style="margin-bottom: 10px;"><strong>錯誤位置:</strong> ${context}</p>
      <p style="margin-bottom: 15px;"><strong>錯誤信息:</strong> ${error.message}</p>
      
      <div style="margin-bottom: 20px; padding: 15px; background: rgba(0,0,0,0.3); border-radius: 10px; text-align: left;">
        <strong style="color: #ffd700;">🔧 建議操作:</strong><br>
        <div style="margin-top: 10px; font-size: 14px;">
          ${this.getErrorSuggestions(error, context)}
        </div>
      </div>
      
      <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 15px;">
        <button onclick="this.parentElement.remove()" style="
          padding: 10px 20px;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        ">✅ 繼續遊戲</button>
        <button onclick="location.reload()" style="
          padding: 10px 20px;
          background: #FF9800;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        ">🔄 重新載入</button>
      </div>
      
      <details style="text-align: left;">
        <summary style="cursor: pointer; color: #ffcccb;">技術詳情</summary>
        <pre style="margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 5px; font-size: 11px; overflow-x: auto; white-space: pre-wrap;">${error.stack || '無堆疊信息'}</pre>
      </details>
    `;
    
    document.body.appendChild(errorDiv);
  }

  // 🔕 顯示簡單錯誤通知
  showErrorNotification(message, context = '') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(255, 107, 107, 0.95);
      color: white;
      padding: 15px 20px;
      border-radius: 10px;
      z-index: 9997;
      font-family: Arial, sans-serif;
      max-width: 400px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      animation: slideInFromRight 0.3s ease-out;
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="font-size: 20px;">⚠️</div>
        <div>
          <div style="font-weight: bold; margin-bottom: 3px;">錯誤通知</div>
          <div style="font-size: 14px; opacity: 0.9;">${message}</div>
          ${context ? `<div style="font-size: 12px; opacity: 0.7; margin-top: 2px;">位置: ${context}</div>` : ''}
        </div>
        <button onclick="this.parentElement.remove()" style="
          background: none;
          border: none;
          color: white;
          font-size: 18px;
          cursor: pointer;
          padding: 0;
          margin-left: auto;
        ">×</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // 5秒後自動移除
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
    
    this.addNotificationStyle();
  }

  addNotificationStyle() {
    if (!document.querySelector('#errorNotificationStyle')) {
      const style = document.createElement('style');
      style.id = 'errorNotificationStyle';
      style.textContent = `
        @keyframes slideInFromRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // 🔍 判斷是否為非關鍵錯誤
  isNonCriticalError(error, context) {
    const nonCriticalContexts = [
      'ui-update',
      'animation',
      'sound',
      'particle',
      'cosmetic'
    ];
    
    const nonCriticalMessages = [
      'animation',
      'style',
      'css',
      'transition',
      'tooltip'
    ];
    
    return nonCriticalContexts.includes(context) || 
           nonCriticalMessages.some(keyword => 
             error.message.toLowerCase().includes(keyword)
           );
  }

  // 💡 獲取錯誤建議
  getErrorSuggestions(error, context) {
    const suggestions = [];
    
    if (context.includes('battle')) {
      suggestions.push('• 嘗試暫停戰鬥並重新開始');
      suggestions.push('• 檢查玩家和敵人數據是否完整');
    }
    
    if (context.includes('ui')) {
      suggestions.push('• 這是UI相關錯誤，通常不影響遊戲核心功能');
      suggestions.push('• 可以繼續遊戲，或重新載入頁面');
    }
    
    if (context.includes('save') || context.includes('load')) {
      suggestions.push('• 清除瀏覽器 localStorage 數據');
      suggestions.push('• 檢查瀏覽器是否支持本地存儲');
    }
    
    if (error.message.includes('null') || error.message.includes('undefined')) {
      suggestions.push('• 某些遊戲對象可能未正確初始化');
      suggestions.push('• 建議重新載入遊戲');
    }
    
    if (error.message.includes('network') || error.message.includes('fetch')) {
      suggestions.push('• 檢查網路連接');
      suggestions.push('• 重新載入頁面以重新獲取資源');
    }
    
    if (suggestions.length === 0) {
      suggestions.push('• 這是一個未預期的錯誤');
      suggestions.push('• 建議重新載入遊戲');
      suggestions.push('• 如果問題持續，請檢查瀏覽器控制台');
    }
    
    return suggestions.join('<br>');
  }

  // 📝 記錄錯誤
  logError(context, error) {
    const errorEntry = {
      timestamp: new Date().toISOString(),
      context: context,
      message: error.message,
      stack: error.stack,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    this.errorLog.push(errorEntry);
    
    // 限制錯誤日誌大小
    if (this.errorLog.length > this.maxErrorLog) {
      this.errorLog = this.errorLog.slice(-this.maxErrorLog);
    }
    
    // 嘗試保存到 localStorage（如果可用）
    try {
      localStorage.setItem('gameErrorLog', JSON.stringify(this.errorLog.slice(-10)));
    } catch (e) {
      // localStorage 不可用，忽略
    }
  }

  // 📊 獲取錯誤統計
  getErrorStats() {
    const stats = {
      totalErrors: this.errorLog.length,
      recentErrors: this.errorLog.filter(e => 
        Date.now() - new Date(e.timestamp).getTime() < 300000 // 5分鐘內
      ).length,
      contexts: {},
      commonMessages: {}
    };
    
    this.errorLog.forEach(error => {
      stats.contexts[error.context] = (stats.contexts[error.context] || 0) + 1;
      stats.commonMessages[error.message] = (stats.commonMessages[error.message] || 0) + 1;
    });
    
    return stats;
  }

  // 🧹 清理錯誤日誌
  clearErrorLog() {
    this.errorLog = [];
    try {
      localStorage.removeItem('gameErrorLog');
    } catch (e) {
      // 忽略
    }
    console.log('🧹 錯誤日誌已清理');
  }

  // 📤 導出錯誤報告
  exportErrorReport() {
    const report = {
      timestamp: new Date().toISOString(),
      gameVersion: '1.0.0', // 可以從配置文件獲取
      userAgent: navigator.userAgent,
      url: window.location.href,
      stats: this.getErrorStats(),
      recentErrors: this.errorLog.slice(-20)
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `game-error-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('📤 錯誤報告已導出');
  }

  // 🔧 安全執行函數
  safeExecute(fn, context = 'unknown', fallback = null) {
    try {
      return fn();
    } catch (error) {
      this.showRuntimeError(error, context);
      return fallback;
    }
  }

  // 🔧 安全異步執行函數
  async safeExecuteAsync(fn, context = 'unknown', fallback = null) {
    try {
      return await fn();
    } catch (error) {
      this.showRuntimeError(error, context);
      return fallback;
    }
  }

  // 🛡️ 包裝器方法 - 為函數添加錯誤處理
  wrapWithErrorHandling(fn, context) {
    return (...args) => {
      return this.safeExecute(() => fn(...args), context);
    };
  }

  wrapAsyncWithErrorHandling(fn, context) {
    return async (...args) => {
      return await this.safeExecuteAsync(() => fn(...args), context);
    };
  }
}

export default ErrorHandler;