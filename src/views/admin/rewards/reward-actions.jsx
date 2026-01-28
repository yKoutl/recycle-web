import React from 'react';
import { useGetRewardsQuery } from '../../../store/rewards';

const RewardsList = () => {
    // A) Para traer TODOS los premios:
    // const { data: allRewards, isLoading } = useGetRewardsQuery();

    // B) Para filtrar por categoría (como en tu captura de curl):
    const { data: partnerRewards, isLoading } = useGetRewardsQuery('partners');

    if (isLoading) return <div>Cargando premios...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerRewards?.map((reward) => (
                // CAMBIO 1: Usa reward._id en lugar de reward.id
                <div key={reward._id} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">

                    {/* CAMBIO 2: Usa reward.title en lugar de reward.name */}
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {reward.title}
                    </h3>

                    <p className="text-gray-500 text-sm mt-2">
                        {reward.description}
                    </p>

                    <div className="mt-4 flex justify-between items-center">
                        <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-xs">
                            {reward.points} Puntos
                        </span>
                        <span className="text-gray-400 text-xs">
                            Stock: {reward.stock}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};
export default RewardsList;