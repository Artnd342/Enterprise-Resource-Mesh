const express = require('express');
const router = express.Router();

// 1. Import your structural resource controller
const resourceController = require('../controllers/resourceController');

// 2. Import your security shield (uses your exact folder name 'middlewares')
const authMiddlewareModule = require('../middlewares/authMiddleware'); 

// =========================================================================
// 🛠️ FAIL-SAFE: UNPACK MIDDLEWARE IF WRAPPED IN AN OBJECT
// =========================================================================
// This checks if your file exported a raw function or an object literal wrapper.
// It automatically extracts common naming conventions like protect or verifyToken.
const verifyToken = typeof authMiddlewareModule === 'function' 
  ? authMiddlewareModule 
  : (authMiddlewareModule.authMiddleware || 
     authMiddlewareModule.verifyToken || 
     authMiddlewareModule.protect || 
     Object.values(authMiddlewareModule)[0]); // Fallback: grab the first function inside the object

/**
 * @route   GET /api/v1/resources
 * @desc    Fetch all active infrastructure nodes partitioned by tenant context
 * @access  Private (Requires valid JWT Authorization header)
 */
router.get('/', verifyToken, resourceController.getResources);

module.exports = router;