const express = require('express');
const applicationController = require('../controllers/application.controller');
const validate = require('../middleware/validate');
const { submitApplicationSchema, updateApplicationSchema } = require('../validators/application.validator');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.use(authenticate);

router.post('/', validate(submitApplicationSchema), applicationController.submitApplication);
router.get('/me', applicationController.getMyApplication);
router.patch('/me', validate(updateApplicationSchema), applicationController.updateMyApplication);

module.exports = router;
