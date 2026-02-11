import React, { useEffect } from 'react';
import { XCircle, CheckCircle2, Loader2, X } from 'lucide-react';

const StatusModal = ({ status, message, onClose }) => {
    if (!status) return null;

    useEffect(() => {
        if (status === 'success' || status === 'error') {
            const timer = setTimeout(() => {
                // Solo auto-cerrar si es éxito para permitir que App.jsx cambie de vista
                // O si es error y el usuario no lo cierra manualmente
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    const config = {
        loading: {
            icon: <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />,
            title: "Verificando...",
            bgColor: "bg-white dark:bg-gray-900"
        },
        success: {
            icon: <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-bounce" />,
            title: "¡Bienvenido!",
            bgColor: "bg-white dark:bg-gray-900"
        },
        error: {
            icon: <XCircle className="w-12 h-12 text-red-500" />,
            title: "Acceso Denegado",
            bgColor: "bg-white dark:bg-gray-900"
        }
    };

    const current = config[status];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={status === 'error' ? onClose : undefined} />

            <div className={`relative w-full max-w-sm ${current.bgColor} rounded-[2.5rem] p-8 shadow-2xl border border-white/10 animate-in zoom-in duration-300 text-center space-y-4`}>
                {status === 'error' && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                        <X size={20} className="text-gray-400" />
                    </button>
                )}

                <div className="flex justify-center mb-2">
                    {current.icon}
                </div>

                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">
                    {current.title}
                </h3>

                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
                    {message}
                </p>

                {status === 'error' && (
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95 mt-4"
                    >
                        Reintentar
                    </button>
                )}
            </div>
        </div>
    );
};

export default StatusModal;
