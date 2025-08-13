// src/storage/StorageManager.js
class StorageManager {
  constructor() {
    this.storageKey = 'combatArena_save';
  }

  // Save game data
  save(data) {
    try {
      const saveData = {
        diamonds: data.diamonds || 0,
        unlockedHeroes: data.unlockedHeroes || ['hammer'],
        settings: data.settings || {},
        timestamp: Date.now()
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(saveData));
      console.log('✅ Game saved successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to save game:', error);
      return false;
    }
  }

  // Load game data
  load() {
    try {
      const savedData = localStorage.getItem(this.storageKey);
      
      if (!savedData) {
        console.log('📁 No save data found, using defaults');
        return this.getDefaultData();
      }
      
      const data = JSON.parse(savedData);
      console.log('✅ Game loaded successfully');
      return data;
    } catch (error) {
      console.error('❌ Failed to load game:', error);
      return this.getDefaultData();
    }
  }

  // Get default save data
  getDefaultData() {
    return {
      diamonds: 0,
      unlockedHeroes: ['hammer'],
      settings: {
        soundEnabled: true,
        musicEnabled: true
      },
      timestamp: Date.now()
    };
  }

  // Clear save data
  clear() {
    try {
      localStorage.removeItem(this.storageKey);
      console.log('🗑️ Save data cleared');
      return true;
    } catch (error) {
      console.error('❌ Failed to clear save data:', error);
      return false;
    }
  }

  // Check if save data exists
  hasData() {
    return localStorage.getItem(this.storageKey) !== null;
  }
}

export default StorageManager;