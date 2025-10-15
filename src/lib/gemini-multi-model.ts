/**
 * 🚀 PROFESSIONAL MULTI-MODEL GEMINI FALLBACK SYSTEM
 * 
 * System automatycznie przełącza między 7 modelami Gemini
 * gdy quota się wyczerpie. Trackuje użycie i resetuje po 24h.
 * 
 * TIER 1 (Premium): gemini-2.5-pro, gemini-2.5-flash
 * TIER 2 (Standard): gemini-2.0-flash-exp, gemini-2.0-flash
 * TIER 3 (Lite): gemini-2.5-flash-lite, gemini-2.0-flash-lite
 * TIER 4 (Educational): learnlm-2.0-flash-experimental
 */

export interface ModelConfig {
  name: string;
  rpdLimit: number;
  rpmLimit: number;
  tier: 'premium' | 'standard' | 'lite' | 'educational';
  description: string;
}

export interface ModelUsageStats {
  currentModel: string;
  requestsToday: number;
  dailyLimit: number;
  lastReset: number;
  modelHistory: Array<{ model: string; timestamp: number; requests: number }>;
}

// 🎯 Model Fallback Chain - od najlepszego do zapasowych
export const MODEL_FALLBACK_CHAIN: ModelConfig[] = [
  // TIER 1 - Premium (najlepsze modele)
  {
    name: 'gemini-2.5-pro',
    rpdLimit: 50,
    rpmLimit: 2,
    tier: 'premium',
    description: '⭐ PRO model - najlepsza jakość odpowiedzi'
  },
  {
    name: 'gemini-2.5-flash',
    rpdLimit: 250,
    rpmLimit: 10,
    tier: 'premium',
    description: '⭐ Main production - szybki i dokładny'
  },
  
  // TIER 2 - Standard (solidne modele)
  {
    name: 'gemini-2.0-flash-exp',
    rpdLimit: 50,
    rpmLimit: 10,
    tier: 'standard',
    description: 'Experimental flash - bardzo dobry'
  },
  {
    name: 'gemini-2.0-flash',
    rpdLimit: 200,
    rpmLimit: 15,
    tier: 'standard',
    description: 'Standard flash - niezawodny backup'
  },
  
  // TIER 3 - Lite (lekkie ale sprawne)
  {
    name: 'gemini-2.5-flash-lite',
    rpdLimit: 1000,
    rpmLimit: 15,
    tier: 'lite',
    description: 'Lite 2.5 - ekonomiczny z dużym limitem'
  },
  {
    name: 'gemini-2.0-flash-lite',
    rpdLimit: 200,
    rpmLimit: 30,
    tier: 'lite',
    description: 'Lite 2.0 - szybki backup'
  },
  
  // TIER 4 - Educational (specjalnie dla edukacji!)
  {
    name: 'learnlm-2.0-flash-experimental',
    rpdLimit: 1500,
    rpmLimit: 15,
    tier: 'educational',
    description: '🎓 LearnLM - IDEALNY dla korepetycji!'
  }
];

// 📊 Storage dla usage tracking (in-memory, resetuje się po restarcie serwera)
const modelUsageStore = new Map<string, ModelUsageStats>();
const RESET_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 godziny

/**
 * Pobiera aktualny model do użycia na podstawie quota
 */
export function getCurrentModel(): ModelConfig {
  const now = Date.now();
  const stats = getUsageStats();
  
  // Sprawdź czy minęły 24h od ostatniego resetu
  if (now - stats.lastReset > RESET_INTERVAL_MS) {
    console.log('🔄 24h passed - resetting to TIER 1 premium model');
    resetUsageStats();
    return MODEL_FALLBACK_CHAIN[0]; // Wróć do najlepszego modelu
  }
  
  // Znajdź pierwszy model który ma dostępne requesty
  for (const model of MODEL_FALLBACK_CHAIN) {
    const modelStats = getModelStats(model.name);
    
    if (modelStats.requestsToday < model.rpdLimit) {
      // Ten model ma jeszcze quota
      if (stats.currentModel !== model.name) {
        console.log(`🔀 Switching model: ${stats.currentModel} → ${model.name} (${model.tier})`);
        console.log(`   Reason: ${stats.requestsToday}/${getModelConfig(stats.currentModel)?.rpdLimit || 0} quota used`);
      }
      return model;
    }
  }
  
  // Wszystkie modele wyczerpane (teoretycznie niemożliwe z 3250 RPD!)
  console.error('🚨 ALL MODELS EXHAUSTED! This should never happen with 3250 RPD limit!');
  return MODEL_FALLBACK_CHAIN[MODEL_FALLBACK_CHAIN.length - 1]; // Zwróć ostatni jako emergency
}

