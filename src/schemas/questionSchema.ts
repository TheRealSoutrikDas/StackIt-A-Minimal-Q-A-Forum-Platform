import { z } from 'zod';

export const createQuestionSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  tags: z.array(z.string()).min(1)
});
