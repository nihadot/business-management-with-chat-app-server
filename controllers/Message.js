import mongoose from 'mongoose';
import { SingleMessage } from '../models/SingleMessage.js';
import { HealthRecord } from '../models/HealthRecords.js';
import { Attendance } from '../models/Attendance.js';
import Feedback from '../models/Feedback.js';
import Payment from '../models/Payment.js';
import Fees from '../models/Fees.js';

export const sentMessage = async (req, res) => {
    try {
        if(!req.params.id) return res.status(400).json({message:"Id not provided"})
        const newMessage = new SingleMessage({...req.body,receiver:req.params.id,sender:req.user._id});
        const savedMessage = await newMessage.save();
        res.status(201).json({result:savedMessage,message:'Successfully created'});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const sentMessageAll = async (req, res) => {
    try {
        if(!req.params.sender) return res.status(400).json({message:"Id not provided"})
        if(!req.params.reciever) return res.status(400).json({message:"Id not provided"})
        const newMessage = new SingleMessage({...req.body,receiver:req.params.reciever,sender:req.params.sender});
        const savedMessage = await newMessage.save();
        res.status(201).json({result:savedMessage,message:'Successfully created'});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const getMessagesAll = async (req, res) => {
    try {

        
        
        
        if(!req.params.sender) return res.status(400).json({message:"Id not provided"})
        if(!req.params.reciever) return res.status(400).json({message:"Id not provided"})
    const messages = await SingleMessage.find({
        $or: [
            { sender: new mongoose.Types.ObjectId(req.params.reciever) , receiver: new mongoose.Types.ObjectId(req.params.sender)},
            { sender: new mongoose.Types.ObjectId(req.params.sender), receiver: new mongoose.Types.ObjectId(req.params.reciever) }
        ]
    }).sort({ createdAt: 1 });
      
      return res.status(201).json({result:messages});
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const getMessages = async (req, res) => {
    try {
      
        if(!req.params.id) return res.status(400).json({message:"Id not provided"})
          // Fetch both sent and received messages
          const messages = await SingleMessage.find({
            $or: [
                { sender: req.user.id, receiver: req.params.id },
                { sender: req.params.id, receiver: req.user.id }
            ]
        }).sort({ createdAt: 1 }); // Sort by createdAt or any other field you use for sorting
        

        res.status(201).json({result:messages});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const getDoctorMessage = async (req, res) => {
    try {
        if(!req.params.recieverid) return res.status(400).json({message:"Id not provided"})
        if(!req.params.doctorsid) return res.status(400).json({message:"Id not provided"})
        const getMessages = await SingleMessage.find({sender:new mongoose.Types.ObjectId(req.params.doctorsid),receiver:new mongoose.Types.ObjectId(req.params.recieverid)});
        res.status(201).json({result:getMessages});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getHealthRecordsByChildId = async (req, res) => {
    try {
        if(!req.params.id) return res.status(400).json({message:"Id not provided"})
        console.log(req.params.id);
        // const getMessages = await HealthRecord.find({childId:new mongoose.Types.ObjectId(req.params.id)});
        const getMessages = await HealthRecord.aggregate([
            {
                $match:{
                    childId:new mongoose.Types.ObjectId(req.params.id)
                }
            },
            {
                $lookup:{
                    from:"doctors",
                    as:"doctorsInfo",
                    foreignField:"_id",
                    localField:'doctorId'
                }
            }
        ])
        console.log(getMessages)
        res.status(201).json({result:getMessages});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



// app.post('/api/message-doctor/:doctorsid/:recieverid',sentDoctorMessage);
export const sentDoctorMessage = async (req, res) => {
    try {
        if(!req.params.doctorsid) return res.status(400).json({message:"Id not provided"})
        if(!req.params.recieverid) return res.status(400).json({message:"Id not provided"})

        const newMessage = new SingleMessage({...req.body,receiver:req.params.recieverid,sender:req.params.doctorsid});
        const savedMessage = await newMessage.save();

        res.status(201).json({result:savedMessage,message:'Successfully created'});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// 
export const getAttendanceOf = async (req, res) => {
    try {
        if(!req.params.id) return res.json({message:"id not provided"})
        const getAttendance = await Attendance.find({childrenId:new mongoose.Types.ObjectId(req.params.id),type:req.body.type})
        return res.status(201).json({result:getAttendance});
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};


export const addFeedback = async (req, res) => {
    try {
        const newMessage = new Feedback(req.body);
        const savedMessage = await newMessage.save();

        res.status(201).json({result:savedMessage,message:'Successfully created'});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getFeedback = async (req, res) => {
    try {
        const getAllFeedbacks = await Feedback.find();

        res.status(201).json({result:getAllFeedbacks});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



export const getFees = async (req, res) => {
    try {
        const fee = await Fees.find()
        res.status(201).json({result:fee});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getFeesByIdOfChildren = async (req, res) => {
    try {
        const payments = await Payment.aggregate(
            [
                {
                    $lookup:"paa"
                }
            ]
        );

        res.status(201).json({result:payments});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const addFees = async (req, res) => {
    try {
        const newPayment = new Fees(req.body);
        const savedPayment = await newPayment.save();

        res.status(201).json({result:savedPayment});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const deleteFee = async (req, res) => {
    try {
        if(!req.params.id) res.status(400).json({message:'Id not provided'});
         await Fees.findByIdAndDelete(req.params.id)
        res.status(201).json({message:'deleted'});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const editFee = async (req, res) => {
    try {
         await Fees.findByIdAndUpdate(req.body._id,req.body)
        res.status(201).json({message:'edited'});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

