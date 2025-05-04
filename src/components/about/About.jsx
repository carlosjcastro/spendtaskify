import React from "react";

export function About() {
    return (
      <section id="about" className="bg-[#0d1b2a] text-[#ffffff] px-8 md:px-20 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl md:text-5xl font-bold mb-6">About SpendTaskify</h3>
          <p className="text-lg text-[#B7E4C7]">
          SpendTaskify is your personal finance companion. We help you stay on track with daily spending, budget your income, and reach your financial goals. With simplicity, security, and smart tools, you take control of your finances—every day.
          </p>
        </div>
      </section>
    );
  }