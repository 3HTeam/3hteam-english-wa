import z from "zod";

export const getSettingSchema = (t: (key: string) => string) =>
  z.object({
    appName: z.string().min(1, t("schema.setting.app_name_required")),
    appDescription: z.string().optional(),
    logoUrl: z.string().url(t("schema.common.url_invalid")).optional(),
    faviconUrl: z.string().url(t("schema.common.url_invalid")).optional(),
    primaryColor: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, t("schema.common.invalid_color")),
    email: z.string().email(t("schema.auth.email_invalid")).optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    facebook: z.string().url(t("schema.common.url_invalid")).optional(),
    twitter: z.string().url(t("schema.common.url_invalid")).optional(),
    instagram: z.string().url(t("schema.common.url_invalid")).optional(),
    youtube: z.string().url(t("schema.common.url_invalid")).optional(),
    tiktok: z.string().url(t("schema.common.url_invalid")).optional(),
  });

export type SettingFormValues = z.infer<ReturnType<typeof getSettingSchema>>;
