import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
        const role = localStorage.getItem('role');
        setIsLoggedIn(loggedInStatus);
        setUserRole(role);
    }, []);
    
    

    return (
        <AuthContext.Provider value={{ isLoggedIn, userRole, setIsLoggedIn, setUserRole }}>
            {children}
        </AuthContext.Provider>
    );
};
