const { body, validationResult } = require('express-validator');

/**
 * Structural rules matrix evaluating inbound booking data models
 */
const bookingValidationRules = [
  body('resourceId')
    .notEmpty().withMessage('Resource ID parameter cannot be left blank.')
    .isInt({ min: 1 }).withMessage('Resource ID must be a valid positive integer numeric value.')
];

/**
 * Gatekeeper verification evaluator
 * Intercepts execution: returns 400 Bad Request if rules fail, preventing database calls.
 */
const validatePayload = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    console.warn('⚠️ INBOUND PAYLOAD BLOCKED BY ROUTE VALIDATION SHIELD:', errors.array());
    
    return res.status(400).json({
      success: false,
      error: 'Inbound payload parameter mismatch validation failure.',
      details: errors.array().map(err => ({ 
        field: err.path, 
        message: err.msg 
      }))
    });
  }
  
  // If data is safe and validated, hand execution over smoothly to the next handler
  next();
};

module.exports = {
  bookingValidationRules,
  validatePayload
};