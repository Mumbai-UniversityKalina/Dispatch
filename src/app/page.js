"use client";
import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Header from '@/components/header';
import Footer from '@/components/footer';

const BASE_URL = 'https://mucollegdb.pockethost.io/api/collections/dispatchstaff/records';

const LoginComponent = () => {
  const [isVolunteer, setIsVolunteer] = useState(true); // true for Volunteer login, false for Admin login
  const [routeCode, setRouteCode] = useState('');
  const [adminId, setAdminId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchStaffList();
  }, []);

  const fetchStaffList = async () => {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          perPage: 50,
          sort: 'staff_name',
        },
      });
      setStaffList(response.data.items);
    } catch (error) {
      toast.error('Error fetching staff list');
      console.error('Error fetching staff list:', error);
    }
  };

  const handleLogin = () => {
    if (isVolunteer) {
      if (selectedStaff && routeCode) {
        const selectedStaffData = staffList.find(staff => staff.id === selectedStaff);
        localStorage.setItem('staffId', selectedStaffData.id);
        localStorage.setItem('staffName', selectedStaffData.staff_name);
        localStorage.setItem('routeCode', routeCode);
        router.push('/volunteer'); // Adjust the path as needed
      } else {
        toast.error('Please select a staff and enter route code');
      }
    } else {
      if (adminId === 'admin' && adminPassword === 'admin123') {
        localStorage.setItem('name', 'Admin');
        router.push('/admin'); // Adjust the path as needed
      } else {
        toast.error('Invalid admin credentials');
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-col space-y-4 items-center mb-4">
        <ToastContainer />
        <div className="flex justify-between mb-4">
          <button
            onClick={() => setIsVolunteer(true)}
            className={`py-2 px-4 rounded ${isVolunteer ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Volunteer Login
          </button>
          <button
            onClick={() => setIsVolunteer(false)}
            className={`py-2 px-4 rounded ${!isVolunteer ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Admin Login
          </button>
        </div>
        {isVolunteer ? (
          <div>
            <select
              className="border p-2 rounded mb-2 w-full"
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
            >
              <option value="">Select Staff</option>
              {staffList.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.staff_name}
                </option>
              ))}
            </select>
            <input
              type="number"
              className="border p-2 rounded mb-2 w-full"
              value={routeCode}
              onChange={(e) => setRouteCode(e.target.value)}
              placeholder="Enter Route Code"
            />
          </div>
        ) : (
          <div>
            <input
              type="text"
              className="border p-2 rounded mb-2 w-full"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              placeholder="Admin ID"
            />
            <input
              type="password"
              className="border p-2 rounded mb-2 w-full"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
        )}
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white p-2 rounded flex justify-center items-center text-center w-full mx-auto md:w-auto"
        >
          <FaSearch className="mr-2" /> Login
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default LoginComponent;
