
const eventModel = require('../model/eventModel')
const moment = require('moment');
const { validationResult } = require('express-validator');
const { body, query } = require('express-validator');

exports.getAllEvents = async (req, res, next) => {
    const events = await eventModel.find({}).populate({path: 'memberAttendance',populate:'members'});
  
    res.status(200).send(events);
}

exports.getEventsById = async (req, res, next) => {
    try {
        const eventId = req.params.id;
        const listEvents = await eventModel.findById(eventId).populate({path: 'memberAttendance',populate:'members'});
    
        if(listEvents)
        {
          res.status(200).send(listEvents);
        }
        else
        {
          //error message here
        }
      }catch(e)
      {
        next(e);
      }
}

exports.createEvent = async (req, res, next) => {
    try
    {
      const events = new eventModel(req.body);
    
      await events.save();
      
      res.status(201);
    }catch(e){
      next(e);
    }
}

exports.updateEvent = async (req, res, next) => {
    try
    {
      const id = req.params.id;
  
      await eventModel.findByIdAndUpdate(id, req.body);
  
      res.status(200);
    }catch(e)
    {
      next(e)
    }
}

exports.deleteEvent = async (req, res, next) => {
    try
    {
        const eventId = req.params.id;
        const listEvent = await eventModel.findById(eventId).populate('memberAttendance',['memberName']);
    
        if(listEvent.memberAttendance.length > 0)
        {
          res.status(400).send('Event cannot be deleted');
        }
        else
        {
          await eventModel.deleteOne({ _id: eventId });
        
          res.sendStatus(200);
        }
    
    
      } catch (e) {
        next(e);
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
const isStartDateValid = (value, { req, loc, path }) => {
  const endDateTime = req.body.endDateTime || req.query.dateend;
  return value < endDateTime;
};

exports.eventValidation = validate([
  body('eventName').not().isEmpty().withMessage('Name is required').isLength({max: 50}).trim().escape(),
  body('eventType').not().isEmpty().withMessage('eventType is required.').isLength({max: 50}).trim().escape(),
  body('startDateTime').not().isEmpty().withMessage('startDateTime is required.').custom(isEmptyOrValidDate).withMessage('Check date format').custom(isStartDateValid).withMessage('startDateTime should be less than endDateTime.'),
  body('endDateTime').not().isEmpty().withMessage('endDateTime is required.').isLength({max: 50}).trim().escape(),
]);

exports.eventExistsValidation = async (req, res, next) => {
  try{
    const eventId = await memberModel.findById(req.params.id).exec();

    if(!eventId)
    {
      res.status(400).send(`Event Id does not exists.`);
    }
  }catch(error)
  {
    next(error);
  }
}
exports.eventUpdateValidation = async (req, res, next) => {
  try {
    if (req.body.id !== req.param.id) {
      res.status(400).send(`Member Id cannot be updated`);
    } else {
      next();
    }
  } catch (e) {
    next(e);
  }
}
