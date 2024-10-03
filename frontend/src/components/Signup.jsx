import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTimes } from 'react-icons/fa';

export default function Signup() {
    
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [pic, setPic] = useState('')
    const [loading, setLoading] = useState(false)

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
    const handleSignUpClick = () => {
        setLoading(true);
        if(!name || !email || !password || !confirmPassword) {
            toast.warn('Please Enter All the Fields!',{pauseOnHover: false})
        }
        if(password !== confirmPassword) {
            toast.error('Passoword mismatch!', {pauseOnHover: false})
        }
        

        
    }
    return (
        <div>
            <Form>
                <Form.Control type="text" placeholder="Enter Your Name" className='mb-3' required 
                onChange={ (e) => setName(e.target.value) }/>

                <Form.Control type="email" placeholder="Enter Your Email Address" className='mb-3' required
                onChange={ (e) => setEmail(e.target.value) }/>

                <Form.Control type="text" placeholder="Password" className='mb-3' required
                onChange={ (e) => setPassword(e.target.value) }/>

                <Form.Control type="text" placeholder="Confirm Password" className='mb-3' required
                onChange={ (e) => setConfirmPassword(e.target.value) }/>

                <Form.Label>Upload Your Profile Photo</Form.Label>
                <Form.Control type="file" placeholder="Upload Your Profile Photo" id='fileInput' className='mb-3 h-25'
                onChange={ (e) => handleFileChange(e) }/>
                {pic && (
                        <Button
                            variant="link"
                            className="position-absolute end-0 top-0 translate-middle"
                            onClick={handleRemoveFile}
                            style={{ zIndex: 1, background: 'white', border: 'none' }}
                        >
                            <FaTimes />
                        </Button>
                    )}

                <Button variant="danger" onClick={handleSignUpClick} className="w-100 mb-3">
                    {loading? "Loading..." : "Signup"}
                </Button>
                
                <ToastContainer position="bottom-center" autoClose={4000} hideProgressBar={false} />

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
        console.log('upload started...');
        console.log('api : ',cloudinaryAPI);
            
        const response = await fetch(cloudinaryAPI,{
            method: 'POST',
            body: formData
        })
        const result = await response.json()
        console.log('...upload finished');
        return result.secure_url;
    } catch (error) {
        console.log('Error in uploading image : ',error);
    }
}


