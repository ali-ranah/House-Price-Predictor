import React from 'react';
import { Button } from '@material-tailwind/react';
import BookingCard from '../BookingCard/BookingCard';
import Carousels from '../Carousel/Carousel';
import { TypeAnimation } from 'react-type-animation';
import { useSelector } from 'react-redux';
import { selectToken } from '../State/Reducers/tokenSlice';
import Footer from '../Footer/Footer';
import backgroundImage from "../../assets/background.jpg";

const Home = () => {
    const token = useSelector(selectToken);

    return (
        <div className="min-h-screen flex flex-col justify-between relative">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-700 to-black z-0"></div>
            <div className="mx-auto px-4 sm:px-6 md:px-2 max-w-screen-xl text-white relative z-10">
                <div className="flex flex-col text-center items-center justify-center min-h-screen space-y-8 mt-[6vh] mb-[6vh]">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                        Welcome To Smart House Price Predictor
                    </h1>
                    <div className="md:max-w-6xl max-w-xl align-start text-justify">
                        <TypeAnimation
                            sequence={[
                                "Welcome to House Price Predictor, your trusted source for comprehensive real estate insights. Our platform is dedicated to providing you with accurate property valuations, leveraging advanced machine learning algorithms to predict house prices with exceptional precision. Explore our user-friendly interface, where you can access a wealth of verified property listings and stay informed with real-time market trends. Whether you're looking to buy your dream home or make a smart investment, House Price Predictor is here to help you navigate the real estate market with confidence and ease. Join our community today and take the first step towards making informed, data-driven property decisions.",
                                1000,
                            ]}
                            wrapper="p"
                            cursor={true}
                            className="text-md md:text-lg text-gray-300 mb-8 drop-shadow-md"
                            speed={70}
                            repeat={0}
                        />
                    </div>
                    <Carousels />
                    <BookingCard />
                    <Button color="blue" className="py-3 px-8 mt-[2vh] shadow-lg hover:shadow-2xl transform hover:scale-105 transition-transform duration-300">
                        Get Started
                    </Button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
