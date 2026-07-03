const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Mengambil seluruh data mahasiswa
 */
export async function getMahasiswa() {
  const response = await fetch(`${BASE_URL}/mahasiswa`);

  if (!response.ok) {
    throw new Error("Gagal mengambil data mahasiswa.");
  }

  return response.json();
}

/**
 * Menambahkan data mahasiswa baru
 */
export async function createMahasiswa(data: {
  nim: string;
  nama: string;
  prodi: string;
  angkatan: number;
}) {
  const response = await fetch(`${BASE_URL}/mahasiswa`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Gagal menambahkan data mahasiswa.");
  }

  return response.json();
}

/**
 * Mengubah data mahasiswa
 */
export async function updateMahasiswa(
  id: number,
  data: {
    nim: string;
    nama: string;
    prodi: string;
    angkatan: number;
  }
) {
  const response = await fetch(`${BASE_URL}/mahasiswa/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Gagal mengubah data mahasiswa.");
  }

  return response.json();
}

/**
 * Menghapus data mahasiswa
 */
export async function deleteMahasiswa(id: number) {
  const response = await fetch(`${BASE_URL}/mahasiswa/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Gagal menghapus data mahasiswa.");
  }

  return response.json();
}