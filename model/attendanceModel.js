const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const attendanceSchema = new Schema({
    timeInd: {
        type: Date,
        require: true
    },
    timeOut: {
        type: Date,
        require: false
    },
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'members'
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'events'
    }
});

const attendanceModel  = mongoose.model('attendance',attendanceSchema);

module.exports = attendanceModel;