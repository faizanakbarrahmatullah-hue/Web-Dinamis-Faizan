import { Router, Request, Response } from "express";
import { mahasiswa, Mahasiswa } from "../data/mahasiswa.data";

const router = Router();

/*
====================================
READ ALL
GET /api/mahasiswa
====================================
*/

router.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Data mahasiswa berhasil diambil",
    total: mahasiswa.length,
    data: mahasiswa,
  });
});

/*
====================================
READ DETAIL
GET /api/mahasiswa/:id
====================================
*/

router.get("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const data = mahasiswa.find((item) => item.id === id);

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

router.post("/", (req: Request, res: Response) => {
  const { nim, nama, prodi, angkatan } = req.body;

  if (!nim || !nama || !prodi || !angkatan) {
    return res.status(400).json({
      message: "Semua data wajib diisi",
    });
  }

  const cekNim = mahasiswa.find((item) => item.nim === nim);

  if (cekNim) {
    return res.status(400).json({
      message: "NIM sudah digunakan",
    });
  }

  const mahasiswaBaru: Mahasiswa = {
    id: mahasiswa.length + 1,
    nim,
    nama,
    prodi,
    angkatan: Number(angkatan),
  };

  mahasiswa.push(mahasiswaBaru);

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

router.put("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const index = mahasiswa.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Mahasiswa tidak ditemukan",
    });
  }

  const { nim, nama, prodi, angkatan } = req.body;

  mahasiswa[index] = {
    id,
    nim,
    nama,
    prodi,
    angkatan: Number(angkatan),
  };

  res.json({
    message: "Data berhasil diperbarui",
    data: mahasiswa[index],
  });
});

/*
====================================
DELETE
DELETE /api/mahasiswa/:id
====================================
*/

router.delete("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const index = mahasiswa.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Mahasiswa tidak ditemukan",
    });
  }

  const deleted = mahasiswa.splice(index, 1);

  res.json({
    message: "Mahasiswa berhasil dihapus",
    data: deleted[0],
  });
});

export default router;