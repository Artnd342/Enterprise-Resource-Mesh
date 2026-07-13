const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Your PostgreSQL connection instance

/**
 * @route   GET /api/v1/health
 * @desc    Comprehensive infrastructure system diagnostic and layer connectivity check
 * @access  Public (Exposed to Monitoring Orchestrators & Evaluators)
 */
router.get('/', async (req, res) => {
  const startTimestamp = Date.now();
  
  // Initialize status tracking objects
  const healthReport = {
    success: true,
    status: 'HEALTHY',
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(2)} seconds`,
    services: {
      expressApp: { status: 'UP', latency_ms: 0 },
      database: { status: 'UNKNOWN', latency_ms: 0 },
      realTimeSockets: { status: 'UNKNOWN' }
    }
  };

  try {
    // 1. CALCULATE EXPRESS RENDER SPEED
    healthReport.services.expressApp.latency_ms = Date.now() - startTimestamp;

    // 2. CHECK POSTGRESQL POOL CONNECTIVITY
    const dbStart = Date.now();
    // Run a lightweight, instant query statement to verify connection heartbeat
    await pool.query('SELECT 1'); 
    
    healthReport.services.database.status = 'CONNECTED';
    healthReport.services.database.latency_ms = Date.now() - dbStart;

    // 3. CHECK WEBSOCKET COMM LOOP STATUS
    const io = req.app.get('socketio');
    if (io) {
      // Fetch number of currently bound concurrent network listeners
      const connectedSocketsCount = io.sockets.sockets.size;
      healthReport.services.realTimeSockets.status = 'ACTIVE';
      healthReport.services.realTimeSockets.active_connections = connectedSocketsCount;
    } else {
      healthReport.services.realTimeSockets.status = 'UNINITIALIZED';
    }

    // 4. EVALUATE COMPLETE SYSTEM METRIC SUITE
    return res.status(200).json(healthReport);

  } catch (err) {
    // If any database or cache connection drops, flip the structural flag status to UNHEALTHY
    console.error('💥 [HEALTH CHECK DIAGNOSTIC MISMATCH]:', err.message);
    
    healthReport.success = false;
    healthReport.status = 'UNHEALTHY';
    healthReport.error_log = err.message;
    
    if (healthReport.services.database.status !== 'CONNECTED') {
      healthReport.services.database.status = 'DISCONNECTED/CRITICAL';
    }

    // Return a 503 Service Unavailable status code so tracking systems recognize the crash state
    return res.status(503).json(healthReport);
  }
});

module.exports = router;