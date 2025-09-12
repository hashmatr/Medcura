import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    docId: { type: String, required: true },
    SlotDate: { type: String, required: true },
    SlotTime: { type: String, required: true },
    userData: { type: Object, required: true },
    docData: { type: Object, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    cancelled: { type: Boolean, default: false },

    // Payment related fields
    payment: { type: Boolean, default: false },
    paymentMethod: {
      type: String,
      enum: ["stripe", "razorpay", "cash"],
      default: null,
    },
    paymentDate: { type: Date, default: null },
    paymentIntentId: { type: String, default: null },
    transactionId: { type: String, default: null },

    isCompleted: { type: Boolean, default: false },

    // FIXED: Appointment mode should be inside schema
    appointmentMode: {
      type: String,
      enum: ["video", "physical"],
      default: null,
    },
  },
  { timestamps: true }
);

const appointmentModel =
  mongoose.models.appointment || mongoose.model("appointment", appointmentSchema);

export default appointmentModel;
