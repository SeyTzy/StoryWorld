import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((e) => e.message).join(', ');
        res.status(400).json({
          status: 'error',
          message: errorMessages,
          errors: error.errors,
        });
        return;
      }
      res.status(400).json({ status: 'error', message: 'ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ' });
    }
  };
};
