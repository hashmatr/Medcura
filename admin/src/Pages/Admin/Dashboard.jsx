import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../Context/AdminContext";
import { assets } from "../../assets/assets_admin/assets";
import { AppContext } from "../../Context/AppContext";

const Dashboard = () => {
  const { aToken, getdashData, cancelAppointment, dashData } =
    useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getdashData();
    }
  }, [aToken, getdashData]);

  return (
    dashData && (
      <div className="m-5">
        <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Doctors */}
          <div className="bg-white shadow-md rounded-lg p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
            <img
              src={assets.doctor_icon}
              alt="Doctor Icon"
              className="w-12 h-12"
            />
            <div>
              <p className="text-xl font-semibold">{dashData.doctors}</p>
              <p className="text-gray-500">Doctors</p>
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
            <img src={assets.list_icon} alt="list" />
            <p className="font-semibold">Latest Bookings</p>
          </div>

          <div className="divide-y">
            {dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
              dashData.latestAppointments.map((item, index) => (
                <div
                  key={item._id || index}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                >
                  {/* Doctor info */}
                  <div className="flex items-center gap-3">
                    <img
                      src={item.docData.image || "https://via.placeholder.com/40"}
                      alt={item.docData.name || "Doctor"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{item.docData.name || "N/A"}</p>
                      <p className="text-sm text-gray-500">
                        {slotDateFormat(item.SlotDate) || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Status or Action */}
                  {item.cancelled ? (
                    <p className="text-red-500 text-sm font-medium">Cancelled</p>
                  ) : item.isCompleted ? (
                    <p className="text-green-500 text-sm font-medium">Completed</p>
                  ) : (
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className="text-red-500 hover:bg-red-100 rounded-full w-7 h-7 flex items-center justify-center"
                    >
                      &#10005;
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="p-4 text-center text-gray-500">
                No latest bookings.
              </p>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;
