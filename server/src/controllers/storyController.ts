import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getStories = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 50);
    const skip = (page - 1) * limit;

    const { search, category, sort } = req.query;

    const where: any = {
      status: 'PUBLISHED',
    };

    if (search && typeof search === 'string') {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category && typeof category === 'string') {
      where.category = {
        OR: [
          { slug: category },
          { id: category },
        ],
      };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'popular') {
      orderBy = { views: 'desc' };
    } else if (sort === 'oldest') {
      orderBy = { createdAt: 'asc' };
    }

    const [stories, total] = await Promise.all([
      prisma.story.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          _count: {
            select: { chapters: true, bookmarks: true, ratings: true },
          },
          ratings: {
            select: { rating: true },
          },
        },
      }),
      prisma.story.count({ where }),
    ]);

    // Calculate average rating
    const data = stories.map((story) => {
      const totalRatings = story.ratings.length;
      const averageRating =
        totalRatings > 0
          ? story.ratings.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings
          : 5.0;

      const { ratings, ...rest } = story;
      return {
        ...rest,
        averageRating,
      };
    });

    res.status(200).json({
      status: 'success',
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('getStories error:', error);
    res.status(500).json({ status: 'error', message: 'បរាជ័យក្នុងការទាញយកបញ្ជីរឿង' });
  }
};

export const getStoryBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    // Increment views
    const story = await prisma.story.update({
      where: { slug },
      data: { views: { increment: 1 } },
      include: {
        category: true,
        chapters: {
          select: { id: true, chapterNumber: true, title: true, createdAt: true },
          orderBy: { chapterNumber: 'asc' },
        },
        ratings: {
          select: { rating: true },
        },
        _count: {
          select: { chapters: true, bookmarks: true, comments: true },
        },
      },
    });

    if (!story) {
      res.status(404).json({ status: 'error', message: 'រកមិនឃើញរឿងនេះទេ' });
      return;
    }

    // Check if bookmarked if user authenticated
    let isBookmarked = false;
    if (req.user) {
      const bookmark = await prisma.bookmark.findUnique({
        where: {
          userId_storyId: {
            userId: req.user.userId,
            storyId: story.id,
          },
        },
      });
      isBookmarked = !!bookmark;
    }

    const totalRatings = story.ratings.length;
    const averageRating =
      totalRatings > 0
        ? story.ratings.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings
        : 5.0;

    const { ratings, ...rest } = story;

    res.status(200).json({
      status: 'success',
      data: {
        ...rest,
        averageRating,
        isBookmarked,
      },
    });
  } catch (error) {
    console.error('getStoryBySlug error:', error);
    res.status(404).json({ status: 'error', message: 'រកមិនឃើញរឿងនេះទេ' });
  }
};

export const getChapterById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const chapter = await prisma.chapter.findUnique({
      where: { id },
      include: {
        story: {
          include: {
            category: true,
            chapters: {
              select: { id: true, chapterNumber: true, title: true },
              orderBy: { chapterNumber: 'asc' },
            },
          },
        },
      },
    });

    if (!chapter) {
      res.status(404).json({ status: 'error', message: 'រកមិនឃើញភាគនេះទេ' });
      return;
    }

    // Determine previous and next chapter IDs
    const allChapters = chapter.story.chapters;
    const currentIndex = allChapters.findIndex((c) => c.id === chapter.id);

    const prevChapterId = currentIndex > 0 ? allChapters[currentIndex - 1].id : null;
    const nextChapterId = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1].id : null;

    // Check if bookmarked if user authenticated
    let isBookmarked = false;
    if (req.user) {
      const bookmark = await prisma.bookmark.findUnique({
        where: {
          userId_storyId: {
            userId: req.user.userId,
            storyId: chapter.storyId,
          },
        },
      });
      isBookmarked = !!bookmark;
    }

    res.status(200).json({
      status: 'success',
      data: {
        ...chapter,
        prevChapterId,
        nextChapterId,
        story: {
          ...chapter.story,
          isBookmarked,
        },
      },
    });
  } catch (error) {
    console.error('getChapterById error:', error);
    res.status(500).json({ status: 'error', message: 'មិនអាចបើកភាគនេះបានទេ' });
  }
};

export const getComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: storyId } = req.params;

    const comments = await prisma.comment.findMany({
      where: { storyId },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.status(200).json({
      status: 'success',
      data: comments,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'មិនអាចទាញយកមតិយោបល់បានទេ' });
  }
};

export const addComment = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ status: 'error', message: 'សូមចូលគណនីដើម្បីបញ្ចេញមតិ' });
      return;
    }

    const { id: storyId } = req.params;
    const { content } = req.body;

    const comment = await prisma.comment.create({
      data: {
        userId: req.user.userId,
        storyId,
        content,
      },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    res.status(201).json({
      status: 'success',
      data: comment,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'មិនអាចបញ្ចេញមតិបានទេ' });
  }
};

export const rateStory = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ status: 'error', message: 'សូមចូលគណនីដើម្បីផ្តល់ពិន្ទុ' });
      return;
    }

    const { id: storyId } = req.params;
    const { rating } = req.body;

    const result = await prisma.rating.upsert({
      where: {
        userId_storyId: {
          userId: req.user.userId,
          storyId,
        },
      },
      update: { rating: Number(rating) },
      create: {
        userId: req.user.userId,
        storyId,
        rating: Number(rating),
      },
    });

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'មិនអាចផ្តល់ពិន្ទុបានទេ' });
  }
};
