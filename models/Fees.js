// Import mongoose
import mongoose from 'mongoose';

// Define the schema for payments
const feesSchema = new mongoose.Schema({
    amount: {
        type: Number,
    },
});

// Define a model using the schema
const Fees = mongoose.model('Fees', feesSchema);

// Export the model
export default Fees;

