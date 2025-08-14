// 新增文件位置：src/utils/ModuleChecker.js
// 模組載入檢查和診斷工具

export class ModuleChecker {
  constructor() {
    this.requiredModules = [
      { name: 'Player', path: './src/game/Player.js' },
      { name: 'Enemy', path: './src/game/Enemy.js' },
      { name: 'BattleSystem', path: './src/systems/BattleSystem.js' },
      { name: 'EventSystem', path: './src/systems/EventSystem.js' },
      { name: 'BadgeData', path: './src/data/badges.js' },
      { name: 'EnemyData', path: './src/data/enemies.js' },
      { name: 'UpgradeRewards', path: './src/data/upgradeRewards.js' }
    ];
    
    this.loadedModules = new Map();
    this.errors = [];
  }

  // 檢查所有必要模組
  async checkAllModules() {
    console.log('🔍 開始檢查所有模組...');
    
    for (const module of this.requiredModules) {
      try {
        await this.checkModule(module);
      } catch (error) {
        this.errors.push({ module: module.name, error: error.message });
        console.error(`❌ 模組 ${module.name} 載入失敗:`, error);
      }
    }
    
    return this.generateReport();
  }

  // 檢查單個模組
  async checkModule(moduleInfo) {
    try {
      console.log(`🔄 檢查模組: ${moduleInfo.name}`);
      
      const module = await import(moduleInfo.path);
      
      if (!module) {
        throw new Error(`模組 ${moduleInfo.name} 導入為空`);
      }
      
      // 檢查導出內容
      const exports = Object.keys(module);
      if (exports.length === 0) {
        throw new Error(`模組 ${moduleInfo.name} 沒有導出任何內容`);
      }
      
      this.loadedModules.set(moduleInfo.name, {
        module,
        exports,
        status: 'success'
      });
      
      console.log(`✅ 模組 ${moduleInfo.name} 載入成功，導出: ${exports.join(', ')}`);
      
    } catch (error) {
      this.loadedModules.set(moduleInfo.name, {
        module: null,
        exports: [],
        status: 'error',
        error: error.message
      });
      
      throw error;
    }
  }

  // 生成診斷報告
  generateReport() {
    const report = {
      totalModules: this.requiredModules.length,
      loadedCount: Array.from(this.loadedModules.values()).filter(m => m.status === 'success').length,
      errorCount: this.errors.length,
      errors: this.errors,
      details: Array.from(this.loadedModules.entries()).map(([name, info]) => ({
        name,
        status: info.status,
        exports: info.exports,
        error: info.error
      }))
    };
    
    console.log('📊 模組檢查報告:', report);
    
    if (report.errorCount > 0) {
      this.displayErrorReport(report);
    }
    
    return report;
  }

  // 顯示錯誤報告
  displayErrorReport(report) {
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
      text-align: left;
      z-index: 10000;
      font-family: 'Consolas', 'Monaco', monospace;
      max-width: 80%;
      max-height: 80%;
      overflow-y: auto;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    `;
    
    const errorDetails = report.errors.map(err => 
      `<div style="margin-bottom: 10px; padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 5px;">
        <strong>${err.module}:</strong><br>
        <span style="color: #ffcccb; font-size: 14px;">${err.error}</span>
      </div>`
    ).join('');
    
    const successDetails = report.details
      .filter(d => d.status === 'success')
      .map(d => `<span style="color: #90EE90;">✅ ${d.name}</span>`)
      .join('<br>');
    
    errorDiv.innerHTML = `
      <h2 style="color: #ff6b6b; margin-bottom: 20px;">🚨 模組載入診斷報告</h2>
      
      <div style="margin-bottom: 20px; padding: 15px; background: rgba(0, 0, 0, 0.2); border-radius: 10px;">
        <strong>載入狀態:</strong><br>
        成功: ${report.loadedCount}/${report.totalModules}<br>
        失敗: ${report.errorCount}
      </div>
      
      ${report.errorCount > 0 ? `
        <div style="margin-bottom: 20px;">
          <strong style="color: #ff6b6b;">❌ 載入失敗的模組:</strong><br>
          ${errorDetails}
        </div>
      ` : ''}
      
      ${successDetails ? `
        <div style="margin-bottom: 20px;">
          <strong style="color: #90EE90;">✅ 載入成功的模組:</strong><br>
          ${successDetails}
        </div>
      ` : ''}
      
      <div style="margin-top: 20px; text-align: center;">
        <button onclick="this.parentElement.remove()" style="
          padding: 10px 20px;
          background: white;
          color: red;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          margin-right: 10px;
        ">關閉報告</button>
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
    
    document.body.appendChild(errorDiv);
  }

  // 檢查特定功能
  static async checkGameInitialization() {
    try {
      console.log('🎮 檢查遊戲初始化環境...');
      
      // 檢查 DOM 元素
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
      
      console.log('✅ 遊戲初始化環境檢查通過');
      return true;
      
    } catch (error) {
      console.error('❌ 遊戲初始化環境檢查失敗:', error);
      return false;
    }
  }

  // 診斷網路問題
  static async checkNetworkConnectivity() {
    try {
      console.log('🌐 檢查網路連接...');
      
      // 嘗試載入一個小文件來測試網路
      const response = await fetch('./index.html', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      console.log('✅ 網路連接正常');
      return true;
      
    } catch (error) {
      console.error('❌ 網路連接問題:', error);
      return false;
    }
  }
}

// 創建全局模組檢查器實例
window.moduleChecker = new ModuleChecker();

console.log('✅ ModuleChecker 載入完成');

export default ModuleChecker;