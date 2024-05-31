// Import mongoose
import mongoose from 'mongoose';

// Define the schema for child attendance
const childAttendanceSchema = new mongoose.Schema({
    child_attendance_id: {
        type: Number,
        required: true,
        unique: true // Primary key constraint
    },
    childId: {
        type: String,
        required: true,
        ref: 'Children' // Assuming Children schema for child details
    },
    date: {
        type: Date,
        required: true
    },
    presentOrAbsent: {
        type: String,
        required: true,
        enum: ['present', 'absent'] // Constraint to ensure value is either 'present' or 'absent'
    }
});

// Define a model using the schema
export const ChildAttendance = mongoose.model('ChildAttendance', childAttendanceSchema);
