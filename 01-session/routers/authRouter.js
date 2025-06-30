import express from 'express';
import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/logout', logout);

async function register(req, res) {
    const { username, password } = req.body;

    // ✅ 비밀번호 salt로 만든 다음에 해싱처리 후 DB에 저장
    // 비밀번호는 단방향 해싱
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await prisma.user.create({
        data: { username, password: hashedPassword },
    });

    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
}

async function login(req, res) {
    const { username, password } = req.body;

    // ✅ username 찾기
    const user = await prisma.user.findUnique({
        where: { username },
    });
    if (!user) return res.status(401).json({ error: 'User not found' });

    // ✅ 비밀번호 맞는지 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);
    // console.log(`isPasswordValid: `, isPasswordValid);
    if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid Password' });
    }

    // ✅ session 미들웨어 처리 해뒀기 때문에 req.session 이렇게 사용 가능.
    // 쿠키를 session에 넣기
    req.session.userId = user.id;
    res.status(200).send();
}

async function logout(req, res) {
    // ✅ session 종료
    req.session.destroy();
    res.status(200).send();
}

export default router;
