import { createContext, useContext, useEffect, useState } from 'react';
import {
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [configError, setConfigError] = useState(null); // New state for config errors
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth) {
            const errorMsg = "Firebase keys are missing in .env file.";
            setConfigError(errorMsg);
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Signup with Google
    const signInWithGoogle = async () => {
        if (!auth) {
            toast.error("Configuration Error: Missing Firebase Keys");
            return;
        }
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            toast.success(`Welcome ${user.displayName}!`);
            navigate('/dashboard');
        } catch (error) {
            console.error("Google Sign-in Error:", error);
            handleAuthError(error);
        }
    };

    // Signup with Facebook
    const signInWithFacebook = async () => {
        if (!auth) {
            toast.error("Configuration Error: Missing Firebase Keys");
            return;
        }
        try {
            const result = await signInWithPopup(auth, facebookProvider);
            const user = result.user;
            toast.success(`Welcome ${user.displayName}!`);
            navigate('/dashboard');
        } catch (error) {
            console.error("Facebook Sign-in Error:", error);
            handleAuthError(error);
        }
    };

    // Logout
    const logout = async () => {
        try {
            if (auth) {
                await signOut(auth);
            }
            localStorage.removeItem("token");
            toast.success("Logged out successfully");
            navigate('/auth');
        } catch (error) {
            console.error("Logout Error:", error);
            toast.error("Failed to log out");
        }
    };

    const handleAuthError = (error) => {
        let message = "Authentication failed";
        if (error.code === 'auth/account-exists-with-different-credential') {
            message = "Account exists with different credentials";
        } else if (error.code === 'auth/popup-closed-by-user') {
            message = "Popup closed by user";
        } else if (error.code === 'auth/cancelled-popup-request') {
            message = "Popup request cancelled";
        }
        toast.error(message);
    };

    const value = {
        currentUser,
        signInWithGoogle,
        signInWithFacebook,
        logout,
        configError // Expose error to UI
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
