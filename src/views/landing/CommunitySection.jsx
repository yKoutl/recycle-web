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
        <section className="py-20 bg-green-50/50 dark:bg-gray-900 transition-colors duration-500 relative">
            <AddCommentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} t={t} />

            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <span className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-sm mb-2 block">{t.community.tag}</span>
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">{t.community.title}</h2>
                    <Button onClick={() => setIsModalOpen(true)} className="mx-auto" icon={MessageSquare}>{t.community.addComment}</Button>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {reviews.map((review) => (
                        <ReviewCard key={review.id} review={review} t={t} onToggleLike={toggleLike} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CommunitySection;
