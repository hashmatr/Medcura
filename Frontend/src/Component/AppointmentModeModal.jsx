import React from "react"
const AppointmentModeModal = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4">Choose Appointment Mode</h2>
        <button
          onClick={() => onSelect('video')}
          className="w-full mb-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Video Call
        </button>
        <button
          onClick={() => onSelect('physical')}
          className="w-full px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
        >
          Visit Clinic
        </button>
        
      </div>
    </div>
  )
}
export default AppointmentModeModal