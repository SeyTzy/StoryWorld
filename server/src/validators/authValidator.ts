import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'ឈ្មោះត្រូវមានយ៉ាងតិច ២ តួអក្សរ'),
    email: z.string().email('ទម្រង់អ៊ីមែលមិនត្រឹមត្រូវ'),
    password: z.string().min(6, 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('ទម្រង់អ៊ីមែលមិនត្រឹមត្រូវ'),
    password: z.string().min(1, 'សូមបញ្ចូលពាក្យសម្ងាត់'),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'ឈ្មោះត្រូវមានយ៉ាងតិច ២ តួអក្សរ').optional(),
    password: z.string().min(6, 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ').optional(),
    avatar: z.string().url('ទម្រង់ URL នៃរូបភាពមិនត្រឹមត្រូវ').optional(),
  }),
});
