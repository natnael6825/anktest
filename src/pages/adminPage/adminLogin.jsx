import { adminLogin } from '@/services/adminService';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Helper to set a cookie with an optional expiration in days
const setCookie = (name, value, days) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call the adminLogin service function
      const result = await adminLogin(email, password);
      // Assuming the token is returned in result.token
      if (result.token) {
        // Save the token in a cookie (expires in 1 day)
        setCookie("token", result.token, 1);
        // Set userRole in localStorage to admin
        localStorage.setItem("userRole", "admin");
        // Redirect to admin dashboard
        navigate("/4z9gH7rT2bQ8jW5xK3mN0vP6dL1sA8fR");
      } else {
        alert("Login failed: No token received");
      }
    } catch (error) {
      console.error("Error logging in admin", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email
          </label>
          <input 
            type="email" 
            id="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Password
          </label>
          <input 
            type="password" 
            id="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Enter your password"
            required
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-600/50 transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
