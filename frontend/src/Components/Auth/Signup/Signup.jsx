import React, { useState } from 'react';
import AxiosRequest from '../../AxiosRequest/AxiosRequest';
import img from '../../../../images/img.png';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faEye, faEyeSlash, faUser } from '@fortawesome/free-solid-svg-icons';
import {Input, Button} from "@material-tailwind/react"
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        error: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setFormData({ ...formData, error: 'Passwords do not match' });
        } else {
            try {
                // Send the form data to the backend
                const response = await AxiosRequest.post('/api/signup', {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });
                if (response.status === 201) {
                    console.log('Signup successful:', response.data);
                    // Show success toast
                    toast.success('Signup successful');
                    setTimeout(()=>
                        {
                            navigate('/login');
                        },2000)
                    // Optionally, you can redirect the user to a different page upon successful signup
                }
            } catch (error) {
                if (error.response && error.response.status === 409) {
                    // If username or email already exists, show error toast
                    toast.error('Email already exists');
                } else {
                    console.error('Signup failed:', error.response.data);
                    // Show error toast
                    toast.error('Signup failed');
                }
                // Handle other error responses from the server
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
                        <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
                        <div className="h-px bg-gray-300 mb-6"></div>
                        <p className="text-center text-gray-700 mb-6">Please, provide your information to sign up and access all our services</p>

                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <div className="relative">
                            <Input className='focus:ring-0' variant='outlined' size='lg' color='black' type="text" name="name" label="Name" value={formData.name} onChange={handleChange} />
                            <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                                    <FontAwesomeIcon icon={faUser} color='black'/>
                                </div>
                            </div>
                            <div className="relative">
                                <Input className='focus:ring-0' variant='outlined' size='lg' color='black' type="email" name="email" label="Email" value={formData.email} onChange={handleChange} />
                                <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                                    <FontAwesomeIcon icon={faEnvelope} color='black'/>
                                </div>
                            </div>
                            <div className="relative">
                                <Input className='focus:ring-0' type={showPassword ? "text" : "password"} color='black' name="password" label="Password" variant='outlined' size='lg' value={formData.password} onChange={handleChange} />
                                <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer" onClick={togglePasswordVisibility}>
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} color='black'/>
                                </div>
                            </div>
                            <div className="relative">
                                <Input className='focus:ring-0' variant='outlined' size='lg' color='black' type={showConfirmPassword ? "text" : "password"} name="confirmPassword" label="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
                                <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer" onClick={toggleConfirmPasswordVisibility}>
                                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} color='black'/>
                                </div>
                            </div>
                            {formData.error && <p className="error-message">{formData.error}</p>}
                            <Button type="submit" className="bg-black text-white py-4 shadow-none rounded-lg hover:shadow-gray-500 hover:shadow-md">Sign Up</Button>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Signup;
