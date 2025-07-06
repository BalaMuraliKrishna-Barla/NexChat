// frontend/src/components/Authentication/Auth.jsx
// This file was previously HomePage.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../../Context/ChatProvider';
import Login from './Login';
import Signup from './Signup';
const Auth = ({ initialTab = 'login', authTheme }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const navigate = useNavigate();
  const { setTheme } = ChatState();

  const handleAuthSuccess = (userData) => {
    setTheme(authTheme); 
    localStorage.setItem('userInfo', JSON.stringify(userData));
    navigate('/chats');
  };

  const tabButtonClasses = (tabName) => 
    `w-full py-2.5 text-sm font-medium rounded-lg focus:outline-none transition-colors duration-200 ${
      activeTab === tabName 
        ? 'bg-indigo-600 text-white shadow' 
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
    }`;

  return (
    <div className="w-full">
        <div className="flex p-1 mb-4 space-x-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
            <button onClick={() => setActiveTab('login')} className={tabButtonClasses('login')}>
                Login
            </button>
            <button onClick={() => setActiveTab('signup')} className={tabButtonClasses('signup')}>
                Signup
            </button>
        </div>
        <div>
            {activeTab === 'login' ? <Login onAuthSuccess={handleAuthSuccess} /> : <Signup onAuthSuccess={handleAuthSuccess} />}
        </div>
    </div>
  );
};

export default Auth;