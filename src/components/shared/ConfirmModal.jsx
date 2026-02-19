import React from 'react';
import { CheckCircle2, AlertCircle, X, HelpCircle, Info } from 'lucide-react';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Aceptar",
    cancelText = "Cancelar",
    variant = "info" // 'info', 'success', 'warning', 'danger'
}) => {
    if (!isOpen) return null;

    const variants = {
        info: {
            icon: <Info className="w-12 h-12 text-blue-500" />,
            accent: "bg-blue-500",
            light: "bg-blue-50",
            text: "text-blue-600"
        },
        success: {
            icon: <CheckCircle2 className="w-12 h-12 text-emerald-500" />,
            accent: "bg-[#018F64]",
            light: "bg-emerald-50",
            text: "text-emerald-600"
        },
        warning: {
            icon: <HelpCircle className="w-12 h-12 text-orange-500" />,
            accent: "bg-orange-500",
            light: "bg-orange-50",
            text: "text-orange-600"
        },
        danger: {
            icon: <AlertCircle className="w-12 h-12 text-red-500" />,
            accent: "bg-red-500",
            light: "bg-red-50",
            text: "text-red-600"
        }
    };

    const current = variants[variant] || variants.info;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-fade-in"
                onClick={onClose}
            />

            <div className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-2xl animate-zoom-in border border-gray-100 dark:border-white/5 text-center">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 transition-all"
                >
                    <X size={20} />
                </button>

                <div className="flex justify-center mb-6">
                    <div className={`p-4 rounded-3xl ${current.light} dark:bg-white/5`}>
                        {current.icon}
                    </div>
                </div>

                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic mb-2">
                    {title}
                </h3>

                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
                    {message}
                </p>

                <div className="space-y-3">
                    <button
                        onClick={() => {
                            onConfirm?.();
                            if (!onConfirm) onClose();
                        }}
                        className={`w-full py-4 ${current.accent} text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-95`}
                    >
                        {confirmText}
                    </button>

                    {onConfirm && (
                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                        >
                            {cancelText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
