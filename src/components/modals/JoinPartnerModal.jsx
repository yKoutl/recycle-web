import React, { useState, useEffect } from 'react';
import { X, Handshake, CheckCircle, Mail, User, ArrowLeft, Send, Sparkles, Leaf, Briefcase, Globe, MessageSquare } from 'lucide-react';
import Button from '../shared/Button';

const JoinPartnerModal = ({ isOpen, onClose }) => {
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        category: '',
        comment: ''
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({ name: '', email: '', category: '', comment: '' });
            setSuccess(false);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSuccess(true);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden outline-none">
            {/* Backdrop with Eco Image and Blur (Consistent with AddCommentModal) */}
            <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-start pointer-events-none">
                <img
                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1600"
                    alt="Eco background"
                    className="absolute inset-0 w-full h-full object-cover opacity-[0.12] scale-105"
                />

                {/* Author Quote Area */}
                <div className="relative z-10 ml-12 lg:ml-24 max-w-lg p-12 bg-white/5 backdrop-blur-sm rounded-[3rem] border border-white/10 hidden md:block text-left">
                    <Sparkles size={40} className="text-[#018F64] dark:text-[#B0EEDE] mb-6 opacity-30" />
                    <p className="text-2xl lg:text-3xl font-black text-gray-800 dark:text-gray-100 leading-tight italic tracking-tighter">
                        "El futuro pertenece a quienes creen en la belleza de sus sueños sostenibles."
                    </p>
                    <p className="mt-4 text-[11px] font-black uppercase tracking-[0.4em] text-[#018F64] dark:text-[#B0EEDE]">
                        — UNIÓN POR EL PLANETA
                    </p>
                </div>

                <div
                    className="absolute inset-0 bg-gray-100/40 dark:bg-[#020617]/90 backdrop-blur-md transition-opacity duration-500 pointer-events-auto"
                    onClick={onClose}
                />
            </div>

            {/* Side Panel - Media Luna Style */}
            <div className="relative z-10 w-full max-w-xl bg-white dark:bg-[#0f172a] h-full shadow-[-30px_0_60px_rgba(0,0,0,0.3)] animate-slide-in-right flex flex-col border-none">

                {/* Vertical Phrase on the Right Edge */}
                <div className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none hidden lg:flex">
                    <p className="whitespace-nowrap rotate-90 text-[10px] font-black text-gray-200 dark:text-gray-800 uppercase tracking-[0.6em]">
                        CONSTRUYENDO ALIANZAS VERDES
                    </p>
                </div>

                {/* SVG Media Luna Edge */}
                <div className="absolute top-0 bottom-0 -left-[63px] w-[64px] pointer-events-none hidden lg:block overflow-hidden">
                    <svg width="64" height="100%" viewBox="0 0 64 1024" preserveAspectRatio="none" className="block translate-x-[1px]">
                        <path
                            d="M64 0C64 0 0 150 0 512C0 874 64 1024 64 1024V0Z"
                            fill="currentColor"
                            className="text-white dark:text-[#0f172a]"
                        />
                    </svg>
                </div>

                {/* Header Section */}
                <div className="px-12 pt-12 flex items-center justify-between z-20">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-3 text-gray-400 dark:text-gray-500 hover:text-[#018F64] transition-all group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] font-ui">VOLVER ATRÁS</span>
                    </button>
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <Handshake size={20} />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto px-12 lg:pl-16 lg:pr-24 flex flex-col justify-start pt-8 lg:pt-12 custom-scrollbar">
                    {!success ? (
                        <div className="space-y-10 w-full py-4">
                            {/* Title Section */}
                            <div>
                                <h3 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-2 tracking-tighter">
                                    Únete como <br /><span className="text-[#018F64] dark:text-[#B0EEDE]">Aliado</span>
                                </h3>
                                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
                                    IMPULSA TU IMPACTO AMBIENTAL
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8 pb-10">
                                {/* Form Inputs - Soft backgrounds, NO LINES */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#018F64] dark:text-[#B0EEDE] flex items-center gap-3 ml-1">
                                        <Briefcase size={14} strokeWidth={3} />
                                        <span>NOMBRE DE LA EMPRESA</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Ej: EcoSolutions SAC"
                                        className="w-full bg-gray-50/60 dark:bg-white/5 border-none rounded-2xl py-4 px-6 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-base font-bold dark:text-white shadow-sm"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#018F64] dark:text-[#B0EEDE] flex items-center gap-3 ml-1">
                                        <Mail size={14} strokeWidth={3} />
                                        <span>CORREO CORPORATIVO</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="empresa@contacto.com"
                                        className="w-full bg-gray-50/60 dark:bg-white/5 border-none rounded-2xl py-4 px-6 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-base font-bold dark:text-white shadow-sm"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#018F64] dark:text-[#B0EEDE] flex items-center gap-3 ml-1">
                                        <Globe size={14} strokeWidth={3} />
                                        <span>PÁGINA WEB / REDES</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        placeholder="www.tusitio.com"
                                        className="w-full bg-gray-50/60 dark:bg-white/5 border-none rounded-2xl py-4 px-6 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-base font-bold dark:text-white shadow-sm"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#018F64] dark:text-[#B0EEDE] flex items-center gap-3 ml-1">
                                        <MessageSquare size={14} strokeWidth={3} />
                                        <span>MENSAJE</span>
                                    </label>
                                    <textarea
                                        required
                                        value={formData.comment}
                                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                        placeholder="Cuéntanos sobre tu empresa..."
                                        className="w-full h-32 bg-gray-50/60 dark:bg-white/5 border-none rounded-[2.5rem] p-8 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-base font-medium dark:text-gray-200 resize-none shadow-inner"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-18 rounded-[2.5rem] text-xl font-black bg-[#018F64] dark:bg-[#B0EEDE] dark:text-[#020617] text-white shadow-2xl shadow-emerald-600/30 border-none transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
                                    icon={Send}
                                >
                                    Enviar Postulación
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-in zoom-in duration-500">
                            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-3xl flex items-center justify-center mb-8 shadow-xl">
                                <CheckCircle size={48} />
                            </div>
                            <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-4">¡Solicitud Enviada!</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-xs mx-auto font-medium">
                                Nuestro equipo revisará tu perfil y te contactará en menos de 24 horas.
                            </p>
                            <Button onClick={onClose} className="px-12 h-16 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold">
                                Volver al inicio
                            </Button>
                        </div>
                    )}
                </div>

                {/* Footer Decor */}
                <div className="py-12 text-center mt-auto">
                    <p className="text-[10px] font-black text-gray-200 dark:text-gray-800 uppercase tracking-[1em] lg:mr-8">RECYCLEAPP PARTNERS</p>
                </div>
            </div>
        </div>
    );
};

export default JoinPartnerModal;
