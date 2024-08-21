import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
      message: "Please enter a valid email address. Email is required.",
    }),
    password: z.string().min(1, {
      message: "Please enter your password. Password is required.",
    }),
    code: z.optional(z.string()),
    callbackUrl: z.optional(z.string()),
  });
  
export const RegisterSchema = z
  .object({
    email: z.string().email({
      message: "Please enter a valid email address, required.",
    }),
    password: z.string().min(6, {
      message: "Please enter a password with at least 6 characters, required",
    }),
    passwordConfirmation: z.string().min(6, {
      message: "Please confirm your password, required.",
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match.",
    path: ["passwordConfirmation"],
  });

  export const UpdateSchema = z
  .object({
    name: z.string().min(3, {
      message: "Please enter name, required",
    }),
    email: z.string().email({
      message: "Please enter a valid email address, required.",
    }),
    password: z.string().min(6, {
      message: "Please enter a password with at least 6 characters, required",
    }).or(z.literal("")),
    passwordConfirmation: z.string().min(6, {
      message: "Please confirm your password, required.",
    }).or(z.literal("")),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match.",
    path: ["passwordConfirmation"],
  });

  