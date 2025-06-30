// ✅클라이언트가 보낸 JWT 토큰의 유효성 검증

import { Strategy as JwtStrategy } from 'passport-jwt';
import prisma from '../prisma.js';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
} from '../constants.js';

const accessTokenOptions = {
  jwtFromRequest: (req) => req.cookies[ACCESS_TOKEN_COOKIE_NAME],        // 쿠키에서 토큰 추출
  secretOrKey: JWT_ACCESS_TOKEN_SECRET,
};

const refreshTokenOptions = {
  jwtFromRequest: (req) => req.cookies[REFRESH_TOKEN_COOKIE_NAME],
  secretOrKey: JWT_REFRESH_TOKEN_SECRET,
};

// Access/Refresh Token이 유효한지 확인 후, payload에 들어있는 sub로 DB에서 사용자 찾아 req.user에 저장
async function jwtVerify(payload, done) {
  try {
      const user = await prisma.user.findUnique({
          where: { id: payload.sub },
      });
      done(null, user); // 인증 성공 → req.user = user
  } catch (error) {
    done(error, false);
  }
}

export const accessTokenStrategy = new JwtStrategy(
  accessTokenOptions,
  jwtVerify
);

export const refreshTokenStrategy = new JwtStrategy(
  refreshTokenOptions,
  jwtVerify
);
