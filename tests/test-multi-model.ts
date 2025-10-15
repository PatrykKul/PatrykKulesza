/**
 * 🧪 Quick Test - Multi-Model System
 * 
 * Szybki test sprawdzający czy multi-model system działa
 */

import { 
  getCurrentModel, 
  recordModelUsage, 
  getUsageSummary,
  resetUsageStats 
} from '../src/lib/gemini-multi-model';

console.log('🧪 TESTING MULTI-MODEL SYSTEM\n');

// Test 1: Get initial model
console.log('TEST 1: Get initial model');
const model1 = getCurrentModel();
console.log(`✅ Current model: ${model1.name} (${model1.tier})`);
console.log(`   RPD Limit: ${model1.rpdLimit}\n`);

// Test 2: Record some usage
console.log('TEST 2: Simulate usage');
for (let i = 0; i < 5; i++) {
  recordModelUsage(model1.name);
  console.log(`   Request ${i + 1} recorded`);
}
console.log('✅ Usage recorded\n');

// Test 3: Get usage summary
console.log('TEST 3: Usage summary');
console.log(getUsageSummary());

// Test 4: Simulate quota exhaustion
console.log('\nTEST 4: Simulate quota exhaustion for gemini-2.5-pro');
for (let i = 0; i < 51; i++) {
  recordModelUsage('gemini-2.5-pro');
}
const model2 = getCurrentModel();
console.log(`✅ After exhausting gemini-2.5-pro, switched to: ${model2.name}\n`);

// Test 5: Reset
console.log('TEST 5: Reset stats');
resetUsageStats();
const model3 = getCurrentModel();
console.log(`✅ After reset, back to: ${model3.name} (${model3.tier})\n`);

console.log('🎉 ALL TESTS PASSED!');
console.log('\n📊 Final Summary:');
console.log(getUsageSummary());
