import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";

// Import Routes
import mahasiswaRoutes from "./routes/mahasiswa.route";
import mahasiswaDbRoutes from "./routes/mahasiswa-db.route";
import prodiRoutes from "./routes/prodi.route";
import authRoutes from "./routes/auth.route";
import { authenticate } from "./middlewares/auth.middleware";

const app = express();

/* =====================================
   Konfigurasi CORS
===================================== */
app.use(
  cors({
    origin: "http://localhost:3001", // Frontend Next.js
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* =====================================
   Middleware
===================================== */

// Membaca request JSON
app.use(express.json());

// Mengakses folder uploads dari browser
// Contoh:
// http://localhost:3000/uploads/mahasiswa/nama-file.jpg
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

/* =====================================
   Route Testing
===================================== */

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Selamat datang di API CRUD-Faizan",
    author: "Faizan Akbar Rahmatullah",
  });
});

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    service: "CRUD-Faizan API",
  });
});

app.get("/profile", (req: Request, res: Response) => {
  res.status(200).json({
    nama: "Faizan Akbar Rahmatullah",
    jurusan: "Informatika",
  });
});

app.get("/about", (req: Request, res: Response) => {
  res.status(200).json({
    aplikasi: "CRUD-Faizan",
    backend: "Express.js",
    bahasa: "TypeScript",
  });
});

/* =====================================
   API Routes
===================================== */

// Auth
app.use("/api/auth", authRoutes);

// CRUD Mahasiswa (memory / dummy)
app.use("/api/mahasiswa", authenticate, mahasiswaRoutes);

// CRUD Mahasiswa Database MySQL
app.use("/api/db/mahasiswa", authenticate, mahasiswaDbRoutes);

// Master Data Prodi
app.use("/api/prodi", authenticate, prodiRoutes);

/* =====================================
   Route Tidak Ditemukan (404)
===================================== */

app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} tidak ditemukan`,
  });
});

/* =====================================
   Export App
===================================== */

export default app;