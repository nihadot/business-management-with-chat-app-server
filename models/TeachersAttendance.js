// Import mongoose
import mongoose from 'mongoose';

// Define the schema for teacher/babysitters attendance
const teacherAttendanceSchema = new mongoose.Schema({
    teacher_babysitters_attendance_id: {
        type: Number,
        required: true,
        unique: true // Primary key constraint
    },
    teacher_babysitters_id: {
        type: String,
        required: true,
        ref: 'Teacher' // Assuming Teacher schema for teacher/babysitter details
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
export const TeacherAttendance = mongoose.model('TeacherAttendance', teacherAttendanceSchema);
