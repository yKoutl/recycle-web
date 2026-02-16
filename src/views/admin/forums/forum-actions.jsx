import React, { useState } from 'react';
import { MessageSquare, Heart, Trash2, User, Calendar, AlertTriangle } from 'lucide-react';
import { useGetPostsQuery, useDeletePostMutation } from '../../../store/forum';
import PostDetailModal from './forum-details'; // Asegúrate que la ruta sea correcta

const ForumView = () => {
    // 1. Obtener los posts del backend
    const { data: posts = [], isLoading, isError } = useGetPostsQuery();

    // Estado para saber qué post se seleccionó
    const [selectedPost, setSelectedPost] = useState(null);

    // 2. Hook para eliminar posts (Moderación)
    const [deletePost] = useDeletePostMutation();

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este post? Esta acción es irreversible.")) {
            try {
                await deletePost(id).unwrap();
            } catch (error) {
                console.error("Error al eliminar post:", error);
                alert("No se pudo eliminar el post");
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('es-PE', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    if (isLoading) return <div className="p-10 text-center text-gray-500">Cargando foro...</div>;

    if (isError) return (
        <div className="p-10 text-center text-red-500 flex flex-col items-center gap-2">
            <AlertTriangle size={40} />
            <p>Error al cargar los posts. Verifica tu conexión o que el backend esté corriendo.</p>
        </div>
    );

    return (
        <div className="relative min-h-[50vh]">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Supervisión del Foro</h2>
                <p className="text-gray-500 text-sm">Modera las publicaciones de la comunidad</p>
            </div>

            {/* GRID DE POSTS */}
            <div className="grid grid-cols-1 gap-6 pb-24">
                {posts?.map((post) => (
                    <div
                        key={post._id}
                        // --- 1. AQUÍ AGREGAMOS EL EVENTO CLICK ---
                        onClick={() => setSelectedPost(post)}
                        className="cursor-pointer bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all group relative"
                    >

                        {/* --- BOTÓN DE ELIMINAR (MODERACIÓN) --- */}
                        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                            <button
                                // --- 2. AQUÍ EVITAMOS QUE EL CLICK SE PROPAGUE AL MODAL ---
                                onClick={(e) => {
                                    e.stopPropagation(); // ¡Importante! Evita abrir el modal al borrar
                                    handleDelete(post._id);
                                }}
                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
                                title="Eliminar publicación"
                            >
                                <span className="text-xs font-bold">Eliminar</span>
                                <Trash2 size={16} />
                            </button>
                        </div>

                        {/* --- ENCABEZADO DEL POST (AUTOR) --- */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <User size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                                    {post.author?.fullName || 'Usuario'}
                                </h4>
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <Calendar size={12} />
                                    <span>{formatDate(post.createdAt)}</span>
                                </div>
                            </div>
                        </div>

                        {/* --- CONTENIDO --- */}
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
                            {post.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3"> {/* Agregué line-clamp-3 para que no ocupe mucho espacio */}
                            {post.content}
                        </p>

                        {/* Si hay imagen */}
                        {post.image && (
                            <div className="mb-4 rounded-xl overflow-hidden h-48 w-full md:w-1/2">
                                <img src={post.image} alt="Post content" className="w-full h-full object-cover" />
                            </div>
                        )}

                        {/* --- FOOTER (ESTADÍSTICAS) --- */}
                        <div className="flex items-center gap-6 border-t border-gray-100 dark:border-gray-800 pt-4 mt-2">
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <Heart size={18} className={post.likes?.length > 0 ? "text-red-500 fill-red-500" : ""} />
                                <span className="font-medium">{post.likes?.length || 0} Likes</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <MessageSquare size={18} />
                                <span className="font-medium">{post.comments?.length || 0} Comentarios</span>
                            </div>
                            {post.category && (
                                <span className="ml-auto bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-semibold uppercase">
                                    {post.category}
                                </span>
                            )}
                        </div>
                    </div>
                ))}

                {posts.length === 0 && (
                    <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300">
                        <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">No hay publicaciones en el foro aún.</p>
                    </div>
                )}
            </div>

            {/* MODAL DE DETALLE */}
            <PostDetailModal
                isOpen={!!selectedPost} // Convierte null a false, objeto a true
                onClose={() => setSelectedPost(null)}
                post={selectedPost}
            />
        </div>
    );
};

export default ForumView;