// Import mongoose
import mongoose from 'mongoose';

// Define the schema for salary
const salarySchema = new mongoose.Schema({

    date: {
        type: Date,
    },
    amount: {
        type: Number,
    },
    receiverId: {
        type: mongoose.Types.ObjectId,
    },
    role:{
        type:String,
        enum:['teacher','doctor']
    }
});

// Define a model using the schema
 const Salary = mongoose.model('Salary', salarySchema);

// Export the model
export default Salary;
