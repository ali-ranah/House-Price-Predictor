import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AxiosRequest from '../../AxiosRequest/AxiosRequest';
import toast from 'react-hot-toast';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input, Button } from '@material-tailwind/react';

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        if (location.state && location.state.email) {
            setEmail(location.state.email);
        } else {
            toast.error('Unauthorized. Going Back To Forgot Password.');
            setTimeout(() => {
                navigate('/forgot-password');
            }, 2000);
        }
    }, [location.state, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'verificationCode') setVerificationCode(value);
        else if (name === 'newPassword') setNewPassword(value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await AxiosRequest.post('/api/reset-password', { email, verificationCode, newPassword });
            toast.success('Password reset successfully');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            if (error.response && error.response.status) {
                if (error.response.status === 404 && error.response.data.message === 'Invalid Verification Code') {
                    toast.error('Invalid Verification Code');
                } else if (error.response.status === 400 && error.response.data.message === 'Verification Code Expired') {
                    toast.error('Verification Code Expired');
                }
            } else {
                toast.error('Failed to reset password');
                console.error(error.response.data.message);
            }
        }
    };

    const handleResendVerification = async () => {
        try {
            const promise = AxiosRequest.post('/api/resend-verification', { email });
            toast.promise(
                promise,
                {
                    loading: 'Resending verification code...',
                    success: 'Verification code resent successfully',
                    error: 'Failed to resend verification code'
                }
            );
            await promise;
        } catch (error) {
            toast.error('Failed to resend verification code');
            console.error(error.response.data.message);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <section className="flex justify-center items-center">
                <div className="flex flex-col max-w-lg w-full p-8 bg-white rounded-lg shadow-md">
                    <h2 className='text-2xl font-bold text-center mb-6'>Reset Password</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="relative">
                            <Input
                                className='focus:ring-0'
                                variant='outlined'
                                size='lg'
                                color='black'
                                type="text"
                                name="verificationCode"
                                label="Enter verification code"
                                value={verificationCode}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative">
                            <Input
                                className='focus:ring-0'
                                variant='outlined'
                                size='lg'
                                color='black'
                                type={showPassword ? "text" : "password"}
                                name="newPassword"
                                label="Enter new password"
                                value={newPassword}
                                onChange={handleChange}
                            />
                                <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer" onClick={togglePasswordVisibility}>
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} color='black' />
                                </div>
                        </div>
                        <Button type="submit" className="bg-black text-white py-4 shadow-none rounded-lg hover:shadow-gray-500 hover:shadow-md">Reset Password</Button>
                        <div className='flex flex-row space-x-2'>
                            <p className='text-sm text-gray-700'>Didn't Receive The Code?</p>
                        <div
    className="text-sm text-blue-700 cursor-pointer"
    onClick={handleResendVerification}
>
    Resend
</div>
</div>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default ResetPassword;
