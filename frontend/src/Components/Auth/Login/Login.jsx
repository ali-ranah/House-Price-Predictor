import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosRequest from '../../AxiosRequest/AxiosRequest';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {faGoogle } from '@fortawesome/free-brands-svg-icons';
import img from '../../../../images/img.png';
import { Button, Input } from "@material-tailwind/react";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { setEmailAction } from '../../State/Reducers/emailSlice';
import { setTokenAction } from '../../State/Reducers/tokenSlice';
import { setGoogleAction} from '../../State/Reducers/googleSlice';

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleGoogleLoginSuccess = async (response) => {
        const tokenId = response.credential;
    
        try {
            const res = await AxiosRequest.post('/api/google-login', { tokenId });
            console.log('Login Success:', res.data);
            dispatch(setEmailAction(res.data.payload.email));
            dispatch(setTokenAction(res.data.token));
            dispatch(setGoogleAction(true));
            toast.success('Login successful');
           setTimeout(()=>{
            navigate('/home')
           },1000); 
        } catch (error) {
            console.log('Login Error:', error);
            toast.error(error.response?.data?.message || 'An unexpected error occurred');
        }
    };
    

    const handleGoogleLoginFailure = (response) => {
        console.log('Login Failure:', response);
        // Handle failed login response
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await AxiosRequest.post('/api/login', {
                email: formData.email,
                password: formData.password
            });
            if(response && response.status === 200){
            dispatch(setEmailAction(formData.email))
            dispatch(setTokenAction(response.data.token)); // Save the token in Redux state
            localStorage.setItem('userId',response.data.user._id);
            console.log('Token',response.data.token);
            toast.success('Login successful');
           setTimeout(()=>{
            navigate('/home')
           },1000); 
        }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.error('User not found');
            } else if (error.response && error.response.status === 401) {
                toast.error('Invalid password');
            } else {
                console.error('Login failed:', error.response.data);
                toast.error('Login failed');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full p-8">
                <section className="flex justify-center items-center">
                    <img src={img} alt="Side Image" className="max-w-60 h-auto" />
                </section>
                <section className="flex justify-center items-center">
                    <div className="flex flex-col max-w-lg w-full p-8 bg-white rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-center mb-6">Welcome to Smart House Price Predictor</h2>
                        <div className="h-px bg-gray-300 mb-6"></div>
                        <p className="text-center text-gray-700 mb-6">Please, provide login credential to proceed and have access to all our services</p>

                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <div className="relative">
                                <Input
                                    size='lg'
                                    variant='outlined'
                                    className="focus:ring-0 "
                                    label="Email"
                                    required={true}
                                    name="email"
                                    color='black'
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                                    <FontAwesomeIcon icon={faEnvelope} color='black' />
                                </div>
                            </div>
                            <div className="relative">
                                <Input
                                    size='lg'
                                    variant='outlined'
                                    className="focus:ring-0"
                                    color='black'
                                    required={true}
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    label="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer" onClick={togglePasswordVisibility}>
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} color='black' />
                                </div>
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" id="rememberMe" name="rememberMe" className="mr-2" />
                                <label htmlFor="rememberMe" className="text-sm text-gray-700 flex-grow">Remember Me</label>
                                <p className="text-sm text-blue-700 cursor-pointer" onClick={() => navigate('/forgot-password')}>Forgot your password?</p>
                            </div>
                            <Button type="submit" className="bg-black text-white py-4 shadow-none rounded-lg hover:shadow-gray-500 hover:shadow-md">Login</Button>
                        </form>
                        <div className="flex items-center justify-center my-6">
                            <span className="text-sm text-gray-700">OR</span>
                        </div>
                        <div className="flex flex-col items-center">
                             <GoogleOAuthProvider clientId="122580737491-grei8ltm79knonbc8q0i5914fvqvkqjr.apps.googleusercontent.com">
                <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={handleGoogleLoginFailure}
                    render={(renderProps) => (
                        <button
                            className="w-full py-3 mb-4 bg-red-500 text-white rounded-lg flex items-center justify-center transition duration-300 hover:bg-red-600"
                            onClick={renderProps.onClick}
                            disabled={renderProps.disabled}
                        >
                            <FontAwesomeIcon icon={faGoogle} className="mr-2" />
                            Continue with Google
                        </button>
                    )}
                />
        </GoogleOAuthProvider>
                        </div>
                        <p className="text-center text-gray-500 mt-6">Don't have an account? <span className="text-blue-700 cursor-pointer" onClick={() => navigate('/signup')}>Sign up</span></p>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Login;
