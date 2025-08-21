// main.js - Game Entry Point (配置化修復版)
import GameManager from './src/game/GameManager.js';
import { GAME_CONFIG, initializeGameConfig } from './src/config/GameConfig.js';

console.log('📁 main.js loaded');
console.log('⚙️ Game config loaded:', GAME_CONFIG ? 'Config ready' : 'Config missing');
console.log('🔍 GameManager imported:', GameManager);
console.log('🔍 GameManager is constructor?', typeof GameManager === 'function');

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎮 Initializing Combat Arena...');
  
  try {
    // 首先初始化並驗證配置
    const configValid = initializeGameConfig();
    if (!configValid) {
      throw new Error('Game configuration validation failed');
    }
    
    // Create and start game
    console.log('🏗️ Creating GameManager instance...');
    const game = new GameManager();
    console.log('✅ GameManager created successfully:', game);
    
    // Start game after a short delay to ensure UI is ready
    setTimeout(() => {
      console.log('🚀 Starting game...');
      game.startGame();
      console.log('✅ Game started successfully');
    }, 100);
    
    // Make game globally accessible for debugging
    window.game = game;
    
  } catch (error) {
    console.error('❌ Failed to initialize game:', error);
    console.error('Error stack:', error.stack);
    
    // Display error message
    document.body.innerHTML += `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 0, 0, 0.9);
        color: white;
        padding: 20px;
        border-radius: 15px;
        text-align: center;
        z-index: 9999;
        font-family: Arial, sans-serif;
        max-width: 600px;
        width: 90%;
      ">
        <h2>🚨 Game Initialization Error</h2>
        <p><strong>Error:</strong> ${error.message}</p>
        <div style="margin: 15px 0; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 8px; text-align: left;">
          <strong>Possible solutions:</strong><br>
          • Check browser console for additional errors<br>
          • Clear browser cache and reload<br>
          • Ensure all .js files are loading correctly<br>
          • Check network connection
        </div>
        <button onclick="location.reload()" style="
          margin-top: 15px;
          padding: 10px 20px;
          background: white;
          color: red;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        ">🔄 Reload Game</button>
        
        <details style="margin-top: 15px; text-align: left;">
          <summary style="cursor: pointer; color: #ffcccb;">Technical Details</summary>
          <pre style="margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 5px; font-size: 11px; overflow-x: auto; white-space: pre-wrap;">${error.stack || 'No stack trace available'}</pre>
        </details>
      </div>
    `;
  }
});

// Handle page visibility changes (pause/resume)
document.addEventListener('visibilitychange', () => {
  if (window.game && window.game.battleSystem) {
    if (document.hidden) {
      console.log('⏸️ Game paused (tab hidden)');
    } else {
      console.log('▶️ Game resumed (tab visible)');
    }
  }
});