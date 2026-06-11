import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold text-gradient">MediCare</span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your trusted healthcare partner. Book appointments with the best doctors.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link to="/doctors" className="hover:text-blue-600">Find Doctors</Link></li>
              <li><Link to="/symptom-checker" className="hover:text-blue-600">AI Symptom Checker</Link></li>
              <li><Link to="/register" className="hover:text-blue-600">Register</Link></li>
              <li><Link to="/login" className="hover:text-blue-600">Login</Link></li>
            </ul>
          </div>

          {/* Specializations */}
          <div>
            <h3 className="font-semibold mb-4">Specializations</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link to="/doctors?specialization=Cardiology" className="hover:text-blue-600">Cardiology</Link></li>
              <li><Link to="/doctors?specialization=Neurology" className="hover:text-blue-600">Neurology</Link></li>
              <li><Link to="/doctors?specialization=Pediatrics" className="hover:text-blue-600">Pediatrics</Link></li>
              <li><Link to="/doctors" className="hover:text-blue-600">View All</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center space-x-2">
                <FiPhone className="w-4 h-4" />
                <span>+91 12345 67890</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiMail className="w-4 h-4" />
                <span>support@medicare.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiMapPin className="w-4 h-4" />
                <span>Mumbai, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t dark:border-gray-700 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 MediCare. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-2 md:mt-0">
            Made with <FiHeart className="w-4 h-4 text-red-500 mx-1" /> for better healthcare
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;