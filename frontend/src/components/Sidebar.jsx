import { ChevronRight, ChevronDown, MapPin, Monitor, Layers, School, Building2, Cpu, Wrench, BookOpen, Settings, LayoutDashboard, Users } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const Sidebar = ({ resources = [], onSelect, selectedFilter }) => {
    const [expandedNodes, setExpandedNodes] = useState(new Set(['Main Academic Block', 'CSE', 'Data Structures Lab']));

    // Group resources by Block -> Department -> Lab
    const hierarchy = useMemo(() => {
        const tree = {};
        resources.forEach(res => {
            const block = res.block || 'Unknown Block';
            const dept = res.department || 'General';
            // Handle populated lab object or fall back to string/default
            const labName = (typeof res.lab === 'object' && res.lab !== null) ? res.lab.name : res.lab;
            const lab = labName || 'General Lab';

            if (!tree[block]) tree[block] = {};
            if (!tree[block][dept]) tree[block][dept] = {};
            if (!tree[block][dept][lab]) tree[block][dept][lab] = [];

            tree[block][dept][lab].push(res);
        });
        return tree;
    }, [resources]);

    const toggleNode = (nodeName) => {
        const newSet = new Set(expandedNodes);
        if (newSet.has(nodeName)) {
            newSet.delete(nodeName);
        } else {
            newSet.add(nodeName);
        }
        setExpandedNodes(newSet);
    };

    const handleSelect = (e, type, value) => {
        e.stopPropagation();
        onSelect(type, value);
    };

    const isSelected = (value) => selectedFilter?.value === value;

    const DeptIcon = ({ name }) => {
        if (name.includes('CSE') || name.includes('IT')) return <Monitor className="w-3 h-3" />;
        if (name.includes('Mech')) return <Wrench className="w-3 h-3" />;
        if (name.includes('Arch')) return <Building2 className="w-3 h-3" />;
        if (name.includes('MBA')) return <BookOpen className="w-3 h-3" />;
        if (name.includes('ECE')) return <Cpu className="w-3 h-3" />;
        return <Layers className="w-3 h-3" />;
    }

    const { currentUser } = useAuth();

    return (
        <aside className="w-72 border-r border-borderColor bg-bgMain/90 backdrop-blur-sm flex flex-col p-6 hidden md:flex h-full overflow-y-auto custom-scrollbar">
            <div className="mb-8">
                {currentUser?.role === 'superadmin' && (
                    <div className="mb-6 pb-6 border-b border-borderColor">
                        <h2 className="text-[10px] font-black text-textMain uppercase tracking-[0.3em] mb-4 text-opacity-50">Admin Controls</h2>
                        <Link to="/dashboard/infrastructure" className="flex items-center gap-2 py-2 px-2 rounded hover:bg-white/5 text-textMuted hover:text-white transition-colors">
                            <Settings className="w-4 h-4" />
                            <span className="text-sm font-medium">Infrastructure</span>
                        </Link>
                        <Link to="/dashboard/users" className="flex items-center gap-2 py-2 px-2 rounded hover:bg-white/5 text-textMuted hover:text-white transition-colors">
                            <School className="w-4 h-4" />
                            <span className="text-sm font-medium">User Management</span>
                        </Link>
                    </div>
                )}

                {currentUser?.role === 'admin' && (
                    <div className="mb-6 pb-6 border-b border-borderColor">
                        <h2 className="text-[10px] font-black text-textMain uppercase tracking-[0.3em] mb-4 text-opacity-50">Block Management</h2>
                        <Link to="/dashboard/admin" className="flex items-center gap-2 py-2 px-2 rounded hover:bg-white/5 text-textMuted hover:text-white transition-colors">
                            <LayoutDashboard className="w-4 h-4" />
                            <span className="text-sm font-medium">Overview</span>
                        </Link>
                        <Link to="/dashboard/faculty" className="flex items-center gap-2 py-2 px-2 rounded hover:bg-white/5 text-textMuted hover:text-white transition-colors">
                            <Users className="w-4 h-4" />
                            <span className="text-sm font-medium">Faculty</span>
                        </Link>
                        {/* Link to view Labs is implicit in the tree below, typically */}
                    </div>
                )}

                {/* Show Hierarchy for everyone, but maybe filtered for Admin? 
                    For now, keep full hierarchy as "Infrastructure" implies physical layout.
                    Admin can click on their block in the tree.
                */}
                <h2 className="text-[10px] font-black text-textMain uppercase tracking-[0.3em] mb-6 text-opacity-50">Infrastructure</h2>

                {/* Root Node: SVVV */}
                <div
                    className="flex items-center gap-2 mb-4 text-primary cursor-pointer hover:bg-primary/10 p-2 rounded transition-colors"
                    onClick={(e) => handleSelect(e, 'all', null)}
                >
                    <School className="w-4 h-4" />
                    <span className="text-sm font-bold tracking-tight">SVVV College</span>
                </div>

                <div className="space-y-1">
                    {Object.entries(hierarchy).map(([blockName, depts]) => (
                        <div key={blockName} className="relative">
                            {/* Block Node */}
                            <div
                                className={`flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer group transition-colors ${isSelected(blockName) ? 'bg-primary/20 text-textMain' : 'hover:bg-white/5 text-textMuted'}`}
                                onClick={(e) => {
                                    toggleNode(blockName);
                                    handleSelect(e, 'block', blockName);
                                }}
                            >
                                {expandedNodes.has(blockName) ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                <MapPin className="w-3 h-3" />
                                <span className="text-xs font-bold tracking-wide uppercase">{blockName}</span>
                            </div>

                            {expandedNodes.has(blockName) && (
                                <div className="ml-2 pl-3 border-l border-borderColor space-y-1 mt-1">
                                    {Object.entries(depts).map(([deptName, labs]) => (
                                        <div key={deptName}>
                                            {/* Dept Node */}
                                            <div
                                                className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer group transition-colors ${isSelected(deptName) ? 'bg-primary/15 text-textMain' : 'hover:bg-white/5 text-textMuted'}`}
                                                onClick={(e) => {
                                                    toggleNode(deptName);
                                                    handleSelect(e, 'department', deptName);
                                                }}
                                            >
                                                {expandedNodes.has(deptName) ? <ChevronDown className="w-3 h-3 opacity-50" /> : <ChevronRight className="w-3 h-3 opacity-50" />}
                                                <DeptIcon name={deptName} />
                                                <span className="text-xs font-medium tracking-wide">{deptName}</span>
                                            </div>

                                            {expandedNodes.has(deptName) && (
                                                <div className="ml-2 pl-3 border-l border-borderColor/50 space-y-0.5 mt-1 mb-2">
                                                    {Object.entries(labs).map(([labName, devices]) => (
                                                        <div
                                                            key={labName}
                                                            className={`flex items-center justify-between py-1 px-2 rounded cursor-pointer group transition-colors ${isSelected(labName) ? 'bg-primary text-white' : 'hover:bg-white/5 text-textMuted'}`}
                                                            onClick={(e) => handleSelect(e, 'lab', labName)}
                                                        >
                                                            <span className="text-[11px] group-hover:text-textMain transition-colors">{labName}</span>
                                                            <span className={`text-[9px] font-mono px-1 rounded ${isSelected(labName) ? 'text-white bg-white/20' : 'text-zinc-600 bg-zinc-900 group-hover:bg-zinc-800'}`}>
                                                                {devices.length}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </aside>
    )
}

export default Sidebar
