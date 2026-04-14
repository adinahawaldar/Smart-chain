const router = require('express').Router();
const { getSummary } = require('../controllers/telemetryController');

router.get('/summary', getSummary);

module.exports = router;
