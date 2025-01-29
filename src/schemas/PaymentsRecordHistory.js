const mongoose = require('mongoose');

const paymentsRecordHistorySchema = new mongoose.Schema({
    
})

const PaymentsRecordHistory = mongoose.model('Feedback', paymentsRecordHistorySchema);

module.exports = PaymentsRecordHistory;