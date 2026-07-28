const express = require('express');
const profileController = require('../controllers/profile.controller');
const validate = require('../middleware/validate');
const { updateProfileSchema } = require('../validators/profile.validator');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.use(authenticate);

router.get('/me', profileController.getMe);
router.patch('/me', validate(updateProfileSchema), profileController.updateProfile);

module.exports = router;
