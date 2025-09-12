import express from 'express'
import {addDoctor,allDoctors,appointmentsAdmin,loginAdmin,adminDasboard} from '../controllers/adminController.js'
import upload from '../middleware/multer.js'
import AuthAdmin from '../middleware/AuthAdmin.js';
import changeAvailibility from '../controllers/doctorController.js'
import {appointmentCancel} from './../controllers/adminController.js'
const adminRouter = express.Router()

adminRouter.post('/add-doctor',AuthAdmin,upload.single('image'),addDoctor);
adminRouter.post('/login',loginAdmin);
adminRouter.post('/all-doctors',AuthAdmin,allDoctors)
adminRouter.post('/change-availability',AuthAdmin,changeAvailibility)
adminRouter.get('/appointments',AuthAdmin,appointmentsAdmin)
adminRouter.post('/cancel-appointment',AuthAdmin,appointmentCancel)    
adminRouter.get('/dashboard',AuthAdmin,adminDasboard)

export default adminRouter 
        