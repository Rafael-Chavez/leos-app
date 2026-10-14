import { StorageSchema, StudentProfile, FactProgress, AppSettings } from '../../types';
import { initializeFactProgress } from '../../domain/mastery/masteryEngine';

const STORAGE_KEY = 'multiplication_quest_data';
const CURRENT_VERSION = 1;

/**
 * Get default student profile
 */
function getDefaultProfile(): StudentProfile {
  return {
    id: `student_${Date.now()}`,
    displayName: 'Student',
    level: 1,
    experiencePoints: 0,
    coins: 0,
    currentStreak: 0,
    lastActiveDate: new Date().toISOString(),
    dailyGoal: 20,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Get default settings
 */
function getDefaultSettings(): AppSettings {
  return {
    dailyGoal: 20,
    defaultQuizLength: 10,
    defaultTimerEnabled: false,
    defaultTimeLimit: 60,
    hintsEnabled: true,
    soundEnabled: true,
    animationsEnabled: true,
    masteryThresholds: {
      consecutiveCorrect: 5,
      minimumSessions: 2,
      accuracyPercentage: 90,
    },
  };
}

/**
 * Get default storage schema
 */
function getDefaultSchema(): StorageSchema {
  return {
    version: CURRENT_VERSION,
    student: getDefaultProfile(),
    factProgress: initializeFactProgress(),
    sessions: [],
    assessments: [],
    gameProgress: {
      unlockedAreas: ['meadow'],
      completedChallenges: [],
      achievements: [],
      cosmeticUnlocks: [],
      bestScores: {},
      totalStars: 0,
    },
    lessons: {},
    settings: getDefaultSettings(),
    lastSyncedAt: new Date().toISOString(),
  };
}

/**
 * Load data from localStorage
 */
export function loadData(): StorageSchema {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return getDefaultSchema();
    }

    const parsed = JSON.parse(stored) as StorageSchema;

    // Validate version and migrate if needed
    if (parsed.version !== CURRENT_VERSION) {
      return migrateData(parsed);
    }

    // Ensure all required fields exist
    return {
      ...getDefaultSchema(),
      ...parsed,
    };
  } catch (error) {
    console.error('Failed to load data:', error);
    return getDefaultSchema();
  }
}

/**
 * Save data to localStorage
 */
export function saveData(data: Partial<StorageSchema>): boolean {
  try {
    const current = loadData();
    const updated: StorageSchema = {
      ...current,
      ...data,
      lastSyncedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Failed to save data:', error);
    return false;
  }
}

/**
 * Reset all data
 */
export function resetData(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to reset data:', error);
    return false;
  }
}

/**
 * Export data as JSON
 */
export function exportData(): string {
  const data = loadData();
  return JSON.stringify(data, null, 2);
}

/**
 * Import data from JSON
 */
export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString) as StorageSchema;
    localStorage.setItem(STORAGE_KEY, jsonString);
    return true;
  } catch (error) {
    console.error('Failed to import data:', error);
    return false;
  }
}

/**
 * Migrate data from older versions
 */
function migrateData(oldData: StorageSchema): StorageSchema {
  // For now, just merge with defaults
  // In the future, add specific migration logic for each version
  return {
    ...getDefaultSchema(),
    ...oldData,
    version: CURRENT_VERSION,
  };
}

/**
 * Update student profile
 */
export function updateStudent(updates: Partial<StudentProfile>): boolean {
  const data = loadData();
  return saveData({
    student: {
      ...data.student,
      ...updates,
    },
  });
}

/**
 * Update fact progress
 */
export function updateFactProgress(
  normalizedKey: string,
  progress: FactProgress
): boolean {
  const data = loadData();
  return saveData({
    factProgress: {
      ...data.factProgress,
      [normalizedKey]: progress,
    },
  });
}

/**
 * Update settings
 */
export function updateSettings(updates: Partial<AppSettings>): boolean {
  const data = loadData();
  return saveData({
    settings: {
      ...data.settings,
      ...updates,
    },
  });
}
