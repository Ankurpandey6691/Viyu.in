import { Activity, Wifi, AlertCircle } from 'lucide-react'

const StatsOverview = ({ totalAssets = 0, onlineCount = 0 }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Total Assets */}
            <div className="space-y-2">
                <p className="text-textMuted text-[10px] font-semibold uppercase tracking-[0.2em]">Total Connected Assets</p>
                <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold tracking-tighter text-textMain">{totalAssets}</span>
                    <span className="text-viyu-green text-xs font-medium flex items-center gap-1">
                        <Wifi className="w-3 h-3" /> Live
                    </span>
                </div>
            </div>

            {/* Network Load (Simulated) */}
            <div className="space-y-2">
                <p className="text-textMuted text-[10px] font-semibold uppercase tracking-[0.2em]">Network Load</p>
                <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold tracking-tighter text-textMain">24.8%</span>
                    <span className="text-textMuted text-xs font-medium">Stable</span>
                </div>
            </div>

            {/* Active Incidents */}
            <div className="space-y-2">
                <p className="text-textMuted text-[10px] font-semibold uppercase tracking-[0.2em]">Active Incidents</p>
                <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold tracking-tighter text-textMain">{totalAssets - onlineCount}</span>
                    <span className="text-viyu-red text-xs font-medium">Offline</span>
                </div>
            </div>
        </div>
    )
}

export default StatsOverview
