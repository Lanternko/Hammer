// src/utils/GameUtils.js - 遊戲工具函數
class GameUtils {
  // 🔧 稀有度相關工具
  static getRarityColor(rarity) {
    const colors = {
      'common': '#A0A0A0',
      'uncommon': '#4CAF50',
      'rare': '#2196F3',
      'epic': '#9C27B0',
      'legendary': '#FF9800'
    };
    return colors[rarity] || '#FFFFFF';
  }

  static getRarityText(rarity) {
    const texts = {
      'common': '普通',
      'uncommon': '罕見',
      'rare': '稀有',
      'epic': '史詩',
      'legendary': '傳說'
    };
    return texts[rarity] || '未知';
  }

  static getRarityWeight(rarity) {
    const weights = {
      'common': 1.0,
      'uncommon': 0.7,
      'rare': 0.4,
      'epic': 0.2,
      'legendary': 0.1
    };
    return weights[rarity] || 1.0;
  }

  // 📊 數值格式化工具
  static formatNumber(num, decimals = 1) {
    if (typeof num !== 'number') return '0';
    
    if (num >= 1000000) {
      return (num / 1000000).toFixed(decimals) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(decimals) + 'K';
    } else {
      return num.toFixed(decimals);
    }
  }

  static formatPercentage(value, decimals = 1) {
    return (value * 100).toFixed(decimals) + '%';
  }

  static formatTime(seconds) {
    if (seconds < 60) {
      return seconds.toFixed(1) + '秒';
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}分${remainingSeconds}秒`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}小時${minutes}分鐘`;
    }
  }

  // 🎲 隨機數工具
  static randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static randomChoice(array) {
    if (!Array.isArray(array) || array.length === 0) return null;
    return array[Math.floor(Math.random() * array.length)];
  }

  static weightedRandomChoice(items, weightKey = 'weight') {
    if (!Array.isArray(items) || items.length === 0) return null;
    
    const totalWeight = items.reduce((sum, item) => sum + (item[weightKey] || 1), 0);
    let random = Math.random() * totalWeight;
    
    for (const item of items) {
      random -= (item[weightKey] || 1);
      if (random <= 0) return item;
    }
    
    return items[items.length - 1];
  }

  // 📏 數學計算工具
  static clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  static lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  static calculateDamageReduction(armor) {
    return armor / (armor + 100);
  }

  static calculateEffectiveDamage(baseDamage, armor, flatReduction = 0) {
    const armorReduction = baseDamage / (1 + armor / 100);
    return Math.max(1, armorReduction - flatReduction);
  }

  static calculateDPS(attack, attackSpeed, critChance = 0, critMultiplier = 2) {
    const critDamageMultiplier = 1 + (critChance * (critMultiplier - 1));
    return attack * attackSpeed * critDamageMultiplier;
  }

  // 🔄 陣列工具
  static shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  static getRandomElements(array, count) {
    const shuffled = this.shuffleArray(array);
    return shuffled.slice(0, Math.min(count, array.length));
  }

  static removeDuplicates(array, keyFn = item => item) {
    const seen = new Set();
    return array.filter(item => {
      const key = keyFn(item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // 🔍 對象工具
  static deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    if (typeof obj === 'object') {
      const clonedObj = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = this.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
  }

  static mergeObjects(target, source) {
    const result = { ...target };
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
          result[key] = this.mergeObjects(result[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }
    return result;
  }

  // ⏱️ 防抖和節流
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // 🎨 顏色工具
  static hexToRgba(hex, alpha = 1) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  static interpolateColor(color1, color2, factor) {
    if (factor <= 0) return color1;
    if (factor >= 1) return color2;
    
    const c1 = this.hexToRgb(color1);
    const c2 = this.hexToRgb(color2);
    
    const r = Math.round(c1.r + (c2.r - c1.r) * factor);
    const g = Math.round(c1.g + (c2.g - c1.g) * factor);
    const b = Math.round(c1.b + (c2.b - c1.b) * factor);
    
    return `rgb(${r}, ${g}, ${b})`;
  }

  static hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }

  // 💾 存儲工具
  static saveToLocalStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('無法保存到 localStorage:', error);
      return false;
    }
  }

  static loadFromLocalStorage(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('無法從 localStorage 載入:', error);
      return defaultValue;
    }
  }

  static removeFromLocalStorage(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('無法從 localStorage 移除:', error);
      return false;
    }
  }

  // 🔧 DOM 工具
  static createElement(tag, className = '', styles = {}, content = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    
    Object.assign(element.style, styles);
    
    if (content) {
      if (typeof content === 'string') {
        element.innerHTML = content;
      } else {
        element.appendChild(content);
      }
    }
    
    return element;
  }

  static removeElement(selector) {
    const element = typeof selector === 'string' ? 
      document.querySelector(selector) : selector;
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }

  static removeAllElements(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
  }

  // ⚡ 性能工具
  static measurePerformance(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    try {
      // Lazy import to avoid circular deps if any
      const cfg = window && window.GAME_CONFIG ? window.GAME_CONFIG : null;
      if (cfg && cfg.DEBUG && cfg.DEBUG.ENABLED) {
        console.log(`⚡ ${name} 執行時間: ${(end - start).toFixed(2)}ms`);
      }
    } catch (_) {
      // no-op
    }
    return result;
  }

  static async measureAsyncPerformance(name, fn) {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    try {
      const cfg = window && window.GAME_CONFIG ? window.GAME_CONFIG : null;
      if (cfg && cfg.DEBUG && cfg.DEBUG.ENABLED) {
        console.log(`⚡ ${name} 執行時間: ${(end - start).toFixed(2)}ms`);
      }
    } catch (_) {
      // no-op
    }
    return result;
  }

  // 🔍 驗證工具
  static isValidNumber(value, min = -Infinity, max = Infinity) {
    return typeof value === 'number' && 
           !isNaN(value) && 
           isFinite(value) && 
           value >= min && 
           value <= max;
  }

  static isValidString(value, minLength = 0, maxLength = Infinity) {
    return typeof value === 'string' && 
           value.length >= minLength && 
           value.length <= maxLength;
  }

  static isValidArray(value, minLength = 0, maxLength = Infinity) {
    return Array.isArray(value) && 
           value.length >= minLength && 
           value.length <= maxLength;
  }

  // 🎮 遊戲特定工具
  static calculateLevelProgress(currentExp, expToNext) {
    if (expToNext <= 0) return 1;
    return Math.min(1, currentExp / expToNext);
  }

  static getRelativeTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 1000) return '剛才';
    if (diff < 60000) return Math.floor(diff / 1000) + '秒前';
    if (diff < 3600000) return Math.floor(diff / 60000) + '分鐘前';
    if (diff < 86400000) return Math.floor(diff / 3600000) + '小時前';
    return Math.floor(diff / 86400000) + '天前';
  }

  static generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 🌐 瀏覽器檢測
  static getBrowserInfo() {
    const ua = navigator.userAgent;
    return {
      isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
      isIOS: /iPad|iPhone|iPod/.test(ua),
      isAndroid: /Android/.test(ua),
      isChrome: /Chrome/.test(ua),
      isFirefox: /Firefox/.test(ua),
      isSafari: /Safari/.test(ua) && !/Chrome/.test(ua),
      supportsLocalStorage: typeof(Storage) !== 'undefined'
    };
  }
}

export default GameUtils;