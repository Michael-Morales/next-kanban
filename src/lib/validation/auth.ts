import { z } from "zod";

export const signinSchema = z.object({
  email: z.string().min(1, { message: "Required" }).email(),
  password: z
    .string()
    .min(6, { message: "Must be at least 6 characters long" }),
});

export const signupSchema = signinSchema
  .extend({
    confirmPassword: z
      .string()
      .min(6, { message: "Must be at least 6 characters long" }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ISignin = z.infer<typeof signinSchema>;
export type ISignup = z.infer<typeof signupSchema>;
