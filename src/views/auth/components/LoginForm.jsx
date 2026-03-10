import React from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

const LoginForm = ({
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    selectedRole,
    loginStatus,
    handleBackToSelect,
    handleSubmit
}) => {
    const getRoleColor = () => {
        if (selectedRole === 'gestor') return '#f97316';
        if (selectedRole === 'ecoheroe') return '#10b981';

        return '#f97316';
    };

    const getRoleRing = () => {
        if (selectedRole === 'gestor') return 'focus:ring-orange-500/30 focus:border-orange-500 focus:bg-white/10';
        if (selectedRole === 'ecoheroe') return 'focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white/10';

        return 'focus:ring-orange-500/30 focus:border-orange-500 focus:bg-white/10';
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

    return (
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
                    Perfil: <span style={{ color: getRoleColor() }}>{selectedRole === 'gestor' ? 'Gestor' : 'Eco-Héroe'}</span>

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
    );
};

export default LoginForm;
