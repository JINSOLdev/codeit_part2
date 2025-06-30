import express from 'express';
import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';
import passport from '../lib/passport/index.js';
import { generateTokens } from '../lib/token.js';
import { NODE_ENV, ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '../lib/constants.js';

const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', passport.authenticate('local', { session: false }), login);
router.post('/auth/refresh', passport.authenticate('refresh-token', { session: false }), refreshTokens);
router.post('/auth/logout', logout);

// 구글 로그인 설정 > 넘겨받을 데이터 범위도 설정
router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
// 세션 사용하지 않는다고 설정했으니 다른 무언가로 처리해야 함
router.get('/auth/google/callback', passport.authenticate('google', { session: false }), oauthCallback);

router.get('/auth/kakao', passport.authenticate('kakao', { scope: ['email', 'profile'] }));
router.get('/auth/kakao/callback', passport.authenticate('kakao', { session: false }), oauthCallback);

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
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { accessToken, refreshToken } = generateTokens(req.user.id);
    setTokenCookies(res, accessToken, refreshToken);
    res.status(200).json();
}

function logout(req, res) {
    clearTokenCookies(res);
    res.status(200).send();
}

async function refreshTokens(req, res) {
    const user = req.user;
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id);
    setTokenCookies(res, accessToken, newRefreshToken);
    res.status(200).send();
}

async function oauthCallback(req, res) {
    const user = req.user;
    const { accessToken, refreshToken } = generateTokens(user.id);
    setTokenCookies(res, accessToken, refreshToken);
    res.redirect('/');
}

function setTokenCookies(res, accessToken, refreshToken) {
    res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        maxAge: 1 * 60 * 60 * 1000, // 1 hour
    });
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/auth/refresh',
    });
}

function clearTokenCookies(res) {
    res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
}

export default router;
