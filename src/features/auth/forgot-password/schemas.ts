import { z } from "zod";

export const forgotPasswordSchema = (
  t: (key: string, options?: any) => string,
) =>
  z.object({
    email: z
      .string()
      .trim()
      .min(1, t("schema.auth.email_required"))
      .email(t("schema.auth.email_invalid")),
  });

export type ForgotPasswordFormValues = z.infer<
  ReturnType<typeof forgotPasswordSchema>
>;
