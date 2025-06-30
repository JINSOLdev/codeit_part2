// 로그인 처리
import express from 'express';
import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';
import passport from '../lib/passport/index.js';
import { generateTokens } from '../lib/token.js';
import {
  NODE_ENV,
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from '../lib/constants.js';

const router = express.Router();

router.post('/auth/register', register);
// localStrategy에서 DB에 username/password 확인 후 req.user에 사용자 정보 넣음
router.post('/auth/login', passport.authenticate('local', { session: false }), login); 
// 토큰 재발급. Refresh Token 확인 후 새 Access/Refresh 토큰 발급 > 쿠키에 다시 담아 클라이언트로 전달
router.post('/auth/refresh', passport.authenticate('refresh-token', { session: false }), refreshTokens);
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
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    // login 함수에서 JWT 토큰 2개 생성 -> 쿠키에 담아 응답
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
  const { accessToken, refreshToken: newRefreshToken } = generateTokens(
    user.id
  );
  setTokenCookies(res, accessToken, newRefreshToken);
  res.status(200).send();
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
