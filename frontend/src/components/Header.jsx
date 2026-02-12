import { Monitor } from 'lucide-react'

const Header = ({ lastSync, isConnected, onlineCount = 0 }) => {
    return (
        <header className="h-16 border-b border-borderColor bg-bgMain/80 backdrop-blur-md flex items-center justify-between px-8 z-30 sticky top-0">

            {/* Brand */}
            <div className="flex items-center gap-4">
                <div className="bg-primary/10 border border-primary/20 flex items-center justify-center w-8 h-8 rounded-sm">
                    <Monitor className="w-4 h-4 text-primary" />
                </div>
                <h1 className="text-sm font-bold tracking-[0.2em] text-textMain uppercase">
                    System.Monitor <span className="text-textMuted font-light ml-2">v4.0</span>
                </h1>
            </div>

            {/* Status Bar */}
            <div className="flex items-center gap-8">
                <div className="flex gap-6 text-[10px] font-semibold tracking-widest text-textMuted hidden sm:flex">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>{onlineCount} NOMINAL</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-zinc-600' : 'bg-rose-500'}`}></span>
                        <span>{isConnected ? 'SOCKET ACTIVE' : 'DISCONNECTED'}</span>
                    </div>
                </div>

                <div className="h-6 w-px bg-borderColor hidden sm:block"></div>

                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-sm bg-zinc-800 border border-borderColor flex items-center justify-center text-textMain text-[10px] font-bold">
                        AD
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
