import { motion } from 'framer-motion'
import { Monitor, WifiOff } from 'lucide-react'
import clsx from 'clsx'

const ResourceCard = ({ device, onClick, isSelected }) => {
    const isOnline = device.status === 'Online';

    return (
        <motion.div
            layout
            onClick={onClick}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2, borderColor: '#3F3F46' }}
            className={clsx(
                "slab-card p-6 relative overflow-hidden group cursor-pointer border",
                isSelected ? "border-primary ring-1 ring-primary/50 bg-primary/5" : "border-borderColor bg-cardBg"
            )}
        >
            {/* Top Badge */}
            <div className="absolute top-0 right-0 p-6">
                <span className={clsx(
                    "text-[9px] font-black tracking-[0.2em] px-2 py-1 border",
                    isOnline
                        ? "text-viyu-green bg-viyu-green/5 border-viyu-green/20"
                        : "text-viyu-red bg-viyu-red/5 border-viyu-red/20"
                )}>
                    {isOnline ? 'ACTIVE' : 'OFFLINE'}
                </span>
            </div>

            {/* Main Icon & Title */}
            <div className="mb-8">
                <div className={clsx(
                    "w-12 h-12 flex items-center justify-center mb-6 border transition-colors",
                    isOnline
                        ? "bg-viyu-green/10 border-viyu-green/20 text-viyu-green"
                        : "bg-viyu-red/10 border-viyu-red/20 text-viyu-red"
                )}>
                    {isOnline ? <Monitor className="w-6 h-6" /> : <WifiOff className="w-6 h-6" />}
                </div>
                <h3 className="text-xl font-black text-textMain tracking-tight mb-1">{device.deviceId}</h3>
                <p className="text-[9px] text-textMuted font-mono uppercase tracking-widest">
                    192.168.1.1{device.deviceId.slice(-2)} · Node_Alpha
                </p>
            </div>

            {/* Grid Stats */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-borderColor/50">
                <div>
                    <p className="text-[8px] text-textMuted uppercase font-black tracking-[0.2em] mb-1">CPU LOAD</p>
                    <p className="text-sm font-medium text-textMain">12.5%</p>
                </div>
                <div>
                    <p className="text-[8px] text-textMuted uppercase font-black tracking-[0.2em] mb-1">MEMORY</p>
                    <p className="text-sm font-medium text-textMain">4.2 GB</p>
                </div>
                <div>
                    <p className="text-[8px] text-textMuted uppercase font-black tracking-[0.2em] mb-1">TEMP</p>
                    <p className="text-sm font-medium text-textMain">42°C</p>
                </div>
                <div>
                    <p className="text-[8px] text-textMuted uppercase font-black tracking-[0.2em] mb-1">UPTIME</p>
                    <p className="text-sm font-medium text-textMain">12d 4h</p>
                </div>
            </div>
        </motion.div>
    )
}

export default ResourceCard
