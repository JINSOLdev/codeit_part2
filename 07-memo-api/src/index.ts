import express from "express";
import { validateMemo } from "./middlewares/validator";
import memoRoute from "./routes/memo.Route";

const app = express();
const PORT = 3000;

app.use(express.json());

// Expreess의 Request에다가 req.valid <== 옵셔널한 boolean
// declare global {
//   namespace Express {
//     interface Request {
//       valid?: boolean; // 옵셔널한 boolean
//     }
//   }
// }

// app.get((req, res, next) => {
//   req.valid = true;
//   next();
// });


// memos 라우터 추가
app.use("/memos", memoRoute);
app.use(validateMemo);
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
