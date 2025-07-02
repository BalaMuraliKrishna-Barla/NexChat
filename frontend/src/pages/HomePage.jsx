// frontend/src/pages/HomePage.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Signup from '../components/Authentication/Signup';
import Login from '../components/Authentication/Login';

const HomePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');

  useEffect(() => {
    const user = localStorage.getItem("userInfo");
    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  const tabButtonClasses = (tabName) => 
    `w-full py-2.5 text-sm font-medium leading-5 rounded-lg focus:outline-none transition-all duration-300 ${
      activeTab === tabName
        ? 'bg-blue-600 text-white shadow'
        : 'text-gray-700 hover:bg-gray-200'
    }`;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 sm:p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600">NexChat</h1>
          <p className="mt-2 text-gray-500">Connect and chat in real-time.</p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
          <div className="flex p-1 space-x-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setActiveTab('login')}
              className={tabButtonClasses('login')}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={tabButtonClasses('signup')}
            >
              Signup
            </button>
          </div>
          <div className="mt-4">
            {activeTab === 'login' ? <Login /> : <Signup />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;