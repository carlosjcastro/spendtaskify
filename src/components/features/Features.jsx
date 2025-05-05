import React from "react";
import { HiOutlineCalendar, HiOutlineChartBar, HiOutlineTrendingUp, HiOutlineCreditCard, HiOutlineShieldCheck, HiOutlineBell } from 'react-icons/hi';

export default function Features() {
  return (
    <section id="features" className="bg-[#0d1b2a] text-[#D8F3DC] px-8 md:px-20 py-20">
      <div className="max-w-6xl mx-auto text-center">
        <h3 className="text-3xl md:text-5xl font-bold mb-12">Powerful Features</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="border-2 border-[#B7E4C7] p-6 rounded-2xl">
            <HiOutlineCalendar className="text-4xl text-[#95D5B2] mb-4 mx-auto" />
            <h4 className="text-xl font-semibold mb-2">Daily Tracker</h4>
            <p className="text-[#B7E4C7]">Easily log your daily expenses and keep track of your spending habits to stay within your budget.</p>
          </div>
          <div className="border-2 border-[#B7E4C7] p-6 rounded-2xl">
            <HiOutlineChartBar className="text-4xl text-[#95D5B2] mb-4 mx-auto" />
            <h4 className="text-xl font-semibold mb-2">Monthly Overview</h4>
            <p className="text-[#B7E4C7]">Get a comprehensive view of your monthly expenses and income, all in one easy-to-read dashboard.</p>
          </div>
          <div className="border-2 border-[#B7E4C7] p-6 rounded-2xl">
            <HiOutlineTrendingUp className="text-4xl text-[#95D5B2] mb-4 mx-auto" />
            <h4 className="text-xl font-semibold mb-2">Annual Summary</h4>
            <p className="text-[#B7E4C7]">Track your financial progress over the year, and set and monitor your savings goals to stay on track.</p>
          </div>
          <div className="border-2 border-[#B7E4C7] p-6 rounded-2xl">
            <HiOutlineCreditCard className="text-4xl text-[#95D5B2] mb-4 mx-auto" />
            <h4 className="text-xl font-semibold mb-2">Smart Payments</h4>
            <p className="text-[#B7E4C7]">Manage your recurring payments and set schedules to stay on top of your financial obligations effortlessly.</p>
          </div>
          <div className="border-2 border-[#B7E4C7] p-6 rounded-2xl">
            <HiOutlineShieldCheck className="text-4xl text-[#95D5B2] mb-4 mx-auto" />
            <h4 className="text-xl font-semibold mb-2">Secure Data</h4>
            <p className="text-[#B7E4C7]">Your data is our priority. We use top-notch encryption and protection protocols to ensure your information is safe.</p>
          </div>
          <div className="border-2 border-[#B7E4C7] p-6 rounded-2xl">
            <HiOutlineBell className="text-4xl text-[#95D5B2] mb-4 mx-auto" />
            <h4 className="text-xl font-semibold mb-2">Spending Alerts</h4>
            <p className="text-[#B7E4C7]">Stay informed with real-time alerts for unusual or excessive spending, helping you stay within budget.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
