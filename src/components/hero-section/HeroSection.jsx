import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="bg-[#0d1b2a] text-white px-8 md:px-20 py-16">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center md:text-left"
        >
          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            Take Control of Your{" "}
            <span className="text-[#95D5B2]">Finances</span> and <br /> Stay on
            Top of Your <span className="text-[#95D5B2]">Tasks</span>.
          </h2>
          <div className="h-2 w-44 bg-[#52B788] mt-4 rounded-full"></div>
          <p className="mt-6 text-[#B7E4C7] text-lg max-w-md">
            Manage your income and expenses with ease while staying organized
            with your daily tasks. Budget smarter, save more, and achieve your
            goals.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="flex-1 flex justify-center"
        >
          {/* <img src={cardImg} alt="Credit Card" className="w-80 md:w-96 drop-shadow-2xl" /> */}
        </motion.div>
      </div>

      <div className="text-center mt-10">
        <Link
          to="/login"
          className="bg-[#52B788] hover:bg-[#40916C] text-[#081C15] px-6 py-3 rounded-full font-semibold transition-colors"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
}
