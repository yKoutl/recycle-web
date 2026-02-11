import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Sparkles, ArrowRight, ArrowLeft, User } from 'lucide-react';

const ContactSection = ({ t }) => {
    const [showForm, setShowForm] = useState(false);

    return (
        <section
            id="contact"
            className={`py-24 relative overflow-hidden transition-all duration-1000 ease-in-out ${showForm
                ? 'bg-[#00281F] dark:bg-[#011c16]'
                : 'bg-[#FEFDFB] dark:bg-[#020617]'
                }`}
        >
            {/* Dynamic Background Accents */}
            <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none transition-all duration-1000 ${showForm ? 'bg-emerald-600/10' : 'bg-emerald-500/5'
                }`} />
            <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none transition-all duration-1000 ${showForm ? 'bg-emerald-400/5' : 'bg-emerald-500/5'
                }`} />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-6xl mx-auto">
                    {/* SWAPPED LAYOUT Container */}
                    <div className={`flex flex-col items-center gap-12 lg:gap-20 transition-all duration-700 ease-in-out ${showForm ? 'lg:flex-row' : 'lg:flex-row-reverse'
                        }`}>

                        {/* 1. CONTENT SIDE (Titles & Info) */}
                        <div className={`flex-1 space-y-10 transition-all duration-700 delay-100 ${showForm ? 'opacity-90 translate-x-0' : 'opacity-100 translate-x-0'
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
                            <div className="space-y-6 pt-2">
                                {[
                                    { icon: Mail, label: 'EMAIL', value: 'contacto@nosplanet.com' },
                                    { icon: Phone, label: 'TELÉFONO', value: '+51 987 654 321' },
                                    { icon: MapPin, label: 'UBICACIÓN', value: 'Lima, Perú' }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-5 group">
                                        <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-500 ${showForm
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

                        {/* 2. ACTION SIDE (Card or Form) */}
                        <div className="w-full lg:w-[520px] transition-all duration-700 ease-out">
                            {!showForm ? (
                                <div
                                    onClick={() => setShowForm(true)}
                                    className="group relative cursor-pointer aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-900 shadow-2xl transition-all duration-700 hover:scale-[1.02] hover:shadow-emerald-900/30"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2000&auto=format&fit=crop"
                                        alt="Nature"
                                        className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#018F64] via-transparent to-transparent opacity-80" />

                                    <div className="relative h-full flex flex-col items-center justify-center p-10 text-center text-white space-y-6">
                                        <div className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center group-hover:bg-[#018F64] transition-all duration-500 shadow-lg">
                                            <MessageSquare size={28} />
                                        </div>
                                        <h3 className="text-3xl font-black uppercase tracking-tighter leading-tight">
                                            Empezar un <br />Proyecto
                                        </h3>
                                        <div className="inline-flex items-center gap-2 text-[#B0EEDE] font-black uppercase text-[9px] tracking-[0.3em] opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                            Click para abrir
                                            <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-[#FCFDFD] dark:bg-[#0f172a] rounded-xl p-10 lg:p-14 shadow-[0_30px_90px_-15px_rgba(0,0,0,0.3)] border border-white dark:border-white/5 animate-scale-in relative">
                                    <button
                                        onClick={() => setShowForm(false)}
                                        className="absolute top-10 right-10 text-gray-300 hover:text-[#018F64] transition-colors"
                                    >
                                        <ArrowLeft size={24} />
                                    </button>

                                    <div className="space-y-10">
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter border-b border-gray-100 dark:border-white/5 pb-6">Envíanos un mensaje</h3>

                                        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                                            <div className="space-y-3 group">
                                                <label className="text-[11px] font-bold text-[#64748b] dark:text-gray-400 uppercase tracking-widest">Nombre Completo</label>
                                                <div className="flex items-center gap-4 py-3 border-b border-gray-200 dark:border-white/10 focus-within:border-[#018F64] transition-all">
                                                    <User size={18} className="text-[#94a3b8] group-focus-within:text-[#018F64] transition-colors" />
                                                    <input type="text" placeholder="Ej. Juan Pérez" className="w-full bg-transparent outline-none text-[#1e293b] dark:text-white placeholder:text-[#cbd5e1] font-semibold" />
                                                </div>
                                            </div>

                                            <div className="space-y-3 group">
                                                <label className="text-[11px] font-bold text-[#64748b] dark:text-gray-400 uppercase tracking-widest">Correo Electrónico</label>
                                                <div className="flex items-center gap-4 py-3 border-b border-gray-200 dark:border-white/10 focus-within:border-[#018F64] transition-all">
                                                    <Mail size={18} className="text-[#94a3b8] group-focus-within:text-[#018F64] transition-colors" />
                                                    <input type="email" placeholder="juan@correo.com" className="w-full bg-transparent outline-none text-[#1e293b] dark:text-white placeholder:text-[#cbd5e1] font-semibold" />
                                                </div>
                                            </div>

                                            <div className="space-y-3 group">
                                                <label className="text-[11px] font-bold text-[#64748b] dark:text-gray-400 uppercase tracking-widest">Mensaje</label>
                                                <div className="flex items-start gap-4 py-3 border-b border-gray-200 dark:border-white/10 focus-within:border-[#018F64] transition-all">
                                                    <MessageSquare size={18} className="text-[#94a3b8] mt-1 group-focus-within:text-[#018F64] transition-colors" />
                                                    <textarea rows="2" placeholder="¿En qué podemos ayudarte?" className="w-full bg-transparent outline-none text-[#1e293b] dark:text-white placeholder:text-[#cbd5e1] font-semibold resize-none text-lg" />
                                                </div>
                                            </div>

                                            <button className="w-full py-5 bg-[#018F64] hover:bg-[#05835D] text-white font-black uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-emerald-950/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-4 group">
                                                <span className="text-sm font-black">ENVIAR MENSAJE</span>
                                                <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scale-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-scale-in {
                    animation: scale-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}} />
        </section>
    );
};

export default ContactSection;
