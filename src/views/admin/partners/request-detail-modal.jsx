import React from 'react';
import { X, Building2, User, Mail, Phone, Globe, MessageSquare, Clock, Calendar, CheckCircle, XCircle } from 'lucide-react';
import Button from '../../../components/shared/Button';

const RequestDetailModal = ({ isOpen, onClose, request, onAction }) => {
    if (!isOpen || !request) return null;

    const handleAction = (action) => {
        onAction(request._id, action);
        onClose();
    };

    const getStatusParams = (status) => {
        switch (status) {
            case 'APPROVED': return { label: 'APROBADO', color: 'text-green-600 bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800', icon: CheckCircle };
            case 'REJECTED': return { label: 'RECHAZADO', color: 'text-red-600 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800', icon: XCircle };
            case 'CONTACTED': return { label: 'CONTACTADO', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800', icon: Phone };
            default: return { label: 'PENDIENTE', color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800', icon: Clock };
        }
    };

    const statusParams = getStatusParams(request.status);

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Side Panel */}
            <div className="relative z-10 w-full max-w-md bg-white dark:bg-gray-950 h-full shadow-2xl animate-slide-in-right flex flex-col border-l border-gray-100 dark:border-white/5">

                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-white/50 dark:bg-black/50 backdrop-blur-md sticky top-0 z-20">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                            Detalles de Solicitud
                        </h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                            ID: {request._id.slice(-8)}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all hover:rotate-90"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">

                    {/* Status Badge */}
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${statusParams.color}`}>
                        <statusParams.icon size={14} />
                        {statusParams.label}
                    </div>

                    {/* Company Info */}
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#018F64]/10 text-[#018F64] flex items-center justify-center shrink-0">
                                <Building2 size={24} />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Empresa / Razón Social</label>
                                <p className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{request.name}</p>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center gap-4">
                                <Mail size={18} className="text-gray-400" />
                                <div className="overflow-hidden">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Correo Electrónico</label>
                                    <a href={`mailto:${request.email}`} className="text-sm font-bold text-gray-900 dark:text-white hover:text-[#018F64] truncate block">
                                        {request.email}
                                    </a>
                                </div>
                            </div>

                            {request.phone && (
                                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center gap-4">
                                    <Phone size={18} className="text-gray-400" />
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Teléfono / WhatsApp</label>
                                        <a href={`https://wa.me/${request.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-sm font-bold text-gray-900 dark:text-white hover:text-[#018F64]">
                                            {request.phone}
                                        </a>
                                    </div>
                                </div>
                            )}

                            {request.website && (
                                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center gap-4">
                                    <Globe size={18} className="text-gray-400" />
                                    <div className="overflow-hidden">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Sitio Web</label>
                                        <a href={request.website.startsWith('http') ? request.website : `https://${request.website}`} target="_blank" rel="noreferrer" className="text-sm font-bold text-gray-900 dark:text-white hover:text-[#018F64] truncate block">
                                            {request.website}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-[#018F64] uppercase tracking-widest flex items-center gap-2">
                            <MessageSquare size={14} /> Mensaje del Solicitante
                        </label>
                        <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/5">
                            <p className="text-gray-600 dark:text-gray-300 text-sm font-medium italic leading-relaxed">
                                "{request.message}"
                            </p>
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex gap-6 pt-4 border-t border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-wider">
                            <Calendar size={14} />
                            {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-wider">
                            <Clock size={14} />
                            {new Date(request.createdAt).toLocaleTimeString()}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-8 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-gray-950 sticky bottom-0 z-20 space-y-3">
                    {request.status !== 'APPROVED' && (
                        <Button
                            onClick={() => handleAction('APPROVED')}
                            className="w-full h-14 bg-[#018F64] text-white rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] shadow-xl shadow-[#018F64]/20"
                            icon={CheckCircle}
                        >
                            Aprobar Solicitud
                        </Button>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        {request.status !== 'PENDING' && (
                            <button
                                onClick={() => handleAction('PENDING')}
                                className="h-12 border border-gray-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                            >
                                {request.status === 'APPROVED' ? 'Deshacer Aprobación' : 'Volver a Pendiente'}
                            </button>
                        )}

                        {request.status === 'PENDING' && (
                            <button
                                onClick={() => handleAction('CONTACTED')}
                                className="h-12 border border-blue-200 dark:border-blue-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all"
                            >
                                Marcar Contactado
                            </button>
                        )}

                        {request.status !== 'REJECTED' && (
                            <button
                                onClick={() => handleAction('REJECTED')}
                                className="h-12 border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all"
                            >
                                Rechazar
                            </button>
                        )}

                        {request.status === 'REJECTED' && (
                            <button
                                onClick={() => handleAction('CONTACTED')}
                                className="h-12 border border-blue-200 dark:border-blue-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all"
                            >
                                Marcar Contactado
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestDetailModal;
