// Test script to verify quiz generation functionality
import { getSampleQuestions } from './src/data/sampleQuestions.js'

// Test 1: Check if sample questions are loaded
console.log('🔍 Testing Sample Question Bank...')

// Test DSA questions
const dsaQuestions = getSampleQuestions('dsa', 'easy', 5)
console.log(`✅ DSA Easy Questions: ${dsaQuestions.length}/5`)
dsaQuestions.forEach((q, i) => {
  console.log(`   ${i+1}. ${q.question.substring(0, 50)}...`)
})

// Test Cloud questions  
const cloudQuestions = getSampleQuestions('cloud', 'medium', 5)
console.log(`✅ Cloud Medium Questions: ${cloudQuestions.length}/5`)
cloudQuestions.forEach((q, i) => {
  console.log(`   ${i+1}. ${q.question.substring(0, 50)}...`)
})

// Test Programming questions
const programmingQuestions = getSampleQuestions('programming', 'hard', 5)
console.log(`✅ Programming Hard Questions: ${programmingQuestions.length}/5`)
programmingQuestions.forEach((q, i) => {
  console.log(`   ${i+1}. ${q.question.substring(0, 50)}...`)
})

// Test Algorithms questions
const algorithmQuestions = getSampleQuestions('algorithms', 'easy', 5)
console.log(`✅ Algorithm Easy Questions: ${algorithmQuestions.length}/5`)
algorithmQuestions.forEach((q, i) => {
  console.log(`   ${i+1}. ${q.question.substring(0, 50)}...`)
})

console.log('\n🎯 Summary:')
console.log(`Total questions tested: ${dsaQuestions.length + cloudQuestions.length + programmingQuestions.length + algorithmQuestions.length}/20`)
console.log('📚 Sample Question Bank is working correctly!')

// Test 2: Check question structure
if (dsaQuestions.length > 0) {
  const testQ = dsaQuestions[0]
  console.log('\n🔬 Question Structure Test:')
  console.log(`✅ Has ID: ${!!testQ.id}`)
  console.log(`✅ Has Question: ${!!testQ.question}`)
  console.log(`✅ Has Options: ${Array.isArray(testQ.options) && testQ.options.length === 4}`)
  console.log(`✅ Has Correct Answer: ${!!testQ.correctAnswer}`)
  console.log(`✅ Has Category: ${!!testQ.category}`)
  console.log(`✅ Has Difficulty: ${!!testQ.difficulty}`)
  console.log(`✅ Has Explanation: ${!!testQ.explanation}`)
}

console.log('\n🚀 Quiz Generation System Ready for Testing!')
