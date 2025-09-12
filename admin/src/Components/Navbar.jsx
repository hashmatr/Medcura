import React, { useContext } from 'react'
import { AdminContext } from '../Context/AdminContext'
import Logo from './Logo.jsx'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../Context/DoctorContext.jsx'

const Navbar = () => {
  const navigate = useNavigate(); 
  const { aToken,setAToken } = useContext(AdminContext);
  const { dToken,setdToken } = useContext(DoctorContext);
 const logout = () => {
  aToken && setAToken('');
  aToken && localStorage.removeItem("aToken");
  dToken && setdToken('');
  dToken && localStorage.removeItem("dToken");
  navigate('/');
  
 }
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white shadow-md">
      {/* Left side with Logo + Role */}
      <div className="flex items-center gap-3">
        <Logo className="w-12 h-12 object-contain" />

        {/* Oval badge for role */}
        <span className="px-4 py-1 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-full shadow-sm">
          {aToken ? 'Admin' : 'Doctor'}
        </span>
      </div>

      {/* Right side logout button */}
      <button onClick={logout} className="px-5 py-2 cursor-pointer bg-indigo-600 text-white font-medium rounded-full shadow hover:bg-indigo-700 transition duration-200">
        Logout
      </button>
    </div>
  )
}

export default Navbar
