import React, { useState } from 'react';
import AxiosRequest from '../../AxiosRequest/AxiosRequest';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import img from '../../../../images/img.png';
import {Input,Button} from "@material-tailwind/react"

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(!email){
                toast.warning('Please Provide A Registered Email Address')
                return;
            }
            const promise = AxiosRequest.post('/api/forgot-password', { email });
            toast.promise(
                promise,
                {
                    loading: 'Sending Verification Code...',
                    success: 'Verification code sent successfully',
                    error: 'Failed to send verification code'
                }
            );
            await promise;
            setTimeout(() => {
                navigate('/reset-password', { state: { email } });
            }, 3000);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.error('User not found');
            } else {
                console.error(error.data.message);
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
                        <h2 className='text-2xl font-bold text-center mb-6'>Forgot Password</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="relative">
                                <Input 
                                    className='focus:ring-0' 
                                    variant='outlined' 
                                    size='lg' 
                                    color='black'
                                    type="email" 
                                    label="Enter your email" 
                                    value={email} 
                                    onChange={handleChange} 
                                />
                            </div>
                            <Button type="submit" className="bg-black text-white py-4 shadow-none rounded-lg hover:shadow-gray-500 hover:shadow-md">Send Verification Code</Button>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ForgotPassword;
