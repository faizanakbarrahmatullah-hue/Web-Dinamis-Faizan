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
import { clearAuth, getUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [prodiOptions, setProdiOptions] = useState<any[]>([]);
  const [editingMahasiswa, setEditingMahasiswa] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [prodiId, setProdiId] = useState("");

  const [page, setPage] = useState(1);

  const [limit] = useState(10);

  const [totalPage, setTotalPage] = useState(1);
  const user = getUser();

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

  function handleLogout() {
    clearAuth();
    router.replace("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">👨‍🎓</span>
                <h1 className="text-4xl font-bold">Dashboard Mahasiswa</h1>
              </div>
              <p className="text-blue-100">Selamat datang, <span className="font-semibold">{user?.name || "Admin"}</span></p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Search & Filter Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-t-4 border-blue-600">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🔍</span>
            <h2 className="text-lg font-bold text-gray-800">Cari & Filter Data</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">📋 Cari NIM atau Nama</label>
              <input
                type="text"
                placeholder="Ketik NIM atau nama mahasiswa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300"
              />
            </div>

            {/* Filter Prodi */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">🎓 Filter Program Studi</label>
              <select
                value={prodiId}
                onChange={(e) => setProdiId(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300"
              >
                <option value="">Semua Program Studi</option>

                {prodiOptions.map((item: any) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.nama_prodi}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 items-end">
              <button
                onClick={handleSearch}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
              >
                ✅ Cari
              </button>

              <button
                onClick={handleReset}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
              >
                🔄 Reset
              </button>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <MahasiswaForm
          onSubmit={handleSubmit}
          onCancel={handleCancelEdit}
          prodiOptions={prodiOptions}
          initialData={editingMahasiswa}
        />

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 bg-white rounded-lg shadow-lg">
            <div className="inline-block">
              <div className="animate-spin text-4xl mb-4">⏳</div>
              <p className="text-gray-600 font-semibold">Memuat data mahasiswa...</p>
            </div>
          </div>
        )}

        {/* Table Section */}
        {!loading && (
          <>
            <MahasiswaTable
              data={data}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            {/* Pagination */}
            {totalPage > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 bg-white rounded-lg shadow-lg p-6">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
                >
                  ⬅️ Sebelumnya
                </button>

                <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-semibold">
                  <span>📄 Halaman</span>
                  <span className="bg-blue-600 text-white px-3 py-1 rounded">{page}</span>
                  <span>dari</span>
                  <span className="bg-blue-600 text-white px-3 py-1 rounded">{totalPage}</span>
                </div>

                <button
                  disabled={page >= totalPage}
                  onClick={() => setPage(page + 1)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
                >
                  Berikutnya ➡️
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}