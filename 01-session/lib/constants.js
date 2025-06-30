import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'my-secret-key';

export { PORT, SESSION_SECRET };
