import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [userName, setUserName] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('staffName');
    if (user) {
      setUserName(user);
    }
  }, []);

  const handleLogin = () => {
    // Navigate to the login page or handle login logic
    router.push('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('name');
    setUserName(null);
    // Optionally navigate to a logout confirmation page or home page
    router.replace('/');
  };

  const handleAddStaff = () => {
    // Navigate to the add staff page or handle add staff logic
    router.push('/admin/upload'); // Adjust the path as needed
  };

  const handlehome = () => {

    router.push("/admin");
  }
 
  return (
    <header className="bg-blue-500 text-white p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <img
            src="http://www.mumresults.in/images/University-logo321.png"
            className="w-48"
            alt="University Logo"
          />
         
        </div>
        <div className="flex items-center space-x-4">
          {userName ? (
            <>
              <span className="mr-4">Welcome, {userName}</span>
              {userName === 'Admin' && (
                <button
                  onClick={handlehome}
                  className="bg-green-500 text-white py-2 px-4 rounded"
                >
                  Home
                </button>
                
              )}
              {userName === 'Admin' && (
                <button
                  onClick={handleAddStaff}
                  className="bg-yellow-500 text-white py-2 px-4 rounded"
                >
                  Add Staff
                </button>
                
              )}
              
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white py-2 px-4 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-green-500 text-white py-2 px-4 rounded"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
