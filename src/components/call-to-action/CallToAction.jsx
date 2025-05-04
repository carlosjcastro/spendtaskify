import React from "react";
import { Link } from "react-router-dom";

export default function CallToAction() {
    return (
      <section id="cta" className="bg-[#0d1b2a] text-white text-center px-8 md:px-20 py-16">
        <h3 className="text-3xl md:text-5xl font-bold mb-6">Start Managing Your Money Smarter</h3>
        <p className="text-lg text-[#D8F3DC] mb-8">Download NexFund and take control of your finances today.</p>
        <Link className="bg-[#52B788] border-2 border-[#B7E4C7] text-[#000000] px-8 py-4 rounded-2xl font-semibold hover:bg-[#40916C] transition-colors">Start Now</Link>
      </section>
    );
  }