// Import mongoose
import mongoose from 'mongoose';

// Define the schema for communication
const communicationSchema = new mongoose.Schema({
    communication_id: {
        type: Number,
        required: true,
        unique: true // Primary key constraint
    },
    date: {
        type: Date,
        required: true
    },
    senderId: {
        type: String,
        required: true
    },
    receiverId: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

// Define a model using the schema
const Communication = mongoose.model('Communication', communicationSchema);

// Export the model
export default Communication;
