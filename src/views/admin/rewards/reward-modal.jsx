import React, { useState, useEffect } from 'react';
import { X, Save, Gift, Tag, Info, Layers, Box } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useCreateRewardMutation, useUpdateRewardMutation } from '../../../store/rewards';

const RewardFormModal = ({ isOpen, onClose }) => {
    const { activeReward } = useSelector((state) => state.rewards || {});
    const [createReward] = useCreateRewardMutation();
    const [updateReward] = useUpdateRewardMutation();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        points: 0,
        stock: 0,
        category: 'digital',
        imageUrl: ''
    });

    useEffect(() => {
        if (activeReward) {
            setFormData(activeReward);
        } else {
            setFormData({
                title: '',
                description: '',
                points: 0,
                stock: 0,
                category: 'digital',
                imageUrl: ''
            });
        }
    }, [activeReward, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (activeReward) {
                await updateReward({ id: activeReward._id, ...formData }).unwrap();
            } else {
                await createReward(formData).unwrap();
            }
            onClose();
        } catch (err) {
            console.error('Error saving reward:', err);
            alert('Error al guardar el premio');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-gray-50 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-[#018F64] text-white rounded-2xl shadow-lg shadow-[#018F64]/20">
                            <Gift size={20} />
                        </div>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">
                            {activeReward ? 'Editar Premio' : 'Nuevo Premio'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-xl transition-colors text-gray-400">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#018F64] ml-1 flex items-center gap-2">
                                <Tag size={12} /> Título del Premio
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#018F64]/20 transition-all font-medium"
                                placeholder="Ej: Suscripción Premium"
                                required
                            />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#018F64] ml-1 flex items-center gap-2">
                                <Info size={12} /> Descripción
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#018F64]/20 transition-all font-medium h-24 resize-none"
                                placeholder="Explica en qué consiste el premio..."
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#018F64] ml-1 flex items-center gap-2">
                                <Layers size={12} /> Puntos Requeridos
                            </label>
                            <input
                                type="number"
                                value={formData.points}
                                onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#018F64]/20 transition-all font-bold"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#018F64] ml-1 flex items-center gap-2">
                                <Box size={12} /> Stock Disponible
                            </label>
                            <input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#018F64]/20 transition-all font-bold"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 border border-gray-100 dark:border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-4 bg-[#018F64] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#05835D] transition-all shadow-xl shadow-[#018F64]/20 flex items-center justify-center gap-2"
                        >
                            <Save size={16} /> {activeReward ? 'Guardar Cambios' : 'Crear Premio'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RewardFormModal;
