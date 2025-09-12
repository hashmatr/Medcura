import React from 'react'
import {specialityData} from '../assets/assets_frontend/assets';
import { Link } from 'react-router-dom';
const SpecialityMenu = () => {
  return (
    <div id="speciality" className="py-8 md:py-12 px-4 md:px-8 lg:px-16 bg-white">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 text-center mb-3 md:mb-4">
        Find by Speciality
      </h1>

      <p className="text-center text-gray-600 text-sm md:text-base max-w-xl mx-auto mb-8 md:mb-10 px-4">
        Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
      </p>
<div className="flex gap-3 md:gap-4 lg:gap-6 justify-center w-full mx-auto overflow-x-auto whitespace-nowrap scroll-smooth">
        {specialityData.map((item, index) => (
          <Link
            onClick={() => scroll(0,0)}
            key={index}
            to={`/doctors/${item.speciality}`}
            className="rounded-xl transform hover:-translate-y-2 active:scale-95 transition-all duration-150 ease-out flex flex-col items-center p-3 md:p-4 text-center group"
          >
            <img
              src={item.image}
              alt={item.speciality}
              className="w-24 h-24 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-200"
            />
            <p className="text-gray-700 font-medium text-xs sm:text-sm md:text-base leading-tight">
              {item.speciality}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
 
export default SpecialityMenu