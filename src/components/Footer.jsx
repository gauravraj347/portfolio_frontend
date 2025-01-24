import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white py-10">
      <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Portfolio Tracker Section */}
        <div>
          <h3 className="text-2xl font-bold mb-4">Portfolio Tracker</h3>
          <p className="text-sm text-gray-300">
            A simple platform to manage and monitor your stock investments with real-time updates and analytics.
          </p>
        </div>
        
        {/* Spacer for alignment */}
        <div></div>
        
        {/* Contact Information */}
        <div className="flex flex-col items-end text-right">
          <h4 className="text-xl font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-2 text-gray-300">
            <li>Email: <a className="hover:text-green-400">goluXXXXXX@gmail.com</a></li>
            <li>Phone: <a className="hover:text-green-400">+91 75469 XXXXX</a></li>
          </ul>
        </div>
      </div>

      {/* Powered By Section */}
      <div className="text-center text-sm text-gray-400 mt-8">
        <p>Powered by: <span className="text-green-400 font-semibold">Gaurav Raj</span></p>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 mt-4 pt-4 text-center text-sm text-gray-400">
        <p>&copy; 2025 Portfolio Tracker. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
