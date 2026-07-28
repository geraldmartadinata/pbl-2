const { z } = require('zod');

const submitApplicationSchema = z.object({
  body: z.object({
    divisionId: z.string().uuid(),
    motivation: z.string().min(20).max(1000),
    reasonForJoining: z.string().min(20).max(1000),
    relevantSkills: z.string().min(3).max(1000),
    organizationalExperience: z.string().max(1000).optional().nullable(),
    timeCommitmentAgreed: z.boolean().refine(val => val === true, {
      message: "You must agree to the time commitment"
    }),
    portfolioUrl: z.string().url().optional().nullable().or(z.literal('')),
    linkedinUrl: z.string().url().optional().nullable().or(z.literal('')),
    githubUrl: z.string().url().optional().nullable().or(z.literal('')),
    additionalNotes: z.string().max(1000).optional().nullable(),
  }),
});

const updateApplicationSchema = z.object({
  body: z.object({
    divisionId: z.string().uuid().optional(),
    motivation: z.string().min(20).max(1000).optional(),
    reasonForJoining: z.string().min(20).max(1000).optional(),
    relevantSkills: z.string().min(3).max(1000).optional(),
    organizationalExperience: z.string().max(1000).optional().nullable(),
    portfolioUrl: z.string().url().optional().nullable().or(z.literal('')),
    linkedinUrl: z.string().url().optional().nullable().or(z.literal('')),
    githubUrl: z.string().url().optional().nullable().or(z.literal('')),
    additionalNotes: z.string().max(1000).optional().nullable(),
  }),
});

module.exports = {
  submitApplicationSchema,
  updateApplicationSchema,
};
