"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMahasiswa = exports.updateMahasiswa = exports.createMahasiswa = exports.getMahasiswaById = exports.getAllMahasiswa = void 0;
const database_1 = __importDefault(require("../config/database"));
// ==========================
// GET Semua Mahasiswa
// ==========================
const getAllMahasiswa = async (req, res) => {
    try {
        const search = String(req.query.search || "");
        const prodiId = req.query.prodi_id
            ? Number(req.query.prodi_id)
            : null;
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.max(Number(req.query.limit) || 10, 1);
        const offset = (page - 1) * limit;
        let where = "WHERE 1=1";
        const params = [];
        // Search
        if (search) {
            where += " AND (m.nim LIKE ? OR m.nama LIKE ?)";
            params.push(`%${search}%`, `%${search}%`);
        }
        // Filter Prodi
        if (prodiId) {
            where += " AND m.prodi_id = ?";
            params.push(prodiId);
        }
        // Hitung jumlah data
        const [countRows] = await database_1.default.query(`SELECT COUNT(*) AS total
       FROM mahasiswa m
       ${where}`, params);
        const total = countRows[0].total;
        // Ambil data mahasiswa
        const [rows] = await database_1.default.query(`
      SELECT
          m.id,
          m.nim,
          m.nama,
          m.angkatan,
          m.foto,
          p.id AS prodi_id,
          p.nama_prodi

      FROM mahasiswa m

      JOIN prodi p
      ON m.prodi_id = p.id

      ${where}

      ORDER BY m.id DESC

      LIMIT ? OFFSET ?
      `, [...params, limit, offset]);
        res.status(200).json({
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
            message: "Terjadi kesalahan server",
        });
    }
};
exports.getAllMahasiswa = getAllMahasiswa;
// ==========================
// GET Mahasiswa By ID
// ==========================
const getMahasiswaById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await database_1.default.query(`
      SELECT
          m.*,
          p.nama_prodi

      FROM mahasiswa m

      JOIN prodi p
      ON m.prodi_id = p.id

      WHERE m.id = ?
      `, [id]);
        if (rows.length === 0) {
            return res.status(404).json({
                message: "Mahasiswa tidak ditemukan",
            });
        }
        res.json(rows[0]);
    }
    catch (error) {
        res.status(500).json({
            message: "Terjadi kesalahan server",
        });
    }
};
exports.getMahasiswaById = getMahasiswaById;
// ==========================
// CREATE Mahasiswa
// ==========================
const createMahasiswa = async (req, res) => {
    try {
        const { nim, nama, prodi_id, angkatan, } = req.body;
        const foto = req.file
            ? req.file.filename
            : null;
        if (!nim || !nama || !prodi_id || !angkatan) {
            return res.status(400).json({
                message: "NIM, Nama, Prodi dan Angkatan wajib diisi",
            });
        }
        const [existing] = await database_1.default.query("SELECT id FROM mahasiswa WHERE nim = ?", [nim]);
        if (existing.length > 0) {
            return res.status(400).json({
                message: "NIM sudah digunakan",
            });
        }
        const [result] = await database_1.default.query(`
      INSERT INTO mahasiswa
      (
        nim,
        nama,
        prodi_id,
        angkatan,
        foto
      )

      VALUES (?, ?, ?, ?, ?)
      `, [
            nim,
            nama,
            Number(prodi_id),
            Number(angkatan),
            foto,
        ]);
        res.status(201).json({
            message: "Mahasiswa berhasil ditambahkan",
            id: result.insertId,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Terjadi kesalahan server",
        });
    }
};
exports.createMahasiswa = createMahasiswa;
// ==========================
// UPDATE Mahasiswa
// ==========================
const updateMahasiswa = async (req, res) => {
    try {
        const { id } = req.params;
        const { nim, nama, prodi_id, angkatan, } = req.body;
        const fields = [
            "nim=?",
            "nama=?",
            "prodi_id=?",
            "angkatan=?",
        ];
        const values = [
            nim,
            nama,
            Number(prodi_id),
            Number(angkatan),
        ];
        if (req.file) {
            fields.push("foto=?");
            values.push(req.file.filename);
        }
        values.push(id);
        const [result] = await database_1.default.query(`
      UPDATE mahasiswa

      SET ${fields.join(",")}

      WHERE id=?
      `, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Mahasiswa tidak ditemukan",
            });
        }
        res.json({
            message: "Mahasiswa berhasil diperbarui",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Terjadi kesalahan server",
        });
    }
};
exports.updateMahasiswa = updateMahasiswa;
// ==========================
// DELETE Mahasiswa
// ==========================
const deleteMahasiswa = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await database_1.default.query("DELETE FROM mahasiswa WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Mahasiswa tidak ditemukan",
            });
        }
        res.json({
            message: "Mahasiswa berhasil dihapus",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Terjadi kesalahan server",
        });
    }
};
exports.deleteMahasiswa = deleteMahasiswa;
