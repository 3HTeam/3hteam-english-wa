import z from "zod";

export const getBannerSchema = (t: (t: string) => string) =>
  z.object({
    title: z.string().min(1, t("schema.banner.title_required")),
    imageUrl: z
      .string()
      .url(t("schema.common.image_invalid"))
      .optional()
      .or(z.literal("")),
    description: z.string().nullish(),
    status: z.boolean(),
    moduleId: z.string().min(1, t("schema.banner.module_required")),
  });

export type BannerFormValues = z.infer<ReturnType<typeof getBannerSchema>>;
