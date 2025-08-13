// src/game/Enemy.js
import { getEnemyStats } from '../data/Enemies.js';

class Enemy {
  constructor(level, type) {
    console.log(`嘗試創建敵人: 等級 ${level}, 類型 ${type}`);
    
    // 使用敵人數據系統生成屬性
    const stats = getEnemyStats(level, type);
    
    // 複製所有屬性到當前實例
    this.name = stats.name;
    this.emoji = stats.emoji;
    this.description = stats.description;
    this.type = stats.type;
    this.level = stats.level;
    this.maxHp = stats.maxHp;
    this.hp = stats.hp;
    this.attack = stats.attack;
    this.attackSpeed = stats.attackSpeed;
    this.attackFrame = stats.attackFrame;
    this.defense = stats.defense;
    this.currentFrame = stats.currentFrame;
    
    console.log(`✅ 創建敵人成功: ${this.name} (${this.type}) - 等級 ${this.level}`);
    console.log(`📊 屬性: HP ${this.hp}/${this.maxHp}, 攻擊 ${this.attack}, 攻速 ${this.attackSpeed}, 防禦 ${this.defense}`);
  }

  // 攻擊方法
  attack() {
    return this.attack;
  }

  // 受到傷害
  takeDamage(damage) {
    const actualDamage = Math.max(1, damage - this.defense);
    this.hp = Math.max(0, this.hp - actualDamage);
    console.log(`${this.name} 受到 ${actualDamage} 傷害，剩餘 HP: ${this.hp}/${this.maxHp}`);
    return this.hp <= 0; // 返回是否死亡
  }

  // 獲取顯示名稱
  getDisplayName() {
    return `${this.emoji} ${this.name}`;
  }

  // 獲取類型名稱  
  getTypeName() {
    return this.name;
  }

  // 獲取表情符號
  getEmoji() {
    return this.emoji;
  }

  // 重置攻擊框架
  reset() {
    this.currentFrame = 0;
  }

  // 獲取詳細信息（用於調試）
  getInfo() {
    return {
      name: this.name,
      type: this.type,
      level: this.level,
      hp: this.hp,
      maxHp: this.maxHp,
      attack: this.attack,
      attackSpeed: this.attackSpeed,
      defense: this.defense
    };
  }
}

export default Enemy;