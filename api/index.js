// Import necessary modules
import express from 'express';
import mongoose from 'mongoose';

// Create an Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/schoolDB', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;


// Import controllers for each module
import {
    createTeacher,
    getAllTeachers,
    getTeacherById,
    updateTeacher,
    deleteTeacher
} from './controllers/teacherController.js';

import {
    createDoctor,
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor
} from './controllers/doctorController.js';

import {createAdmin,getAllAdmins,getAdminById,updateAdmin,deleteAdmin } from './controllers/adminController.js';

import {
    createParent,
    getAllParents,
    getParentById,
    updateParent,
    deleteParent
} from './controllers/parentController.js';


// Middleware for parsing JSON requests
app.use(express.json());


// Teachers Module Routes
router.post('/api/teachers', createTeacher);
router.get('/api/teachers', getAllTeachers);
router.get('/api/teachers/:id', getTeacherById);
router.put('/api/teachers/:id', updateTeacher);
router.delete('/api/teachers/:id', deleteTeacher);

// Doctors Module Routes
router.post('/api/doctors', createDoctor);
router.get('/api/doctors', getAllDoctors);
router.get('/api/doctors/:id', getDoctorById);
router.put('/api/doctors/:id', updateDoctor);
router.delete('/api/doctors/:id', deleteDoctor);


// Parents Module Routes
router.post('/api/parents', createParent);
router.get('/api/parents', getAllParents);
router.get('/api/parents/:id', getParentById);
router.put('/api/parents/:id', updateParent);
router.delete('/api/parents/:id', deleteParent);


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
