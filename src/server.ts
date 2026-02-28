import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connection } from "./database";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  return res.status(200).json({ message: "API funcionando 🚀" });
});

connection.getConnection()
  .then(() => {
    console.log("Banco conectado com sucesso ✅");
  })
  .catch((error) => {
    console.error("Erro ao conectar no banco ❌", error);
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});