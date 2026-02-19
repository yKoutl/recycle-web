
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetPartnerRequestsQuery, useUpdatePartnerRequestStatusMutation, useDeletePartnerRequestMutation } from '../../../store/partners/partnerRequestsApi';
import { partnersApi } from '../../../store/partners/partnersApi';
import { CheckCircle, XCircle, Trash2, Mail, Phone, Globe, MessageSquare, Clock, Building2, MessageCircle, Eye, RefreshCw } from 'lucide-react';
import RequestDetailModal from './request-detail-modal';
import ConfirmModal from '../../../components/shared/ConfirmModal';

const PartnerRequestsTable = () => {
    const navigate = useNavigate();
    const { data: requests = [], isLoading, refetch } = useGetPartnerRequestsQuery();
    const [updateStatus] = useUpdatePartnerRequestStatusMutation();
    const [deleteRequest] = useDeletePartnerRequestMutation();
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isRefetching, setIsRefetching] = useState(false);

    const handleRefresh = async () => {
        setIsRefetching(true);
        await refetch();
        setTimeout(() => setIsRefetching(false), 1000);
    };

    const dispatch = useDispatch();
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', variant: 'info', onConfirm: null, confirmText: 'Aceptar', cancelText: 'Cancelar' });

    const handleAction = async (id, action) => {
        try {
            if (action === 'delete') {
                setModalConfig({
                    isOpen: true,
                    title: '¿Eliminar Solicitud?',
                    message: 'Esta acción no se puede deshacer. La solicitud será eliminada permanentemente del sistema.',
                    variant: 'danger',
                    confirmText: 'Sí, Eliminar',
                    onConfirm: async () => {
                        await deleteRequest(id).unwrap();
                        setModalConfig(prev => ({ ...prev, isOpen: false }));
                        // Feedback de éxito
                        setTimeout(() => {
                            setModalConfig({
                                isOpen: true,
                                title: 'Eliminado',
                                message: 'La solicitud ha sido eliminada correctamente.',
                                variant: 'success',
                                confirmText: 'Entendido',
                                onConfirm: null
                            });
                        }, 500);
                    }
                });
            } else {
                const result = await updateStatus({ id, status: action }).unwrap();

                if (action === 'APPROVED') {
                    dispatch(partnersApi.util.invalidateTags(['Partners']));
                    setModalConfig({
                        isOpen: true,
                        title: '¡Solicitud Aprobada!',
                        message: `La alianza con "${result.name}" ha sido aprobada. El socio se ha creado en la lista (desbloquéalo editando sus datos). ¿Quieres ir a verlo ahora?`,
                        variant: 'success',
                        confirmText: 'Ir a Socios',
                        cancelText: 'Seguir Aquí',
                        onConfirm: () => {
                            setModalConfig(prev => ({ ...prev, isOpen: false }));
                            navigate('/admin/partners/list');
                        }
                    });
                } else {
                    const labels = { 'PENDING': 'Pendiente', 'CONTACTED': 'Contactado', 'REJECTED': 'Rechazado' };
                    setModalConfig({
                        isOpen: true,
                        title: 'Estado Actualizado',
                        message: `La solicitud ahora está marcada como: ${labels[action] || action}.`,
                        variant: 'info',
                        confirmText: 'Aceptar',
                        onConfirm: null
                    });
                }
            }
        } catch (error) {
            console.error("Error updating request:", error);
            setModalConfig({
                isOpen: true,
                title: 'Error de Servidor',
                message: 'No se pudo procesar la solicitud. Por favor intenta de nuevo en unos momentos.',
                variant: 'danger',
                confirmText: 'Cerrar',
                onConfirm: null
            });
        }
    };

    if (isLoading) return <div className="p-10 text-center animate-pulse text-gray-400 font-black uppercase tracking-widest">Cargando solicitudes...</div>;

    const getStatusParams = (status) => {
        switch (status) {
            case 'APPROVED': return { label: 'APROBADO', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800', icon: CheckCircle };
            case 'REJECTED': return { label: 'RECHAZADO', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', icon: XCircle };
            case 'CONTACTED': return { label: 'CONTACTADO', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', icon: Phone };
            default: return { label: 'PENDIENTE', color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800', icon: Clock };
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic mb-2">
                        Solicitudes de <span className="text-[#018F64]">Alianza</span>
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                        Gestiona las empresas que quieren unirse a NosPlanet.
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    className={`p-3 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-500 hover:text-[#018F64] shadow-sm hover:shadow-md transition-all ${isRefetching ? 'animate-spin' : ''}`}
                    title="Actualizar lista"
                >
                    <RefreshCw size={20} />
                </button>
            </div>

            {requests.length === 0 ? (
                <div className="py-20 text-center bg-white dark:bg-gray-900/40 rounded-[2.5rem] border border-gray-100 dark:border-white/5">
                    <div className="inline-flex p-6 rounded-3xl bg-gray-50 dark:bg-white/5 text-gray-300 mb-4">
                        <Mail size={48} />
                    </div>
                    <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No hay solicitudes pendientes</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map((req) => {
                        const status = getStatusParams(req.status);
                        return (
                            <div key={req._id} className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                                <div className="flex flex-col md:flex-row gap-6 items-start">

                                    {/* Info Principal */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 font-bold uppercase text-xl shrink-0">
                                                    {req.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight truncate leading-none mb-1">
                                                        {req.name}
                                                    </h3>
                                                    <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                        <span className="flex items-center gap-1"><Clock size={10} /> {new Date(req.createdAt).toLocaleDateString()}</span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1">{new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status Badge Mobile - Hidden on Desktop */}
                                            <div className={`md:hidden px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${status.bg} ${status.color} ${status.border}`}>
                                                {status.label}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                            <a href={`mailto:${req.email}`} className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-white/5 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-[#018F64] transition-colors truncate">
                                                <Mail size={14} className="shrink-0" /> <span className="truncate">{req.email}</span>
                                            </a>
                                            {req.phone && (
                                                <div className="flex items-center gap-2">
                                                    <span className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-white/5 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 truncate">
                                                        <Phone size={14} className="shrink-0" /> {req.phone}
                                                    </span>
                                                    <a
                                                        href={`https://wa.me/${req.phone.replace(/\D/g, '')}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="p-2 bg-green-500/10 text-green-600 rounded-xl hover:bg-green-500 hover:text-white transition-all shrink-0"
                                                        title="Contactar por WhatsApp"
                                                    >
                                                        <MessageCircle size={16} />
                                                    </a>
                                                </div>
                                            )}
                                            {req.website && (
                                                <a href={req.website.startsWith('http') ? req.website : `https://${req.website}`} target="_blank" rel="noreferrer" className="sm:col-span-2 flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-white/5 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-[#018F64] transition-colors truncate">
                                                    <Globe size={14} className="shrink-0" /> <span className="truncate">{req.website}</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Preview Message & Layout separator */}
                                    <div className="hidden md:block w-px bg-gray-100 dark:bg-white/5 self-stretch mx-2"></div>

                                    <div className="flex-1 w-full md:w-auto self-stretch flex flex-col justify-between">
                                        <div className="bg-gray-50/50 dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/5 h-full">
                                            <div className="flex items-center gap-2 mb-2 text-[#018F64] text-[9px] font-black uppercase tracking-widest">
                                                <MessageSquare size={10} /> Mensaje
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-300 text-xs font-medium italic leading-relaxed line-clamp-3">
                                                "{req.message}"
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions & Status Column */}
                                    <div className="flex md:flex-col items-center justify-between md:justify-center gap-4 w-full md:w-auto md:min-w-[100px] md:pl-6 md:border-l md:border-gray-100 md:dark:border-white/5 self-stretch">

                                        {/* Status Badge Desktop */}
                                        <div className={`hidden md:flex mb-auto px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border w-full justify-center ${status.bg} ${status.color} ${status.border}`}>
                                            {status.label}
                                        </div>

                                        <div className="flex items-center gap-1 md:mt-auto w-full justify-end md:justify-center">
                                            {/* Quick Actions */}
                                            {req.status === 'PENDING' && (
                                                <button
                                                    onClick={() => handleAction(req._id, 'APPROVED')}
                                                    className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/10 rounded-lg transition-all"
                                                    title="Aprobar Rápido"
                                                >
                                                    <CheckCircle size={16} />
                                                </button>
                                            )}
                                            {(req.status === 'PENDING' || req.status === 'REJECTED') && (
                                                <button
                                                    onClick={() => handleAction(req._id, 'CONTACTED')}
                                                    className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-lg transition-all"
                                                    title="Marcar Contactado"
                                                >
                                                    <Phone size={16} />
                                                </button>
                                            )}
                                            {req.status !== 'REJECTED' && (
                                                <button
                                                    onClick={() => handleAction(req._id, 'REJECTED')}
                                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all"
                                                    title="Rechazar"
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                            )}

                                            <div className="w-px h-4 bg-gray-100 dark:bg-white/5 mx-1 hidden md:block"></div>

                                            <button
                                                onClick={() => handleAction(req._id, 'delete')}
                                                className="p-2 text-gray-300 hover:text-gray-600 dark:hover:text-gray-400 rounded-lg transition-all"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => setSelectedRequest(req)}
                                                className="p-2 bg-[#018F64] text-white rounded-lg shadow-lg shadow-[#018F64]/20 hover:scale-110 transition-all ml-1"
                                                title="Ver Detalles"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal de Detalle */}
            {selectedRequest && (
                <RequestDetailModal
                    isOpen={!!selectedRequest}
                    onClose={() => setSelectedRequest(null)}
                    request={selectedRequest}
                    onAction={handleAction}
                />
            )}

            {/* Modal de Confirmación / Alerta Premium */}
            <ConfirmModal
                {...modalConfig}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
};

export default PartnerRequestsTable;
