const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    fullName: z.string().min(3).max(100),
    nim: z.string().max(30),
    email: z.string().email(),
    phone: z.string().regex(/^\d{10,15}$/, 'Phone must be 10-15 digits'),
    studyProgram: z.string().max(100),
    intakeYear: z.number().int().min(1900).max(2100),
    campus: z.string().max(100),
    instagramUsername: z.string().optional().nullable(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1, 'Password is required'),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};
