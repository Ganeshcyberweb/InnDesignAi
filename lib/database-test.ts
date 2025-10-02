/**
 * Database connection and schema validation tests
 * Run this file to verify Prisma setup and database connectivity
 */

import { checkDatabaseConnection } from './prisma'
import { validateSchema, createDesignSchema, createFeedbackSchema } from './validation-schemas'

/**
 * Test database connection
 */
export async function testDatabaseConnection(): Promise<boolean> {
  console.log('🔍 Testing database connection...')

  try {
    const isConnected = await checkDatabaseConnection()

    if (isConnected) {
      console.log('✅ Database connection successful!')
      return true
    } else {
      console.log('❌ Database connection failed!')
      return false
    }
  } catch (error) {
    console.error('❌ Database connection error:', error)
    return false
  }
}

/**
 * Test schema validation
 */
export function testSchemaValidation(): boolean {
  console.log('🔍 Testing schema validation...')

  let allTestsPassed = true

  // Test valid design data
  const validDesignData = {
    userId: '550e8400-e29b-41d4-a716-446655440000',
    inputPrompt: 'Create a modern living room with minimalist design',
    aiModelUsed: 'dall-e-3',
    preferences: {
      roomType: 'living_room',
      size: 'medium',
      stylePreference: 'modern',
      budget: 5000,
      colorScheme: 'neutral tones',
      materialPreferences: 'wood and metal',
      otherRequirements: 'pet-friendly furniture'
    }
  }

  const designValidation = validateSchema(createDesignSchema, validDesignData)
  if (designValidation.success) {
    console.log('✅ Valid design schema validation passed!')
  } else {
    console.log('❌ Valid design schema validation failed:', designValidation.errors)
    allTestsPassed = false
  }

  // Test invalid design data
  const invalidDesignData = {
    userId: 'invalid-uuid',
    inputPrompt: 'too short',
    aiModelUsed: '',
    preferences: {
      roomType: '',
      size: '',
      stylePreference: '',
      budget: -100
    }
  }

  const invalidDesignValidation = validateSchema(createDesignSchema, invalidDesignData)
  if (!invalidDesignValidation.success) {
    console.log('✅ Invalid design schema validation correctly rejected!')
  } else {
    console.log('❌ Invalid design schema validation should have failed!')
    allTestsPassed = false
  }

  // Test valid feedback data
  const validFeedbackData = {
    designId: '550e8400-e29b-41d4-a716-446655440001',
    userId: '550e8400-e29b-41d4-a716-446655440000',
    rating: 5,
    comments: 'Excellent design! Very satisfied with the results.',
    type: 'QUALITY',
    helpful: true
  }

  const feedbackValidation = validateSchema(createFeedbackSchema, validFeedbackData)
  if (feedbackValidation.success) {
    console.log('✅ Valid feedback schema validation passed!')
  } else {
    console.log('❌ Valid feedback schema validation failed:', feedbackValidation.errors)
    allTestsPassed = false
  }

  // Test invalid feedback data
  const invalidFeedbackData = {
    designId: 'invalid-uuid',
    userId: 'invalid-uuid',
    rating: 10, // Should be 1-5
    comments: 'a'.repeat(1001), // Too long
  }

  const invalidFeedbackValidation = validateSchema(createFeedbackSchema, invalidFeedbackData)
  if (!invalidFeedbackValidation.success) {
    console.log('✅ Invalid feedback schema validation correctly rejected!')
  } else {
    console.log('❌ Invalid feedback schema validation should have failed!')
    allTestsPassed = false
  }

  if (allTestsPassed) {
    console.log('✅ All schema validation tests passed!')
  } else {
    console.log('❌ Some schema validation tests failed!')
  }

  return allTestsPassed
}

/**
 * Run all tests
 */
export async function runAllTests(): Promise<{
  connectionTest: boolean
  schemaTest: boolean
  allPassed: boolean
}> {
  console.log('🚀 Starting database tests...\n')

  const connectionTest = await testDatabaseConnection()
  console.log('') // Add spacing

  const schemaTest = testSchemaValidation()
  console.log('') // Add spacing

  const allPassed = connectionTest && schemaTest

  console.log('📊 Test Results:')
  console.log(`   Database Connection: ${connectionTest ? '✅' : '❌'}`)
  console.log(`   Schema Validation: ${schemaTest ? '✅' : '❌'}`)
  console.log(`   Overall: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`)

  return {
    connectionTest,
    schemaTest,
    allPassed
  }
}

/**
 * CLI runner (for direct execution)
 */
if (require.main === module) {
  runAllTests()
    .then(({ allPassed }) => {
      process.exit(allPassed ? 0 : 1)
    })
    .catch((error) => {
      console.error('❌ Test execution failed:', error)
      process.exit(1)
    })
}