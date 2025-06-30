import express from 'express';
import cookieParser from 'cookie-parser';
import { PORT } from './lib/constants.js';
import router from './routers/index.js';

const app = express();

app.use(express.json());

// 🍪 cookie 사용하기
app.use(cookieParser());
app.use(router);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
