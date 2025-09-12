import { useState } from "react";
import { createContext } from "react";
import React from "react";
import axios from 'axios'
import { toast } from "react-toastify";
export const DoctorContext = createContext();

const DoctorContextProvider = (props) =>{
    const BackendURL = import.meta.env.VITE_BACKEND_URL 
    const [dToken,setdToken] = useState(localStorage.getItem("dToken") ? localStorage.getItem("dToken") : "")
    const [appointments,setAppointments] = useState([])
    const [dashData,setdashData] = useState(false)
    const [profileData,setProfileData] = useState(false)
    const getAppointment = async () => {
        try {
            const {data} = await axios.get(BackendURL+'/api/doctor/appointments',{ headers: { Authorization: `Bearer ${dToken}` } })
            if(data.success){
                setAppointments(data.appointments.reverse())
                console.log(data.appointments.reverse());
            }
            else{ 
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
            
        }
    }
    const completeappointment = async (appointmentId) =>{
        try{
        const {data} = await axios.post(BackendURL + '/api/doctor/complete-appointment',{appointmentId},{ headers: { Authorization: `Bearer ${dToken}` } })
        if(data.success){
            toast.success(data.message)
            getAppointment()
        }
        else{
            toast.error(data.message)
        }
        }
        catch(error){
         console.log(error);
         toast.error(error.message)  
        }
    }
        const cancelappointment = async (appointmentId) =>{
        try{
        const {data} = await axios.post(BackendURL + '/api/doctor/cancel-appointment',{appointmentId},{ headers: { Authorization: `Bearer ${dToken}` } })
        if(data.success){
            toast.success(data.message)
            getAppointment()
        }
        else{
            toast.error(data.message)
        }
        }
        catch(error){
         console.log(error);
         toast.error(error.message)  
        }
    }
    const getdashData = async ()=>{
 try {
    const {data} = await axios.get(BackendURL+'/api/doctor/dashboard',{ headers: { Authorization: `Bearer ${dToken}` } })
    if(data.success){
        setdashData(data.dashData)
        console.log(data.dashData);
    }
    else{
        toast.error(data.message)
    }
 } catch (error) {
   console.log(error);
   toast.error(error.message)  
 }
}
const getProfileData = async () =>{
    try {
        const {data} = await axios.get(BackendURL+'/api/doctor/profile',{ headers: { Authorization: `Bearer ${dToken}` } })
        if(data.success){
            setProfileData(data.profileData)
            console.log(data.profileData);
        }
    } catch (error) {
      console.log(error);
   toast.error(error.message)   
    }
}
    const value = {
        dToken,setdToken,BackendURL,setAppointments,appointments,getAppointment,cancelappointment,completeappointment,dashData,setdashData,getdashData,setProfileData,getProfileData,profileData}
    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider;