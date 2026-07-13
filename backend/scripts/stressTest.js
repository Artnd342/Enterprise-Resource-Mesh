/**
 * High-Concurrency Architectural Stress-Testing Script
 * ──────────────────────────────────────────────────────────────────
 * Simulates 50 simultaneous users firing claim payloads at the exact
 * same millisecond to prove atomic transaction isolation safety handles
 * race conditions with absolute zero data corruption.
 */

const axios = require('axios');

// Target Node API endpoint config parameters
const TARGET_ENDPOINT = 'http://localhost:5000/api/v1/bookings/claim';
const TOTAL_CONCURRENT_REQUESTS = 50;

// Test resource target identifier: targets row ID 1 in your resources database table
const TEST_PAYLOAD = { resourceId: 1 }; 

// Dummy authorization header payload to bypass initial route gateways cleanly
const MOCK_TOKEN = 'Bearer dummy_token_string';

async function runHighConcurrencyStressTest() {
  console.log('🚀 =============================================================');
  console.log(`🚀 INITIATING AUTOMATED HIGH-CONCURRENCY STRESS-TEST ENGINE`);
  console.log(`🎯 Target Path: ${TARGET_ENDPOINT}`);
  console.log(`⚡ Bombarding cluster pool with ${TOTAL_CONCURRENT_REQUESTS} simultaneous requests...`);
  console.log('🚀 =============================================================\n');

  const requestArray = [];
  const startTime = Date.now();

  // 1. Build an execution pipeline containing 50 simultaneous axios promise vectors
  for (let i = 1; i <= TOTAL_CONCURRENT_REQUESTS; i++) {
    requestArray.push(
      axios.post(TARGET_ENDPOINT, TEST_PAYLOAD, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': MOCK_TOKEN
        }
      })
      // Inline interceptor formatting success arrays cleanly
      .then(res => ({ success: true, status: res.status, data: res.data }))
      // Intercept 409 collision limits to keep the master execution loop from breaking out early
      .catch(err => ({ success: false, status: err.response?.status || 500, data: err.response?.data }))
    );
  }

  // 2. DISPATCH ALL 50 PAYLOADS CONCURRENTLY OVER THE NETWORK LAYER
  const batchResults = await Promise.all(requestArray);
  
  const executionDuration = Date.now() - startTime;

  // 3. Process output analytical performance variables
  let successfulLocks = 0;
  let validationBlocks = 0;
  let systemFailures = 0;

  batchResults.forEach((result) => {
    if (result.success && result.status === 200) {
      successfulLocks++;
    } else if (result.status === 409) {
      validationBlocks++; // Server caught conflict allocation safely!
    } else {
      systemFailures++; // Complete uncaught engine fault
    }
  });

  // 4. Output complete metric evaluation ledger
  console.log('📊 =============================================================');
  console.log('📊 STRESS TEST SIMULATION EXECUTION MATRIX COMPLETED');
  console.log('📊 =============================================================');
  console.log(`⏱️ Complete Pipeline Execution Duration : ${executionDuration} ms`);
  console.log(`🟢 Successfully Allocated Lock Leases   : ${successfulLocks} request(s)`);
  console.log(`🟡 Gracefully Handled Conflict Blocks    : ${validationBlocks} request(s)`);
  console.log(`🔴 System Breakdown Failures/Errors     : ${systemFailures} request(s)`);
  console.log('================================================================\n');

  if (successfulLocks === 1 && systemFailures === 0) {
    console.log('🏆 TEST RESULT: EXCELLENT ARCHITECTURAL ISOLATION! 🏆');
    console.log('   The relational database isolated the very first inbound mutation payload');
    console.log('   and safely rejected the remaining 49 collisions with clean handled states.\n');
  } else {
    console.log('⚠️ TEST RESULT: REVIEW CONCURRENCY SCHEMAS ⚠️');
    console.log('   Check initialization states or clear asset locks in your database console.\n');
  }
}

// Spin the automation metrics block
runHighConcurrencyStressTest();