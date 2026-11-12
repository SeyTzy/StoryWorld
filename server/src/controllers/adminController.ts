import { Request, Response } from 'express';
import prisma from '../config/prisma';

// Helper to slugify Khmer/Latin strings
const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-\u1780-\u17FF]+/g, '') // preserve Khmer Unicode range and Latin alphanumeric
    .replace(/\-\-+/g, '-');
};

export const getDashboardStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [totalStories, totalChapters, totalUsers, totalCategories, viewsAggregate] = await Promise.all([
      prisma.story.count(),
      prisma.chapter.count(),
      prisma.user.count(),
      prisma.category.count(),
      prisma.story.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        totalStories,
        totalChapters,
        totalUsers,
        totalCategories,
        totalViews: viewsAggregate._sum.views || 0,
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ status: 'error', message: 'បរាជ័យក្នុងការទាញយកស្ថិតិ Admin' });
  }
};

// Admin Story Management
export const getAdminStories = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const skip = (page - 1) * limit;
    const { search } = req.query;

    const where: any = {};
    if (search && typeof search === 'string') {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [stories, total] = await Promise.all([
      prisma.story.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          _count: {
            select: { chapters: true, bookmarks: true },
          },
        },
      }),
      prisma.story.count({ where }),
    ]);

    res.status(200).json({
      status: 'success',
      data: stories,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'មិនអាចទាញយកបញ្ជីរឿងបានទេ' });
  }
};

export const createStory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, slug, author, categoryId, description, status, coverImage } = req.body;

    let finalSlug = slug ? slugify(slug) : slugify(title);
    // ensure unique slug
    const existing = await prisma.story.findUnique({ where: { slug: finalSlug } });
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    let finalCover = coverImage;
    if (req.file) {
      finalCover = `/uploads/${req.file.filename}`;
    }

    const story = await prisma.story.create({
      data: {
        title,
        slug: finalSlug,
        author,
        categoryId,
        description,
        coverImage: finalCover || null,
        status: status || 'PUBLISHED',
      },
      include: {
        category: true,
      },
    });

    res.status(201).json({
      status: 'success',
      data: story,
    });
  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({ status: 'error', message: 'មិនអាចបង្កើតរឿងថ្មីបានទេ' });
  }
};

export const updateStory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, slug, author, categoryId, description, status, coverImage } = req.body;

    const data: any = {};
    if (title) data.title = title;
    if (slug) data.slug = slugify(slug);
    if (author) data.author = author;
    if (categoryId) data.categoryId = categoryId;
    if (description) data.description = description;
    if (status) data.status = status;
    if (coverImage !== undefined) data.coverImage = coverImage;

    if (req.file) {
      data.coverImage = `/uploads/${req.file.filename}`;
    }

    const updated = await prisma.story.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });

    res.status(200).json({
      status: 'success',
      data: updated,
    });
  } catch (error) {
    console.error('Update story error:', error);
    res.status(500).json({ status: 'error', message: 'មិនអាចកែប្រែរឿងបានទេ' });
  }
};

export const deleteStory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.story.delete({ where: { id } });
    res.status(200).json({ status: 'success', message: 'បានលុបរឿងដោយជោគជ័យ' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'មិនអាចលុបរឿងបានទេ' });
  }
};

// Chapter CRUD
export const createChapter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { storyId, chapterNumber, title, content } = req.body;

    const chapter = await prisma.chapter.create({
      data: {
        storyId,
        chapterNumber: Number(chapterNumber),
        title,
        content,
      },
    });

    res.status(201).json({
      status: 'success',
      data: chapter,
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ status: 'error', message: 'លេខភាគនេះមានរួចហើយនៅក្នុងរឿងនេះ' });
      return;
    }
    res.status(500).json({ status: 'error', message: 'មិនអាចបន្ថែមភាគថ្មីបានទេ' });
  }
};

export const updateChapter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { chapterNumber, title, content } = req.body;

    const data: any = {};
    if (chapterNumber !== undefined) data.chapterNumber = Number(chapterNumber);
    if (title) data.title = title;
    if (content) data.content = content;

    const updated = await prisma.chapter.update({
      where: { id },
      data,
    });

    res.status(200).json({
      status: 'success',
      data: updated,
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ status: 'error', message: 'លេខភាគនេះមានរួចហើយនៅក្នុងរឿងនេះ' });
      return;
    }
    res.status(500).json({ status: 'error', message: 'មិនអាចកែប្រែភាគបានទេ' });
  }
};

export const deleteChapter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.chapter.delete({ where: { id } });
    res.status(200).json({ status: 'success', message: 'បានលុបភាគដោយជោគជ័យ' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'មិនអាចលុបភាគបានទេ' });
  }
};

// Category CRUD
export const getAdminCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { stories: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.status(200).json({
      status: 'success',
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'មិនអាចទាញយកប្រភេទរឿងបានទេ' });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, slug, description } = req.body;
    const finalSlug = slug ? slugify(slug) : slugify(name);

    const category = await prisma.category.create({
      data: {
        name,
        slug: finalSlug,
        description,
      },
    });

    res.status(201).json({
      status: 'success',
      data: category,
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ status: 'error', message: 'ប្រភេទរឿង ឬ Slug នេះមានរួចហើយ' });
      return;
    }
    res.status(500).json({ status: 'error', message: 'មិនអាចបង្កើតប្រភេទរឿងបានទេ' });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, slug, description } = req.body;

    const data: any = {};
    if (name) data.name = name;
    if (slug) data.slug = slugify(slug);
    if (description !== undefined) data.description = description;

    const updated = await prisma.category.update({
      where: { id },
      data,
    });

    res.status(200).json({
      status: 'success',
      data: updated,
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ status: 'error', message: 'Slug នេះមានរួចហើយ' });
      return;
    }
    res.status(500).json({ status: 'error', message: 'មិនអាចកែប្រែប្រភេទរឿងបានទេ' });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    // Check if category has stories
    const count = await prisma.story.count({ where: { categoryId: id } });
    if (count > 0) {
      res.status(400).json({
        status: 'error',
        message: `មិនអាចលុបប្រភេទនេះបានទេ ដោយសារតែមានរឿងចំនួន ${count} កំពុងប្រើប្រាស់ប្រភេទនេះ`,
      });
      return;
    }

    await prisma.category.delete({ where: { id } });
    res.status(200).json({ status: 'success', message: 'បានលុបប្រភេទរឿងដោយជោគជ័យ' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'មិនអាចលុបប្រភេទរឿងបានទេ' });
  }
};

// User Management
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const skip = (page - 1) * limit;
    const { search } = req.query;

    const where: any = {};
    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.status(200).json({
      status: 'success',
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'មិនអាចទាញយកបញ្ជីអ្នកប្រើប្រាស់បានទេ' });
  }
};

export const toggleUserStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: Boolean(isActive) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        isActive: true,
      },
    });

    res.status(200).json({
      status: 'success',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'មិនអាចកែប្រែស្ថានភាពគណនីបានទេ' });
  }
};

// Comment moderation
export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.comment.delete({ where: { id } });
    res.status(200).json({ status: 'success', message: 'បានលុបមតិយោបល់ដោយជោគជ័យ' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'មិនអាចលុបមតិយោបល់បានទេ' });
  }
};
