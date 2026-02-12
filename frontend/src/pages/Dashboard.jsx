import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import ResourceCard from '../components/ResourceCard'
import StatsOverview from '../components/StatsOverview'
import DetailsPanel from '../components/DetailsPanel'
import { io } from 'socket.io-client'
import { AnimatePresence } from 'framer-motion'

const SOCKET_URL = 'http://localhost:5000';

const Dashboard = () => {
    const [resources, setResources] = useState(new Map());
    const [lastSync, setLastSync] = useState(Date.now());
    const [isConnected, setIsConnected] = useState(false);
    const [selectedResId, setSelectedResId] = useState(null);
    const [filter, setFilter] = useState({ type: 'all', value: null });

    useEffect(() => {
        // Fetch all resources initially
        const fetchResources = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/resources');
                const data = await res.json();

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
            } catch (err) {
                console.error('Failed to fetch resources:', err);
            }
        };

        fetchResources();

        const socket = io(SOCKET_URL);

        socket.on('connect', () => setIsConnected(true));
        socket.on('disconnect', () => setIsConnected(false));

        socket.on('status_update', (data) => {
            setLastSync(Date.now());
            setResources(prev => {
                const newMap = new Map(prev);
                const existing = newMap.get(data.deviceId) || {};
                newMap.set(data.deviceId, { ...existing, ...data, lastSeen: Date.now() });
                return newMap;
            });
        });

        return () => socket.disconnect();
    }, []);

    const resourceList = Array.from(resources.values());

    // Filtering Logic
    const filteredResources = resourceList.filter(res => {
        if (filter.type === 'all') return true;
        if (filter.type === 'block') return res.block === filter.value;
        if (filter.type === 'department') return res.department === filter.value;
        if (filter.type === 'lab') return res.lab === filter.value;
        return true;
    });

    const onlineCount = filteredResources.filter(r => r.status === 'Online').length;
    const selectedResource = resources.get(selectedResId);

    const handleFilterSelect = (type, value) => {
        setFilter({ type, value });
        setSelectedResId(null); // Deselect when changing view
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
                <Header lastSync={lastSync} isConnected={isConnected} onlineCount={onlineCount} />

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
                                <h2 className="text-4xl font-black text-textMain tracking-tighter uppercase">
                                    {filter.value || 'SVVV Overview'} <span className="text-zinc-700 font-light ml-3">/ Resources</span>
                                </h2>
                            </div>
                        </div>

                        {/* Stats Bar */}
                        <StatsOverview totalAssets={filteredResources.length} onlineCount={onlineCount} />

                        {/* Resource Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                            {filteredResources.map((res) => (
                                <ResourceCard
                                    key={res.deviceId}
                                    device={res}
                                    isSelected={selectedResId === res.deviceId}
                                    onClick={() => setSelectedResId(res.deviceId === selectedResId ? null : res.deviceId)}
                                />
                            ))}

                            {filteredResources.length === 0 && (
                                <div className="col-span-full py-20 text-center border border-dashed border-borderColor rounded-sm">
                                    <p className="text-textMuted uppercase tracking-widest text-xs">No devices found in this view</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Pane 3: Details Panel */}
            <AnimatePresence>
                {selectedResId && (
                    <DetailsPanel
                        resource={selectedResource}
                        onClose={() => setSelectedResId(null)}
                    />
                )}
            </AnimatePresence>

        </div>
    )
}

export default Dashboard
