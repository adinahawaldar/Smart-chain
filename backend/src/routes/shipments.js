const router = require('express').Router();
const ctrl = require('../controllers/shipmentsController');

router.get('/', ctrl.getShipments);
router.get('/tick', ctrl.getTick);
router.post('/ingest-csv', ctrl.ingestCSV);
router.post('/:id/reroute', ctrl.rerouteShipment);

module.exports = router;