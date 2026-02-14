import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Building, Users, Monitor, Activity, Server, Clock } from 'lucide-react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const { token, currentUser } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/admin/overview', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data);
            } catch (error) {
                console.error("Admin Dashboard Error:", error);
                toast.error("Failed to load admin dashboard data");
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchStats();
    }, [token]);

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-cardBg border border-borderColor p-6 rounded-xl relative overflow-hidden group hover:border-primary/50 transition-colors">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
                <Icon className="w-16 h-16" />
            </div>
            <div className="relative z-10">
                <p className="text-textMuted text-sm font-medium uppercase tracking-wider">{title}</p>
                <h3 className="text-3xl font-bold mt-2 text-white">{value}</h3>
            </div>
        </div>
    );

    if (loading) return <div className="flex h-screen items-center justify-center bg-bgMain text-textMuted">Loading Dashboard...</div>;

    if (!stats) return <div className="p-10 text-center text-red-400">Restricted Access or No Data Available</div>;

    return (
        <div className="flex h-screen bg-bgMain text-textMain overflow-hidden font-sans selection:bg-primary/30">
            <Sidebar resources={[]} onSelect={() => { }} selectedFilter={{ type: 'all' }} />

            <div className="flex-1 flex flex-col h-full relative min-w-0">
                <Header isConnected={true} onlineCount={stats.stats?.onlineDevices || 0} />

                <main className="flex-1 overflow-y-auto p-10 grid-bg custom-scrollbar relative">
                    <div className="max-w-7xl mx-auto">

                        {/* Welcome Header */}
                        <div className="mb-10">
                            <h1 className="text-3xl font-bold tracking-tight mb-2">Block Manager Dashboard</h1>
                            <p className="text-textMuted flex items-center gap-2">
                                <Building className="w-4 h-4 text-primary" />
                                Managing Block: <span className="text-white font-semibold">{stats.assignedBlock}</span>
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                            <StatCard
                                title="Total Labs"
                                value={stats.stats.totalLabs}
                                icon={Server}
                                color="text-blue-500"
                            />
                            <StatCard
                                title="Total Devices"
                                value={stats.stats.totalDevices}
                                icon={Monitor}
                                color="text-purple-500"
                            />
                            <StatCard
                                title="Online Devices"
                                value={stats.stats.onlineDevices}
                                icon={Activity}
                                color="text-emerald-500"
                            />
                            <StatCard
                                title="Offline Devices"
                                value={stats.stats.offlineDevices}
                                icon={Clock}
                                color="text-red-500"
                            />
                        </div>

                        {/* Quick Actions / Placeholders */}
                        <div className="bg-cardBg border border-borderColor rounded-xl p-8 text-center text-textMuted opacity-50">
                            <p>Write now we added static data for blocks/labs/pcs.</p>
                            <div className="mt-4 flex gap-4 justify-center">
                                {/* Links to other management pages could go here */}
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
