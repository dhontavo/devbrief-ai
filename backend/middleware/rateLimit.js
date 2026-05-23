const rateLimit = require('express-rate-limit');

/**
 * General API rate limiter — applied to all routes.
 * Default: 100 requests per 15 minutes per IP.
 */
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  standardHeaders: true,  // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,
  message: {
    error: 'Too Many Requests',
    message: 'You have exceeded the request limit. Please try again later.',
  },
});

/**
 * Stricter limiter for the /generate endpoint to control OpenAI costs.
 * Default: 10 requests per 15 minutes per IP.
 */
const generateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.GENERATE_RATE_LIMIT_MAX) || 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too Many Requests',
    message: 'AI generation limit reached. Please wait before making another request.',
  },
});

/**
 * Auth-specific limiter to prevent brute-force attacks on login/register.
 * Default: 20 requests per 15 minutes per IP.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too Many Requests',
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
  },
});

module.exports = { generalLimiter, generateLimiter, authLimiter };
