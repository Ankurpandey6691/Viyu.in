import { Monitor, Users } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';

const Header = ({ isConnected, onlineCount = 0 }) => {

    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();

    const handleLogoClick = () => {
        const token = localStorage.getItem("token");
        if (currentUser || token) {
            navigate("/dashboard");
        } else {
            navigate("/");
        }
    };

    const handleLogout = async () => {
        await logout();
    };

    return (
        <header className="w-full h-16 border-b border-borderColor bg-bgMain/80 backdrop-blur-md flex items-center justify-between px-8 z-30 sticky top-0">

            {/* Brand */}
            <div className="flex items-center gap-4">
                <div
                    onClick={handleLogoClick}
                    className="bg-primary/10 border border-primary/20 flex items-center justify-center w-8 h-8 rounded-sm cursor-pointer hover:bg-primary/20 transition"
                >
                    <Monitor className="w-4 h-4 text-primary" />
                </div>

                <h1 className="text-sm font-bold tracking-[0.2em] text-textMain uppercase">
                    System.Monitor <span className="text-textMuted font-light ml-2">v4.0</span>
                </h1>
            </div>

            {/* Status + Logout */}
            <div className="flex items-center gap-8">

                <div className="flex gap-6 text-[10px] font-semibold tracking-widest text-textMuted hidden sm:flex">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>{onlineCount} NOMINAL</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span
                            className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-rose-500'
                                }`}
                        ></span>
                        <span>{isConnected ? 'SOCKET ACTIVE' : 'DISCONNECTED'}</span>
                    </div>
                </div>

                <div className="h-6 w-px bg-borderColor hidden sm:block"></div>

                {/* Superadmin User Management Link */}
                {currentUser?.role === 'superadmin' && (
                    <Link
                        to="/dashboard/users"
                        className="flex items-center gap-2 text-sm font-medium text-textMuted hover:text-white transition-colors mr-4"
                    >
                        <Users className="w-4 h-4" />
                        Manage Users
                    </Link>
                )}

                {/* User Avatar + Logout */}
                {(currentUser || localStorage.getItem("token")) && (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-borderColor flex items-center justify-center text-textMain text-[10px] font-bold bg-zinc-800">
                            {currentUser?.photoURL ? (
                                <img src={currentUser.photoURL} alt="User" className="w-full h-full object-cover" />
                            ) : (
                                <span>{currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}</span>
                            )}
                        </div>

                        <button
                            onClick={handleLogout}
                            className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition"
                        >
                            Logout
                        </button>

                    </div>
                )}

            </div>
        </header>
    )
}

export default Header
