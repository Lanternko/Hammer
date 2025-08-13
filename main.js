// main.js - Game Entry Point
import GameManager from './src/game/GameManager.js';

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎮 Initializing Combat Arena...');
  
  // Create and start game
  const game = new GameManager();
  
  // Start game after a short delay to ensure UI is ready
  setTimeout(() => {
    game.startGame();
  }, 500);
  
  // Make game globally accessible for debugging
  window.game = game;
});

// Handle page visibility changes (pause/resume)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('⏸️ Game paused (tab hidden)');
  } else {
    console.log('▶️ Game resumed (tab visible)');
  }
});