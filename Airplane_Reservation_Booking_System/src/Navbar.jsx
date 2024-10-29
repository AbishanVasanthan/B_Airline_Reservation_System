// src/components/Navbar.js
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './Navbar.css';

const AdminNavbar = () => (
    <>
        <li><Link to="/adminpage">Admin Home</Link></li>
        <li><Link to="/Report">Report</Link></li>
        <li><Link to="/Logout">Logout</Link></li>
    </>
);

const UserNavbar = () => (
    <>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/flights">Flights</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/offers">Offers</Link></li>
        <li><Link to="/contact">Contact Us</Link></li>
        <li><Link to="/airplanes">Airplanes</Link></li>
        <li><Link to="/customer/ViewFlights">Booking</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/Logout">Logout</Link></li>
    </>
);

const GuestNavbar = () => (
    <>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/flights">Flights</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/offers">Offers</Link></li>
        <li><Link to="/contact">Contact Us</Link></li>
        <li><Link to="/airplanes">Airplanes</Link></li>
        <li><Link to="/customer/ViewFlights">Booking</Link></li>
        <li><Link to="/login">Login</Link></li>
    </>
);

const Navbar = () => {
    const { isLoggedIn, userRole } = useContext(AuthContext);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [backgroundIndex, setBackgroundIndex] = useState(0);
    

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    // Array of background images from the public directory
    const backgroundImages = [
        'url(/images/1.jpg)',
        'url(/images/2.jpg)',
        'url(/images/3.jpg)',
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setBackgroundIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [backgroundImages.length]);

    
    return (
        <div className="background-container" style={{ backgroundImage: backgroundImages[backgroundIndex] }}>
            <nav className="navbar">
                <div className="navbar-logo">
                    <img src="/b_.png" alt="Airline Logo" /> {/* Update the path to your logo */}
                    <span>Airline Logo</span>
                </div>
                <ul className="navbar-links">
                    {isLoggedIn ? (
                        userRole === 'admin' ? <AdminNavbar /> : <UserNavbar />
                    ) : (
                        <GuestNavbar />
                    )}
                </ul>
                <div className="navbar-search">
                    <input type="text" placeholder="Search..." />
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
