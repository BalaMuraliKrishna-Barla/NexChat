import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrash } from 'react-icons/fa';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
// import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/api';


const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Chat-App');
    
    const cloudinaryAPI = "https://api.cloudinary.com/v1_1/dr8gzltrw/image/upload";

    try {
        const response = await fetch(cloudinaryAPI, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        return result.secure_url;
    } catch (error) {
        console.log('Error in uploading image : ', error);
    }
};

export default function Signup() {
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pic, setPic] = useState('');
    const [loading, setLoading] = useState(false);
    const [showRemoveFile, setShowRemoveFile] = useState(false);
    
    const navigate = useNavigate();

    const handleFileChange = async (e) => {
        setLoading(true);
        if (e.target.files[0]) {
            const uploadedImageURL = await uploadImage(e.target.files[0]);
            if (uploadedImageURL) {
                setPic(uploadedImageURL);
                toast.success('Photo uploaded!', { pauseOnHover: false });
                setShowRemoveFile(true);
            } else {
                toast.error('Failed to upload!', { pauseOnHover: false });
            }
        }
        setLoading(false);
    };

    const handleRemoveFile = () => {
        setPic('');
        document.getElementById('fileInput').value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!name || !email || !password || !confirmPassword) {
            toast.warn('Please Enter All the Fields!', { pauseOnHover: false });
            setLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            toast.error('Password mismatch!', { pauseOnHover: false });
            setLoading(false);
            return;
        }
        const defaultPic = "https://res.cloudinary.com/dr8gzltrw/image/upload/v1726236560/defaultDP_ou3qvs.jpg";
        const profilePic = pic || defaultPic;
        
        try {
            const { data } = await registerUser({ name, email, password, pic: profilePic });
             
            const msg = data.message;
            if (msg === 'Registration success!') {
                toast.success(msg, { pauseOnHover: false });
                setTimeout(() => {
                    navigate('/chats');
                }, 4000);
                localStorage.setItem("userInfo", JSON.stringify(data));
            } else {
                toast.error(msg, { pauseOnHover: false });
            }
        } catch (error) {
            toast.error(error.message, { pauseOnHover: false });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Control type="text" placeholder="Enter Your Name" className='mb-3' required onChange={(e) => setName(e.target.value)} />
                <Form.Control type="email" placeholder="Enter Your Email Address" className='mb-3' required onChange={(e) => setEmail(e.target.value)} />
                
                <div style={{ position: 'relative' }}>
                    <Form.Control type={showPassword ? 'text' : 'password'} placeholder="Password" className='mb-3' required onChange={(e) => setPassword(e.target.value)} />
                    <Button variant="link" onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'grey' }}>
                        {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                    </Button>
                </div>
                
                <div style={{ position: 'relative' }}>
                    <Form.Control type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" className='mb-3' required onChange={(e) => setConfirmPassword(e.target.value)} />
                    <Button variant="link" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'grey' }}>
                        {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                    </Button>
                </div>

                <Form.Label>Upload Your Profile Photo</Form.Label>
                <div style={{ position: 'relative' }}>
                    <Form.Control type="file" id='fileInput' className='mb-3 h-25' onChange={handleFileChange} />
                    {showRemoveFile && (
                        <Button variant="link" className="position-absolute end-0 top-0" onClick={handleRemoveFile} 
                            style={{ zIndex: 1, border: 'none', color: 'black', backgroundColor: 'transparent', padding: '0', transform: 'translate(-60%, 20%)' }}>
                            <FaTrash />
                        </Button>
                    )}
                </div>
                
                <Button variant="danger" type='submit' className="w-100 mb-3">{loading ? "Loading..." : "Signup"}</Button>
                <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar={false} />
            </Form>
        </div>
    );
}
