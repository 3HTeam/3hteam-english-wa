import { z } from "zod";

export const getSchema = (t: (key: string) => string) =>
  z.object({
    title: z.string().min(1, t("schema.grammar_topic.title_required")),
    imageUrl: z
      .string()
      .min(1, t("schema.grammar_topic.image_required"))
      .url(t("schema.common.image_invalid")),
    slug: z.string().min(1, t("schema.grammar_topic.slug_required")),
    description: z.string().nullable().optional(),
    content: z.string().min(1, t("schema.grammar_topic.content_required")),
    status: z.boolean(),
    order: z.number().min(1),
    difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"], {
      message: t("schema.grammar_topic.difficulty_invalid"),
    }),
    levelId: z.string().min(1, t("schema.grammar_topic.level_required")),
    grammarCategoryId: z
      .string()
      .min(1, t("schema.grammar_topic.category_required")),
  });

export type FormValues = z.infer<ReturnType<typeof getSchema>>;
