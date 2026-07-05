import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-white/5 bg-[#070b12] py-8 text-center text-xs text-gray-500">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between">
        <p>&copy; {new Date().getFullYear()} SmartEvent Platform. Built for engineering placement portfolio.</p>
        <p className="mt-2 sm:mt-0 text-[10px] text-gray-600">Frontend and Backend structured separately. MongoDB + Cloudinary integration ready.</p>
      </div>
    </footer>
  );
};

export default Footer;
