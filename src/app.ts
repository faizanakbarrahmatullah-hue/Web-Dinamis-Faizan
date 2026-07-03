import express, { Request, Response } from "express";
import cors from "cors";
import mahasiswaRoutes from "./routes/mahasiswa.route";
import mahasiswaDbRoutes from "./routes/mahasiswa-db.route";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({
    status: "success",
    message: "Selamat datang di API CRUD-Faizan",
    author: "Faizan Akbar Rahmatullah",
  });
});

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    service: "CRUD-Faizan API",
  });
});

app.get("/profile", (req: Request, res: Response) => {
  res.json({
    nama: "Faizan Akbar Rahmatullah",
    jurusan: "Informatika",
  });
});

app.get("/about", (req: Request, res: Response) => {
  res.json({
    aplikasi: "CRUD-Faizan",
    backend: "Express.js",
    bahasa: "TypeScript",
  });
});

// Route CRUD Mahasiswa
app.use("/api/mahasiswa", mahasiswaRoutes);
app.use("/api/db/mahasiswa", mahasiswaDbRoutes);

export default app;