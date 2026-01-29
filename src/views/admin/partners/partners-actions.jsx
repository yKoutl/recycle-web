import React, { useState } from 'react';
import { useGetPartnersQuery, useDeletePartnerMutation } from '../../../store/partners'; // Ajusta la ruta si es necesario
import { Plus, Edit2, Trash2, UserRoundCheck, Info } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { onSetActivePartner } from '../../../store/partners';
import PartnerFormModal from './partner-modal';

const PartnersView = () => {
    const dispatch = useDispatch();

    const [isModalOpen, setIsModalOpen] = useState(false);
    // 1. Obtener la lista automáticamente
    const { data: partners = [], isLoading } = useGetPartnersQuery();

    // 2. Hook para borrar
    const [deletePartner] = useDeletePartnerMutation();

    const handleEdit = (partner) => {
        dispatch(onSetActivePartner(partner));
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este socio?")) {
            await deletePartner(id);
        }
    };

    const handleCreate = () => {
        dispatch(onSetActivePartner(null));
        setIsModalOpen(true); // <--- AQUÍ TAMBIÉN (cambiamos a setIsModalOpen)
    };

    if (isLoading) return <div className="p-10 text-center text-gray-500">Cargando socios...</div>;

    return (
        <div className="relative min-h-[50vh]">
            {/* GRID DE TARJETAS */}
            {/* Agregamos pb-24 para dejar espacio al botón flotante */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
                {partners?.map((partner) => (
                    <div
                        key={partner._id}
                        className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 dark:hover:shadow-green-700 hover:shadow-md transition-all group relative"
                    >
                        {/* --- BOTONES DE ACCIÓN (Aparecen al Hover) --- */}
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                                onClick={() => handleEdit(partner)}
                                className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 transition-colors"
                                title="Editar"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={() => handleDelete(partner._id)}
                                className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 transition-colors"
                                title="Eliminar"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        {/* --- CONTENIDO DE LA TARJETA --- */}
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white pr-16 truncate">
                            {partner.name}
                        </h3>

                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 line-clamp-2 h-10">
                            {partner.description}
                        </p>

                        <div className="mt-6 flex justify-between items-center border-t border-gray-50 dark:border-gray-800 pt-4">
                            <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 font-semibold bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg text-xs">
                                <UserRoundCheck size={16} className='text-red-400' />
                                {partner.typeLabel}
                            </span>
                            <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 font-semibold bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg text-xs">
                                <Info size={16} className='text-blue-400' />
                                {partner.filterType}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- BOTÓN FLOTANTE (FAB) --- */}
            <button
                onClick={handleCreate} // Esto ahora llama a setIsModalOpen(true)
                className="fixed bottom-10 right-10 bg-green-600 text-white p-4 rounded-full shadow-xl shadow-green-600/30 hover:bg-green-700 hover:scale-110 active:scale-95 transition-all z-40 group flex items-center justify-center"
            >
                <Plus size={28} strokeWidth={3} />
            </button>

            {/* 6. RENDERIZA EL MODAL AQUÍ */}
            <PartnerFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default PartnersView;