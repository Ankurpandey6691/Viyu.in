import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import ResourceCard from '../components/ResourceCard'
import StatsOverview from '../components/StatsOverview'
import DetailsPanel from '../components/DetailsPanel'
import { io } from 'socket.io-client'
import { AnimatePresence } from 'framer-motion'

import { useAuth } from '../context/AuthContext';

import SkeletonCard from '../components/SkeletonCard'

const SOCKET_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
    const { token } = useAuth(); // Get token
    const [resources, setResources] = useState(new Map());
    const [lastSync, setLastSync] = useState(Date.now());
    const [isConnected, setIsConnected] = useState(false);
    const [selectedResId, setSelectedResId] = useState(null);
    const [filter, setFilter] = useState({ type: 'all', value: null });
    const [isLoading, setIsLoading] = useState(true);

    const [serverStats, setServerStats] = useState(null);

    const [labs, setLabs] = useState([]);
    const [activityLog, setActivityLog] = useState([]);

    useEffect(() => {
        if (!token) return;

        // Fetch all resources initially
        const fetchResources = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/resources`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    if (res.status === 401) {
                        console.error("Unauthorized access to resources");
                    }
                    return;
                }

                const data = await res.json();

                if (Array.isArray(data)) {
                    setResources(prev => {
                        const newMap = new Map(prev);
                        data.forEach(device => {
                            if (!newMap.has(device.deviceId)) {
                                newMap.set(device.deviceId, device);
                            } else {
                                const existing = newMap.get(device.deviceId);
                                newMap.set(device.deviceId, { ...existing, ...device });
                            }
                        });
                        return newMap;
                    });
                } else {
                    console.warn('API returned non-array data:', data);
                }
            } catch (err) {
                console.error('Failed to fetch resources:', err);
            } finally {
                // Add a small delay for aesthetic effect if it's too fast, or just set false
                setTimeout(() => setIsLoading(false), 800);
            }
        };

        const fetchLabs = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/labs`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setLabs(data);
            } catch (err) {
                console.error('Failed to fetch labs:', err);
            }
        };

        fetchResources();
        fetchLabs();

        const socket = io(SOCKET_URL);

        socket.on('connect', () => setIsConnected(true));
        socket.on('disconnect', () => setIsConnected(false));

        socket.on('connect_error', (err) => { });

        socket.on('status_update', (data) => {
            console.log('Socket Status Update:', data); // DEBUG LOG
            setLastSync(Date.now());
            setResources(prev => {
                const newMap = new Map(prev);
                const existing = newMap.get(data.deviceId) || {};
                newMap.set(data.deviceId, { ...existing, ...data, lastSeen: Date.now() });
                return newMap;
            });

            // Add to Activity Log
            setActivityLog(prev => {
                const newLog = {
                    type: 'status',
                    deviceId: data.deviceId,
                    status: data.status,
                    timestamp: Date.now(),
                    id: Date.now() + Math.random() // Unique ID
                };
                return [newLog, ...prev].slice(0, 50); // Keep last 50
            });
        });

        socket.on('system_stats', (stats) => {
            setServerStats(stats);
        });

        socket.on('lab_session_update', (data) => {
            setLabs(prevLabs => prevLabs.map(lab =>
                lab.code === data.labCode ? { ...lab, isSessionActive: data.isSessionActive } : lab
            ));

            // Add Log
            setActivityLog(prev => {
                const newLog = {
                    type: 'session',
                    labCode: data.labCode,
                    active: data.isSessionActive,
                    timestamp: Date.now(),
                    id: Date.now() + Math.random()
                };
                return [newLog, ...prev].slice(0, 50);
            });
        });

        return () => socket.disconnect();
    }, [token]);

    const resourceList = Array.from(resources.values());

    // Filtering Logic
    const filteredResources = resourceList.filter(res => {
        if (filter.type === 'all') return true;
        if (filter.type === 'block') return res.block === filter.value;
        if (filter.type === 'department') return res.department === filter.value;
        if (filter.type === 'lab') {
            const labName = typeof res.lab === 'object' ? res.lab?.name : res.lab;
            return labName === filter.value;
        }
        return true;
    });

    const onlineCount = filteredResources.filter(r => r.status === 'Online').length;
    const selectedResource = resources.get(selectedResId);

    // Current Lab Context (if selected)
    const currentLab = filter.type === 'lab' ? labs.find(l => l.name === filter.value) : null;

    const handleFilterSelect = (type, value) => {
        setFilter({ type, value });
        setSelectedResId(null); // Deselect when changing view
    };

    const toggleSession = async () => {
        if (!currentLab) return;
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/labs/toggle-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ labCode: currentLab.code })
            });
            // State update will happen via socket
        } catch (err) {
            console.error('Failed to toggle session:', err);
        }
    };

    return (
        <div className="flex h-screen bg-bgMain text-textMain overflow-hidden font-sans selection:bg-primary/30">
            {/* 3-Pane Layout */}

            {/* Pane 1: Tree Sidebar */}
            <Sidebar
                resources={resourceList}
                onSelect={handleFilterSelect}
                selectedFilter={filter}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full relative min-w-0">
                <Header isConnected={isConnected} onlineCount={onlineCount} />

                <main className="flex-1 overflow-y-auto p-10 grid-bg custom-scrollbar relative">
                    <div className="max-w-[1600px] mx-auto">

                        {/* Header Section */}
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <nav className="flex items-center gap-3 text-[10px] text-textMuted uppercase tracking-[0.2em] mb-2">
                                    <span
                                        className="cursor-pointer hover:text-textMain transition-colors"
                                        onClick={() => handleFilterSelect('all', null)}
                                    >
                                        Hierarchy
                                    </span>
                                    {filter.type !== 'all' && (
                                        <>
                                            <span className="w-1 h-1 rounded-full bg-borderColor"></span>
                                            <span className="text-zinc-500">{filter.type === 'block' ? 'Block' : filter.type === 'department' ? 'Department' : 'Lab'}</span>
                                        </>
                                    )}
                                </nav>
                                <h2 className="text-4xl font-black text-textMain tracking-tighter uppercase flex items-center gap-4">
                                    {filter.value || 'SVVV Overview'}
                                    {currentLab && (
                                        <button
                                            onClick={toggleSession}
                                            className={`text-xs px-4 py-2 rounded-full font-bold tracking-widest uppercase transition-all ${currentLab.isSessionActive
                                                ? 'bg-viyu-green text-black hover:bg-viyu-green/80'
                                                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                                }`}
                                        >
                                            {currentLab.isSessionActive ? 'Session Active' : 'Start Session'}
                                        </button>
                                    )}
                                    <span className="text-zinc-700 font-light ml-3">/ Resources</span>
                                </h2>
                            </div>
                        </div>

                        {/* Stats Bar */}
                        <StatsOverview totalAssets={filteredResources.length} onlineCount={onlineCount} serverStats={serverStats} isLoading={isLoading} />

                        {/* Resource Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">

                            {/* Loading State: Skeletons */}
                            {isLoading && Array(12).fill(0).map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}

                            {!isLoading && filteredResources.map(device => {
                                // Find lab for this device to check session status
                                // If we are in "Lab" view, we have currentLab.
                                // If not, we need to find the lab from the `labs` array.
                                const labName = typeof device.lab === 'object' ? device.lab?.name : device.lab;
                                const deviceLab = labs.find(l => l.name === labName);
                                const isSessionActive = deviceLab ? deviceLab.isSessionActive : false;

                                return (
                                    <ResourceCard
                                        key={device.deviceId}
                                        device={device}
                                        isSelected={selectedResId === device.deviceId}
                                        onClick={() => setSelectedResId(device.deviceId === selectedResId ? null : device.deviceId)}
                                        labSessionActive={isSessionActive}
                                    />
                                );
                            })}

                            {!isLoading && filteredResources.length === 0 && (
                                <div className="col-span-full py-20 text-center border border-dashed border-borderColor rounded-sm">
                                    <p className="text-textMuted uppercase tracking-widest text-xs">No devices found in this view</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Pane 3: Details Panel (Always Visible for Logs or Details) */}
            <DetailsPanel
                resource={selectedResource}
                activityLog={activityLog}
                onClose={() => setSelectedResId(null)}
            />

        </div>
    )
}

export default Dashboard
