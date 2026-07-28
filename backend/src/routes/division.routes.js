const express = require('express');
const divisionController = require('../controllers/division.controller');

const router = express.Router();

router.get('/', divisionController.getActiveDivisions);

module.exports = router;
