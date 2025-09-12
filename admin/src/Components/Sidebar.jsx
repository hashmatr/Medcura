import React from 'react'
import { NavLink } from 'react-router-dom'; 
import { assets } from '../assets/assets_admin/assets';
import { AdminContext } from '../Context/AdminContext';
import { DoctorContext } from '../Context/DoctorContext';

const Sidebar = () => {
  const { aToken } = React.useContext(AdminContext);
  const { dToken } = React.useContext(DoctorContext);


  return (
    <div className="w-64 h-screen bg-white shadow-md px-4 py-6">
      {aToken && (
        <ul className="flex flex-col">
          <NavLink 
            to={'/admin-dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 cursor-pointer transition
               ${isActive 
                  ? "bg-indigo-50 border-l-4 border-indigo-600 text-indigo-600 font-medium" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"}`
            }
          >
            <img src={assets.home_icon} alt="" className="w-5 h-5" />
            <p>Dashboard</p>
          </NavLink>

          <NavLink 
            to={'/add-doctor'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 cursor-pointer transition
               ${isActive 
                  ? "bg-indigo-50 border-l-4 border-indigo-600 text-indigo-600 font-medium" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"}`
            }
          >
            <img src={assets.people_icon} alt="" className="w-5 h-5" />
            <p>Add Doctor</p>
          </NavLink>

          <NavLink 
            to={'/all-appointments'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 cursor-pointer transition
               ${isActive 
                  ? "bg-indigo-50 border-l-4 border-indigo-600 text-indigo-600 font-medium" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"}`
            }
          >
            <img src={assets.appointment_icon} alt="" className="w-5 h-5" />
            <p>Appointments</p>
          </NavLink>

          <NavLink 
            to={'/doctors-list'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 cursor-pointer transition
               ${isActive 
                  ? "bg-indigo-50 border-l-4 border-indigo-600 text-indigo-600 font-medium" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"}`
            }
          >
            <img src={assets.add_icon} alt="" className="w-5 h-5" />
            <p>Doctors List</p>
          </NavLink>
        </ul>
      )}
            {dToken && (
        <ul className="flex flex-col">
          <NavLink 
            to={'/doctor-dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 cursor-pointer transition
               ${isActive 
                  ? "bg-indigo-50 border-l-4 border-indigo-600 text-indigo-600 font-medium" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"}`
            }
          >
            <img src={assets.home_icon} alt="" className="w-5 h-5" />
            <p>Dashboard</p>
          </NavLink>
          <NavLink 
            to={'/doctor-profile'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 cursor-pointer transition
               ${isActive 
                  ? "bg-indigo-50 border-l-4 border-indigo-600 text-indigo-600 font-medium" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"}`
            }
          >
            <img src={assets.people_icon} alt="" className="w-5 h-5" />
            <p>Profile</p>
          </NavLink>

          <NavLink 
            to={'/doctor-appointment'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 cursor-pointer transition
               ${isActive 
                  ? "bg-indigo-50 border-l-4 border-indigo-600 text-indigo-600 font-medium" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"}`
            }
          >
            <img src={assets.appointment_icon} alt="" className="w-5 h-5" />
            <p>Appointments</p>
          </NavLink>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
