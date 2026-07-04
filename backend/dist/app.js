"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
// Import Routes
const mahasiswa_route_1 = __importDefault(require("./routes/mahasiswa.route"));
const mahasiswa_db_route_1 = __importDefault(require("./routes/mahasiswa-db.route"));
const prodi_route_1 = __importDefault(require("./routes/prodi.route"));
const app = (0, express_1.default)();
/* =====================================
   Konfigurasi CORS
===================================== */
app.use((0, cors_1.default)({
    origin: "http://localhost:3001", // Frontend Next.js
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
/* =====================================
   Middleware
===================================== */
// Membaca request JSON
app.use(express_1.default.json());
// Mengakses folder uploads dari browser
// Contoh:
// http://localhost:3000/uploads/mahasiswa/nama-file.jpg
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
/* =====================================
   Route Testing
===================================== */
app.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Selamat datang di API CRUD-Faizan",
        author: "Faizan Akbar Rahmatullah",
    });
});
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        service: "CRUD-Faizan API",
    });
});
app.get("/profile", (req, res) => {
    res.status(200).json({
        nama: "Faizan Akbar Rahmatullah",
        jurusan: "Informatika",
    });
});
app.get("/about", (req, res) => {
    res.status(200).json({
        aplikasi: "CRUD-Faizan",
        backend: "Express.js",
        bahasa: "TypeScript",
    });
});
/* =====================================
   API Routes
===================================== */
// CRUD Mahasiswa (memory / dummy)
app.use("/api/mahasiswa", mahasiswa_route_1.default);
// CRUD Mahasiswa Database MySQL
app.use("/api/db/mahasiswa", mahasiswa_db_route_1.default);
// Master Data Prodi
app.use("/api/prodi", prodi_route_1.default);
/* =====================================
   Route Tidak Ditemukan (404)
===================================== */
app.use((req, res) => {
    res.status(404).json({
        status: "error",
        message: `Route ${req.originalUrl} tidak ditemukan`,
    });
});
/* =====================================
   Export App
===================================== */
exports.default = app;
