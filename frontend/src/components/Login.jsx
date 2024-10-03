import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLoginClick = () => {
        alert("Login Successful!")
        console.log(email,password);
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
                    Login
                </Button>
            </Form>
        </div>
    )
}

export default Login
