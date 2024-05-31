import {Admin} from '../models/Admin.js';
import jwt from "jsonwebtoken"
import Salary from '../models/Salary.js';
import mongoose from 'mongoose';
import { HealthRecord } from '../models/HealthRecords.js';


export const createAdmin = async (req, res) => {
    try {
        const existAdmin = await Admin.findOne({email:req.body.email})
        if(existAdmin) return res.status(200).json({message:'Mail already exist!'});
        const admin = new Admin(req.body);
        const savedAdmin = await admin.save();
        return res.status(201).json({result:savedAdmin});
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const getHealthRecords = async (req, res) => {
    try {
        const schedules = await HealthRecord.aggregate([
            // {consultantId:new mongoose.Types.ObjectId(req.params.id)}
            {
                $match:{
                    consultantId:new mongoose.Types.ObjectId(req.params.id)
                }
            },
            {
                $lookup:{
                    from:"doctors",
                    localField:"doctorId",
                    foreignField:"_id",
                    as:'doctorInfo',
                }
            }
        ])
        return res.status(200).json({result:schedules});
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};


export const getAllAdminsAll = async (req, res) => {
    try {
        const admins = await Admin.find();
        return res.status(200).json({result:admins});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
export const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();
        return res.status(200).json({result:admins});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAdminById = async (req, res) => {
    try {
        if(!req.params?.id) return res.status(400).json({message:"Id Not Provided"})
        const existAdmin = await Admin.findById(req.params.id)
        if(!existAdmin) return res.status(200).json({message:'Account not exist!'});
        const admin = await Admin.findById(req.params.id);
        if (!admin) return res.status(404).json({ message: 'Admin not found' });
        return res.status(200).json({result:admin});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateAdmin = async (req, res) => {
    try {
    //    
        if(!req.params?.id) return res.status(400).json({message:"Id Not Provided"})
        const existAdmin = await Admin.findById(req.params.id)
        if(!existAdmin) return res.status(200).json({message:'Account not exist!'});
        const response = await Admin.findByIdAndUpdate(req.params.id,{ $set:req.body },{new:true});
        return res.status(200).json({ message: 'updated',result:response });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const deleteAdmin = async (req, res) => {
    try {
        if(!req.params?.id) return res.status(400).json({message:"Id Not Provided"})
        const existAdmin = await Admin.findById(req.params.id)
        if(!existAdmin) return res.status(200).json({message:'Account not exist!'});
        await Admin.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: 'Account deleted' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const loginAdmin = async (req, res) => {
    try {
        console.log(req.body)
        const isExistAdmin = await Admin.findOne({email:req.body.email})
        if(!isExistAdmin) return res.status(400).json({message:'Mail is not found'});
        const isExistPassword = await Admin.findOne({password:req.body.password})
        if(!isExistPassword) return res.status(400).json({message:'Password not match'});
        const token = jwt.sign({ id: isExistAdmin._id,isAdmin: isExistAdmin.isAdmin}, 'privateKey123', { expiresIn:"30 days" });
        res.cookie('token', token, { httpOnly: true });
        return res.status(200).json({ result: isExistAdmin,token });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// progress
// paySalary

export const paySalary = async (req, res) => {
    try {
        // console.log(req.body);
        // return true
        const salary = new Salary(req.body);
        const savedSalary = await salary.save();
        return res.status(201).json({result:savedSalary});
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const getAllSalary = async (req, res) => {
    try {
        if(!req.params.id) return res.status(400).json({message:"Id not provided"})
        const salary = await Salary.find({receiverId:new mongoose.Types.ObjectId(req.params.id)});
        return res.status(201).json({result:salary});
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
