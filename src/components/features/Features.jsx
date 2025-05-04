import React from "react";
import { HiOutlineCalendar, HiOutlineChartBar, HiOutlineTrendingUp, HiOutlineCreditCard, HiOutlineShieldCheck, HiOutlineBell } from 'react-icons/hi';

export default function Features() {
  return (
    <section id="features" className="bg-[#0d1b2a] text-[#D8F3DC] px-8 md:px-20 py-20">
      <div className="max-w-6xl mx-auto text-center">
        <h3 className="text-3xl md:text-5xl font-bold mb-12">Powerful Features</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-[#2D6A4F] border-2 border-[#B7E4C7] p-6 rounded-2xl">
            <HiOutlineCalendar className="text-4xl text-[#95D5B2] mb-4 mx-auto" />
            <h4 className="text-xl font-semibold mb-2">Daily Tracker</h4>
            <p className="text-[#B7E4C7]">Log your daily expenses easily and keep track of your spending habits.</p>
          </div>
          <div className="bg-[#2D6A4F] border-2 border-[#B7E4C7] p-6 rounded-2xl">
            <HiOutlineChartBar className="text-4xl text-[#95D5B2] mb-4 mx-auto" />
            <h4 className="text-xl font-semibold mb-2">Monthly Overview</h4>
            <p className="text-[#B7E4C7]">View your monthly expenses and incomes in a clean, organized dashboard.</p>
          </div>
          <div className="bg-[#2D6A4F] border-2 border-[#B7E4C7] p-6 rounded-2xl">
            <HiOutlineTrendingUp className="text-4xl text-[#95D5B2] mb-4 mx-auto" />
            <h4 className="text-xl font-semibold mb-2">Annual Summary</h4>
            <p className="text-[#B7E4C7]">Track your financial progress year over year and reach your savings goals.</p>
          </div>
          <div className="bg-[#2D6A4F] border-2 border-[#B7E4C7] p-6 rounded-2xl">
            <HiOutlineCreditCard className="text-4xl text-[#95D5B2] mb-4 mx-auto" />
            <h4 className="text-xl font-semibold mb-2">Smart Payments</h4>
            <p className="text-[#B7E4C7]">Manage and schedule your recurring payments with ease and confidence.</p>
          </div>
          <div className="bg-[#2D6A4F] border-2 border-[#B7E4C7] p-6 rounded-2xl">
            <HiOutlineShieldCheck className="text-4xl text-[#95D5B2] mb-4 mx-auto" />
            <h4 className="text-xl font-semibold mb-2">Secure Data</h4>
            <p className="text-[#B7E4C7]">We prioritize your data privacy with secure encryption and protection protocols.</p>
          </div>
          <div className="bg-[#2D6A4F] border-2 border-[#B7E4C7] p-6 rounded-2xl">
            <HiOutlineBell className="text-4xl text-[#95D5B2] mb-4 mx-auto" />
            <h4 className="text-xl font-semibold mb-2">Spending Alerts</h4>
            <p className="text-[#B7E4C7]">Stay on top of your budget with real-time alerts for unusual or excess spending.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
