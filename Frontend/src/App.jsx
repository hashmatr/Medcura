import './index.css'
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from './pages/Home.jsx';
import Contact from './pages/Contact.jsx';    
import MyAppointments from './pages/MyAppointments.jsx';
import Myprofile from './pages/Myprofile.jsx';
import About from './pages/About.jsx';
import Doctor from './pages/Doctor.jsx';
import Login from './pages/Login.jsx';
import Appointments from './pages/Appointment.jsx';
import Navbar from './Component/Navbar.jsx';
import Footer from './Component/Footer.jsx';

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <Navbar/>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/appointment/:docId' element={<Appointments />} />
        <Route path='/my-profile' element={<Myprofile />} />
        <Route path='/about' element={<About />} />
        <Route path='/doctors' element={<Doctor />} />
        <Route path='/doctors/:speciality' element={<Doctor />} />
        <Route path='/login' element={<Login />} />
      </Routes>

      <Footer />

      {/* 👇 Add ToastContainer here */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  )
}

export default App;
