import express from 'express';
import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';
import passport from '../lib/passport/index.js';

const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', passport.authenticate('local'), login);  // passport 디렉토리의 localStrategy.js
router.post('/auth/logout', logout);

async function register(req, res) {
  const { username, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await prisma.user.create({
    data: { username, password: hashedPassword },
  });

  const { password: _, ...userWithoutPassword } = user;
  res.status(201).json(userWithoutPassword);
}

function login(req, res) {
  res.status(200).send();
}

function logout(req, res) {
  req.logout((err) => {
    if (err) {
      next(err);
      return;
    }

    res.status(200).send();
  });
}

export default router;
