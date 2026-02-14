import { motion } from 'framer-motion'
import { Monitor, WifiOff, AlertCircle } from 'lucide-react'
import clsx from 'clsx'

const ResourceCard = ({ device, onClick, isSelected, labSessionActive }) => {
    const isOnline = device.status === 'Online';

    // Smart Monitoring Logic
    // Defect = Offline AND Session Active AND Working Hours (9-5)
    // Note: We'll assume "Working Hours" for now are always true if session is active, or we can check time.
    // User requirement: "Session Active AND Working Hours".
    // DEMO FIX: Forcing working hours to TRUE so user can test at night.
    const now = new Date();
    const currentHour = now.getHours();
    // const isWorkingHours = currentHour >= 9 && currentHour < 17; // 9 AM to 5 PM
    const isWorkingHours = true; // Always true for demo

    const isDefect = !isOnline && labSessionActive && isWorkingHours;

    return (
        <motion.div
            layout
            onClick={onClick}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2, borderColor: '#3F3F46' }}
            className={clsx(
                "slab-card p-6 relative overflow-hidden group cursor-pointer border transition-all duration-300",
                isSelected ? "border-primary ring-1 ring-primary/50 bg-primary/5" : "border-borderColor bg-cardBg",
                isDefect && "animate-pulse border-orange-500/50 bg-orange-500/5" // Visual cue for defect
            )}
        >
            {/* Top Badge */}
            <div className="absolute top-0 right-0 p-6">
                <span className={clsx(
                    "text-[9px] font-black tracking-[0.2em] px-2 py-1 border",
                    isOnline
                        ? "text-viyu-green bg-viyu-green/5 border-viyu-green/20"
                        : isDefect
                            ? "text-orange-500 bg-orange-500/10 border-orange-500/20"
                            : "text-zinc-500 bg-zinc-500/10 border-zinc-500/20"
                )}>
                    {isOnline ? 'ACTIVE' : isDefect ? 'DEFECT' : 'OFFLINE'}
                </span>
            </div>

            {/* Main Icon & Title */}
            <div className="mb-8">
                <div className={clsx(
                    "w-12 h-12 flex items-center justify-center mb-6 border transition-colors",
                    isOnline
                        ? "bg-viyu-green/10 border-viyu-green/20 text-viyu-green"
                        : isDefect
                            ? "bg-orange-500/10 border-orange-500/20 text-orange-500"
                            : "bg-zinc-500/10 border-zinc-500/20 text-zinc-500"
                )}>
                    {isOnline ? <Monitor className="w-6 h-6" /> : isDefect ? <AlertCircle className="w-6 h-6" /> : <WifiOff className="w-6 h-6" />}
                </div>
                <h3 className="text-xl font-black text-textMain tracking-tight mb-1">{device.deviceId}</h3>
                <p className="text-[9px] text-textMuted font-mono uppercase tracking-widest">
                    192.168.1.1{device.deviceId.slice(-2)} · Node_Alpha
                </p>
            </div>


        </motion.div>
    )
}

export default ResourceCard
