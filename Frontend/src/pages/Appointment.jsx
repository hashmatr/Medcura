import React, { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../Context/AppContext';
import RelatedDoctors from '../Component/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, BackendURL, token, getDoctorsData } = useContext(AppContext);
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [SlotTime, setSlotTime] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const daysofweek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Fetch doctor info from context
  const fetchDoctorInfo = async () => {
    try {
      const doctor = doctors.find(doc => doc._id === docId);
      if (!doctor) {
        toast.error("Doctor not found");
        navigate('/doctors');
        return;
      }
      console.log('Fetched doctor info:', doctor);
      console.log('Doctor slot_booked data:', doctor?.slot_booked);
      setDocInfo(doctor);
    } catch (error) {
      console.error('Error fetching doctor info:', error);
      toast.error("Error loading doctor information");
    }
  };

  // Generate available slots for 7 days
  const getAvailableSlots = async () => {
    if (!docInfo) return;
    
    try {
      setDocSlots([]);
      let today = new Date();

      for (let i = 0; i < 7; i++) {
        let currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);

        let endTime = new Date(currentDate);
        endTime.setHours(21, 0, 0, 0); // End time 9 PM

        // Set start time
        if (i === 0) { // Today
          currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
          currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
        } else {
          currentDate.setHours(10);
          currentDate.setMinutes(0);
        }

        let timeSlots = [];

        while (currentDate < endTime) {
          let formattedTime = currentDate.toLocaleString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          });
          
          let day = currentDate.getDate();
          let month = currentDate.getMonth() + 1;
          let year = currentDate.getFullYear();
          const slotDate = `${day}_${month}_${year}`;

          // Check if slot is booked
          const bookedSlots = docInfo?.slot_booked?.[slotDate] || [];
          const isSlotAvailable = !bookedSlots.includes(formattedTime);
          
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
            available: isSlotAvailable
          });

          currentDate.setMinutes(currentDate.getMinutes() + 30);
        }

        setDocSlots(prev => ([...prev, timeSlots]));
      }
    } catch (error) {
      console.error('Error generating slots:', error);
      toast.error("Error loading available slots");
    }
  };

  useEffect(() => {
    if (doctors.length > 0) {
      fetchDoctorInfo();
    }
  }, [docId, doctors]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo, doctors]); // Added doctors dependency to refresh when doctors data changes

  // Booking appointment
  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Please login to book appointment");
      return navigate('/login');
    }

    if (!SlotTime) {
      toast.warn("Please select a time slot");
      return;
    }

    if (!docInfo) {
      toast.error("Doctor information not available");
      return;
    }

    try {
      setLoading(true);
      
      const selectedSlots = docSlots[slotIndex];
      if (!selectedSlots || selectedSlots.length === 0) {
        toast.error("No slots available for the selected date");
        return;
      }

      const selectedSlot = selectedSlots.find(slot => slot.time === SlotTime);
      if (!selectedSlot || !selectedSlot.available) {
        toast.error("Selected slot is not available");
        return;
      }

      const dateObj = selectedSlot.datetime;
      const day = dateObj.getDate();
      const month = dateObj.getMonth() + 1;
      const year = dateObj.getFullYear();
      const SlotDate = `${day}_${month}_${year}`;

      console.log("Booking Appointment:", { docId, SlotDate, SlotTime });

      const { data } = await axios.post(
        BackendURL + '/api/user/book-appointment',
        { docId, SlotDate, SlotTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );

     if (data.success) {
  toast.success(data.message || "Appointment booked successfully!");

  // ✅ Update local state immediately
  setDocSlots(prev =>
    prev.map((daySlots, i) =>
      i === slotIndex
        ? daySlots.map(slot =>
            slot.time === SlotTime ? { ...slot, available: false } : slot
          )
        : daySlots
    )
  );

  // Clear selected time
  setSlotTime('');

  // Optional: refresh doctor list in background so other pages stay updated
  getDoctorsData();

  // Small delay before navigating
  setTimeout(() => {
    navigate('/my-appointments');
  }, 1000);
      } else {
        toast.error(data.message || "Failed to book appointment");
      }

    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error(error.response?.data?.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (!docInfo && doctors.length > 0) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading doctor information...</span>
        </div>
      </div>
    );
  }

  // Doctor not found
  if (!docInfo) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="text-center h-64 flex flex-col justify-center">
          <h2 className="text-xl text-gray-600 mb-4">Doctor not found</h2>
          <button 
            onClick={() => navigate('/doctors')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors mx-auto"
          >
            Browse Doctors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Doctor Profile */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white rounded-lg p-6 shadow-sm border mb-8">
        <div className="bg-[#5F6FFF] rounded-xl flex-shrink-0 p-2">
          <img 
            src={docInfo.image} 
            alt={docInfo.name}
            className="w-64 h-72 bg-primary rounded-lg object-cover"
            onError={(e) => {
              e.target.src = '/default-doctor.png'; // Add a fallback image
            }}
          />
        </div>
        
        <div className="flex-1 border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-semibold text-gray-900">{docInfo.name}</h1>
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <span>{docInfo.degree} - {docInfo.speciality}</span>
            <span className="bg-gray-100 px-2 py-1 rounded text-sm">{docInfo.experience}</span>
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-2">About</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{docInfo.about}</p>
          </div>
          
          <div className="text-gray-900">
            <span className="font-medium">
              Appointment fee: {currencySymbol}{docInfo.fees}
            </span>
          </div>
        </div>
      </div>

      {/* Booking Slots */}
      <div className="bg-white rounded-lg p-6 shadow-sm border mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-gray-900">Booking slots</h2>
          <button
            onClick={getAvailableSlots}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            🔄 Refresh Slots
          </button>
        </div>

        {/* Date Selection */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {docSlots.map((item, index) => {
            if (!item || item.length === 0) return null;
            
            const dayName = daysofweek[item[0].datetime.getDay()];
            const dayNum = item[0].datetime.getDate();
            const availableCount = item.filter(slot => slot.available).length;
            
            return (
              <div
                key={index}
                onClick={() => setSlotIndex(index)}
                className={`flex flex-col items-center p-3 rounded-lg min-w-20 cursor-pointer transition-colors border
                  ${slotIndex === index 
                    ? 'bg-blue-500 text-white border-blue-500' 
                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                  }`}
              >
                <span className="text-sm font-medium">{dayName}</span>
                <span className="text-lg font-bold">{dayNum}</span>
                <span className={`text-xs ${slotIndex === index ? 'text-blue-100' : 'text-gray-500'}`}>
                  {availableCount} slots
                </span>
              </div>
            );
          })}
        </div>

        {/* Time Slots */}
        <div className="mb-6">
          {docSlots[slotIndex] && docSlots[slotIndex].length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {docSlots[slotIndex].map((item, index) => (
                <button
                  key={index}
                  onClick={() => item.available && setSlotTime(item.time)}
                  disabled={!item.available}
                  className={`p-3 text-sm rounded-lg border transition-colors font-medium
                    ${!item.available
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                      : SlotTime === item.time
                        ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                    }`}
                >
                  {item.time}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No slots available for the selected date</p>
            </div>
          )}
        </div>

        {/* Selected Slot Display */}
        {SlotTime && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Selected:</span> {
                docSlots[slotIndex] && docSlots[slotIndex][0] ? 
                `${daysofweek[docSlots[slotIndex][0].datetime.getDay()]}, ${docSlots[slotIndex][0].datetime.getDate()}/${docSlots[slotIndex][0].datetime.getMonth() + 1}/${docSlots[slotIndex][0].datetime.getFullYear()} at ${SlotTime}` : 
                SlotTime
              }
            </p>
          </div>
        )}

        <button 
          onClick={bookAppointment}
          disabled={!SlotTime || loading}
          className={`w-full sm:w-auto px-8 py-3 rounded-lg font-medium transition-colors ${
            !SlotTime || loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Booking...
            </div>
          ) : (
            'Book an appointment'
          )}
        </button>
      </div>

      <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>
    </div>
  );
};

export default Appointment;



