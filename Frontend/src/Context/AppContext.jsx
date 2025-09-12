import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ correct import for your version
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currencySymbol = "Rs";
  const BackendURL = import.meta.env.VITE_BACKEND_URL;

  // ✅ Function to get a valid token from localStorage
  const getValidToken = () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return null;

    try {
      const decoded = jwtDecode(storedToken); // ✅ fixed
      const currentTime = Date.now() / 1000; // seconds
      if (decoded.exp && decoded.exp < currentTime) {
        // Token expired
        localStorage.removeItem("token");
        return null;
      }
      return storedToken;
    } catch (err) {
      console.error("Failed to decode token:", err);
      // ✅ Don’t remove token here — let backend validate it
      return storedToken;
    }
  };

  // ✅ Initialize state
  const [token, setTokenState] = useState(() => getValidToken());
  const [userData, setUserData] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Custom setToken function (updates both localStorage & state)
  const setToken = (newToken) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      setTokenState(newToken);
    } else {
      localStorage.removeItem("token");
      setTokenState(null);
      setUserData(null);
    }
  };

  // ✅ Load profile
  const loadUserProfileData = async () => {
    if (!token) {
      setUserData(null);
      return;
    }

    try {
      const { data } = await axios.get(`${BackendURL}/api/user/get-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData(data.user);
      } else {
        console.error("Failed to fetch user:", data.message);
        if (
          data.message?.toLowerCase().includes("token") ||
          data.message?.toLowerCase().includes("unauthorized") ||
          data.message?.toLowerCase().includes("invalid")
        ) {
          setToken(null);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        setToken(null);
      }
    }
  };

  // ✅ Load doctors
  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${BackendURL}/api/doctor/list`);
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        console.error("Failed to fetch doctors:", data.message);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  // ✅ Initial loading done
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // ✅ Refetch profile when token changes
  useEffect(() => {
    if (!isLoading) {
      if (token) loadUserProfileData();
      else setUserData(null);
    }
  }, [token, isLoading]);

  // ✅ Fetch doctors once
  useEffect(() => {
    if (!isLoading) {
      getDoctorsData();
    }
  }, [isLoading]);

  // ✅ Axios interceptor to catch expired tokens globally
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        if ((err.response?.status === 401 || err.response?.status === 403) && token) {
          console.log("Token expired or invalid, logging out...");
          setToken(null);
          toast.error("Session expired. Please login again.");
        }
        return Promise.reject(err);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [token]);

  // ✅ Explicit logout
  const logout = () => {
    setToken(null);
    toast.success("Logged out successfully");
  };

  // ✅ Context value
  const value = {
    doctors,
    currencySymbol,
    token,
    setToken,
    BackendURL,
    loadUserProfileData,
    userData,
    setUserData,
    getDoctorsData,
    isLoading,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
