// components/AddStaff.js
import { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const AddStaff = ({ onAdd }) => {
  const [staffName, setStaffName] = useState('');
  const [contactNo, setContactNo] = useState('');

  const handleAddStaff = async () => {
    const data = {
      staff_name: staffName,
      contact_no: Number(contactNo),
    };

    try {
      const response = await axios.post(`${BASE_URL}/api/collections/dispatchstaff/records`, data, { headers: HEADERS });
      if (response.status === 200 || response.status === 201) {
        toast.success('Staff added successfully');
        onAdd(response.data); // Call the onAdd function to update the parent component's state
        setStaffName('');
        setContactNo('');
      } else {
        toast.error('Failed to add staff');
      }
    } catch (error) {
      console.error('Error adding staff:', error);
      toast.error('Error adding staff');
    }
  };

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Add New Staff</h2>
      <div className="mb-4">
        <label className="block mb-2">Staff Name</label>
        <input
          type="text"
          value={staffName}
          onChange={(e) => setStaffName(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Staff Name"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Contact Number</label>
        <input
          type="number"
          value={contactNo}
          onChange={(e) => setContactNo(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Contact Number"
        />
      </div>
      <button
        onClick={handleAddStaff}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Add Staff
      </button>
      <ToastContainer />
    </div>
  );
};

export default AddStaff;
