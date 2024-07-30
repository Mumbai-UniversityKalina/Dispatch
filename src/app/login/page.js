// components/LoginComponent.js
"use client"
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

const LoginComponent = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [routeCode, setRouteCode] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (name && routeCode) {
      localStorage.setItem('name', name);
      localStorage.setItem('routeCode', routeCode);
     
      router.push('/volunteer');

    } else {
      toast.error('Please enter both name and route code');
    }
  };

  return (
    <div className="flex flex-col space-y-4 items-center mb-4">
      <ToastContainer />
      <input
        type="text"
        className="border p-2 rounded text-center"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter Your Name"
      />
      <input
        type="number"
        className="border p-2 rounded text-center"
        value={routeCode}
        onChange={(e) => setRouteCode(e.target.value)}
        placeholder="Enter Route Code"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white p-2 rounded flex justify-center items-center text-center w-full mx-auto md:w-auto"
      >
        <FaSearch className="mr-2" /> Login
      </button>
    </div>
  );
};

export default LoginComponent;
