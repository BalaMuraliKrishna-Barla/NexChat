// frontend/src/components/Authentication/Signup.jsx

import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/api';
import { LoaderCircle, Eye, EyeOff } from 'lucide-react';

// This helper function can be moved to a utility file later
const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Chat-App'); // Your Cloudinary Upload Preset
    
    const cloudinaryAPI = "https://api.cloudinary.com/v1_1/dr8gzltrw/image/upload"; // Your Cloudinary URL

    const response = await fetch(cloudinaryAPI, {
        method: 'POST',
        body: formData
    });
    if (!response.ok) {
        throw new Error('Image upload failed');
    }
    const result = await response.json();
    return result.secure_url;
};


export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Store the actual file object for later upload
  const [picFile, setPicFile] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if(file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error("File is too large. Max size is 2MB.");
        return;
      }
      setPicFile(file);
      toast.info(`Selected file: ${file.name}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      toast.warn('Please fill all fields!');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      setLoading(false);
      return;
    }

    let profilePicUrl = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
    if (picFile) {
      try {
        toast.info("Uploading profile picture...");
        profilePicUrl = await uploadImage(picFile);
      } catch (error) {
        toast.error("Image upload failed. Please try again.");
        setLoading(false);
        return;
      }
    }
    
    try {
      const { data } = await registerUser({ name, email, password, pic: profilePicUrl });
      toast.success('Registration successful! Redirecting...');
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate('/chats');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input 
        type="text" 
        placeholder="Your Name" 
        required 
        onChange={(e) => setName(e.target.value)} 
        className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border-2 border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
      />
      <input 
        type="email" 
        placeholder="Email Address" 
        required 
        onChange={(e) => setEmail(e.target.value)} 
        className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border-2 border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
      />
      <div className="relative">
        <input 
          type={showPassword ? "text" : "password"} 
          placeholder="Password" 
          required 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border-2 border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
        />
        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      <div className="relative">
        <input 
          type={showConfirmPassword ? "text" : "password"} 
          placeholder="Confirm Password" 
          required 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border-2 border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
        />
        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Profile Photo (Optional)</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 dark:file:bg-indigo-900/50 file:text-indigo-700 dark:file:text-indigo-300 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-800/50"
        />
      </div>
      <button 
        type="submit" 
        disabled={loading} 
        className="w-full flex justify-center items-center gap-2 py-2.5 px-4 bg-brand-primary text-white font-semibold rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50"
      >
        {loading && <LoaderCircle size={18} className="animate-spin" />}
        {loading ? "Signing up..." : "Signup"}
      </button>
      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar={false} theme="colored" />
    </form>
  );
}