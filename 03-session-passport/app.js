import express from 'express';
import session from 'express-session';
import router from './routers/index.js';
import { PORT, SESSION_SECRET } from './lib/constants.js';
import passport from './lib/passport/index.js';

const app = express();

app.use(express.json());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());  // passport 활성화
app.use(passport.session());  // session 사용할 것을 예고 
app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
