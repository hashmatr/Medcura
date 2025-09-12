import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../Context/DoctorContext";
import { AppContext } from "../../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const { dToken, profileData, getProfileData, setProfileData, BackendURL } =
    useContext(DoctorContext);
  const { currency } = useContext(AppContext);

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  // ✅ Save updated profile
  const saveChanges = async () => {
    try {
      const { fees, address, available, about } = profileData;
      const { data } = await axios.post(
        `${BackendURL}/api/doctor/update-profile`,
        { fees, address, available, about },
        { headers: { Authorization: `Bearer ${dToken}` } }
      );

      if (data.success) {
        toast.success("Profile updated");
        setProfileData(data.doctor); // sync updated data from backend
        setEditMode(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    profileData && (
      <div className="p-6">
        <div className="flex gap-6">
          {/* Left Image */}
          <div className="w-40 h-40 bg-blue-100 flex items-center justify-center rounded-lg overflow-hidden">
            <img
              src={profileData.image}
              alt={profileData.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Info */}
          <div className="flex-1 bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {profileData.name}
            </h2>
            <p className="text-gray-600">
              {profileData.degree} - {profileData.speciality}{" "}
              <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 border rounded">
                {profileData.experience} Years
              </span>
            </p>

            {/* About */}
            <div className="mt-4">
              <h3 className="font-semibold text-gray-700">About:</h3>
              {editMode ? (
                <textarea
                  className="border rounded w-full px-2 py-1 mt-1"
                  value={profileData.about}
                  onChange={(e) =>
                    setProfileData((prev) => ({ ...prev, about: e.target.value }))
                  }
                />
              ) : (
                <p className="text-gray-600">{profileData.about}</p>
              )}
            </div>

            {/* Fee */}
            <p className="mt-4 text-gray-700">
              Appointment fee:{" "}
              {editMode ? (
                <input
                  type="number"
                  className="border rounded px-2 py-1 w-24"
                  value={profileData.fees}
                  onChange={(e) =>
                    setProfileData((prev) => ({ ...prev, fees: e.target.value }))
                  }
                />
              ) : (
                <span className="font-semibold">
                  {currency} {profileData.fees}
                </span>
              )}
            </p>

            {/* Address */}
            <div className="mt-4">
              <h3 className="font-semibold text-gray-700">Address:</h3>
              {editMode ? (
                <>
                  <input
                    type="text"
                    placeholder="Line 1"
                    className="border rounded w-full px-2 py-1 mt-1"
                    value={profileData.address?.line1 || ""}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                  />
                  <input
                    type="text"
                    placeholder="Line 2"
                    className="border rounded w-full px-2 py-1 mt-2"
                    value={profileData.address?.line2 || ""}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                  />
                </>
              ) : (
                <>
                  <p className="text-gray-600">{profileData.address?.line1}</p>
                  <p className="text-gray-600">{profileData.address?.line2}</p>
                </>
              )}
            </div>

            {/* Availability */}
            <div className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                checked={profileData.available}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    available: e.target.checked,
                  }))
                }
                disabled={!editMode}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
              <label className="text-gray-700">Available</label>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex gap-4">
              {editMode ? (
                <>
                  <button
                    onClick={saveChanges}
                    className="px-4 py-2 border rounded bg-blue-500 text-white hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
