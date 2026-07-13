/**
 * Authentication Gatekeeper Middleware Shield
 * ──────────────────────────────────────────────────────────────────
 * Intercepts inbound network requests to verify identity credentials.
 * Supports standard JSON Web Tokens (JWT) and an automated bypass 
 * handler for live presentation environments.
 */

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    // 1. Verify the structural existence of the inbound Authorization header
    if (!authHeader) {
      console.warn('🔒 [SECURITY ALERT]: Inbound request rejected. Authorization header missing.');
      return res.status(401).json({ 
        success: false, 
        message: 'Access Denied: Missing authorization context credentials.' 
      });
    }

    // Extract the raw token string past the "Bearer " structural prefix
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

    // =========================================================================
    // 🚀 PRESENTATION LIVE DEMO BYPASS HOOK
    // =========================================================================
    // Prevents expired token lockouts or database seeding mismatches from blocking your live panel demo!
    if (token === 'mock_presentation_token_string' || authHeader === 'Bearer mock_presentation_token_string') {
      console.log('🎫 [BYPASS GRANTED]: Authenticated session via Presentation Demo Identity Key.');
      
      // Inject a clean verified user context structure into the request stream
      req.user = { 
        id: '11111111-1111-1111-1111-111111111111', 
        name: 'Demo Resident #01',
        clearance: 'SOFTWARE ENGINEER'
      };
      
      return next(); // Pass execution control forward seamlessly
    }

    // =========================================================================
    // 🔐 STANDARD PRODUCTION CRYPTOGRAPHIC JWT VERIFICATION LAYER
    // =========================================================================
    try {
      const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret_matrix_key';
      const decodedPayload = jwt.verify(token, JWT_SECRET);
      
      // Attach the decrypted user identity parameters directly to the request object
      req.user = decodedPayload;
      next();
      
    } catch (jwtErr) {
      console.error(`❌ JWT Verification Failure: ${jwtErr.message}`);
      return res.status(401).json({ 
        success: false, 
        message: `JWT Verification Failure: ${jwtErr.message}` 
      });
    }

  } catch (err) {
    // Intercept systemic exceptions and safely route downstream to the global handler
    next(err);
  }
};

module.exports = authMiddleware;