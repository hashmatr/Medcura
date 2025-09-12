import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Profile_pic from "../assets/assets_frontend/profile_pic.png";
import Dropdown from "../assets/assets_frontend/dropdown_icon.svg";
import { AppContext } from "../Context/AppContext";
import Logo from './Logo.jsx'

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, logout, userData } = React.useContext(AppContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout(); // Use the logout function from context
    navigate("/");
    setIsMobileMenuOpen(false); // Close mobile menu if open
  };

  const navItems = [
    { name: "HOME", path: "/" },
    { name: "ALL DOCTORS", path: "/doctors"},
    { name: "ABOUT", path: "/about" },
    { name: "CONTACT", path: "/contact" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="w-full bg-white shadow-sm py-2 relative">
      <div className="flex items-center justify-between px-2">
        {/* Logo */}
        <Logo />
        
        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-12 text-sm font-semibold text-gray-900">
          {navItems.map((item) => {
            const isActive =
              item.path === "/doctors"
                ? location.pathname.startsWith("/doctors")
                : location.pathname === item.path;

            return (
              <li key={item.name} className="relative">
                <Link
                  to={item.path}
                  className={`cursor-pointer transition duration-150 ${
                    isActive ? "text-indigo-600" : "hover:text-indigo-500"
                  }`}
                >
                  {item.name}
                </Link>

                {isActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-indigo-500 rounded-full" />
                )}
              </li>
            );
          })}
        </ul>

        {/* Desktop Profile/Login */}
        <div className="hidden md:block">
          {token && userData ? (
            <div className="relative group inline-block">
              {/* Profile and Dropdown Icon */}
              <div className="flex items-center gap-2 rounded-full py-1.5 hover:bg-gray-100 transition cursor-pointer">
                <img
                  src={userData.image || Profile_pic}
                  alt="Profile"
                  className="w-9 h-9 rounded-full border-2 border-indigo-500 shadow-sm object-cover"
                />
                <img src={Dropdown} alt="Open menu" className="w-4 h-4" />
              </div>

              {/* Dropdown Menu - visible on hover */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer rounded-t-lg"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/my-appointments")}
                  className="block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                >
                  My Appointments
                </p>
                <p
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer rounded-b-lg text-red-600 hover:bg-red-50"
                >
                  Logout
                </p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
              }}
              className="bg-indigo-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-indigo-600 transition cursor-pointer"
            >
              Create account
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          {/* Profile for mobile */}
          {token && userData && (
            <img
              src={userData.image || Profile_pic}
              alt="Profile"
              className="w-8 h-8 rounded-full border-2 border-indigo-500 shadow-sm object-cover"
            />
          )}
          
          {/* Hamburger Button */}
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md hover:bg-gray-100 transition"
            aria-label="Toggle mobile menu"
          >
            <div className="space-y-1.5">
              <div className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white shadow-lg z-50 transition-all duration-300 ${
        isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        <div className="px-4 py-4 space-y-4">
          {/* Mobile Nav Links */}
          {navItems.map((item) => {
            const isActive =
              item.path === "/doctors"
                ? location.pathname.startsWith("/doctors")
                : location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-2 px-3 rounded-md transition duration-150 ${
                  isActive 
                    ? "text-indigo-600 bg-blue-50" 
                    : "text-gray-900 hover:text-indigo-500 hover:bg-gray-100"
                }`}
              >
                {item.name}
              </Link>
            );
          })}

          {/* Mobile Profile Menu */}
          {token && userData ? (
            <div className="border-t pt-4 space-y-2">
              <p
                onClick={() => {
                  navigate("/my-profile");
                  setIsMobileMenuOpen(false);
                }}
                className="block py-2 px-3 text-gray-900 hover:text-indigo-500 hover:bg-gray-100 rounded-md cursor-pointer"
              >
                My Profile
              </p>
              <p
                onClick={() => {
                  navigate("/my-appointments");
                  setIsMobileMenuOpen(false);
                }}
                className="block py-2 px-3 text-gray-900 hover:text-indigo-500 hover:bg-gray-100 rounded-md cursor-pointer"
              >
                My Appointments
              </p>
              <p
                onClick={handleLogout}
                className="block py-2 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md cursor-pointer"
              >
                Logout
              </p>
            </div>
          ) : (
            <div className="border-t pt-4">
              <button
                onClick={() => {
                  navigate("/login");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-indigo-500 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-indigo-600 transition"
              >
                Create account
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;