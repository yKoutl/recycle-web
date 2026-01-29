import { useGetProgramsQuery, useDeleteProgramMutation } from '../../../store/programs';
import { Plus, Edit2, Trash2, MapPin, Users } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { onSetActiveProgram } from '../../../store/programs';
import ProgramFormModal from './program-modal';
import { useState } from 'react';
const ProgramsList = () => {
    const dispatch = useDispatch();

    // 2. ESTADO LOCAL DEL MODAL
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: programs = [], isLoading } = useGetProgramsQuery();
    const [startDelete] = useDeleteProgramMutation();

    // Acción para CREAR
    const handleCreate = () => {
        dispatch(onSetActiveProgram(null));
        setIsModalOpen(true); // <--- ABRE MODAL LOCAL
    };

    // Acción para EDITAR
    const handleEdit = (program) => {
        dispatch(onSetActiveProgram(program));
        setIsModalOpen(true); // <--- ABRE MODAL LOCAL
    };

    // Acción para BORRAR
    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este programa?")) {
            await startDelete(id);
        }
    };

    if (isLoading) return <div className="p-10 text-center text-gray-500">Cargando programas...</div>;

    return (
        <div className="relative min-h-[50vh]">
            {/* GRID DE TARJETAS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
                {programs?.map((program) => (
                    <div key={program._id} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all group relative">

                        {/* Botones de acción (Hover) */}
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                            <button onClick={() => handleEdit(program)} className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(program._id)} className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors">
                                <Trash2 size={16} />
                            </button>
                        </div>

                        {/* Imagen de portada (Opcional, si quieres mostrarla) */}
                        {program.imageUrl && (
                            <div className="h-32 w-full mb-4 overflow-hidden rounded-xl">
                                <img src={program.imageUrl} alt={program.title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                            </div>
                        )}

                        <h3 className="text-lg font-bold text-gray-900 dark:text-white pr-4 truncate">
                            {program.title}
                        </h3>

                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 line-clamp-2 h-10">
                            {program.description}
                        </p>

                        <div className="mt-4 flex justify-between items-center border-t border-gray-50 dark:border-gray-800 pt-3">
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

            {/* BOTÓN FLOTANTE */}
            <button
                onClick={handleCreate}
                className="fixed bottom-10 right-10 bg-green-600 text-white p-4 rounded-full shadow-xl shadow-green-600/30 hover:bg-green-700 hover:scale-110 active:scale-95 transition-all z-50 group flex items-center justify-center"
            >
                <Plus size={28} strokeWidth={3} />
            </button>

            {/* 3. RENDERIZAR EL MODAL */}
            <ProgramFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default ProgramsList;