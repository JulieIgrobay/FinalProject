const attendanceModel = require('../model/attendanceModel');
const memberModel = require('../model/memberModel');
const eventModel = require('../model/eventModel');
const moment = require('moment');
const { validationResult } = require('express-validator');
const { body, query } = require('express-validator');

exports.createAttendance = async (req, res, next) => {
    try
    {
        const Member = req.body.member;
        const Events = req.body.event;

        console.log(Member);
        console.log(Events);
        const attendance = new attendanceModel(req.body);

        const members = await memberModel.findById(Member);
        console.log(members)
        members.eventAttendance.push(attendance._id);
        

        const events = await eventModel.findById(Events);
        console.log(events)
        events.memberAttendance.push(attendance._id);
        
        await attendance.save();
        await members.save();
        await events.save();
        
        res.sendStatus(200);
    }catch(e)
    {
        next(e);
    }
}

exports.updateAttendance = async (req, res, next) => {
    try
    {
        const attendanceId = req.param.id;
        const attendance = req.body;
        
        await attendanceModel.findByIdAndUpdate(attendanceId,attendance);

        res.sendStatus(200);
    }catch(e)
    {
        next(e);
    }

}

exports.deleteAttendance = async (req, res, next) => {
    try
    {
        const attendanceId = req.param.id;
        await attendanceModel.deleteOne({_id: attendanceId });
    }catch(e)
    {
        next(e)
    }
}


/*-------------------*/
/*VALIDATION*/
/*-------------------*/

const validate = validations => {
    return async (req, res, next) => {
      await Promise.all(validations.map(validation => validation.run(req)));
  
      const errors = validationResult(req);
      if (errors.isEmpty()) 
      {
        return next();
      }
      res.status(400).json({ result: 'Validation Error', validationMessages: errors.array().map(err => err.msg) });
    };
  };
 
const isValidDate = (value) => {
    return moment(new Date(value)).isValid();
  };
  
const isEmptyOrValidDate = (value) => {
    if (value) {
      return isValidDate(value);
    }
    return true;
};

const isTimeInDateValid = (value, { req, loc, path }) => {
    const endDateTime = req.query.timeOut;
    if (endDateTime) {
      return value < endDateTime;
    }
    return true;
  };
  

exports.attendanceValidation = validate([
    body('TimeIn').not().isEmpty().withMessage('TimeIn is required.').custom(isEmptyOrValidDate).withMessage('Check date format').custom(isTimeInDateValid).withMessage('startDateTime should be less than endDateTime.'),
    body('TimeOut').custom(isEmptyOrValidDate).withMessage('Check date format')
]);
  
exports.attendanceExistsValidation = async (req, res, next) => {
    try{
      const eventId = await memberModel.findById(req.params.id).exec();
  
      if(!eventId)
      {
        res.status(400).send(`Attendance Id does not exists.`);
      }
    }catch(error)
    {
      next(error);
    }
  }
exports.attendanceUpdateValidation = async (req, res, next) => {
    try {
      if (req.body.id !== req.param.id) {
        res.status(400).send(`Attendance Id cannot be updated`);
      } else {
        next();
      }
    } catch (e) {
      next(e);
    }
  }