"use client";

import { BACKEND_URL } from "@/lib/api";

export default function MahasiswaTable({ data, onEdit, onDelete }: any) {
  const backendHost = BACKEND_URL?.replace(/\/+$/, "") ?? "http://localhost:3000";

  return (
    <div className="mt-6 overflow-x-auto rounded-lg shadow">

      <table className="min-w-full border border-gray-300 bg-white">

        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="border px-4 py-2">No</th>
            <th className="border px-4 py-2">NIM</th>
            <th className="border px-4 py-2">Nama</th>
            <th className="border px-4 py-2">Program Studi</th>
            <th className="border px-4 py-2">Angkatan</th>
            <th className="border px-4 py-2">Foto</th>
            <th className="border px-4 py-2">Created At</th>
            <th className="border px-4 py-2">Aksi</th>
          </tr>
        </thead>

        <tbody>

          {data.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="text-center py-6 text-gray-500"
              >
                Data mahasiswa belum tersedia.
              </td>
            </tr>
          ) : (
            data.map((mhs: any, index: number) => (
              <tr
                key={mhs.id}
                className="hover:bg-gray-100"
              >
                <td className="border px-4 py-2 text-center">
                  {index + 1}
                </td>

                <td className="border px-4 py-2">
                  {mhs.nim}
                </td>

                <td className="border px-4 py-2">
                  {mhs.nama}
                </td>

                <td className="border px-4 py-2">
                  {mhs.nama_prodi ?? mhs.prodi}
                </td>

                <td className="border px-4 py-2 text-center">
                  {mhs.angkatan}
                </td>

                <td className="border px-4 py-2 text-center">
                  {mhs.foto ? (
                    <img
                      src={`${backendHost}/uploads/mahasiswa/${mhs.foto}`}
                      alt={mhs.nama}
                      className="mx-auto rounded border object-cover"
                      style={{ width: "3cm", height: "3cm" }}
                    />
                  ) : (
                    <span className="text-gray-500">Tidak ada</span>
                  )}
                </td>

                <td className="border px-4 py-2 text-center">
                  {mhs.created_at
                    ? new Date(mhs.created_at).toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </td>

                <td className="border px-4 py-2 text-center space-y-2">
                  <button
                    onClick={() => onEdit(mhs)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded w-full"
                  >
                    Ubah
                  </button>
                  <button
                    onClick={() => onDelete(mhs.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded w-full"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          )}

        </tbody>

      </table>

    </div>
  );
}