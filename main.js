// main.js - Game Entry Point
import GameManager from './src/game/GameManager.js';

console.log('📁 main.js loaded');
console.log('📦 GameManager imported:', GameManager);
console.log('🔍 GameManager is constructor?', typeof GameManager === 'function');

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎮 Initializing Combat Arena...');
  
  try {
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
      ">
        <h2>Game Initialization Error</h2>
        <p>Error: ${error.message}</p>
        <button onclick="location.reload()" style="
          margin-top: 15px;
          padding: 10px 20px;
          background: white;
          color: red;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        ">Reload Game</button>
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