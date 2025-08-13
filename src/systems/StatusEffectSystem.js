// 新增文件: src/systems/StatusEffectSystem.js
class StatusEffect {
  constructor(type, value, duration, sourceAttack = 0) {
    this.type = type;           // 'bleed', 'poison', 'combo'
    this.value = value;         // 效果數值
    this.duration = duration;   // 持續時間 (秒)
    this.sourceAttack = sourceAttack; // 觸發時的攻擊力
    this.timeLeft = duration;
  }
}

class StatusEffectManager {
  constructor(owner) {
    this.owner = owner;
    this.effects = new Map(); // type -> StatusEffect[]
    this.comboCount = 0;
    this.comboTimeout = 0;
  }

  // 添加狀態效果
  addEffect(type, value, duration, sourceAttack = 0) {
    if (!this.effects.has(type)) {
      this.effects.set(type, []);
    }
    
    const newEffect = new StatusEffect(type, value, duration, sourceAttack);
    
    switch(type) {
      case 'bleed':
        // 方案A: 刷新持續時間，保留最強效果
        this.handleBleedStacking(newEffect);
        break;
      case 'poison':
        // 無限疊加，刷新所有持續時間
        this.handlePoisonStacking(newEffect);
        break;
    }
  }

  // 流血疊加處理
  handleBleedStacking(newEffect) {
    const bleeds = this.effects.get('bleed');
    const existingBleed = bleeds.find(b => b.sourceAttack <= newEffect.sourceAttack);
    
    if (existingBleed) {
      // 更強的流血覆蓋舊的
      existingBleed.timeLeft = newEffect.duration;
      existingBleed.value = newEffect.value;
      existingBleed.sourceAttack = newEffect.sourceAttack;
    } else {
      bleeds.push(newEffect);
    }
  }

  // 中毒疊加處理
  handlePoisonStacking(newEffect) {
    const poisons = this.effects.get('poison');
    poisons.push(newEffect);
    
    // 刷新所有中毒效果的持續時間
    poisons.forEach(poison => {
      poison.timeLeft = newEffect.duration;
    });
  }

  // 連擊處理
  addCombo() {
    this.comboCount++;
    this.comboTimeout = 2.0; // 2秒內需要再次命中
    
    // 檢查連擊里程碑
    if (this.comboCount === 5) {
      this.owner.nextAttackCrit = true;
    } else if (this.comboCount === 10) {
      this.owner.attackSpeedBoost = { multiplier: 2.0, duration: 3.0 };
    } else if (this.comboCount === 20) {
      this.owner.pendingTrueDamage = this.owner.attack * 3;
      this.comboCount = 0; // 重置連擊
    }
  }

  // 每幀更新
  update(deltaTime) {
    this.updateCombo(deltaTime);
    this.updateEffects(deltaTime);
  }

  updateCombo(deltaTime) {
    if (this.comboTimeout > 0) {
      this.comboTimeout -= deltaTime;
      if (this.comboTimeout <= 0) {
        this.comboCount = 0; // 連擊斷開
      }
    }
  }

  updateEffects(deltaTime) {
    for (const [type, effects] of this.effects.entries()) {
      for (let i = effects.length - 1; i >= 0; i--) {
        const effect = effects[i];
        effect.timeLeft -= deltaTime;
        
        // 處理持續傷害
        if (type === 'poison') {
          this.applyPoisonDamage(effect, deltaTime);
        } else if (type === 'bleed') {
          this.applyBleedDamage(effect, deltaTime);
        }
        
        // 移除過期效果
        if (effect.timeLeft <= 0) {
          effects.splice(i, 1);
        }
      }
    }
  }

  applyPoisonDamage(effect, deltaTime) {
    // 每秒造成最大生命值0.5%的傷害
    const dps = this.owner.maxHp * 0.005;
    const damage = dps * deltaTime;
    this.owner.takeDamage(damage, true); // true表示無視防禦
  }

  applyBleedDamage(effect, deltaTime) {
    // 3秒內總共造成40%額外傷害
    const totalDamage = effect.sourceAttack * 0.4;
    const dps = totalDamage / 3.0;
    const damage = dps * deltaTime;
    this.owner.takeDamage(damage, true);
  }
}