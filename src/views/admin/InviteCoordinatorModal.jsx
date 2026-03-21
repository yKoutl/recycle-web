import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, Mail, CheckCircle2, Loader2, Sparkles, ShieldCheck, Leaf } from 'lucide-react';
import { useInviteCoordinatorMutation } from '../../store/auth/authApi';

const InviteCoordinatorModal = ({ isOpen, onClose, themeColor, managerName, managerId }) => {
    const [email, setEmail] = useState('');
    const [inviteCoordinator, { isLoading }] = useInviteCoordinatorMutation();
    const [isSent, setIsSent] = useState(false);
    const [localError, setLocalError] = useState('');

    const accent = themeColor || '#018F64';

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLocalError('');
            await inviteCoordinator({ email, managerId }).unwrap();
            setIsSent(true);
        } catch (error) {
            setLocalError(error.data?.message || 'Error al enviar la invitación');
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            <div
                className="relative w-full max-w-[380px] bg-white/10 backdrop-blur-3xl rounded-[40px] shadow-2xl overflow-hidden border border-white/20 animate-scale-up"
            >
                <div className="px-8 py-10 space-y-6">
                    {/* Visual Header Decoration - Logo with Leaves */}
                    <div className="flex flex-col items-center">
                        <div className="relative group">
                            <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-[30deg] text-emerald-500/40">
                                <Leaf size={40} fill="currentColor" />
                            </div>
                            <div className="absolute -right-12 top-1/2 -translate-y-1/2 rotate-[30deg] text-emerald-500/40">
                                <Leaf size={40} fill="currentColor" />
                            </div>
                            <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center shadow-xl border-4 border-white/10 relative z-10">
                                <Send size={32} className="text-white" />
                            </div>
                        </div>
                    </div>

                    {isSent ? (
                        <div className="text-center space-y-6 animate-fade-in py-4">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 size={32} className="text-emerald-500" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-xl font-black text-white tracking-tight">¡Enviada!</h2>
                                <p className="text-[10px] text-gray-400 leading-relaxed max-w-xs mx-auto font-bold tracking-wide">
                                    Invitación enviada a <span className="text-emerald-500">{email}</span>.
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-full py-4 bg-white/5 text-white/60 rounded-2xl font-bold text-[10px] tracking-widest hover:bg-white/10 transition-all border border-white/5"
                            >
                                Cerrar ventana
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="text-center space-y-2">
                                <h2 className="text-2xl font-black text-white tracking-tight">
                                    Sumar al equipo
                                </h2>
                                <p className="text-[9px] text-gray-400 font-medium uppercase tracking-[0.2em] leading-relaxed">
                                    Gestión para {managerName || 'este perfil'}
                                </p>
                            </div>

                            {localError && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                                    <p className="text-[9px] font-black text-red-400 uppercase tracking-widest leading-relaxed text-center">
                                        {localError}
                                    </p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2 text-center">
                                    <label className="text-[10px] font-bold text-gray-500 tracking-wide">Correo del invitado</label>
                                    <div className="relative group">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="coordinador@institucion.com"
                                            required
                                            className="w-full text-center py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-[13px] font-bold text-white outline-none focus:border-emerald-500 transition-all placeholder:text-gray-600"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-4.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[20px] font-bold text-[12px] tracking-tight transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Enviar invitación'}
                                    </button>

                                    <div className="flex items-center gap-3 text-white/20 justify-center">
                                        <ShieldCheck size={12} />
                                        <span className="text-[8px] font-black uppercase tracking-widest">Invitación segura Nos Planet</span>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                <div className="absolute top-5 right-5">
                    <button onClick={onClose} className="p-2 text-white/20 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default InviteCoordinatorModal;
