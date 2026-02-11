import React from 'react';
import { useDispatch } from 'react-redux';
import { Plus, Edit2, Trash2, Tag, Box, Layers } from 'lucide-react'; // Iconos temáticos

// Asegúrate de que las rutas coincidan con tu estructura (api vs slice)
import { useGetRewardsQuery, useDeleteRewardMutation } from '../../../store/rewards';
import { onSetActiveReward } from '../../../store/rewards';

const RewardsList = ({ onOpenModal }) => {
    const dispatch = useDispatch();

    // 1. Obtener datos (Si quieres filtrar solo partners, usa useGetRewardsQuery('partners'))
    const { data: rewards = [], isLoading } = useGetRewardsQuery();

    // 2. Hook para borrar
    const [deleteReward] = useDeleteRewardMutation();

    // Acción para CREAR
    const handleCreate = () => {
        dispatch(onSetActiveReward(null));
        if (onOpenModal) onOpenModal();
    };

    // Acción para EDITAR
    const handleEdit = (reward) => {
        dispatch(onSetActiveReward(reward));
        if (onOpenModal) onOpenModal();
    };

    // Acción para BORRAR
    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este premio?")) {
            await deleteReward(id);
        }
    };

    if (isLoading) return <div className="p-10 text-center text-gray-500">Cargando premios...</div>;

    return (
        <div className="relative min-h-[50vh]">

            {/* GRID DE TARJETAS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
                {rewards?.map((reward) => (
                    <div
                        key={reward._id}
                        className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md dark:hover:shadow-green-700 transition-all group relative"
                    >

                        {/* --- BOTONES DE ACCIÓN (Hover) --- */}
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                                onClick={() => handleEdit(reward)}
                                className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 transition-colors"
                                title="Editar"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={() => handleDelete(reward._id)}
                                className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 transition-colors"
                                title="Eliminar"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        {/* --- CONTENIDO --- */}
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white pr-16 truncate">
                            {reward.title}
                        </h3>

                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 line-clamp-2 h-10">
                            {reward.description}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-2 items-center border-t border-gray-50 dark:border-gray-800 pt-4">

                            <span className="flex items-center gap-1.5 font-base bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full text-xs">
                                <Tag size={14} className='text-green-600' />
                                {reward.points} Pts
                            </span>

                            <span className="flex items-center gap-1.5 font-base bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-xs">
                                <Box size={14} className='text-gray-600' />
                                Stock: {reward.stock}
                            </span>

                            <span className="flex items-center gap-1.5 font-base bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full text-xs   ">
                                <Layers size={14} className='text-blue-600' />
                                {reward.category}
                            </span>

                        </div>
                    </div>
                ))}
            </div>

            {/* --- BOTÓN FLOTANTE (FAB) --- */}
            <button
                onClick={handleCreate}
                className="fixed bottom-10 right-10 bg-green-700 text-white p-4 rounded-full shadow-xl shadow-green-600/30 hover:bg-green-700 hover:scale-110 active:scale-95 transition-all z-50 group flex items-center justify-center"
            >
                <Plus size={28} strokeWidth={3} />

                {/* Tooltip Lateral */}
                <span className="absolute right-full mr-4 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none translate-x-2 group-hover:translate-x-0">
                    Nuevo Premio
                </span>
            </button>
        </div>
    );
};

export default RewardsList;