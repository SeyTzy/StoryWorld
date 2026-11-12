import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getBookmarks = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ status: 'error', message: 'មិនទាន់ចូលគណនី' });
      return;
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: req.user.userId },
      include: {
        story: {
          include: {
            category: true,
            _count: { select: { chapters: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      status: 'success',
      data: bookmarks,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'បរាជ័យក្នុងការទាញយកសៀវភៅចំណាំ' });
  }
};

export const addBookmark = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ status: 'error', message: 'មិនទាន់ចូលគណនី' });
      return;
    }

    const { storyId } = req.body;

    const bookmark = await prisma.bookmark.upsert({
      where: {
        userId_storyId: {
          userId: req.user.userId,
          storyId,
        },
      },
      update: {},
      create: {
        userId: req.user.userId,
        storyId,
      },
      include: {
        story: true,
      },
    });

    res.status(201).json({
      status: 'success',
      data: bookmark,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'មិនអាចចំណាំរឿងបានទេ' });
  }
};

export const removeBookmark = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ status: 'error', message: 'មិនទាន់ចូលគណនី' });
      return;
    }

    const { storyId } = req.params;

    await prisma.bookmark.deleteMany({
      where: {
        userId: req.user.userId,
        storyId,
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'បានដកការចំណាំរួចរាល់',
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'មិនអាចដកការចំណាំបានទេ' });
  }
};

export const getHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ status: 'error', message: 'មិនទាន់ចូលគណនី' });
      return;
    }

    const history = await prisma.readingHistory.findMany({
      where: { userId: req.user.userId },
      include: {
        story: {
          include: {
            category: true,
          },
        },
        chapter: {
          select: { id: true, chapterNumber: true, title: true, createdAt: true },
        },
      },
      orderBy: { lastReadAt: 'desc' },
      take: 50,
    });

    res.status(200).json({
      status: 'success',
      data: history,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'បរាជ័យក្នុងការទាញយកប្រវត្តិអាន' });
  }
};

export const saveProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ status: 'error', message: 'មិនទាន់ចូលគណនី' });
      return;
    }

    const { storyId, chapterId, progress } = req.body;

    const historyItem = await prisma.readingHistory.upsert({
      where: {
        userId_storyId: {
          userId: req.user.userId,
          storyId,
        },
      },
      update: {
        chapterId,
        progress: Number(progress),
        lastReadAt: new Date(),
      },
      create: {
        userId: req.user.userId,
        storyId,
        chapterId,
        progress: Number(progress),
      },
      include: {
        story: true,
        chapter: true,
      },
    });

    res.status(200).json({
      status: 'success',
      data: historyItem,
    });
  } catch (error) {
    console.error('saveProgress error:', error);
    res.status(500).json({ status: 'error', message: 'មិនអាចកត់ត្រាដំណើរការអានបានទេ' });
  }
};
