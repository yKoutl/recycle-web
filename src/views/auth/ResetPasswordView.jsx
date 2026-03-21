import React, { useState, useEffect } from 'react';
import { useResetPasswordMutation } from '../../store/auth/authApi';
import { Lock, ArrowLeft, Loader2, CheckCircle2, ShieldCheck, Mail, Leaf, Eye, EyeOff } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

const ResetPasswordView = ({ t }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmation, setConfirmation] = useState(null);
    const [validationError, setValidationError] = useState('');
    const [resetPassword, { isLoading, error: apiError }] = useResetPasswordMutation();

    useEffect(() => {
        const emailParam = searchParams.get('email');
        const codeParam = searchParams.get('code');
        if (emailParam) setEmail(emailParam);
        if (codeParam) setCode(codeParam);
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError('');
        if (password !== confirmPassword) {
            setValidationError('Las contraseñas no coinciden');
            return;
        }

        if (password.length < 8) {
            setValidationError('La contraseña debe tener al menos 8 caracteres');
            return;
        }

        try {
            await resetPassword({ email, code, newPassword: password }).unwrap();
            setIsSuccess(true);
            setTimeout(() => {
                navigate('/auth/login');
            }, 3000);
        } catch (err) {
            let msg = err.data?.message || 'Error al restablecer la contraseña. Verifica tu código.';
            if (Array.isArray(msg)) msg = msg.join('. ');

            const translations = {
                'must be a string': 'debe ser un texto válido',
                'is not a valid email': 'no es un correo electrónico válido',
                'must be an email': 'debe ser un correo electrónico válido',
                'should not be empty': 'no puede estar vacío',
                'must be longer than or equal to 8 characters': 'debe tener al menos 8 caracteres'
            };

            Object.entries(translations).forEach(([eng, esp]) => {
                if (typeof msg === 'string') msg = msg.replace(new RegExp(eng, 'gi'), esp);
            });

            setValidationError(msg);
        }
    };

    if (isSuccess) {
        return (
            <div className="h-screen w-full bg-[#070707] flex items-center justify-center overflow-hidden relative">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 opacity-70 blur-md scale-105"
                    style={{ backgroundImage: "url('/src/assets/desktop/hero_nature_v2.webp')" }}
                />
                <div className="absolute inset-0 bg-black/40" />

                <div className="relative z-10 w-full max-w-md mx-auto p-6 text-center animate-in zoom-in-95 duration-500">
                    <div className="bg-white/10 backdrop-blur-3xl px-10 py-16 rounded-[48px] border border-white/20 shadow-2xl space-y-10">
                        {/* TOP SUCCESS LOGO with Leaves */}
                        <div className="flex flex-col items-center">
                            <div className="relative group">
                                <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-[30deg] text-emerald-500/40">
                                    <Leaf size={40} fill="currentColor" />
                                </div>
                                <div className="absolute -right-12 top-1/2 -translate-y-1/2 rotate-[30deg] text-emerald-500/40">
                                    <Leaf size={40} fill="currentColor" />
                                </div>
                                <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl relative z-10">
                                    <CheckCircle2 size={48} className="text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">{t.resetPassword.success.title}</h2>
                            <p className="text-white text-[10px] font-black uppercase tracking-[0.3em]">
                                {t.resetPassword.success.subtitle}
                            </p>
                        </div>

                        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 animate-[progress_3s_linear_forwards]" />
                        </div>
                    </div>
                </div>

                <style>{`
                    @keyframes progress { from { width: 0%; } to { width: 100%; } }
                `}</style>
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-[#070707] flex items-center justify-center overflow-hidden relative p-4 selection:bg-emerald-500/30">
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 opacity-60 blur-md scale-105"
                style={{ backgroundImage: "url('/src/assets/desktop/hero_nature_v2.webp')" }}
            />
            <div className="absolute inset-0 bg-black/40 z-0" />

            <div className="relative z-10 w-full max-w-[360px] bg-white/10 backdrop-blur-3xl rounded-[38px] border border-white/20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-bottom-8 overflow-hidden">
                <div className="px-7 py-8 space-y-7">

                    {/* TOP LOGO Section */}
                    <div className="flex flex-col items-center">
                        <div className="relative group">
                            <div className="absolute -left-10 top-1/2 -translate-y-1/2 -rotate-[30deg] text-emerald-500/30 group-hover:text-emerald-500/50 transition-colors duration-500">
                                <Leaf size={32} fill="currentColor" />
                            </div>
                            <div className="absolute -right-10 top-1/2 -translate-y-1/2 rotate-[30deg] text-emerald-500/30 group-hover:text-emerald-500/50 transition-colors duration-500">
                                <Leaf size={32} fill="currentColor" />
                            </div>

                            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)] border-4 border-white/10 relative z-10">
                                <Lock size={36} className="text-white fill-white/20" />
                            </div>
                        </div>

                        <div className="mt-5 text-center">
                            <h1 className="text-xl font-black text-white tracking-tight leading-tight uppercase">{t.resetPassword.title}</h1>
                            <div className="flex flex-col items-center mt-1.5 gap-1">
                                <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest leading-none opacity-80">{t.resetPassword.subtitle}</p>
                                <p className="text-[8px] font-bold text-white/30 lowercase tracking-wide bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                                    {email}
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {validationError && (
                            <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-pulse">
                                <ShieldCheck size={14} className="text-red-500 shrink-0" />
                                <p className="text-[8px] font-black text-red-400 uppercase tracking-widest leading-none">
                                    {validationError}
                                </p>
                            </div>
                        )}

                        <div className="space-y-4">
                            {(!searchParams.get('email') || !searchParams.get('code')) && (
                                <div className="space-y-1.5 animate-in fade-in duration-500">
                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-4">{t.resetPassword.fields.code}</label>
                                    <input
                                        type="text"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        placeholder="0000"
                                        required
                                        className="w-full text-center py-3 bg-white/5 border-2 border-white/10 rounded-2xl text-[18px] font-black text-white tracking-[0.4em] outline-none focus:border-emerald-500 transition-all font-mono"
                                    />
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-4">{t.resetPassword.fields.newPassword}</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        minLength={8}
                                        className="w-full text-center py-3.5 bg-white/5 border-2 border-white/10 rounded-2xl text-[13px] font-black text-white outline-none focus:border-emerald-500 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-4">{t.resetPassword.fields.confirmPassword}</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        minLength={8}
                                        className="w-full text-center py-3.5 bg-white/5 border-2 border-white/10 rounded-2xl text-[13px] font-black text-white outline-none focus:border-emerald-500 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white"
                                    >
                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[20px] font-bold text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : t.resetPassword.buttons.update}
                        </button>
                    </form>

                    <div className="text-center pt-2">
                        <Link to="/auth/login" className="text-[9px] text-white/20 hover:text-emerald-400 font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-colors">
                            <ArrowLeft size={10} /> {t.resetPassword.buttons.back}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default ResetPasswordView;
