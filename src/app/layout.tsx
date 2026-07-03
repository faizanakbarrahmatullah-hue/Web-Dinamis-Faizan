import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CRUD-Faizan",
  description: "Aplikasi CRUD Mahasiswa menggunakan Next.js dan Express",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}