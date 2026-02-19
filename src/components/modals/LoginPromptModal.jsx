import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, X, Heart, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPromptModal = ({ isOpen, onClose, t }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                {/* Overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-gray-950/40 backdrop-blur-md"
                />

                {/* Modal Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
                >
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="p-8 relative z-10 flex flex-col items-center text-center">
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* Icon */}
                        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-rose-100 dark:border-rose-900/30">
                            <div className="relative">
                                <Heart size={32} className="text-rose-500 fill-rose-500/10" />
                                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full p-0.5 border border-rose-200 dark:border-rose-800">
                                    <ShieldAlert size={14} className="text-rose-600" />
                                </div>
                            </div>
                        </div>

                        {/* Text */}
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic mb-3">
                            {t?.auth?.needLogin || '¡Casi lo logras!'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 font-bold leading-relaxed mb-8 px-4 italic">
                            {t?.auth?.loginToLike || 'Para dar amor a esta historia, primero debes ser parte de nuestra comunidad.'}
                        </p>

                        {/* Action Buttons */}
                        <div className="w-full space-y-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/auth/login')}
                                className="w-full py-4 bg-[#018F64] text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-emerald-900/20 transition-all hover:bg-[#05835D]"
                            >
                                <LogIn size={18} />
                                {t?.nav?.login || 'Iniciar Sesión'}
                            </motion.button>

                            <button
                                onClick={onClose}
                                className="w-full py-4 bg-gray-50 dark:bg-gray-800/50 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-colors"
                            >
                                {t?.common?.maybeLater || 'Quizás más tarde'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default LoginPromptModal;
