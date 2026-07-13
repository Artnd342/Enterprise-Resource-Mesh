const express = require('express');
const router = express.Router();

// 1. Import structural database booking controller operations
const bookingController = require('../controllers/bookingController');

// 2. Import security shield (pluralized folders path matching your system)
const authMiddlewareModule = require('../middlewares/authMiddleware'); 

// 3. Import payload schema enforcement validation shields
const { bookingValidationRules, validatePayload } = require('../middlewares/validatorMiddleware');

// =========================================================================
// 🛠️ FAIL-SAFE: UNPACK AUTHENTICATION LAYER
// =========================================================================
const verifyToken = typeof authMiddlewareModule === 'function' 
  ? authMiddlewareModule 
  : (authMiddlewareModule.authMiddleware || 
     authMiddlewareModule.verifyToken || 
     authMiddlewareModule.protect || 
     Object.values(authMiddlewareModule)[0]);

const handleClaim = bookingController.claimAsset || bookingController.claim;
const handleRelease = bookingController.releaseAsset || bookingController.release;

// =========================================================================
// ⛓️ PROTECTED INFRASTRUCTURE ROUTE DECLARATIONS
// =========================================================================

/**
 * @route   POST /api/v1/bookings/claim
 * @desc    Allocate a secure real-time lease lock on an infrastructure node
 * @access  Private
 * @pipeline [JWT Verification Check] ──► [Schema Pattern Rule Evaluator] ──► [Gatekeeper Shield] ──► [Database Mutation Execution]
 */
router.post('/claim', verifyToken, bookingValidationRules, validatePayload, handleClaim);

/**
 * @route   POST /api/v1/bookings/release
 * @desc    Tear down an active resource allocation lock matrix
 * @access  Private
 * @pipeline [JWT Verification Check] ──► [Schema Pattern Rule Evaluator] ──► [Gatekeeper Shield] ──► [Database Mutation Execution]
 */
router.post('/release', verifyToken, bookingValidationRules, validatePayload, handleRelease);

module.exports = router;