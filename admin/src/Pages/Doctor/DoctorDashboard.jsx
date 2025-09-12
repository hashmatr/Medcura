import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../Context/DoctorContext";
import { assets } from "../../assets/assets_admin/assets";
import { AppContext } from "../../Context/AppContext";

const DoctorDashboard = () => {
  const { dToken, dashData, getdashData, completeAppointment } =
    useContext(DoctorContext);
  const { slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getdashData();
    }
  }, [dToken, getdashData]);

  return (
    dashData && (
      <div className="m-5">
        <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Earnings */}
          <div className="bg-white shadow-md rounded-lg p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
            <img
              src={assets.earning_icon}
              alt="Earnings Icon"
              className="w-12 h-12"
            />
            <div>
              <p className="text-xl font-semibold">
                {currency} {dashData.earning}
              </p>
              <p className="text-gray-500">Earnings</p>
            </div>
          </div>

          {/* Appointments */}
          <div className="bg-white shadow-md rounded-lg p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
            <img
              src={assets.appointments_icon}
              alt="Appointments Icon"
              className="w-12 h-12"
            />
            <div>
              <p className="text-xl font-semibold">{dashData.appointments}</p>
              <p className="text-gray-500">Appointments</p>
            </div>
          </div>

          {/* Patients */}
          <div className="bg-white shadow-md rounded-lg p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
            <img
              src={assets.patients_icon}
              alt="Patients Icon"
              className="w-12 h-12"
            />
            <div>
              <p className="text-xl font-semibold">{dashData.patients}</p>
              <p className="text-gray-500">Patients</p>
            </div>
          </div>
        </div>

        {/* Latest Bookings */}
        <div className="bg-white mt-10 rounded-lg shadow-md overflow-hidden">
          <div className="flex items-center gap-2.5 px-4 py-4 border-b">
            <img src={assets.list_icon} alt="list" className="w-6 h-6" />
            <p className="font-semibold">Latest Bookings</p>
          </div>

          <div className="divide-y">
            {dashData.latestAppointments &&
            dashData.latestAppointments.length > 0 ? (
              dashData.latestAppointments.map((item, index) => (
                <div
                  key={item._id || index}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                >
                  {/* Patient info */}
                  <div className="flex items-center gap-3">
                    <img
                      src={item.userData.image || "https://via.placeholder.com/40"}
                      alt={item.userData.name || "Patient"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{item.userData.name || "N/A"}</p>
                      <p className="text-sm text-gray-500">
                        {slotDateFormat(item.SlotDate) || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Status or Action */}
                  {item.isCompleted ? (
                    <p className="text-green-600 text-sm font-medium">
                      Completed
                    </p>
                  ) : item.cancelled ? (
                    <p className="text-red-500 text-sm font-medium">
                      Cancelled
                    </p>
                  ) : (
                    <button
                      onClick={() => completeAppointment(item._id)}
                      className="text-green-600 hover:bg-green-100 rounded-full w-7 h-7 flex items-center justify-center"
                    >
                      ✓
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="p-4 text-center text-gray-500">
                No recent bookings.
              </p>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorDashboard;
