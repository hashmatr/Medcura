import React, { useState } from 'react'
import { assets } from './../assets/assets_admin/assets'
import {AdminContext} from './../Context/AdminContext.jsx'
import axios from 'axios'
import { useContext } from 'react'
import { toast } from 'react-toastify';
import { DoctorContext } from '../Context/DoctorContext.jsx'
const Login = () => {
  const [state, setState] = useState('Admin')
  const [Email,setEmail]  = useState('');
  const [Password,setPassword]  = useState('')
 const {setAToken,BackendURL} = useContext(AdminContext);
 const {dToken,setdToken} = useContext(DoctorContext)
 const SubmitHandler = async (e) => {
   e.preventDefault();
   try {
       if(state === 'Admin'){
        const {data} = await axios.post(BackendURL+'/api/admin/login',{
           email: Email,
           password: Password
       })
          console.log("Token being sent:", data.token);
      if(data.success){
        localStorage.setItem('aToken',data.token)
         setAToken(data.token);
      }
       else{
        toast.error("Invalid credentials");
       }
    }
    else{
      const {data} = await axios.post(BackendURL+'/api/doctor/login',{ email: Email,
           password: Password})
      if(data.success){
        localStorage.setItem('dToken',data.token)
        setdToken(data.token)
        console.log(data.token);
      }
       }
      }
    catch (error) {
      toast.error(data.message)
   }
   }
  return (
    <form onSubmit={SubmitHandler} className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <p className="text-2xl font-semibold text-center mb-6">
          <span className="text-indigo-600">{state}</span> Login
        </p>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Email</p>
          <input
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-1">Password</p>
          <input
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <button
        type='submit'
          className="w-full cursor-pointer bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200 font-semibold"
        >
          Login
        </button>

        {/* Toggle between Admin / Doctor */}
        {state === 'Admin' ? (
          <p className="mt-4 text-center text-sm text-gray-600">
            Doctor Login?{" "}
            <span
              onClick={() => setState('Doctor')}
              className="text-indigo-600 font-medium cursor-pointer hover:underline"
            >
              Click here
            </span>
          </p>
        ) : (
          <p className="mt-4 text-center text-sm text-gray-600">
            Admin Login?{" "}
            <span
              onClick={() => setState('Admin')}
              className="text-indigo-600 font-medium cursor-pointer hover:underline"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  )}

export default Login
