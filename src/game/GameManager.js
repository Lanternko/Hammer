import Player from './Player.js';
import Enemy from './Enemy.js';
import BattleSystem from '../systems/BattleSystem.js';

// GameManager handles the game state, player, and enemy management
// It orchestrates the game flow, including starting battles and managing levels.
// 支援5關流程，自動進入下一關，第5關生成小Boss。

class GameManager {
  constructor() {
    this.currentLevel = 1;
    this.player = new Player();
    this.enemy = null;
    this.state = 'battle';
    this.gold = 0;
    this.diamonds = 0;
  }

  startGame() {
    console.log('遊戲啟動');
    this.nextLevel();
  }

  nextLevel() {
    if (this.currentLevel > 5) { // MVP 測試5關
      return this.endGame();
    }
    const enemyType = this.currentLevel === 5 ? 'smallBoss' : this.getRandomEnemyType();
    this.enemy = new Enemy(this.currentLevel, enemyType);
    console.log(`進入關卡 ${this.currentLevel}, 敵人: ${enemyType}`);
    new BattleSystem(this.player, this.enemy, this).start();
  }

  endBattle(won) {
    if (!won) {
      console.log('玩家失敗，遊戲結束');
      return this.endGame();
    }
    this.gold += this.currentLevel === 5 ? 2 : 1; // 小Boss 2金幣
    console.log(`關卡 ${this.currentLevel} 完成，金幣: ${this.gold}`);
    this.currentLevel++;
    this.nextLevel();
  }

  endGame() {
    const diamonds = Math.floor(this.currentLevel / 2) + (this.currentLevel > 5 ? 2 : 0);
    console.log(`遊戲結束，獲得鑽石: ${diamonds}`);
    this.diamonds += diamonds;
  }

  getRandomEnemyType() {
    const types = ['highSpeed', 'highDamage', 'balanced'];
    return types[Math.floor(Math.random() * types.length)];
  }
}

export default GameManager;