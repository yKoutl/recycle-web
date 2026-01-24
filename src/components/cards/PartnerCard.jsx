import React from 'react';

const PartnerCard = ({ partner }) => {
    return (
        <div className="group relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-green-200 dark:hover:border-green-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-t-2xl"></div>
            <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300 filter grayscale group-hover:grayscale-0 dark:filter-none">{partner.logo}</div>
            <h4 className="font-bold text-gray-900 dark:text-white text-lg">{partner.name}</h4>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-md">{partner.category}</span>
        </div>
    );
};

export default PartnerCard;
