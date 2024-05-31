import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    }, 
    age: {
        type: Number,
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
    state:{
        type:String,
    },
    qualification:{
        type:String,
    },
    isTeacher:{
        type:Boolean,
        default:true
    },
    isStatus:{
        type:Boolean,
        default:false
    },
    bankInfoId:{
        type:mongoose.Types.ObjectId
    },
    isOnline:{
        type:Boolean,
        default:false
    },

});

export const Teacher = mongoose.model('Teacher', Schema);



//  "password":""
// "name": "",
// "age" : "",
// "email": "",
// "phoneNumber": "",
// "gender" : "",
// "photo": "",
// "houseName": "",
// "place":  "",
// "city":  "",
// "state" : "",
// "qualification" : "",
// "isTeacher": true
