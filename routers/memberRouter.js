const express = require('express');
const memberController = require('../controllers/memberControllers');

const router = express.Router();

router.get('/', memberController.getAllMembers);
router.get('/:id', memberController.getMemberById);

router.post('/', memberController.memberValidation, memberController.createMember);
router.put('/:id',memberController.memberValidation,memberController.memberUpdateValidation, memberController.memberExistsValidation, memberController.updateMember);
router.delete('/:id',memberController.memberExistsValidation,memberController.deleteMember)

module.exports = router;
 