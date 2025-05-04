import React from "react";
import { Link } from "react-router-dom";

export default function CallToAction() {
    return (
      <section id="cta" className="bg-[#0d1b2a] text-white text-center px-8 md:px-20 py-16">
        <h3 className="text-3xl md:text-5xl font-bold mb-6">Take Control of Your Finances and Tasks</h3>
        <p className="text-lg text-[#D8F3DC] mb-8">Start organizing your daily tasks and managing your money smarter with SpendTaskify. Get started today and reach your financial goals!</p>
        <Link to="/signup" className="bg-[#52B788] border-2 border-[#B7E4C7] text-[#000000] px-8 py-4 rounded-2xl font-semibold hover:bg-[#40916C] transition-colors">Get Started</Link>
      </section>
    );
}
