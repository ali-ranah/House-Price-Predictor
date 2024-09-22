import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, Typography, Avatar } from '@material-tailwind/react';
import AxiosRequest from '../AxiosRequest/AxiosRequest';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../State/Reducers/googleSlice';
import { selectToken } from '../State/Reducers/tokenSlice';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const storedGoogle = localStorage.getItem('isLoggedIn') === 'true';
    const isGoogleLoggedInRedux = useSelector(selectIsLoggedIn);
    const isGoogleLoggedIn = isGoogleLoggedInRedux || storedGoogle;
    const storedToken = localStorage.getItem('token');
    const token = useSelector(selectToken) || storedToken;
    console.log('isGoogleLoggedIn',isGoogleLoggedIn);
    
    useEffect(() => {
        const fetchUserInfo = async () => {
            let endpoint = "/api/get-user-info";
            if (isGoogleLoggedIn) {
                endpoint = "/api/get-google-user-info";
            }
            try {
                const response = await AxiosRequest.get(endpoint,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(response.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [isGoogleLoggedIn,token]);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen">{error}</div>;
    }

    if (!user) {
        return <div className="flex justify-center items-center min-h-screen">User not found</div>;
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 py-8">
            <Card className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
                <CardHeader floated={false} shadow={false} className="bg-cover bg-center h-56" style={{ backgroundImage: `url('https://source.unsplash.com/1600x900/?nature,water')` }}>
                <div className="flex mt-[10vh] justify-center items-center">
                {user && user.picture ? (
 <Avatar
 variant="circular"
 size="xxl"
 alt="User"
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
                        )
                    }
                    </div>
                </CardHeader>
                <CardBody className="text-center">
                    <Typography variant="h4" className="font-bold text-gray-900">
                        {user.name}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                        {user.email}
                    </Typography>
                </CardBody>
            </Card>
        </div>
    );
};

export default Profile;
