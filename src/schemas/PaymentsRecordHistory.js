import mongoose from 'mongoose';

const paymentsRecordHistorySchema = new mongoose.Schema({
    
})

const PaymentsRecordHistory = mongoose.model('Feedback', paymentsRecordHistorySchema);

export default PaymentsRecordHistory;