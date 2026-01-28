import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import Button from '../../components/shared/Button';
import AddCommentModal from '../../components/modals/AddCommentModal';
import ReviewCard from '../../components/cards/ReviewCard';
import { INITIAL_REVIEWS } from '../../data/mockData';

const CommunitySection = ({ t }) => {
    const [reviews, setReviews] = useState(INITIAL_REVIEWS(t));
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Update reviews when language changes
    useEffect(() => {
        setReviews(prevReviews => {
            const newReviews = INITIAL_REVIEWS(t);
            // Preserve likes/liked state
            return newReviews.map((rev, index) => ({
                ...rev,
                likes: prevReviews[index]?.likes || rev.likes,
                liked: prevReviews[index]?.liked || rev.liked
            }));
        });
    }, [t]);

    const toggleLike = (id) => {
        setReviews(reviews.map(review => {
            if (review.id === id) {
                return {
                    ...review,
                    liked: !review.liked,
                    likes: review.liked ? review.likes - 1 : review.likes + 1
                };
            }
            return review;
        }));
    };

    return (
        <section className="py-24 bg-[image:var(--bg-primary-day)] dark:bg-[image:var(--bg-primary-night)] transition-colors duration-500 relative">
            <AddCommentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} t={t} />

            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase inline-block mb-3">
                        {t.community.tag}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">{t.community.title}</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {reviews.map((review, index) => (
                        <ReviewCard key={review.id} review={review} t={t} onToggleLike={toggleLike} index={index} />
                    ))}
                </div>

                <div className="text-center">
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="mx-auto bg-[#00C853] hover:bg-[#00A844] text-white shadow-lg shadow-green-500/30 rounded-full px-8 py-3 font-bold"
                        icon={MessageSquare}
                    >
                        {t.community.addComment}
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default CommunitySection;
