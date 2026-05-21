const { ZodError } = require('zod');
const ApiError = require('../utils/ApiError');

/**
 * Validates request data against a specified Zod schema.
 * Parses req.body, req.query, and req.params dynamically.
 * Compatible with Zod v4 (uses `error.issues` instead of v3's `error.errors`).
 */
const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    // Assign parsed values back to req objects to ensure sanitized data is used downstream
    if (parsed.body !== undefined) req.body = parsed.body;
    if (parsed.query !== undefined) req.query = parsed.query;
    if (parsed.params !== undefined) req.params = parsed.params;

    next();
  } catch (error) {
    if (error instanceof ZodError) {
      // Zod v4 uses `error.issues` (v3 used `error.errors`)
      const issues = error.issues ?? error.errors ?? [];
      const errorMessages = issues.map((issue) => ({
        // path is an array like ['body', 'email'] — strip the first segment (body/query/params)
        field: Array.isArray(issue.path) ? issue.path.slice(1).join('.') : String(issue.path),
        message: issue.message,
      }));
      return next(new ApiError(400, 'Validation failed', errorMessages));
    }
    next(error);
  }
};

module.exports = validate;

