import { z } from "zod";

export const getTopicSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("schema.topic.name_required")),
    imageUrl: z
      .string()
      .min(1, t("schema.topic.image_required"))
      .url(t("schema.common.image_invalid")),
    slug: z.string().min(1, t("schema.topic.slug_required")),
    description: z.string().nullable().optional(),
    status: z.boolean(),
  });

export type TopicFormValues = z.infer<ReturnType<typeof getTopicSchema>>;
