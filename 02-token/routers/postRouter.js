import express from 'express';
import prisma from '../lib/prisma.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

router.get('/posts', authenticate, createPost);
router.post('/posts', getPosts);
router.put('/posts', updatePost);
router.delete('/posts', deletePost);

// ✅ authenticate 미들웨어 사용했기 때문에 아래의 코드에서 user.id 사용 가능
async function createPost(req, res) {
    const { content } = req.body;
    // 사용할 req.user
    const user = req.user;

    const post = await prisma.post.create({
        data: { content, authorId: user.id },
    });

    res.status(201).json(post);
}

async function getPosts(req, res) {
    const posts = await prisma.post.findMany();
    res.json(posts);
}

async function updatePost(req, res) {
    const { id } = req.params;
    const { content } = req.body;

    const post = await prisma.post.findUnique({ where: { id: Number(id) } });
    if (!post) return res.status(404).json({ error: 'Post not found' });

    // 📍 미들웨어에서 처리해준 데이터를 사용하는 이 부분이 중요함!
    if (post.authorId !== req.user.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const updatedPost = await prisma.post.update({
        where: { id: Number(id) },
        data: { content },
    });

    res.json(updatedPost);
}

async function deletePost(req, res) {
    const { id } = req.params;

    const post = await prisma.post.findUnique({ where: { id: Number(id) } });
    if (!post) return res.status(404).json({ error: 'Post not found' });

    // 📍 미들웨어에서 처리해준 데이터를 사용하는 이 부분이 중요함!
    if (post.authorId !== req.user.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    await prisma.post.delete({
        where: { id: Number(id) },
    });

    res.status(204).send();
}

export default router;
