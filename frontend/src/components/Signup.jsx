import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrash } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function Signup() {
    
    const [name, setName] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [pic, setPic] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleFileChange = async(e) => {
        setLoading(true);
        if(e.target.files[0]) {
            const uploadedImageURL = await uploadImage(e.target.files[0]);
            if(uploadedImageURL) {
                setPic(uploadedImageURL)
                toast.success('Photo uploaded!',{pauseOnHover:false});
            }
            else {
                toast.error('Failed to upload!',{pauseOnHover:false})
            }
        }
        setLoading(false);
    }

    const handleRemoveFile = () => {
        setPic('');
        document.getElementById('fileInput').value = '';
    }

    const handleSignUpClick = async() => {
        setLoading(true);
        if(!name || !email || !password || !confirmPassword) {
            toast.warn('Please Enter All the Fields!',{pauseOnHover: false})
            setLoading(false);
            return;
        }
        if(password !== confirmPassword) {
            toast.error('Passoword mismatch!', {pauseOnHover: false})
            setLoading(false)
            return;
        }
        
        if(!pic) {
            setPic("https://res.cloudinary.com/dr8gzltrw/image/upload/v1726236560/defaultDP_ou3qvs.jpg")
        }     
        console.log('pic : ',pic);

        try {
            const res = await axios.post("/api/user/signup", {name, email, password, pic})
            const msg = res.data.message;
            if(msg == 'Registration success!') {
                toast.success(msg, {pauseOnHover: false})
                // navigate('/chats')
                alert("signup sucesss!")
            }
            else toast.error(msg, {pauseOnHover: false})
        
        } catch (error) {
            toast.error(error.message, {pauseOnHover: false})
        } finally {
            setLoading(false);
        }

    }
    return (
        <div>
            <Form>
                {/* Username */}
                <Form.Control type="text" placeholder="Enter Your Name" className='mb-3' required 
                onChange={ (e) => setName(e.target.value) }/>

                {/* Email */}
                <Form.Control type="email" placeholder="Enter Your Email Address" className='mb-3' required
                onChange={ (e) => setEmail(e.target.value) }/>

                {/* Password */}
                <div style={{ position: 'relative' }}>
                    <Form.Control type={showPassword ? 'text' : 'password'} placeholder="Password" className='mb-3' required
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
                        color: 'grey'
                    }}
                    >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </Button>
                </div>

                {/* Confirm Password */}
                <div style={{ position: 'relative' }}>    
                    <Form.Control type={showPassword ? 'text' : 'password'} placeholder="Confirm Password" className='mb-3' required
                    onChange={ (e) => setConfirmPassword(e.target.value) } />
                    
                    <Button variant="link" 
                    onClick={ () => setShowConfirmPassword(!showConfirmPassword) }
                    style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: 'grey',
                    }}
                    >
                        <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                    </Button>

                </div>

                {/* Profile photo */}
                <Form.Label>Upload Your Profile Photo</Form.Label>
                <div style={{ position: 'relative' }}>
                    <Form.Control 
                        type="file" 
                        placeholder="Upload Your Profile Photo" 
                        id='fileInput' 
                        className='mb-3 h-25'
                        onChange={ (e) => handleFileChange(e) }
                    />
                    {pic && ( 
                        <Button
                            variant="link"
                            className="position-absolute end-0 top-0"
                            onClick={handleRemoveFile}
                            style={{
                                zIndex: 1,
                                border: 'none',
                                color: 'black',
                                backgroundColor: 'transparent',
                                padding: '0',
                                transform: 'translate(-60%, 20%)',
                            }}
                        >
                            <FaTrash />
                        </Button>
                    )}
                </div>


                {/* Signup Button */}
                <Button variant="danger" onClick={handleSignUpClick} className="w-100 mb-3">
                    {loading? "Loading..." : "Signup"}
                </Button>
                
                <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar={false} />

            </Form>
        </div>
    )
}

const uploadImage = async(file) => {
    const formData = new FormData();
    formData.append('file', file)
    formData.append('upload_preset', 'Chat-App')
    
    // const cloudinaryAPI = process.env.REACT_APP_CLOUDINARY_UPLOAD_API
    const cloudinaryAPI = "https://api.cloudinary.com/v1_1/dr8gzltrw/image/upload"

    try {
        // console.log('upload started...');
        // console.log('api : ',cloudinaryAPI);
            
        const response = await fetch(cloudinaryAPI,{
            method: 'POST',
            body: formData
        })
        const result = await response.json()
        // console.log('...upload finished');
        return result.secure_url;
    } catch (error) {
        console.log('Error in uploading image : ',error);
    }
}


