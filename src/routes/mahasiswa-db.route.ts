import { Router, Request, Response } from "express";
import db from "../config/database";

const router = Router();

/*
====================================
GET Semua Mahasiswa
GET /api/db/mahasiswa
====================================
*/
router.get("/", async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM mahasiswa ORDER BY id ASC"
    );

    res.json({
      status: "success",
      message: "Data mahasiswa berhasil diambil",
      data: rows,
    });
  } catch (error) {
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
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [rows]: any = await db.execute(
      "SELECT * FROM mahasiswa WHERE id = ?",
      [id]
    );

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
  } catch (error) {
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
router.post("/", async (req: Request, res: Response) => {
  try {
    const { nim, nama, prodi, angkatan } = req.body;

    if (!nim || !nama || !prodi || !angkatan) {
      return res.status(400).json({
        status: "error",
        message: "Semua data wajib diisi",
      });
    }

    const [cekNim]: any = await db.execute(
      "SELECT id FROM mahasiswa WHERE nim = ?",
      [nim]
    );

    if (cekNim.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "NIM sudah digunakan",
      });
    }

    const [result]: any = await db.execute(
      "INSERT INTO mahasiswa (nim, nama, prodi, angkatan) VALUES (?, ?, ?, ?)",
      [nim, nama, prodi, angkatan]
    );

    res.status(201).json({
      status: "success",
      message: "Mahasiswa berhasil ditambahkan",
      data: {
        id: result.insertId,
        nim,
        nama,
        prodi,
        angkatan,
      },
    });
  } catch (error) {
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
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nim, nama, prodi, angkatan } = req.body;

    if (!nim || !nama || !prodi || !angkatan) {
      return res.status(400).json({
        status: "error",
        message: "Semua data wajib diisi",
      });
    }

    const [cekData]: any = await db.execute(
      "SELECT * FROM mahasiswa WHERE id = ?",
      [id]
    );

    if (cekData.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Mahasiswa tidak ditemukan",
      });
    }

    await db.execute(
      "UPDATE mahasiswa SET nim = ?, nama = ?, prodi = ?, angkatan = ? WHERE id = ?",
      [nim, nama, prodi, angkatan, id]
    );

    res.json({
      status: "success",
      message: "Data mahasiswa berhasil diperbarui",
      data: {
        id,
        nim,
        nama,
        prodi,
        angkatan,
      },
    });
  } catch (error: any) {
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
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [cekData]: any = await db.execute(
      "SELECT * FROM mahasiswa WHERE id = ?",
      [id]
    );

    if (cekData.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Mahasiswa tidak ditemukan",
      });
    }

    await db.execute(
      "DELETE FROM mahasiswa WHERE id = ?",
      [id]
    );

    res.json({
      status: "success",
      message: "Mahasiswa berhasil dihapus",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan server",
    });
  }
});

export default router;