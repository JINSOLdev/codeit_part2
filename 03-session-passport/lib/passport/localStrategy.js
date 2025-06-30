import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import prisma from '../prisma.js';

const localStrategy = new LocalStrategy(async function (
  username,
  password,
  done
) {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return done(null, false);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    done(null, false);
  }

  done(null, user);
});

export default localStrategy;
