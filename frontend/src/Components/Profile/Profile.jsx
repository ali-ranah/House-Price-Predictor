import React, { useEffect, useState } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
    Spinner,
    Button,
} from '@material-tailwind/react';
import AxiosRequest from '../AxiosRequest/AxiosRequest';
import { useSelector } from 'react-redux';
import { selectToken } from '../State/Reducers/tokenSlice';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";


const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const storedToken = localStorage.getItem('token');
    const token = useSelector(selectToken) || storedToken;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            const endpoint = '/api/get-user-info';
            try {
                const response = await AxiosRequest.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [token]);

    const handleEditProfile = ()=>{
        navigate('/edit-profile');
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <Spinner color="blue-gray" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <Typography variant="h6" color="red">
                        Oops! Something went wrong.
                    </Typography>
                    <Typography variant="body2" color="gray">
                        {error}
                    </Typography>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <Typography variant="h6" color="gray">
                    User not found.
                </Typography>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-start min-h-screen mt-4 py-8 px-4">
              <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full p-6"
      >
      <Card className="p-8 w-full max-w-md shadow-lg shadow-black rounded-lg bg-white transform transition duration-300 hover:-translate-y-2 hover:shadow-3xl">
                <CardHeader
                    floated={false}
                    shadow={false}
                    className="relative bg-cover bg-center h-40"
                >
                    <div className="absolute inset-0 flex justify-center items-center">
                        {user.picture ? (
                            <Avatar
                                variant="circular"
                                size="xxl"
                                alt={user.name}
                                withBorder={true}
                                color="blue-gray"
                                src={user.picture}
                            />
                        ) : (
                            <Avatar
                                variant="circular"
                                size="xxl"
                                alt="User"
                                withBorder={true}
                                color="blue-gray"
                                src="https://docs.material-tailwind.com/img/face-2.jpg"
                            />
                        )}
                    </div>
                </CardHeader>
                <CardBody className="text-center">
                    <Typography variant="h4" className="font-bold text-gray-900">
                        {user.name || 'Guest User'}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 mb-4">
                        {user.email || 'No email provided'}
                    </Typography>
                    <Typography
                        variant="small"
                        className="px-4 py-2 bg-blue-50 rounded-lg text-blue-600 mb-4 inline-block"
                    >
                        Member since: {new Date(user.createdAt).toLocaleDateString()}
                    </Typography>
                    <div className="flex justify-center mt-6">
                        <Button 
                        size="sm"
                        className="bg-black text-white py-4 shadow-none rounded-lg hover:shadow-gray-500 hover:shadow-md"
                        onClick={handleEditProfile}
                        >
                            Edit Profile
                        </Button>
                    </div>
                </CardBody>
            </Card>
            </motion.div>
        </div>
    );
};

export default Profile;
