import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 flex flex-col items-center justify-center px-4 py-8">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <div className="w-24 h-24 mx-auto bg-white bg-opacity-10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white border-opacity-20">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
            CRUD Faizan
          </h1>

          <p className="text-xl text-blue-100 mb-3 max-w-xl mx-auto">
            Sistem Manajemen Data Mahasiswa
          </p>

          <p className="text-base text-blue-100 max-w-lg mx-auto">
            Platform modern untuk mengelola informasi mahasiswa dengan antarmuka yang intuitif dan backend yang handal
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-white font-semibold mb-2">Data Management</h3>
            <p className="text-blue-100 text-sm">Kelola data mahasiswa dengan mudah dan cepat</p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300">
            <div className="text-3xl mb-3">🔐</div>
            <h3 className="text-white font-semibold mb-2">Secure Access</h3>
            <p className="text-blue-100 text-sm">Akses terbatas dengan autentikasi JWT yang aman</p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-white font-semibold mb-2">Real-time Updates</h3>
            <p className="text-blue-100 text-sm">Perbarui informasi secara real-time dengan integrasi API</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={isAuthenticated() ? "/mahasiswa" : "/login"}
            className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 font-bold rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 text-center text-lg"
          >
            {isAuthenticated() ? "Ke Dashboard Mahasiswa" : "🔐 Login Admin"}
          </Link>

          <Link
            href="/mahasiswa"
            className="w-full sm:w-auto px-8 py-4 bg-transparent text-white font-bold rounded-lg border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-300 text-center text-lg"
          >
            Lihat Data Mahasiswa
          </Link>
        </div>

        {/* Tech Stack */}
        <div className="mt-16 text-center">
          <p className="text-blue-100 text-sm mb-4">Powered by</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <span className="text-white font-semibold text-sm">Next.js 16</span>
            <span className="text-blue-200">•</span>
            <span className="text-white font-semibold text-sm">Express.js</span>
            <span className="text-blue-200">•</span>
            <span className="text-white font-semibold text-sm">TypeScript</span>
            <span className="text-blue-200">•</span>
            <span className="text-white font-semibold text-sm">MySQL</span>
          </div>
        </div>
      </div>
    </div>
  );
}