/**
 * Rejestruje request dla aktualnego modelu
 */
export function recordModelUsage(modelName: string): void {
  const stats = getUsageStats();
  const modelStats = getModelStats(modelName);
  
  // Increment counters
  stats.requestsToday++;
  modelStats.requestsToday++;
  
  // Update current model
  stats.currentModel = modelName;
  
  // Add to history
  stats.modelHistory.push({
    model: modelName,
    timestamp: Date.now(),
    requests: modelStats.requestsToday
  });
  
  // Keep only last 100 entries
  if (stats.modelHistory.length > 100) {
    stats.modelHistory = stats.modelHistory.slice(-100);
  }
  
  // Save updated stats
  modelUsageStore.set('global', stats);
  modelUsageStore.set(`model:${modelName}`, modelStats);
  
  // Log progress
  const config = getModelConfig(modelName);
  if (config && modelStats.requestsToday % 10 === 0) {
    console.log(`📊 ${modelName}: ${modelStats.requestsToday}/${config.rpdLimit} requests today (${Math.round(modelStats.requestsToday / config.rpdLimit * 100)}%)`);
  }
}

/**
 * Pobiera statystyki użycia globalnego
 */
function getUsageStats(): ModelUsageStats {
  let stats = modelUsageStore.get('global');
  
  if (!stats) {
    stats = {
      currentModel: MODEL_FALLBACK_CHAIN[0].name,
      requestsToday: 0,
      dailyLimit: MODEL_FALLBACK_CHAIN.reduce((sum, m) => sum + m.rpdLimit, 0),
      lastReset: Date.now(),
      modelHistory: []
    };
    modelUsageStore.set('global', stats);
  }
  
  return stats;
}

/**
 * Pobiera statystyki dla konkretnego modelu
 */
function getModelStats(modelName: string): ModelUsageStats {
  const key = `model:${modelName}`;
  let stats = modelUsageStore.get(key);
  
  if (!stats) {
    const config = getModelConfig(modelName);
    stats = {
      currentModel: modelName,
      requestsToday: 0,
      dailyLimit: config?.rpdLimit || 0,
      lastReset: Date.now(),
      modelHistory: []
    };
    modelUsageStore.set(key, stats);
  }
  
  return stats;
}

/**
 * Pobiera konfigurację modelu
 */
function getModelConfig(modelName: string): ModelConfig | undefined {
  return MODEL_FALLBACK_CHAIN.find(m => m.name === modelName);
}

/**
 * Resetuje statystyki (po 24h lub ręcznie)
 */
export function resetUsageStats(): void {
  console.log('🔄 Resetting all model usage stats...');
  modelUsageStore.clear();
  
  const stats = getUsageStats();
  console.log(`✅ Reset complete. Starting fresh with ${stats.currentModel} (${stats.dailyLimit} total RPD)`);
}

/**
 * Pobiera podsumowanie użycia (dla debugowania/monitoringu)
 */
export function getUsageSummary(): string {
  const stats = getUsageStats();
  const config = getModelConfig(stats.currentModel);
  const timeUntilReset = RESET_INTERVAL_MS - (Date.now() - stats.lastReset);
  const hoursUntilReset = Math.floor(timeUntilReset / (60 * 60 * 1000));
  
  let summary = `📊 GEMINI USAGE SUMMARY\n`;
  summary += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  summary += `Current Model: ${stats.currentModel} (${config?.tier})\n`;
  summary += `Today's Requests: ${stats.requestsToday}/${stats.dailyLimit}\n`;
  summary += `Reset in: ${hoursUntilReset}h\n\n`;
  
  summary += `Model Breakdown:\n`;
  MODEL_FALLBACK_CHAIN.forEach(model => {
    const modelStats = getModelStats(model.name);
    const percentage = Math.round(modelStats.requestsToday / model.rpdLimit * 100);
    const bar = '█'.repeat(Math.floor(percentage / 5)) + '░'.repeat(20 - Math.floor(percentage / 5));
    summary += `  ${model.name.padEnd(35)} [${bar}] ${modelStats.requestsToday}/${model.rpdLimit} (${percentage}%)\n`;
  });
  
  return summary;
}

/**
 * Sprawdza czy powinniśmy pokazać info użytkownikowi o degradacji modelu
 */
export function shouldNotifyUserAboutDegradation(): { notify: boolean; message?: string } {
  const stats = getUsageStats();
  const config = getModelConfig(stats.currentModel);
  
  // Notify jeśli spadliśmy poniżej TIER 2
  if (config && (config.tier === 'lite' || config.tier === 'educational')) {
    return {
      notify: true,
      message: `ℹ️ Using ${config.tier} model due to high demand. Quality may vary slightly.`
    };
  }
  
  return { notify: false };
}
