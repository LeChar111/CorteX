import type { ErrorHandler } from 'hono';
import { ZodError } from 'zod';

export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof ZodError) {
    console.error('[ValidationError]', err.errors);
    return c.json(
      {
        error: 'Validation error',
        details: err.errors,
      },
      400,
    );
  }

  console.error('[InternalError]', err);
  return c.json(
    {
      error: 'Internal server error',
      message: err.message,
    },
    500,
  );
};
