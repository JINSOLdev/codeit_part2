import express from 'express';
import session from 'express-session';
import { PORT, SESSION_SECRET } from './lib/constants.js';
import router from './routers/index.js';

const app = express();

app.use(express.json());
// session 처리 작업 다 해줌
// req.session에 어떤 값을 넣으면 set-cookie 만들거나, cookie가 넘어오면 파싱해서 복호화해서 req.session에 넣어주는 역할을 함
app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000,   // 7days
        },
    })
);

app.use(router);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
