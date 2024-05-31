// Import mongoose
import mongoose from 'mongoose';

// Define the schema for payments
const paymentSchema = new mongoose.Schema({
    date: {
        type: Date,
    },
    amount: {
        type: Number,
    },
    child_id: {
        type:mongoose.Types.ObjectId
    },
    parentId:{
        type:mongoose.Types.ObjectId
    }
});

// Define a model using the schema
const Payment = mongoose.model('Payment', paymentSchema);

// Export the model
export default Payment;

