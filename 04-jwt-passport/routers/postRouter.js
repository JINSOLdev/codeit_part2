// 게시글 API 보호
import express from 'express';
import prisma from '../lib/prisma.js';
import passport from '../lib/passport/index.js';

const router = express.Router();

// 토큰이 유효하지 않으면 401 Unauthorized 반환
// 유효하면 req.user.id로 게시글 작성 가능
router.post('/posts', passport.authenticate('access-token', { session: false }), createPost);
router.get('/posts', getPosts);
router.put('/posts/:id', passport.authenticate('access-token', { session: false }), updatePost);
router.delete('/posts/:id', passport.authenticate('access-token', { session: false }), deletePost);

async function createPost(req, res) {
  const { content } = req.body;
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
  const user = req.user;

  const post = await prisma.post.findUnique({ where: { id: Number(id) } });
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  // if (post.authorId !== req.user.id) {  // req.user안에 DB에 있는 user 정보를 넣는 작업을 했음 
  if (post.authorId !== user.id) {
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
  const user = req.user;

  const post = await prisma.post.findUnique({ where: { id: Number(id) } });
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  if (post.authorId !== user.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await prisma.post.delete({
    where: { id: Number(id) },
  });

  res.status(204).send();
}

export default router;
