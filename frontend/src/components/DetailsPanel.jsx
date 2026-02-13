import { X, Cpu, HardDrive, Thermometer, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

const DetailsPanel = ({ resource, onClose }) => {
    if (!resource) return null;

    return (
        <motion.aside
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className="w-[400px] border-l border-borderColor bg-bgMain/90 backdrop-blur-sm flex flex-col fixed right-0 top-16 bottom-0 z-40 lg:flex"
        >
            <div className="p-8 border-b border-borderColor">
                <div className="flex justify-between items-center mb-8">
                    <span className="text-[10px] font-black text-textMain uppercase tracking-[0.4em]">Analytics.Log</span>
                    <button onClick={onClose} className="text-textMuted hover:text-textMain transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex items-center gap-6 mb-8">
                    <div className="w-16 h-16 bg-zinc-800/50 border border-borderColor flex items-center justify-center rounded-sm">
                        <Monitor className="w-8 h-8 text-textMuted" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-textMain tracking-tight">{resource.deviceId}</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <span className={`w-2 h-2 rounded-full ${resource.status === 'Online' ? 'bg-viyu-green animate-pulse' : 'bg-viyu-red'}`}></span>
                            <p className={`text-[10px] font-bold uppercase tracking-widest ${resource.status === 'Online' ? 'text-viyu-green' : 'text-viyu-red'}`}>
                                {resource.status === 'Online' ? 'System Operational' : 'Connection Lost'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button className="flex-1 bg-primary text-white text-[10px] font-black py-3 uppercase tracking-[0.2em] hover:brightness-110 transition-all rounded-sm">
                        Initialize Control
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                {/* Fake Stats */}
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <p className="text-[10px] font-black text-textMuted uppercase tracking-widest">CPU Utilization</p>
                        <span className="text-[10px] text-zinc-600 font-mono uppercase">Peak: 45%</span>
                    </div>
                    <h4 className="text-3xl font-black text-textMain mb-4">12%</h4>
                    <div className="w-full h-1 bg-zinc-900 overflow-hidden rounded-full">
                        <div className="h-full bg-primary w-[12%]"></div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="pt-4 border-t border-borderColor/50">
                    <h5 className="text-[10px] font-black text-textMain uppercase tracking-[0.3em] mb-6">Activity Stream</h5>
                    <div className="space-y-6 relative pl-4 border-l border-borderColor ml-1">
                        <div className="relative pl-6">
                            <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-bgMain border border-primary"></div>
                            <p className="text-xs font-bold text-textMain">Heartbeat Received</p>
                            <span className="text-[9px] text-zinc-600 uppercase tracking-widest block mt-1">Just now</span>
                        </div>
                        <div className="relative pl-6 opacity-60">
                            <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-bgMain border border-zinc-600"></div>
                            <p className="text-xs font-bold text-textMuted">Session Started</p>
                            <span className="text-[9px] text-zinc-600 uppercase tracking-widest block mt-1">10 mins ago</span>
                        </div>
                    </div>
                </div>
            </div>
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
