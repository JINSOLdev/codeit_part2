import express from "express";
import todoRoutes from "./routes/todoRoutes";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/todos", todoRoutes);

// app.get((req, res, next) => {
//   req.valid = true;
//   next();
// });

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Expreess의 Request에다가 req.valid <== 옵셔널한 boolean
// declare global {
//   namespace Express {
//     interface Request {
//       valid?: boolean; // 옵셔널한 boolean
//     }
//   }
// }
