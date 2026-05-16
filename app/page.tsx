import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center gap-8">
      <h1 className="text-5xl font-bold">Corunum App</h1>

      <p className="text-zinc-400">
        Gerenciador de cifras, repertórios e modo palco
      </p>

      <div className="flex gap-4">
        <Link
          href="/musicas"
          className="bg-zinc-800 px-6 py-3 rounded-xl hover:bg-zinc-700"
        >
          Biblioteca
        </Link>

        <Link
          href="/eventos"
          className="bg-zinc-800 px-6 py-3 rounded-xl hover:bg-zinc-700"
        >
          Eventos
        </Link>
      </div>
    </main>
  );
}