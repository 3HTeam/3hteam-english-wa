import { z } from "zod";

export const getUserSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email(t("schema.user.email_invalid")),
    fullName: z.string().min(1, t("schema.user.full_name_required")),
    role: z.enum(["ADMIN", "USER"], {
      message: t("schema.user.role_invalid"),
    }),
    avatar: z.string().nullish(),
    phone: z.string().nullish(),
    levelId: z.string().nullish(),
    targetLevel: z.string().nullish(),
    dailyGoal: z.coerce.number().min(0).default(0),
    streak: z.coerce.number().min(0).default(0),
    emailVerified: z.boolean().default(false),
  });

export type UserFormValues = z.infer<ReturnType<typeof getUserSchema>>;
