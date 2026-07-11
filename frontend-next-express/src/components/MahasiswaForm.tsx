"use client";

import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/lib/api";

export default function MahasiswaForm({
  onSubmit,
  onCancel,
  prodiOptions,
  initialData,
}: any) {
  const [form, setForm] = useState({
    nim: "",
    nama: "",
    prodi_id: "",
    angkatan: "",
  });

  const [foto, setFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        nim: initialData.nim || "",
        nama: initialData.nama || "",
        prodi_id: initialData.prodi_id ? String(initialData.prodi_id) : "",
        angkatan: initialData.angkatan ? String(initialData.angkatan) : "",
      });
      setFoto(null);
      setPreview("");
      setIsExpanded(true);
    } else {
      setForm({
        nim: "",
        nama: "",
        prodi_id: "",
        angkatan: "",
      });
      setFoto(null);
      setPreview("");
    }
  }, [initialData]);

  const backendHost = BACKEND_URL?.replace(/\/+$/, "") ?? "http://localhost:3000";
  const existingPhotoUrl =
    initialData?.foto && !preview
      ? `${backendHost}/uploads/mahasiswa/${initialData.foto}`
      : "";

  function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    setFoto(file);
    setPreview(URL.createObjectURL(file));
  }

  // ===========================
  // Submit Form
  // ===========================
  async function handleSubmit() {
    if (
      !form.nim ||
      !form.nama ||
      !form.prodi_id ||
      !form.angkatan
    ) {
      alert("Semua data wajib diisi.");
      return;
    }

    const formData = new FormData();

    formData.append("nim", form.nim);
    formData.append("nama", form.nama);
    formData.append("prodi_id", form.prodi_id);
    formData.append("angkatan", form.angkatan);

    if (foto) {
      formData.append("foto", foto);
    }

    await onSubmit(formData);

    setForm({
      nim: "",
      nama: "",
      prodi_id: "",
      angkatan: "",
    });

    setFoto(null);
    setPreview("");
  }

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-4 rounded-lg font-semibold flex items-center justify-between transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        <span className="flex items-center gap-2">
          <span className="text-xl">{initialData ? "✏️ Ubah" : "➕ Tambah"} Mahasiswa</span>
        </span>
        <span className={`transform transition-transform ${isExpanded ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {isExpanded && (
        <div className="bg-white rounded-b-lg shadow-lg p-6 border-t-2 border-blue-500 mt-0 animate-in">
          <div className="grid md:grid-cols-2 gap-5">
            {/* NIM */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📋 NIM
              </label>
              <input
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                placeholder="2023000001"
                value={form.nim}
                onChange={(e) =>
                  setForm({
                    ...form,
                    nim: e.target.value,
                  })
                }
              />
            </div>

            {/* Nama */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                👤 Nama Lengkap
              </label>
              <input
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                placeholder="Nama Mahasiswa"
                value={form.nama}
                onChange={(e) =>
                  setForm({
                    ...form,
                    nama: e.target.value,
                  })
                }
              />
            </div>

            {/* Program Studi */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🎓 Program Studi
              </label>
              <select
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                value={form.prodi_id}
                onChange={(e) =>
                  setForm({
                    ...form,
                    prodi_id: e.target.value,
                  })
                }
              >
                <option value="">
                  Pilih Program Studi
                </option>

                {prodiOptions?.map((prodi: any) => (
                  <option
                    key={prodi.id}
                    value={prodi.id}
                  >
                    {prodi.nama_prodi}
                  </option>
                ))}
              </select>
            </div>

            {/* Angkatan */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📅 Angkatan
              </label>
              <input
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                type="number"
                placeholder="2023"
                value={form.angkatan}
                onChange={(e) =>
                  setForm({
                    ...form,
                    angkatan: e.target.value,
                  })
                }
              />
            </div>

            {/* Upload Foto */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📸 Foto Mahasiswa
              </label>
              <div className="flex gap-3 items-center">
                <label className="flex-1 px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFotoChange}
                    className="hidden"
                  />
                  <div className="text-gray-600 text-sm">
                    {foto ? `📁 ${foto.name}` : "Klik atau drag foto"}
                  </div>
                </label>
              </div>
            </div>

            {/* Preview Foto */}
            {(preview || existingPhotoUrl) && (
              <div className="md:col-span-2">
                <p className="text-sm font-semibold text-gray-700 mb-3">👀 Preview Foto</p>
                <div className="flex justify-center">
                  <img
                    src={preview || existingPhotoUrl}
                    alt="Preview"
                    className="rounded-lg border-2 border-gray-200 object-cover shadow-md"
                    style={{ width: "150px", height: "150px" }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tombol */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
            >
              {initialData ? "✅ Update" : "➕ Tambah"}
            </button>

            <button
              onClick={() => {
                setForm({
                  nim: "",
                  nama: "",
                  prodi_id: "",
                  angkatan: "",
                });

                setFoto(null);
                setPreview("");
                onCancel?.();
              }}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
            >
              {initialData ? "❌ Batal" : "🔄 Reset"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}