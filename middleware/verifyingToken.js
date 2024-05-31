import jwt from "jsonwebtoken";
import { Teacher } from "../models/Teacher.js";
import { Doctor } from "../models/Doctor.js";
import { Parent } from "../models/Parent.js";
import { Admin } from "../models/Admin.js";

export const verifyingAdminToken = (req,res,next)=>{

    const header = req.headers.authorization;

    // console.log(`token of the admin middleware \n`,header)
    const token = header.split(" ")[1]
    if (token == null) {
        return res.status(401).send('Unauthorized');
    }

    jwt.verify(token, 'privateKey123', (err, user) => {
        if (err) {
            return res.status(403).send('Invalid token');
        }

       
        if(user.isAdmin){
            next();
        }else{
            res.status(401).json({message:"Not authorized"})
        }

    });
}


export const verifyingAdminAndTeacherToken = (req,res,next)=>{

    const header = req.headers.authorization;

    // console.log(`token of the admin or teacher middleware \n`,header)
    if (header == null) {
        return res.status(401).send('Unauthorized');
    }

    const token = header.split(" ")[1]
    jwt.verify(token,'privateKey123', async(err, user) => {
        if (err) {
            return res.status(403).send( err?.message || 'Invalid token');
        }

        // console.log(user);
        
        if(user.isTeacher){
            const isExist = await Teacher.findById(user.id)
            if(!isExist.isStatus) return res.status(400).json({message:"Your request is pending..."})
            req.user = isExist
            next();
        }else if(user.isAdmin){
            const isExist = await Admin.findById(user.id)
            if(!isExist) return res.status(400).json({message:"Account not found!..."})
            req.user = isExist
            next();
        }
        else{
            res.status(401).json({message:"Not authorized"})
        }
    });
}

export const verifyingAdminAndDoctorToken = (req,res,next)=>{

    const header = req.headers.authorization;

    // console.log(`token of the admin or doctor middleware \n`,header)
    if (header == null) {
        return res.status(401).send('Unauthorized');
    }

    const token = header.split(" ")[1]
    jwt.verify(token,'privateKey123', async(err, user) => {
        if (err) {
            return res.status(403).send( err?.message || 'Invalid token');
        }
        
        if(user.isDoctor){
            const isExist = await Doctor.findById(user.id)
            if(!isExist.isStatus) return res.status(400).json({message:"Your request is pending..."})
            req.user = isExist
            next();
        }else if(user.isAdmin){
            next();
        }
        else{
            res.status(401).json({message:"Not authorized"})
        }
    });
}

export const verifyingAdminAndParentToken = (req,res,next)=>{

    const header = req.headers.authorization;

    // console.log(`token of the admin or doctor middleware \n`,header)
    if (header == null) {
        return res.status(401).send('Unauthorized');
    }

    const token = header.split(" ")[1]
    jwt.verify(token,'privateKey123', async(err, user) => {
        if (err) {
            return res.status(403).send( err?.message || 'Invalid token');
        }
        
        if(user.isParent){
            const isExist = await Parent.findById(user.id)
            if(!isExist.isStatus) return res.status(400).json({message:"Your request is pending..."})
            req.user = isExist
            next();
        }else if(user.isAdmin){
            next();
        }
        else{
            res.status(401).json({message:"Not authorized"})
        }
    });
}


export const verifyingAllUsersToken = (req,res,next)=>{

    const header = req.headers.authorization;

    // console.log(`token of the admin or doctor middleware \n`,header)
    if (header == null) {
        return res.status(401).send('Unauthorized');
    }

    const token = header.split(" ")[1]
    jwt.verify(token,'privateKey123', async(err, user) => {

        // console.log(user,'user');
        if (err) {
            return res.status(403).send( err?.message || 'Invalid token');
        }

        if(user.isParent){
            const isExist = await Parent.findById(user.id)
            if(!isExist.isStatus) return res.status(400).json({message:"Your request is pending..."})
            req.user = isExist
            next();
        }else if(user.isAdmin){
            const isExist = await Admin.findById(user.id)
            if(!isExist) return res.status(400).json({message:"Account not found!..."})
            req.user = isExist
            next();
        }else if(user.isDoctor){
            const isExist = await Doctor.findById(user.id)
            if(!isExist.isStatus) return res.status(400).json({message:"Your request is pending..."})
            req.user = isExist
            next();
        }
        else if(user.isTeacher){
            const isExist = await Teacher.findById(user.id)
            // console.log(isExist)
            if(!isExist.isStatus) return res.status(400).json({message:"Your request is pending..."})
            req.user = isExist
            next();
        }
        else{
            res.status(401).json({message:"Not authorized"})
        }
    });
}
// export const verifyingAdminAndTeacherAndDoctorAndParentToken = (req,res,next)=>{

//     const header = req.headers.authorization;

//     console.log(`token of the admin or teacher middleware \n`,header)
//     if (header == null) {
//         return res.status(401).send('Unauthorized');
//     }

//     const token = header.split(" ")[1]
//     jwt.verify(token,'privateKey123', async(err, user) => {
//         if (err) {
//             return res.status(403).send( err?.message || 'Invalid token');
//         }
        
//         if(user.isTeacher){
//             const isExist = await Teacher.findById(user.id)
//             if(!isExist.isStatus) return res.status(400).json({message:"Your request is pending..."})
//             req.user = isExist
//             next();
//         }else if(user.isAdmin){
//             next();
//         }
//         else{
//             res.status(401).json({message:"Not authorized"})
//         }
//     });
// }
