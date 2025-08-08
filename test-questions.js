// Test script to verify sample questions
import { getAllCategories, getQuestionsByCategory } from './src/data/sampleQuestions.js'

console.log('🧪 Testing Sample Question Bank...')

const categories = getAllCategories()
console.log(`\n📚 Available Categories: ${categories.length}`)

categories.forEach(category => {
  console.log(`\n🔹 ${category.name}`)
  console.log(`   Description: ${category.description}`)
  console.log(`   Subcategories: ${category.subcategories.length}`)
  
  category.subcategories.forEach(sub => {
    console.log(`   📂 ${sub.name}: ${sub.questionCount} questions`)
  })
  
  // Test getting questions
  const allQuestions = getQuestionsByCategory(category.id)
  const easyQuestions = getQuestionsByCategory(category.id, undefined, 'easy')
  const mediumQuestions = getQuestionsByCategory(category.id, undefined, 'medium')
  const hardQuestions = getQuestionsByCategory(category.id, undefined, 'hard')
  
  console.log(`   📊 Questions by difficulty:`)
  console.log(`      Easy: ${easyQuestions.length}`)
  console.log(`      Medium: ${mediumQuestions.length}`)
  console.log(`      Hard: ${hardQuestions.length}`)
  console.log(`      Total: ${allQuestions.length}`)
})

console.log('\n✅ Sample Question Bank Test Complete!')
