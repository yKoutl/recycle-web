import React from 'react';
import { createPortal } from 'react-dom';
import { TriangleAlert, X, Check, Trash2 } from 'lucide-react';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = '¿Estás seguro?',
    message = 'Esta acción no se puede deshacer.',
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    type = 'danger' // danger, warning, success
}) => {
    if (!isOpen) return null;

    const getTypeStyles = () => {
        switch (type) {
            case 'danger':
                return {
                    icon: <Trash2 size={24} className="text-red-500" />,
                    bg: 'bg-red-500/10',
                    border: 'border-red-500/20',
                    button: 'bg-red-600 hover:bg-red-500 shadow-red-600/20'
                };
            case 'warning':
                return {
                    icon: <TriangleAlert size={24} className="text-amber-500" />,
                    bg: 'bg-amber-500/10',
                    border: 'border-amber-500/20',
                    button: 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20'
                };
            default:
                return {
                    icon: <Check size={24} className="text-emerald-500" />,
                    bg: 'bg-emerald-500/10',
                    border: 'border-emerald-500/20',
                    button: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                };
        }
    };

    const styles = getTypeStyles();

    return createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative w-full max-w-[360px] bg-white/10 backdrop-blur-3xl rounded-[32px] border border-white/20 shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
                <div className="p-8 text-center space-y-6">
                    <div className={`w-16 h-16 ${styles.bg} ${styles.border} border rounded-2xl mx-auto flex items-center justify-center`}>
                        {styles.icon}
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
                        <p className="text-xs text-gray-400 leading-relaxed font-medium uppercase tracking-wider px-4">
                            {message}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                        <button
                            onClick={() => { onConfirm(); onClose(); }}
                            className={`w-full py-4 ${styles.button} text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl transition-all active:scale-[0.98]`}
                        >
                            {confirmText}
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all"
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmModal;
