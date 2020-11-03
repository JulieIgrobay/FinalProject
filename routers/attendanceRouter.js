const express = require('express');
const attendanceController = require('../controllers/attendanceControllers');

const router = express.Router();


router.post('/', attendanceController.attendanceValidation, attendanceController.createAttendance);
router.put('/:id',attendanceController.attendanceValidation, attendanceController.attendanceExistsValidation,attendanceController.attendanceUpdateValidation, attendanceController.updateAttendance);
router.delete('/:id',attendanceController.attendanceValidation,attendanceController.attendanceExistsValidation, attendanceController.deleteAttendance)

module.exports = router;
