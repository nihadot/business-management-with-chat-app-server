// Import the Teacher model
import { Children } from '../models/Children.js';
import { Doctor } from '../models/Doctor.js';
import { Parent } from '../models/Parent.js';
import {Teacher} from '../models/Teacher.js';
import {Activity} from '../models/Activity.js';
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';
import { Attendance } from '../models/Attendance.js';
import { BankDeatils } from '../models/BankDetails.js';

export const create = async (req, res) => {

    // console.log(req.body);
    try {
        const isExist = await Teacher.findOne({email:req.body.email});
        if(isExist) return res.status(400).json({message:"Mail is Existing!!"})
        const teacher = new Teacher(req.body);
        const savedTeacher = await teacher.save();
        const bankDetails = new BankDeatils({...req.body,userType:'teacher',holderId:savedTeacher._id});
        const savedBankDetails = await bankDetails.save();
        await Teacher.findByIdAndUpdate(savedTeacher._id,{bankInfoId:savedBankDetails._id});
        res.status(201).json({result:savedTeacher,message:''});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const isExist = await Teacher.findOne({email:req.body.email})
        if(!isExist) return res.status(400).json({message:'Mail is not found'});
        const isExistPassword = await Teacher.findOne({password:req.body.password})
        if(!isExistPassword) return res.status(400).json({message:'Password not match'});
        if(!isExist.isStatus) return res.status(200).json({message:"Your request is pending...",status:false})
        const token = jwt.sign({ id: isExist._id,isTeacher: isExist.isTeacher}, 'privateKey123', { expiresIn:"30 days" });
        res.cookie('token', token, { httpOnly: true });
        return res.status(200).json({ status:true,result: isExist,token });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const getAll = async (req, res) => {
    try {
        if(req.user.isAdmin){
            const teachers = await Teacher.aggregate([{
                $lookup:{
                    from:"bankdetails",
                    foreignField:"_id",
                    localField:"bankInfoId",
                    as:"Bankinfo"
                }
            }]);
            return res.json({result:teachers});
        }else{
            const teachers = await Teacher.aggregate([
                {
                    $match:{
                        isStatus:true
                    }
                },
                {
                $lookup:{
                    from:"bankdetails",
                    foreignField:"_id",
                    localField:"bankInfoId",
                    as:"Bankinfo"
                }
            }]);
            return res.json({result:teachers});
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getAllTeachers = async (req, res) => {
    try {
        
            const teachers = await Teacher.aggregate([
                {
                    $match:{
                        isStatus:true
                    }
                },
                {
                $lookup:{
                    from:"bankdetails",
                    foreignField:"_id",
                    localField:"bankInfoId",
                    as:"Bankinfo"
                }
            }]);
            // console.log(teachers,'---')
            return res.json({result:teachers});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getById = async (req, res) => {
    try {
        if(!req.params.id) return res.status(200).json({message:"Id Not Provided!"})
        const teacher = await Teacher.aggregate([
            {
                $match:{
                    _id:new mongoose.Types.ObjectId(req.params.id)
                }
            },
            {
                $lookup:{
                    from:"bankdetails",
                    foreignField:"_id",
                    localField:"bankInfoId",
                    as:"Bankinfo"
                }
            }
        ]);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        res.json({result:teacher[0]});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateById= async (req, res) => {
    try {
        if(!req.params.id) return res.status(400).json({message:"Id Not Provided"})
        const updatedTeacher = await Teacher.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true });
    
    await BankDeatils.findByIdAndUpdate(
        req.body.bankId,
        req.body);


        if (!updatedTeacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        return res.json({result:updatedTeacher,message:"Updated"});
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const deleteById = async (req, res) => {
    try {
        if(!req.params.id) return res.status(400).json({message:"Id not provided"})
        const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);
        if (!deletedTeacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        res.json({ message: 'Teacher Deleted Successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const ChangeStatus= async (req, res) => {
    // body
    // type [ 'teacher','children','doctor']
    // id : id of the user
    // status : boolean
    try {


        if(!req.body.id) return res.json({message:"Id Not Provided!"})
        if(!req.body.type) return res.json({message:"Please mention type!"})

        if(req.body.type === 'teacher'){
            await Teacher.findByIdAndUpdate(req.body.id,{$set:{isStatus:req.body.status}},{ new: true });
        }

        if(req.body.type === 'children'){
            await Children.findByIdAndUpdate(req.body.id,{$set:{isStatus:req.body.status}},{ new: true });
        }

        if(req.body.type === 'doctor'){
            await Doctor.findByIdAndUpdate(req.body.id,{$set:{isStatus:req.body.status}},{ new: true });
        }

        if(req.body.type === 'parent'){
            await Parent.findByIdAndUpdate(req.body.id,{$set:{isStatus:req.body.status}},{ new: true });
        }

        return res.status(200).json({message:"Updated"});
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};


export const addActivity = async (req, res) => {
    try {
        const newActivity = await Activity({...req.body,assignedBy:req.user._id,date:new Date()})
        const savedTeacher = await newActivity.save();
        res.status(201).json({result:savedTeacher,message:'created'});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const viewAllActivites = async (req, res) => {
    try {
        if(!req.params.id) return res.status(400).json({message:"id not provided"})
        const getActivites = await Activity.find({childrenId:new mongoose.Types.ObjectId(req.params.id)})

        res.status(201).json({result:getActivites});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const AttendanceAssignment = async (req, res) => {
    try {
    //    console.log(req.body)
        const getAttendance = await Attendance({UserType:req.body.type,childrenId:req.body.id,status:req.body.status,date:req.body.date,assignedBy:req.user._id})
        // console.log(getAttendance)
        const savedAttendance = getAttendance.save()
        return res.status(201).json({result:savedAttendance});
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
export const getTeacherAttendancesById = async (req, res) => {
    try {
        if(!req.params.id) return res.json({message:"id not provided"})
        const getAttendance = await Attendance.find({childrenId:new mongoose.Types.ObjectId(req.params.id)})
        return res.status(201).json({result:getAttendance});
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// 
// UserType: {
//     type: String,
// },
// childrenId: {
//     type: mongoose.Types.ObjectId,
// },
// status: {
//     type: String,
// },
// date: {
//     type: Date,
// }


export const getAttendanceAssignmentById = async (req, res) => {
    try {
        const getAttendance = await Attendance({UserType:req.body.type,childrenId:req.body.id,status:req.body.status,date:new Date(),assignedBy:req.user._id})
        const savedAttendance = getAttendance.save()
        return res.status(201).json({result:savedAttendance});
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};