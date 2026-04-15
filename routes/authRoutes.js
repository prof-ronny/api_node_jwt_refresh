const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');

router.post('/refresh', controller.refresh);
router.post('/logout', controller.logout);

module.exports = router;