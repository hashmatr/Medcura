import React, { useEffect, useContext } from "react";
import { AdminContext } from "../../Context/AdminContext";
import { AppContext } from "../../Context/AppContext";

const Appointment = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } =
    useContext(AdminContext);
  const { calage, currency, slotDateFormat } = useContext(AppContext);

  // Fetch appointments when token is available
  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken, getAllAppointments]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center">
      <div className="w-full max-w-6xl">
        <p className="text-2xl font-semibold mb-6">All Appointments</p>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-7 gap-4 bg-gray-50 p-4 text-gray-600 font-medium text-center">
            <p>#</p>
            <p>Patient</p>
            <p>Age</p>
            <p>Date & Time</p>
            <p>Doctor</p>
            <p>Fees</p>
            <p>Actions</p>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-200">
            {appointments && appointments.length > 0 ? (
              appointments.map((appointment, index) => (
                <div
                  key={appointment._id || index}
                  className="grid grid-cols-7 gap-4 items-center p-4 hover:bg-gray-50 text-center"
                >
                  <p>{index + 1}</p>

                  {/* Patient */}
                  <div className="flex items-center gap-2 justify-start">
                    <img
                      src={
                        appointment.userData.image ||
                        "https://via.placeholder.com/40"
                      }
                      alt={appointment.userData.name || "Patient"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <p>{appointment.userData.name || "N/A"}</p>
                  </div>

                  <p>{calage(appointment.userData.dob) || "N/A"}</p>

                  <p>
                    {appointment.SlotDate
                      ? `${slotDateFormat(appointment.SlotDate)} , ${
                          appointment.SlotTime
                        }`
                      : "N/A"}
                  </p>

                  {/* Doctor */}
                  <div className="flex items-center gap-2 justify-start">
                    <img
                      src={
                        appointment.docData.image ||
                        "https://via.placeholder.com/40"
                      }
                      alt={appointment.docData.name || "Doctor"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <p>{appointment.docData.name || "N/A"}</p>
                  </div>

                  <p>
                    {currency}
                    {appointment.docData.fees || 0}
                  </p>

                  {/* Actions */}
                  {appointment.cancelled ? (
                    <p className="text-red-500 text-xs font-medium">
                      Cancelled
                    </p>
                  ) : appointment.isCompleted ? (
                    <p className="text-green-500 text-xs font-medium">
                      Completed
                    </p>
                  ) : (
                    <button
                      onClick={() => cancelAppointment(appointment._id)}
                      className="text-red-500 hover:bg-red-100 rounded-full w-7 h-7 flex items-center justify-center mx-auto"
                    >
                      &#10005;
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="p-4 text-center col-span-7 text-gray-500">
                No appointments found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
