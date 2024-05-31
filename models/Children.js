// Import mongoose
import mongoose from 'mongoose';

// Define the schema for children details
const childrenSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    age: {
        type: Number,
    },
    email: {
        type: String,
    },
    number: {
        type: String,
    },
    gender: {
        type: String,
    },
    image: {
        type: String,
    },
    housename: {
        type: String,
    },
    place: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    standard: {
        type: String,
    },
    payment: {
        type: Number,
    },
    parent_Id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    isStatus:{
        type:Boolean,
        default:false
    },
    isChildren:{
        type:Boolean,
        default:true
    },
    amount:{
        type:String,
    },
}, {
    timestamps: true 
});

// Define a model using the schema
export const Children = mongoose.model('Children', childrenSchema);




// "name": ""
// "age": "",
// "email": "",
// "phone": "",
// "gender": "",
// "photo":"
// "houseName":""
// "place":"",
// "city":"",
// "state": "",
// "standard":""
// "payment": "",
// "parent_Id": ""
// "isStatus" true