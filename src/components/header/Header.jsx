import React from 'react';
import { HiOutlineLogin } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="flex justify-between items-center px-8 py-6 bg-[#0d1b2a] text-white">
      <h1 className="text-2xl font-bold text-[#ffffff]">SpendTaskify</h1>

      <nav className="hidden md:flex space-x-6 text-[#95D5B2]">
        <Link to="#" className="hover:text-white transition-colors">How It Works</Link>
        <Link to="#" className="hover:text-white transition-colors">Blogs</Link>
        <Link to="#" className="hover:text-white transition-colors">Features</Link>
        <Link to="#" className="hover:text-white transition-colors">About Us</Link>
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
      </nav>

      <div className="flex space-x-4 items-center">
        <Link
          to="/login"
          className="text-[#95D5B2] hover:text-white flex items-center gap-1 transition-colors"
        >
          <HiOutlineLogin className="text-lg" /> Log In
        </Link>
        <Link
          to="/register"
          className="bg-[#52B788] px-4 py-2 rounded-xl text-[#081C15] font-semibold hover:bg-[#40916C] transition-colors"
        >
          Sign Up
        </Link>
      </div>
    </header>
  );
}
