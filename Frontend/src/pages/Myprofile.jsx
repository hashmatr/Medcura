import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "./../Context/AppContext.jsx";
import { assets } from "../assets/assets_frontend/assets.js";
import axios from "axios";
import { toast } from "react-toastify";

const Myprofile = () => {
  const { userData, setUserData, token, BackendURL, loadUserProfileData } =
    useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    gender: "",
    birthday: "",
  });

  // Sync formData with userData when userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address1: userData.address?.line1 || "",
        address2: userData.address?.line2 || "",
        gender: userData.gender || "",
        birthday: userData.dob || "",
      });
    }
  }, [userData]);

  // handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // update profile API
  const updateUserProfileData = async () => {
    try {
      console.log("Preparing form data...");
      const sendData = new FormData();

      sendData.append("name", formData.name);
      sendData.append("email", formData.email);
      sendData.append("phone", formData.phone);
      sendData.append(
        "address",
        JSON.stringify({
          line1: formData.address1,
          line2: formData.address2,
        })
      );
      sendData.append("gender", formData.gender);
      sendData.append("dob", formData.birthday);

      if (image) {
        sendData.append("image", image);
        console.log("📸 Image attached:", image.name);
      }

      console.log("Sending request to:", `${BackendURL}/api/user/update-profile`);

      const { data } = await axios.post(
        `${BackendURL}/api/user/update-profile`,
        sendData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response received:", data);

      if (data.success) {
        toast.success(data.message || "Profile updated successfully ✅");

        // reload fresh user data from backend
        await loadUserProfileData();

        setIsEditing(false);
        setImage(null);
      } else {
        toast.error(data.message || "Something went wrong ❌");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong while updating profile ❌"
      );
    }
  };

  return (
    userData && (
      <div className="max-w-lg bg-card rounded-lg mt-6 mb-6 relative">
        {/* Profile Picture */}
        {isEditing ? (
          <label htmlFor="image">
            <div className="inline-block cursor-pointer relative">
              <img
                className="w-36 rounded opacity-75"
                src={image ? URL.createObjectURL(image) : userData.image}
                alt=""
              />
              {!image && (
                <img
                  className="w-10 absolute bottom-12 right-12"
                  src={assets.upload_icon}
                  alt=""
                />
              )}
            </div>
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              className="hidden"
              id="image"
              hidden
            />
          </label>
        ) : (
          <img className="w-36 rounded" src={userData.image} alt="" />
        )}

        {/* Name */}
        {isEditing ? (
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="text-xl font-semibold text-foreground mb-6 bg-transparent border-b border-muted focus:outline-none focus:border-primary w-full"
          />
        ) : (
          <h1 className="text-xl font-semibold text-foreground mb-8">
            {formData.name}
          </h1>
        )}

        {/* Contact Information */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3 border-b border-border pb-1">
            CONTACT INFORMATION
          </h2>

          <div className="space-y-2 text-sm">
            <div className="flex">
              <span className="text-muted-foreground mb-4 w-16">Email:</span>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="text-blue-500 bg-transparent border-b border-muted focus:outline-none focus:border-primary flex-1"
                />
              ) : (
                <span className="text-blue-500">{formData.email}</span>
              )}
            </div>

            <div className="flex">
              <span className="text-muted-foreground mb-4 w-16">Phone:</span>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="text-blue-500 bg-transparent border-b border-muted focus:outline-none focus:border-primary flex-1"
                />
              ) : (
                <span className="mb-4 text-blue-500">{formData.phone}</span>
              )}
            </div>

            <div className="flex">
              <span className="text-muted-foreground w-16">Address:</span>
              <div className="flex flex-col flex-1">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={formData.address1}
                      onChange={(e) =>
                        handleInputChange("address1", e.target.value)
                      }
                      className="text-foreground bg-transparent border-b border-muted focus:outline-none focus:border-primary"
                    />
                    <input
                      type="text"
                      value={formData.address2}
                      onChange={(e) =>
                        handleInputChange("address2", e.target.value)
                      }
                      className="text-foreground bg-transparent border-b border-muted focus:outline-none focus:border-primary"
                    />
                  </>
                ) : (
                  <>
                    <span className="text-foreground">{formData.address1}</span>
                    <span className="text-foreground">{formData.address2}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
            BASIC INFORMATION
          </h2>

          <div className="space-y-2 text-sm">
            <div className="flex">
              <span className="text-muted-foreground w-16">Gender:</span>
              {isEditing ? (
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="text-foreground bg-transparent border-b border-muted focus:outline-none focus:border-primary"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <span className="text-foreground">{formData.gender}</span>
              )}
            </div>

            <div className="flex">
              <span className="text-muted-foreground w-16">Birthday:</span>
              {isEditing ? (
                <input
                  type="date"
                  value={formData.birthday}
                  onChange={(e) => handleInputChange("birthday", e.target.value)}
                  className="text-foreground bg-transparent border-b border-muted focus:outline-none focus:border-primary"
                />
              ) : (
                <span className="text-foreground">{formData.birthday}</span>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          {isEditing ? (
            <button
              onClick={updateUserProfileData}
              className="px-6 py-2 border cursor-pointer hover:bg-[#5F6FFF] hover:text-white bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Save information
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 border cursor-pointer hover:bg-[#5F6FFF] hover:text-white bg-muted text-foreground rounded-full text-sm font-medium hover:bg-muted/80 transition-colors"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    )
  );
};

export default Myprofile;
