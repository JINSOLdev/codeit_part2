import passport from 'passport';
import prisma from '../prisma.js';
import localStrategy from './localStrategy.js';
passport.use(localStrategy);

// postRouter를 위해서 만들어짐
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  const user = await prisma.user.findUnique({ where: { id } });
  done(null, user);
});

export default passport;
