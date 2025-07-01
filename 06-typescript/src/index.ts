import express from "express";
import todoRoutes from "./routes/todoRoutes";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/todos", todoRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
