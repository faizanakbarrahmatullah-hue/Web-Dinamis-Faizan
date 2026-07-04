"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mahasiswa_data_1 = require("../data/mahasiswa.data");
const router = (0, express_1.Router)();
/*
====================================
READ ALL
GET /api/mahasiswa
====================================
*/
router.get("/", (req, res) => {
    res.json({
        message: "Data mahasiswa berhasil diambil",
        total: mahasiswa_data_1.mahasiswa.length,
        data: mahasiswa_data_1.mahasiswa,
    });
});
/*
====================================
READ DETAIL
GET /api/mahasiswa/:id
====================================
*/
router.get("/:id", (req, res) => {
    const id = Number(req.params.id);
    const data = mahasiswa_data_1.mahasiswa.find((item) => item.id === id);
    if (!data) {
        return res.status(404).json({
            message: "Mahasiswa tidak ditemukan",
        });
    }
    res.json({
        message: "Detail mahasiswa",
        data,
    });
});
/*
====================================
CREATE
POST /api/mahasiswa
====================================
*/
router.post("/", (req, res) => {
    const { nim, nama, prodi, angkatan } = req.body;
    if (!nim || !nama || !prodi || !angkatan) {
        return res.status(400).json({
            message: "Semua data wajib diisi",
        });
    }
    const cekNim = mahasiswa_data_1.mahasiswa.find((item) => item.nim === nim);
    if (cekNim) {
        return res.status(400).json({
            message: "NIM sudah digunakan",
        });
    }
    const mahasiswaBaru = {
        id: mahasiswa_data_1.mahasiswa.length + 1,
        nim,
        nama,
        prodi,
        angkatan: Number(angkatan),
    };
    mahasiswa_data_1.mahasiswa.push(mahasiswaBaru);
    res.status(201).json({
        message: "Mahasiswa berhasil ditambahkan",
        data: mahasiswaBaru,
    });
});
/*
====================================
UPDATE
PUT /api/mahasiswa/:id
====================================
*/
router.put("/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = mahasiswa_data_1.mahasiswa.findIndex((item) => item.id === id);
    if (index === -1) {
        return res.status(404).json({
            message: "Mahasiswa tidak ditemukan",
        });
    }
    const { nim, nama, prodi, angkatan } = req.body;
    mahasiswa_data_1.mahasiswa[index] = {
        id,
        nim,
        nama,
        prodi,
        angkatan: Number(angkatan),
    };
    res.json({
        message: "Data berhasil diperbarui",
        data: mahasiswa_data_1.mahasiswa[index],
    });
});
/*
====================================
DELETE
DELETE /api/mahasiswa/:id
====================================
*/
router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = mahasiswa_data_1.mahasiswa.findIndex((item) => item.id === id);
    if (index === -1) {
        return res.status(404).json({
            message: "Mahasiswa tidak ditemukan",
        });
    }
    const deleted = mahasiswa_data_1.mahasiswa.splice(index, 1);
    res.json({
        message: "Mahasiswa berhasil dihapus",
        data: deleted[0],
    });
});
exports.default = router;
