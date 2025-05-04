import React from "react";

export function Footer() {
    return (
      <footer className="bg-[#0d1b2a] text-[#B7E4C7] px-8 md:px-20 py-10 text-center">
        <p>&copy; {new Date().getFullYear()} SpendTaskify. All rights reserved. Developed by <a href="https://carlosjcastrog.netlify.app" rel="noopener noreferrer" target="_blank">Carlos José Castro Galante</a></p>
      </footer>
    );
  }