import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { SidebarClose, UserPlus, Users, Check, X, Shield, Lock, Copy, Edit, Building, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const UserManagement = () => {
    const { token, currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [labs, setLabs] = useState([]);

    // UI State
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showScopeModal, setShowScopeModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Create Form State (Scope removed)
    const [createFormData, setCreateFormData] = useState({
        name: '',
        email: '',
        role: 'admin'
    });
    const [createdUserCreds, setCreatedUserCreds] = useState(null);

    // Scope Assignment State
    const [scopeFormData, setScopeFormData] = useState({
        assignedBlocks: [],
        assignedLabs: []
    });

    const headers = { Authorization: `Bearer ${token}` };

    // Fetch Data
    const fetchData = async () => {
        try {
            const [usersRes, blocksRes, labsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/users', { headers }),
                axios.get('http://localhost:5000/api/structure/blocks', { headers }),
                axios.get('http://localhost:5000/api/structure/labs', { headers })
            ]);
            setUsers(usersRes.data);
            setBlocks(blocksRes.data);
            setLabs(labsRes.data);
        } catch (error) {
            console.error("Fetch Data Error:", error);
            toast.error("Failed to load system data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchData();
    }, [token]);

    // --- Actions ---

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('http://localhost:5000/api/users/create', createFormData, { headers });

            toast.success(data.message); // "Please assign scope next"
            setCreatedUserCreds({
                email: data.user.email,
                password: data.temporaryPassword,
                role: data.user.role
            });
            setShowCreateForm(false);
            setCreateFormData({ name: '', email: '', role: 'admin' });
            fetchData(); // Refresh list

        } catch (error) {
            console.error("Create User Error:", error);
            const msg = error.response?.data?.message || "Failed to create user";
            toast.error(msg);
        }
    };

    // Edit User State
    const [showEditModal, setShowEditModal] = useState(false);
    const [editFormData, setEditFormData] = useState({
        _id: '',
        name: '',
        email: '',
        isActive: true,
        password: '' // Optional: only if setting manually
    });

    const openEditModal = (user) => {
        setEditFormData({
            _id: user._id,
            name: user.name,
            email: user.email,
            isActive: user.isActive,
            password: ''
        });
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: editFormData.name,
                email: editFormData.email,
                isActive: editFormData.isActive
            };
            if (editFormData.password) {
                payload.password = editFormData.password;
            }

            await axios.put(`http://localhost:5000/api/users/${editFormData._id}`, payload, { headers });

            toast.success("User updated successfully");
            if (editFormData.password) {
                toast.success("Password updated manually");
            }
            setShowEditModal(false);
            fetchData();
        } catch (error) {
            console.error("Update User Error:", error);
            toast.error(error.response?.data?.message || "Failed to update user");
        }
    };

    const handleResetPassword = async () => {
        if (!editFormData._id) return;
        if (!window.confirm("Are you sure you want to reset this user's password? It will be auto-generated.")) return;

        try {
            const { data } = await axios.post(`http://localhost:5000/api/users/${editFormData._id}/reset-password`, {}, { headers });
            setCreatedUserCreds({
                email: editFormData.email,
                password: data.temporaryPassword,
                role: 'User' // Generic
            });
            toast.success("Password reset successfully");
            setShowEditModal(false);
            // Show the creds alert
        } catch (error) {
            console.error("Reset Password Error:", error);
            toast.error("Failed to reset password");
        }
    };

    const openScopeModal = (user) => {
        setSelectedUser(user);
        // Direct string mapping, no _id checks needed for strings as backend now stores strings
        setScopeFormData({
            assignedBlocks: user.assignedBlocks || [],
            assignedLabs: user.assignedLabs || []
        });
        setShowScopeModal(true);
    };

    const handleScopeSubmit = async (e) => {
        e.preventDefault();
        if (!selectedUser) return;

        try {
            await axios.put(`http://localhost:5000/api/users/${selectedUser._id}/assign-scope`, scopeFormData, { headers });
            toast.success("Scope updated successfully");
            setShowScopeModal(false);
            setSelectedUser(null);
            fetchData();
        } catch (error) {
            console.error("Scope Assignment Error:", error);
            toast.error(error.response?.data?.message || "Failed to update scope");
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    // --- Render Helpers ---

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

                        {/* Header */}
                        <div className="flex justify-between items-end mb-10">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight mb-2">User Provisioning</h1>
                                <p className="text-textMuted">Create users and assign their operational scope.</p>
                            </div>
                            <button
                                onClick={() => { setShowCreateForm(!showCreateForm); setCreatedUserCreds(null); }}
                                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors border border-primary/20"
                            >
                                {showCreateForm ? <X className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                                {showCreateForm ? "Cancel" : "Create New User"}
                            </button>
                        </div>

                        {/* Recent Success Alert */}
                        {createdUserCreds && (
                            <div className="mb-8 p-6 bg-viyu-green/10 border border-viyu-green/20 rounded-xl relative overflow-hidden animate-in fade-in slide-in-from-top-2">
                                <div className="absolute top-0 right-0 p-4 opacity-50"><Shield className="w-12 h-12 text-viyu-green" /></div>
                                <h3 className="text-lg font-bold text-viyu-green mb-4 flex items-center gap-2">
                                    <Check className="w-5 h-5" /> Account Created
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                                    <div className="bg-bgMain p-4 rounded-lg border border-borderColor">
                                        <div className="flex justify-between items-center">
                                            <code className="text-sm font-mono">{createdUserCreds.email}</code>
                                            <button onClick={() => copyToClipboard(createdUserCreds.email)}><Copy className="w-4 h-4 text-textMuted hover:text-white" /></button>
                                        </div>
                                    </div>
                                    <div className="bg-bgMain p-4 rounded-lg border border-borderColor">
                                        <div className="flex justify-between items-center">
                                            <code className="text-lg font-mono text-primary font-bold">{createdUserCreds.password}</code>
                                            <button onClick={() => copyToClipboard(createdUserCreds.password)}><Copy className="w-4 h-4 text-textMuted hover:text-white" /></button>
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-4 text-xs text-textMuted flex items-center gap-1">
                                    <Lock className="w-3 h-3" /> Important: Password will not be shown again.
                                </p>
                            </div>
                        )}

                        {/* create Form */}
                        {showCreateForm && (
                            <div className="mb-10 p-8 bg-cardBg border border-borderColor rounded-xl animate-in fade-in slide-in-from-top-4">
                                <h3 className="text-xl font-semibold mb-6">Step 1: Account Details</h3>
                                <form onSubmit={handleCreateSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-textMuted uppercase">Full Name</label>
                                        <input required className="w-full bg-bgMain border border-borderColor rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
                                            value={createFormData.name} onChange={e => setCreateFormData({ ...createFormData, name: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-textMuted uppercase">Email</label>
                                        <input required type="email" className="w-full bg-bgMain border border-borderColor rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
                                            value={createFormData.email} onChange={e => setCreateFormData({ ...createFormData, email: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-textMuted uppercase">Role</label>
                                        <select className="w-full bg-bgMain border border-borderColor rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
                                            value={createFormData.role} onChange={e => setCreateFormData({ ...createFormData, role: e.target.value })}>
                                            <option value="admin">Admin (Block Manager)</option>
                                            <option value="faculty">Faculty (Lab Access)</option>
                                            <option value="maintenance">Maintenance</option>
                                        </select>
                                    </div>
                                    <div className="col-span-full pt-2">
                                        <button type="submit" className="bg-white text-black font-semibold px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                                            Create User
                                        </button>
                                        <span className="ml-4 text-sm text-textMuted">Scope assignment happens after creation.</span>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* User List Table */}
                        <div className="bg-cardBg border border-borderColor rounded-xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-[#18181b] text-textMuted text-xs uppercase tracking-wider border-b border-borderColor">
                                    <tr>
                                        <th className="p-4 font-medium">User</th>
                                        <th className="p-4 font-medium">Role</th>
                                        <th className="p-4 font-medium">Scope (Block/Lab)</th>
                                        <th className="p-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-borderColor">
                                    {users.map(user => (
                                        <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-4">
                                                <div className="font-medium text-textMain flex items-center gap-2">
                                                    {user.name}
                                                    {!user.isActive && <span className="text-[10px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded uppercase font-bold">Inactive</span>}
                                                </div>
                                                <div className="text-xs text-textMuted">{user.email}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                    ${user.role === 'superadmin' ? 'bg-indigo-500/10 text-indigo-400' :
                                                        user.role === 'admin' ? 'bg-purple-500/10 text-purple-400' :
                                                            user.role === 'faculty' ? 'bg-emerald-500/10 text-emerald-400' :
                                                                'bg-zinc-500/10 text-zinc-400'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {user.role === 'superadmin' ? (
                                                    <span className="text-xs text-textMuted italic">Global Access</span>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-sm">
                                                        {user.role === 'faculty' ? (
                                                            <>
                                                                <BookOpen className="w-4 h-4 text-emerald-500" />
                                                                {user.assignedLabs?.length > 0
                                                                    ? user.assignedLabs.map(l => l.name || l).join(', ')
                                                                    : <span className="text-red-400 text-xs">Unassigned</span>}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Building className="w-4 h-4 text-purple-500" />
                                                                {user.assignedBlocks?.length > 0
                                                                    ? user.assignedBlocks.map(b => b.name || b).join(', ')
                                                                    : <span className="text-red-400 text-xs">Unassigned</span>}
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">
                                                {user.role !== 'superadmin' && (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => openEditModal(user)}
                                                            className="p-1.5 rounded hover:bg-white/10 text-textMuted hover:text-white transition-colors"
                                                            title="Edit Details"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => openScopeModal(user)}
                                                            className="text-xs font-medium text-primary hover:text-white transition-colors bg-primary/10 px-3 py-1 rounded border border-primary/20 hover:bg-primary/20"
                                                        >
                                                            Assign Scope
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && !loading && (
                                        <tr><td colSpan="4" className="p-8 text-center text-textMuted opacity-50">No users found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </main>

                {/* Edit Modal */}
                {showEditModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="bg-cardBg border border-borderColor rounded-xl w-full max-w-lg p-8 shadow-2xl animate-in zoom-in-95">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Edit User Details</h3>
                                <button onClick={() => setShowEditModal(false)}><X className="w-5 h-5 text-textMuted hover:text-white" /></button>
                            </div>

                            <form onSubmit={handleEditSubmit} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-textMuted uppercase">Full Name</label>
                                        <input required className="w-full bg-bgMain border border-borderColor rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
                                            value={editFormData.name} onChange={e => setEditFormData({ ...editFormData, name: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-textMuted uppercase">Email</label>
                                        <input required type="email" className="w-full bg-bgMain border border-borderColor rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
                                            value={editFormData.email} onChange={e => setEditFormData({ ...editFormData, email: e.target.value })} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={editFormData.isActive}
                                            onChange={e => setEditFormData({ ...editFormData, isActive: e.target.checked })}
                                            className="w-4 h-4 rounded border-gray-600 bg-transparent text-primary focus:ring-primary"
                                        />
                                        <span className="text-sm font-medium">User is Active</span>
                                    </label>
                                </div>

                                <div className="pt-4 border-t border-borderColor">
                                    <h4 className="text-sm font-bold mb-3 flex items-center gap-2"><Lock className="w-4 h-4" /> Security</h4>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <button
                                                type="button"
                                                onClick={handleResetPassword}
                                                className="text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-2 rounded border border-red-500/20 transition-colors"
                                            >
                                                Reset to Auto-Generated Password
                                            </button>
                                            <span className="text-xs text-textMuted">or set manually below</span>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-textMuted uppercase">Set New Password (Manual)</label>
                                            <input
                                                type="text"
                                                placeholder="Enter new password to override"
                                                className="w-full bg-bgMain border border-borderColor rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none text-sm placeholder:text-textMuted/50"
                                                value={editFormData.password}
                                                onChange={e => setEditFormData({ ...editFormData, password: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 rounded-lg border border-borderColor hover:bg-white/5 transition">Cancel</button>
                                    <button type="submit" className="flex-1 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition font-medium">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Scope Assignment Modal */}
                {showScopeModal && selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="bg-cardBg border border-borderColor rounded-xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Assign Scope</h3>
                                <button onClick={() => setShowScopeModal(false)}><X className="w-5 h-5 text-textMuted hover:text-white" /></button>
                            </div>

                            <div className="mb-6 p-4 bg-bgMain rounded-lg border border-borderColor">
                                <p className="text-sm"><span className="text-textMuted">User:</span> {selectedUser.name}</p>
                                <p className="text-sm"><span className="text-textMuted">Role:</span> <span className="capitalize">{selectedUser.role}</span></p>
                            </div>

                            <form onSubmit={handleScopeSubmit} className="space-y-6">
                                {selectedUser.role === 'faculty' ? (
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium">Select Lab (Faculty)</label>
                                        <div className="space-y-2 max-h-48 overflow-y-auto p-2 bg-bgMain rounded border border-borderColor">
                                            {labs.map(lab => (
                                                <label key={lab} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={scopeFormData.assignedLabs.includes(lab)}
                                                        onChange={e => {
                                                            const newLabs = e.target.checked
                                                                ? [...scopeFormData.assignedLabs, lab]
                                                                : scopeFormData.assignedLabs.filter(l => l !== lab);
                                                            setScopeFormData({ ...scopeFormData, assignedLabs: newLabs });
                                                        }}
                                                        className="w-4 h-4 rounded border-gray-600 bg-transparent text-primary focus:ring-primary"
                                                    />
                                                    <span className="text-sm">{lab}</span>
                                                </label>
                                            ))}
                                            {labs.length === 0 && <p className="text-xs text-textMuted">No Labs found in Resources.</p>}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium">Select Block (Admin/Maintenance)</label>
                                        <div className="space-y-2 max-h-48 overflow-y-auto p-2 bg-bgMain rounded border border-borderColor">
                                            {blocks.map(block => (
                                                <label key={block} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={scopeFormData.assignedBlocks.includes(block)}
                                                        onChange={e => {
                                                            const newBlocks = e.target.checked
                                                                ? [...scopeFormData.assignedBlocks, block]
                                                                : scopeFormData.assignedBlocks.filter(b => b !== block);
                                                            setScopeFormData({ ...scopeFormData, assignedBlocks: newBlocks });
                                                        }}
                                                        className="w-4 h-4 rounded border-gray-600 bg-transparent text-primary focus:ring-primary"
                                                    />
                                                    <span className="text-sm">{block}</span>
                                                </label>
                                            ))}
                                            {blocks.length === 0 && <p className="text-xs text-textMuted">No Blocks found in Resources.</p>}
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-4 pt-2">
                                    <button type="button" onClick={() => setShowScopeModal(false)} className="flex-1 px-4 py-2 rounded-lg border border-borderColor hover:bg-white/5 transition">Cancel</button>
                                    <button type="submit" className="flex-1 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition font-medium">Save Assignment</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default UserManagement;
