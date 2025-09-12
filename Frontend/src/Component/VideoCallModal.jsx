import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const VideoCallModal = ({ appointment, isOpen, onClose }) => {
  const [roomUrl, setRoomUrl] = useState("");
  const [appointmentDateTime, setAppointmentDateTime] = useState(null);
  const [appointmentEndTime, setAppointmentEndTime] = useState(null);

  const months = [
    " ",
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
    const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] +
      " " +
      months[Number(dateArray[1])] +
      " " +
      dateArray[2]
    );
  };
  // Generate Jitsi room URL
  useEffect(() => {
    if (isOpen && appointment) {
      generateRoomUrl();
      setupAppointmentTimes();
    }
  }, [isOpen, appointment]);

  const generateRoomUrl = () => {
    const roomName = `appointment-${appointment._id}-${appointment.docData.name
      .replace(/\s+/g, "-")
      .toLowerCase()}`;
    const jitsiUrl = `https://meet.jit.si/${roomName}`;
    setRoomUrl(jitsiUrl);
  };

  const setupAppointmentTimes = () => {
    const [day, month, year] = appointment.SlotDate.split("_").map(Number);
    const [hour, minute] = appointment.SlotTime.split(":").map(Number);

    const start = new Date(year, month - 1, day, hour, minute);
    const end = new Date(start.getTime() + 30 * 60000); // 30 min window

    setAppointmentDateTime(start);
    setAppointmentEndTime(end);
  };

  const startVideoCall = () => {
    if (!appointment.payment) {
      toast.error("Please complete payment before starting video call");
      return;
    }

    const now = new Date();

    if (now < appointmentDateTime) {
      toast.error(
        `You can only start the call at your appointment time: ${appointment.SlotTime} on ${slotDateFormat(appointment.SlotDate)}`
      );
      return;
    }

    if (now > appointmentEndTime) {
      toast.error("Your video call window has expired (30 minutes passed).");
      return;
    }

    // ✅ Within time window → open Jitsi
    toast.success("Starting video call...");
    window.open(
      roomUrl,
      "_blank",
      "width=1200,height=700,menubar=no,toolbar=no,location=no,status=no"
    );
  };

  const copyRoomLink = () => {
    navigator.clipboard.writeText(roomUrl);
    toast.success("Room link copied to clipboard!");
  };

  const sendRoomLinkToDoctor = async () => {
    toast.success("Room link sent to doctor!");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Video Call</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Video Call with Dr. {appointment.docData.name}
            </h3>
            <p className="text-sm text-gray-600">
              {appointment.docData.speciality}
            </p>
          </div>

          {!appointment.payment ? (
            <div className="text-center">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 text-sm">
                  Please complete payment before starting video call
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Room Link */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Room Link:</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={roomUrl}
                    readOnly
                    className="flex-1 text-xs bg-white border border-gray-300 rounded px-2 py-1"
                  />
                  <button
                    onClick={copyRoomLink}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Start Call Button */}
              <button
                onClick={startVideoCall}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 flex items-center justify-center"
              >
                Start Video Call
              </button>

              {/* Send link to doctor */}
              <button
                onClick={sendRoomLinkToDoctor}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 text-sm"
              >
                Send Link to Doctor
              </button>

              {/* Close */}
              <button
                onClick={onClose}
                className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-400"
              >
                Close
              </button>

              {/* Info */}
              <div className="text-xs text-gray-500 text-center">
                <p>• You can only join at the scheduled time</p>
                <p>• The call will remain active for 30 minutes</p>
                <p>• Make sure your camera and microphone are enabled</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;
