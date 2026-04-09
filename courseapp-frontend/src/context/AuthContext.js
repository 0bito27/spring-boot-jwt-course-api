import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('jwtToken'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
        };
    }, [token]);

    const login = async (credentials) => {
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', credentials);
            const receivedToken = response.data.token;
            const receivedUsername = response.data.username;
            const receivedRole = response.data.role;

            localStorage.setItem('jwtToken', receivedToken);
            localStorage.setItem('username', receivedUsername);
            localStorage.setItem('userRole', receivedRole);
            setToken(receivedToken);
            setUser({ username: receivedUsername, role: receivedRole });

            return true;
        } catch (error) {
            console.error('Login failed:', error);
            localStorage.removeItem('jwtToken');
            setToken(null);
            setUser(null);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        setToken(null);
        setUser(null);
    };


    useEffect(() => {
        const storedToken = localStorage.getItem('jwtToken');
        const storedRole = localStorage.getItem('userRole');
        const storedUsername = localStorage.getItem('username');

        if (storedToken && storedRole && storedUsername) {

            setToken(storedToken);
            setUser({ username: storedUsername, role: storedRole });
        } else {

            logout();
        }
        setLoading(false);
    }, []);


    const authContextValue = {
        user,
        token,
        isLoggedIn: !!token,
        login,
        logout,
        loading,
    };

    if (loading) {
        return <div>Loading authentication...</div>;
    }

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);