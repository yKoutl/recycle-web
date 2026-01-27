import React from 'react';
import { Heart, ThumbsUp } from 'lucide-react';

const ReviewCard = ({ review, t, onToggleLike, index }) => {
    // Generate random rotation for sticker effect based on index
    const rotation = index % 2 === 0 ? '-rotate-2' : 'rotate-2';

    return (
        <div className={`
            bg-white dark:bg-[#112A22] p-8 rounded-xl shadow-lg border-2 border-green-50 dark:border-emerald-900/50 
            text-left transform ${rotation} hover:rotate-0 hover:scale-105 transition-all duration-300 
            flex flex-col h-full relative group
            before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/50 before:to-transparent before:pointer-events-none before:rounded-xl dark:before:opacity-10
        `}>
            {/* Sticker "Tape" effect visual (optional, keeping clean for now but using rotation/shadow) */}

            {/* Header: Rating & Likes */}
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex gap-1">
                    {[...Array(5)].map((_, n) => (
                        <Heart
                            key={n}
                            size={20}
                            weight="fill"
                            className={`${n < review.rating ? "fill-[#22C55E] text-[#22C55E]" : "fill-gray-200 text-gray-200"}`}
                        />
                    ))}
                </div>
                <button
                    onClick={() => onToggleLike(review.id)}
                    className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${review.liked ? 'text-[#22C55E]' : 'text-gray-400 hover:text-[#22C55E]'}`}
                >
                    <ThumbsUp size={18} />
                    {review.likes}
                </button>
            </div>

            {/* Content */}
            <p className="text-gray-700 dark:text-gray-300 mb-8 italic text-lg leading-relaxed flex-1 font-handwriting relative z-10">
                "{review.text.replace(/"/g, '')}"
            </p>

            {/* Footer: User Info */}
            <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-emerald-900/30 mt-auto relative z-10">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-md">
                    <img src={`https://i.pravatar.cc/150?img=${review.avatar}`} alt={review.name} className="w-full h-full object-cover" />
                </div>
                <div>
                    <div className="font-bold text-gray-900 dark:text-white text-base group-hover:text-green-600 dark:group-hover:text-emerald-400 transition-colors">{review.name}</div>
                    <div className="text-xs text-green-600 dark:text-emerald-400 font-bold uppercase tracking-wider">{review.level || 'Eco-Guardián'}</div>
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;
