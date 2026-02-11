import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Send, CheckCircle, Sparkles, User, Mail, Leaf, ArrowLeft, Heart, Quote } from 'lucide-react';
import Button from '../shared/Button';

const AddCommentModal = ({ isOpen, onClose, t }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(5);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setName('');
            setEmail('');
            setComment('');
            setRating(5);
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
            {/* Backdrop with Clearer Community Image and Author Quote */}
            <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-start pointer-events-none">
                <img
                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1600"
                    alt="Eco community"
                    className="absolute inset-0 w-full h-full object-cover opacity-[0.14] scale-105"
                />

                {/* Robert Swan Quote - Positioned for balance */}
                <div className="relative z-10 ml-8 lg:ml-20 max-w-md p-10 bg-white/5 backdrop-blur-[4px] rounded-[3rem] border border-white/10 hidden md:block">
                    <Quote size={32} className="text-[#018F64] dark:text-[#B0EEDE] mb-5 opacity-40" />
                    <p className="text-xl lg:text-2xl font-black text-gray-800 dark:text-gray-100 leading-tight italic tracking-tighter">
                        "La mayor amenaza para nuestro planeta es la creencia de que alguien más lo salvará."
                    </p>
                    <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-[#018F64] dark:text-[#B0EEDE]">
                        — Robert Swan
                    </p>
                </div>

                <div
                    className="absolute inset-0 bg-gray-50/40 dark:bg-[#020617]/90 backdrop-blur-md transition-opacity duration-500 pointer-events-auto"
                    onClick={onClose}
                />
            </div>

            {/* Side Panel - Media Luna Style (Corrected spacing and seamless edge) */}
            <div className="relative z-10 w-full max-w-xl bg-white dark:bg-[#0f172a] h-full shadow-[-30px_0_60px_rgba(0,0,0,0.1)] animate-slide-in-right flex flex-col isolation-auto">

                {/* Seamless SVG Edge - Adjusted to prevent the "fine line" gap */}
                <div className="absolute top-0 bottom-0 -left-[63px] w-[64px] pointer-events-none hidden lg:block overflow-hidden">
                    <svg width="64" height="100%" viewBox="0 0 64 1024" preserveAspectRatio="none" className="block translate-x-[1px]">
                        <path
                            d="M64 0C64 0 0 150 0 512C0 874 64 1024 64 1024V0Z"
                            fill="currentColor"
                            className="text-white dark:text-[#0f172a]"
                        />
                    </svg>
                </div>

                {/* Vertical Text - Right side decoration */}
                <div className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none hidden lg:flex">
                    <p className="whitespace-nowrap rotate-90 text-[9px] font-black text-gray-200 dark:text-gray-800 uppercase tracking-[0.6em]">
                        JUNTOS POR UN PLANETA MÁS VERDE
                    </p>
                </div>

                {/* Header Area - Balanced Spacing */}
                <div className="px-12 pt-12 pb-6 flex items-center justify-between z-20">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-3 text-gray-400 dark:text-gray-500 hover:text-[#018F64] transition-all group outline-none"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] font-ui">CERRAR</span>
                    </button>
                    <div className="w-10 h-10 rounded-2xl bg-[#D4F6ED] dark:bg-[#B0EEDE]/10 flex items-center justify-center text-[#018F64] dark:text-[#B0EEDE] lg:mr-4">
                        <Leaf size={18} fill="currentColor" />
                    </div>
                </div>

                {/* Main Content Area - Corrected Title Position (No Collision) */}
                <div className="flex-1 px-12 lg:pl-16 lg:pr-24 flex flex-col justify-start pt-4 lg:pt-8 overflow-y-auto">
                    {!success ? (
                        <div className="space-y-10 w-full py-4">
                            {/* Prominent Title: Cuéntanos tu historia */}
                            <div className="mb-2">
                                <h3 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-2 tracking-tighter">
                                    Cuéntanos tu <span className="text-[#018F64] dark:text-[#B0EEDE]">historia</span>
                                </h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 font-ui">
                                    TU VOZ ES EL MOTOR DEL CAMBIO
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8 pb-10">
                                {/* Form Inputs - Soft backgrounds, no borders */}
                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#018F64] dark:text-[#B0EEDE] flex items-center gap-3 ml-1">
                                        <User size={13} strokeWidth={3} />
                                        <span>NOMBRE COMPLETO</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Tu nombre completo"
                                        className="w-full bg-gray-50/60 dark:bg-white/5 border-none rounded-2xl py-4 px-6 focus:ring-4 focus:ring-[#018F64]/5 outline-none transition-all text-base font-bold dark:text-white"
                                    />
                                </div>

                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#018F64] dark:text-[#B0EEDE] flex items-center gap-3 ml-1">
                                        <Mail size={13} strokeWidth={3} />
                                        <span>CORREO ELECTRÓNICO</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="tu@correo.com"
                                        className="w-full bg-gray-50/60 dark:bg-white/5 border-none rounded-2xl py-4 px-6 focus:ring-4 focus:ring-[#018F64]/5 outline-none transition-all text-base font-bold dark:text-white"
                                    />
                                </div>

                                <div className="flex items-center justify-between p-6 bg-gray-50/60 dark:bg-white/5 rounded-[2.5rem]">
                                    <div className="flex items-center gap-3">
                                        <Heart size={18} fill="#018F64" className="text-[#018F64] dark:text-[#B0EEDE]" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 font-ui">CALIFICACIÓN</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className={`transition-all transform hover:scale-125 ${star <= rating ? 'text-[#018F64] dark:text-[#B0EEDE]' : 'text-gray-200 dark:text-gray-800'}`}
                                            >
                                                <Sparkles size={28} fill={star <= rating ? "currentColor" : "none"} strokeWidth={1.5} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#018F64] dark:text-[#B0EEDE] flex items-center gap-3 ml-1">
                                        <MessageSquare size={13} strokeWidth={3} />
                                        <span>TU MENSAJE</span>
                                    </label>
                                    <textarea
                                        required
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="¿Cómo ha sido tu experiencia con RecycleApp?"
                                        className="w-full h-32 bg-gray-50/60 dark:bg-white/5 rounded-[2.5rem] p-8 focus:ring-4 focus:ring-[#018F64]/5 outline-none transition-all text-base font-medium dark:text-gray-200 resize-none shadow-inner"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-20 rounded-[2.5rem] text-xl font-black bg-[#018F64] dark:bg-[#B0EEDE] dark:text-[#020617] text-white shadow-2xl shadow-[#018F64]/30 border-none transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
                                    icon={Send}
                                >
                                    Enviar Comentario
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <div className="text-center py-10 animate-in zoom-in duration-500">
                            <CheckCircle size={80} className="text-[#018F64] dark:text-[#B0EEDE] mx-auto mb-8" />
                            <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-4">¡Enviado!</h3>
                            <button onClick={onClose} className="text-sm font-bold text-gray-500 uppercase tracking-widest hover:text-[#018F64] outline-none">Volver</button>
                        </div>
                    )}
                </div>

                {/* Footer Decor */}
                <div className="py-10 text-center mt-auto">
                    <p className="text-[9px] font-black text-gray-200 dark:text-gray-800 uppercase tracking-[1em] lg:mr-8">RECYCLEAPP</p>
                </div>
            </div>
        </div>
    );
};

export default AddCommentModal;
