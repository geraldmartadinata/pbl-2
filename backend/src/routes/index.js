const express = require('express');

const authRoutes = require('./auth.routes');
const divisionRoutes = require('./division.routes');
const applicationRoutes = require('./application.routes');
const profileRoutes = require('./profile.routes');
const adminRoutes = require('./admin.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/divisions', divisionRoutes);
router.use('/applications', applicationRoutes);
router.use('/users', profileRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
