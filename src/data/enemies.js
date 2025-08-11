// define enemy types and their stats and their growth
const EnemyData = {
  highSpeed: {
    baseHp: 60,
    attackDamage: 8,
    attackSpeed: 1.5
  },
  highDamage: {
    baseHp: 80,
    attackDamage: 25,
    attackSpeed: 0.4
  },
  balanced: {
    baseHp: 70,
    attackDamage: 12,
    attackSpeed: 1.0
  },
  smallBoss: {
    baseHp: 120, // 基礎血量x2
    attackDamage: 12,
    attackSpeed: 1.2
  }
};

export function getEnemyStats(level, type) {
  const data = EnemyData[type] || EnemyData.highSpeed;
  return {
    hp: data.baseHp * (1 + level / 5),
    maxHp: data.baseHp * (1 + level / 5),
    attackDamage: data.attackDamage,
    attackSpeed: data.attackSpeed,
    attackFrame: Math.round(20 / data.attackSpeed),
    currentFrame: 0,
    type
  };
}