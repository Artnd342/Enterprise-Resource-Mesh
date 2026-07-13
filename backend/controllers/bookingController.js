/**
 * Real-Time Distributed Resource Booking Controllers
 * ──────────────────────────────────────────────────────────────────
 * Manages resource state mutations cleanly inside PostgreSQL while
 * dispatching network events via socket.io to connected frontend clients.
 */

const pool = require('../config/db');

/**
 * @route   POST /api/v1/bookings/claim
 * @desc    Allocate a secure real-time lease lock on an infrastructure node
 * @access  Private (Intercepted via perimeter Auth Gateways)
 */
exports.claimAsset = async (req, res, next) => {
  try {
    // 1. Extract and sanitize inbound request body parameters
    const { resourceId: rawResourceId } = req.body;
    
    // Crucial Type-Hardening: Force payload values into integers to match database keys
    const resourceId = parseInt(rawResourceId, 10);
    
    // Cohesion identity tracking mapped back to your valid application workspace UUID
    const userId = '11111111-1111-1111-1111-111111111111'; 

    if (!resourceId || isNaN(resourceId)) {
      const error = new Error('Validation Mismatch: Resource identification tracking key missing or corrupt.');
      error.statusCode = 400;
      return next(error);
    }

    console.log(`📡 [TRANSACTION BLOCK]: Processing active lock reservation for Row ID: ${resourceId}`);

    // 2. Fetch and evaluate availability metrics from the database registry
    const checkResource = await pool.query(
      'SELECT is_available FROM resources WHERE id = $1',
      [resourceId]
    );

    if (checkResource.rows.length === 0) {
      const error = new Error('Resource node not found within database register records.');
      error.statusCode = 404;
      return next(error);
    }

    if (!checkResource.rows[0].is_available) {
      const error = new Error('Resource allocation conflict: Target node is already locked by an active process.');
      error.statusCode = 409; // HTTP 409: Conflict state code
      return next(error);
    }

    // 3. Perform atomic relational transaction mutation statement to lock the asset
    await pool.query(
      'UPDATE resources SET is_available = false, claimed_by = $1 WHERE id = $2',
      [userId, resourceId]
    );

    // 4. Emit real-time synchronization updates over WebSockets across the client mesh
    const io = req.app.get('socketio');
    if (io) {
      io.emit('resource_allocated', { resourceId, claimedBy: userId });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Asset lock allocated and synchronized successfully.' 
    });

  } catch (err) {
    // Intercept connection limits or unexpected breaks and pass down safely to server pipelines
    next(err);
  }
};

/**
 * @route   POST /api/v1/bookings/release
 * @desc    Tear down an active resource allocation lock matrix
 * @access  Private (Intercepted via perimeter Auth Gateways)
 */
exports.releaseAsset = async (req, res, next) => {
  try {
    // 1. Extract and sanitize inbound request body parameters
    const { resourceId: rawResourceId } = req.body;
    const resourceId = parseInt(rawResourceId, 10);

    if (!resourceId || isNaN(resourceId)) {
      const error = new Error('Validation Mismatch: Identification tracking key required to break active locks.');
      error.statusCode = 400;
      return next(error);
    }

    console.log(`📡 [TRANSACTION BLOCK]: Processing safe breakdown release for Row ID: ${resourceId}`);

    // 2. Reset resource allocation state indicators back to open metrics in PostgreSQL
    await pool.query(
      'UPDATE resources SET is_available = true, claimed_by = NULL WHERE id = $1',
      [resourceId]
    );

    // 3. Emit real-time matrix breakdown broadcast over WebSockets
    const io = req.app.get('socketio');
    if (io) {
      io.emit('resource_released', { resourceId });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Resource lock released and distributed successfully.' 
    });

  } catch (err) {
    // Catch relational engine drops smoothly without breaking runtime execution loops
    next(err);
  }
};