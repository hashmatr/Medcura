import React, { useEffect, useContext } from 'react';
import { AdminContext } from '../../Context/AdminContext.jsx';
const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken, getAllDoctors]);

  return (
    <div className="p-6">
      {/* Always show heading */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">All Doctors</h1>

      {/* Doctors Grid or Message */}
      {Array.isArray(doctors) && doctors.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {doctors.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center text-center hover:shadow-lg transition"
            >
              <img 
                src={item.image}
                alt={item.name}
                className="w-32 h-32 rounded-xl object-cover mb-4"
              />
              <div className="flex flex-col items-center">
                <p className="text-md font-semibold text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">{item.speciality}</p>

                {/* Availability badge */}
                <span className="flex items-center">
                  <input type="checkbox" checked={item.available} onChange={() => changeAvailability(item._id)} />
                  <p>Availability</p>
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No doctors found or loading...</p>
      )}
    </div>
  );
};

export default DoctorsList;
