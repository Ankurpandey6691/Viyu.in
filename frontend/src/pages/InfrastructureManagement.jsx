import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MapPin, Building, Plus, Trash2, Box, Layers, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const InfrastructureManagement = () => {
    const { token, currentUser } = useAuth();
    const [blocks, setBlocks] = useState([]);
    const [labs, setLabs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form States
    const [newBlockName, setNewBlockName] = useState('');
    const [newLabData, setNewLabData] = useState({ name: '', blockId: '' });

    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
        try {
            const [blocksRes, labsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/blocks', { headers }),
                axios.get('http://localhost:5000/api/labs', { headers })
            ]);
            setBlocks(blocksRes.data);
            setLabs(labsRes.data);
        } catch (error) {
            console.error("Fetch Data Error:", error);
            toast.error("Failed to load infrastructure data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchData();
    }, [token]);

    // --- Block Actions ---

    const handleCreateBlock = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/blocks/create', { name: newBlockName }, { headers });
            toast.success("Block created");
            setNewBlockName('');
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create block");
        }
    };

    const handleDeleteBlock = async (id) => {
        if (!window.confirm("Are you sure? This block must be empty.")) return;
        try {
            await axios.delete(`http://localhost:5000/api/blocks/${id}`, { headers });
            toast.success("Block deleted");
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete block");
        }
    };

    // --- Lab Actions ---

    const handleCreateLab = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/labs/create', newLabData, { headers });
            toast.success("Lab created");
            setNewLabData({ name: '', blockId: '' });
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create lab");
        }
    };

    const handleDeleteLab = async (id) => {
        if (!window.confirm("Are you sure? Check for assigned faculty first.")) return;
        try {
            await axios.delete(`http://localhost:5000/api/labs/${id}`, { headers });
            toast.success("Lab deleted");
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete lab");
        }
    };

    if (!currentUser || currentUser.role !== 'superadmin') {
        return <div className="p-10 text-center text-red-500">Access Denied</div>;
    }

    return (
        <div className="flex h-screen bg-bgMain text-textMain overflow-hidden font-sans selection:bg-primary/30">
            <Sidebar resources={[]} onSelect={() => { }} selectedFilter={{ type: 'all' }} />

            <div className="flex-1 flex flex-col h-full relative min-w-0">
                <Header isConnected={true} onlineCount={0} />

                <main className="flex-1 overflow-y-auto p-10 grid-bg custom-scrollbar relative">
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-10">
                            <h1 className="text-3xl font-bold tracking-tight mb-2">Infrastructure Management</h1>
                            <p className="text-textMuted">Define the physical layout (Blocks and Labs) of the campus.</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                            {/* BLOCK MANAGEMENT */}
                            <div className="bg-cardBg border border-borderColor rounded-xl p-6 h-fit">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-borderColor">
                                    <Building className="w-5 h-5 text-purple-400" />
                                    <h2 className="text-xl font-bold">Blocks</h2>
                                </div>

                                {/* Create Block */}
                                <form onSubmit={handleCreateBlock} className="flex gap-2 mb-6">
                                    <input
                                        type="text"
                                        placeholder="New Block Name (e.g. A-Block)"
                                        className="flex-1 bg-bgMain border border-borderColor rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
                                        value={newBlockName}
                                        onChange={(e) => setNewBlockName(e.target.value)}
                                        required
                                    />
                                    <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-lg transition">
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </form>

                                {/* List Blocks */}
                                <div className="space-y-3">
                                    {blocks.map(block => (
                                        <div key={block._id} className="flex justify-between items-center p-3 bg-bgMain rounded border border-borderColor group hover:border-purple-500/50 transition">
                                            <div className="flex items-center gap-3">
                                                <Box className="w-4 h-4 text-textMuted" />
                                                <span className="font-medium">{block.name}</span>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteBlock(block._id)}
                                                className="text-textMuted hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                                                title="Delete Block"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {blocks.length === 0 && <p className="text-sm text-textMuted italic text-center py-4">No blocks defined.</p>}
                                </div>
                            </div>

                            {/* LAB MANAGEMENT */}
                            <div className="bg-cardBg border border-borderColor rounded-xl p-6 h-fit">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-borderColor">
                                    <Layers className="w-5 h-5 text-emerald-400" />
                                    <h2 className="text-xl font-bold">Labs</h2>
                                </div>

                                {/* Create Lab */}
                                <form onSubmit={handleCreateLab} className="space-y-3 mb-6">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="New Lab Name"
                                            className="flex-1 bg-bgMain border border-borderColor rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
                                            value={newLabData.name}
                                            onChange={(e) => setNewLabData({ ...newLabData, name: e.target.value })}
                                            required
                                        />
                                        <select
                                            className="bg-bgMain border border-borderColor rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none max-w-[150px]"
                                            value={newLabData.blockId}
                                            onChange={(e) => setNewLabData({ ...newLabData, blockId: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Block</option>
                                            {blocks.map(b => (
                                                <option key={b._id} value={b._id}>{b.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg transition flex items-center justify-center gap-2">
                                        <Plus className="w-4 h-4" /> Add Lab
                                    </button>
                                </form>

                                {/* List Labs */}
                                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                                    {labs.map(lab => (
                                        <div key={lab._id} className="flex justify-between items-center p-3 bg-bgMain rounded border border-borderColor group hover:border-emerald-500/50 transition">
                                            <div>
                                                <div className="font-medium">{lab.name}</div>
                                                <div className="text-xs text-textMuted flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {lab.block?.name || <span className="text-red-400 text-[10px]">Orphaned</span>}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteLab(lab._id)}
                                                className="text-textMuted hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                                                title="Delete Lab"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {labs.length === 0 && <p className="text-sm text-textMuted italic text-center py-4">No labs defined.</p>}
                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default InfrastructureManagement;
