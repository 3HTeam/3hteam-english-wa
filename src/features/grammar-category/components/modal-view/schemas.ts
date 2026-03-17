import { z } from "zod";

export const getSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("schema.grammar_category.name_required")),
    imageUrl: z
      .string()
      .min(1, t("schema.grammar_category.image_required"))
      .url(t("schema.common.image_invalid")),
    slug: z.string().min(1, t("schema.grammar_category.slug_required")),
    description: z.string().nullable().optional(),
    status: z.boolean(),
  });

export type FormValues = z.infer<ReturnType<typeof getSchema>>;
