/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

export const verifyEmailSchema = (t: (key: string, options?: any) => string) =>
  z.object({
    email: z.string().email(t("schema.auth.email_invalid")),
    otp: z
      .string()
      .length(6, t("schema.auth.otp_length", { length: 6 }))
      .regex(/^[0-9]+$/, t("schema.auth.otp_digits")),
  });

export type VerifyEmailFormValues = z.infer<
  ReturnType<typeof verifyEmailSchema>
>;
