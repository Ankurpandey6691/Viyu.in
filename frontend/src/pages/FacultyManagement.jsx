import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Users, Search, Edit, Trash2, Check, X } from 'lucide-react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import toast from 'react-hot-toast';

const FacultyManagement = () => {
    const { token } = useAuth();
    const [faculty, setFaculty] = useState([]);
    const [labs, setLabs] = useState([]); // Labs available in Admin's block
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    // Form States
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'faculty',
        assignedLabs: []
    });
    const [editData, setEditData] = useState(null);
    const [createdCreds, setCreatedCreds] = useState(null);

    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
        try {
            const [facultyRes, labsRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/api/admin/faculty`, { headers }),
                axios.get(`${import.meta.env.VITE_API_URL}/api/admin/labs`, { headers })
            ]);
            setFaculty(facultyRes.data);
            setLabs(labsRes.data);
        } catch (error) {
            console.error("Fetch Data Error:", error);
            toast.error("Failed to load faculty data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchData();
    }, [token]);

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/create`, formData, { headers });
            setCreatedCreds({
                email: data.user.email,
                password: data.temporaryPassword
            });
            toast.success("Faculty created successfully");
            setShowCreateModal(false);
            setFormData({ name: '', email: '', role: 'faculty', assignedLabs: [] });
            fetchData();
        } catch (error) {
            console.error("Create User Error:", error);
            toast.error(error.response?.data?.message || "Failed to create faculty");
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/faculty/${editData._id}`, {
                assignedLabs: editData.assignedLabs,
                isActive: editData.isActive
            }, { headers });

            toast.success("Faculty updated successfully");
            setShowEditModal(false);
            fetchData();
        } catch (error) {
            console.error("Update User Error:", error);
            toast.error(error.response?.data?.message || "Failed to update faculty");
        }
    };

    return (
        <div className="flex h-screen bg-bgMain text-textMain">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header title="Faculty Management" />

                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto space-y-6">

                        {/* Actions Bar */}
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Users className="w-6 h-6 text-primary" />
                                Manage Faculty
                            </h2>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="bg-primary hover:bg-primaryHover text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <UserPlus className="w-4 h-4" />
                                Add Faculty
                            </button>
                        </div>

                        {/* Faculty List */}
                        <div className="bg-cardBg border border-borderColor rounded-xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-bgMain text-textMuted text-xs uppercase font-semibold">
                                    <tr>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Email</th>
                                        <th className="p-4">Assigned Labs</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-borderColor">
                                    {faculty.map(user => (
                                        <tr key={user._id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4 font-medium">{user.name}</td>
                                            <td className="p-4 text-textMuted">{user.email}</td>
                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.assignedLabs.map(lab => (
                                                        <span key={lab} className="bg-blue-500/10 text-blue-400 text-xs px-2 py-0.5 rounded">
                                                            {lab}
                                                        </span>
                                                    ))}
                                                    {user.assignedLabs.length === 0 && <span className="text-textMuted text-xs">Unassigned</span>}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${user.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                    {user.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => { setEditData(user); setShowEditModal(true); }}
                                                    className="text-textMuted hover:text-primary transition-colors p-2"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {faculty.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-textMuted">No faculty members found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </main>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-cardBg border border-borderColor rounded-xl w-full max-w-lg p-6 m-4 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Add New Faculty</h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-textMuted hover:text-textMain"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleCreateSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Full Name</label>
                                <input required className="w-full bg-bgMain border border-borderColor rounded-lg px-4 py-2 outline-none focus:border-primary"
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input required type="email" className="w-full bg-bgMain border border-borderColor rounded-lg px-4 py-2 outline-none focus:border-primary"
                                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Password (Optional)</label>
                                <input type="text" placeholder="Auto-generated if empty" className="w-full bg-bgMain border border-borderColor rounded-lg px-4 py-2 outline-none focus:border-primary placeholder:text-textMuted/50"
                                    value={formData.password || ''} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Assign Labs</label>
                                <div className="space-y-2 max-h-40 overflow-y-auto p-2 bg-bgMain rounded border border-borderColor">
                                    {labs.map(lab => (
                                        <label key={lab._id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.assignedLabs.includes(lab._id)}
                                                onChange={e => {
                                                    const newLabs = e.target.checked
                                                        ? [...formData.assignedLabs, lab._id]
                                                        : formData.assignedLabs.filter(l => l !== lab._id);
                                                    setFormData({ ...formData, assignedLabs: newLabs });
                                                }}
                                                className="w-4 h-4 rounded border-gray-600 bg-transparent text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm">{lab.name}</span>
                                        </label>
                                    ))}
                                    {labs.length === 0 && <p className="text-xs text-textMuted">No Labs found in your block.</p>}
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-textMuted hover:text-textMain">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary hover:bg-primaryHover text-white rounded-lg">Create Faculty</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && editData && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-cardBg border border-borderColor rounded-xl w-full max-w-lg p-6 m-4 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Edit Faculty</h3>
                            <button onClick={() => setShowEditModal(false)} className="text-textMuted hover:text-textMain"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input disabled value={editData.name} className="w-full bg-bgMain/50 text-textMuted border border-borderColor rounded-lg px-4 py-2 cursor-not-allowed" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" checked={editData.isActive} onChange={() => setEditData({ ...editData, isActive: true })} className="text-primary" />
                                        <span>Active</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" checked={!editData.isActive} onChange={() => setEditData({ ...editData, isActive: false })} className="text-primary" />
                                        <span>Inactive</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Assign Labs</label>
                                <div className="space-y-2 max-h-40 overflow-y-auto p-2 bg-bgMain rounded border border-borderColor">
                                    {labs.map(lab => (
                                        <label key={lab._id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={editData.assignedLabs.includes(lab._id)}
                                                onChange={e => {
                                                    const newLabs = e.target.checked
                                                        ? [...editData.assignedLabs, lab._id]
                                                        : editData.assignedLabs.filter(l => l !== lab._id);
                                                    setEditData({ ...editData, assignedLabs: newLabs });
                                                }}
                                                className="w-4 h-4 rounded border-gray-600 bg-transparent text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm">{lab.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 text-textMuted hover:text-textMain">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary hover:bg-primaryHover text-white rounded-lg">Update Faculty</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Created Creds Alert */}
            {createdCreds && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]">
                    <div className="bg-cardBg border border-primary p-8 rounded-xl max-w-md text-center">
                        <Check className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Faculty Created!</h3>
                        <p className="text-textMuted mb-6">Please copy these credentials. They will not be shown again.</p>
                        <div className="bg-bgMain p-4 rounded-lg text-left mb-6 space-y-2 font-mono text-sm border border-borderColor">
                            <div><span className="text-textMuted">Email:</span> {createdCreds.email}</div>
                            <div><span className="text-textMuted">Password:</span> {createdCreds.password}</div>
                        </div>
                        <button onClick={() => setCreatedCreds(null)} className="w-full bg-primary hover:bg-primaryHover text-white py-2 rounded-lg">Done</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default FacultyManagement;
