import mongoose from 'mongoose';
import {Children} from '../models/Children.js';
import jwt from "jsonwebtoken";
import { Attendance } from '../models/Attendance.js';
import Consultation from '../models/Consultation.js';
import { HealthRecord } from '../models/HealthRecords.js';
import Fees from '../models/Fees.js';

export const registerChildren = async (req, res) => {
    try {
        if(!req.params.id) return res.status(400).json({message:"Id not provided"})



        const newChildren = new Children({parent_Id:req.params.id,...req.body});
        const savedChildren = await newChildren.save();
        res.status(201).json({result:savedChildren,message:'Successfully created'});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const addDescription = async (req, res) => {
    try {
        const healthRecord = new HealthRecord(req.body);

        const newCOnsult = await Consultation.findByIdAndUpdate(req.body.consultantId,{$set:{status:"complited"}})

        const savedHealthRecord = await healthRecord.save();
        res.status(201).json({result:savedHealthRecord,message:'Successfully created'});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getChildrenByParentId = async (req, res) => {
    try {
        if(!req.params.id) return res.status(400).json({message:"Id not provided"})

        const childrens = await Children.find({parent_Id:new mongoose.Types.ObjectId(req.params.id)});

        return res.json({result:childrens});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getAllChildrensAll = async (req, res) => {
    try {


        const childrens = await Children.find();

        return res.json({result:childrens});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// export const loginChildren = async (req, res) => {
//     try {
//         const isExist = await Children.findOne({email:req.body.email})
//         if(!isExist) return res.status(400).json({message:'Mail is not found'});
//         const isExistPassword = await Children.findOne({password:req.body.password})
//         if(!isExistPassword) return res.status(400).json({message:'Password not match'});
//         if(!isExist.isStatus) return res.status(200).json({message:"Your request is pending..."})
//         const token = jwt.sign({ id: isExist._id,isChildren: isExist.isChildren}, 'privateKey123', { expiresIn:"30 days" });
//         res.cookie('token', token, { httpOnly: true });
//         return res.status(200).json({ result: isExist,token });
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// };


export const getAllChildrens = async (req, res) => {
    try {
        if(req.user.isAdmin){
            getAllChildrensByAdmin(req,res)
        }else{
            getAllChildrensByOthers(req,res) 
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




export const getChildrensSchedulesById = async (req, res) => {
    try { 
        const childrens = await Consultation.find({childId:new mongoose.Types.ObjectId(req.params.id)})
        return res.status(200).json({ result : childrens });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getallschedules = async (req, res) => {
    try { 
        const consultations = await Consultation.aggregate(
            [
                {
                    $lookup:{
                        from:"childrens",
                        localField:"childId",
                        foreignField:"_id",
                        as:"childrensInfo"
                    }
                }
            ]
        )
        // console.log('----')
        // const consultations = await Consultation.find()

        return res.status(200).json({ result : consultations });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllChildrensWithoutCredentials = async (req, res) => {
    try { 
        const childrens = await Children.find({isStatus:true})
        return res.status(200).json({ result : childrens });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getSchedules = async (req, res) => {
    try { 
            const consultations = await Consultation.find();
            return res.status(200).json({ result : consultations });


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getAllChildrensByAdmin = async (req, res) => {
    try { 
            const newChildren = await Children.aggregate([
                {
                    $lookup:{
                        from:"parents",
                        foreignField:"_id",
                        localField:"parent_Id",
                        as:"parentInfo"
                    }
                },
                // {
                //     $unwind:"$parentInfo"
                // }
            ]);
            return res.status(200).json({ result : newChildren });


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getAllChildrensByOthers = async (req, res) => {
    try { 
            const newChildren = await Children.aggregate([
                {
                    $match: { isStatus: true }
                },
                {
                    $lookup:{
                        from:"parents",
                        foreignField:"_id",
                        localField:"parent_Id",
                        as:"parentInfo"
                    }
                },
            ]);
            return res.status(200).json({ result : newChildren });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getChildrenById = async (req, res) => {
    try {
        if(!req.params.id) return res.status(400).json({message:"Id not provided"})
        // const getChildren = await Children.findById(req.params.id);
        const getChildren = await Children.aggregate([
            {
                $match:{ _id: new mongoose.Types.ObjectId(req.params.id)}
            },
            {
                $lookup:{
                    from:"parents",
                    localField:"parent_Id",
                    as:"parentInfo",
                    foreignField:"_id"
                }
            },
        ]);
        if (!getChildren) {
            return res.status(404).json({ message: 'Children not found' });
        }
        return res.json({result:getChildren[0]});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateChildrenById= async (req, res) => {
    try {
        if(!req.params.id) return res.status(400).json({message:"Id not provided"})
        const updateChildren = await Children.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updateChildren) {
            return res.status(404).json({ message: 'Children not found' });
        }
        return res.json(updateChildren);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const deleteChildrenById = async (req, res) => {
    try {
        if(!req.params.id) return res.status(400).json({message:"Id not provided"})
        const deleteChildren = await Children.findByIdAndDelete(req.params.id);
        if (!deleteChildren) {
            return res.status(404).json({ message: 'Children not found' });
        }
        res.json({ message: 'Children Deleted Successfully' });
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




export const getChildrensAttendanceById = async (req, res) => {
    try {
        if(!req.params.id) return res.status(400).json({message:"Id not provided"})
        // const getChildren = await Children.findById(req.params.id);
        const getChildrenAttendance = await Attendance.find({childrenId:new mongoose.Types.ObjectId(req.params.id)})
        if (!getChildrenAttendance) {
            return res.status(404).json({ message: 'Children attendance not found' });
        }
        return res.json({result:getChildrenAttendance});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


        // progress
        
        export const getChildrenByAttendanceBased = async (req, res) => {
            try {
                let AllChildrensArray = []
                const getAllChildrens = await Children.find({isStatus:true})


                for(let obj of getAllChildrens){
                    if(obj){
                        const getChildrensAttendance = await Attendance.find({childrenId:new mongoose.Types.ObjectId(obj._id)})
                        if(getChildrensAttendance.length > 0){

                            AllChildrensArray.push({
                                student:obj,
                                attendance:getChildrensAttendance,
                            })
                        }else{
                            AllChildrensArray.push({
                                student:obj,
                                attendance:null,
                            })
                        }

                    }

                }
                return res.status(200).json({result:AllChildrensArray});
            } catch (error) {
                return res.status(500).json({ message: error.message });
            }
        };