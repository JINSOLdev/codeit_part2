import prisma from '../lib/prisma.js';
import { ACCESS_TOKEN_COOKIE_NAME } from '../lib/constants.js';
import { verifyAccessToken } from '../lib/token.js';

async function authenticate(req, res, next) {
    // ✅ accessToken 안에 있는 userId를 추출
    const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];
    if (!accessToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // ❓accessToken을 받아왔다. 이제 토큰을 가지고 뭘 해야할까?
    // ❗토큰에 들어있는 데이터를 추출하자.

    try {
        const { userId } = verifyAccessToken(accessToken);
        const user = await prisma.user.findUniqueOrThrow({
            where: { id: userId },
        });
        req.user = user; // DB에서 가져온 정보를 넣어주기
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    next();
}

export default authenticate;
