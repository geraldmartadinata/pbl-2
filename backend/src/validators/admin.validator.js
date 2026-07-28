const { z } = require('zod');

const updateStatusSchema = z.object({
  params: z.object({
    applicationId: z.string().uuid(),
  }),
  body: z.object({
    status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED']),
    adminNote: z.string().max(1000).optional().nullable(),
  }),
});

const getApplicationsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
    limit: z.string().regex(/^\d+$/).transform(Number).optional().default('10'),
    search: z.string().optional(),
    status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED']).optional(),
    divisionId: z.string().uuid().optional(),
    intakeYear: z.string().regex(/^\d{4}$/).transform(Number).optional(),
    sortBy: z.enum(['submitted_at', 'full_name', 'nim', 'status']).optional().default('submitted_at'),
    sortOrder: z.enum(['ASC', 'DESC', 'asc', 'desc']).optional().default('DESC'),
  }),
});

const getApplicationDetailSchema = z.object({
  params: z.object({
    applicationId: z.string().uuid(),
  }),
});

module.exports = {
  updateStatusSchema,
  getApplicationsSchema,
  getApplicationDetailSchema,
};
