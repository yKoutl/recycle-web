import React from 'react';
import { Medal, ThumbsUp } from 'lucide-react';

const ReviewCard = ({ review, t, onToggleLike }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-left hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, n) => <Medal key={n} size={18} fill={n < review.rating ? "currentColor" : "none"} className={n < review.rating ? "text-green-500" : "text-gray-300"} />)}
                </div>
                <button
                    onClick={() => onToggleLike(review.id)}
                    className={`flex items-center gap-1 text-sm font-medium transition-colors ${review.liked ? 'text-green-600' : 'text-gray-400 hover:text-green-600'}`}
                >
                    <ThumbsUp size={16} fill={review.liked ? "currentColor" : "none"} />
                    {review.likes}
                </button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6 italic min-h-[80px]">{review.text}</p>
            <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?img=${review.avatar}`} alt="User" className="w-full h-full object-cover" />
                </div>
                <div>
                    <div className="font-bold text-gray-900 dark:text-white">{review.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t.community.role}</div>
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;
