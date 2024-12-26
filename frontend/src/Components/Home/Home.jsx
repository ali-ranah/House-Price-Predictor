// import React from 'react';
// import { Typography } from '@material-tailwind/react';
// import BookingCard from '../BookingCard/BookingCard';
// import Carousels from '../Carousel/Carousel';
// import { useSelector } from 'react-redux';
// import { selectToken } from '../State/Reducers/tokenSlice';
// import Footer from '../Footer/Footer';

// const Home = () => {
//     const token = useSelector(selectToken);

//     return (
//         <div className="min-h-screen flex flex-col justify-between relative">
//             <div className="absolute inset-0 bg-[#f8f9fa] z-0"></div>
            // <div className="mx-auto px-4 sm:px-6 md:px-2 max-w-screen-xl text-white relative z-10">
//                 <div className="flex flex-col text-center items-center justify-center min-h-screen space-y-8 mt-10 mb-0">
//                     <h1 className="text-4xl md:text-5xl text-black font-bold mb-0 drop-shadow-lg">
//                         Welcome To Smart House Price Predictor
//                     </h1>
//                     <div className="md:max-w-6xl max-w-xl align-start text-justify">
//                         <Typography variant='paragraph' color='black'>
//                         Welcome to House Price Predictor, your trusted source for comprehensive real estate insights. Our platform is dedicated to providing you with accurate property valuations, leveraging advanced machine learning algorithms to predict house prices with exceptional precision. Explore our user-friendly interface, where you can access a wealth of verified property listings and stay informed with real-time market trends. Whether you're looking to buy your dream home or make a smart investment, House Price Predictor is here to help you navigate the real estate market with confidence and ease. Join our community today and take the first step towards making informed, data-driven property decisions.
//                         </Typography>
//                     </div>
//                     <Carousels />
//                     <BookingCard />
//                 </div>
//             </div>
//             <Footer />
//         </div>
//     );
// };

// export default Home;




import React from 'react';
import { Typography} from '@material-tailwind/react';
import BookingCard from '../BookingCard/BookingCard';
import Carousels from '../Carousel/Carousel';
import { useSelector } from 'react-redux';
import { selectToken } from '../State/Reducers/tokenSlice';
import Footer from '../Footer/Footer';

const Home = () => {
    const token = useSelector(selectToken);

    return (
        <div className="min-h-screen flex flex-col justify-between bg-white">
            {/* Header Section */}
            <header className="relative py-16">
                <div className="text-center text-black px-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg">
                        Welcome to Smart House Price Predictor
                    </h1>
                    <Typography
                        variant="body1"
                        className="text-black text-lg md:text-xl mt-4 max-w-3xl mx-auto"
                    >
                        The ultimate platform for precise property insights, accurate valuations, and real-time market trends.
                    </Typography>
                </div>
            </header>
            <main className="relative mx-auto  max-w-screen-xl space-y-16">
                <section className="text-center">
                    <Typography variant="h5" className="text-gray-900 font-semibold mb-4">
                        Your Trusted Real Estate Companion
                    </Typography>
                    <Typography variant="body1" className="text-gray-700 leading-relaxed max-w-4xl mx-auto">
                    Welcome to House Price Predictor, your trusted source for comprehensive real estate insights. Our platform is dedicated to providing you with accurate property valuations, leveraging advanced machine learning algorithms to predict house prices with exceptional precision. Explore our user-friendly interface, where you can access a wealth of verified property listings and stay informed with real-time market trends. Whether you're looking to buy your dream home or make a smart investment, House Price Predictor is here to help you navigate the real estate market with confidence and ease. Join our community today and take the first step towards making informed, data-driven property decisions.
                    </Typography>
                </section>

                    <Carousels />

                {/* Booking Card Section */}
                <section className="py-12">
                <Typography
                        variant="h4"
                        className="text-center text-gray-900 font-bold mb-6"
                    >
                        Explore Featured Properties
                    </Typography>
                    <BookingCard />
                </section>                    
                   </main>

            {/* Footer Section */}
            <Footer />
        </div>
    );
};

export default Home;

