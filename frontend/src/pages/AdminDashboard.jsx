import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Activity, Power, PowerOff, Server } from 'lucide-react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const { token, currentUser } = useAuth();
    const [stats, setStats] = useState({
        totalLabs: 0,
        totalDevices: 0,
        onlineDevices: 0,
        offlineDevices: 0
    });
    const [assignedBlocks, setAssignedBlocks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/admin/overview', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(data.stats);
                setAssignedBlocks(data.assignedBlocks);
            } catch (error) {
                console.error("Admin Dashboard Error:", error);
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchOverview();
    }, [token]);

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-cardBg border border-borderColor p-6 rounded-xl flex items-center justify-between">
            <div>
                <p className="text-textMuted text-sm font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-textMain">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg bg-opacity-10 ${color.replace('text-', 'bg-')}`}>
                <Icon className={`w-8 h-8 ${color}`} />
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-bgMain text-textMain">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header title="Admin Dashboard" />

                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto space-y-8">

                        {/* Welcome Section */}
                        <div className="flex justify-between items-end">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Welcome, {currentUser?.name}</h1>
                                <p className="text-textMuted">
                                    Managing Block: <span className="text-primary font-semibold">{assignedBlocks.join(', ')}</span>
                                </p>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                title="Total Labs"
                                value={stats.totalLabs}
                                icon={Server}
                                color="text-blue-500"
                            />
                            <StatCard
                                title="Total Devices"
                                value={stats.totalDevices}
                                icon={LayoutDashboard}
                                color="text-purple-500"
                            />
                            <StatCard
                                title="Online Devices"
                                value={stats.onlineDevices}
                                icon={Power}
                                color="text-green-500"
                            />
                            <StatCard
                                title="Offline Devices"
                                value={stats.offlineDevices}
                                icon={PowerOff}
                                color="text-red-500"
                            />
                        </div>

                        {/* Quick Actions or Recent Activity could go here */}
                        <div className="bg-cardBg border border-borderColor rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-primary" />
                                System Status
                            </h3>
                            <div className="text-textMuted text-sm">
                                System is running normally. Real-time updates active.
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
