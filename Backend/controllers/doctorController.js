import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/AppointmentModel.js";

// ✅ Doctor Login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Doctor List (for general fetch)
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    res.json({ success: true, doctors });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Toggle Doctor Availability
// ✅ Admin: Change a doctor's availability
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body; // doctorId comes from frontend

    if (!docId) {
      return res.status(400).json({ success: false, message: "Doctor ID required" });
    }

    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    doctor.available = !doctor.available; // toggle
    await doctor.save();

    res.json({
      success: true,
      message: `Availability changed to ${doctor.available ? "Available" : "Unavailable"}`,
      doctor,
    });
  } catch (error) {
    console.error("changeAvailability Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//  Get Doctor's Appointments
const appointmentsDoctor = async (req, res) => {
  try {
    const docId = req.docId; // from authDoctor middleware

    if (!docId) {
      return res.json({ success: false, message: "Doctor ID required" });
    }

    const appointments = await appointmentModel.find({ docId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Cancel Appointment
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.json({ success: false, message: "Appointment ID required" });
    }

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    appointmentData.cancelled = true;
    await appointmentData.save();

    // Free the slot from doctor’s booked slots
    const { docId, SlotDate, SlotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);

    if (doctorData?.slot_booked?.[SlotDate]) {
      doctorData.slot_booked[SlotDate] = doctorData.slot_booked[SlotDate].filter(
        (time) => time !== SlotTime
      );
      await doctorData.save();
    }

    return res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.error("appointmentCancel Error:", error);
    return res.json({ success: false, message: error.message });
  }
};

// Complete Appointment
const appointmentComplete = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.json({ success: false, message: "Appointment ID required" });
    }

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    appointmentData.isCompleted = true;
    await appointmentData.save();

    return res.json({ success: true, message: "Appointment Completed" });
  } 
  catch (error) {
    console.error("appointmentComplete Error:", error);
    return res.json({ success: false, message: error.message });
  }

};
const doctorDashboard = async (req, res) => {
  try {
    const docId = req.docId; // Use from middleware

    const appointments = await appointmentModel.find({ docId });

    let earning = 0;
    appointments.forEach((item) => {
      if (item.isCompleted || item.payment) {
        earning += item.amount;
      }
    });
    const patients = new Set();
    appointments.forEach((item) => {
      patients.add(item.userId.toString());
    });

    const dashData = {
      earning,
      appointments: appointments.length,
      patients: patients.size,
      latestAppointments: [...appointments].reverse().slice(0, 5),
    };

    res.json({
      success: true,
      dashData,
    });
  } catch (error) {
    console.error("doctorDashboard Error:", error);
    return res.json({ success: false, message: error.message });
  }
};
const doctorProfile = async (req, res) => {
  try {
    const docId = req.docId; // ✅ take from middleware, NOT from req.body

    if (!docId) {
      return res.status(400).json({ success: false, message: "Doctor ID required" });
    }

    const profileData = await doctorModel.findById(docId).select("-password");

    if (!profileData) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    res.json({
      success: true,
      profileData,
    });
  } catch (error) {
    console.error("doctorProfile Error:", error);
    return res.json({ success: false, message: error.message });
  }
};

const UpdateDoctorProfile = async (req, res) => {
  try {
    const docId = req.docId; // secure: comes from token (authDoctor middleware)
    const { fees, address, available, about } = req.body;

    if (!docId) {
      return res.status(400).json({ success: false, message: "Doctor ID missing" });
    }

    const updatedDoctor = await doctorModel.findByIdAndUpdate(
      docId,
      { fees, address, available, about },
      { new: true } // return updated document
    );

    if (!updatedDoctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      doctor: updatedDoctor
    });
  } catch (error) {
    console.error("doctorUpdateProfile Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


export {
  loginDoctor,
  doctorList,
  appointmentsDoctor,
  appointmentCancel,
  appointmentComplete,
  doctorDashboard,
  doctorProfile,
  UpdateDoctorProfile
};
export default changeAvailability;