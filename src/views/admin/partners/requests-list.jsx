
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetPartnerRequestsQuery, useUpdatePartnerRequestStatusMutation, useDeletePartnerRequestMutation } from '../../../store/partners/partnerRequestsApi';
import { partnersApi } from '../../../store/partners/partnersApi';
import { CheckCircle, XCircle, Trash2, Mail, Phone, Globe, MessageSquare, Clock, Building2, MessageCircle, Eye, RotateCw } from 'lucide-react';
import RequestDetailModal from './request-detail-modal';
import ConfirmModal from '../../../components/shared/ConfirmModal';

const PartnerRequestsTable = ({ themeColor }) => {
    const navigate = useNavigate();
    const { data: requests = [], isLoading, refetch } = useGetPartnerRequestsQuery();
    const [updateStatus] = useUpdatePartnerRequestStatusMutation();
    const [deleteRequest] = useDeletePartnerRequestMutation();
    const [selectedRequest, setSelectedRequest] = useState(null);
    const accent = themeColor || '#018F64';

    const handleRefresh = async () => {
        await refetch();
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

    if (isLoading) return <div className="p-10 text-center animate-pulse text-gray-400">Cargando solicitudes...</div>;

    const getStatusParams = (status) => {
        switch (status) {
            case 'APPROVED': return { label: 'Aprobado', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-100 dark:border-emerald-800', icon: CheckCircle };
            case 'REJECTED': return { label: 'Rechazado', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-100 dark:border-red-800', icon: XCircle };
            case 'CONTACTED': return { label: 'Contactado', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-100 dark:border-blue-800', icon: Phone };
            default: return { label: 'Pendiente', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-100 dark:border-amber-800', icon: Clock };
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)` }}>
                        <Building2 size={22} strokeWidth={1.75} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                            Solicitudes de Alianza
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            Revisa y gestiona las empresas que desean ser socios estratégicos.
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleRefresh}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-xl text-gray-500 hover:text-gray-800 dark:hover:text-white transition-all group"
                >
                    <RotateCw size={15} strokeWidth={1.75} className={isLoading ? 'animate-spin' : ''} />
                    <span className="text-xs font-bold uppercase">Actualizar</span>
                </button>
            </div>

            {/* ── Stats Row ── */}
            <div className="flex items-center justify-end gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 dark:bg-blue-500/10 text-blue-600 border border-black/5 dark:border-white/5">
                    <Building2 size={11} strokeWidth={2.5} />
                    {requests.length} SOLICITUDES
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-orange-50 dark:bg-orange-500/10 text-orange-600 border border-black/5 dark:border-white/5">
                    <Clock size={11} strokeWidth={2.5} />
                    {requests.filter(r => r.status === 'PENDING').length} PENDIENTES
                </span>
            </div>

            {requests.length === 0 ? (
                <div className="py-20 text-center bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
                    <div className="inline-flex p-6 rounded-3xl bg-gray-50 dark:bg-white/5 text-gray-300 mb-4">
                        <Mail size={48} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sin solicitudes</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">No hay nuevas solicitudes de alianza por el momento.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map((req) => {
                        const status = getStatusParams(req.status);
                        return (
                            <div key={req._id} className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-white/5 hover:shadow-sm transition-all group">
                                <div className="flex flex-col md:flex-row gap-5 items-start">

                                    {/* Info Principal */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 font-semibold text-base shrink-0">
                                                    {req.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate leading-none mb-0.5">
                                                        {req.name}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                                        <Clock size={11} strokeWidth={1.75} /> {new Date(req.createdAt).toLocaleDateString()} · {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status Badge Mobile */}
                                            <div className={`md:hidden px-2.5 py-1 rounded-lg text-xs font-semibold border ${status.bg} ${status.color} ${status.border}`}>
                                                {status.label.toUpperCase()}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                                            <a
                                                href={`mailto:${req.email}`}
                                                className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-white/5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 transition-colors truncate"
                                                onMouseEnter={(e) => e.currentTarget.style.color = accent}
                                                onMouseLeave={(e) => e.currentTarget.style.color = ''}
                                            >
                                                <Mail size={13} strokeWidth={1.75} className="shrink-0" /> <span className="truncate">{req.email}</span>
                                            </a>
                                            {req.phone && (
                                                <div className="flex items-center gap-2">
                                                    <span className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-white/5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 truncate">
                                                        <Phone size={13} strokeWidth={1.75} className="shrink-0" /> {req.phone}
                                                    </span>
                                                    <a
                                                        href={`https://wa.me/${req.phone.replace(/\D/g, '')}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="p-2 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 rounded-lg transition-all shrink-0"
                                                        title="Contactar por WhatsApp"
                                                    >
                                                        <MessageCircle size={14} strokeWidth={1.75} />
                                                    </a>
                                                </div>
                                            )}
                                            {req.website && (
                                                <a
                                                    href={req.website.startsWith('http') ? req.website : `https://${req.website}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="sm:col-span-2 flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-white/5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 transition-colors truncate"
                                                    onMouseEnter={(e) => e.currentTarget.style.color = accent}
                                                    onMouseLeave={(e) => e.currentTarget.style.color = ''}
                                                >
                                                    <Globe size={13} strokeWidth={1.75} className="shrink-0" /> <span className="truncate">{req.website}</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Preview Message & Layout separator */}
                                    <div className="hidden md:block w-px bg-gray-100 dark:bg-white/5 self-stretch mx-2"></div>

                                    <div className="flex-1 w-full md:w-auto self-stretch flex flex-col justify-between">
                                        <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-3.5 border border-gray-100 dark:border-white/5 h-full">
                                            <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-medium" style={{ color: accent }}>
                                                <MessageSquare size={11} strokeWidth={1.75} /> Mensaje
                                            </div>
                                            <p className="text-gray-500 dark:text-gray-400 text-xs italic leading-relaxed line-clamp-3">
                                                "{req.message}"
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions & Status Column */}
                                    <div className="flex md:flex-col items-center justify-between md:justify-center gap-3 w-full md:w-auto md:min-w-[90px] md:pl-5 md:border-l md:border-gray-100 md:dark:border-white/5 self-stretch">

                                        {/* Status Badge Desktop */}
                                        <div className={`hidden md:flex mb-auto px-2.5 py-1 rounded-lg text-xs font-semibold border w-full justify-center ${status.bg} ${status.color} ${status.border}`}>
                                            {status.label.toUpperCase()}
                                        </div>

                                        <div className="flex items-center gap-1 md:mt-auto w-full justify-end md:justify-center">
                                            {req.status === 'PENDING' && (
                                                <button
                                                    onClick={() => handleAction(req._id, 'APPROVED')}
                                                    className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 rounded-lg transition-all"
                                                    title="Aprobar"
                                                >
                                                    <CheckCircle size={15} strokeWidth={1.75} />
                                                </button>
                                            )}
                                            {(req.status === 'PENDING' || req.status === 'REJECTED') && (
                                                <button
                                                    onClick={() => handleAction(req._id, 'CONTACTED')}
                                                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-lg transition-all"
                                                    title="Marcar Contactado"
                                                >
                                                    <Phone size={15} strokeWidth={1.75} />
                                                </button>
                                            )}
                                            {req.status !== 'REJECTED' && (
                                                <button
                                                    onClick={() => handleAction(req._id, 'REJECTED')}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all"
                                                    title="Rechazar"
                                                >
                                                    <XCircle size={15} strokeWidth={1.75} />
                                                </button>
                                            )}

                                            <div className="w-px h-4 bg-gray-100 dark:bg-white/5 mx-1 hidden md:block" />

                                            <button
                                                onClick={() => handleAction(req._id, 'delete')}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={15} strokeWidth={1.75} />
                                            </button>
                                            <button
                                                onClick={() => setSelectedRequest(req)}
                                                className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all"
                                                title="Ver Detalles"
                                            >
                                                <Eye size={15} strokeWidth={1.75} />
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
                    themeColor={accent}
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
