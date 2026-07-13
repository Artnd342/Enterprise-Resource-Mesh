const pool = require('../config/db'); // Your PostgreSQL connection pool

/**
 * @route   GET /api/v1/resources
 * @desc    Fetch all infrastructure assets partitioned by Tenant UUID
 * @access  Private (Protected by JWT Auth Middleware)
 */
exports.getResources = async (req, res) => {
  try {
    // 1. Extract the tenant isolation key injected by your JWT verify middleware
    const tenantId = req.user?.tenantId || req.user?.tenant_id;

    if (!tenantId) {
      return res.status(400).json({ 
        error: 'Security Context Violation: Tenant isolation identity parameter missing.' 
      });
    }

    // 2. Query the relational engine
    // CRITICAL FIX: Explicitly selecting 'claimed_by' so the React UI can determine ownership state!
    const queryText = `
      SELECT 
        id, 
        name, 
        type, 
        is_available, 
        claimed_by 
      FROM resources 
      WHERE tenant_id = $1 
      ORDER BY id ASC
    `;

    const result = await pool.query(queryText, [tenantId]);

    // 3. Return the clean structural data array matrices
    return res.status(200).json(result.rows);

  } catch (err) {
    // Low-level debugging error dump for your backend terminal window
    console.error('CRITICAL ERROR INSIDE RESOURCE RETRIEVAL LOOP:', err.message);

    // Fail-safe circuit breaker check if PostgreSQL dropped off the local network partition
    if (err.message.includes('ECONNREFUSED') || err.message.includes('pool')) {
      return res.status(503).json({ 
        error: 'Database layer infrastructure offline. Circuit breaker tripped.' 
      });
    }

    return res.status(500).json({ 
      error: 'Internal Server Error: Failed to poll active asset register.' 
    });
  }
};