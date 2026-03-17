import { z } from "zod";

export const getLevelSchema = (t: (key: string) => string) =>
  z.object({
    cefrLevel: z.string().min(1, t("schema.level.cefr_level_required")),
    name: z.string().min(1, t("schema.level.name_required")),
    description: z
      .string()
      .nullable()
      .optional()
      .transform((val) => val ?? ""),
    toeicScoreMin: z.coerce.number(),
    toeicScoreMax: z.coerce.number(),
    ieltsMin: z.coerce.number(),
    ieltsMax: z.coerce.number(),
    order: z.coerce.number(),
    status: z.boolean(),
  });

export type LevelFormValues = z.infer<ReturnType<typeof getLevelSchema>>;
