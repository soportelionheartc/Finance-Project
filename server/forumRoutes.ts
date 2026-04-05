import { Router } from "express";

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

// "Base de datos" en memoria
let posts: Post[] = [
  {
    id: 1,
    author: "Admin",
    content: "¡Bienvenido al foro! Puedes publicar tus dudas aquí.",
    replies: [],
  },
];

const router = Router();

// Obtener todos los posts
router.get("/posts", (req, res) => {
  res.json(posts);
});

// Crear un post nuevo
router.post("/posts", (req, res) => {
  const { author, content } = req.body;
  if (!author || !content)
    return res.status(400).json({ error: "Faltan datos" });

  const newPost: Post = {
    id: Date.now(),
    author,
    content,
    replies: [],
  };
  posts.unshift(newPost);
  res.json(newPost);
});

// Crear una respuesta
router.post("/posts/:postId/replies", (req, res) => {
  const { postId } = req.params;
  const { author, content } = req.body;
  const post = posts.find((p) => p.id === Number(postId));
  if (!post) return res.status(404).json({ error: "Post no encontrado" });
  if (!author || !content)
    return res.status(400).json({ error: "Faltan datos" });

  const newReply: Reply = {
    id: Date.now(),
    author,
    content,
  };
  post.replies.push(newReply);
  res.json(newReply);
});

export default router;
