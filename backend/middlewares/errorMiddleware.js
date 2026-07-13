/**
 * Global Centralized Error Handling Middleware Interceptor
 * * Pipeline Target: Catches all operational and systemic exceptions thrown across 
 * controllers, formatting safe response payloads and preventing application crashes.
 */
const globalErrorHandler = (err, req, res, next) => {
  // 1. Log the full stack trace to your backend console for debugging diagnostics
  console.error('\n💥 [SYSTEM CRITICAL FAULT LOGGED BY INTERCEPTOR]:');
  console.error('──────────────────────────────────────────────────────────────────');
  console.error(err.stack || err);
  console.error('──────────────────────────────────────────────────────────────────\n');

  // 2. Identify the status code (default to 500 Internal Server Error if unspecified)
  const statusCode = err.statusCode || 500;

  // 3. Construct a clean, standardized error contract response matrix
  // This shields your raw database query syntax errors from leaking out to clients
  return res.status(statusCode).json({
    success: false,
    status: 'error',
    statusCode: statusCode,
    error: err.name || 'InternalInfrastructureFault',
    message: statusCode === 500 
      ? 'An unhandled infrastructure exception occurred within the resource mesh core loop.' 
      : err.message
  });
};

module.exports = globalErrorHandler;