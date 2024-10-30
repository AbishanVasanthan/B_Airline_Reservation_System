// src/components/HomePage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FlightsSearch from './FlightsSearch';
import Offers from './Offers';
import Navbar from './Navbar';
import './HomePage.css';
import ImageSwitcher from './ImageSwitcher.jsx';

const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role === 'admin') {
            navigate('/adminpage'); // Replace '/adminpage' with the actual route to the admin page
        }
        else if (role === 'passenger'){
            navigate('/dashboard');
        }
    }, [navigate]);

    return (
        <div className="homepage">
            <ImageSwitcher />
            <div className="hero-section">
                <h1>Welcome to Our Airline</h1>
            </div>
        </div>
    );
};

export default HomePage;
