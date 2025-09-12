import React from 'react'
import Login from './Pages/Login.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Components/Navbar.jsx';
import { AdminContext } from './Context/AdminContext.jsx';
import Sidebar from './Components/Sidebar.jsx';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './Pages/Admin/Dashboard.jsx';
import DoctorsList from './Pages/Admin/DoctorsList.jsx';
import Allappointment from './Pages/Admin/Allappointment.jsx';
import AddDoctor from './Pages/Admin/AddDoctor.jsx';
import { DoctorContext } from './Context/DoctorContext.jsx';
import DoctorAppointment from './Pages/Doctor/DoctorAppointment.jsx';
import DoctorDashboard from './Pages/Doctor/DoctorDashboard.jsx';
import DoctorProfile from './Pages/Doctor/DoctorProfile.jsx';
const App = () => {
  const {aToken} = React.useContext(AdminContext);
    const {dToken} = React.useContext(DoctorContext);

  return dToken || aToken?(
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
      <Sidebar/>
      <Routes>
        <Route path='/' element={<></>}/>
        <Route path='/admin-dashboard' element={<Dashboard/>}/>
        <Route path='/doctors-list' element={<><DoctorsList/></>}/>
        <Route path='/all-appointments' element={<Allappointment/>}/>
        <Route path='/add-doctor' element={<AddDoctor/>}/>
        <Route path='/doctor-Dashboard' element={<DoctorDashboard/>}/>
        <Route path='/doctor-appointment' element={<DoctorAppointment/>}/>
        <Route path='/doctor-profile' element={<DoctorProfile/>}/>
      </Routes>
    </div>
    </div>
  ):(
    <>
      <Login />
      <ToastContainer />
    </>
  )
}

export default App