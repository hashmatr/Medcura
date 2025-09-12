import React from "react";
import ArrowIcon from "../assets/assets_frontend/arrow_icon.svg";
import Groupprofile from "../assets/assets_frontend/group_profiles.png";
import headerimage from "../assets/assets_frontend/header_img.png";

const DoctorHeader = () => {
  return (
    <section className="w-full mt-6 min-h-[400px] lg:h-[520px] bg-[#4C5DF1] text-white flex items-center justify-center rounded-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center justify-between py-8 lg:py-0">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 space-y-4 lg:space-y-6 text-center lg:text-left mt-6 lg:mt-0">
          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-tight">
            Book Appointment <br />
            <span className="text-white/90">With Trusted Doctors</span>
          </h1>

          {/* Profile Image + Text in One Line */}
          <div className="flex flex-col sm:flex-row items-center gap-2 text-white/80 text-sm sm:text-base lg:text-lg justify-center lg:justify-start">
            <img
              src={Groupprofile}
              alt="Group_profile"
              className="h-8 sm:h-10 rounded-full flex-shrink-0"
            />
            <span className="text-center sm:text-left">
              Simply browse through our extensive list of trusted doctors,
              schedule your appointment hassle-free.
            </span>
          </div>

          {/* Button with Icon in One Line as Anchor */}
          <div className="flex justify-center lg:justify-start">
            <a 
              href="#speciality"
              className="w-auto sm:w-[220px] bg-white text-black font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow hover:opacity-90 transition duration-300 flex items-center gap-2 text-sm sm:text-base"
            >
              <span>Book appointment</span>
              <img src={ArrowIcon} alt="Arrowicon" className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          </div>
        </div>

        {/* Right Image Slot */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="h-[250px] sm:h-[350px] lg:h-[580px] w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[580px] bg-transparent">
            <img src={headerimage} className="h-full w-full object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorHeader;