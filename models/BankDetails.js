// Import mongoose
import mongoose from 'mongoose';

// Define the schema for activities
const BankDetailsSchema = new mongoose.Schema({
    IFSCCode: {
        type: String,
    },
    accountNumber: {
        type: String,
    },
    branch: {
        type: String,
    },
    userType:{
        type:String,
        enum:['teacher','doctor','none'],
        default:'none'
    },
    holderId:{
        type:mongoose.Types.ObjectId,
    }
});

// Define a model using the schema
export const BankDeatils = mongoose.model('BankDetails', BankDetailsSchema);

