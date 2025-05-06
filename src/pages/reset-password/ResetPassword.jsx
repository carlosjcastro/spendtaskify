import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { FaUserAlt } from "react-icons/fa";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const lastSent = localStorage.getItem("lastResetEmail");
    if (lastSent && Date.now() - parseInt(lastSent) < 60000) {
      setError("Please wait before requesting another reset email.");
    }
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(true);
      setError("Please enter a valid email address.");
      return;
    } else {
      setEmailError(false);
    }

    const lastSent = localStorage.getItem("lastResetEmail");
    if (lastSent && Date.now() - parseInt(lastSent) < 60000) {
      setError("Please wait a minute before sending another reset email.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://spendtaskify.netlify.app/login",
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      localStorage.setItem("lastResetEmail", Date.now().toString());
      setMessage("Password reset link sent! Redirecting...");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  };

  const inputWrapperStyles =
    "flex items-center border rounded-2xl px-4 py-3 bg-transparent focus-within:ring-2 transition-all text-white";
  const inputStyles =
    "flex-1 bg-transparent outline-none text-white placeholder-white";

  return (
    <div className="min-h-screen bg-[#0d1b2a] flex items-center justify-center px-4">
      <form
        onSubmit={handleReset}
        className="w-full max-w-md p-8 rounded-2xl text-[#ffffff]"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>

        {message && (
          <div className="text-[#B7E4C7] mb-4 text-center">{message}</div>
        )}
        {error && (
          <div className="text-[#ef233c] mb-4 text-center">{error}</div>
        )}

        <label htmlFor="email" className="block text-sm mb-2">
          Email
        </label>
        <div
          className={`${inputWrapperStyles} ${
            emailError
              ? "border-[#ef233c] focus-within:ring-[#ef233c]"
              : "border-[#95D5B2] focus-within:ring-[#52B788]"
          } mb-6`}
        >
          <FaUserAlt className="text-[#95D5B2] mr-3" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputStyles}
            placeholder="Enter your email"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-full font-semibold transition-colors cursor-pointer ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#52B788] text-[#081C15] hover:bg-[#40916C]"
          }`}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}
