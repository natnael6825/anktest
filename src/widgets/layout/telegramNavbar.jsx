import React from 'react';
import img2 from "@/assets/Img2.jpg";

function TelegramNavbar() {
  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-white shadow-sm border-b">
      <div className="text-lg font-bold"></div>
      <img src={img2} alt="Logo" className="w-10 h-10 rounded-xl" />
    </nav>
  );
}

export default TelegramNavbar;
