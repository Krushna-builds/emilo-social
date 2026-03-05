import { z } from "zod";

export const createPostSchema = z.object({
  text: z.string().min(1, "Post text is required"),
});
