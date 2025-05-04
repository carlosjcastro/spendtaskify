import React, { useState, useRef } from 'react';
import { FormHelperText } from '@mui/material';
import { FaUserAlt, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient'

const commonPasswords = ['123456', 'password', '12345678', 'qwerty', 'abc123'];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [submissionError, setSubmissionError] = useState('');
  const lastSubmitTimeRef = useRef(0);
  const navigate = useNavigate();

  const sanitizeInput = (input) => input.replace(/[<>/"'`;]/g, '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const now = Date.now();
    const newErrors = {};
    setSuccessMessage('');
    setSubmissionError('');

    const sanitizedEmail = sanitizeInput(email.trim());
    const sanitizedPassword = sanitizeInput(password);

    if (now - lastSubmitTimeRef.current < 3000) {
      setSubmissionError('Please wait a few seconds before trying again.');
      return;
    }

    if (!sanitizedEmail) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(sanitizedEmail)) {
      newErrors.email = 'Invalid email format';
    } else if (sanitizedEmail.length > 100) {
      newErrors.email = 'Email too long';
    }

    if (!sanitizedPassword) {
      newErrors.password = 'Password is required';
    } else if (sanitizedPassword.length < 6) {
      newErrors.password = 'Minimum 6 characters required';
    } else if (sanitizedPassword.length > 64) {
      newErrors.password = 'Password too long';
    } else if (commonPasswords.includes(sanitizedPassword)) {
      newErrors.password = 'This password is too common. Please use a stronger one.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    // Intentar iniciar sesión con Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email: sanitizedEmail,
      password: sanitizedPassword,
    });

    if (error) {
      setSubmissionError(error.message);
    } else {
      lastSubmitTimeRef.current = now;
      setSuccessMessage('Logged in successfully!');
      setTimeout(() => navigate('/dashboard'), 1000); // Redirige al dashboard o a donde quieras
    }
  };

  const inputWrapperStyles =
    'flex items-center border rounded-2xl px-4 py-3 bg-transparent focus-within:ring-2 transition-all text-white';
  const inputStyles = 'flex-1 bg-transparent outline-none text-white placeholder-white';

  return (
    <div className="min-h-screen bg-[#0d1b2a] flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 rounded-2xl text-[#ffffff]">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#ffffff]">Welcome</h2>

        {/* Submission error */}
        {submissionError && (
          <div className="mb-4 text-sm text-[#FFB4A2] text-center">
            {submissionError}
          </div>
        )}

        {/* Success message */}
        {successMessage && (
          <div className="mb-4 text-sm text-[#B7E4C7] text-center">
            {successMessage}
          </div>
        )}

        {/* Email */}
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm mb-2">Email</label>
          <div className={`${inputWrapperStyles} ${errors.email ? 'border-[#FFB4A2]' : 'border-[#95D5B2]'} focus-within:ring-[#52B788]`}>
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
          {errors.email && (
            <FormHelperText style={{ color: '#FFB4A2', marginLeft: '0.25rem' }}>
              {errors.email}
            </FormHelperText>
          )}
        </div>

        {/* Password */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm mb-2">Password</label>
          <div className={`${inputWrapperStyles} ${errors.password ? 'border-[#FFB4A2]' : 'border-[#95D5B2]'} focus-within:ring-[#52B788]`}>
            <FaLock className="text-[#95D5B2] mr-3" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputStyles}
              placeholder="Enter your password"
              maxLength={64}
            />
          </div>
          {errors.password && (
            <FormHelperText style={{ color: '#FFB4A2', marginLeft: '0.25rem' }}>
              {errors.password}
            </FormHelperText>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-[#52B788] text-[#081C15] py-3 rounded-xl font-semibold hover:bg-[#40916C] transition-colors"
        >
          Log In
        </button> 

        {/* Register redirect */}
        <div className="text-sm text-center mt-6">
          <span className="text-[#ffffff]">Don't have an account? </span>
          <Link to="/register" className="text-[#95D5B2] hover:underline">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}
