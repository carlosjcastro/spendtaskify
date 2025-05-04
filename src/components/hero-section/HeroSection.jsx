import { motion } from 'framer-motion';
import React from 'react';

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
            Secure Your <span className="text-[#95D5B2]">Finances</span> with <br /> Confidence.
          </h2>
          <div className="h-2 w-44 bg-[#52B788] mt-4 rounded-full"></div>
          <p className="mt-6 text-[#B7E4C7] text-lg max-w-md">
            Learn smart strategies to budget, save, and grow your finances with clarity, control, and confidence.
          </p>
          <button className="mt-8 bg-[#52B788] hover:bg-[#40916C] text-[#081C15] px-6 py-3 rounded-full font-semibold transition-colors">Get Your App</button>
          <div className="flex items-center gap-2 mt-4">
            <img src="https://api.dicebear.com/6.x/thumbs/svg?seed=User1" className="w-8 h-8 rounded-full" />
            <img src="https://api.dicebear.com/6.x/thumbs/svg?seed=User2" className="w-8 h-8 rounded-full" />
            <img src="https://api.dicebear.com/6.x/thumbs/svg?seed=User3" className="w-8 h-8 rounded-full" />
            <span className="text-sm ml-2 text-[#95D5B2]">164k</span>
          </div>
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 text-center">
        <div className="bg-[#1B4332] border-2 border-[#B7E4C7] p-6 rounded-2xl transition-transform">
          <p className="text-2xl font-bold">8,507</p>
          <p className="text-[#B7E4C7]">Users</p>
        </div>
        <div className="bg-[#1B4332] border-2 border-[#B7E4C7] p-6 rounded-2xl transition-transform">
          <p className="text-2xl font-bold">690</p>
          <p className="text-[#B7E4C7]">Downloads</p>
        </div>
        <div className="bg-[#1B4332] border-2 border-[#B7E4C7] p-6 rounded-2xl transition-transform">
          <p className="text-2xl font-bold">875</p>
          <p className="text-[#B7E4C7]">Likes</p>
        </div>
        <div className="bg-[#1B4332] border-2 border-[#B7E4C7] p-6 rounded-2xl transition-transform">
          <p className="text-2xl font-bold">954</p>
          <p className="text-[#B7E4C7]">Ratings</p>
        </div>
      </div>
    </section>
  );
}
