import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { stories: { where: { status: 'PUBLISHED' } } },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.status(200).json({
      status: 'success',
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'បរាជ័យក្នុងការទាញយកប្រភេទរឿង' });
  }
};
