export interface Mahasiswa {
  id: number;
  nim: string;
  nama: string;
  prodi_id: number;
  nama_prodi: string;
  angkatan: number;
  foto?: string | null;
}

export interface Prodi {
  id: number;
  nama_prodi: string;
}