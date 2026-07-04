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
    <div className="bg-white shadow rounded-lg p-6 mb-6">

      <h2 className="text-xl font-semibold mb-4">
        {initialData ? "Ubah Mahasiswa" : "Tambah Mahasiswa"}
      </h2>

      <div className="grid md:grid-cols-2 gap-4">

        {/* NIM */}
        <input
          className="border rounded px-3 py-2"
          placeholder="NIM"
          value={form.nim}
          onChange={(e) =>
            setForm({
              ...form,
              nim: e.target.value,
            })
          }
        />

        {/* Nama */}
        <input
          className="border rounded px-3 py-2"
          placeholder="Nama"
          value={form.nama}
          onChange={(e) =>
            setForm({
              ...form,
              nama: e.target.value,
            })
          }
        />

        {/* Program Studi */}
        <select
          className="border rounded px-3 py-2"
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

        {/* Angkatan */}
        <input
          className="border rounded px-3 py-2"
          type="number"
          placeholder="Angkatan"
          value={form.angkatan}
          onChange={(e) =>
            setForm({
              ...form,
              angkatan: e.target.value,
            })
          }
        />

        {/* Upload Foto */}
        <div className="md:col-span-2">
          <label className="block mb-2 font-medium">
            Foto Mahasiswa
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleFotoChange}
            className="border rounded p-2 w-full"
          />
        </div>

        {/* Preview Foto */}
        {(preview || existingPhotoUrl) && (
          <div className="md:col-span-2">

            <p className="mb-2 font-medium">
              Preview Foto
            </p>

            <img
              src={preview || existingPhotoUrl}
              alt="Preview"
              className="rounded border object-cover"
              style={{ width: "3cm", height: "3cm" }}
            />

          </div>
        )}

      </div>

      {/* Tombol */}
      <div className="mt-6 flex gap-3">

        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
        >
          {initialData ? "Update" : "Tambah"}
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
          className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded"
        >
          {initialData ? "Batal" : "Reset"}
        </button>

      </div>

    </div>
  );
}