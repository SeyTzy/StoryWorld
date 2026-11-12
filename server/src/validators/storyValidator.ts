import { z } from 'zod';

export const createStorySchema = z.object({
  body: z.object({
    title: z.string().min(1, 'សូមបញ្ចូលចំណងជើងរឿង'),
    slug: z.string().optional(),
    author: z.string().min(1, 'សូមបញ្ចូលឈ្មោះអ្នកនិពន្ធ'),
    categoryId: z.string().min(1, 'សូមជ្រើសរើសប្រភេទរឿង'),
    description: z.string().min(1, 'សូមបញ្ចូលសេចក្តីសង្ខេប'),
    coverImage: z.string().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  }),
});

export const createChapterSchema = z.object({
  body: z.object({
    storyId: z.string().min(1, 'សូមជ្រើសរើសរឿង'),
    chapterNumber: z.coerce.number().min(1, 'លេខភាគត្រូវតែធំជាង ឬស្មើ ១'),
    title: z.string().min(1, 'សូមបញ្ចូលចំណងជើងភាគ'),
    content: z.string().min(1, 'សូមបញ្ចូលខ្លឹមសារភាគ'),
  }),
});

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'សូមបញ្ចូលឈ្មោះប្រភេទរឿង'),
    slug: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const addCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'សូមបញ្ចូលខ្លឹមសារមតិយោបល់'),
  }),
});

export const rateStorySchema = z.object({
  body: z.object({
    rating: z.coerce.number().min(1).max(5, 'ពិន្ទុត្រូវនៅចន្លោះ ១ ដល់ ៥'),
  }),
});

export const progressSchema = z.object({
  body: z.object({
    storyId: z.string().min(1),
    chapterId: z.string().min(1),
    progress: z.coerce.number().min(0).max(100),
  }),
});
