import z from "zod";

export const getPopupSchema = (t: (t: string) => string) =>
  z.object({
    title: z.string().min(1, t("schema.popup.title_required")),
    imageUrl: z
      .string()
      .url(t("schema.common.image_invalid"))
      .optional()
      .or(z.literal("")),
    description: z.string().nullish(),
    status: z.boolean(),
    moduleId: z.string().min(1, t("schema.popup.module_required")),
  });

export type PopupFormValues = z.infer<ReturnType<typeof getPopupSchema>>;
