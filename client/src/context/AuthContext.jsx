import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const BASE_URL = 'http://3.6.192.233:5000';
    const API_URL = BASE_URL+'/auth';
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on initial load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(JSON.parse(localStorage.getItem('userData') || '{}'));
        }
        setLoading(false);
    }, []);
    const login = async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/login`, userData);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('userData', JSON.stringify(user));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(user);

            return response.data;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
        } catch (error) {
        } finally {
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    const isAuthenticated = () => {
        return !!user && !!localStorage.getItem('token');
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-lg text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{
            BASE_URL,
            user,
            login,
            logout,
            isAuthenticated,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
