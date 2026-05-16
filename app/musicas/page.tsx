"use client";

import { useEffect, useState } from "react";
import SongViewer from "@/components/SongViewer";
import { supabase } from "@/lib/supabase";

type Musica = {
  id: string;
  titulo: string;
  artista: string;
  tom: string;
  letra_cifrada: string;
};



export default function MusicasPage() {
  const [musicas, setMusicas] = useState<Musica[]>([]);
  const [titulo, setTitulo] = useState("");
  const [artista, setArtista] = useState("");
  const [tom, setTom] = useState("");
  const [letra, setLetra] = useState("");
  const [selecionada, setSelecionada] = useState<Musica | null>(null);
  const [busca, setBusca] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [musicaSelecionada, setMusicaSelecionada] = useState<any | null>(null);

  async function carregarMusicas() {
    const { data } = await supabase
      .from("musicas")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setMusicas(data);
  }

async function salvarMusica() {
  if (!titulo || !artista || !tom || !letra) {
    alert("Preencha todos os campos");
    return;
  }

  let error;

  if (editandoId) {
    const resultado = await supabase
      .from("musicas")
      .update({
        titulo,
        artista,
        tom,
        letra_cifrada: letra,
      })
      .eq("id", editandoId);

    error = resultado.error;
  } else {
    const resultado = await supabase.from("musicas").insert([
      {
        titulo,
        artista,
        tom,
        letra_cifrada: letra,
      },
    ]);

    error = resultado.error;
  }

  if (error) {
    alert(error.message);
    return;
  }

  setTitulo("");
  setArtista("");
  setTom("");
  setLetra("");
  setEditandoId(null);

  carregarMusicas();
}

async function excluirMusica(id: string) {
  const confirmar = confirm("Excluir música?");

  if (!confirmar) return;

  const { error } = await supabase
    .from("musicas")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  carregarMusicas();
}

function editarMusica(musica: any) {
  setEditandoId(musica.id);
  setTitulo(musica.titulo);
  setArtista(musica.artista);
  setTom(musica.tom);
  setLetra(musica.letra_cifrada);
}

  useEffect(() => {
    carregarMusicas();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Biblioteca</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título"
            className="w-full p-3 bg-zinc-900 rounded"
          />

          <input
            value={artista}
            onChange={(e) => setArtista(e.target.value)}
            placeholder="Artista"
            className="w-full p-3 bg-zinc-900 rounded"
          />

          <input
            value={tom}
            onChange={(e) => setTom(e.target.value)}
            placeholder="Tom"
            className="w-full p-3 bg-zinc-900 rounded"
          />

          <textarea
            value={letra}
            onChange={(e) => setLetra(e.target.value)}
            placeholder="Cole aqui a cifra..."
            rows={16}
            className="w-full p-3 bg-zinc-900 rounded font-mono"
          />

          <button
            onClick={salvarMusica}
            className="bg-green-600 px-6 py-3 rounded-xl"
          >
            Salvar música
          </button>
        </div>

        <div>
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar música..."
            className="w-full p-3 bg-zinc-900 rounded mb-4"
          />

          <h2 className="text-2xl mb-4">Músicas cadastradas</h2>

          <div className="space-y-2">
            {musicas
              .filter((musica) =>
                `${musica.titulo} ${musica.artista}`
                  .toLowerCase()
                  .includes(busca.toLowerCase())
              )
              .map((musica) => (
                <div
                  key={musica.id}
                  onClick={() => setMusicaSelecionada(musica)}
                  className="bg-zinc-900 p-4 rounded cursor-pointer"
                >
                  <strong>{musica.titulo}</strong>
                  <p>{musica.artista}</p>

                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        editarMusica(musica);
                      }}
                      className="text-blue-400"
                    >
                      Editar
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        excluirMusica(musica.id);
                      }}
                      className="text-red-400"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {selecionada && (
        <div className="mt-10">
          <h2 className="text-2xl mb-4">
            {selecionada.titulo} — {selecionada.artista}
          </h2>

          <SongViewer cifra={selecionada.letra_cifrada} />
        </div>
      )}
    </main>
  );
}