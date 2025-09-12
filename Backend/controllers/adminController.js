import validator from 'validator'
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/AppointmentModel.js'
import userModel from '../models/userModel.js'
const addDoctor = async (req,res) => {
    try {
        const {name,email,password,speciality,degree,experience,about,fees,address} = req.body
       const imageFile = req.file
       if(!name||!email||!password||!speciality||!degree||!experience||!about||!fees||!address){
            return res.json({
                success:"false",
                message:"Missing information"
            })
       }
       if(!validator.isEmail(email)){
             return res.json({
                success:"false",
                message:"Please enter a valid email"
            })
       }
       if(password.length < 8){
        return res.json({
                success:"false",
                message:"Please enter a valid password"
            })
       }
       const salt = await bcrypt.genSalt(10);
       const hashpassword = await bcrypt.hash(password.toString(),salt)
       const imageupload = await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
       const imageURL = imageupload.secure_url

        const doctorData = {
        name,
        email,
        password:hashpassword,
        image:imageURL,
        speciality,
        degree,
        experience,
        about,
        fees,
        address:JSON.parse(address),
        Date:Date.now(),
    }
    const newDoctor = new doctorModel(doctorData)
    await newDoctor.save()
    res.json({
        success:true,
        message:'doctor added'
    })
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:error.message
        })
    }
}
const loginAdmin = async (req,res) =>{
try {
        const {email,password} = req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token})
        }
        else {
            res.json({success:false},{message:"Invalid Credentials"})
        } 
} catch (error) {
    console.log(error);
        res.json({
            success:false,
            message:error.message
        })
}
}
//Api to get all doctors list for admin panel
const allDoctors = async (req,res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password')
        res.json({
            success:true,
            doctors
        })
    } catch (error) {
        console.log(error);
        res.json({
            success:false,message:error.message
        })
        
    }
}
const appointmentsAdmin = async (req,res) => {
try {
    const appointments = await appointmentModel.find({})
    res.json({
        success:true,
        appointments
    })

} catch (error) {
    console.log(error);
    res.json({
        success:false,
        message:error.message
    })
}}
const appointmentCancel = async (req, res) => {
  try {
     const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    const { docId, SlotDate, SlotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);

    if (doctorData?.slot_booked?.[SlotDate]) {
      doctorData.slot_booked[SlotDate] = doctorData.slot_booked[SlotDate].filter(
        (time) => time !== SlotTime
      );
      await doctorModel.findByIdAndUpdate(docId, { slot_booked: doctorData.slot_booked });
    }

    return res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
//api to get dashboard data
const adminDasboard = async(req,res) => {
    try {
        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})
        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse().slice(0,5)
        }
        res.json({success:true,
            dashData
        })
    } catch (error) {
          console.log(error);
    return res.json({ success: false, message: error.message });
    }
}
export {addDoctor,loginAdmin,allDoctors,appointmentsAdmin,appointmentCancel,adminDasboard}