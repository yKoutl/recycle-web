import React, { useState } from 'react';
import { Mail, User, Phone, Trash2, MessageSquare, Inbox, Search, Clock, Reply, Check, ChevronRight } from 'lucide-react';
import { useGetContactsQuery, useMarkAsReadMutation, useDeleteContactMutation } from '../../store/contact/contactApi';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '../../components/modals/ConfirmModal';

const ContactRequests = ({ themeColor }) => {
    const accent = themeColor || '#018F64';
    const { data: contacts = [], isLoading, refetch } = useGetContactsQuery(undefined, { pollingInterval: 15000 });
    const [markAsRead] = useMarkAsReadMutation();
    const [deleteContact] = useDeleteContactMutation();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeMessage, setActiveMessage] = useState(null);
    const [currentTab, setCurrentTab] = useState('ALL'); // ALL, PENDING, READ, TRASH
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });

    const filteredContacts = [...contacts]
        .filter(c => {
            if (currentTab === 'ALL') return c.status !== 'TRASH';
            if (currentTab === 'PENDING') return c.status === 'PENDING';
            if (currentTab === 'READ') return c.status === 'READ' || c.status === 'REPLIED';
            if (currentTab === 'TRASH') return c.status === 'TRASH';
            return true;
        })
        .filter(c =>
            c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.message.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort newest first

    const pendingCount = contacts.filter(c => c.status === 'PENDING').length;

    const handleDelete = (id, e) => {
        if (e) e.stopPropagation();
        const msg = currentTab === 'TRASH'
            ? '¿Estás seguro de eliminar PERMANENTEMENTE este contacto?'
            : '¿Mover mensaje a la papelera? (Se borrará en 10 días automáticamente)';

        setConfirmAction(() => async () => {
            await deleteContact(id);
            if (activeMessage?._id === id) setActiveMessage(null);
            refetch();
        });
        setIsConfirmOpen(true);
    };

    const handleRead = async (id, e) => {
        if (e) e.stopPropagation();
        await markAsRead(id);
        refetch(); // Refetch automatically to move between tabs if necessary
    };

    const handleReply = (email, name, e) => {
        if (e) e.stopPropagation();
        const subject = encodeURIComponent('Respuesta a tu consulta - Nos Planet');
        const body = encodeURIComponent(`Hola ${name},\n\nGracias por comunicarte con nosotros.\n\n`);
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`, '_blank');
    };

    const handleReplyWhatsApp = (phone, name, e) => {
        if (e) e.stopPropagation();

        const normalizedPhone = (phone || '').replace(/\D/g, '');
        if (!normalizedPhone) {
            setErrorModal({ isOpen: true, message: 'Este contacto no tiene número de teléfono válido.' });
            return;
        }

        const text = encodeURIComponent(`Hola ${name}, gracias por comunicarte con Nos Planet. Te respondemos por este medio.`);
        window.open(`https://wa.me/${normalizedPhone}?text=${text}`, '_blank');
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center p-32 space-y-4">
            <Clock className="animate-spin" size={40} style={{ color: accent }} />
            <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Cargando bandeja...</p>
        </div>
    );

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col animate-fade-in relative z-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-3.5 rounded-2xl text-white relative overflow-hidden group" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)` }}>
                        <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-150 transition-transform duration-500 rounded-full" />
                        <Inbox size={24} strokeWidth={2} className="relative z-10" />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                            Bandeja de Contactos
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                                Gestión de mensajes
                            </p>
                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                                {pendingCount} PENDIENTES
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-4 md:mb-0 w-full md:w-auto overflow-x-auto custom-scrollbar">
                    {['ALL', 'PENDING', 'READ', 'TRASH'].map(tab => {
                        const labels = { ALL: 'Todos', PENDING: 'Pendientes', READ: 'Leídos', TRASH: 'Papelera' };

                        const getActiveColor = () => {
                            if (currentTab !== tab) return 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300';
                            switch (tab) {
                                case 'ALL': return 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white';
                                case 'PENDING': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 shadow-sm';
                                case 'READ': return 'bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 shadow-sm';
                                case 'TRASH': return 'bg-red-50 text-red-600 dark:bg-red-500/20 dark:text-red-400 shadow-sm';
                                default: return 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white';
                            }
                        };

                        return (
                            <button
                                key={tab}
                                onClick={() => { setCurrentTab(tab); setActiveMessage(null); }}
                                className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${getActiveColor()}`}
                            >
                                {labels[tab]}
                            </button>
                        );
                    })}
                </div>

                <div className="relative w-full md:w-72 border border-gray-100 dark:border-white/5 rounded-2xl bg-white dark:bg-gray-900 shadow-sm shrink-0 transition-all" id="contact-search-container">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, email o mensaje..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-transparent pl-11 pr-4 py-3 outline-none text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400"
                        onFocus={() => {
                            const el = document.getElementById('contact-search-container');
                            if (el) { el.style.borderColor = `${accent}80`; el.style.boxShadow = `0 0 0 2px ${accent}20`; }
                        }}
                        onBlur={() => {
                            const el = document.getElementById('contact-search-container');
                            if (el) { el.style.borderColor = ''; el.style.boxShadow = ''; }
                        }}
                    />
                </div>
            </div>

            {/* Layout: Lista a la izquierda, Detalle (side panel temporal en móvil, inline en desktop) */}
            <div className="flex-1 bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-xl overflow-hidden flex relative">

                {/* Panel Izquierdo: Lista de Mensajes */}
                <div className={`w-full md:w-[400px] lg:w-[450px] flex-col shrink-0 border-r border-gray-100 dark:border-white/5 bg-white dark:bg-gray-900 ${activeMessage ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/10 shrink-0 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                            Recientes ({filteredContacts.length})
                        </span>
                        <button onClick={() => refetch()} className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-white/5 text-gray-400 transition-colors">
                            <Clock size={14} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ '--scrollbar-color': accent }}>
                        {filteredContacts.length > 0 ? (
                            <div className="divide-y divide-gray-50 dark:divide-white/[0.02]">
                                {filteredContacts.map((contact) => (
                                    <div
                                        key={contact._id}
                                        onClick={() => {
                                            setActiveMessage(contact);
                                        }}
                                        className={`p-5 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-white/[0.02] relative group ${activeMessage?._id === contact._id ? 'bg-emerald-50/50 dark:bg-white/[0.04]' : ''}`}
                                    >
                                        {/* Status Indicator Bar */}
                                        {contact.status === 'PENDING' && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-r-full" />
                                        )}

                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 border border-black/5 dark:border-white/5">
                                                    <User size={18} className={contact.status === 'PENDING' ? 'text-emerald-500' : 'text-gray-400'} />
                                                </div>
                                                <div className="min-w-0 flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className={`text-sm truncate pr-2 ${contact.status === 'PENDING' ? 'font-black text-gray-900 dark:text-white' : 'font-bold text-gray-600 dark:text-gray-300'}`}>
                                                            {contact.fullName}
                                                        </h4>
                                                        {contact.role && (
                                                            <span className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/5 text-[8px] font-black uppercase tracking-widest text-emerald-500">
                                                                {contact.role}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] font-bold text-gray-400 truncate">
                                                        {contact.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-[9px] font-bold text-gray-400 shrink-0 uppercase tracking-wider pt-1">
                                                {new Date(contact.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <p className={`text-xs pl-13 line-clamp-2 leading-relaxed ${contact.status === 'PENDING' ? 'text-gray-600 dark:text-gray-300 font-medium' : 'text-gray-400 font-normal'} pl-14`}>
                                            {contact.message}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-16 flex flex-col items-center justify-center text-center h-full">
                                <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-4 border border-black/5 dark:border-white/5">
                                    <Inbox size={28} className="text-gray-300 dark:text-gray-600" />
                                </div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">Bandeja Vacía</p>
                                <p className="text-xs text-gray-400 mt-1 max-w-[200px]">No tienes mensajes que coincidan con tu búsqueda.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Panel Derecho: Detalle del Mensaje */}
                <div className={`flex-1 bg-slate-50/30 dark:bg-[#0b1121] flex-col overflow-hidden relative ${!activeMessage ? 'hidden md:flex' : 'flex absolute inset-0 md:relative z-20'}`}>
                    {activeMessage ? (
                        <div className="h-full flex flex-col bg-white dark:bg-transparent absolute inset-0 z-10">
                            {/* Toolbar Detalle */}
                            <div className="h-16 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-gray-900 md:bg-transparent flex items-center justify-between px-6 shrink-0 relative z-20">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setActiveMessage(null)}
                                        className="md:hidden p-2 -ml-2 text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                    >
                                        <ChevronRight size={20} className="rotate-180" />
                                    </button>
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                                        Detalle del Mensaje
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => handleDelete(activeMessage._id, e)}
                                        className="p-2.5 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 transition-colors"
                                        title="Eliminar mensaje"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Action Footers */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-10" style={{ '--scrollbar-color': accent }}>
                                <div className="max-w-3xl mx-auto space-y-8">
                                    {/* Cabecera del Mensaje */}
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-8 border-b border-gray-100 dark:border-white/5">
                                        <div className="flex gap-5 items-center">
                                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-black shrink-0" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)` }}>
                                                {activeMessage.fullName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight">
                                                        {activeMessage.fullName}
                                                    </h3>
                                                    {activeMessage.role && (
                                                        <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/10 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500">
                                                            {activeMessage.role}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Mail size={12} className="text-gray-400" />
                                                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                                        {activeMessage.email}
                                                    </p>
                                                </div>
                                                {activeMessage.phone && (
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Phone size={12} className="text-gray-400" />
                                                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                                            {activeMessage.phone}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="sm:text-right shrink-0">
                                            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                                                {new Date(activeMessage.createdAt).toLocaleDateString()}
                                            </p>
                                            <p className="text-[10px] text-gray-500 font-medium mt-1">
                                                {new Date(activeMessage.createdAt).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Cuerpo del Mensaje */}
                                    <div className="bg-slate-50 dark:bg-white/[0.02] p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-inner relative">
                                        <div className="flex items-center gap-3 mb-6">
                                            <MessageSquare size={16} className="text-emerald-500" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Mensaje del Usuario</span>
                                        </div>
                                        <p className="text-[15px] leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-medium">
                                            "{activeMessage.message}"
                                        </p>
                                    </div>

                                    {/* Action Footers */}
                                    <div className="pt-4 flex flex-col sm:flex-row justify-between items-center border-t border-gray-100 dark:border-white/5">
                                        <div className="mb-4 sm:mb-0">
                                            {currentTab !== 'TRASH' && (
                                                <button
                                                    onClick={(e) => handleRead(activeMessage._id, e)}
                                                    className="px-6 py-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 text-[10px] font-black uppercase tracking-widest transition-all focus:outline-none"
                                                >
                                                    {activeMessage.status === 'PENDING' ? 'Marcar como Leído' : 'Marcar como Pendiente'}
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-center gap-3">
                                            <button
                                                onClick={(e) => handleReply(activeMessage.email, activeMessage.fullName, e)}
                                                className="px-6 py-4 rounded-2xl text-white text-[11px] font-black uppercase tracking-[0.2em] hover:-translate-y-1 transition-all flex items-center gap-3"
                                                style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)` }}
                                            >
                                                <Reply size={16} />
                                                Responder por Gmail
                                            </button>
                                            <button
                                                onClick={(e) => handleReplyWhatsApp(activeMessage.phone, activeMessage.fullName, e)}
                                                className="px-6 py-4 rounded-2xl text-white text-[11px] font-black uppercase tracking-[0.2em] hover:-translate-y-1 transition-all flex items-center gap-3 bg-[#25D366] hover:bg-[#20ba59]"
                                            >
                                                <Phone size={16} />
                                                Responder por WSP
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-center p-10 bg-slate-50/50 dark:bg-transparent absolute inset-0">
                            <div className="w-24 h-24 rounded-[2.5rem] bg-white dark:bg-gray-800 flex items-center justify-center mb-6 shadow-xl border border-gray-100 dark:border-white/5">
                                <Mail size={40} className="text-gray-300 dark:text-gray-600" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Selecciona un mensaje</h3>
                            <p className="text-sm font-medium text-gray-400 mt-2 max-w-[280px] leading-relaxed">
                                Haz clic en un contacto de la bandeja a la izquierda para leer su contenido completo.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmAction}
                title="¿Confirmar acción?"
                message={currentTab === 'TRASH' ? 'ELIMINACIÓN PERMANENTE' : 'MOVER A PAPELERA'}
                confirmText="ACEPTAR"
                type={currentTab === 'TRASH' ? 'danger' : 'warning'}
            />

            <ConfirmModal
                isOpen={errorModal.isOpen}
                onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
                onConfirm={() => setErrorModal({ ...errorModal, isOpen: false })}
                title="Información"
                message={errorModal.message}
                confirmText="ENTENDIDO"
                type="warning"
                cancelText=""
            />
        </div>
    );
};

export default ContactRequests;
