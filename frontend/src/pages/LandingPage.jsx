import { useNavigate } from 'react-router-dom'
import { Activity, Shield, Zap, ArrowRight, Monitor } from 'lucide-react'

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-bgMain text-textMain font-sans min-h-screen selection:bg-primary/30 relative">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-borderColor bg-bgMain/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                                <Monitor className="text-bgMain w-4 h-4" />
                            </div>
                            <span className="font-semibold text-sm tracking-tight text-white uppercase">Optimizer</span>
                        </div>
                        <div className="hidden md:flex items-center gap-6 text-[13px] font-medium text-textMuted">
                            <a href="#" className="hover:text-white transition-colors">Features</a>
                            <a href="#" className="hover:text-white transition-colors">Infrastructure</a>
                            <a href="#" className="hover:text-white transition-colors">Integrations</a>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="text-[13px] font-medium text-textMuted hover:text-white transition-colors"
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-white text-bgMain px-4 py-1.5 rounded text-[13px] font-semibold hover:bg-zinc-200 transition-all"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-16 border-b border-borderColor">
                {/* Background Effects */}
                <div className="absolute inset-0 grid-bg opacity-30"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent_50%)]"></div>

                <div className="max-w-7xl mx-auto px-6 w-full z-10 text-center flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-borderColor text-[12px] font-medium text-textMuted mb-10">
                        <span className="w-1.5 h-1.5 rounded-full bg-viyu-green animate-pulse"></span>
                        v4.0 Engine is now live
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-12 text-white">
                        Programmable <br /> Classrooms.
                    </h1>

                    <p className="text-lg md:text-xl text-textMuted mb-12 leading-relaxed max-w-2xl mx-auto">
                        The world's most advanced resource optimization layer. Automate HVAC, lighting, and occupancy across your entire campus with a single API.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-8 py-3 bg-white text-bgMain rounded font-bold text-sm hover:bg-zinc-200 transition-all"
                        >
                            Deploy Infrastructure
                        </button>
                        <button className="px-8 py-3 border border-borderColor bg-zinc-900 text-white rounded font-bold text-sm hover:bg-borderColor transition-all">
                            Book Technical Demo
                        </button>
                    </div>
                </div>

                {/* Dashboard Preview Mockup */}
                <div className="mt-20 w-full max-w-5xl px-4 relative z-10">
                    <div className="relative rounded-xl border border-borderColor bg-bgMain shadow-2xl overflow-hidden aspect-video group">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bgMain/80 z-20 pointer-events-none"></div>
                        {/* Placeholder for functionality - re-using the design language */}
                        <div className="p-8 grid grid-cols-3 gap-8 opacity-50 blur-[1px] group-hover:blur-0 transition-all duration-700">
                            <div className="col-span-1 h-full bg-zinc-900/50 border border-borderColor rounded-lg"></div>
                            <div className="col-span-2 space-y-4">
                                <div className="h-32 bg-zinc-900/50 border border-borderColor rounded-lg"></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-40 bg-zinc-900/50 border border-borderColor rounded-lg"></div>
                                    <div className="h-40 bg-zinc-900/50 border border-borderColor rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center z-30">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-bold shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all transform hover:scale-105"
                            >
                                Enter Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="py-32 px-6 border-b border-borderColor bg-bgMain">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
                    <div className="space-y-6">
                        <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
                            <Zap className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Edge Inference</h3>
                        <p className="text-textMuted leading-relaxed">Local gateways process sensor data in &lt;10ms, allowing for instant lighting and climate adjustments.</p>
                    </div>
                    <div className="space-y-6">
                        <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
                            <Activity className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Unified Control</h3>
                        <p className="text-textMuted leading-relaxed">Manage thousands of nodes across multiple campuses through a single, performant dashboard.</p>
                    </div>
                    <div className="space-y-6">
                        <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
                            <Shield className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Hardened Security</h3>
                        <p className="text-textMuted leading-relaxed">End-to-end mTLS encryption and hardware-level root of trust ensure infrastructure integrity.</p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default LandingPage
