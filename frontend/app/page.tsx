import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-green-800 text-white">
      <h1 className="text-6xl font-bold text-center mb-8">
        Ethiopia Academy Football Management System
      </h1>
      <p className="text-xl mb-12 max-w-2xl text-center">
        Empowering the next generation of Ethiopian football talent through digital management.
      </p>
      
      <div className="flex gap-4">
        <Link href="/login" className="px-6 py-3 bg-white text-green-800 rounded-lg font-bold hover:bg-gray-100 transition">
          Login
        </Link>
        <Link href="/register" className="px-6 py-3 border-2 border-white rounded-lg font-bold hover:bg-white/10 transition">
          Register as Player
        </Link>
      </div>
    </main>
  );
}
