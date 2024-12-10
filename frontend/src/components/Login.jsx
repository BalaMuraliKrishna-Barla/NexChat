import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const handleLoginClick = async () => {
        setLoading(true);
        if(!email || !password) {
            toast.warning("Please fill all the fields!", {pauseOnHover: false})
            setLoading(false);
            return;
        }
        // API call to login
        try {
            const res = await axios.post("/api/user/login", {email, password})
            console.log(res.data);
            
            const msg = res?.data?.message;
            console.log(msg);
            
            if(msg === "Login success!") {
                toast.success(msg, { pauseOnHover: false });
                navigate('/chats')
            } else {
                console.log("Got an error");
                
                toast.error(msg, {pauseOnHover: false})
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error.message || "An error occurred";
            toast.error(errorMessage, { pauseOnHover: false });
        } finally {
            setLoading(false);
        }
    }
    return (
        <div>
            <Form>
                <Form.Control type="email" placeholder="Enter Your Email Address" className='mb-3' required
                onChange={ (e) => setEmail(e.target.value) } />

                <div style={{ position: 'relative' }}>
                    <Form.Control type={showPassword ? 'text' : 'password'} placeholder="Password" required
                    onChange={ (e) => setPassword(e.target.value) } />
                    
                    <Button variant="link" 
                    onClick={ () => setShowPassword(!showPassword) }
                    style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                    }}
                    >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </Button>
                </div>

                <Button variant="primary" onClick={handleLoginClick} className="w-100 mt-3 mb-3">
                    {loading? "Loading..." : "Login"}
                </Button>

                <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar={false} />
            </Form>
        </div>
    )
}

export default Login
