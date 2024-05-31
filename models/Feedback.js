// Import mongoose
import mongoose from 'mongoose';

// Define the schema for feedback
const feedbackSchema = new mongoose.Schema({
    date: {
        type: Date,
    },
    description: {
        type: String,
    },
    sender: {
        type: mongoose.Types.ObjectId,
    }
});

// Define a model using the schema
const Feedback = mongoose.model('Feedback', feedbackSchema);

// Export the model
export default Feedback;
