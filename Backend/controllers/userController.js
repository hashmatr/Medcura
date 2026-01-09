import validator from "validator";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/AppointmentModel.js";
import Stripe from 'stripe';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Configure nodemailer
// Configure nodemailer - FIXED
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS  // your email password or app password
  }
});

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();

const registerUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!name || !password || !email) {
      return res.json({
        success: false,
        message: "Details missing",
      });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Enter a Strong Password",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userData = {
      name,
      email,
      password: hashedPassword,
    };
    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ Id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error in registering user",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ Id: user._id }, process.env.JWT_SECRET);
      return res.json({
        success: true,
        token,
      });
    } else {
      res.json({
        success: false,
        message: "Incorrect Password",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error in logging in user",
    });
  }
};

// Forget Password - Send OTP
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({
        success: false,
        message: "Email is required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Enter a valid email",
      });
    }

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User with this email does not exist",
      });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Store OTP with expiration (5 minutes)
    otpStore.set(email, {
      otp: otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes from now
      attempts: 0
    });

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #5F6FFF;">Password Reset Request</h2>
          <p>You have requested to reset your password. Please use the following OTP to proceed:</p>
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #5F6FFF; font-size: 36px; margin: 0; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p><strong>This OTP will expire in 5 minutes.</strong></p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">This is an automated email, please do not reply.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "OTP sent to your email address",
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error sending OTP",
    });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const storedData = otpStore.get(email);

    if (!storedData) {
      return res.json({
        success: false,
        message: "OTP not found or expired",
      });
    }

    // Check if OTP is expired
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(email);
      return res.json({
        success: false,
        message: "OTP has expired",
      });
    }

    // Check attempt limit
    if (storedData.attempts >= 3) {
      otpStore.delete(email);
      return res.json({
        success: false,
        message: "Too many failed attempts. Please request a new OTP",
      });
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      storedData.attempts += 1;
      return res.json({
        success: false,
        message: `Invalid OTP. ${3 - storedData.attempts} attempts remaining`,
      });
    }

    // Generate reset token
    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "15m", // 15 minutes to reset password
    });

    // Clean up OTP
    otpStore.delete(email);

    res.json({
      success: true,
      message: "OTP verified successfully",
      resetToken,
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error verifying OTP",
    });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.json({
        success: false,
        message: "Reset token and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Verify reset token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (error) {
      return res.json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    const { email } = decoded;

    // Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await userModel.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });

    res.json({
      success: true,
      message: "Password reset successfully",
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error resetting password",
    });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User with this email does not exist",
      });
    }

    // Generate new OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Store new OTP
    otpStore.set(email, {
      otp: otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0
    });

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP - Resent',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #5F6FFF;">Password Reset OTP - Resent</h2>
          <p>Here is your new OTP for password reset:</p>
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #5F6FFF; font-size: 36px; margin: 0; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p><strong>This OTP will expire in 5 minutes.</strong></p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "New OTP sent to your email address",
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error resending OTP",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;   // ✅ just assign directly
    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error in fetching user profile",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // get userId from auth middleware
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({
        success: false,
        message: "Details missing",
      });
    }

    let updatedFields = {
      name,
      phone,
      dob,
      gender,
    };

    // Parse address only if provided and valid JSON string
    if (address) {
      try {
        updatedFields.address = JSON.parse(address);
      } catch {
        return res.json({
          success: false,
          message: "Invalid address format",
        });
      }
    }

    // Upload image if present (using buffer for serverless/Vercel compatibility)
    if (imageFile) {
      const imageUploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(imageFile.buffer);
      });
      const imageUpload = await imageUploadPromise;
      updatedFields.image = imageUpload.secure_url;
    }

    // Update user
    await userModel.findByIdAndUpdate(userId, updatedFields);

    res.json({
      success: true,
      message: "Profile Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error in updating user profile",
    });
  }
};

