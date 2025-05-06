import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { FaUserAlt } from "react-icons/fa";
import { FormHelperText } from "@mui/material";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submissionError, setSubmissionError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const lastSent = localStorage.getItem("lastResetEmail");
    if (lastSent && Date.now() - parseInt(lastSent) < 60000) {
      setSubmissionError("Please wait before requesting another reset email.");
    }
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setSubmissionError("");
    setEmailError("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    const lastSent = localStorage.getItem("lastResetEmail");
    if (lastSent && Date.now() - parseInt(lastSent) < 60000) {
      setSubmissionError(
        "Please wait a minute before sending another reset email."
      );
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://spendtaskify.netlify.app/login",
    });

    if (error) {
      setSubmissionError(error.message);
      setLoading(false);
    } else {
      localStorage.setItem("lastResetEmail", Date.now().toString());
      setSuccessMessage("Password reset link sent! Redirecting...");
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

        {/* Submission error */}
        {submissionError && (
          <div className="text-sm text-[#ef233c] text-center mb-4">
            {submissionError}
          </div>
        )}

        {/* Success message */}
        {successMessage && (
          <div className="text-sm text-[#B7E4C7] text-center mb-4">
            {successMessage}
          </div>
        )}

        {/* Email input */}
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm mb-2">
            Email
          </label>
          <div
            className={`${inputWrapperStyles} ${
              emailError ? "border-[#ef233c]" : "border-[#95D5B2]"
            } focus-within:ring-[#52B788]`}
          >
            <FaUserAlt className="text-[#95D5B2] mr-3" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputStyles}
              placeholder="Enter your email"
              maxLength={100}
            />
          </div>
          {emailError && (
            <FormHelperText style={{ color: "#ef233c", marginLeft: "0.25rem" }}>
              {emailError}
            </FormHelperText>
          )}
        </div>

        {/* Submit button */}
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
