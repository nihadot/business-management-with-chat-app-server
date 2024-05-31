// Import mongoose
import mongoose from 'mongoose';

// Define the schema for activities
const activitySchema = new mongoose.Schema({
    date: {
        type: Date,
    },
    childrenId: {
        type: mongoose.Types.ObjectId,
    },
    assignedBy: {
        type: mongoose.Types.ObjectId,
    },
    activityDetails: {
        type: String,
    }
});

// Define a model using the schema
export const Activity = mongoose.model('Activity', activitySchema);

