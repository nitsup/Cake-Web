import { z } from "zod";

export const cakeNameSchema = z.string().trim().min(1).max(120);
export const cakeSlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const cakeSummarySchema = z.object({
  id: z.string().min(1),
  name: cakeNameSchema,
  slug: cakeSlugSchema,
  shortDescription: z.string().trim().max(300),
  basePrice: z.number().nonnegative(),
  category: z.object({
    name: z.string().trim().min(1),
    slug: cakeSlugSchema,
  }),
  availability: z.enum(["available", "unavailable"]),
});
