const express = require('express');
const eventController = require('../controllers/eventControllers');

const router = express.Router();

//router.get('/search',eventController.getAllEvents)
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventsById);

router.post('/',eventController.eventValidation, eventController.createEvent);
router.put('/:id',eventController.eventValidation,eventController.eventExistsValidation,eventController.eventUpdateValidation, eventController.updateEvent);
router.delete('/:id',eventController.eventExistsValidation,eventController.deleteEvent)

module.exports = router;