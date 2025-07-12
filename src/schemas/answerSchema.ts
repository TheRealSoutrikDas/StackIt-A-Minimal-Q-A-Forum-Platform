import { z } from 'zod';

export const createAnswerSchema = z.object({
  questionId: z.string(),
  content: z.string().min(5)
});
