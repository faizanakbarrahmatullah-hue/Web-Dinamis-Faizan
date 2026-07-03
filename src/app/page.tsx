import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Frontend CRUD Faizan</h1>
      <Link href="/mahasiswa">
        Ke Data Mahasiswa
      </Link>
    </div>
  );
}