#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Get environment variables or prompt
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://task-manager-frontend-abc123.onrender.com';
const BACKEND_URL = process.env.BACKEND_URL || 'https://task-manager-backend-xyz789.onrender.com';

console.log('\n🔍 Smoke Test for Task Manager Production Deployment\n');
console.log(`Frontend URL: ${FRONTEND_URL}`);
console.log(`Backend URL: ${BACKEND_URL}\n`);

const results = {
  timestamp: new Date().toISOString(),
  frontendUrl: FRONTEND_URL,
  backendUrl: BACKEND_URL,
  tests: [],
  summary: { passed: 0, failed: 0, total: 0 },
};

// Test helper function
async function testEndpoint(name, url, expectedContent = null) {
  results.tests.push({ name, url, status: 'pending' });
  const testIndex = results.tests.length - 1;

  try {
    const response = await fetch(url);
    const text = await response.text();

    if (response.status === 200) {
      if (expectedContent && !text.includes(expectedContent)) {
        results.tests[testIndex] = {
          name,
          url,
          status: 'failed',
          message: `Expected content "${expectedContent}" not found`,
          statusCode: response.status,
        };
        results.summary.failed++;
        console.log(`✗ ${name} (expected content not found)`);
      } else {
        results.tests[testIndex] = {
          name,
          url,
          status: 'passed',
          statusCode: response.status,
        };
        results.summary.passed++;
        console.log(`✓ ${name}`);
      }
    } else {
      results.tests[testIndex] = {
        name,
        url,
        status: 'failed',
        statusCode: response.status,
        message: `HTTP ${response.status}`,
      };
      results.summary.failed++;
      console.log(`✗ ${name} (HTTP ${response.status})`);
    }
  } catch (error) {
    results.tests[testIndex] = {
      name,
      url,
      status: 'failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
    results.summary.failed++;
    console.log(`✗ ${name} (${error instanceof Error ? error.message : 'Network error'})`);
  }

  results.summary.total++;
}

// Run smoke tests
async function runSmokeTests() {
  console.log('Testing Frontend Deep Routes...');
  await testEndpoint('Frontend / (root)', `${FRONTEND_URL}/`, '<div id="root"');
  await testEndpoint('Frontend /login', `${FRONTEND_URL}/login`, '<div id="root"');
  await testEndpoint('Frontend /register', `${FRONTEND_URL}/register`, '<div id="root"');
  await testEndpoint('Frontend /tasks', `${FRONTEND_URL}/tasks`, '<div id="root"');
  await testEndpoint('Frontend /tasks/123', `${FRONTEND_URL}/tasks/123`, '<div id="root"');

  console.log('\nTesting Backend Health Endpoints...');
  await testEndpoint('Backend /health', `${BACKEND_URL}/health`, 'status');
  await testEndpoint('Backend /health/database', `${BACKEND_URL}/health/database`, 'status');

  // Print summary
  console.log(`\n📊 Results: ${results.summary.passed}/${results.summary.total} tests passed`);

  if (results.summary.failed === 0) {
    console.log('\n✅ All smoke tests passed!\n');
  } else {
    console.log(`\n❌ ${results.summary.failed} test(s) failed\n`);
  }

  // Save results to file
  const resultsPath = join(process.cwd(), 'docs', 'smoke-test-results.json');
  writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`Results saved to: ${resultsPath}\n`);

  process.exit(results.summary.failed > 0 ? 1 : 0);
}

runSmokeTests();
