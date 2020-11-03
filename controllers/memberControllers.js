
const memberModel = require('../model/memberModel')
const { validationResult } = require('express-validator');
const { body, query } = require('express-validator');

exports.getAllMembers = async (req, res, next) => {
    const members= await memberModel.find({}).populate({path: 'eventAttendance',populate:'events'});
  
    res.status(200).send(members);
    //res.sendStatus(200);
}

exports.getMemberById = async (req, res, next) => {
   
  try {
    const memberId = req.params.id;
    const listMember = await memberModel.findById(memberId).populate({path: 'eventAttendance',populate:'events'});
    if(listMember)
    {
      res.status(200).send(listMember);
    }
    else
    {
      res.status(400).send('error')
    }
  }catch(e)
  {
    next(e);
  }
}

exports.createMemberValidation = async (req, res, next)=>{
    const requiredProps = ['memberName', 'status'];
	  const bodyProps = Object.keys(req.body);

	const propsAreValid = requiredProps.every(propName => bodyProps.includes(propName));

    if(!propsAreValid)
	  {
		res.status(400).send('Error 400: Not a valid');
    } 
    else
	  {
        next();
    }
};

exports.createMember = async (req, res, next) => {
    
  try
  {
    const member = new memberModel(req.body);
  
    await member.save();
    
    res.sendStatus(201);

  }catch(e){
    next(e);
  }
};


exports.updateMember = async (req, res, next) => {
    
  try
  {
    const id = req.params.id;

    await memberModel.findByIdAndUpdate(id, req.body);

    res.sendStatus(200);

  }catch(e)
  {
    next(e)
  }
  
}


exports.deleteMember = async (req, res, next) => {
  try {
    const memberId = req.params.id;
    const listMember = await memberModel.findById(memberId).populate('eventAttendance',['eventName']);

    if(listMember.eventAttendance > 0)
    {
      res.status(400).send('Member cannot be deleted');
    }
    else
    {
      await memberModel.deleteOne({ _id: memberId });
    
      res.sendStatus(200);
    }


  } catch (e) {
    next(e);
  }
}

/*-------------------*/
/*VALIDATION*/
/*-------------------*/


const validStatus = ['Active', 'Inactive'];

const isValidStatus = (value) => {
  const processed = (value || '').trim().toLowerCase();
  return validStatus.indexOf(processed) >= 0;
};

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

exports.memberValidation = validate([
  body('memberName').not().isEmpty().withMessage(`Name is required`).isLength({max: 50}).trim().escape(),
  body('status').not().isEmpty().withMessage(`Status is required.`).custom(isValidStatus).withMessage(`Status should be either Active or Inactive.`).trim().escape()
]);

exports.memberExistsValidation = async (req, res, next) => {
  try{
    const memberId = await memberModel.findById(req.params.id).exec();

    if(!memberId)
    {
      res.status(400).send(`Member Id does not exists.`);
    }
  }catch(error)
  {
    next(error);
  }
}
exports.memberUpdateValidation = async (req, res, next) => {
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
