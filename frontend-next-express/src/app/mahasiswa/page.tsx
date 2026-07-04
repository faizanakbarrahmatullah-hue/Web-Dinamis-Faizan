"use client";

import { useEffect, useState } from "react";

import MahasiswaForm from "@/components/MahasiswaForm";
import MahasiswaTable from "@/components/MahasiswaTable";

import {
  getMahasiswa,
  createMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
  getProdi,
} from "@/lib/api";

export default function Page() {
  const [data, setData] = useState<any[]>([]);
  const [prodiOptions, setProdiOptions] = useState<any[]>([]);
  const [editingMahasiswa, setEditingMahasiswa] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [prodiId, setProdiId] = useState("");

  const [page, setPage] = useState(1);

  const [limit] = useState(10);

  const [totalPage, setTotalPage] = useState(1);

  // ===============================
  // Load Data Mahasiswa
  // ===============================

  async function load() {
    try {
      setLoading(true);

      const res = await getMahasiswa({
        search,
        prodi_id: prodiId,
        page,
        limit,
      });

      setData(res.data);

      if (res.meta) {
        setTotalPage(res.meta.totalPage);
      }
    } catch (error: any) {
      alert(error?.message ?? "Gagal mengambil data mahasiswa.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // ===============================
  // Load Data Prodi
  // ===============================

  async function loadProdi() {
    try {
      const res = await getProdi();

      setProdiOptions(res.data);
    } catch (error: any) {
      alert(error?.message ?? "Gagal mengambil daftar prodi.");
      console.error(error);
    }
  }

  // ===============================
  // Tambah Mahasiswa
  // ===============================

  async function handleSubmit(form: any) {
    try {
      if (editingMahasiswa) {
        await updateMahasiswa(editingMahasiswa.id, form);
        alert("Data berhasil diubah.");
      } else {
        await createMahasiswa(form);
        alert("Data berhasil ditambahkan.");
      }

      setEditingMahasiswa(null);
      load();
    } catch (error: any) {
      alert(
        error?.message ??
          (editingMahasiswa
            ? "Gagal mengubah data mahasiswa."
            : "Gagal menambahkan data mahasiswa.")
      );
      console.error(error);
    }
  }

  // ===============================
  // Hapus Mahasiswa
  // ===============================

  async function handleDelete(id: number) {
    const confirmDelete = confirm("Apakah Anda yakin ingin menghapus data ini?");

    if (!confirmDelete) return;

    try {
      await deleteMahasiswa(id);
      load();
      alert("Data berhasil dihapus.");
    } catch (error: any) {
      alert(error?.message ?? "Gagal menghapus data mahasiswa.");
      console.error(error);
    }
  }

  function handleEdit(mhs: any) {
    setEditingMahasiswa(mhs);
  }

  function handleCancelEdit() {
    setEditingMahasiswa(null);
  }

  // ===============================
  // Cari
  // ===============================

  function handleSearch() {
    setPage(1);
    load();
  }

  // ===============================
  // Reset
  // ===============================

  function handleReset() {
    setSearch("");
    setProdiId("");
    setPage(1);

    setTimeout(() => {
      load();
    }, 0);
  }

  // ===============================
  // useEffect
  // ===============================

  useEffect(() => {
    load();
  }, [page]);

  useEffect(() => {
    loadProdi();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        CRUD Mahasiswa
      </h1>

      {/* ========================= */}
      {/* Search */}
      {/* ========================= */}

      <div className="flex flex-wrap gap-3 mb-6">

        <input
          type="text"
          placeholder="Cari NIM atau Nama..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-64"
        />

        <select
          value={prodiId}
          onChange={(e) => setProdiId(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Semua Prodi</option>

          {prodiOptions.map((item: any) => (
            <option
              key={item.id}
              value={item.id}
            >
              {item.nama_prodi}
            </option>
          ))}
        </select>

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Cari
        </button>

        <button
          onClick={handleReset}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Reset
        </button>

      </div>

      {/* ========================= */}
      {/* Form */}
      {/* ========================= */}

      <MahasiswaForm
        onSubmit={handleSubmit}
        onCancel={handleCancelEdit}
        prodiOptions={prodiOptions}
        initialData={editingMahasiswa}
      />

      {/* ========================= */}
      {/* Loading */}

      {/* ========================= */}
      {/* Loading */}
      {/* ========================= */}

      {loading ? (
        <p className="mt-6">Memuat data...</p>
      ) : (
        <MahasiswaTable
          data={data}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* ========================= */}
      {/* Pagination */}
      {/* ========================= */}

      <div className="flex justify-center gap-3 mt-6">

        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="border px-4 py-2 rounded disabled:opacity-50"
        >
          Sebelumnya
        </button>

        <span className="px-4 py-2">
          Halaman {page} dari {totalPage}
        </span>

        <button
          disabled={page >= totalPage}
          onClick={() => setPage(page + 1)}
          className="border px-4 py-2 rounded disabled:opacity-50"
        >
          Berikutnya
        </button>

      </div>

    </div>
  );
}