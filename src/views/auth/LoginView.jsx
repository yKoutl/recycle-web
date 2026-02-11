import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { LogIn, XCircle, ArrowRight, ShieldCheck, Mail, Lock, Loader2 } from 'lucide-react';
import { useLoginMutation, onLogin as setAuthCredentials } from '../../store/auth';

const LoginView = ({ onLogin, onCancel, t }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const [loginApi, { isLoading }] = useLoginMutation();

    // Background Slider Logic
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
        { id: 0, image: '/src/assets/hero_nature_v2.png' },
        { id: 1, image: '/src/assets/hero_environment.jpg' }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 10000);
        return () => clearInterval(interval);
    }, [slides.length]);

    const bubbles = useMemo(() => {
        return Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 40 + 20}px`,
            animationDuration: `${Math.random() * 10 + 15}s`,
            animationDelay: `${Math.random() * 10}s`,
            opacity: Math.random() * 0.2 + 0.1
        }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const result = await loginApi({ email, password }).unwrap();
            dispatch(setAuthCredentials({
                user: result.user || result,
                token: result.access_token || result.token
            }));
            onLogin();
        } catch (err) {
            console.error("Error login:", err);
            const errorMsg = err.data?.message || 'Error de conexión o credenciales inválidas';
            setError(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
        }
    };

    const inputClasses = `
        w-full px-5 py-3.5 
        rounded-2xl outline-none 
        border border-gray-100 dark:border-white/10 
        bg-white/50 dark:bg-white/5 
        text-gray-900 dark:text-white 
        placeholder-gray-400 dark:placeholder-gray-600
        transition-all duration-300 
        focus:bg-white dark:focus:bg-white/10
        focus:border-[#018F64] dark:focus:border-emerald-500
        focus:ring-4 focus:ring-[#018F64]/10 dark:focus:ring-emerald-500/10
        disabled:opacity-50 disabled:cursor-not-allowed
    `;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-stone-900 transition-colors duration-500">

            {/* BACKGROUND SLIDER */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 z-0 transition-opacity duration-2000 ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img
                        src={slide.image}
                        alt="Background"
                        className="w-full h-full object-cover blur-[2px] scale-105"
                    />
                    <div className="absolute inset-0 bg-stone-900/60 dark:bg-black/70" />
                </div>
            ))}

            {/* BUBBLES */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {bubbles.map((bubble) => (
                    <div
                        key={bubble.id}
                        className="absolute top-0 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 animate-float-up"
                        style={{
                            left: bubble.left,
                            width: bubble.width,
                            height: bubble.width,
                            animationDuration: bubble.animationDuration,
                            animationDelay: bubble.animationDelay,
                            opacity: bubble.opacity
                        }}
                    />
                ))}
            </div>

            {/* PREMIUM CARD */}
            <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-700 px-2">
                <div className="bg-white/95 dark:bg-gray-950/40 p-10 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/50 dark:border-white/5 backdrop-blur-2xl relative overflow-hidden text-left">

                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
                        style={{ backgroundImage: `linear-gradient(#018F64 1px, transparent 1px), linear-gradient(90deg, #018F64 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

                    <div className="relative">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic leading-none">
                                {t.admin.portalTitle}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-3 font-medium">
                                {t.admin.portalSubtitle}
                            </p>
                            <div className="w-12 h-1 bg-[#018F64] mx-auto mt-4 rounded-full" />
                        </div>

                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-xs font-bold mb-6 flex items-center gap-3 animate-in shake border border-red-100 dark:border-red-900/50">
                                <XCircle size={18} /> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Mail size={14} className="text-[#018F64]" /> {t.admin.emailLabel}
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={inputClasses}
                                    placeholder="admin@recycle.com"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Lock size={14} className="text-[#018F64]" /> {t.admin.passLabel}
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={inputClasses}
                                    placeholder="••••••••"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 mt-4 bg-[#018F64] text-white rounded-2xl flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest shadow-xl shadow-[#018F64]/20 transition-all hover:scale-[1.02] hover:bg-[#05835D] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Iniciando sesión...
                                    </>
                                ) : (
                                    <>
                                        {t.admin.loginBtn}
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center pt-2">
                            <button
                                onClick={onCancel}
                                disabled={isLoading}
                                className="text-[10px] font-black text-gray-400 hover:text-[#018F64] uppercase tracking-widest flex items-center justify-center gap-2 mx-auto transition-colors disabled:opacity-50"
                            >
                                <ArrowRight size={14} className="rotate-180" /> {t.admin.backBtn}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes float-up {
                    0% { transform: translateY(100vh) scale(0); opacity: 0; }
                    20% { opacity: 1; }
                    100% { transform: translateY(-100px) scale(1.5); opacity: 0; }
                }
                .animate-float-up { animation: float-up linear infinite; }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                .animate-in.shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
            `}} />
        </div>
    );
};

export default LoginView;