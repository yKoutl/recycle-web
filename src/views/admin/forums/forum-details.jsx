import React, { useState, useEffect } from 'react';
import { X, Heart, MessageSquare, Send, User, Trash2 } from 'lucide-react';
import { useGetCommentsByPostQuery, useAddCommentMutation, useDeletePostMutation } from '../../../store/forum';

const PostDetailModal = ({ isOpen, onClose, post }) => {
    const [commentText, setCommentText] = useState('');

    // 1. Cargar comentarios de este post
    const { data: comments = [], isLoading: loadingComments } = useGetCommentsByPostQuery(post?._id, {
        skip: !post, // Solo ejecutar si hay un post seleccionado
    });

    // 2. Hook para agregar comentario
    const [addComment, { isLoading: isPostingComment }] = useAddCommentMutation();
    const [deletePost] = useDeletePostMutation();

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            await addComment({ postId: post._id, content: commentText }).unwrap();
            setCommentText(''); // Limpiar input
        } catch (error) {
            console.error("Error al comentar:", error);
        }
    };

    const handleDeletePost = async () => {
        if (confirm("¿Borrar post?")) {
            await deletePost(post._id);
            onClose();
        }
    };

    if (!isOpen || !post) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-gray-900 w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl flex overflow-hidden border border-gray-200 dark:border-gray-800">

                {/* --- IZQUIERDA: CONTENIDO DEL POST (Scrollable) --- */}
                <div className="w-full md:w-3/5 p-6 overflow-y-auto custom-scrollbar border-r border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900">
                    <button onClick={onClose} className="md:hidden absolute top-4 right-4 p-2 bg-gray-100 rounded-full">
                        <X size={20} />
                    </button>

                    {/* Autor */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                            {post.author?.name?.[0] || <User />}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">{post.author?.name}</h3>
                            <span className="text-xs text-gray-500">Publicado el {new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        {/* Botón borrar (Solo admin) */}
                        <button onClick={handleDeletePost} className="ml-auto text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={18} />
                        </button>
                    </div>

                    {/* Contenido */}
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{post.title}</h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 whitespace-pre-wrap">
                        {post.content}
                    </p>

                    {/* Imagen Grande */}
                    {post.image && (
                        <div className="rounded-xl overflow-hidden mb-6 shadow-sm border border-gray-100 dark:border-gray-800">
                            <img src={post.image} alt="Post" className="w-full h-auto object-cover" />
                        </div>
                    )}

                    {/* Stats */}
                    <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2 text-pink-500 font-medium">
                            <Heart className="fill-current" size={20} /> {post.likes?.length || 0} Likes
                        </div>
                        <div className="flex items-center gap-2 text-blue-500 font-medium">
                            <MessageSquare size={20} /> {comments.length} Comentarios
                        </div>
                    </div>
                </div>

                {/* --- DERECHA: COMENTARIOS (Fijo) --- */}
                <div className="hidden md:flex flex-col w-2/5 bg-white dark:bg-gray-950">
                    {/* Header Derecha */}
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 dark:text-white">Comentarios</h3>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Lista Comentarios */}
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
                        {loadingComments ? (
                            <p className="text-center text-gray-400 py-10">Cargando comentarios...</p>
                        ) : comments.length === 0 ? (
                            <div className="text-center py-20 text-gray-400">
                                <MessageSquare size={40} className="mx-auto mb-2 opacity-20" />
                                <p>Sé el primero en comentar</p>
                            </div>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment._id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-500">
                                        {comment.author?.name?.[0] || 'U'}
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-2xl rounded-tl-none">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className="text-xs font-bold text-gray-900 dark:text-white">{comment.author?.name}</span>
                                            <span className="text-[10px] text-gray-400 ml-2">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Input Comentario */}
                    <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
                        <form onSubmit={handleAddComment} className="relative">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Escribe un comentario..."
                                className="w-full pl-4 pr-12 py-3 bg-gray-100 dark:bg-gray-900 rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                            />
                            <button
                                type="submit"
                                disabled={!commentText.trim() || isPostingComment}
                                className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send size={16} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetailModal;