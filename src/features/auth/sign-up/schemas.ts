import { z } from "zod";

import { getSignInSchema } from "../sign-in";

export const getSignUpSchema = (t: (key: string, options?: any) => string) =>
  getSignInSchema(t)
    .extend({
      fullName: z.string().trim().min(1, t("schema.auth.full_name_required")),
      confirmPassword: z
        .string()
        .min(6, t("schema.auth.password_min", { min: 6 }))
        .max(64, t("schema.auth.password_max", { max: 64 })),
      agreeTerms: z
        .boolean()
        .refine((val) => val === true, t("schema.auth.agree_terms")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("schema.auth.password_mismatch"),
      path: ["confirmPassword"],
    });

export type SignUpFormValues = z.infer<ReturnType<typeof getSignUpSchema>>;
