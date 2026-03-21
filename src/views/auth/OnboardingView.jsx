import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useRegisterMutation } from '../../store/auth/authApi';
import { User, Lock, Mail, Loader2, Leaf, ShieldCheck, CheckCircle2, Eye, EyeOff, ArrowRight, ArrowLeft, Phone, Fingerprint, Building2 } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { motion, AnimatePresence } from 'framer-motion';

const OnboardingView = ({ t }) => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [register, { isLoading, error: registerError }] = useRegisterMutation();

    const [decoded, setDecoded] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        documentNumber: '',
        institution: '',
        password: '',
        confirmPassword: ''
    });
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validationError, setValidationError] = useState('');

    useEffect(() => {
        try {
            const data = jwtDecode(token);
            setDecoded(data);
            // Autofill name if available in token, or just let user fill it
            if (data.fullName) setFormData(prev => ({ ...prev, fullName: data.fullName }));
        } catch (e) {
            console.error('Invalid token', e);
        }
    }, [token]);

    const handleNextStep = () => {
        setValidationError('');
        if (currentStep === 1) {
            if (!formData.fullName || !formData.phone || !formData.documentNumber) {
                setValidationError('Por favor completa todos los datos de identificación');
                return;
            }
        }
        if (currentStep === 2) {
            if (decoded?.role === 'MANAGER' && !formData.institution) {
                setValidationError('Como gestor, debes indicar tu institución');
                return;
            }
        }
        setCurrentStep(prev => prev + 1);
    };

    const handleBackStep = () => {
        setValidationError('');
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError('');

        if (formData.password !== formData.confirmPassword) {
            setValidationError('Las contraseñas no coinciden');
            return;
        }

        if (formData.password.length < 8) {
            setValidationError('La contraseña debe tener al menos 8 caracteres');
            return;
        }

        try {
            await register({
                email: decoded.email,
                fullName: formData.fullName,
                phone: formData.phone,
                documentNumber: formData.documentNumber,
                institution: formData.institution,
                password: formData.password,
                role: decoded.role,
                managerId: decoded.managerId,
                authProvider: 'local'
            }).unwrap();

            setIsSuccess(true);
            setTimeout(() => {
                navigate('/auth/login');
            }, 3000);
        } catch (err) {
            let msg = err.data?.message || 'Error al completar el registro.';

            // Si es un array (errores de validación múltiple del backend)
            if (Array.isArray(msg)) {
                msg = msg.join('. ');
            }

            // Traducciones rápidas de errores comunes de backend
            const translations = {
                'role must be one of the following values': 'El rol asignado no es válido para este registro',
                'should not exist': 'no debería estar presente en este flujo',
                'must be a string': 'debe ser un texto válido',
                'is not a valid email': 'no es un correo electrónico válido',
                'must be an email': 'debe ser un correo electrónico válido'
            };

            Object.entries(translations).forEach(([eng, esp]) => {
                if (typeof msg === 'string') {
                    msg = msg.replace(new RegExp(eng, 'gi'), esp);
                }
            });

            // Limpieza final
            if (typeof msg === 'string') {
                msg = msg.replace(/property /gi, 'El campo ');
            }

            setValidationError(msg);
        }
    };

    if (!decoded) {
        return (
            <div className="min-h-screen bg-[#070707] flex flex-col items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <Loader2 size={40} className="animate-spin text-emerald-500 mx-auto" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Validando invitación...</p>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="h-screen w-full bg-[#070707] flex items-center justify-center overflow-hidden relative p-4">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 opacity-60 blur-md scale-105"
                    style={{ backgroundImage: "url('/src/assets/desktop/hero_nature_v2.webp')" }}
                />
                <div className="absolute inset-0 bg-black/40 z-0" />

                <div className="relative z-10 w-full max-w-[400px] bg-white/10 backdrop-blur-3xl rounded-[48px] p-12 text-center space-y-10 border border-white/20 shadow-2xl animate-in zoom-in-95 duration-500">
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
                        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">{t.onboarding.success.title}</h2>
                        <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed">
                            {t.onboarding.success.subtitle}
                        </p>
                    </div>

                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 animate-[progress_3s_linear_forwards]" />
                    </div>
                </div>

                <style>{`
                    @keyframes progress { from { width: 0%; } to { width: 100%; } }
                `}</style>
            </div>
        );
    }

    const steps = [
        { id: 1, title: t.onboarding.steps.id, icon: User },
        { id: 2, title: t.onboarding.steps.profile, icon: Building2 },
        { id: 3, title: t.onboarding.steps.security, icon: ShieldCheck }
    ];

    return (
        <div className="h-screen w-full bg-[#070707] flex items-center justify-center overflow-hidden relative p-4 selection:bg-emerald-500/30">
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 opacity-60 blur-md scale-105"
                style={{ backgroundImage: "url('/src/assets/desktop/hero_nature_v2.webp')" }}
            />
            <div className="absolute inset-0 bg-black/40 z-0" />

            <div className="relative z-10 w-full max-w-[360px] bg-white/10 backdrop-blur-3xl rounded-[38px] border border-white/20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] overflow-hidden">
                <div className="px-7 py-8 space-y-7">

                    {/* Stepper Header */}
                    <div className="flex flex-col items-center space-y-5">
                        <div className="flex items-center justify-between w-full max-w-[220px] relative">

                            <div className="absolute top-1/2 left-0 w-full h-px bg-white/10 -translate-y-1/2 z-0" />
                            <div
                                className="absolute top-1/2 left-0 h-px bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500"
                                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                            />
                            {steps.map((s) => (
                                <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                                    <div
                                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${currentStep >= s.id
                                            ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                                            : 'bg-[#0f172a] border-white/10 text-white/30'
                                            }`}
                                    >
                                        <s.icon size={16} strokeWidth={2.5} />
                                    </div>
                                    <span className={`text-[8px] font-black uppercase tracking-widest ${currentStep >= s.id ? 'text-emerald-400' : 'text-white/20'}`}>
                                        {s.title}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="text-center">
                            <h1 className="text-xl font-black text-white tracking-tight leading-tight uppercase">{t.onboarding.title}</h1>
                            <div className="flex flex-col items-center mt-1.5 gap-1">
                                <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest opacity-80 leading-none">
                                    {decoded.role === 'MANAGER' ? t.onboarding.roles.manager : t.onboarding.roles.coordinator}
                                </p>
                                <p className="text-[8px] font-bold text-white/30 lowercase tracking-wide bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                                    {decoded.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                        <AnimatePresence mode="wait">
                            {currentStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div className="space-y-3.5">
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-4">{t.onboarding.fields.fullName}</label>
                                            <div className="relative">
                                                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.fullName}
                                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                    placeholder={t.onboarding.placeholders.fullName}
                                                    className="w-full pl-13 pr-6 py-3.5 bg-white/5 border-2 border-white/10 rounded-2xl text-[13px] font-bold text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-white/10"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-4">{t.onboarding.fields.phone}</label>
                                            <div className="relative">
                                                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                                                <input
                                                    type="tel"
                                                    required
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    placeholder={t.onboarding.placeholders.phone}
                                                    className="w-full pl-13 pr-6 py-3.5 bg-white/5 border-2 border-white/10 rounded-2xl text-[13px] font-bold text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-white/10"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-4">{t.onboarding.fields.document}</label>
                                            <div className="relative">
                                                <Fingerprint className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.documentNumber}
                                                    onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                                                    placeholder={t.onboarding.placeholders.document}
                                                    className="w-full pl-13 pr-6 py-3.5 bg-white/5 border-2 border-white/10 rounded-2xl text-[13px] font-bold text-white outline-none focus:border-emerald-500/50 transition-all font-mono placeholder:text-white/10"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                                <Building2 size={22} />
                                            </div>
                                            <div>
                                                <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Entidad Vinculada</p>
                                                <p className="text-[12px] text-white font-black">{decoded.role === 'MANAGER' ? t.onboarding.roles.manager : t.onboarding.roles.coordinator}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2 pt-2 text-center">
                                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">{t.onboarding.fields.institution}</label>
                                            <input
                                                type="text"
                                                required={decoded.role === 'MANAGER'}
                                                value={formData.institution}
                                                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                                                placeholder={decoded.role === 'MANAGER' ? t.onboarding.placeholders.institution : "Opcional"}
                                                className="w-full text-center py-3.5 bg-white/5 border-2 border-white/10 rounded-2xl text-[13px] font-bold text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-white/10"
                                            />
                                        </div>
                                    </div>

                                    <div className="px-4 text-center">
                                        <p className="text-[9px] text-white/40 leading-relaxed font-bold uppercase tracking-wide">
                                            Su cuenta será vinculada al sistema oficial <br />
                                            de <span className="text-emerald-400">Nos Planet</span>
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-4">{t.onboarding.fields.password}</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    required
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    placeholder={t.onboarding.placeholders.password}
                                                    className="w-full text-center py-3.5 bg-white/5 border-2 border-white/10 rounded-2xl text-[13px] font-black text-white outline-none focus:border-emerald-500/50 transition-all font-mono"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white"
                                                >
                                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-4">{t.onboarding.fields.confirmPassword}</label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    required
                                                    value={formData.confirmPassword}
                                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                    placeholder={t.onboarding.placeholders.confirmPassword}
                                                    className="w-full text-center py-3.5 bg-white/5 border-2 border-white/10 rounded-2xl text-[13px] font-black text-white outline-none focus:border-emerald-500/50 transition-all font-mono"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white"
                                                >
                                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {validationError && (
                            <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-pulse">
                                <ShieldCheck size={14} className="text-red-500 shrink-0" />
                                <p className="text-[8px] font-black text-red-400 uppercase tracking-widest leading-none">
                                    {validationError}
                                </p>
                            </div>
                        )}

                        <div className="flex gap-3">
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    onClick={handleBackStep}
                                    className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-[18px] font-bold text-[9px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border border-white/5"
                                >
                                    <ArrowLeft size={13} /> {t.onboarding.buttons.back}
                                </button>
                            )}

                            {currentStep < 3 ? (
                                <button
                                    type="button"
                                    onClick={handleNextStep}
                                    className="flex-[2] py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[18px] font-bold text-[9px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                                >
                                    {t.onboarding.buttons.next} <ArrowRight size={13} />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="flex-[2] py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[18px] font-bold text-[9px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? <Loader2 size={13} className="animate-spin" /> : t.onboarding.buttons.finish}
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="text-center pt-1">
                        <p className="text-[8px] text-white/20 font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                            NOS PLANET <span className="w-1.5 h-1.5 bg-emerald-500/40 rounded-full animate-pulse" /> SEGURIDAD
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingView;

