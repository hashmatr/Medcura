import express from 'express'
import { 
  registerUser,
  loginUser, 
  getProfile, 
  updateProfile,
  BookAppointment,
  ListAppointment, 
  cancelAppointment,
  setAppointmentMode,
  forgotPassword,
  verifyOTP,
  resetPassword,
  resendOTP
} from '../controllers/userController.js'
import AuthUser from '../middleware/AuthUser.js'
import upload from '../middleware/multer.js'

const userRouter = express.Router()

// Authentication routes
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

// Forget password routes
userRouter.post('/forgot-password', forgotPassword)
userRouter.post('/verify-otp', verifyOTP)
userRouter.post('/reset-password', resetPassword)
userRouter.post('/resend-otp', resendOTP)

// Protected routes
userRouter.get('/get-profile', AuthUser, getProfile)
userRouter.post('/update-profile', upload.single('image'), AuthUser, updateProfile)
userRouter.post('/book-appointment', AuthUser, BookAppointment)
userRouter.get('/appointments', AuthUser, ListAppointment)
userRouter.post('/cancel-appointment', AuthUser, cancelAppointment)
userRouter.post('/set-appointment-mode', AuthUser, setAppointmentMode)

export default userRouter