  import React from "react";
  import { useNavigate } from "react-router-dom";
  const Logo = () => {
    const navigate = useNavigate(); 
    return(
          <div onClick={() => navigate("/")} className="cursor-pointer flex items-center gap-3">
            <div className="bg-indigo-500 p-2 rounded-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="white"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 2L2 7v6c0 5.5 4.5 10 10 10s10-4.5 10-10V7l-10-5z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-[#000B6D]">Medcura</h1>
          </div>
    )}
  export default Logo