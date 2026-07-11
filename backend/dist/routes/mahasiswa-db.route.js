"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../config/database"));
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = (0, express_1.Router)();
/*
====================================
GET Semua Mahasiswa
GET /api/db/mahasiswa
====================================
*/
router.get("/", async (req, res) => {
    try {
        const search = String(req.query.search || "");
        const prodiId = req.query.prodi_id ? Number(req.query.prodi_id) : null;
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.max(Number(req.query.limit) || 10, 1);
        const offset = (page - 1) * limit;
        let where = "WHERE 1=1";
        const params = [];
        if (search) {
            where += " AND (m.nim LIKE ? OR m.nama LIKE ?)";
            params.push(`%${search}%`, `%${search}%`);
        }
        if (prodiId) {
            where += " AND m.prodi_id = ?";
            params.push(prodiId);
        }
        const [countRows] = await database_1.default.query(`SELECT COUNT(*) AS total FROM mahasiswa m ${where}`, params);
        const total = countRows[0]?.total ?? 0;
        const [rows] = await database_1.default.query(`
      SELECT
        m.id,
        m.nim,
        m.nama,
        m.angkatan,
        m.created_at,
        m.foto,
        m.prodi_id,
        p.nama_prodi AS prodi
      FROM mahasiswa m
      LEFT JOIN prodi p ON m.prodi_id = p.id
      ${where}
      ORDER BY m.id ASC
      LIMIT ? OFFSET ?
      `, [...params, limit, offset]);
        res.json({
            status: "success",
            message: "Data mahasiswa berhasil diambil",
            meta: {
                page,
                limit,
                total,
                totalPage: Math.ceil(total / limit),
            },
            data: rows,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Terjadi kesalahan server",
        });
    }
});
/*
====================================
GET Detail Mahasiswa
GET /api/db/mahasiswa/:id
====================================
*/
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await database_1.default.execute(`
      SELECT
        m.*, 
        p.nama_prodi AS prodi
      FROM mahasiswa m
      LEFT JOIN prodi p ON m.prodi_id = p.id
      WHERE m.id = ?
      `, [id]);
        if (rows.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "Mahasiswa tidak ditemukan",
            });
        }
        res.json({
            status: "success",
            message: "Detail mahasiswa berhasil diambil",
            data: rows[0],
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Terjadi kesalahan server",
        });
    }
});
/*
====================================
POST Tambah Mahasiswa
POST /api/db/mahasiswa
====================================
*/
router.post("/", upload_middleware_1.uploadFotoMahasiswa.single("foto"), async (req, res) => {
    try {
        const { nim, nama, prodi_id, angkatan } = req.body;
        const foto = req.file ? req.file.filename : null;
        if (!nim || !nama || !prodi_id || !angkatan) {
            return res.status(400).json({
                status: "error",
                message: "Semua data wajib diisi",
            });
        }
        const [cekNim] = await database_1.default.execute("SELECT id FROM mahasiswa WHERE nim = ?", [nim]);
        if (cekNim.length > 0) {
            return res.status(400).json({
                status: "error",
                message: "NIM sudah digunakan",
            });
        }
        const [result] = await database_1.default.execute("INSERT INTO mahasiswa (nim, nama, prodi_id, angkatan, foto) VALUES (?, ?, ?, ?, ?)", [nim, nama, prodi_id, angkatan, foto]);
        res.status(201).json({
            status: "success",
            message: "Mahasiswa berhasil ditambahkan",
            data: {
                id: result.insertId,
                nim,
                nama,
                prodi_id,
                angkatan,
                foto,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Terjadi kesalahan server",
        });
    }
});
/*
====================================
PUT Update Mahasiswa
PUT /api/db/mahasiswa/:id
====================================
*/
router.put("/:id", upload_middleware_1.uploadFotoMahasiswa.single("foto"), async (req, res) => {
    try {
        const { id } = req.params;
        const { nim, nama, prodi_id, angkatan } = req.body;
        const foto = req.file ? req.file.filename : null;
        if (!nim || !nama || !prodi_id || !angkatan) {
            return res.status(400).json({
                status: "error",
                message: "Semua data wajib diisi",
            });
        }
        const [cekData] = await database_1.default.execute("SELECT * FROM mahasiswa WHERE id = ?", [id]);
        if (cekData.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "Mahasiswa tidak ditemukan",
            });
        }
        const fields = ["nim = ?", "nama = ?", "prodi_id = ?", "angkatan = ?"];
        const values = [nim, nama, prodi_id, angkatan];
        if (foto) {
            fields.push("foto = ?");
            values.push(foto);
        }
        values.push(id);
        await database_1.default.execute(`UPDATE mahasiswa SET ${fields.join(", ")} WHERE id = ?`, values);
        res.json({
            status: "success",
            message: "Data mahasiswa berhasil diperbarui",
            data: {
                id,
                nim,
                nama,
                prodi_id,
                angkatan,
            },
        });
    }
    catch (error) {
        console.error(error);
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
                status: "error",
                message: "NIM sudah digunakan oleh mahasiswa lain",
            });
        }
        res.status(500).json({
            status: "error",
            message: "Terjadi kesalahan server",
        });
    }
});
/*
====================================
DELETE Mahasiswa
DELETE /api/db/mahasiswa/:id
====================================
*/
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [cekData] = await database_1.default.execute("SELECT * FROM mahasiswa WHERE id = ?", [id]);
        if (cekData.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "Mahasiswa tidak ditemukan",
            });
        }
        await database_1.default.execute("DELETE FROM mahasiswa WHERE id = ?", [id]);
        res.json({
            status: "success",
            message: "Mahasiswa berhasil dihapus",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Terjadi kesalahan server",
        });
    }
});
exports.default = router;
