// src/data/Enemies.js - Enemy Data Configuration (Note: Capital E to match import)
export const EnemyData = {
  highSpeed: {
    name: 'Swift Assassin',
    emoji: '💨',
    baseHp: 60,
    baseAttack: 8,
    attackSpeed: 1.5, // Fast attacks
    defense: 3,
    description: 'Agile assassin with high speed but low health'
  },
  
  highDamage: {
    name: 'Heavy Warrior',
    emoji: '🔥',
    baseHp: 80,
    baseAttack: 25,
    attackSpeed: 0.4, // Slow but heavy hits
    defense: 8,
    description: 'Powerful warrior with high damage but slow attacks'
  },
  
  highHp: {
    name: 'Tank Guardian',
    emoji: '🛡️',
    baseHp: 120,
    baseAttack: 10,
    attackSpeed: 0.8,
    defense: 12,
    description: 'Sturdy guardian with high health and defense'
  },
  
  // Special enemy type
  smallBoss: {
    name: 'Mini Boss',
    emoji: '👑',
    baseHp: 150,
    baseAttack: 15,
    attackSpeed: 1.0,
    defense: 10,
    description: 'Mini boss with balanced but enhanced stats'
  }
};

// Generate enemy stats based on level and type
export function getEnemyStats(level, type) {
  const data = EnemyData[type] || EnemyData.highHp;
  
  // Level scaling: +4% per level
  const growthFactor = 1 + (level - 1) * 0.08;
  
  return {
    name: data.name,
    emoji: data.emoji,
    description: data.description,
    type: type,
    level: level,
    
    // Health scales most significantly
    maxHp: Math.floor(data.baseHp * growthFactor),
    hp: Math.floor(data.baseHp * growthFactor),
    
    // Attack scales moderately
    attack: Math.floor(data.baseAttack * Math.pow(growthFactor, 0.8)),
    
    // Attack speed stays constant
    attackSpeed: data.attackSpeed,
    attackFrame: Math.round(20 / data.attackSpeed),
    
    // Defense scales slightly
    defense: Math.floor(data.defense * Math.pow(growthFactor, 0.6)),
    
    // Battle state
    currentFrame: 0
  };
}

// Select appropriate enemy type based on level
export function selectEnemyType(level) {
  if (level === 20) {
    return 'smallBoss'; // Final level is mini boss
  }
  
  // Vary enemy types by level range for gameplay variety
  const types = ['highSpeed', 'highDamage', 'highHp'];
  
  if (level <= 5) {
    // Early game: more high-speed enemies (easier to handle)
    return Math.random() < 0.5 ? 'highSpeed' : types[Math.floor(Math.random() * types.length)];
  } else if (level <= 10) {
    // Mid game: introduce more variety
    return types[Math.floor(Math.random() * types.length)];
  } else if (level <= 15) {
    // Late game: focus on harder enemies
    return Math.random() < 0.3 ? 'highSpeed' : (Math.random() < 0.5 ? 'highDamage' : 'highHp');
  } else {
    // Final stages: mostly difficult enemies
    return Math.random() < 0.2 ? 'highSpeed' : (Math.random() < 0.5 ? 'highDamage' : 'highHp');
  }
}