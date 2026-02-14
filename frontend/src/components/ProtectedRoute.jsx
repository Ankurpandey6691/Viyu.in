import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

const ProtectedRoute = () => {
    const { token } = useAuth();

    useEffect(() => {
        if (!token) {
            // Ensure socket is disconnected if user is kicked out
            // (Socket logic is mainly in Dashboard, but good practice)
        }
    }, [token]);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
