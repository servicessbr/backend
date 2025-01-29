
const mongoose = require('mongoose');

const ServiceOrderIntentionSchema = new mongoose.Schema({
    so_unique_id: {
        type: String,
        required: true,
        unique: true
    },
    unique_id: {
        type: String,
        required: true,
        unique: true
    },
    client_uid: {
        type: String,
        required: true,
        unique: false
    },
    client_name: {
        type: String,
        required: true,
        unique: false
    },
    client_email: {
        type: String,
        required: false,
        unique: false
    },
    prof_uid: {
        type: String,
        required: true,
        unique: false
    },
    prof_name: {
        type: String,
        required: true,
        unique: false
    },
    prof_email: {
        type: String,
        required: false,
        unique: false
    },
    work_ref: {
        type: String,
        required: true,
        unique: false
    },
    work_title: {
        type: String,
        required: true,
        unique: false
    },
    status: {
        type: String,
        required: true,
        unique: false
    },
    pix: {
        type: String,
        required: false,
        unique: false
    },
    price: {
        type: Number,
        required: false,
        unique: false
    },
    ser_description: {
        type: String,
        required: false,
        unique: false
    },
    ser_response: {
        type: String,
        required: false,
        unique: false
    },
    loc_place: {
        type: String,
        required: false,
        unique: false
    },
    loc_location: {
        type: String,
        required: false,
        unique: false
    },
    date_hours: {
        type: String,
        required: false,
        unique: false
    },
    date_month: {
        type: String,
        required: false,
        unique: false
    },
    date_day: {
        type: Number,
        required: false,
        unique: false
    },
    date_week: {
        type: String,
        required: false,
        unique: false
    },
    adminMark: {
        type: Boolean,
        required: false,
        unique:false
    }
    /*paid: {},*/
    /*finished: {},*/
})

const ServiceOrderIntention = mongoose.model('ServiceOrderIntention', ServiceOrderIntentionSchema);

module.exports = ServiceOrderIntention;