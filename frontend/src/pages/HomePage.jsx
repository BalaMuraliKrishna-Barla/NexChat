// frontend/src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Signup from '../components/Authentication/Signup';
import Login from '../components/Authentication/Login';
import { MessageSquareText } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');

  useEffect(() => {
    const user = localStorage.getItem("userInfo");
    if (user) navigate("/chats");
  }, [navigate]);

  const tabButtonClasses = (tabName) => 
    `w-full py-2.5 text-sm font-medium leading-5 rounded-lg focus:outline-none transition-colors duration-200 ${
      activeTab === tabName
        ? 'bg-indigo-600 text-white shadow'
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
    }`;

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <MessageSquareText className="mx-auto h-12 w-12 text-indigo-600 dark:text-indigo-400" />
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white">NexChat</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">A new era of real-time connection.</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700">
          <div className="flex p-1 space-x-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
            <button onClick={() => setActiveTab('login')} className={tabButtonClasses('login')}>Login</button>
            <button onClick={() => setActiveTab('signup')} className={tabButtonClasses('signup')}>Signup</button>
          </div>
          <div className="mt-4 p-4">
            {activeTab === 'login' ? <Login /> : <Signup />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;