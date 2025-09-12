import React from "react";
import Logo from "./Logo.jsx";
const Footer = () => {
  return (
    <footer className="bg-white text-gray-600 px-6 md:px-20 py-12 border-t border-gray-200">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Left - Logo and Description */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Logo />
          </div>
          <p className="text-sm leading-relaxed text-gray-500">
           Book appointments with trusted doctors in minutes. Medcura brings
            expert medical care to your fingertips—fast, reliable, and always there when you need it.
          </p>
        </div>

        {/* Middle - Company Links */}
        <div>
          <h3 className="text-gray-800 font-semibold mb-4">COMPANY</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">About us</a></li>
            <li><a href="#" className="hover:underline">Contact us</a></li>
            <li><a href="#" className="hover:underline">Privacy policy</a></li>
          </ul>
        </div>

        {/* Right - Get in Touch */}
        <div>
          <h3 className="text-gray-800 font-semibold mb-4">GET IN TOUCH</h3>
          <p className="text-sm mb-2">+1-212-456-7890</p>
          <p className="text-sm">HashmatRazadev@gmail.com</p>
        </div>
      </div>

      <hr className="my-8 border-gray-200" />

      <p className="text-center text-sm text-gray-500">
        Copyright © 2025 Hashmat Raza – All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
