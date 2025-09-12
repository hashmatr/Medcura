import React from 'react';
import Appointment from '../assets/assets_frontend/appointment_img.png';
import { useNavigate } from 'react-router-dom';

const Banner = () => {
  const navigate = useNavigate();
  return (
    <div className="flex bg-[#4C5DF1] min-h-[300px] md:h-[350px] flex-col-reverse md:flex-row items-center justify-between bg-primary rounded-lg px-4 sm:px-6 md:px-10 lg:px-14 py-6 md:py-10 my-8 md:my-20 mx-4 md:mx-10 text-primary-foreground">
      
      {/* Left Side */}
      <div className="w-full md:w-1/2 space-y-4 md:space-y-6 text-center md:text-left">
        <div className="space-y-1 md:space-y-2">
          <p className="text-xl sm:text-2xl  text-white md:text-3xl lg:text-4xl font-semibold leading-tight">Book Appointment</p>
          <p className="text-xl sm:text-2xl text-white md:text-3xl lg:text-4xl font-semibold leading-tight">With 100+ Trusted Doctors</p>
        </div>
        <button 
             onClick={() => {
            navigate("/login");
            scrollTo(0, 0);
          }}
        className="bg-white cursor-pointer  text-foreground font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-black hover:text-white active:scale-95 transition-all duration-300 touch-manipulation">
          Create Account
        </button>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 flex justify-center mb-6 md:mb-0">
        <img src={Appointment} alt="Appointment_Image" className="h-48 sm:h-56 md:h-64 lg:h-80 max-w-full object-contain" />
      </div>
    </div>
  );
};

export default Banner;