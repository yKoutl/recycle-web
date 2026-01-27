import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Medal, Send, CheckCircle } from 'lucide-react';
import Button from '../shared/Button';

const AddCommentModal = ({ isOpen, onClose, t }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(5);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setName('');
            setEmail('');
            setComment('');
            setRating(5);
            setSuccess(false);
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically validate name/email/comment before sending
        console.log({ name, email, rating, comment });
        setSuccess(true);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md p-8 relative overflow-hidden border border-gray-100 dark:border-gray-800">
                {!success ? (
                    <>
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-green-600">
                            <X size={24} />
                        </button>
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 dark:text-green-400">
                                <MessageSquare size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t.community.modalTitle}</h3>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* New Fields: Name and Email */}
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                                        {t.community.nameLabel || "Nombre"} <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder={t.community.namePlaceholder || "Tu nombre completo"}
                                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none text-gray-900 dark:text-white transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                                        {t.community.emailLabel || "Correo electrónico"} <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={t.community.emailPlaceholder || "tu@correo.com"}
                                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none text-gray-900 dark:text-white transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t.community.medalsLabel}</label>
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className={`p-1 transition-all transform hover:scale-110 ${star <= rating ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`}
                                        >
                                            <Medal size={32} fill={star <= rating ? "currentColor" : "none"} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder={t.community.placeholder}
                                className="w-full h-32 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none resize-none text-gray-900 dark:text-white transition-all"
                                required
                            />
                            <Button type="submit" className="w-full py-3" icon={Send}>{t.community.send}</Button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-8 animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 dark:text-green-400">
                            <CheckCircle size={48} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.community.successTitle}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            {t.community.successMessage}
                        </p>
                        <Button onClick={onClose} className="w-full">{t.community.close}</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddCommentModal;
