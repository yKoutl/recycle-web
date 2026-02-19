import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Send, CheckCircle, Sparkles, User, Mail, Leaf, ArrowLeft, Heart, Quote, LogIn, Lock, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../shared/Button';
import { useCreateHistoryMutation } from '../../store/eco-histories/ecoHistoriesApi';

const AddCommentModal = ({ isOpen, onClose, t }) => {
    const navigate = useNavigate();
    const { status, user } = useSelector(state => state.auth);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(5);
    const [success, setSuccess] = useState(false);
    const [createHistory, { isLoading }] = useCreateHistoryMutation();

    useEffect(() => {
        if (isOpen) {
            setComment('');
            setRating(5);
            setSuccess(false);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createHistory({
                message: comment,
                // Podríamos enviar rating si el backend lo soporta, 
                // por ahora el backend solo tiene 'message' y 'photoUrl'
            }).unwrap();
            setSuccess(true);
        } catch (err) {
            console.error('Error al enviar historia:', err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden outline-none">
            {/* Backdrop */}
            <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-start pointer-events-none">
                <img
                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1600"
                    alt="Eco community"
                    className="absolute inset-0 w-full h-full object-cover opacity-[0.14] scale-105"
                />

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

            {/* Side Panel */}
            <div className="relative z-10 w-full max-w-xl bg-white dark:bg-[#0f172a] h-full shadow-[-30px_0_60px_rgba(0,0,0,0.1)] animate-slide-in-right flex flex-col isolation-auto">
                {/* Seamless SVG Edge */}
                <div className="absolute top-0 bottom-0 -left-[63px] w-[64px] pointer-events-none hidden lg:block overflow-hidden">
                    <svg width="64" height="100%" viewBox="0 0 64 1024" preserveAspectRatio="none" className="block translate-x-[1px]">
                        <path d="M64 0C64 0 0 150 0 512C0 874 64 1024 64 1024V0Z" fill="currentColor" className="text-white dark:text-[#0f172a]" />
                    </svg>
                </div>

                {/* Header Area */}
                <div className="px-12 pt-12 pb-6 flex items-center justify-between z-20">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-3 text-gray-400 dark:text-gray-500 hover:text-[#018F64] transition-all group outline-none"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">CERRAR</span>
                    </button>
                    <div className="w-10 h-10 rounded-2xl bg-[#D4F6ED] dark:bg-[#B0EEDE]/10 flex items-center justify-center text-[#018F64] dark:text-[#B0EEDE] lg:mr-4">
                        <Leaf size={18} fill="currentColor" />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 px-12 lg:pl-16 lg:pr-24 flex flex-col justify-start pt-4 lg:pt-8 overflow-y-auto">
                    {status !== 'authenticated' ? (
                        /* Login Prompt if not authenticated */
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-500">
                            <div className="w-24 h-24 rounded-[2.5rem] bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                                <Lock size={40} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-gray-900 dark:text-white leading-tight mb-2 tracking-tighter">
                                    Necesitas iniciar <span className="text-orange-500">sesión</span>
                                </h3>
                                <p className="text-sm text-gray-500 font-medium max-w-xs mx-auto">
                                    Para compartir tu EcoHistoria, primero debes ser parte de nuestra comunidad.
                                </p>
                            </div>
                            <Button
                                className="w-full h-16 rounded-3xl text-base font-black bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/20"
                                onClick={() => {
                                    onClose();
                                    navigate('/auth/login');
                                }}
                                icon={LogIn}
                            >
                                Iniciar Sesión Ahora
                            </Button>
                        </div>
                    ) : !success ? (
                        <div className="space-y-10 w-full py-4">
                            <div className="mb-2">
                                <h3 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-2 tracking-tighter">
                                    Cuéntanos tu <span className="text-[#018F64] dark:text-[#B0EEDE]">historia</span>
                                </h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
                                    HOLA, {user?.fullName?.split(' ')[0].toUpperCase()} • TU VOZ ES EL CAMBIO
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8 pb-10">
                                {/* Autfilled Profile Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 bg-gray-50/60 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Autor</p>
                                        <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{user?.fullName}</p>
                                    </div>
                                    <div className="p-5 bg-gray-50/60 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Email</p>
                                        <p className="text-sm font-black text-gray-900 dark:text-white truncate">{user?.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-6 bg-gray-50/60 dark:bg-white/5 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-inner">
                                    <div className="flex items-center gap-3">
                                        <Heart size={18} fill="#018F64" className="text-[#018F64]" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">CALIFICACIÓN</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className={`transition-all transform hover:scale-125 ${star <= rating ? 'text-[#018F64]' : 'text-gray-200 dark:text-gray-800'}`}
                                            >
                                                <Sparkles size={28} fill={star <= rating ? "currentColor" : "none"} strokeWidth={1.5} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#018F64] flex items-center gap-3 ml-1">
                                        <MessageSquare size={13} strokeWidth={3} />
                                        <span>TU ECO-MENSAJE</span>
                                    </label>
                                    <textarea
                                        required
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="¿Cómo ha sido tu experiencia con RecycleApp?"
                                        className="w-full h-40 bg-gray-50/60 dark:bg-white/5 rounded-[2.5rem] p-8 focus:ring-4 focus:ring-[#018F64]/5 outline-none transition-all text-base font-medium dark:text-gray-200 resize-none shadow-inner border border-transparent focus:border-[#018F64]/20"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-20 rounded-[2.5rem] text-xl font-black bg-[#018F64] text-white shadow-2xl shadow-[#018F64]/30 border-none transition-all hover:scale-[1.02] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                    icon={isLoading ? Loader2 : Send}
                                >
                                    {isLoading ? 'Enviando...' : 'Enviar EcoHistoria'}
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-10 animate-in zoom-in duration-500">
                            <div className="w-24 h-24 rounded-[2.5rem] bg-[#D4F6ED] dark:bg-[#B0EEDE]/10 flex items-center justify-center text-[#018F64] dark:text-[#B0EEDE] border-4 border-white dark:border-[#0f172a] shadow-xl mb-8 animate-bounce-soft">
                                <CheckCircle size={48} />
                            </div>
                            <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter">¡HISTORIA RECIBIDA!</h3>
                            <p className="text-sm text-gray-500 font-medium max-w-xs mx-auto mb-8">
                                Tu EcoHistoria ha sido enviada a moderación. Una vez aprobada por nuestro equipo, será visible para toda la comunidad.
                            </p>
                            <button onClick={onClose} className="text-[10px] font-black text-[#018F64] uppercase tracking-[0.4em] hover:scale-110 transition-transform">VOLVER AL INICIO</button>
                        </div>
                    )}
                </div>

                {/* Footer Decor */}
                <div className="py-10 text-center mt-auto">
                    <p className="text-[9px] font-black text-gray-200 dark:text-gray-800 uppercase tracking-[1em]">RECYCLEAPP</p>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes slide-in-right { from { transform: translateX(100%); } to { transform: translateX(0); } }
                .animate-slide-in-right { animation: slide-in-right 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
            `}} />
        </div>
    );
};

export default AddCommentModal;
