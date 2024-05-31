// Import the Teacher model
import mongoose from 'mongoose';
import { BankDeatils } from '../models/BankDetails.js';
import {Doctor} from '../models/Doctor.js';
import jwt from "jsonwebtoken";
import Consultation from '../models/Consultation.js';

export const registerDoctor = async (req, res) => {
    try {
        const isExist = await Doctor.findOne({email:req.body.email});
        if(isExist) return res.status(400).json({message:"Mail is Existing!!"})
        const doctor = new Doctor(req.body);
        const savedDoctor = await doctor.save();
        const bankDetails = new BankDeatils({...req.body,userType:'doctor',holderId:savedDoctor._id});
        const savedBankDetails = await bankDetails.save();
        await Doctor.findByIdAndUpdate(savedDoctor._id,{bankInfoId:savedBankDetails._id});
        res.status(201).json({result:savedDoctor,message:'Successfully created'});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const createSchedule = async (req, res) => {
    try {
        
        const consultation = new Consultation({childId:req.params.id,message:req.body.message,doctorId:req.params.doctorid});
        const savedDoctor = await consultation.save();
        res.status(201).json({result:savedDoctor,message:'Successfully Scheduled'});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



export const loginDoctor = async (req, res) => {
    try {
        const isExist = await Doctor.findOne({email:req.body.email})
        if(!isExist) return res.status(400).json({message:'Mail is not found'});
        const isExistPassword = await Doctor.findOne({password:req.body.password})
        if(!isExistPassword) return res.status(400).json({message:'Password not match'});
        if(!isExist.isStatus) return res.status(200).json({message:"Your request is pending...",status:false})
        const token = jwt.sign({ id: isExist._id,isTeacher: isExist.isDoctor}, 'privateKey123', { expiresIn:"30 days" });
        res.cookie('token', token, { httpOnly: true });
        return res.status(200).json({ result: isExist,token,status:true });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const getAllDoctors = async (req, res) => {
    try {
        if(req.user.isAdmin){
            const doctors = await Doctor.aggregate([{
                $lookup:{
                    from:"bankdetails",
                    foreignField:"_id",
                    localField:"bankInfoId",
                    as:"Bankinfo"
                }
            }]);
            return res.json({result:doctors});

        }else{
            const doctors = await Doctor.aggregate([
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
            return res.json({result:doctors});
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getDoctorById = async (req, res) => {
    try {
        if(!req.params.id) return res.status(400).json({message:"Id not provided"})
        const doctor = await Doctor.aggregate([
    {
        $match:{
            _id:new mongoose.Types.ObjectId(req.params.id)
        }
    },{
    
            $lookup:{
                from:"bankdetails",
                foreignField:"_id",
                localField:"bankInfoId",
                as:"Bankinfo"
            }
        }]);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        return res.status(200).json({result:doctor[0]});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateDoctorById= async (req, res) => {
    try {
        if(!req.params.id) return res.status(400).json({message:"Id not provided"})
        const updatedDoctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        await BankDeatils.findByIdAndUpdate(
            req.body.bankId,
            req.body);
        if (!updatedDoctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        return res.json(updatedDoctor);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
export const updateDoctorByIdNoAuth= async (req, res) => {
    try {
        if(!req.params.id) return res.status(400).json({message:"Id not provided"})
        const updatedDoctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if(req.body.bankId){

            await BankDeatils.findByIdAndUpdate(
                req.body.bankId,
                req.body);
                if (!updatedDoctor) {
                    return res.status(404).json({ message: 'Doctor not found' });
                }
                return res.json(updatedDoctor);
        }
        if (!updatedDoctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        return res.json(updatedDoctor);

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};


export const deleteDoctorById = async (req, res) => {
    try {
        if(!req.params.id) return res.status(400).json({message:"Id not provided"})
        const deleteDoctor = await Doctor.findByIdAndDelete(req.params.id);
        if (!deleteDoctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.json({ message: 'Doctor Deleted Successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllDoctorsWithoutAuth = async (req, res) => {
    try {
       
            const doctors = await Doctor.aggregate([
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
            return res.json({result:doctors});
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// export const ChangeStatus= async (req, res) => {
//     // body
//     // type [ 'teacher','children','doctor']
//     // id : id of the user
//     // status : boolean
//     try {


//         if(!req.body.id) return res.json({message:"Id Not Provided!"})
//         if(!req.body.type) return res.json({message:"Please mention type!"})

//         if(req.body.type === 'teacher'){
//             await Teacher.findByIdAndUpdate(req.body.id,{$set:{isStatus:req.body.status}},{ new: true });
//         }

//         if(req.body.type === 'children'){
//             // await .findByIdAndUpdate(req.body.id,{$set:{isStatus:req.body.status}},{ new: true });
//         }

//         if(req.body.type === 'doctor'){
//             // await .findByIdAndUpdate(req.body.id,{$set:{isStatus:req.body.status}},{ new: true });
//         }

//         return res.status(200).json({message:"Updated"});
//     } catch (error) {
//         return res.status(400).json({ message: error.message });
//     }
// };