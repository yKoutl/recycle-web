import React, { useState } from 'react';
import { Mail, User, Phone, Send, MessageSquare, Inbox, Clock, CheckCircle2, AlertCircle, Loader2, History, ChevronRight, Reply } from 'lucide-react';
import { useGetContactsQuery, useSubmitContactMutation } from '../../store/contact/contactApi';
import { motion, AnimatePresence } from 'framer-motion';

const CoordinatorContactView = ({ t, themeColor, user }) => {
    const accent = themeColor || '#6439FF';
    const [submitContact, { isLoading: isSubmitting }] = useSubmitContactMutation();
    const { data: contacts = [], isLoading: isLoadingInbox, refetch } = useGetContactsQuery(undefined, { pollingInterval: 30000 });

    const [form, setForm] = useState({
        phone: user?.phone || '',
        message: '',
        recipient: user?.role?.toUpperCase() === 'COORDINATOR' ? 'Gestor' : 'Administrador'
    });

    const [statusModal, setStatusModal] = useState({ show: false, success: true, message: '' });
    const [activeMessage, setActiveMessage] = useState(null);

    // Filtrar mensajes solo del usuario logueado
    const myMessages = contacts
        .filter(c => c.email === user?.email)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.message.trim()) return;

        try {
            await submitContact({
                fullName: user?.fullName || 'Coordinador',
                email: user?.email,
                phone: form.phone,
                message: `[PARA: ${form.recipient}] ${form.message}`,
                role: user?.role?.toUpperCase() // Enviamos el rol para que el admin lo vea
            }).unwrap();

            setStatusModal({
                show: true,
                success: true,
                message: 'Tu mensaje ha sido enviado correctamente al equipo de administración.'
            });
            setForm({ ...form, message: '' });
            refetch();
        } catch (err) {
            setStatusModal({
                show: true,
                success: false,
                message: 'No se pudo enviar el mensaje. Por favor intenta de nuevo.'
            });
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Modal de Estado */}
            <AnimatePresence>
                {statusModal.show && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-[#0f172a] rounded-[2.5rem] p-8 max-w-sm w-full text-center shadow-2xl border border-white/10"
                        >
                            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6 ${statusModal.success ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                                {statusModal.success ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">
                                {statusModal.success ? '¡Enviado!' : 'Error'}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-gray-400 mb-8 leading-relaxed">
                                {statusModal.message}
                            </p>
                            <button
                                onClick={() => setStatusModal({ ...statusModal, show: false })}
                                className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all active:scale-95"
                                style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)` }}
                            >
                                Entendido
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3.5 rounded-2xl text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)` }}>
                        <MessageSquare size={24} strokeWidth={2} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
                            Centro de Soporte
                        </h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">
                            Comunícate directamente con la administración central
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                {/* Formulario de Contacto (2/5) */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-black/5 dark:border-white/5 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                            <Send size={120} />
                        </div>

                        <div className="relative z-10 space-y-6">
                            <div className="space-y-1">
                                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Enviar Mensaje</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Resolveremos tu duda en breve</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Tus Datos (Auto-completado)</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="px-4 py-3 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-black/5 dark:border-white/5 flex items-center gap-3 opacity-60">
                                            <User size={14} className="text-slate-400" />
                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate">{user?.fullName?.split(' ')[0]}</span>
                                        </div>
                                        <div className="px-4 py-3 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-black/5 dark:border-white/5 flex items-center gap-3 opacity-60">
                                            <Mail size={14} className="text-slate-400" />
                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate">{user?.email}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Destinatario y Teléfono</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <select
                                            value={form.recipient}
                                            onChange={(e) => setForm({ ...form, recipient: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-black/5 dark:border-white/5 outline-none text-xs font-bold focus:ring-2 transition-all appearance-none cursor-pointer"
                                            style={{ focusRingColor: `${accent}40` }}
                                        >
                                            <option value="Administrador">Administrador</option>
                                            {user?.role?.toUpperCase() === 'COORDINATOR' && <option value="Gestor">Mi Gestor</option>}
                                            {user?.role?.toUpperCase() === 'MANAGER' && <option value="Mi Equipo">Admin (Mi Equipo)</option>}
                                        </select>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                            <input
                                                type="text"
                                                placeholder="Tu número"
                                                value={form.phone}
                                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-black/5 dark:border-white/5 outline-none text-xs font-bold focus:ring-2 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Mensaje o Consulta</label>
                                    <textarea
                                        rows="4"
                                        placeholder="Escribe aquí lo que necesitas decirle al administrador..."
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        className="w-full px-5 py-4 bg-slate-50 dark:bg-white/[0.03] rounded-2xl border border-black/5 dark:border-white/5 outline-none text-xs font-medium focus:ring-2 transition-all resize-none leading-relaxed"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all active:scale-95 shadow-xl disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-3 overflow-hidden group/btn"
                                    style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)`, boxShadow: `0 8px 32px ${accent}40` }}
                                >
                                    {isSubmitting ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <>
                                            <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            Enviar Consulta
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Bandeja de Respuestas (3/5) */}
                <div className="xl:col-span-3 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-black/5 dark:border-white/5 shadow-sm h-full flex flex-col min-h-[500px]">
                        <div className="flex items-center justify-between mb-8 shrink-0">
                            <div className="space-y-1">
                                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-3">
                                    <History size={18} className="text-gray-400" /> Tu Bandeja
                                </h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-7">Historial de consultas y respuestas</p>
                            </div>
                            <button onClick={() => refetch()} className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 text-gray-400 hover:text-white transition-colors">
                                <Clock size={16} className={isLoadingInbox ? 'animate-spin' : ''} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                            {isLoadingInbox ? (
                                [1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-50 dark:bg-white/5 animate-pulse rounded-2xl" />)
                            ) : myMessages.length > 0 ? (
                                myMessages.map((msg, i) => (
                                    <div
                                        key={msg._id}
                                        onClick={() => setActiveMessage(activeMessage?._id === msg._id ? null : msg)}
                                        className={`group relative p-5 rounded-3xl border transition-all cursor-pointer overflow-hidden ${activeMessage?._id === msg._id ? 'bg-slate-50 dark:bg-white/[0.04] border-black/10 dark:border-white/10' : 'bg-transparent border-black/5 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/[0.02]'}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-xl ${msg.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                                    {msg.status === 'PENDING' ? <Clock size={14} /> : <CheckCircle2 size={14} />}
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                    {new Date(msg.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${msg.status === 'PENDING' ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                                                {msg.status === 'PENDING' ? 'En espera' : 'Leído'}
                                            </span>
                                        </div>

                                        <p className={`text-xs font-bold text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed ${activeMessage?._id === msg._id ? 'line-clamp-none' : ''}`}>
                                            {msg.message}
                                        </p>

                                        {activeMessage?._id === msg._id && msg.status === 'READ' && (
                                            <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5 flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                                                    <Reply size={14} />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Nota del Equipo</p>
                                                    <p className="text-[11px] font-medium text-slate-500 leading-relaxed italic pr-4">
                                                        Tu mensaje ha sido revisado por el equipo administrativo. No se requiere acción adicional.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ChevronRight size={16} className="text-slate-300" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center h-full py-20 grayscale opacity-40">
                                    <Inbox size={48} className="text-gray-400 mb-4" />
                                    <p className="text-sm font-black uppercase tracking-widest">Sin actividad</p>
                                    <p className="text-[10px] font-medium mt-1">Tus consultas aparecerán aquí</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoordinatorContactView;
