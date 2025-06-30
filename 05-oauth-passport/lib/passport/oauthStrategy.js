import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import pkg from 'passport-kakao'; // ✅ CommonJS import 대응
const KakaoStrategy = pkg.Strategy; // ✅ 여기서만 구조 분해

import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, KAKAO_CLIENT_ID, KAKAO_CLIENT_SECRET } from '../constants.js';

import prisma from '../prisma.js';

export const googleStrategy = new GoogleStrategy(
    {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    async function (accessToken, refreshToken, profile, cb) {
        const user = await prisma.user.findUnique({
            where: { provider: 'google', providerId: profile.id },
        });
        if (user) return cb(null, user);

        const newUser = await prisma.user.create({
            data: {
                provider: 'google',
                providerId: profile.id,
                username: profile.id,
                password: null,
            },
        });

        return cb(null, newUser);
    }
);

//🚨 계속 400 에러 남 > 왜 자꾸 email을 받아오는거지....
export const kakaoStrategy = new KakaoStrategy(
    {
        clientID: KAKAO_CLIENT_ID,
        clientSecret: KAKAO_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/kakao/callback',
        scope: ['profile_nickname'],
        passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
        console.log('🔥 카카오 로그인 프로필:', profile);

        const kakaoId = profile.id;
        const nickname = profile._json?.properties?.nickname ?? 'NoName';

        try {
            const user = await prisma.user.findUnique({
                where: { provider: 'kakao', providerId: kakaoId },
            });

            if (user) return done(null, user);

            const newUser = await prisma.user.create({
                data: {
                    provider: 'kakao',
                    providerId: kakaoId,
                    username: nickname,
                    password: null,
                },
            });

            return done(null, newUser);
        } catch (err) {
            return done(err);
        }
    }
);

