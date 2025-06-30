// 인증 전략 등록
import passport from 'passport';
import prisma from '../prisma.js';
import { localStrategy } from './localStrategy.js';
import { accessTokenStrategy, refreshTokenStrategy } from './jwtStrategy.js';

passport.use('local', localStrategy);   // 로그인용
passport.use('access-token', accessTokenStrategy);  // 인증용
passport.use('refresh-token', refreshTokenStrategy);// 토큰 재발급용

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  const user = await prisma.user.findUnique({ where: { id } });
  done(null, user);
});

export default passport;
