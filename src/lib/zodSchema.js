import { z } from "zod";

export const authSchema = z.object({
  email: z
    .string()
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must be at most 64 characters")
    .regex(/[0-9]/, "Must include at least one number"),

  otp:z
    .string()
    .regex(/^\d{6}$/, "OTP must be a 6-digit number"),

  _id: z.string().min(3, 'Id is required'),
  alt: z.string().min(3, 'Alt is required'),
  title: z.string().min(3, 'Title is required'),
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  slug:z.string().min(3, "slug is required."),
});
