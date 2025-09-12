import React from "react";
import { AppContext } from "../Context/AppContext.jsx";
import { useNavigate } from "react-router-dom";

const RelatedDoctors = ({ docId, speciality }) => {
  const { doctors } = React.useContext(AppContext);
  const [relDoc, setRelDoc] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorData = doctors.filter(
        (doc) => doc._id !== docId && doc.speciality === speciality
      );
      setRelDoc(doctorData);
    }
  }, [docId, speciality, doctors]);

  return (
    <div className="py-12 px-4 md:px-8 lg:px-16 bg-white">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-3">
        Related Doctors
      </h1>
      <p className="text-center text-gray-500 mb-10 text-sm md:text-base">
        Simply browse through our extensive list of trusted doctors.
      </p>

      {/* Doctors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
        {relDoc.slice(0, 5).map((doctor, index) => (
          <div
            onClick={() => navigate(`/appointment/${doctor._id}`)}
            key={index}
            className="bg-[#f4f6ff] rounded-xl shadow-sm hover:shadow-md transition-transform duration-200 hover:-translate-y-1 cursor-pointer"
          >
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-full h-56 object-cover rounded-t-xl"
            />
            <div className="p-4 space-y-1">
              <div className="flex items-center gap-1 text-sm">
                <span
                  className={`w-2 h-2 rounded-full inline-block ${
                    doctor.available ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                <span
                  className={`font-medium ${
                    doctor.available ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {doctor.available ? "Available" : "Not Available"}
                </span>
              </div>
              <p className="text-base font-semibold text-gray-800">
                {doctor.name}
              </p>
              <p className="text-sm text-gray-600">{doctor.speciality}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedDoctors;
