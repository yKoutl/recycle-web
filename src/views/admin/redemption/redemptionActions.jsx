import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShieldCheck, TicketCheck, Search, Clock, RefreshCw, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

import {
    useValidateCodeMutation,
    useGetRedemptionsQuery,
    useLazySearchRedemptionQuery
} from '../../../store/redemption';
import { onSetActiveRedemption, onClearRedemption } from '../../../store/redemption';
import RedemptionSidebar from './redemptionModal';

const RedemptionValidator = () => {
    const dispatch = useDispatch();
    const [inputValue, setInputValue] = useState('');

    // 1. Hook para BUSCAR (Solo lectura)
    // Cambiamos el nombre a 'isSearching' para que sea claro
    const [triggerSearch, { isFetching: isSearching }] = useLazySearchRedemptionQuery();

    // 2. Hook para VALIDAR (El que hace el PATCH final)
    const [confirmValidation, { isLoading: isConfirming }] = useValidateCodeMutation();

    const { data: history = [], refetch } = useGetRedemptionsQuery();
    const { activeRedemption } = useSelector((state) => state.redemption);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        const code = inputValue.trim().toUpperCase();
        if (!code) return;

        try {
            // 🔍 PASO 1: Solo buscamos la data para "mirar" en el Modal
            const data = await triggerSearch(code).unwrap();
            dispatch(onSetActiveRedemption(data));
        } catch (err) {
            console.error("Error al buscar:", err);
            alert("Código no encontrado o ya fue procesado");
        }
    };



    const handleFinalConfirm = async () => {
        if (!activeRedemption) return; // Validación de seguridad

        try {
            // 1. PASO 2: Se ejecuta el PATCH final en la DB
            await confirmValidation(activeRedemption.redemptionCode).unwrap();

            // 2. ✅ Todo salió bien: Cerramos el modal limpiando Redux
            dispatch(onClearRedemption());

            // 3. Limpiamos el buscador
            setInputValue('');

            // 🚨 CORRECCIÓN: QUITAMOS EL REFETCH MANUAL. RTK Query actualiza la tabla por Tags.
            // refetch(); // <--- BORRA ESTO

            // Opcional: Podrías disparar un mensaje de éxito visual aquí
            console.log("¡Entrega confirmada con éxito!");

        } catch (err) {
            // Si hay un error real en la validación (como falta de stock, etc.)
            console.error("Error real en la validación del backend:", err);
            // Aquí deberías mostrar la alerta que viste en la imagen 8 pero con el error real
            alert("No se pudo confirmar la entrega física. Error del backend: " + (err.data?.message || err.message));
        }
    };

    return (
        <div className="space-y-10 animate-fade-in pb-20">

            <div className="flex flex-col items-center justify-center space-y-6 pt-10">
                <div className="p-4 rounded-[2rem] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500">
                    <ShieldCheck size={40} />
                </div>
                <div className="text-center">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic ">Validación de Premios</h2>
                </div>

                <form onSubmit={handleSearch} className="w-full max-w-xl relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500">
                        <TicketCheck size={24} />
                    </div>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value.toUpperCase())}
                        placeholder="CÓDIGO: ECO-XXXXX"
                        disabled={isSearching}
                        className="w-full pl-16 pr-40 py-6 rounded-[2.5rem] bg-white dark:bg-gray-900 border-4 border-gray-100 dark:border-white/5 shadow-2xl outline-none text-xl font-black tracking-[0.3em] uppercase transition-all focus:border-emerald-500/30"
                    />
                    <button
                        type="submit"
                        disabled={isSearching || !inputValue}
                        className="absolute right-3 top-1/2 -translate-y-1/2 px-8 py-4 bg-gray-900 dark:bg-emerald-600 text-white rounded-[1.8rem] text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                        {/* 🚨 CORRECCIÓN: Aquí antes decía isValidating, ahora usamos isSearching */}
                        {isSearching ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
                        Validar
                    </button>
                </form>
            </div>

            {/* TABLA DE HISTORIAL */}
            <div className="max-w-6xl mx-auto w-full space-y-6 px-4">
                <div className="flex items-center justify-between px-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-2">
                        <Clock size={16} /> Entregas Recientes
                    </h3>
                    <button onClick={() => refetch()} className="p-2 text-gray-400 hover:text-emerald-500 transition-colors">
                        <RefreshCw size={16} />
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-white/[0.02] text-left">
                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400">Código</th>
                                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400">Usuario</th>
                                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400">Premio</th>
                                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400 text-center">Estado</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right">Fecha</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-white/[0.03]">
                            {history.slice(0, 10).map((item) => (
                                <tr key={item._id} className="group hover:bg-gray-50 dark:hover:bg-white/[0.01] transition-all">
                                    <td className="px-8 py-4">
                                        <span className="text-xs font-black tracking-widest text-gray-900 dark:text-white bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-black/5 uppercase">
                                            {item.redemptionCode}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[13px] font-bold text-gray-700 dark:text-gray-200 uppercase">
                                        {item.userId?.fullName}
                                    </td>
                                    <td className="px-6 py-4 text-[13px] font-bold text-gray-700 dark:text-gray-200 uppercase">
                                        {item.rewardId?.title}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border ${item.status === 'DELIVERED'
                                            ? 'bg-emerald-50 text-emerald-500 border-emerald-100'
                                            : 'bg-amber-50 text-amber-500 border-amber-100'
                                            }`}>
                                            {item.status === 'DELIVERED' ? 'Entregado' : 'Pendiente'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 text-right text-[11px] font-bold text-gray-400">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── SIDEBAR DE DETALLES ── */}
            <RedemptionSidebar
                isOpen={!!activeRedemption}
                onClose={() => dispatch(onClearRedemption())}
                data={activeRedemption}
                onConfirm={handleFinalConfirm}
                isConfirming={isConfirming}
            />
        </div>
    );
};

export default RedemptionValidator;