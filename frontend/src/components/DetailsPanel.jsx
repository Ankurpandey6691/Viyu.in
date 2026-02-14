import { X, Cpu, HardDrive, Thermometer, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

const DetailsPanel = ({ resource, onClose, activityLog = [] }) => {

    // Helper for formatting time
    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <motion.aside
            animate={{ x: 0, opacity: 1 }}
            className="w-[350px] border-l border-borderColor bg-bgMain/95 backdrop-blur-sm flex flex-col z-40 shadow-xl h-full flex-shrink-0"
        >
            {/* --- STATE 1: RESOURCE DETAILS --- */}
            {resource ? (
                <>
                    <div className="p-6 border-b border-borderColor">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-[10px] font-black text-textMain uppercase tracking-[0.4em]">Analytics.Log</span>
                            <button onClick={onClose} className="text-textMuted hover:text-textMain transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-zinc-800/50 border border-borderColor flex items-center justify-center rounded-sm">
                                <Monitor className="w-6 h-6 text-textMuted" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-textMain tracking-tight">{resource.deviceId}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`w-2 h-2 rounded-full ${resource.status === 'Online' ? 'bg-viyu-green animate-pulse' : 'bg-viyu-red'}`}></span>
                                    <p className={`text-[9px] font-bold uppercase tracking-widest ${resource.status === 'Online' ? 'text-viyu-green' : 'text-viyu-red'}`}>
                                        {resource.status === 'Online' ? 'System Operational' : 'Connection Lost'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button className="flex-1 bg-primary text-white text-[10px] font-black py-2 uppercase tracking-[0.2em] hover:brightness-110 transition-all rounded-sm">
                                Initialize Control
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                        {/* Real-time Stats */}
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <p className="text-[10px] font-black text-textMuted uppercase tracking-widest">CPU Utilization</p>
                                <span className="text-[10px] text-zinc-600 font-mono uppercase">
                                    {resource.status === 'Online' ? 'Live' : 'Offline'}
                                </span>
                            </div>
                            <h4 className="text-2xl font-black text-textMain mb-3">
                                {resource.status === 'Online' && resource.metrics?.cpu ? resource.metrics.cpu : 'N/A'}
                            </h4>
                            <div className="w-full h-1 bg-zinc-900 overflow-hidden rounded-full">
                                <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{ width: resource.status === 'Online' && resource.metrics?.cpu ? resource.metrics.cpu : '0%' }}
                                ></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <p className="text-[10px] font-black text-textMuted uppercase tracking-widest">Memory Usage</p>
                            </div>
                            <h4 className="text-2xl font-black text-textMain mb-3">
                                {resource.status === 'Online' && resource.metrics?.ram ? resource.metrics.ram : 'N/A'}
                            </h4>
                            <div className="w-full h-1 bg-zinc-900 overflow-hidden rounded-full">
                                <div
                                    className="h-full bg-purple-500 transition-all duration-500"
                                    style={{ width: resource.status === 'Online' ? '60%' : '0%' }} // Mocking RAM bar for now as RAM is string "X GB"
                                ></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <p className="text-[10px] font-black text-textMuted uppercase tracking-widest">Temperature</p>
                            </div>
                            <h4 className="text-2xl font-black text-textMain mb-3">
                                {resource.status === 'Online' && resource.metrics?.temp ? resource.metrics.temp : 'N/A'}
                            </h4>
                            <div className="w-full h-1 bg-zinc-900 overflow-hidden rounded-full">
                                <div
                                    className="h-full bg-orange-500 transition-all duration-500"
                                    style={{ width: resource.status === 'Online' ? '40%' : '0%' }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                /* --- STATE 2: LIVE ACTIVITY LOG --- */
                <>
                    <div className="p-6 border-b border-borderColor bg-bgMain/50">
                        <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-primary animate-pulse" />
                            <h3 className="text-sm font-bold text-textMain">Live System Activity</h3>
                        </div>
                        <p className="text-[10px] text-textMuted uppercase tracking-widest pl-6">Real-time Event Stream</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-0 custom-scrollbar">
                        <div className="relative">
                            {/* Vertical Line */}
                            <div className="absolute left-6 top-0 bottom-0 w-px bg-borderColor/50"></div>

                            {activityLog.length === 0 && (
                                <div className="p-8 text-center">
                                    <p className="text-textMuted text-xs italic">Waiting for events...</p>
                                </div>
                            )}

                            {activityLog.map((log, index) => (
                                <div key={log.id || index} className="relative pl-10 pr-6 py-4 border-b border-borderColor/10 hover:bg-white/5 transition-colors group">
                                    {/* Dot */}
                                    <div className={`absolute left-[21px] top-5 w-1.5 h-1.5 rounded-full border ${log.type === 'status' && log.status === 'Online' ? 'bg-viyu-green border-viyu-green' :
                                        log.type === 'status' && log.status !== 'Online' ? 'bg-viyu-red border-viyu-red' :
                                            'bg-blue-500 border-blue-500'
                                        }`}></div>

                                    <div className="flex justify-between items-start mb-1">
                                        <p className="text-xs font-bold text-textMain">
                                            {log.type === 'status' ? (
                                                <>Device <span className="font-mono text-primary">{log.deviceId}</span> {log.status === 'Online' ? 'Connected' : 'Disconnected'}</>
                                            ) : (
                                                <>Session {log.active ? 'Generic' : 'Suspended'} in <span className="font-mono text-primary">{log.labCode}</span></>
                                            )}
                                        </p>
                                        <span className="text-[9px] text-textMuted font-mono">{formatTime(log.timestamp)}</span>
                                    </div>
                                    <p className="text-[10px] text-textMuted">
                                        {log.type === 'status'
                                            ? `Network node has changed operational state to ${log.status}.`
                                            : `Lab session status update received from controller.`}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </motion.aside>
    )
}

// Helper icon
const Monitor = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
    </svg>
)

export default DetailsPanel
