
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity, Shield, Zap, ArrowRight, Monitor, Server,
    Lock, Users, ChevronDown, ChevronUp, Globe, Cpu, Building2
} from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "How do I gain access to the dashboard?",
            answer: "Access is provisioned by the Superadmin. If you are a Faculty member or Block Manager, please contact the IT department to have your credentials created."
        },
        {
            question: "What is the difference between Admin and Faculty roles?",
            answer: "Admins (Block Managers) oversee entire building blocks and can manage infrastructure. Faculty members have access limited to their specific assigned laboratories for monitoring student workstations."
        },
        {
            question: "Is the monitoring real-time?",
            answer: "Yes. The system uses WebSocket connections to provide sub-second latency updates on device status, resource usage, and network connectivity."
        },
        {
            question: "Can I access this off-campus?",
            answer: "Yes, the platform is cloud-enabled. However, sensitive administrative actions may require connection through the campus VPN for security."
        }
    ];

    return (
        <div className="bg-bgMain text-textMain font-sans min-h-screen selection:bg-primary/30 relative flex flex-col">

            {/* --- Navigation --- */}
            <nav className="fixed top-0 w-full z-50 border-b border-borderColor bg-bgMain/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-gradient-to-tr from-primary to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                                <Monitor className="text-white w-5 h-5" />
                            </div>
                            <span className="font-bold text-lg tracking-tight text-white">Viyu.in</span>
                        </div>
                        <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-textMuted">
                            <a href="#features" className="hover:text-white transition-colors">Features</a>
                            <a href="#infrastructure" className="hover:text-white transition-colors">Infrastructure</a>
                            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-white text-bgMain px-5 py-2 rounded-full text-[13px] font-bold hover:bg-zinc-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                            Login / Dashboard
                        </button>
                    </div>
                </div>
            </nav>

            {/* --- Hero Section --- */}
            <header className="relative pt-32 pb-20 overflow-hidden border-b border-borderColor/50">
                {/* Background Glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-50 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] -z-10 opacity-30 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-borderColor text-[12px] font-medium text-textMuted mb-8 backdrop-blur-sm animate-fade-in-up">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-emerald-400">System Operational</span>
                        <span className="w-px h-3 bg-borderColor mx-1"></span>
                        <span>v0.1.0 Live</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-8 text-white max-w-4xl mx-auto">
                        The Operating System for your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Smart Campus</span>.
                    </h1>

                    <p className="text-lg md:text-xl text-textMuted mb-12 leading-relaxed max-w-2xl mx-auto">
                        Centralize your institution's infrastructure. Monitor computer labs, manage access control, and optimize resource usage from a single, unified command center.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="group flex items-center gap-2 px-8 py-4 bg-white text-bgMain rounded-full font-bold text-sm hover:bg-zinc-200 transition-all shadow-xl shadow-white/5"
                        >
                            Launch Dashboard
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-8 py-4 border border-borderColor bg-zinc-900/50 text-white rounded-full font-bold text-sm hover:bg-zinc-800 transition-all backdrop-blur-sm">
                            View Documentation
                        </button>
                    </div>
                </div>

                {/* Simulated Stats Strip */}
                <div className="mt-24 border-y border-borderColor bg-zinc-900/30 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center md:text-left">
                            <h4 className="text-3xl font-bold text-white mb-1">50+</h4>
                            <p className="text-xs text-textMuted uppercase tracking-wider">Active Labs</p>
                        </div>
                        <div className="text-center md:text-left">
                            <h4 className="text-3xl font-bold text-white mb-1">2,400+</h4>
                            <p className="text-xs text-textMuted uppercase tracking-wider">Connected Devices</p>
                        </div>
                        <div className="text-center md:text-left">
                            <h4 className="text-3xl font-bold text-emerald-400 mb-1">99.9%</h4>
                            <p className="text-xs text-textMuted uppercase tracking-wider">System Uptime</p>
                        </div>
                        <div className="text-center md:text-left">
                            <h4 className="text-3xl font-bold text-purple-400 mb-1">&lt; 50ms</h4>
                            <p className="text-xs text-textMuted uppercase tracking-wider">Data Latency</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- Features Section --- */}
            <section id="features" className="py-24 px-6 bg-bgMain relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Enterprise-Grade Control</h2>
                        <p className="text-textMuted max-w-2xl mx-auto">Built for scale. Viyu.in provides the tools administrators need to maintain oversight of complex educational environments.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={Activity}
                            title="Real-Time Monitoring"
                            desc="Watch your infrastructure breathe. Get second-by-second updates on CPU load, memory usage, and network activity across all nodes."
                        />
                        <FeatureCard
                            icon={Shield}
                            title="Role-Based Access"
                            desc="Strict hierarchy enforcement. Superadmins manage the platform, Admins oversee Blocks, and Faculty control specific Labs."
                        />
                        <FeatureCard
                            icon={Zap}
                            title="Instant Actions"
                            desc="Remote power management and system reset capabilities allow IT teams to resolve issues without physical intervention."
                        />
                        <FeatureCard
                            icon={Server}
                            title="Scalable Architecture"
                            desc="Designed to handle thousands of concurrent connections. Add new blocks and labs seamlessly as your campus grows."
                        />
                        <FeatureCard
                            icon={Lock}
                            title="Secure by Default"
                            desc="Enterprise-grade encryption for all data in transit. Secure authentication ensuring only authorized personnel allow access."
                        />
                        <FeatureCard
                            icon={Users}
                            title="User Provisioning"
                            desc="Streamlined onboarding for new faculty and staff. Assign granular permissions in just a few clicks."
                        />
                    </div>
                </div>
            </section>

            {/* --- Hierarchy / How it Works --- */}
            <section id="infrastructure" className="py-24 px-6 border-t border-borderColor bg-zinc-900/20">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1 space-y-8">
                        <h2 className="text-3xl md:text-4xl font-bold">Structured Hierarchy</h2>
                        <p className="text-textMuted text-lg leading-relaxed">
                            Organize your campus logically. Viyu.in mirrors your physical infrastructure digitially.
                        </p>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                                    <Globe className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white mb-1">Campus / Global</h4>
                                    <p className="text-sm text-textMuted">The root level. Superadmins see everything.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                    <Building2 className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white mb-1">Blocks & Departments</h4>
                                    <p className="text-sm text-textMuted">Academic buildings managed by Block Admins.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                    <Cpu className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white mb-1">Labs & Resources</h4>
                                    <p className="text-sm text-textMuted">Specific computer labs and individual workstations.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Visual Representation (Abstract Code/Tree) */}
                    <div className="flex-1 w-full relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-primary to-purple-600 opacity-20 blur-xl rounded-2xl"></div>
                        <div className="bg-bgMain border border-borderColor rounded-xl p-8 shadow-2xl relative font-mono text-sm leading-relaxed overflow-hidden">
                            <div className="flex items-center gap-2 mb-4 opacity-50">
                                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                            </div>
                            <div className="text-purple-400">const campus_structure = {'{'}</div>
                            <div className="pl-4 text-textMain">
                                <span className="text-blue-400">"CSE_Block"</span>: {'{'} <br />
                                <span className="pl-4 text-emerald-400">"Lab_01"</span>: {'{'} <br />
                                <span className="pl-8 text-orange-400">"status"</span>: <span className="text-green-400">"Online"</span>, <br />
                                <span className="pl-8 text-orange-400">"active_nodes"</span>: <span className="text-yellow-400">42</span>, <br />
                                <span className="pl-8 text-orange-400">"power_draw"</span>: <span className="text-yellow-400">"3.2kW"</span> <br />
                                <span className="pl-4">{'}'}</span>, <br />
                                <span className="pl-4 text-emerald-400">"Lab_02"</span>: {'{'} <br />
                                <span className="pl-8 text-gray-500">// ... more data</span> <br />
                                <span className="pl-4">{'}'}</span> <br />
                                {'}'}, <br />
                                <span className="text-blue-400">"Civil_Block"</span>: {'{'} <br />
                                <span className="pl-4 text-gray-500">// ...</span> <br />
                                {'}'}
                            </div>
                            <div className="text-purple-400">{'}'}</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FAQ Section --- */}
            <section id="faq" className="py-24 px-6 border-t border-borderColor bg-bgMain">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border border-borderColor rounded-lg overflow-hidden bg-cardBg transition-all">
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                                >
                                    <span className="font-semibold text-white">{faq.question}</span>
                                    {openFaqIndex === index ? <ChevronUp className="w-5 h-5 text-textMuted" /> : <ChevronDown className="w-5 h-5 text-textMuted" />}
                                </button>
                                {openFaqIndex === index && (
                                    <div className="p-6 pt-0 text-textMuted leading-relaxed animate-in slide-in-from-top-2">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                        {/* --- Footer --- */}
                    </div>
                </div>
            </section>

            <footer className="border-t border-borderColor bg-zinc-900/80 pt-16 pb-8 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
                        {/* Brand & Newsletter */}
                        <div className="md:col-span-5 space-y-8">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-4">Viyu.in</h3>
                                <p className="text-textMuted leading-relaxed max-w-sm">
                                    The intelligent operating system for your campus.
                                    Join the network of future-ready institutions today.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-white">Stay up to date</h4>
                                <div className="flex gap-2 max-w-sm">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="bg-white/5 border border-borderColor rounded-lg px-4 py-2 w-full text-sm text-white focus:ring-1 focus:ring-primary outline-none"
                                    />
                                    <button className="bg-white text-black px-4 py-2 rounded-lg font-bold hover:bg-zinc-200 transition-colors">
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <SocialLink icon={Activity} />
                                <SocialLink icon={Globe} />
                                <SocialLink icon={Cpu} />
                            </div>
                        </div>

                        {/* Links */}
                        <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div>
                                <h4 className="font-bold text-white mb-6">Product</h4>
                                <ul className="space-y-3 text-sm text-textMuted">
                                    <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                                    <li><a href="#" className="hover:text-primary transition-colors">Integrations</a></li>
                                    <li><a href="#" className="hover:text-primary transition-colors">Enterprise</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-6">Resources</h4>
                                <ul className="space-y-3 text-sm text-textMuted">
                                    <li><a href="#" className="hover:text-primary transition-colors">Docs</a></li>
                                    <li><a href="#" className="hover:text-primary transition-colors">API</a></li>
                                    <li><a href="#" className="hover:text-primary transition-colors">Status</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-6">Company</h4>
                                <ul className="space-y-3 text-sm text-textMuted">
                                    <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                                    <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                                    <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-6">Legal</h4>
                                <ul className="space-y-3 text-sm text-textMuted">
                                    <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                                    <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
                                    <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* MASSIVE BRANDING */}
                    <div className="w-full flex justify-center items-center py-10 opacity-20 pointer-events-none select-none">
                        <h1 className="text-[12vw] md:text-[14vw] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-transparent leading-none">
                            VIYU.IN
                        </h1>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-textMuted">
                        <p>&copy; 2026 Viyu.in Systems Inc.</p>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-emerald-500 font-medium">All systems normal</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Helper Component for Feature Card
const FeatureCard = ({ icon: Icon, title, desc }) => (
    <div className="p-6 rounded-xl bg-cardBg border border-borderColor hover:border-primary/50 transition-colors group">
        <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
            <Icon className="w-6 h-6 text-textMuted group-hover:text-primary transition-colors" />
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-sm text-textMuted leading-relaxed">{desc}</p>
    </div>
);

const SocialLink = ({ icon: Icon }) => (
    <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all border border-white/10">
        <Icon className="w-4 h-4" />
    </a>
);

export default LandingPage;
