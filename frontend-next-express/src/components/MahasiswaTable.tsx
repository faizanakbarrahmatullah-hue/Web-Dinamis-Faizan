"use client";

import { BACKEND_URL } from "@/lib/api";

export default function MahasiswaTable({ data, onEdit, onDelete }: any) {
  const backendHost = BACKEND_URL?.replace(/\/+$/, "") ?? "http://localhost:3000";

  if (data.length === 0) {
    return (
      <div className="mt-8 text-center py-12 bg-white rounded-lg shadow-lg border-2 border-dashed border-gray-300">
        <p className="text-5xl mb-4">📭</p>
        <p className="text-gray-600 text-lg font-medium">Data mahasiswa belum tersedia.</p>
        <p className="text-gray-500 text-sm mt-2">Tambahkan data mahasiswa melalui form di atas.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📊</span>
        <h3 className="text-xl font-bold text-gray-800">Daftar Mahasiswa</h3>
        <span className="ml-auto bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {data.length} mahasiswa
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <th className="px-6 py-4 text-left text-sm font-bold">No</th>
              <th className="px-6 py-4 text-left text-sm font-bold">NIM</th>
              <th className="px-6 py-4 text-left text-sm font-bold">Nama</th>
              <th className="px-6 py-4 text-left text-sm font-bold">Program Studi</th>
              <th className="px-6 py-4 text-center text-sm font-bold">Angkatan</th>
              <th className="px-6 py-4 text-center text-sm font-bold">Foto</th>
              <th className="px-6 py-4 text-center text-sm font-bold">Dibuat</th>
              <th className="px-6 py-4 text-center text-sm font-bold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((mhs: any, index: number) => (
              <tr
                key={mhs.id}
                className="hover:bg-blue-50 transition-all duration-200 border-l-4 border-l-transparent hover:border-l-blue-600"
              >
                <td className="px-6 py-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm">
                    {index + 1}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className="font-mono bg-gray-100 px-3 py-1 rounded text-sm font-semibold text-gray-700">
                    {mhs.nim}
                  </span>
                </td>

                <td className="px-6 py-4 font-medium text-gray-800">{mhs.nama}</td>

                <td className="px-6 py-4">
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {mhs.nama_prodi ?? mhs.prodi}
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                  <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded font-semibold text-sm">
                    {mhs.angkatan}
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                  {mhs.foto ? (
                    <img
                      src={`${backendHost}/uploads/mahasiswa/${mhs.foto}`}
                      alt={mhs.nama}
                      className="mx-auto rounded-lg border-2 border-gray-200 object-cover hover:scale-110 transition-transform"
                      style={{ width: "50px", height: "50px" }}
                    />
                  ) : (
                    <span className="text-gray-400 text-3xl">📷</span>
                  )}
                </td>

                <td className="px-6 py-4 text-center text-sm text-gray-600">
                  {mhs.created_at
                    ? new Date(mhs.created_at).toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => onEdit(mhs)}
                      className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg"
                      title="Edit data mahasiswa"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => onDelete(mhs.id)}
                      className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg"
                      title="Hapus data mahasiswa"
                    >
                      🗑️ Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}