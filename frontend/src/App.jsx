import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../src/Components/Auth/Login/Login'; // Import your Login component
import Signup from '../src/Components/Auth/Signup/Signup'; // Import your Signup component
import ForgotPassword from '../src/Components/Auth/Forgot/ForgotPassword';
import ResetPassword from '../src/Components/Auth/Reset/ResetPassword';
import Home from '../src/Components/Home/Home';
import Profile from '../src/Components/Profile/Profile';
import './index.css'
import Layout from './Components/Layout/Layout';
import CreateListing from './Components/Property/Selling/CreateListing/CreateListing';
import PredictPrice from './Components/Prediction/PredictPrice/PredictPrice';
import { Toaster } from 'react-hot-toast';
import MyBids from './Components/MyBids/MyBids';
import MyProperties from './Components/MyProperties/MyProperties';

const App = () => {
    return (
        <Router>
            <Toaster/>
            <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/home" element={
                    <Layout>
                <Home />
                </Layout>
                } />
                <Route path="/create-listing" element={
                    <Layout>
                <CreateListing />
                </Layout>
                } />
                <Route path="/predict-price" element={
                    <Layout>
                <PredictPrice />
                </Layout>
                } />
                 <Route path="/my-bids" element={
                    <Layout>
                <MyBids />
                </Layout>
                } />
                 <Route path="/my-properties" element={
                    <Layout>
                <MyProperties />
                </Layout>
                } />
                <Route path="/profile" element={
                    <Layout>
                <Profile />
                </Layout>
                } />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
        </Router>
    );
}

export default App;
