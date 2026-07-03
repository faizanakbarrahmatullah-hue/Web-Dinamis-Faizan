"use client";

export default function MahasiswaTable({ data, onDelete }: any) {
  return (
    <table border={1} cellPadding={10}>
      <thead>
        <tr>
          <th>NIM</th>
          <th>Nama</th>
          <th>Prodi</th>
          <th>Angkatan</th>
          <th>Aksi</th>
        </tr>
      </thead>

      <tbody>
        {data.map((mhs: any) => (
          <tr key={mhs.id}>
            <td>{mhs.nim}</td>
            <td>{mhs.nama}</td>
            <td>{mhs.prodi}</td>
            <td>{mhs.angkatan}</td>
            <td>
              <button onClick={() => onDelete(mhs.id)}>
                Hapus
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}