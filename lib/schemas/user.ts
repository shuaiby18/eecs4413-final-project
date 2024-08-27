import { z } from "zod";

// Schema for Login
export const LoginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address. Email is required.",
  }),
  password: z.string().min(1, {
    message: "Please enter your password. Password is required.",
  }),
  code: z.optional(z.string()),
  callbackUrl: z.string().default("/"),
});

// Schema for Registration
export const RegisterSchema = z
  .object({
    name: z.string().min(1, {
      message: "Please enter a valid name, required.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address, required.",
    }),
    password: z.string().min(6, {
      message: "Please enter a password with at least 6 characters, required",
    }),
    passwordConfirmation: z.string().min(6, {
      message: "Please confirm your password, required.",
    }),
    shippingAddress: z.object({
      street: z.string().min(1, { message: "Street address is required." }),
      city: z.string().min(1, { message: "City is required." }),
      state: z.string().min(1, { message: "State is required." }),
      postalCode: z.string().min(1, { message: "Postal code is required." }),
      country: z.string().min(1, { message: "Country is required." }),
    }),
    creditCardInfo: z.object({
      number: z.string().min(16, { message: "Card number is required." }),
      expDate: z.string().min(5, { message: "Expiry date is required." }),
      cvv: z.string().min(3, { message: "CVV is required." }),
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match.",
    path: ["passwordConfirmation"],
  });

// Schema for Updating User Information
export const UpdateSchema = z
  .object({
    name: z.string().min(3, {
      message: "Please enter name, required",
    }),
    email: z.string().email({
      message: "Please enter a valid email address, required.",
    }),
    password: z
      .string()
      .min(6, {
        message: "Please enter a password with at least 6 characters, required",
      })
      .or(z.literal("")),
    passwordConfirmation: z
      .string()
      .min(6, {
        message: "Please confirm your password, required.",
      })
      .or(z.literal("")),
    shippingAddress: z.object({
      street: z.string().min(1, { message: "Street address is required." }),
      city: z.string().min(1, { message: "City is required." }),
      state: z.string().min(1, { message: "State is required." }),
      postalCode: z.string().min(1, { message: "Postal code is required." }),
      country: z.string().min(1, { message: "Country is required." }),
    }),
    creditCardInfo: z.object({
      number: z.string().min(16, { message: "Card number is required." }),
      expDate: z.string().min(5, { message: "Expiry date is required." }),
      cvv: z.string().min(3, { message: "CVV is required." }),
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match.",
    path: ["passwordConfirmation"],
  });
