/**
 * PostgreSQL Distributed Connection Pool Engine
 * ──────────────────────────────────────────────────────────────────
 * Establishes reusable communication pipelines between the Node core
 * application state and the local physical relational tables.
 */

const { Pool } = require('pg');

// Initialize configuration object map parameters
const pool = new Pool({
  user: 'postgres',                 // Default pgAdmin master administrative account
  host: 'localhost',                // Direct loopback mapping to your local machine
  database: 'enterprise_mesh',      // 🚨 MUST match your psql database name exactly!
  password: 'Rkcdg@2437',                // 🚨 UPDATE THIS: Set this to your actual pgAdmin password string!
  port: 5432,                       // Standard default PostgreSQL port registry
  max: 20,                          // Maximum client connections allowed in the pool matrix
  idleTimeoutMillis: 30000          // Auto-terminate inactive threads past 30 seconds
});

// =========================================================================
// 🔌 AUTOMATED LIFELINE DIAGNOSTIC PROBE
// =========================================================================
// This self-executing probe instantly tests your connection state on boot
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ =============================================================');
    console.error('❌ [DATABASE CONNECTION CRITICAL FAULT]:');
    console.error(`❌ Message: ${err.message}`);
    console.error('❌ ─────────────────────────────────────────────────────────────');
    console.error('❌ DETECTED FIX ACTIONS TO ATTEMPT NOW:');
    console.error('❌ 1. Verify your pgAdmin master password matches line 15 above.');
    console.error('❌ 2. Run "\\l" in psql to confirm the database "enterprise_mesh" exists.');
    console.error('❌ 3. Ensure the Windows PostgreSQL Service is running (services.msc).');
    console.error('❌ =============================================================');
  } else {
    console.log('✅ =============================================================');
    console.log('✅ Relational Database Registry handshake verified successfully.');
    console.log(`✅ Postgres Ledger Timestamp Sync: ${res.rows[0].now}`);
    console.log('✅ =============================================================');
  }
});

module.exports = pool;