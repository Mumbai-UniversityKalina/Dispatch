"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slab } from 'react-loading-indicators';
import { FaSearch } from 'react-icons/fa';
import Header from '@/components/header';
import Footer from '@/components/footer';
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://mucollegdb.pockethost.io');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default function Home() {
  const [dispatchData, setDispatchData] = useState([]);
  const [collegesData, setCollegesData] = useState({});
  const [routeCode, setRouteCode] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingColleges, setLoadingColleges] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    const storedRouteCode = localStorage.getItem('routeCode');
    if (storedName && storedRouteCode) {
      setName(storedName);
      setRouteCode(storedRouteCode);
      setIsLoggedIn(true);
      fetchColleges(storedRouteCode);
    }
  }, []);

  const fetchColleges = async (routeCode) => {
    console.log('Fetching colleges data...');
    setLoadingColleges(true);
    try {
      let allColleges = [];
      let page = 1;
      let morePages = true;

      while (morePages) {
        const response = await pb.collection('colleges').getList(page, 30, {
          filter: `route_code="${routeCode}"`,
        });
        if (response.items.length > 0) {
          allColleges = [...allColleges, ...response.items];
          morePages = response.totalPages > page;
          page++;

          if (page % 5 === 0) {  // Batch of 5 pages
            await delay(4000);  // Delay for 4 seconds
          }
        } else {
          morePages = false;
        }
      }

      const collegesMap = {};
      allColleges.forEach(college => {
        collegesMap[college.id] = college;
      });
      setCollegesData(collegesMap);
      console.log('Colleges data:', collegesMap);
      fetchDispatchData(allColleges.map(college => college.id));
    } catch (error) {
      toast.error('Error fetching colleges data');
      console.error('Error fetching colleges data', error);
    } finally {
      setLoadingColleges(false);
    }
  };

  const fetchDispatchData = async (collegeIds) => {
    console.log('Fetching dispatch data...');
    setLoading(true);
    let allDispatchData = [];
    try {
      for (let i = 0; i < collegeIds.length; i++) {
        const collegeId = collegeIds[i];
        const response = await pb.collection('dispatch').getList(1, 50, {
          filter: `status="Pending" && college="${collegeId}"`,
        });
        if (response.items.length > 0) {
          allDispatchData = [...allDispatchData, ...response.items];
        } else {
          console.log(`No pending dispatch data for college ID: ${collegeId}`);
        }
        if (i % 5 === 0) {  // Delay after every 5 requests
          await delay(4000);  // Delay for 4 seconds
        }
      }
      setDispatchData(allDispatchData);
      toast.success('Dispatch data fetched successfully');
    } catch (error) {
      toast.error('Error fetching dispatch data');
      console.error('Error fetching dispatch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    if (name && routeCode) {
      localStorage.setItem('name', name);
      localStorage.setItem('routeCode', routeCode);
      setIsLoggedIn(true);
      fetchColleges(routeCode);
    } else {
      toast.error('Please enter both name and route code');
    }
  };

  const handlePickUp = (record) => {
    console.log('Pickup button clicked', record);
    setCurrentRecord(record);
    setShowModal(true);
  };

  const handleUpdateStatus = async () => {
    console.log('Updating dispatch status...');
    try {
      const response = await pb.collection('dispatch').update(currentRecord.id, {
        status: 'complete',
        name,
      });
      if (response) {
        fetchDispatchData(Object.keys(collegesData)); // Refresh data after updating status
        setShowModal(false);
        setCurrentRecord(null);
        toast.success('Dispatch status updated successfully');
      }
    } catch (error) {
      toast.error('Error updating dispatch status');
      console.error('Error updating dispatch status', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto flex flex-col items-center p-4">
        <ToastContainer />
        {!isLoggedIn ? (
          <div className="flex flex-col space-y-4 items-center mb-4">
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
        ) : (
          <>
            {loading || loadingColleges ? (
              <div className="flex flex-col items-center">
                <Slab color="#32cd32" size="medium" text="" textColor="" />
                <p className="mt-2">Loading...</p>
              </div>
            ) : (
              <>
                {dispatchData.length === 0 ? (
                  <div className="text-center text-gray-500">No pending dispatches for your route code.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dispatchData.map(record => (
                      <div key={record.id} className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold mb-2">{collegesData[record.college]?.name}</h2>
                        <p><strong>College Code:</strong> {collegesData[record.college]?.college_id}</p>
                        <p><strong>Route Code:</strong> {collegesData[record.college]?.route_code}</p>
                        <p><strong>Route Name:</strong> {collegesData[record.college]?.route_name}</p>
                        <p><strong>Exam Date:</strong> {record.exam_date}</p>
                        <button
                          className="mt-4 bg-blue-500 text-white py-1 px-3 rounded"
                          onClick={() => handlePickUp(record)}
                        >
                          Pickedup
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            {showModal && (
              <div className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                  <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                  </div>
                  <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                  <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                          <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Pickedup
                          </h3>
                          <div className="mt-2">
                            <input
                              type="text"
                              className="border p-2 w-full rounded"
                              placeholder="Enter your name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={handleUpdateStatus}
                      >
                        Submit
                      </button>
                      <button
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
