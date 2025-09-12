import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../Context/DoctorContext";
import { AppContext } from "../../Context/AppContext";
import { assets } from "../../assets/assets_admin/assets";

const DoctorAppointment = () => {
  const {
    dToken,
    appointments,
    getAppointment,
    cancelappointment,
    completeappointment,
  } = useContext(DoctorContext);

  const { calage, slotDateFormat, currency } = useContext(AppContext);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (dToken) {
      getAppointment();
    }
  }, [dToken]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const canJoinVideoCall = (appointment) => {
    if (appointment.appointmentMode !== "video") return false;
    if (appointment.cancelled || appointment.isCompleted) return false;
    if (!appointment.payment) return false;

    const [day, month, year] = appointment.SlotDate.split("_").map(Number);
    const [hour, minute] = appointment.SlotTime.split(":").map(Number);

    const appointmentDateTime = new Date(year, month - 1, day, hour, minute);
    const appointmentEndTime = new Date(
      appointmentDateTime.getTime() + 30 * 60000
    );

    const now = currentTime;
    return now >= appointmentDateTime && now <= appointmentEndTime;
  };

  const getVideoCallStatus = (appointment) => {
    if (appointment.appointmentMode !== "video") return "";
    if (appointment.cancelled || appointment.isCompleted) return "";

    if (!appointment.payment) {
      return "Payment required to join call";
    }

    const [day, month, year] = appointment.SlotDate.split("_").map(Number);
    const [hour, minute] = appointment.SlotTime.split(":").map(Number);

    const appointmentDateTime = new Date(year, month - 1, day, hour, minute);
    const appointmentEndTime = new Date(
      appointmentDateTime.getTime() + 30 * 60000
    );

    const now = currentTime;

    if (now < appointmentDateTime) {
      return "Call can only be joined at exact appointment time";
    } else if (now > appointmentEndTime) {
      return "Call time has expired (30 minutes passed)";
    } else {
      return "Ready to join";
    }
  };

  const handleJoinVideoCall = (appointment) => {
    if (!canJoinVideoCall(appointment)) return;

    const roomName = `appointment-${appointment._id}-${
      appointment.docData?.name?.replace(/\s+/g, "-")?.toLowerCase() || "doctor"
    }`;

    const jitsiUrl = `https://meet.jit.si/${roomName}`;

    window.open(
      jitsiUrl,
      "_blank",
      "width=1200,height=700,menubar=no,toolbar=no,location=no,status=no"
    );
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
        All Appointments
      </h2>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full text-xs sm:text-sm text-left text-gray-600">
          <thead className="bg-blue-600 text-white uppercase text-xs sm:text-sm">
            <tr>
              <th className="px-2 sm:px-6 py-3">#</th>
              <th className="px-2 sm:px-6 py-3">Patient</th>
              <th className="px-2 sm:px-6 py-3">Payment</th>
              <th className="px-2 sm:px-6 py-3">Age</th>
              <th className="px-2 sm:px-6 py-3">Fees</th>
              <th className="px-2 sm:px-6 py-3">Date & Time</th>
              <th className="px-2 sm:px-6 py-3">Mode</th>
              <th className="px-2 sm:px-6 py-3">Status</th>
              <th className="px-2 sm:px-6 py-3">Action</th>
              <th className="px-2 sm:px-6 py-3">Video Call</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments && appointments.length > 0 ? (
              appointments.map((appt, index) => (
                <tr key={appt._id} className="hover:bg-gray-50">
                  <td className="px-2 sm:px-6 py-3 font-medium">{index + 1}</td>
                  <td className="px-2 sm:px-6 py-3">
                    {appt.userData?.name || "N/A"}
                  </td>
                  <td className="px-2 sm:px-6 py-3">
                    {appt.payment ? (
                      <span className="text-green-600 font-semibold">Paid</span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-2 sm:px-6 py-3">
                    {calage(appt.userData?.dob) || "-"}
                  </td>
                  <td className="px-2 sm:px-6 py-3">
                    {currency}
                    {appt.docData?.fees || "-"}
                  </td>
                  <td className="px-2 sm:px-6 py-3 whitespace-nowrap">
                    {slotDateFormat(appt.SlotDate)} - {appt.SlotTime}
                  </td>
                  <td className="px-2 sm:px-6 py-3 capitalize">
                    {appt.appointmentMode || "N/A"}
                  </td>
                  <td className="px-2 sm:px-6 py-3">
                    {appt.cancelled ? (
                      <span className="text-red-600 font-semibold">
                        Cancelled
                      </span>
                    ) : appt.isCompleted ? (
                      <span className="text-green-600 font-semibold">
                        Completed
                      </span>
                    ) : (
                      <span className="text-yellow-600 font-semibold">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-2 sm:px-6 py-3">
                    {!appt.cancelled && !appt.isCompleted && (
                      <div className="flex gap-2 sm:gap-3">
                        <img
                          onClick={() => cancelappointment(appt._id)}
                          src={assets.cancel_icon}
                          alt="Cancel"
                          className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer hover:scale-110 transition"
                        />
                        <img
                          onClick={() => completeappointment(appt._id)}
                          src={assets.tick_icon}
                          alt="Complete"
                          className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer hover:scale-110 transition"
                        />
                      </div>
                    )}
                  </td>
                  <td className="px-2 sm:px-6 py-3">
                    {appt.appointmentMode === "video" && (
                      <div className="flex flex-col items-center gap-1 sm:gap-2">
                        {canJoinVideoCall(appt) ? (
                          <button
                            onClick={() => handleJoinVideoCall(appt)}
                            className="bg-green-600 hover:bg-green-700 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition duration-200 flex items-center gap-1 sm:gap-2"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                            Join Call
                          </button>
                        ) : (
                          <button
                            disabled
                            className="bg-gray-400 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium cursor-not-allowed flex items-center gap-1 sm:gap-2"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                            Join Call
                          </button>
                        )}
                        <span className="text-[10px] sm:text-xs text-gray-500 text-center">
                          {getVideoCallStatus(appt)}
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="10"
                  className="px-6 py-4 text-center text-gray-500 italic"
                >
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorAppointment;
