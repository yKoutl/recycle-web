import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogIn, XCircle, ArrowRight, ShieldCheck, Mail, Lock, Loader2, Sprout, Building, ChevronRight, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

import { useLoginMutation, onLogin as setAuthCredentials } from '../../store/auth';

const LoginView = ({ t }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loginStatus, setLoginStatus] = useState(null); // 'loading', 'success', 'error'
    const [statusMessage, setStatusMessage] = useState('');

    const dispatch = useDispatch();
    const [loginApi] = useLoginMutation();

    const [step, setStep] = useState('select-role'); // 'select-role' | 'login-form'
    const [selectedRole, setSelectedRole] = useState(null);
    const [isChangingState, setIsChangingState] = useState(false);

    const slides = [
        { id: 0, image: '/src/assets/hero_nature_v2.png' },
        { id: 1, image: '/src/assets/hero_environment.jpg' }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

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
        setLoginStatus('loading');
        setStatusMessage('Verificando identidad...');

        try {
            const result = await loginApi({ email, password }).unwrap();

            // Simular un pequeño delay para que no sea brusco y el usuario vea el proceso
            await new Promise(resolve => setTimeout(resolve, 800));

            setLoginStatus('success');
            setStatusMessage('¡Bienvenido de nuevo!');

            setTimeout(() => {
                const userData = result.user || result;
                const token = result.access_token || result.token;

                console.log('Login Result (Debug):', result);
                console.log('User Role:', userData?.role);

                dispatch(setAuthCredentials({
                    user: userData,
                    token: token
                }));

                // Redirección inteligente basada en el rol
                const role = userData?.role?.toUpperCase();
                if (['ADMIN', 'OFFICIAL'].includes(role)) {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/');
                }
            }, 2000);

        } catch (err) {
            console.error("Error login:", err);

            // Simular delay para evitar el cambio brusco
            await new Promise(resolve => setTimeout(resolve, 800));

            setLoginStatus('error');
            const errorMsg = err.data?.message || 'Credenciales inválidas';
            setStatusMessage(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);

            // El modal de error se queda 3s para que lo lea y luego puede intentar de nuevo
            setTimeout(() => setLoginStatus(null), 3500);
        }
    };

    const getRoleColor = () => {
        if (selectedRole === 'funcionario') return '#f97316';
        if (selectedRole === 'ecoheroe') return '#10b981';
        if (selectedRole === 'admin') return '#FF3B3B';
        return '#018F64';
    };

    const getRoleRing = () => {
        if (selectedRole === 'funcionario') return 'focus:ring-orange-500/30 focus:border-orange-500 focus:bg-white/10';
        if (selectedRole === 'ecoheroe') return 'focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white/10';
        if (selectedRole === 'admin') return 'focus:ring-red-500/30 focus:border-red-500 focus:bg-white/10';
        return 'focus:ring-[#018F64]/30 focus:border-[#018F64] focus:bg-white/10';
    };

    const inputClasses = `
        w-full px-5 py-3.5 
        rounded-2xl outline-none 
        border border-white/20
        bg-white/[0.05]
        text-white
        placeholder-gray-500
        transition-all duration-300 
        hover:bg-white/[0.08]
        hover:border-white/30
        ${getRoleRing()}
        focus:ring-4
    `;

    const [showAdminWarning, setShowAdminWarning] = useState(false);

    const handleRoleSelect = (roleId) => {
        setIsChangingState(true);
        setTimeout(() => {
            setSelectedRole(roleId);
            setStep('login-form');
            setIsChangingState(false);
        }, 500);
    };

    const handleBackToSelect = () => {
        setIsChangingState(true);
        setTimeout(() => {
            setStep('select-role');
            setIsChangingState(false);
        }, 500);
    };

    const roles = [
        {
            id: 'ecoheroe',
            title: 'Eres Ecoheroe',
            desc: 'Recicla, gana recompensas y cuida el planeta.',
            icon: Sprout,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'hover:border-emerald-500/30'
        },
        {
            id: 'funcionario',
            title: 'Eres Funcionario',
            desc: 'Gestiono mi municipio y coordino jornadas.',
            icon: Building,
            color: 'text-orange-400',
            bg: 'bg-orange-500/10',
            border: 'hover:border-orange-500/30'
        }
    ];

    return (
        <div className="h-screen w-full bg-[#070707] relative overflow-hidden font-outfit selection:bg-[#018F64]/30">

            {/* --- MODAL DE ESTADO (OVERLAY) --- */}
            {loginStatus && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="w-full max-w-sm mx-4 bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-10 text-center shadow-2xl shadow-[#018F64]/10 animate-in zoom-in-90 slide-in-from-bottom-8 duration-500">
                        <div className="flex flex-col items-center gap-8">
                            <div className="relative">
                                {/* Círculo de carga dinámico que siempre está presente */}
                                <div className="w-24 h-24 rounded-full border-2 border-white/5 flex items-center justify-center">
                                    {loginStatus === 'loading' && (
                                        <>
                                            <Loader2 className="w-12 h-12 text-[#018F64] animate-spin" strokeWidth={1} />
                                            <div className="absolute inset-0 w-24 h-24 rounded-full border-t-2 border-[#018F64] animate-spin" style={{ animationDuration: '0.8s' }} />
                                        </>
                                    )}

                                    {loginStatus === 'success' && (
                                        <div className="animate-in zoom-in duration-700">
                                            <CheckCircle2 className="w-14 h-14 text-[#10b981]" strokeWidth={1} />
                                        </div>
                                    )}

                                    {loginStatus === 'error' && (
                                        <div className="animate-in zoom-in duration-700">
                                            <AlertCircle className="w-14 h-14 text-red-500" strokeWidth={1} />
                                        </div>
                                    )}
                                </div>
                                {loginStatus === 'success' && (
                                    <div className="absolute inset-x-0 -bottom-2 flex justify-center">
                                        <div className="w-12 h-1bg-[#10b981] rounded-full blur-sm opacity-50 animate-pulse" />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
                                    {loginStatus === 'loading' ? 'Procesando' : loginStatus === 'success' ? 'Acceso Autorizado' : 'Error de Acceso'}
                                </h3>
                                <p className="text-gray-500 text-sm font-medium leading-relaxed">
                                    {statusMessage}
                                </p>
                            </div>

                            {loginStatus === 'error' && (
                                <button
                                    onClick={() => setLoginStatus(null)}
                                    className="group flex items-center gap-2 px-8 py-3 rounded-2xl bg-white/5 hover:bg-red-500/10 text-white hover:text-red-500 text-[11px] font-black uppercase tracking-widest transition-all duration-300"
                                >
                                    <XCircle size={14} /> Intentar de nuevo
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* --- IMAGEN DE FONDO (MOVIMIENTO DE BARRIDO EN DESKTOP) --- */}
            <div
                className={`hidden md:block absolute top-0 w-1/2 h-full z-10 transition-all duration-1000 ease-[cubic-bezier(0.645,0.045,0.355,1)] overflow-hidden ${step === 'select-role' ? 'left-1/2' : 'left-0'
                    }`}
            >
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <img src={slide.image} alt="Background" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-[#070707]" />
                    </div>
                ))}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center select-none z-20">
                    <h2 className="text-5xl font-black text-white uppercase tracking-tight leading-none mb-4">
                        RECYCLE<span className="text-[#018F64]">APP</span>
                    </h2>
                    <div className="h-1 w-12 bg-[#018F64] rounded-full mb-4 mx-auto" />
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.6em]">NOS PLANET 2026</p>
                </div>
            </div>

            {/* --- CAPA DEL CONTENIDO --- */}
            <div
                className={`absolute top-0 w-full md:w-1/2 h-full z-20 flex flex-col items-center justify-center p-6 sm:p-10 transition-all duration-1000 ease-[cubic-bezier(0.645,0.045,0.355,1)] ${step === 'select-role' ? 'left-0' : 'md:left-1/2'
                    }`}
            >
                <div className={`w-full max-w-lg transition-all duration-500 ${isChangingState ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
                    <div className="space-y-8 md:space-y-10 w-full">
                        {step === 'select-role' ? (
                            <>
                                <div className="space-y-2 text-center md:text-left">
                                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9]">
                                        ¡BIEN<span className="text-[#018F64]">VENIDO!</span>
                                    </h1>
                                    <p className="text-gray-400 text-base font-medium">
                                        Elige tu acceso para continuar transformando el mundo.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {roles.map((role) => (
                                        <button
                                            key={role.id}
                                            onClick={() => handleRoleSelect(role.id)}
                                            className={`group w-full bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 ${role.border} p-5 rounded-[1.5rem] transition-all duration-500 text-left flex items-center gap-5 active:scale-[0.98] shadow-xl`}
                                        >
                                            <div className={`w-12 h-12 rounded-xl ${role.bg} flex items-center justify-center ${role.color} transition-all duration-500 group-hover:scale-110 shadow-inner shrink-0`}>
                                                <role.icon size={26} strokeWidth={2.2} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-bold text-white uppercase tracking-wide">{role.title}</h3>
                                                <p className="text-gray-400 text-xs font-medium leading-relaxed">
                                                    {role.desc}
                                                </p>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-700 transition-colors group-hover:text-white group-hover:bg-[#018F64] shrink-0">
                                                <ChevronRight size={16} />
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="pt-4 space-y-5">
                                    <div className="h-px bg-gradient-to-r from-white/5 via-white/10 to-transparent w-full" />

                                    <div className="relative inline-block w-full text-center md:text-left">
                                        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 mb-4 w-64 p-4 bg-[#FF3B3B] text-white rounded-2xl shadow-2xl transition-all duration-300 pointer-events-none z-50 ${showAdminWarning ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
                                            <div className="flex gap-4 items-center">
                                                <ShieldCheck size={16} className="shrink-0" />
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-left leading-tight">Acceso exclusivo administradores.</p>
                                            </div>
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0 -translate-y-1 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-[#FF3B3B]" />
                                        </div>

                                        <button
                                            onMouseEnter={() => setShowAdminWarning(true)}
                                            onMouseLeave={() => setShowAdminWarning(false)}
                                            onClick={() => handleRoleSelect('admin')}
                                            className="inline-flex items-center gap-3 text-gray-500 hover:text-white transition-all group"
                                        >
                                            <ShieldCheck size={16} className="text-gray-600 group-hover:text-[#FF3B3B]" />
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Portal Administración</span>
                                        </button>
                                    </div>

                                    <div className="flex justify-center md:justify-start">
                                        <button
                                            onClick={() => navigate('/')}
                                            className="flex items-center gap-2 text-gray-500 hover:text-[#018F64] transition-colors text-[10px] font-bold uppercase tracking-widest"
                                        >
                                            <ArrowRight size={14} className="rotate-180" /> Volver al Inicio
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-8 w-full max-w-md mx-auto">
                                <button
                                    onClick={handleBackToSelect}
                                    className="flex items-center gap-2 text-gray-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full bg-white/5 border border-white/5"
                                >
                                    <ArrowRight size={14} className="rotate-180" /> Cambiar de Rol
                                </button>

                                <div className="space-y-2 text-center md:text-left">
                                    <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight uppercase leading-none">
                                        ACCESO AL <span style={{ color: getRoleColor() }}>PORTAL</span>
                                    </h1>
                                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em]">
                                        Perfil: <span style={{ color: getRoleColor() }}>{selectedRole === 'admin' ? 'Administrador' : selectedRole}</span>
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Correo Electrónico</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: getRoleColor() }} size={18} />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className={inputClasses + " pl-12"}
                                                placeholder="correo@ejemplo.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">Contraseña</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: getRoleColor() }} size={18} />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className={inputClasses + " pl-12 pr-12"}
                                                placeholder="••••••••"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-1"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loginStatus === 'loading'}
                                        style={{ backgroundColor: getRoleColor() }}
                                        className="w-full h-15 text-white rounded-2xl flex items-center justify-center gap-4 font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {loginStatus === 'loading' ? <Loader2 className="animate-spin" /> : 'Acceder Ahora'}
                                        <ArrowRight size={20} />
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Burbujas de fondo */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                {bubbles.map((bubble) => (
                    <div
                        key={bubble.id}
                        className="absolute top-0 rounded-full bg-[#018F64] animate-float-up"
                        style={{
                            left: bubble.left,
                            width: bubble.width,
                            height: bubble.width,
                            animationDuration: bubble.animationDuration,
                            animationDelay: bubble.animationDelay,
                        }}
                    />
                ))}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes float-up {
                        0% { transform: translateY(110vh) scale(0.5); opacity: 0; }
                        50% { opacity: 0.5; }
                        100% { transform: translateY(-20vh) scale(1.2); opacity: 0; }
                    }
                    .animate-float-up { animation: float-up linear infinite; }
                    .no-scrollbar::-webkit-scrollbar { display: none; }
                    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `}} />
        </div>
    );
};

export default LoginView;
