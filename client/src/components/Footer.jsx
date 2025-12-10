import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const Footer = () => {

  const currentYear = new Date().getFullYear();


  return (
    <footer className="bg-gray-200 dark:bg-gray-800 w-full m-0 text-white mt-auto">
        <div className="py-4 px-4 flex justify-between items-center text-sm text-gray-500">
          <p>&copy; {currentYear} Courierlyn. All Rights Reserved.</p>
          <div className="flex space-x-4">
            <a href="/privacy-policy" className="hover:text-white">Privacy Policy</a>
            <a href="/terms-conditions" className="hover:text-white">Terms & Conditions</a>
          </div>
          {/* 🔑 Scroll to Top Arrow (Optional) */}
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="hidden shadow-md! sticky bottom-0! z-50 lg:block bg-gray-900! dark:bg-white! p-2 rounded-full hover:bg-gray-600 transition"
            aria-label="Scroll to top"
          >
            <svg className="w-5 h-5 text-white dark:text-black " fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
          </button>
        </div>
      
    </footer>
  );
};

export default Footer;