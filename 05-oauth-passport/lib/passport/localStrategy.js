import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import prisma from '../prisma.js';
import { MAX_LOGIN_ATTEMPTS } from '../constants.js';

export const localStrategy = new LocalStrategy(async (username, password, done) => {
    const user = await prisma.user.findUnique({
        where: {
            username,
            loginAttempts: { lt: MAX_LOGIN_ATTEMPTS },
        },
    });
    if (!user) return done(null, false);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        await prisma.user.update({
            where: { id: user.id },
            data: { loginAttempts: user.loginAttempts + 1 },   // 비밀번호 틀릴 경우 로그인 횟수 증가 > 로그인 횟수 5번 이상 틀리면 로그인 안되게 함
        });
        return done(null, false);
    }

    if (user.loginAttempts > 0) {
        await prisma.user.update({
            where: { id: user.id },
            data: { loginAttempts: 0 },  // 실패 횟수 누적되어 있는데 비밀번호를 맞췄을 경우, 로그인 횟수 초기화
        });
    }

    done(null, user);
});
