"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '@/components/header';


const BASE_URL = "https://mucollegdb.pockethost.io";
const ENDPOINT_GET_STAFF = "/api/collections/dispatchstaff/records";
const HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN', // Ensure you replace this with your actual API token
};

const StaffManagement = () => {
    const [staffList, setStaffList] = useState([]);
    const [newStaff, setNewStaff] = useState({ staff_name: '', contact_no: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editStaffId, setEditStaffId] = useState(null);

    useEffect(() => {
        fetchStaffData();
    }, []);

    const fetchStaffData = async () => {
        try {
            const response = await axios.get(`${BASE_URL}${ENDPOINT_GET_STAFF}`, { headers: HEADERS });
            if (response.status === 200) {
                setStaffList(response.data.items);
            } else {
                toast.error('Failed to fetch staff data');
            }
        } catch (error) {
            console.error('Error fetching staff data:', error);
            toast.error('Error fetching staff data');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewStaff({ ...newStaff, [name]: value });
    };

    const handleAddStaff = async () => {
        try {
            const response = await axios.post(`${BASE_URL}${ENDPOINT_GET_STAFF}`, newStaff, { headers: HEADERS });
            if (response.status === 200 || response.status === 201) {
                toast.success('Staff added successfully');
                setStaffList([...staffList, response.data]);
                setNewStaff({ staff_name: '', contact_no: '' });
            } else {
                toast.error('Failed to add staff');
            }
        } catch (error) {
            console.error('Error adding staff:', error);
            toast.error('Error adding staff');
        }
    };

    const handleEditStaff = (staff) => {
        setNewStaff({ staff_name: staff.staff_name, contact_no: staff.contact_no });
        setIsEditing(true);
        setEditStaffId(staff.id);
    };

    const handleUpdateStaff = async () => {
        try {
            const response = await axios.patch(`${BASE_URL}${ENDPOINT_GET_STAFF}/${editStaffId}`, newStaff, { headers: HEADERS });
            if (response.status === 200) {
                toast.success('Staff updated successfully');
                const updatedList = staffList.map(staff => staff.id === editStaffId ? response.data : staff);
                setStaffList(updatedList);
                setNewStaff({ staff_name: '', contact_no: '' });
                setIsEditing(false);
                setEditStaffId(null);
            } else {
                toast.error('Failed to update staff');
            }
        } catch (error) {
            console.error('Error updating staff:', error);
            toast.error('Error updating staff');
        }
    };

    const handleDeleteStaff = async (staffId) => {
        try {
            const response = await axios.delete(`${BASE_URL}${ENDPOINT_GET_STAFF}/${staffId}`, { headers: HEADERS });
            if (response.status === 204) {
                toast.success('Staff deleted successfully');
                const filteredList = staffList.filter(staff => staff.id !== staffId);
                setStaffList(filteredList);
            } else {
                toast.error('Failed to delete staff');
            }
        } catch (error) {
            console.error('Error deleting staff:', error);
            toast.error('Error deleting staff');
        }
    };

    const handleCancelEdit = () => {
        setNewStaff({ staff_name: '', contact_no: '' });
        setIsEditing(false);
        setEditStaffId(null);
    };

    return (
      <>
       <Header />
        <div className="container mx-auto p-4">
         
            <ToastContainer />
            <h1 className="text-2xl font-bold mb-4">Staff Management</h1>
            <div className="p-4 border rounded shadow-md mb-4">
                <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Staff' : 'Add New Staff'}</h2>
                <div className="mb-4">
                    <label className="block mb-2">Staff Name</label>
                    <input
                        type="text"
                        name="staff_name"
                        value={newStaff.staff_name}
                        onChange={handleInputChange}
                        className="border p-2 rounded w-full"
                        placeholder="Staff Name"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Contact Number</label>
                    <input
                        type="number"
                        name="contact_no"
                        value={newStaff.contact_no}
                        onChange={handleInputChange}
                        className="border p-2 rounded w-full"
                        placeholder="Contact Number"
                    />
                </div>
                {isEditing ? (
                    <div className="flex space-x-2">
                        <button
                            onClick={handleUpdateStaff}
                            className="bg-blue-500 text-white py-2 px-4 rounded"
                        >
                            Update Staff
                        </button>
                        <button
                            onClick={handleCancelEdit}
                            className="bg-gray-500 text-white py-2 px-4 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleAddStaff}
                        className="bg-blue-500 text-white py-2 px-4 rounded"
                    >
                        Add Staff
                    </button>
                )}
            </div>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border">Staff Name</th>
                        <th className="py-2 px-4 border">Contact Number</th>
                        <th className="py-2 px-4 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {staffList.map(staff => (
                        <tr key={staff.id}>
                            <td className="py-2 px-4 border">{staff.staff_name}</td>
                            <td className="py-2 px-4 border">{staff.contact_no}</td>
                            <td className="py-2 px-4 border">
                                <button
                                    onClick={() => handleEditStaff(staff)}
                                    className="bg-yellow-500 text-white py-1 px-2 rounded mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteStaff(staff.id)}
                                    className="bg-red-500 text-white py-1 px-2 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
           
        </div>
        
         </>
    );
};

export default StaffManagement;
