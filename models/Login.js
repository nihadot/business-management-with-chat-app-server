// Import mongoose
import mongoose from 'mongoose';

// Define the schema for login details
const loginSchema = new mongoose.Schema({
    loginId: {
        type: Number,
        required: true,
        unique: true // Primary key constraint
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
});

// Define a model using the schema
export const Login = mongoose.model('Login', loginSchema);
