import React, { useState, useEffect } from "react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/use-auth";

interface Post {
    id: number;
    author: string;
    content: string;
    replies: Reply[];
}

interface Reply {
    id: number;
    author: string;
    content: string;
}

const Forum: React.FC = () => {
    // Estados para diálogos de confirmación
    const [showDeletePostDialog, setShowDeletePostDialog] = useState<{ open: boolean, postId: number | null }>({ open: false, postId: null });
    const [showDeleteReplyDialog, setShowDeleteReplyDialog] = useState<{ open: boolean, postId: number | null, replyId: number | null }>({ open: false, postId: null, replyId: null });

    // Eliminar publicación solo si el usuario es el autor
    const eliminarPublicacion = (postId: number) => {
        setShowDeletePostDialog({ open: true, postId });
    };

    const confirmarEliminarPublicacion = () => {
        if (showDeletePostDialog.postId !== null) {
            const updatedPosts = posts.filter(post => post.id !== showDeletePostDialog.postId);
            setPosts(updatedPosts);
            localStorage.setItem("forum-posts", JSON.stringify(updatedPosts));
        }
        setShowDeletePostDialog({ open: false, postId: null });
    };

    // Eliminar respuesta solo si el usuario es el autor
    const eliminarRespuesta = (postId: number, replyId: number) => {
        setShowDeleteReplyDialog({ open: true, postId, replyId });
    };

    const confirmarEliminarRespuesta = () => {
        const { postId, replyId } = showDeleteReplyDialog;
        if (postId !== null && replyId !== null) {
            const updatedPosts = posts.map(post =>
                post.id === postId
                    ? {
                        ...post,
                        replies: post.replies.filter(reply => reply.id !== replyId)
                    }
                    : post
            );
            setPosts(updatedPosts);
            localStorage.setItem("forum-posts", JSON.stringify(updatedPosts));
        }
        setShowDeleteReplyDialog({ open: false, postId: null, replyId: null });
    };
    const { user } = useAuth();
    const defaultPosts: Post[] = [
        {
            id: 1,
            author: "Admin",
            content: "¡Bienvenido al foro! Puedes compartir tus dudas o experiencias financieras aquí.",
            replies: [
                { id: 101, author: "Juan", content: "Gracias, excelente iniciativa!" }
            ],
        },
    ];

    // Persistencia simple en localStorage
    const [posts, setPosts] = useState<Post[]>(() => {
        const saved = localStorage.getItem("forum-posts");
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return defaultPosts;
            }
        }
        return defaultPosts;
    });
    const [content, setContent] = useState("");
    const addPost = () => {
        if (!user || !content) return;
        const newPost: Post = {
            id: Date.now(),
            author: user.name || user.username || "Usuario",
            content,
            replies: [],
        };
        const updatedPosts = [newPost, ...posts];
        setPosts(updatedPosts);
        localStorage.setItem("forum-posts", JSON.stringify(updatedPosts));
        setContent("");
    };
    const addReply = (postId: number, replyAuthor: string, replyContent: string) => {
        if (!user || !replyContent) return;
        const updatedPosts = posts.map(post =>
            post.id === postId
                ? {
                    ...post,
                    replies: [
                        ...post.replies,
                        { id: Date.now(), author: user.name || user.username || "Usuario", content: replyContent },
                    ],
                }
                : post
        );
        setPosts(updatedPosts);
        localStorage.setItem("forum-posts", JSON.stringify(updatedPosts));
    };
    // Sincronizar cambios manuales en localStorage (por si hay otros tabs)
    useEffect(() => {
        const syncPosts = (e: StorageEvent) => {
            if (e.key === "forum-posts" && e.newValue) {
                try {
                    setPosts(JSON.parse(e.newValue));
                } catch { }
            }
        };
        window.addEventListener("storage", syncPosts);
        return () => window.removeEventListener("storage", syncPosts);
    }, []);





    return (
        <div className="p-4 max-w-2xl mx-auto bg-black text-yellow-50 rounded-xl shadow-lg">
            <h2 className="text-2xl text-center font-bold mb-4 text-yellow-400">Foro</h2>
            <div className="mb-4 flex flex-col md:flex-row items-center justify-center gap-2">
                <textarea
                    rows={6}
                    className="border border-yellow-600 bg-zinc-900 text-white p-2 rounded w-full md:w-auto flex-1"
                    placeholder="Escribe sobre un tema..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded font-semibold w-full md:w-auto" onClick={addPost}>
                    Publicar
                </button>
                {/*<button onClick={() => eliminarRespuesta(1, 1756067941352)}>
                    Eliminar publicación con id 2 (prueba)
                </button>*/}

            </div>
            <div className="space-y-6">
                {posts.map(post => (
                    <div key={post.id} className="border border-yellow-700 rounded-lg p-3 bg-zinc-900">
                        <div className="flex items-center justify-between">
                            <div className="font-semibold text-yellow-300 mb-1">{post.author}</div>
                            {(user && (post.author === user.name || post.author === user.username)) && (
                                <button
                                    className="ml-2 text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                                    onClick={() => eliminarPublicacion(post.id)}
                                >
                                    X
                                </button>
                            )}
                        </div>
                        <div className="mb-2 break-words whitespace-pre-line text-white">{post.content}</div>
                        <ReplySection post={post} addReply={addReply} user={user} eliminarRespuesta={eliminarRespuesta} />
                        {post.replies.length > 0 && (
                            <div className="mt-2 pl-4 border-l border-yellow-700">
                                {post.replies.map(reply => (
                                    <div key={reply.id} className="mb-2 break-words flex items-center justify-between">
                                        <span>
                                            {/* <span className="text-xs text-gray-400">ID: {reply.id}</span> */}
                                            <span className="font-semibold text-yellow-400">{reply.author}:</span> <span className="text-white">{reply.content}</span>
                                        </span>
                                        {(user && (reply.author === user.name || reply.author === user.username)) && (
                                            <button
                                                className="ml-2 text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                                                onClick={() => eliminarRespuesta(post.id, reply.id)}
                                            >
                                                X
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* AlertDialog para eliminar publicación */}
            <AlertDialog open={showDeletePostDialog.open} onOpenChange={open => setShowDeletePostDialog({ ...showDeletePostDialog, open })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará la publicación y no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setShowDeletePostDialog({ open: false, postId: null })}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmarEliminarPublicacion}>Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* AlertDialog para eliminar respuesta */}
            <AlertDialog open={showDeleteReplyDialog.open} onOpenChange={open => setShowDeleteReplyDialog({ ...showDeleteReplyDialog, open })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará la respuesta y no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setShowDeleteReplyDialog({ open: false, postId: null, replyId: null })}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmarEliminarRespuesta}>Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

const ReplySection: React.FC<{ post: Post; addReply: (postId: number, author: string, content: string) => void; user: any; eliminarRespuesta: (postId: number, replyId: number) => void }> = ({ post, addReply, user, eliminarRespuesta }) => {
    const [replyContent, setReplyContent] = useState("");

    return (
        <div className="flex w-full items-center mb-2 gap-2">
            <textarea
                rows={3}
                className="border border-yellow-600 bg-zinc-900 text-white p-1 rounded flex-1"
                placeholder="Responder..."
                value={replyContent}
                onChange={e => setReplyContent(e.target.value)}
            />
            <button
                className="bg-yellow-500 text-black px-4 py-1 rounded-lg font-semibold whitespace-nowrap max-w-[150px] overflow-hidden text-ellipsis"
                onClick={() => {
                    addReply(post.id, "", replyContent);
                    setReplyContent("");
                }}
            >
                Responder
            </button>
        </div>
    );
};

export default Forum;
