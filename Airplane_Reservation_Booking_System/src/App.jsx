import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import * as jwtDecode from 'jwt-decode';
import { AuthProvider } from './AuthContext';
import Navbar from './Navbar';
import HomePage from './HomePage';
import Offers from './Offers';
import Footer from './Footer';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import ContactPage from './ContactPage';
import About from './About';
import Flights from './Flights';
import TermsAndConditions from './TermsAndConditions';
import Services from './Services';
import BookAndSearchFlight from './BookAndSearchFlight';
import BookingPage from './BookingPage';
import SubmitPage from './SubmitPage';
import Dashboard from './Dashboard';
import Logout from './Logout';
import UserBookings from './UserBookings';
import UserDetails from './UserDetails';
import Report from './Report';
import AdminHomePage from './AdminHomePage';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);

    // This function handles login and sets the authentication and role
    const handleLogin = (token, role) => {
        if (token) {
            const decoded = jwtDecode(token);
            setIsAuthenticated(true);
            setUserRole(decoded.role);  // Set the user's role based on the decoded token
            localStorage.setItem('token', token);  // Store token for future use
            localStorage.setItem('role', decoded.role);  // Store role in localStorage
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUserRole(null);
        localStorage.removeItem('token');
        localStorage.removeItem('role');  // Remove role on logout
    };

    // Check token from localStorage to persist login on refresh
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');  // Get role from localStorage

        if (token && role) {
            try {
                const decoded = jwtDecode(token);
                setIsAuthenticated(true);
                setUserRole(role);  // Set user role from local storage
            } catch (error) {
                console.error("Invalid token", error);
                // localStorage.removeItem('token');  // Remove invalid token
                // localStorage.removeItem('role');   // Also remove invalid role
            }
        }
    }, []);

    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Navbar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
                    <div className="main-content">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/offers" element={<Offers />} />
                            <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
                            <Route path="/sign-up" element={<SignUpForm />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                            <Route path="/services" element={<Services />} />
                            <Route path="/airplanes" element={<Flights />} />
                            <Route path="/customer/viewflights" element={<BookingPage />} />
                            <Route path="/flights" element={<BookAndSearchFlight />} />
                            <Route path="/submit-details" element={<SubmitPage />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/logout" element={<Logout />} />
                            <Route path="/user-details" element={<UserDetails />} />
                            <Route path="/bookings" element={<UserBookings />} /> {/* Bookings route */}
                            <Route path="/Report" element={<Report />} />
                            <Route path="/adminpage" element={<AdminHomePage />} />

                            {/* Conditionally render admin-only routes */}
                            {isAuthenticated && userRole === 'admin' && (
                                <>
                                    <Route path="/Report" element={<Report />} />
                                    <Route path="/adminpage" element={<AdminHomePage />} />
                                </>
                            )}

                            {/* Conditionally render user-only routes */}
                            {isAuthenticated && userRole === 'passenger' && (
                                <>
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/user-details" element={<UserDetails />} />
                                    <Route path="/bookings" element={<UserBookings />} />
                                </>
                            )}

                            {/* Redirect based on authentication */}
                            <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
                        </Routes>
                    </div>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;


// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import * as jwtDecode from 'jwt-decode';
// import { AuthProvider } from './AuthContext';
// import Navbar from './Navbar';
// import HomePage from './HomePage';
// import Offers from './Offers';
// import Footer from './Footer';
// import LoginForm from './LoginForm';
// import SignUpForm from './SignUpForm';
// import ContactPage from './ContactPage';
// import About from './About';
// import Flights from './Flights';
// import TermsAndConditions from './TermsAndConditions';
// import Services from './Services';
// import BookAndSearchFlight from './BookAndSearchFlight';
// import BookingPage from './BookingPage';
// import SubmitPage from './SubmitPage';
// import Dashboard from './Dashboard';
// import Logout from './Logout';
// import UserBookings from './UserBookings';
// import UserDetails from './UserDetails';
// import Report from './Report';
// import AdminHomePage from './AdminHomePage';

// function App() {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [userRole, setUserRole] = useState(null);

//     // This function handles login and sets the authentication and role
//     const handleLogin = (token,role) => {
//         if (token) {
//             const decoded = jwtDecode(token);  // Decode JWT to extract role
//             setIsAuthenticated(true);
//             setUserRole(role);  // Set the user's role based on the token
//             localStorage.setItem('token', token);  // Store token for future use
//             console.log("role playing", role)
//         }
//     };

//     const handleLogout = () => {
//         setIsAuthenticated(false);
//         setUserRole(null);
//         localStorage.removeItem('token');
//         localStorage.removeItem('role');  // Remove token on logout
//     };

//     // Check token from localStorage to persist login on refresh
//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         const role = localStorage.getItem('role');
//         console.log("roling", role);
//         console.log("token", token);
//         if (token) {
//             const decoded = jwtDecode(token);
//             setIsAuthenticated(true);
//             setUserRole(role);
//         }
//     }, []);

//     return (
//         <AuthProvider>
//             <Router>
//                 <div className="App">
//                     <Navbar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
//                     <div className="main-content">
//                         <Routes>
//                             <Route path="/" element={<HomePage />} />
//                             <Route path="/offers" element={<Offers />} />
//                             <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
//                             <Route path="/sign-up" element={<SignUpForm />} />
//                             <Route path="/contact" element={<ContactPage />} />
//                             <Route path="/about" element={<About />} />
//                             <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
//                             <Route path="/Services" element={<Services />} />
//                             <Route path="/Airplanes" element={<Flights />} />
//                             <Route path="/customer/ViewFlights" element={<BookingPage />} />
//                             <Route path="/Flights" element={<BookAndSearchFlight />} />
//                             <Route path="/submit-details" element={<SubmitPage />} />
//                             <Route path="/dashboard" element={<Dashboard />} />
//                             <Route path="/logout" element={<Logout />} />
//                             <Route path="/user-details" element={<UserDetails />} />
//                             <Route path="/bookings" element={<UserBookings />} /> {/* Bookings route */}

//                             {/* <Route path="/dashboard" element={<Dashboard />} />
//                             <Route path="/user-details" element={<UserDetails />} />
//                             <Route path="/bookings" element={<UserBookings />} /> */}

//                             <Route path="/report" element={<Report />} />
//                             <Route path="/adminpage" element={<AdminHomePage />} />

//                             {/* Conditionally render admin-only routes */}
//                             {isAuthenticated && userRole === 'admin' && (
//                                 <>
//                                     <Route path="/Report" element={<Report />} />
//                                     <Route path="/adminpage" element={<AdminHomePage />} />
//                                 </>
//                             )}

//                             {/* Conditionally render user-only routes */}
//                             {isAuthenticated && userRole === 'passenger' && (
//                                 <>
//                                     <Route path="/dashboard" element={<Dashboard />} />
//                                     <Route path="/user-details" element={<UserDetails />} />
//                                     <Route path="/bookings" element={<UserBookings />} />
//                                 </>
//                             )}

//                             {/* Redirect based on authentication */}
//                             <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
//                         </Routes>
//                     </div>
//                     <Footer />
//                 </div>
//             </Router>
//         </AuthProvider>
//     );
// }

// export default App;
