import React from 'react';
import { Heart, Quote, Sparkles, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

const ReviewCard = ({ review, t, onToggleLike, index, variant = 'landing' }) => {
    // Rotation logic - using transform for performance
    const rotations = ['rotate(2deg)', 'rotate(-3deg)', 'rotate(1deg)', 'rotate(-2deg)', 'rotate(3deg)'];
    const initialRotation = rotations[index % rotations.length];

    const isWall = variant === 'wall';

    const bgColors = isWall ? [
        'bg-white/90 dark:bg-emerald-900/30 border-emerald-500/30 backdrop-blur-2xl shadow-[0_20px_50px_rgba(1,143,100,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]',
        'bg-emerald-50/90 dark:bg-gray-900/40 border-emerald-400/20 backdrop-blur-2xl shadow-[0_20px_50px_rgba(5,131,93,0.12)]',
        'bg-[#FEF9E7]/90 dark:bg-yellow-900/20 border-yellow-500/30 backdrop-blur-2xl shadow-[0_20px_50px_rgba(202,138,4,0.12)]',
    ] : [
        'bg-[#D4F6ED] dark:bg-[#018F64]/20 border-[#B0EEDE]',
        'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800',
        'bg-[#FEF9E7] dark:bg-[#FFD700]/10 border-[#F7DC6F]/50',
    ];
    const bgColorClass = bgColors[index % bgColors.length];

    return (
        <motion.div
            initial={isWall ? { opacity: 0, scale: 0.9, y: 20 } : {}}
            whileInView={isWall ? { opacity: 1, scale: 1, y: 0 } : {}}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`group relative ${bgColorClass} border-2 ${isWall ? 'p-8' : 'p-6'} transition-all duration-500 flex flex-col h-full pointer-events-auto ${isWall ? 'hover:border-[#018F64] dark:hover:border-emerald-400 hover:-translate-y-2' : 'shadow-xl shadow-gray-200/20 dark:shadow-none hover:shadow-2xl hover:shadow-[#018F64]/10'}`}
            style={{
                borderRadius: isWall
                    ? (index % 2 === 0 ? '2rem 4rem 2rem 4rem' : '4rem 2rem 4rem 2rem')
                    : (index % 2 === 0 ? '1.5rem 3rem 1.5rem 3rem' : '3rem 1.5rem 3rem 1.5rem'),
                transform: initialRotation,
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = isWall ? 'scale(1.02) rotate(0deg)' : 'scale(1.03) rotate(0deg)';
                e.currentTarget.style.zIndex = isWall ? '30' : '20';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = initialRotation;
                e.currentTarget.style.zIndex = '1';
            }}
        >
            {/* Ambient Card Glow - Only for Wall */}
            {isWall && <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 rounded-[inherit] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>}

            {/* Stem icon */}
            <div className={`absolute ${index % 2 === 0 ? '-top-3 -right-3' : '-top-3 -left-3'} w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg z-20 border border-gray-100 dark:border-gray-700`}>
                <Leaf size={20} className="text-[#018F64] dark:text-[#B0EEDE]" fill="currentColor" />
            </div>

            {/* Quote Icon - Optional for Wall if we use the top mark */}
            {!isWall && (
                <div className="absolute top-6 right-6 text-[#018F64]/10 dark:text-white/5 transition-colors duration-500">
                    <Quote size={40} fill="currentColor" strokeWidth={0} />
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="flex gap-1">
                    {[...Array(5)].map((_, n) => (
                        <Sparkles
                            key={n}
                            size={10}
                            className={n < review.rating ? "text-[#018F64] dark:text-[#B0EEDE]" : "text-gray-200 dark:text-gray-700"}
                            fill={n < review.rating ? "currentColor" : "none"}
                        />
                    ))}
                </div>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleLike(review.id);
                    }}
                    className={`flex items-center gap-2 ${isWall ? 'px-3 py-1.5 text-[10px]' : 'px-2 py-1 text-[9px]'} rounded-full font-black uppercase tracking-widest transition-all shadow-md ${review.liked
                        ? 'bg-rose-500 text-white shadow-rose-500/30'
                        : 'bg-white/80 dark:bg-white/10 text-gray-500 hover:text-rose-500 hover:bg-white'
                        }`}
                >
                    <Heart
                        size={isWall ? 14 : 10}
                        className={`transition-transform duration-300 ${review.liked ? 'fill-current scale-110' : ''}`}
                    />
                    <span>{review.likes}</span>
                </motion.button>
            </div>

            {/* Content - Testimonial */}
            <div className={`relative z-10 ${isWall ? 'mb-8 mt-2 flex-grow flex items-center' : 'mb-6 flex-grow'}`}>
                <div className="relative">
                    {/* Floating Decorative Quote Mark - Smaller */}
                    {isWall && <span className="absolute -top-4 -left-2 text-4xl text-[#018F64]/10 dark:text-emerald-400/10 font-serif leading-none select-none">“</span>}

                    <p className={`${isWall ? 'text-gray-900 dark:text-white text-base md:text-lg font-black' : 'text-gray-800 dark:text-gray-100 text-sm md:text-base font-bold'} italic leading-relaxed tracking-tight`}>
                        "{(review.comment || review.text || "").replace(/"/g, '')}"
                    </p>
                </div>
            </div>

            {/* User Info */}
            <div className={`mt-auto flex items-center gap-3 relative z-10 border-t border-[#018F64]/10 dark:border-white/10 ${isWall ? 'pt-5' : 'pt-4'}`}>
                <img
                    src={review.image || (review.avatar ? `https://i.pravatar.cc/150?img=${review.avatar}` : `https://ui-avatars.com/api/?name=${review.name}&background=018F64&color=fff`)}
                    alt={review.name}
                    className="w-10 h-10 rounded-xl object-cover border border-white dark:border-gray-800 shadow-sm"
                />
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900 dark:text-white text-xs">
                        {review.name}
                    </span>
                    <span className="text-[9px] font-bold text-[#018F64] dark:text-emerald-400 uppercase tracking-widest">
                        {review.role || review.level || 'Eco-Guardián'}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default ReviewCard;
