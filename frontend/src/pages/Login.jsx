import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Monitor, Lock, Mail, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await login(email, password);
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-bgMain text-textMain flex items-center justify-center relative overflow-hidden font-sans">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="w-full max-w-md z-10 p-6">

                {/* Brand Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded bg-primary/10 border border-primary/20 mb-4 text-primary">
                        <Monitor className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight mb-2">System Access</h1>
                    <p className="text-textMuted text-sm">Enter your credentials to access the resource optimizer.</p>
                </div>

                {/* Login Card */}
                <div className="bg-cardBg border border-borderColor rounded-xl p-8 shadow-2xl backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-textMuted uppercase tracking-wider ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 bg-bgMain border border-borderColor rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all outline-none"
                                    placeholder="admin@viyu.in"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-textMuted uppercase tracking-wider ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 bg-bgMain border border-borderColor rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 rounded-lg transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary/20 mt-6"
                        >
                            {loading ? (
                                <span className="animate-pulse">Authenticating...</span>
                            ) : (
                                <>
                                    Secure Login <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="text-center mt-8 text-xs text-textMuted">
                    <p>Restricted Access System v0.0.1</p>
                    <p className="mt-1">Unauthorized access attempts are logged.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
