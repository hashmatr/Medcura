import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../Context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import PaymentModal from "../Component/PaymentModal.jsx";
import VideoCallModal from "../Component/VideoCallModal.jsx";
import AppointmentModeModal from "../Component/AppointmentModeModal.jsx";
import ClinicReceiptModal from "../Component/ClinicReceiptModal.jsx";

const MyAppointments = () => {
  const { BackendURL, token, getDoctorsData } = useContext(AppContext);

  const [appointments, setAppointments] = useState([]);
  const [selectedAppointmentForPayment, setSelectedAppointmentForPayment] =
    useState(null);
  const [selectedAppointmentForCall, setSelectedAppointmentForCall] =
    useState(null);
  const [selectedAppointmentForClinic, setSelectedAppointmentForClinic] =
    useState(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isVideoCallModalOpen, setIsVideoCallModalOpen] = useState(false);
  const [isModeModalOpen, setIsModeModalOpen] = useState(false);
  const [isClinicReceiptOpen, setIsClinicReceiptOpen] = useState(false);

  const months = [
    " ",
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
  };

  // Fetch user appointments
  const getUserAppointment = async () => {
    try {
      const { data } = await axios.get(BackendURL + "/api/user/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) getUserAppointment();
  }, [token]);

  // Cancel appointment
  const CancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        BackendURL + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointment();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Handle online payment
  const handlePayOnline = (appointment) => {
    if (appointment.payment) {
      toast.info("Payment already completed for this appointment");
      return;
    }
    setSelectedAppointmentForPayment(appointment);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    getUserAppointment();
    setIsPaymentModalOpen(false);
    setIsModeModalOpen(true);
  };

  const handleModeSelect = async (mode) => {
    try {
      const { data } = await axios.post(
        BackendURL + "/api/user/set-appointment-mode",
        { appointmentId: selectedAppointmentForPayment._id, mode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("Mode set to " + mode);
        getUserAppointment();
      }
    } catch (error) {
      toast.error("Error saving mode");
    } finally {
      setIsModeModalOpen(false);
      setSelectedAppointmentForPayment(null);
    }
  };

  // Handle video call
  const handleVideoCall = (appointment) => {
    if (!appointment.payment) {
      toast.error("Please complete payment before starting video call");
      return;
    }
    setSelectedAppointmentForCall(appointment);
    setIsVideoCallModalOpen(true);
  };

  // Handle visit clinic
  const handleVisitClinic = (appointment) => {
    if (!appointment.payment) {
      toast.error("Payment required to visit clinic");
      return;
    }
    setSelectedAppointmentForClinic(appointment);
    setIsClinicReceiptOpen(true);
  };

  // Print receipt function
  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="p-4 md:p-6 mt-8 md:mt-12">
      <h1 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6">
        My Appointments
      </h1>

      <div className="space-y-4">
        {appointments.map((appointment, index) => (
          <div
            key={index}
            className="bg-blue-50 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm"
          >
            {/* Doctor Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-lg overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
                <img
                  src={appointment.docData.image}
                  alt={appointment.docData.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-semibold text-gray-800 mb-1 text-base md:text-lg">
                  {appointment.docData.name}
                </h3>
                <p className="text-gray-600 text-sm md:text-base mb-2">
                  {appointment.docData.speciality}
                </p>

                <div className="text-xs md:text-sm text-gray-600 mb-2">
                  <p className="font-medium">Address:</p>
                  <p>{appointment.docData.address.line1}</p>
                  <p>{appointment.docData.address.line2}</p>
                </div>

                <p className="text-xs md:text-sm text-gray-600 mb-1">
                  <span className="font-medium">Date & Time: </span>
                  {slotDateFormat(appointment.SlotDate)} | {appointment.SlotTime}
                </p>

                <p className="text-xs md:text-sm text-gray-600 mb-2">
                  <span className="font-medium">Amount: </span>${appointment.amount}
                </p>

                {appointment.payment && (
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    ✓ Payment Complete
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 md:gap-3 w-full md:w-auto">
              {/* Video Call Button */}
              {appointment.payment && !appointment.cancelled && !appointment.isCompleted &&(
                <>
                  {appointment.appointmentMode === "video" ? (
                    <button
                      onClick={() => handleVideoCall(appointment)}
                      className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
                    >
                      Start Video Call
                    </button>
                  ) : appointment.appointmentMode === "physical" ? (
                    <button
                      onClick={() => handleVisitClinic(appointment)}
                      className="px-4 py-2 rounded bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                    >
                      Visit Clinic
                    </button>
                  ) : null}
                </>
              )}

              {/* Pay Online Button */}
              {!appointment.payment && !appointment.cancelled && !appointment.isCompleted && (
                <button
                  onClick={() => handlePayOnline(appointment)}
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  Pay Online
                </button>
              )}

              {/* Cancel Appointment Button */}
              {!appointment.cancelled && !appointment.isCompleted &&(
                <button
                  onClick={() => CancelAppointment(appointment._id)}
                  className="px-4 py-2 rounded border border-red-500 text-red-500 hover:bg-red-600 hover:text-white transition-colors"
                >
                  Cancel Appointment
                </button>
              )}

              {appointment.cancelled && !appointment.isCompleted &&(
                <span className="text-red-500 font-medium">
                  Appointment Cancelled
                </span>
                
              )}
              {appointment.isCompleted && <button className="sm:min-w-48 py-2 border border-green-500 border-raduis ">Completed</button>}
            </div>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {selectedAppointmentForPayment && (
        <PaymentModal
          appointment={selectedAppointmentForPayment}
          token={token}
          BackendURL={BackendURL}
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Video Call Modal */}
      {selectedAppointmentForCall  && (
        <VideoCallModal
          appointment={selectedAppointmentForCall}
          isOpen={isVideoCallModalOpen}
          onClose={() => setIsVideoCallModalOpen(false)}
        />
      )}

      {/* Appointment Mode Modal */}
      <AppointmentModeModal
        isOpen={isModeModalOpen}
        onClose={() => setIsModeModalOpen(false)}
        onSelect={handleModeSelect}
      />

      {/* Clinic Receipt Modal */}
      {selectedAppointmentForClinic && (
        <ClinicReceiptModal
          appointment={selectedAppointmentForClinic}
          isOpen={isClinicReceiptOpen}
          onClose={() => setIsClinicReceiptOpen(false)}
          onPrint={printReceipt}
        />
      )}
    </div>
  );
};

export default MyAppointments;
