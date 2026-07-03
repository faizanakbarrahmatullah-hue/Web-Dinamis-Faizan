"use client";

import { useState } from "react";

export default function MahasiswaForm({ onSubmit }: any) {
  const [form, setForm] = useState({
    nim: "",
    nama: "",
    prodi: "",
    angkatan: "",
  });

  return (
    <div>
      <input placeholder="NIM"
        onChange={(e) => setForm({ ...form, nim: e.target.value })}
      />
      <input placeholder="Nama"
        onChange={(e) => setForm({ ...form, nama: e.target.value })}
      />
      <input placeholder="Prodi"
        onChange={(e) => setForm({ ...form, prodi: e.target.value })}
      />
      <input placeholder="Angkatan"
        onChange={(e) => setForm({ ...form, angkatan: e.target.value })}
      />

      <button onClick={() => onSubmit(form)}>
        Tambah
      </button>
    </div>
  );
}