import React, { useState } from 'react';
import { useForgotPasswordMutation } from '../../store/auth/authApi';
import { Mail, ArrowLeft, Loader2, CheckCircle2, XCircle, Leaf } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPasswordView = ({ t }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [feedbackModal, setFeedbackModal] = useState({
        open: false,
        type: 'success',
        title: '',
        message: ''
    });
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

    const closeFeedbackModal = () => {
        if (feedbackModal.type === 'success') {
            navigate('/auth/login');
            return;
        }
        setFeedbackModal((prev) => ({ ...prev, open: false }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await forgotPassword(email).unwrap();
            setFeedbackModal({
                open: true,
                type: 'success',
                title: '¡Correo Enviado!',
                message: `Enviamos el enlace de recuperación a ${email}. Revisa tu bandeja e intenta nuevamente desde ese link.`
            });
            setEmail('');
        } catch (err) {
            console.error('Error sending forgot password email:', err);
            setFeedbackModal({
                open: true,
                type: 'error',
                title: 'No se pudo enviar',
                message: err?.data?.message || 'No pudimos procesar la solicitud de restablecimiento. Intenta nuevamente.'
            });
        }
    };

    return (
        <div className="h-screen w-full bg-[#070707] flex items-center justify-center overflow-hidden relative p-4">
            {/* Background Blur Effect - NOTABLE */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 opacity-60 blur-md scale-105"
                style={{ backgroundImage: "url('/src/assets/desktop/hero_nature_v2.webp')" }}
            />
            <div className="absolute inset-0 bg-black/40 z-0" />

            {feedbackModal.open && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={closeFeedbackModal} />
                    <div className="relative w-full max-w-md bg-white/10 backdrop-blur-3xl rounded-[48px] p-12 border border-white/20 shadow-[0_35px_90px_-25px_rgba(0,0,0,0.9)] text-center space-y-8 animate-in zoom-in-95 duration-200">
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${feedbackModal.type === 'success' ? 'bg-emerald-500 shadow-xl shadow-emerald-500/30' : 'bg-red-500 shadow-xl shadow-red-500/30'}`}>
                            {feedbackModal.type === 'success' ? (
                                <CheckCircle2 size={48} className="text-white" />
                            ) : (
                                <XCircle size={48} className="text-white" />
                            )}
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">{feedbackModal.title}</h2>
                            <p className="text-sm text-white/60 leading-relaxed font-bold uppercase tracking-widest">{feedbackModal.message}</p>
                        </div>
                        <button
                            onClick={closeFeedbackModal}
                            className={`w-full py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:-translate-y-1 active:scale-95 shadow-2xl ${feedbackModal.type === 'success' ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/20' : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20'}`}
                        >
                            ENTENDIDO
                        </button>
                    </div>
                </div>
            )}

            <div className="relative z-10 w-full max-w-[380px] bg-white/10 backdrop-blur-3xl rounded-[40px] border border-white/20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-bottom-8 overflow-hidden">
                <div className="px-6 py-10 md:px-10 md:py-12 space-y-10">

                    {/* Header with Circular Logo and Leaves */}
                    <div className="flex flex-col items-center">
                        <div className="relative group">
                            <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-[30deg] text-emerald-500/40 group-hover:text-emerald-500 transition-colors duration-500">
                                <Leaf size={40} fill="currentColor" />
                            </div>
                            <div className="absolute -right-12 top-1/2 -translate-y-1/2 rotate-[30deg] text-emerald-500/40 group-hover:text-emerald-500 transition-colors duration-500">
                                <Leaf size={40} fill="currentColor" />
                            </div>
                            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] border-4 border-white/10 relative z-10">
                                <Mail size={48} className="text-white" />
                            </div>
                        </div>

                        <div className="mt-8 text-center space-y-2">
                            <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-tight">¿Olvidas algo?</h1>
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none">Recupera tu acceso oficial</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2 text-center">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Correo Electrónico</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ejemplo@nosplanet.com"
                                required
                                className="w-full text-center py-5 bg-white/5 border-2 border-white/10 rounded-[28px] text-sm font-black text-white outline-none focus:border-emerald-500 focus:bg-white/10 transition-all shadow-inner"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-6 bg-emerald-500 hover:bg-emerald-400 text-white rounded-[28px] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/30 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                        >
                            {isLoading ? 'ENVIANDO...' : 'ENVIAR INSTRUCCIONES'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordView;
