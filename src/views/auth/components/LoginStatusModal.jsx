import React from 'react';
import { Loader2, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

const LoginStatusModal = ({ loginStatus, statusMessage, selectedRole, setLoginStatus }) => {
    if (!loginStatus) return null;

    return (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-xl animate-in fade-in duration-500">
            <div className="w-full max-w-sm mx-4 bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-10 text-center shadow-2xl shadow-[#018F64]/10 animate-in zoom-in-90 slide-in-from-bottom-8 duration-500">
                <div className="flex flex-col items-center gap-8">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full border-2 border-white/5 flex items-center justify-center">
                            {loginStatus === 'loading' && (
                                <>
                                    <Loader2 className={`w-12 h-12 ${selectedRole === 'ecoheroe' ? 'text-emerald-500' : 'text-orange-500'} animate-spin`} strokeWidth={1} />
                                    <div className="absolute inset-0 w-24 h-24 rounded-full border-t-2 border-orange-500 animate-spin" style={{ animationDuration: '0.8s' }} />
                                </>
                            )}
                            {loginStatus === 'success' && (
                                <div className="animate-in zoom-in duration-700">
                                    <CheckCircle2 className="w-14 h-14 text-[#10b981]" strokeWidth={1} />
                                </div>
                            )}
                            {loginStatus === 'error' && (
                                <div className="animate-in zoom-in duration-700">
                                    <AlertCircle className="w-14 h-14 text-red-500" strokeWidth={1} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
                            {loginStatus === 'loading' ? 'Procesando' : loginStatus === 'success' ? 'Acceso Autorizado' : 'Error de Acceso'}
                        </h3>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed">
                            {statusMessage}
                        </p>
                    </div>

                    {loginStatus === 'error' && (
                        <button
                            onClick={() => setLoginStatus(null)}
                            className="group flex items-center gap-2 px-8 py-3 rounded-2xl bg-white/5 hover:bg-red-500/10 text-white hover:text-red-500 text-[11px] font-black uppercase tracking-widest transition-all duration-300"
                        >
                            <XCircle size={14} /> Intentar de nuevo
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginStatusModal;
