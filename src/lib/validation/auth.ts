import { z } from "zod";

import axios from "@lib/axios";

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
  })
  .refine(
    async ({ email }) => {
      const { data } = await axios.get(`/users/${email}`);
      return !data.exists;
    },
    { message: "Email already exists", path: ["email"] }
  );

export type ISignin = z.infer<typeof signinSchema>;
export type ISignup = z.infer<typeof signupSchema>;
