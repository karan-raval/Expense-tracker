import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <motion.nav 
      className="bg-sky-700 text-white shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">📊</span>
            <span className="font-bold text-xl">Budget Master</span>
          </Link>
          
          <div className="flex space-x-4">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 
                ${isActive('/') ? 'bg-sky-800 text-white' : 'hover:bg-sky-800'}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/statistics" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 
                ${isActive('/statistics') ? 'bg-sky-800 text-white' : 'hover:bg-sky-800'}`}
            >
              Statistics
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar; 