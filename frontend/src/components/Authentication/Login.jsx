import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { toast, ToastContainer } from 'react-toastify';
// import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/api'; 

const Login = () => {
    
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!email || !password) {
            toast.warning("Please fill all the fields!", { pauseOnHover: false });
            setLoading(false);
            return;
        }
        try {
            // Use the service function
            const { data } = await loginUser(email, password);
            
            toast.success("Login success!", { pauseOnHover: false });
            
            // The data from the response is now in `data`
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/chats');

        } catch (error) {
            const errorMessage = error?.response?.data?.message || "An error occurred";
            toast.error(errorMessage, { pauseOnHover: false });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Form onSubmit={handleFormSubmit}>
                <Form.Control 
                    type="email" 
                    placeholder="Enter Your Email Address" 
                    className='mb-3' 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                />

                <div style={{ position: 'relative' }}>
                    <Form.Control 
                        type={showPassword ? 'text' : 'password'} 
                        placeholder="Password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    
                    <Button 
                        variant="link" 
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'transparent',
                            border: 'none',
                        }}
                    >
                        {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                    </Button>
                </div>

                <Button variant="primary" className="w-100 mt-3 mb-3" type='submit'>
                    {loading ? "Loading..." : "Login"}
                </Button>

                <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar={false} />
            </Form>

            <button className='btn btn-success mb-3'
            onClick={
                () => {
                    setEmail("pavan@example.com")
                    setPassword("pavan")
                }
            }>
                Quick Login
            </button>
        </div>
    );
};

export default Login;
