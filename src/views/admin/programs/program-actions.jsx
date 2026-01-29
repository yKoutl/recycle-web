import { useGetProgramsQuery, useDeleteProgramMutation } from '../../../store/programs';
import { Plus, Edit2, Trash2, MapPin, Users } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { onSetActiveProgram } from '../../../store/programs';
const ProgramsList = () => {
    const dispatch = useDispatch();

    // 1. Obtener datos (RTK Query)
    const { data: programs = [], isLoading } = useGetProgramsQuery();

    // 2. Hook para borrar
    const [startDelete] = useDeleteProgramMutation();

    // Acción para CREAR (Limpia la selección y abre modal)
    const handleCreate = () => {
        dispatch(onSetActiveProgram(null));
        if (onOpenModal) onOpenModal();
    };

    // Acción para EDITAR (Guarda la selección y abre modal)
    const handleEdit = (program) => {
        dispatch(onSetActiveProgram(program));
        if (onOpenModal) onOpenModal();
    };

    // Acción para BORRAR
    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este programa?")) {
            await startDelete(id);
        }
    };

    if (isLoading) return <p>Cargando programas...</p>;

    return (
        <div className="relative min-h-[50vh]">
            {/* GRID DE TARJETAS */}
            {/* Agregamos pb-24 para que el último elemento no quede tapado por el botón flotante */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
                {programs?.map((program) => (
                    <div key={program._id} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800  dark:hover:shadow-green-700 hover:shadow-md transition-all group relative">

                        {/* --- BOTONES DE ACCIÓN (Aparecen al Hover) --- */}
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                                onClick={() => handleEdit(program)}
                                className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 transition-colors"
                                title="Editar"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={() => handleDelete(program._id)}
                                className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 transition-colors"
                                title="Eliminar"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        {/* --------------------------------------------- */}

                        <h3 className="text-lg font-bold text-gray-900 dark:text-white pr-16 truncate">
                            {program.title}
                        </h3>

                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 line-clamp-2 h-10">
                            {program.description}
                        </p>

                        <div className="mt-6 flex justify-between items-center border-t border-gray-50 dark:border-gray-800 pt-4">
                            <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 font-semibold bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg text-xs">
                                <MapPin size={14} className="text-green-600" />
                                {program.location}
                            </span>
                            <span className="flex items-center gap-1.5 text-gray-400 text-xs">
                                <Users size={14} />
                                {program.participants}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- BOTÓN FLOTANTE (FAB) --- */}
            <button
                onClick={handleCreate}
                className="fixed bottom-10 right-10 bg-green-600 text-white p-4 rounded-full shadow-xl shadow-green-600/30 hover:bg-green-700 hover:scale-110 active:scale-95 transition-all z-50 group flex items-center justify-center"
            >
                <Plus size={28} strokeWidth={3} />

                {/* Tooltip Lateral */}
                <span className="absolute right-full mr-4 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none translate-x-2 group-hover:translate-x-0">
                    Nuevo Programa
                </span>
            </button>
            {/* --------------------------- */}
        </div>
    );
};

export default ProgramsList;
