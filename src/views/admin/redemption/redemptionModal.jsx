import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Gift, Calendar, Info, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

const RedemptionSidebar = ({ isOpen, onClose, data, onConfirm, isConfirming }) => {
    if (!data) return null;

    useEffect(() => {
        console.log(data)
    }, []);


    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop: Fondo desenfocado */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[998]"
                    />

                    {/* Panel Deslizante */}
                    <motion.div
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-lg bg-white dark:bg-gray-900 shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.3)] z-[999] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-500">Verificación de Canje</h2>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 italic">Operación de entrega física</p>
                            </div>
                            <button onClick={onClose} className="p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all">
                                <X size={24} className="text-gray-400" />
                            </button>
                        </div>

                        {/* Contenido con Scroll */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">

                            {/* Datos del Ciudadano */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-gray-300 tracking-[0.2em] flex items-center gap-2">
                                    <User size={14} /> Identidad del Ciudadano
                                </label>
                                <div className="flex items-center gap-4 p-5 rounded-[2rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
                                    <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-500/20">
                                        {data.userId?.fullName[0]}
                                    </div>
                                    <div>
                                        <p className="text-lg font-black text-gray-900 dark:text-white uppercase leading-none mb-1">{data.userId?.fullName}</p>
                                        <p className="text-xs text-gray-400 font-medium">{data.userId?.email}</p>
                                        <p className="text-[10px] text-emerald-500 font-bold mt-1 uppercase tracking-widest">Puntos actuales: {data.userId?.profile?.current_points}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Detalles del Premio */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-gray-300 tracking-[0.2em] flex items-center gap-2">
                                    <Gift size={14} /> Producto a Entregar
                                </label>
                                <div className="rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]">
                                    <img src={data.rewardId?.imageUrl} className="w-full h-52 object-cover" alt="Reward" />
                                    <div className="p-6">
                                        <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase leading-tight mb-2">{data.rewardId?.title}</h4>
                                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1.5 rounded-full w-fit">
                                            <ShieldCheck size={14} /> {data.rewardId?.sponsor}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Info de Trazabilidad */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 rounded-3xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
                                    <Calendar size={18} className="text-gray-400 mb-2" />
                                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Generado el</p>
                                    <p className="text-xs font-black text-gray-800 dark:text-gray-200">{new Date(data.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="p-5 rounded-3xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
                                    <Info size={18} className="text-gray-400 mb-2" />
                                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Código de App</p>
                                    <p className="text-xs font-black text-emerald-500 uppercase tracking-tighter">{data.redemptionCode}</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer: Confirmación */}
                        <div className="p-8 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] backdrop-blur-sm">
                            <div className="flex flex-col gap-4">
                                {/* Texto informativo/seguridad */}
                                <div className="flex items-start gap-3 px-2 mb-2">
                                    <div className="mt-1 p-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-500">
                                        <Info size={12} />
                                    </div>
                                    <p className="text-[10px] leading-relaxed text-gray-500 font-medium">
                                        Asegúrese de que el ciudadano ha recibido el producto físico antes de confirmar.
                                        <span className="block font-bold text-gray-700 dark:text-gray-300">Esta acción descontará los puntos permanentemente.</span>
                                    </p>
                                </div>

                                {/* Botón Principal */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isConfirming}
                                    onClick={onConfirm}
                                    className={`
                            relative w-full py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.25em] 
                            transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden
                            ${isConfirming
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_20px_40px_-12px_rgba(5,150,105,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(5,150,105,0.5)]'
                                        }
                        `}
                                >
                                    {isConfirming ? (
                                        <div className="flex items-center gap-3">
                                            <Loader2 className="animate-spin" size={18} />
                                            <span>Procesando...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <CheckCircle2 size={18} className="drop-shadow-md" />
                                            <span>Confirmar Entrega Física</span>
                                            {/* Brillo sutil de fondo */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:animate-[shimmer_2s_infinite]" />
                                        </>
                                    )}
                                </motion.button>

                                {/* Botón secundario para cancelar/cerrar */}
                                <button
                                    onClick={onClose}
                                    className="w-full py-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                >
                                    Cancelar operación
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default RedemptionSidebar;