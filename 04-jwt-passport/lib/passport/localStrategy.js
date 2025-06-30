// ✅사용자의 username/password 를 DB에서 직접 확인

import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import prisma from '../prisma.js';

export const localStrategy = new LocalStrategy(async function (username, password, done) {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
        return done(null, false);
    }

    // bcrypt로 비밀번호 비교
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return done(null, false);
    }

    // 일치하면 아래 코드 실행 -> passport가 req.user = user 로 넣어줌
    done(null, user);
});
