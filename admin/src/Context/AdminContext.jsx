import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import React from "react";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const BackendURL = import.meta.env.VITE_BACKEND_URL;

  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );
  const [doctors, setDoctors] = useState([]);
  const [appointments,setAppointments] = useState([])
  const [dashData,setdashData] = useState(false)

  // ✅ Fetch all doctors
  const getAllDoctors = async () => {
    try {
      const { data } = await axios.post(
        BackendURL + "/api/admin/all-doctors",
        {},
        { headers: { Authorization: `Bearer ${aToken}` } }
      );
      if (data.success) {
        setDoctors(data.doctors);
        console.log(data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Toggle doctor availability
const changeAvailability = async (docId) => {
  try {
    const { data } = await axios.post(
      `${BackendURL}/api/admin/change-availability`,
      { docId }, // ✅ sending docId in body
      { headers: { Authorization: `Bearer ${aToken}` } }
    );

    console.log(data);
    if (data.success) {
      toast.success(data.message);
      getAllDoctors(); // refresh doctor list
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  }
};

  const getAllAppointments = async ()=>{
      try {
        const {data} = await axios.get(BackendURL+'/api/admin/appointments',{headers: { Authorization: `Bearer ${aToken}`}})
         if(data.success){
          setAppointments(data.appointments)
         }
         else{
          toast.error(data.message)
         }
      } catch (error) {
        toast.error(error.message);
      }
  }


    const cancelAppointment = async(appointmentId) =>{
      try {
        const {data} = await axios.post(BackendURL+'/api/admin/cancel-appointment',{appointmentId},{headers: { Authorization: `Bearer ${aToken}`}})
        if(data.success){
          toast.success(data.message)
          getAllAppointments()
        }
        else{
          toast.error(data.message)
        }
        
      } catch (error) {
      toast.error(error.message);
      }
    }
    const getdashData  = async ()=>{
      try {
        const {data} = await axios.get(BackendURL+'/api/admin/dashboard',{headers: { Authorization: `Bearer ${aToken}`}})
        if(data.success){
          setdashData(data.dashData)
          console.log(data.dashData);
        }
        else{
          toast.error(data.message)
        }
      } catch (error) {
          toast.error(data.message)

      }
    }
  const value = {
    aToken,
    setAToken,
    BackendURL,
    doctors,
    getAllDoctors,
    changeAvailability,
    appointments,setAppointments,getAllAppointments,
    cancelAppointment,dashData,getdashData
  };
  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
