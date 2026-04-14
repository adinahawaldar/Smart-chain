const router = require('express').Router();
const { runSimulation } = require('../controllers/simulateController');

router.post('/', runSimulation);

module.exports = router;
