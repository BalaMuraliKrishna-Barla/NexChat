// frontend/src/components/Authentication/Login.jsx
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/api'; 
import { LoaderCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!email || !password) {
      toast.warning("Please fill all the fields!");
      setLoading(false);
      return;
    }
    try {
      const { data } = await loginUser(email, password);
      toast.success("Login success!");
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/chats');
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <input
        id="email-login"
        type="email"
        placeholder="Email Address"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border-2 border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
      />
      <input
        id="password-login"
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border-2 border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center items-center gap-2 py-2.5 px-4 bg-brand-primary text-white font-semibold rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary dark:focus:ring-offset-slate-800 disabled:opacity-50"
      >
        {loading && <LoaderCircle size={18} className="animate-spin" />}
        {loading ? "Logging in..." : "Login"}
      </button>
      <ToastContainer 
      position="bottom-center"
      autoClose={1000}
      hideProgressBar={true}
      closeOnClick={true}
      pauseOnHover={false}
      theme="colored"
      />
    </form>
  );
};

export default Login;