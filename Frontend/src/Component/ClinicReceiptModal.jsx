import React from "react";

const ClinicReceiptModal = ({ appointment, isOpen, onClose, onPrint }) => {
  if (!isOpen || !appointment) return null;

  // Format appointment date
  const formatDate = (slotDate, slotTime) => {
    const [day, month, year] = slotDate.split("_").map(Number);
    const [hour, minute] = slotTime.split(":").map(Number);
    const dateObj = new Date(year, month - 1, day, hour, minute);
    return dateObj.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format payment time
  const formattedPaymentDate = appointment.paymentTime
    ? new Date(appointment.paymentTime).toLocaleString()
    : "N/A";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-lg print:p-0 print:bg-white print:shadow-none">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Clinic Visit Receipt</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Doctor Info */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={appointment.docData.image}
                alt={appointment.docData.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-base md:text-lg">
                Dr. {appointment.docData.name}
              </h3>
              <p className="text-gray-600 text-sm">{appointment.docData.speciality}</p>
            </div>
          </div>

          {/* Clinic Address */}
          <div className="text-gray-700 text-sm">
            <p className="font-medium mb-1">Clinic Address:</p>
            <p>{appointment.docData.address.line1}</p>
            <p>{appointment.docData.address.line2}</p>
          </div>

          {/* Appointment Info */}
          <div className="text-gray-700 text-sm space-y-1">
            <p>
              <span className="font-medium">Date & Time: </span>
              {formatDate(appointment.SlotDate, appointment.SlotTime)}
            </p>
            <p>
              <span className="font-medium">Payment Amount: </span>${appointment.amount}
            </p>
            <p>
              <span className="font-medium">Payment Proof: </span>
              {appointment.payment ? "✔ Paid" : "❌ Not Paid"}
            </p>
            <p>
              <span className="font-medium">Payment Time: </span>{formattedPaymentDate}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={onPrint}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700"
            >
              Print Receipt
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicReceiptModal;
