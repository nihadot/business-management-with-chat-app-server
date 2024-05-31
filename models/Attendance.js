// Import mongoose
import mongoose from 'mongoose';

// Define the schema for activities
const activitySchema = new mongoose.Schema({
    UserType: {
        type: String,
    },
    childrenId: {
        type: mongoose.Types.ObjectId,
    },
    status: {
        type: String,
    },
    date: {
        type: Date,
    },
    assignedBy: {
        type: mongoose.Types.ObjectId,
    },
});

// Define a model using the schema
export const Attendance = mongoose.model('Attendance', activitySchema);

