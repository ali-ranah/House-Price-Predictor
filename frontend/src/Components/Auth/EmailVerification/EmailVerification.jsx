import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import AxiosRequest from '../../AxiosRequest/AxiosRequest';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('loading'); 
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setMessage('The verification link is invalid or missing. Please check your email for the correct link.');
        setStatus('error');
        return;
      }

      try {
        const response = await AxiosRequest.post('/api/verify-email', { token });
        setMessage(response.data.message || 'Your email has been successfully verified. You can now access your account.');
        setStatus('success');
        setTimeout(() => {
          navigate('/login'); // Navigate to the login page after a short delay
        }, 2000); // 2 seconds delay before navigation
      } catch (error) {
        const errorMsg =
          error.response?.data?.message || 'We encountered an issue verifying your email. Please try again later.';
        setMessage(errorMsg);
        setStatus('error');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]); // Include navigate as a dependency

  const renderContent = () => {
    if (status === 'loading') {
      return (
        <div className="flex flex-col items-center justify-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Verifying your email, please hold on...</p>
        </div>
      );
    }

    if (status === 'success') {
      return (
        <div className="flex flex-col items-center justify-center">
          <CheckCircleIcon className="h-16 w-16 text-green-600 mb-4" />
          <p className="text-xl font-semibold text-gray-800 text-center">{message}</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center">
        <XCircleIcon className="h-16 w-16 text-red-600 mb-4" />
        <p className="text-xl font-semibold text-gray-800 text-center">{message}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-lg w-full bg-white p-8 rounded-xl shadow-xl border border-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Email Verification
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Please wait while we verify your email address. This process may take a moment.
        </p>
        {renderContent()}
      </div>
    </div>
  );
};

export default EmailVerification;
