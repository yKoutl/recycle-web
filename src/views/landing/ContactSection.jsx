import React, { useState, useCallback } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Sparkles, ArrowRight, ArrowLeft, User, CheckCircle2, Loader2 } from 'lucide-react';

import { useSubmitContactMutation } from '../../store/contact/contactApi';

const ContactSection = ({ t }) => {
    const [showForm, setShowForm] = useState(false);
    const [submitContact, { isLoading, isSuccess }] = useSubmitContactMutation();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        try {
            await submitContact(formData).unwrap();
            setFormData({ fullName: '', email: '', phone: '', message: '' });
            setTimeout(() => setShowForm(false), 3000);
        } catch (error) {
            // Error managed via UI state if needed, but alert/console removed.
        }
    }, [formData, submitContact]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    return (
        <section
            className={`py-24 relative overflow-hidden transition-colors duration-1000 ease-in-out ${showForm
                ? 'bg-[#00281F] dark:bg-[#011c16]'
                : 'bg-[#FEFDFB] dark:bg-[#020617]'
                }`}
        >
            {/* Dynamic Background Accents */}
            <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none transition-colors duration-1000 ${showForm ? 'bg-emerald-600/10' : 'bg-emerald-500/5'
                }`} />
            <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none transition-colors duration-1000 ${showForm ? 'bg-emerald-400/5' : 'bg-emerald-500/5'
                }`} />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-6xl mx-auto">
                    {/* SWAPPED LAYOUT Container */}
                    <div className="flex flex-col items-center lg:items-start gap-12 lg:gap-16 lg:flex-row transition-[transform,opacity] duration-700 ease-in-out">

                        {/* 1. CONTENT SIDE (Titles & Info) */}
                        <div className={`flex-1 space-y-10 lg:space-y-11 transition-all duration-700 delay-100 ${showForm ? 'opacity-90 translate-x-0' : 'opacity-100 translate-x-0'
                            }`}>
                            <div className="space-y-6">
                                <div className="inline-block transition-all duration-700">
                                    <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 transition-colors duration-700 ${showForm ? 'text-emerald-400' : 'text-[#018F64] dark:text-[#10B981]'
                                        }`}>CONVERSEMOS</p>
                                    <div className={`w-12 h-[2px] transition-colors duration-700 ${showForm ? 'bg-emerald-400' : 'bg-[#018F64] dark:bg-[#10B981]'
                                        }`} />
                                </div>

                                <h2 className={`text-4xl md:text-5xl font-black leading-[1.1] tracking-tighter transition-colors duration-700 ${showForm ? 'text-white' : 'text-gray-900 dark:text-white'
                                    }`}>
                                    ¿Listo para transformar <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#018F64] to-[#10B981]">
                                        tu proyecto?
                                    </span>
                                </h2>

                                <p className={`text-lg font-medium leading-relaxed max-w-lg transition-colors duration-700 ${showForm ? 'text-emerald-100/60' : 'text-gray-500 dark:text-gray-400'
                                    }`}>
                                    Estamos aquí para ayudarte a construir un futuro más sostenible. Escríbenos para iniciar tu próximo proyecto verde.
                                </p>
                            </div>

                            {/* Contact Info List */}
                            <div className="space-y-7 pt-3">
                                {[
                                    { icon: Mail, label: 'EMAIL', value: 'contacto@nosplanet.com' },
                                    { icon: Phone, label: 'TELÉFONO', value: '+51 987 654 321' },
                                    { icon: MapPin, label: 'UBICACIÓN', value: 'Lima, Perú' }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-5 group">
                                        <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors duration-500 ${showForm
                                            ? 'border-emerald-500/20 text-emerald-400'
                                            : 'border-gray-100 dark:border-white/10 text-gray-400 group-hover:border-[#018F64] group-hover:text-[#018F64]'
                                            }`}>
                                            <item.icon size={18} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <p className={`text-[10px] font-black uppercase tracking-widest mb-0.5 transition-colors duration-700 ${showForm ? 'text-emerald-500' : 'text-gray-400 dark:text-gray-500'
                                                }`}>{item.label}</p>
                                            <p className={`text-lg font-bold transition-colors duration-700 ${showForm ? 'text-white' : 'text-gray-900 dark:text-gray-200'
                                                }`}>{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. ACTION SIDE (Liquid Waterfall Reveal) */}
                        <div className="w-full lg:w-[520px] h-[580px] sm:h-[620px] relative overflow-hidden rounded-[2.5rem] shadow-2xl border border-white/5 bg-gray-900 group/container transition-all duration-700 hover:border-emerald-500/20 will-change-transform">
                            {/* Card Display */}
                            <div className={`absolute inset-0 z-10 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-[transform,opacity] ${showForm ? 'opacity-0 scale-95 pointer-events-none -translate-y-10' : 'opacity-100 scale-100'}`}>
                                <div
                                    onClick={() => setShowForm(true)}
                                    className="relative h-full w-full cursor-pointer bg-gray-950"
                                >
                                    <div className="absolute inset-x-0 inset-y-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-20" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/recycled-paper.png")' }} />
                                    <img
                                        src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2000&auto=format&fit=crop"
                                        alt="Nature"
                                        loading="lazy"
                                        className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover/container:scale-110 group-hover/container:saturate-[1.3] group-hover/container:brightness-110 transition-all duration-1000 ease-out will-change-transform"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#018F64] via-transparent to-transparent opacity-85 hover:opacity-95 transition-opacity duration-700" />

                                    <div className="relative h-full flex flex-col items-center justify-center p-8 sm:p-12 text-center text-white space-y-7 z-30">
                                        <div className="w-16 h-16 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full flex items-center justify-center group-hover/container:bg-[#018F64] group-hover/container:scale-105 transition-all duration-500 shadow-2xl">
                                            <MessageSquare size={28} />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter leading-[0.9]">
                                                Empezar un <br />
                                                <span className="text-emerald-400">Proyecto</span>
                                            </h3>
                                            <div className="pt-4 flex items-center justify-center gap-2 text-[9px] font-black text-emerald-200/40 uppercase tracking-[0.4em] group-hover/container:text-emerald-300 group-hover/container:translate-x-1 transition-all duration-500">
                                                Click para abrir <ArrowRight size={14} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form Display (Water Slide Down) */}
                            <div
                                className={`absolute inset-0 z-20 transition-all duration-[1300ms] ease-[cubic-bezier(0.19,1,0.22,1)] will-change-[transform,clip-path,opacity] ${showForm ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1/2'}`}
                                style={{
                                    clipPath: showForm ? 'circle(150% at 50% 0%)' : 'circle(0% at 50% 0%)',
                                    transitionDelay: showForm ? '100ms' : '0ms'
                                }}
                            >
                                <div className="h-full w-full bg-[#08152A] dark:bg-[#08152A] relative flex flex-col pt-4 overflow-hidden">
                                    {/* Liquid Background Accents */}
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
                                    <div className="absolute top-40 -left-10 w-40 h-40 bg-emerald-400/5 rounded-full blur-3xl" />
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent blur-sm" />

                                    <button
                                        onClick={() => setShowForm(false)}
                                        className="absolute top-6 right-8 text-gray-500 hover:text-emerald-500 transition-colors z-30 p-2"
                                    >
                                        <ArrowLeft size={24} />
                                    </button>

                                    <div className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10 hide-scrollbar scroll-smooth">
                                        {isSuccess ? (
                                            <div className="h-full flex flex-col items-center justify-center space-y-7 animate-water-reveal">
                                                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400">
                                                    <CheckCircle2 size={40} />
                                                </div>
                                                <div className="text-center space-y-2">
                                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">¡Enviado!</h3>
                                                    <p className="text-gray-400 font-medium tracking-tight text-sm">Construyamos algo verde juntos.</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-7 animate-water-reveal">
                                                <div className="border-b border-white/10 pb-4">
                                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">Conversemos</h3>
                                                    <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Digital y Sostenible</p>
                                                </div>

                                                <form className="space-y-4.5" onSubmit={handleSubmit}>
                                                    <div className="space-y-1.5 group">
                                                        <label className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest group-focus-within:text-emerald-400 transition-colors">Nombre</label>
                                                        <input
                                                            name="fullName"
                                                            type="text"
                                                            value={formData.fullName}
                                                            onChange={handleChange}
                                                            placeholder="Representante / Empresa"
                                                            required
                                                            className="w-full bg-transparent border-b border-white/5 py-2.5 text-white outline-none placeholder:text-gray-600 font-bold text-base focus:border-emerald-500 transition-colors"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5 group">
                                                        <label className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest group-focus-within:text-emerald-400 transition-colors">Email</label>
                                                        <input
                                                            name="email"
                                                            type="email"
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                            placeholder="contacto@empresa.com"
                                                            required
                                                            className="w-full bg-transparent border-b border-white/5 py-2.5 text-white outline-none placeholder:text-gray-600 font-bold text-base focus:border-emerald-500 transition-colors"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5 group">
                                                        <label className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest group-focus-within:text-emerald-400 transition-colors">Teléfono</label>
                                                        <input
                                                            name="phone"
                                                            type="tel"
                                                            value={formData.phone}
                                                            onChange={handleChange}
                                                            placeholder="+51 999 000 000"
                                                            required
                                                            className="w-full bg-transparent border-b border-white/5 py-2.5 text-white outline-none placeholder:text-gray-600 font-bold text-base focus:border-emerald-500 transition-colors"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5 group">
                                                        <label className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest group-focus-within:text-emerald-400 transition-colors">Idea</label>
                                                        <textarea
                                                            name="message"
                                                            rows="2"
                                                            value={formData.message}
                                                            onChange={handleChange}
                                                            placeholder="Cuéntanos brevemente..."
                                                            required
                                                            className="w-full bg-transparent border-b border-white/5 py-2.5 text-white outline-none placeholder:text-gray-600 font-bold text-base resize-none focus:border-emerald-500 transition-colors"
                                                        />
                                                    </div>
                                                    <div className="pt-2">
                                                        <button
                                                            disabled={isLoading}
                                                            type="submit"
                                                            className="w-full py-4.5 bg-[#018F64] hover:bg-[#00704d] text-white font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3"
                                                        >
                                                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <span className="text-sm">Enviar Propuesta</span>}
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes water-reveal {
                    from { transform: translateY(30px); opacity: 0; filter: blur(10px); }
                    to { transform: translateY(0); opacity: 1; filter: blur(0); }
                }
                .animate-water-reveal {
                    animation: water-reveal 0.9s cubic-bezier(0.19, 1, 0.22, 1) forwards;
                    will-change: transform, opacity, filter;
                }
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </section>
    );
};

export default ContactSection;
