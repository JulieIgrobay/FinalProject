const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    eventName: {
        type: String, 
        require: true
    },
    eventType: {
        type: String, 
        require: true
    },
    startDateTime: {
        type: Date,
        require: true
    },
    endDateTime: {
        type: Date,
        require: true
    },
    memberAttendance : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'attendance'
    }]
});

const eventModel = mongoose.model('events',eventSchema)


module.exports = eventModel;

