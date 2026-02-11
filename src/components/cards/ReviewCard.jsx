import React from 'react';
import { Heart, Quote, Sparkles, Leaf } from 'lucide-react';

const ReviewCard = ({ review, t, onToggleLike, index }) => {
    // Rotation logic - using transform for performance
    const rotations = ['rotate(2deg)', 'rotate(-3deg)', 'rotate(1deg)', 'rotate(-2deg)', 'rotate(3deg)'];
    const initialRotation = rotations[index % rotations.length];

    const bgColors = [
        'bg-[#D4F6ED] dark:bg-[#018F64]/20 border-[#B0EEDE]',
        'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800',
        'bg-[#FEF9E7] dark:bg-[#FFD700]/10 border-[#F7DC6F]/50',
    ];
    const bgColorClass = bgColors[index % bgColors.length];

    return (
        <div
            className={`group relative ${bgColorClass} border-2 p-8 transition-all duration-300 flex flex-col h-full shadow-xl shadow-gray-200/20 dark:shadow-none hover:shadow-2xl hover:shadow-[#018F64]/10 pointer-events-auto`}
            style={{
                borderRadius: index % 2 === 0 ? '1.5rem 4rem 1.5rem 4rem' : '4rem 1.5rem 4rem 1.5rem',
                transform: initialRotation,
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) rotate(0deg)';
                e.currentTarget.style.zIndex = '20';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = initialRotation;
                e.currentTarget.style.zIndex = '1';
            }}
        >
            {/* Stem icon */}
            <div className={`absolute ${index % 2 === 0 ? '-top-3 -right-3' : '-top-3 -left-3'} w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg z-20 border border-gray-100 dark:border-gray-700`}>
                <Leaf size={20} className="text-[#018F64] dark:text-[#B0EEDE]" fill="currentColor" />
            </div>

            {/* Quote Icon */}
            <div className="absolute top-8 right-8 text-[#018F64]/10 dark:text-white/5 transition-colors duration-500">
                <Quote size={50} fill="currentColor" strokeWidth={0} />
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="flex gap-1">
                    {[...Array(5)].map((_, n) => (
                        <Sparkles
                            key={n}
                            size={12}
                            className={n < review.rating ? "text-[#018F64] dark:text-[#B0EEDE]" : "text-gray-200 dark:text-gray-700"}
                            fill={n < review.rating ? "currentColor" : "none"}
                        />
                    ))}
                </div>
                <button
                    onClick={() => onToggleLike(review.id)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${review.liked
                            ? 'bg-[#FF6B6B] text-white'
                            : 'bg-white/50 dark:bg-white/5 text-gray-500'
                        }`}
                >
                    <Heart size={10} fill={review.liked ? "currentColor" : "none"} />
                    {review.likes}
                </button>
            </div>

            {/* Content */}
            <div className="relative z-10 mb-8 flex-grow">
                <p className="text-gray-800 dark:text-gray-100 text-sm md:text-base leading-relaxed font-bold italic">
                    "{review.text.replace(/"/g, '')}"
                </p>
            </div>

            {/* User Info */}
            <div className="mt-auto flex items-center gap-3 relative z-10 border-t border-[#018F64]/10 dark:border-white/10 pt-5">
                <img
                    src={`https://i.pravatar.cc/150?img=${review.avatar}`}
                    alt={review.name}
                    className="w-10 h-10 rounded-xl object-cover border border-white dark:border-gray-800 shadow-sm"
                />
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900 dark:text-white text-xs">
                        {review.name}
                    </span>
                    <span className="text-[9px] font-bold text-[#018F64] dark:text-emerald-400 uppercase tracking-widest">
                        {review.level || 'Eco-Guardián'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;
