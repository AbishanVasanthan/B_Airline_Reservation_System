import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './LoginForm.css';

const LoginForm = () => {
    const { setIsLoggedIn, setUserRole } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loginRole, setLoginRole] = useState('passenger'); // Default to 'user'
    const navigate = useNavigate();

    const handleRoleChange = (role) => {
        setLoginRole(role);
        setErrorMessage(''); // Clear any previous error message
    };

    const handleUserLogin = async (e) => {
        e.preventDefault();
        const loginEndpoint = 'http://localhost:3000/user/login';

        try {
            const response = await fetch(loginEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            console.log("response :",response)

            if (response.ok) {
                const data = await response.json();
                // Assuming the response contains token and user role
                localStorage.setItem('token', data.token);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('role', data.user.role);

                setIsLoggedIn(true);
                setUserRole(data.user.role);

                console.log("User logged in with role: ", data.user.role);
                navigate('/dashboard'); // Navigate to user dashboard
            } else {
                const message = await response.text();
                setErrorMessage(message);
            }
        } catch (error) {
            console.error('Error logging in as user:', error);
            setErrorMessage('Failed to log in as user. Please try again.');
        }
    };

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        const loginEndpoint = 'http://localhost:3000/admin/adminlogin';
    
        try {
            const response = await fetch(loginEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
    
            const data = await response.json(); // Parse the JSON response
            console.log("Admin login response:", data); // Log the entire response
    
            if (response.ok) {
                // Check if 'token' and 'data' exist in the response
                if (data.token && data.data) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('role', data.data.role); // Accessing role from data
    
                    setIsLoggedIn(true);
                    setUserRole(data.data.role); // Ensure 'data.data.role' is accessed
    
                    console.log("Admin logged in with role:", data.data.role);
                    navigate('/adminpage'); // Navigate to admin homepage
                } else {
                    throw new Error("Token or user data is missing from the response");
                }
            } else {
                const message = await response.text();
                setErrorMessage(message);
            }
        } catch (error) {
            console.error('Error logging in as admin:', error);
            setErrorMessage('Failed to log in as admin. Please try again.');
        }
    };
    

    const handleLogin = (e) => {
        console.log("role: ",loginRole)
        if (loginRole === 'admin') {
            handleAdminLogin(e); // Call admin login function
            console.log("i am inside admin")
        } else {
            handleUserLogin(e); // Call user login function
        }
    };

    const handleSignup = () => {
        navigate('/signup');
    };


    return (
        <div className="logo">
            <div className="login-container">
                <h2>Login</h2>
                <div className="role-buttons">
                    <button onClick={() => handleRoleChange('passenger')} className={loginRole === 'passenger' ? 'active' : ''}>User</button>
                    <button onClick={() => handleRoleChange('admin')} className={loginRole === 'admin' ? 'active' : ''}>Admin</button>
                </div>
                
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <form onSubmit={handleLogin}>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </label>
                    <button type="submit">Login as {loginRole === 'admin' ? 'Admin' : 'User'}</button>
                </form>
                <button onClick={handleSignup} className="signup-button">Sign Up</button>
            </div>
        </div>
    );
};

export default LoginForm;
