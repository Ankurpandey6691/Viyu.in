import { Activity, Wifi, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const StatsOverview = ({ totalAssets = 0, onlineCount = 0, serverStats, isLoading }) => {

    // Chart Data
    const offlineCount = totalAssets - onlineCount;
    const data = [
        { name: 'Online', value: onlineCount, color: '#10B981' }, // viyu-green
        { name: 'Offline', value: offlineCount, color: '#EF4444' }, // red-500
    ];

    // Convert bytes to Mbps
    const formatSpeed = (bytes) => {
        if (!bytes) return '0 Mbps';
        const mbps = (bytes * 8) / (1024 * 1024);
        return `${mbps.toFixed(2)} Mbps`;
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-pulse">
                {[1, 2, 3].map(i => (
                    <div key={i} className="space-y-3">
                        <div className="h-3 w-32 bg-white/5 rounded"></div>
                        <div className="h-10 w-24 bg-white/10 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Asset Distribution Chart */}
            <div className="relative h-24 flex items-center justify-between bg-cardBg rounded-xl border border-borderColor p-4 overflow-hidden">
                <div className="z-10">
                    <p className="text-textMuted text-[10px] font-semibold uppercase tracking-[0.2em] mb-1">Total Assets</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tighter text-textMain">{totalAssets}</span>
                        <span className="text-xs text-textMuted">devices</span>
                    </div>
                </div>
                <div className="absolute right-0 top-0 h-full w-32 opacity-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={25}
                                outerRadius={35}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', fontSize: '12px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Network Traffic (Real-time) */}
            <div className="bg-cardBg rounded-xl border border-borderColor p-4 h-24 flex flex-col justify-center">
                <p className="text-textMuted text-[10px] font-semibold uppercase tracking-[0.2em] mb-2">Network Traffic</p>
                <div className="flex items-center gap-6">
                    <div>
                        <span className="text-[10px] text-textMuted block">DOWN</span>
                        <span className="text-lg font-mono font-bold text-viyu-green">{serverStats ? formatSpeed(serverStats.rx_sec) : '0.00 Mbps'}</span>
                    </div>
                    <div className="h-8 w-px bg-borderColor"></div>
                    <div>
                        <span className="text-[10px] text-textMuted block">UP</span>
                        <span className="text-lg font-mono font-bold text-blue-400">{serverStats ? formatSpeed(serverStats.tx_sec) : '0.00 Mbps'}</span>
                    </div>
                </div>
            </div>

            {/* Active Incidents */}
            <div className="bg-cardBg rounded-xl border border-borderColor p-4 h-24 flex items-center justify-between">
                <div>
                    <p className="text-textMuted text-[10px] font-semibold uppercase tracking-[0.2em] mb-1">Active Incidents</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tighter text-textMain">{totalAssets - onlineCount}</span>
                        <span className="text-xs text-textMuted">offline</span>
                    </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
            </div>
        </div>
    )
}

export default StatsOverview
