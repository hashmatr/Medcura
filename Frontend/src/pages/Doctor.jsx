import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext.jsx";

const Doctor = () => {
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const specialties = [
    "General Physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist",
  ];

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doctor) => doctor.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  const handleSpecialtyClick = (spec) => {
    const encodedSpec = encodeURIComponent(spec);
    navigate(`/doctors/${encodedSpec}`);
    setShowMobileFilter(false); // Close mobile filter after selection
  };

  return (
    <div onClick={() => scrollTo(0, 0)} className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">Browse through the doctors specialist.</p>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setShowMobileFilter(!showMobileFilter)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showMobileFilter ? "✕" : "☰"}
          {showMobileFilter ? "Close" : "Filter"}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar - Hidden on mobile unless showMobileFilter is true */}
        <div
          className={`lg:w-64 flex-shrink-0 ${
            showMobileFilter ? "block" : "hidden lg:block"
          }`}
        >
          <div className="space-y-2">
            {specialties.map((spec, index) => (
              <button
                key={index}
                onClick={() => handleSpecialtyClick(spec)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 hover:bg-blue-50 hover:border-blue-500 ${
                  speciality === spec
                    ? "bg-blue-50 border-blue-500 text-blue-600 font-medium"
                    : "bg-white border-gray-200 text-gray-600 hover:text-gray-900"
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        {/* Doctor Grid - Hidden on mobile when filter is open */}
        <div
          className={`flex-1 ${
            showMobileFilter ? "hidden lg:block" : "block"
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filterDoc.map((doctor, index) => (
              <div
                key={index}
                onClick={() => navigate(`/appointment/${doctor._id}`)}
                className="bg-blue-50 border border-gray-200 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-blue-300"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        doctor.available === true
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        doctor.available === true
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {doctor.available === true
                        ? "Available"
                        : "Not Available"}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900 text-base">
                    {doctor.name}
                  </h3>

                  <p className="text-gray-600 text-sm">{doctor.speciality}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctor;