const BookAppointment = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ comes from JWT
    const { docId, SlotDate, SlotTime } = req.body;

    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData.available) {
      return res.json({ success: false, message: "Doctor not Available" });
    }

    let slotBooked = docData.slot_booked || {};
    if (slotBooked[SlotDate]?.includes(SlotTime)) {
      return res.json({ success: false, message: "Slot Not Available" });
    }

    slotBooked[SlotDate] = slotBooked[SlotDate] || [];
    slotBooked[SlotDate].push(SlotTime);

    const userData = await userModel.findById(userId).select("-password");

    const newAppointment = new appointmentModel({
      userId,
      docId,
      SlotDate,
      SlotTime,
      userData,
      docData,
      amount: docData.fees,
      date: new Date(),
    });

    await newAppointment.save();
    await doctorModel.findByIdAndUpdate(docId, { slot_booked: slotBooked });

    res.json({ success: true, message: "Appointment Booked Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error booking appointment" });
  }
};

const ListAppointment = async (req, res) => {
  try {
    const userId = req.user.id
    const appointments = await appointmentModel.find({ userId })
    res.json({
      success: true,
      appointments
    })
  }
  catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message
    })

  }
}

const cancelAppointment = async (req, res) => {
  try {
    const userId = req.user.id;  // ✅ from middleware, not frontend
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    if (appointmentData.userId.toString() !== userId.toString()) {
      return res.json({ success: false, message: "Unauthorized Action" });
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

// Create Stripe Payment Intent
const createPaymentIntent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { appointmentId } = req.body;

    // Get appointment details
    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    // Verify appointment belongs to user
    if (appointment.userId.toString() !== userId.toString()) {
      return res.json({ success: false, message: "Unauthorized Action" });
    }

    // Check if payment already processed
    if (appointment.payment) {
      return res.json({ success: false, message: "Payment already processed" });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(appointment.amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        appointmentId: appointmentId,
        userId: userId,
        doctorId: appointment.docId.toString()
      },
      description: `Payment for appointment with Dr. ${appointment.docData.name}`
    });

    // Update appointment with payment intent ID
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      paymentIntentId: paymentIntent.id
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      amount: appointment.amount
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error creating payment intent"
    });
  }
};

// Confirm Payment
const confirmPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { paymentIntentId, appointmentId } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update appointment as paid
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        payment: true,
        paymentMethod: 'stripe',
        paymentDate: new Date(),
        transactionId: paymentIntent.id
      });

      res.json({
        success: true,
        message: "Payment confirmed successfully"
      });
    } else {
      res.json({
        success: false,
        message: "Payment not completed"
      });
    }

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error confirming payment"
    });
  }
};

// Stripe Webhook to handle payment events
const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      const appointmentId = paymentIntent.metadata.appointmentId;

      // Update appointment status
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        payment: true,
        paymentMethod: 'stripe',
        paymentDate: new Date(),
        transactionId: paymentIntent.id
      });

      console.log('Payment succeeded for appointment:', appointmentId);
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

// Get Payment Status
const getPaymentStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { appointmentId } = req.params;

    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    if (appointment.userId.toString() !== userId.toString()) {
      return res.json({ success: false, message: "Unauthorized Action" });
    }

    res.json({
      success: true,
      paymentStatus: appointment.payment || false,
      paymentMethod: appointment.paymentMethod || null,
      transactionId: appointment.transactionId || null,
      paymentDate: appointment.paymentDate || null
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error getting payment status"
    });
  }
};

// In controllers/userController.js
const setAppointmentMode = async (req, res) => {
  try {
    const { appointmentId, mode } = req.body
    const appointment = await appointmentModel.findById(appointmentId)
    if (!appointment) return res.json({ success: false, message: "Appointment not found" })
    appointment.appointmentMode = mode
    await appointment.save()
    res.json({ success: true, message: "Appointment mode updated", appointment })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  BookAppointment,
  ListAppointment,
  cancelAppointment,
  createPaymentIntent,
  confirmPayment,
  stripeWebhook,
  getPaymentStatus,
  setAppointmentMode,
  forgotPassword,
  verifyOTP,
  resetPassword,
  resendOTP
};