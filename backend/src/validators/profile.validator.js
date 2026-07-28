const { z } = require('zod');

const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(3).max(100).optional(),
    phone: z.string().regex(/^\d{10,15}$/, 'Phone must be 10-15 digits').optional(),
    studyProgram: z.string().max(100).optional(),
    intakeYear: z.number().int().min(1900).max(2100).optional(),
    campus: z.string().max(100).optional(),
    instagramUsername: z.string().optional().nullable(),
  }),
});

module.exports = {
  updateProfileSchema,
};
