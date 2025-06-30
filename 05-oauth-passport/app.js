import express from 'express';
import cookieParser from 'cookie-parser';
import router from './routers/index.js';
import { PORT } from './lib/constants.js';
import passport from './lib/passport/index.js';

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());
app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
