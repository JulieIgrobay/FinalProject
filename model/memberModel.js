const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memberSchema = new Schema({
    memberName: {
        type: String, 
        require: true
    },
    status: {
        type: String, 
        require: true
    },
    eventAttendance:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'attendance'
    }]
});

const memberModel = mongoose.model('members',memberSchema)

module.exports = memberModel;