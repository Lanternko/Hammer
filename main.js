// main.js - Game Entry Point (使用配置版本)
import GameManager from './src/game/GameManager.js';
import ErrorHandler from './src/utils/ErrorHandler.js';
import { GAME_CONFIG } from './src/config/GameConfig.js';

console.log('📁 main.js loaded');
console.log('⚙️ Game config loaded:', GAME_CONFIG.DEBUG.ENABLED ? GAME_CONFIG : 'Config ready');

// Initialize error handler
const errorHandler = new ErrorHandler();

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎮 Initializing Combat Arena...');
  
  try {
    // Create and start game
    console.log('🏗️ Creating GameManager instance...');
    const game = new GameManager();
    console.log('✅ GameManager created successfully:', game);
    
    // Start game after configured delay
    setTimeout(() => {
      console.log('🚀 Starting game...');
      game.startGame();
      console.log('✅ Game started successfully');
    }, GAME_CONFIG.UI_CONFIG.LOADING_SCREEN_DURATION);
    
    // Make game globally accessible for debugging
    window.game = game;
    
    // Global error handling for runtime errors
    window.addEventListener('error', (event) => {
      errorHandler.showRuntimeError(event.error, 'global-error');
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      errorHandler.showRuntimeError(event.reason, 'promise-rejection');
    });
    
  } catch (error) {
    console.error('❌ Failed to initialize game:', error);
    errorHandler.showInitializationError(error);
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