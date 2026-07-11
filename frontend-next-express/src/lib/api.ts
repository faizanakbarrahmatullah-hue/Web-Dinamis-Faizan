import { getToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const backendUrl = BACKEND_URL?.replace(/\/+$/, "") ?? "http://localhost:3000";
const apiUrl = API_URL?.replace(/\/+$/, "") ?? `${backendUrl}/api/db`;
const BASE_URL = apiUrl.match(/\/api\/?$/)
  ? `${apiUrl.replace(/\/+$/, "")}/db`
  : apiUrl.includes("/api/db")
  ? apiUrl
  : apiUrl.includes("/api")
  ? apiUrl
  : `${apiUrl}/api/db`;
const PRODI_URL = `${backendUrl}/api/prodi`;

function getAuthHeaders(isForm = false) {
  const token = getToken();
  const headers: Record<string, string> = {};

  if (!isForm) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}


async function parseErrorMessage(response: Response, defaultMessage: string) {
  try {
    const data = await response.json();
    return data?.message ?? defaultMessage;
  } catch {
    return defaultMessage;
  }
}

/**
 * Mengambil seluruh data mahasiswa
 */
export async function getMahasiswa(params?: {
  search?: string;
  prodi_id?: string | number;
  page?: number;
  limit?: number;
}) {
  const url = new URL(`${BASE_URL}/mahasiswa`, window.location.origin);

  if (params) {
    if (params.search) url.searchParams.set("search", params.search);
    if (params.prodi_id) url.searchParams.set("prodi_id", String(params.prodi_id));
    if (params.page) url.searchParams.set("page", String(params.page));
    if (params.limit) url.searchParams.set("limit", String(params.limit));
  }

  const response = await fetch(url.toString(), {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, "Gagal mengambil data mahasiswa."));
  }

  return response.json();
}

/**
 * Mengambil seluruh data prodi
 */
export async function getProdi() {
  const response = await fetch(PRODI_URL, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, "Gagal mengambil data prodi."));
  }

  return response.json();
}

export { API_URL, BACKEND_URL };

/**
 * Menambahkan data mahasiswa baru
 */
function isFormData(value: unknown): value is FormData {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as FormData).constructor === FormData
  );
}

export async function createMahasiswa(
  data:
    | FormData
    | {
        nim: string;
        nama: string;
        prodi_id: number;
        angkatan: number;
      }
) {
  const isForm = isFormData(data);
  const body = isForm ? data : JSON.stringify(data);

  const response = await fetch(`${BASE_URL}/mahasiswa`, {
    method: "POST",
    headers: isForm
      ? getAuthHeaders(true)
      : getAuthHeaders(false),
    body,
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, "Gagal menambahkan data mahasiswa."));
  }

  return response.json();
}

/**
 * Mengubah data mahasiswa
 */
export async function updateMahasiswa(
  id: number,
  data:
    | FormData
    | {
        nim: string;
        nama: string;
        prodi_id: number;
        angkatan: number;
      }
) {
  const isForm = isFormData(data);
  const body = isForm ? data : JSON.stringify(data);

  const response = await fetch(`${BASE_URL}/mahasiswa/${id}`, {
    method: "PUT",
    headers: isForm
      ? getAuthHeaders(true)
      : getAuthHeaders(false),
    body,
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
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Gagal menghapus data mahasiswa.");
  }

  return response.json();
}