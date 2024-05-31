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
    houseName: {
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
    isAdmin:{
        type:Boolean,
        default:true
    },
    isOnline:{
        type:Boolean,
        default:false
    },

});

export const Admin = mongoose.model('Admin', Schema);



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
