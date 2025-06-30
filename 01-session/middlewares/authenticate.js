import prisma from '../lib/prisma.js';

async function authenticate(req, res, next) {
    const userId = req.session.userId;
    // ✅ session에 userId가 있는지 확인 -> userId가 없다는 것은 로그인 안했다는 것, 즉 인증된 사용자가 아니라는 의미
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // ✅ 인증된 사용자 있으면 req.user에 담아서 전달
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
