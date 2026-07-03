"use client";

import { useEffect, useState } from "react";
import MahasiswaForm from "@/components/MahasiswaForm";
import MahasiswaTable from "@/components/MahasiswaTable";
import {
  getMahasiswa,
  createMahasiswa,
  deleteMahasiswa,
} from "@/lib/api";

export default function Page() {
  const [data, setData] = useState([]);

  async function load() {
    const res = await getMahasiswa();
    setData(res.data);
  }

  async function handleAdd(form: any) {
    await createMahasiswa({
      ...form,
      angkatan: Number(form.angkatan),
    });
    load();
  }

  async function handleDelete(id: number) {
    await deleteMahasiswa(id);
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h1>CRUD MAHASISWA</h1>

      <MahasiswaForm onSubmit={handleAdd} />
      <MahasiswaTable data={data} onDelete={handleDelete} />
    </div>
  );
}