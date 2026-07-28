const express = require('express');
const adminController = require('../controllers/admin.controller');
const validate = require('../middleware/validate');
const { updateStatusSchema, getApplicationsSchema, getApplicationDetailSchema } = require('../validators/admin.validator');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const router = express.Router();

router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/statistics', adminController.getStatistics);
router.get('/applications', validate(getApplicationsSchema), adminController.getApplications);
router.get('/applications/:applicationId', validate(getApplicationDetailSchema), adminController.getApplicationDetail);
router.patch('/applications/:applicationId/status', validate(updateStatusSchema), adminController.updateApplicationStatus);

module.exports = router;
