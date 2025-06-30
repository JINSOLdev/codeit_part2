import express from 'express';
import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import { generateTokens, verifyRefreshToken } from '../lib/token.js';
import NODE_ENV, { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '../lib/constants.js';

const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/refresh', refreshTokens);
router.post('/auth/logout', logout);
router.get('/auth/me', (req, res) => {
    res.send(req.cookies);
});

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

    // ✅ 토큰 방식의 인증
    // TODO : 토큰 생성
    const { accessToken, refreshToken } = generateTokens(user.id);

    // 토큰에 쿠키 저장
    setTokenCookies(res, accessToken, refreshToken);
    res.status(200).send();
}
// 🍪 refreshTokens
async function refreshTokens(req, res) {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
    if (!refreshToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { userId } = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({ where: { id: userId } }); // isBlock: false 도 추후에 추가 가능
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(userId);

    setTokenCookies(res, accessToken, newRefreshToken);
    res.status(200).send();
}

async function logout(req, res) {
    clearTokenCookies(res);
    res.status(200).send();
}

// TODO :  쿠키에 토큰 저장 > 쿠키에 자동 저장됨 > set-header에 자동으로 토큰을 형식에 맞게 넣어줌
function setTokenCookies(res, accessToken, refreshToken) {
    res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production', // https에서만 동작할 수 있는 옵션
        maxAge: 1 * 60 * 60 * 1000, // 1hour
    });
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
        path: '/auth/refresh',
    });
}

function clearTokenCookies(res) {
    res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
}
export default router;
