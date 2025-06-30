// 서버 초기화
import express from 'express';
import cookieParser from 'cookie-parser';
import router from './routers/index.js';
import { PORT } from './lib/constants.js';
import passport from './lib/passport/index.js';

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());  // passport 초기화
app.use(router);                // auth, post 라우터 등록

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
