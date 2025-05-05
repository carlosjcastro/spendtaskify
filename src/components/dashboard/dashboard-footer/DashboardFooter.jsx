import React from "react";
import { AiOutlineLinkedin } from "react-icons/ai";

export default function Footer() {
  return (
    <footer className="bg-[#0d1b2a] text-[#B7E4C7] px-8 md:px-20 py-10 text-center">
      <p>
        &copy; {new Date().getFullYear()} SpendTaskify. All rights reserved.
      </p>
      <p>
        Developed by{" "}
        <a
          href="https://carlosjcastrog.netlify.app"
          rel="noopener noreferrer"
          target="_blank"
          className="underline"
        >
          Carlos José Castro Galante
        </a>
      </p>
      <div className="mt-4 flex justify-center">
        <a
          href="https://www.linkedin.com/in/carlosjcastrog"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#B7E4C7] hover:text-[#52B788] transition duration-300 flex items-center"
        >
          <AiOutlineLinkedin size={30} className="mr-2" />
        </a>
      </div>
    </footer>
  );
}
