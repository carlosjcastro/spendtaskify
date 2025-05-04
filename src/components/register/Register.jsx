import React, { useState, useRef } from 'react';
import { FaUserAlt, FaLock } from 'react-icons/fa';
import { FormHelperText } from '@mui/material';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const commonPasswords = ['123456', 'password', '12345678', 'qwerty', 'abc123'];

const passwordStrength = (password) => {
  let strength = 0;
  const requirements = {
    hasUpperCase: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    length: password.length >= 8,
    longLength: password.length >= 12,
  };

  if (requirements.hasUpperCase) strength += 1;
  if (requirements.hasNumber) strength += 1;
  if (requirements.hasSpecialChar) strength += 1;
  if (requirements.length) strength += 1;
  if (requirements.longLength) strength += 1;

  return { strength, requirements };
};

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '', confirmPassword: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [submissionError, setSubmissionError] = useState('');
  const lastSubmitTimeRef = useRef(0);

  const sanitizeInput = (input) => input.replace(/[<>/"'`;]/g, '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const now = Date.now();
    const newErrors = {};
    setSuccessMessage('');
    setSubmissionError('');

    const sanitizedEmail = sanitizeInput(email.trim());
    const sanitizedPassword = sanitizeInput(password);
    const sanitizedConfirmPassword = sanitizeInput(confirmPassword);

    if (now - lastSubmitTimeRef.current < 3000) {
      setSubmissionError('Please wait a few seconds before trying again.');
      return;
    }

    // Email validation
    if (!sanitizedEmail) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(sanitizedEmail)) {
      newErrors.email = 'Invalid email format';
    } else if (sanitizedEmail.length > 100) {
      newErrors.email = 'Email too long';
    }

    // Password validation
    if (!sanitizedPassword) {
      newErrors.password = 'Password is required';
    } else if (sanitizedPassword.length < 6) {
      newErrors.password = 'Minimum 6 characters required';
    } else if (sanitizedPassword.length > 64) {
      newErrors.password = 'Password too long';
    } else if (commonPasswords.includes(sanitizedPassword)) {
      newErrors.password = 'This password is too common. Please use a stronger one.';
    } else {
      const { requirements } = passwordStrength(sanitizedPassword);
      if (!requirements.hasUpperCase || !requirements.hasNumber || !requirements.hasSpecialChar || !requirements.length) {
        newErrors.password = 'Password must include at least 1 uppercase letter, 1 number, 1 special character and be at least 8 characters.';
      }
    }

    // Confirm Password validation
    if (!sanitizedConfirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (sanitizedPassword !== sanitizedConfirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // ✅ Registro con Supabase
    const { data, error } = await supabase.auth.signUp({
      email: sanitizedEmail,
      password: sanitizedPassword,
    });

    if (error) {
      setSubmissionError(error.message);
    } else {
      setSuccessMessage('Account created successfully! Check your email to confirm.');
      lastSubmitTimeRef.current = now;
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }
  };

  const inputWrapperStyles =
    'flex items-center border rounded-2xl px-4 py-3 bg-transparent focus-within:ring-2 transition-all text-white';
  const inputStyles = 'flex-1 bg-transparent outline-none text-white placeholder-white';

  const { strength, requirements } = password ? passwordStrength(password) : { strength: 0, requirements: {} };
  const passwordStrengthLevel = strength <= 1 ? 'Weak' : strength === 2 ? 'Medium' : 'Strong';

  return (
    <div className="min-h-screen bg-[#0d1b2a] flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 rounded-2xl text-[#ffffff]">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#ffffff]">Create Account</h2>

        {submissionError && (
          <div className="mb-4 text-sm text-[#FFB4A2] text-center">{submissionError}</div>
        )}

        {successMessage && (
          <div className="mb-4 text-sm text-[#B7E4C7] text-center">{successMessage}</div>
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
            <FormHelperText style={{ color: '#FFB4A2', marginLeft: '0.25rem' }}>{errors.email}</FormHelperText>
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
            <FormHelperText style={{ color: '#FFB4A2', marginLeft: '0.25rem' }}>{errors.password}</FormHelperText>
          )}

          {password && (
            <div className="mt-2">
              <div className="text-sm mb-2">
                <span className={`text-${passwordStrengthLevel === 'Weak' ? 'red' : passwordStrengthLevel === 'Medium' ? 'yellow' : 'green'}-500`}>
                  {passwordStrengthLevel}
                </span>
              </div>
              <div className="h-2 bg-[#444] rounded-full">
                <div
                  className={`h-full rounded-full ${passwordStrengthLevel === 'Weak' ? 'bg-red-500' : passwordStrengthLevel === 'Medium' ? 'bg-yellow-500' : 'bg-[#74C69D]'}`}
                  style={{
                    width:
                      passwordStrengthLevel === 'Weak' ? '33%' :
                      passwordStrengthLevel === 'Medium' ? '66%' :
                      '100%',
                  }}
                />
              </div>
            </div>
          )}

          <ul className="mt-3 text-sm text-[#74C69D]">
            <li className={requirements.hasUpperCase ? 'text-[#74C69D]' : 'text-red-500'}>
              {requirements.hasUpperCase ? '✔️ At least one uppercase letter' : '❌ At least one uppercase letter'}
            </li>
            <li className={requirements.hasNumber ? 'text-[#74C69D]' : 'text-red-500'}>
              {requirements.hasNumber ? '✔️ At least one number' : '❌ At least one number'}
            </li>
            <li className={requirements.hasSpecialChar ? 'text-[#74C69D]' : 'text-red-500'}>
              {requirements.hasSpecialChar ? '✔️ At least one special character' : '❌ At least one special character'}
            </li>
            <li className={requirements.length ? 'text-[#74C69D]' : 'text-red-500'}>
              {requirements.length ? '✔️ At least 8 characters' : '❌ At least 8 characters'}
            </li>
            <li className={requirements.longLength ? 'text-[#74C69D]' : 'text-red-500'}>
              {requirements.longLength ? '✔️ At least 12 characters' : '❌ At least 12 characters'}
            </li>
          </ul>
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm mb-2">Confirm Password</label>
          <div className={`${inputWrapperStyles} ${errors.confirmPassword ? 'border-[#FFB4A2]' : 'border-[#95D5B2]'} focus-within:ring-[#52B788]`}>
            <FaLock className="text-[#95D5B2] mr-3" />
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputStyles}
              placeholder="Confirm your password"
              maxLength={64}
            />
          </div>
          {errors.confirmPassword && (
            <FormHelperText style={{ color: '#FFB4A2', marginLeft: '0.25rem' }}>{errors.confirmPassword}</FormHelperText>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#52B788] hover:bg-[#2a7d54] text-white py-2 px-4 rounded-2xl transition-all"
        >
          Register
        </button>
        <div className="text-sm text-center mt-6">
          <span className="text-[#ffffff]">Already have an account? </span>
          <Link to="/login" className="text-[#95D5B2] hover:underline">
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
}
