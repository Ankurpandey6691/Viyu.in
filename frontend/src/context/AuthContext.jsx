import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Init Auth State from LocalStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setCurrentUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Login Function
    const login = async (email, password) => {
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });

            // Store in LocalStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({
                _id: data._id,
                name: data.name,
                email: data.email,
                role: data.role,
                assignedBlocks: data.assignedBlocks,
                assignedLabs: data.assignedLabs
            }));

            setToken(data.token);
            setCurrentUser(data);

            toast.success(`Welcome back, ${data.name}!`);

            // Redirect based on role
            // Requirements: superadmin/admin -> /dashboard, others -> /dashboard (for now, can be specific later)
            // User requested: /dashboard/admin etc, but currently we only have /dashboard. 
            // I will redirect everyone to /dashboard for now as per App.jsx structure.
            navigate('/dashboard');

            return { success: true };

        } catch (error) {
            console.error("Login Error Full:", error);
            let msg = "Login failed";
            if (error.response) {
                msg = `Server Error: ${error.response.status} - ${error.response.data.message || error.response.statusText}`;
            } else if (error.request) {
                msg = "Network Error: No response from server. Check if backend is running.";
            } else {
                msg = `Error: ${error.message}`;
            }
            toast.error(msg);
            return { success: false, error: msg };
        }
    };

    // Logout Function
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setCurrentUser(null);
        toast.success("Logged out successfully");
        navigate('/login');
    };

    const value = {
        currentUser,
        token,
        login,
        logout,
        isAuthenticated: !!token
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
