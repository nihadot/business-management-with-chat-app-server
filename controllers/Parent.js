import {Parent} from '../models/Parent.js';
import jwt from "jsonwebtoken";

export const registerParent = async (req, res) => {
    try {
        const isExist = await Parent.findOne({email:req.body.email});
        if(isExist) return res.status(400).json({message:"Mail is Existing!!"})
        const parent = new Parent(req.body);
        const savedParent = await parent.save();
        res.status(201).json({result:savedParent,message:'Successfully created'});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const loginParent = async (req, res) => {
    try {
        const isExist = await Parent.findOne({email:req.body.email})
        if(!isExist) return res.status(400).json({message:'Mail is not found'});
        const isExistPassword = await Parent.findOne({password:req.body.password})
        if(!isExistPassword) return res.status(400).json({message:'Password not match'});
        if(!isExist.isStatus) return res.status(200).json({message:"Your request is pending...",status:false})
        const token = jwt.sign({ id: isExist._id,isParent: isExist.isParent}, 'privateKey123', { expiresIn:"30 days" });
        res.cookie('token', token, { httpOnly: true });
        return res.status(200).json({ result: isExist,token ,status:true});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const getAllParentsAll = async (req, res) => {
    try {
            const parent = await Parent.find({isStatus:true});
            return res.json({result:parent})

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllParents = async (req, res) => {
    try {
        if(req.user.isAdmin){
            const parent = await Parent.find();
            return res.json({result:parent});
        }else{
            const parent = await Parent.find({isStatus:true});
            return res.json({result:parent});
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getParentById = async (req, res) => {
    try {
        if(!req.params.id) return res.status(400).json({message:"Id not provided"})
        const parent = await Parent.findById(req.params.id);
        if (!parent) {
            return res.status(404).json({ message: 'Parent not found' });
        }
        return res.json({result:parent});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateParentById= async (req, res) => {
    try {
        if(!req.params.id) return res.status(400).json({message:"Id not provided"})
        const updateParent = await Parent.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updateParent) {
            return res.status(404).json({ message: 'Parent not found' });
        }
        return res.json(updateParent);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const deleteParentById = async (req, res) => {
    try {
        if(!req.params.id) return res.status(400).json({message:"Id not provided"})
        const deleteParent = await Parent.findByIdAndDelete(req.params.id);
        if (!deleteParent) {
            return res.status(404).json({ message: 'Parent not found' });
        }
        res.json({ message: 'Parent Deleted Successfully' });
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