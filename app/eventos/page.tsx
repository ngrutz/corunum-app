"use client";

import Link from "next/link";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Evento = {
  id: string;
  nome: string;
  data: string;
};

type Musica = {
  id: string;
  titulo: string;
};

type EventoMusica = {
  id: string;
  ordem: number;
  musicas: {
    id: string;
    titulo: string;
  };
};

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [musicas, setMusicas] = useState<Musica[]>([]);
  const [eventoSelecionado, setEventoSelecionado] = useState<string | null>(null);
  const [repertorio, setRepertorio] = useState<EventoMusica[]>([]);
  const [musicaSelecionada, setMusicaSelecionada] = useState("");

  const [nome, setNome] = useState("");
  const [data, setData] = useState("");

  async function carregarEventos() {
    const { data } = await supabase.from("eventos").select("*");

    if (data) setEventos(data);
  }

  async function carregarMusicas() {
    const { data } = await supabase.from("musicas").select("id, titulo");

    if (data) setMusicas(data);
  }

  async function carregarRepertorio(eventoId: string) {
    const { data } = await supabase
      .from("evento_musicas")
      .select("id, ordem, musicas(id, titulo)")
      .eq("evento_id", eventoId)
      .order("ordem");

    if (data) {
      setRepertorio(data as unknown as EventoMusica[]);
    }
  }

  async function salvarEvento() {
    const { error } = await supabase.from("eventos").insert([
      {
        nome,
        data,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setNome("");
    setData("");

    carregarEventos();
  }

  async function adicionarMusica() {
    if (!eventoSelecionado || !musicaSelecionada) return;

    await supabase.from("evento_musicas").insert([
      {
        evento_id: eventoSelecionado,
        musica_id: musicaSelecionada,
        ordem: repertorio.length + 1,
      },
    ]);

    carregarRepertorio(eventoSelecionado);
  }

  useEffect(() => {
    carregarEventos();
    carregarMusicas();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Eventos</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome do evento"
            className="w-full p-3 bg-zinc-900 rounded"
          />

          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full p-3 bg-zinc-900 rounded"
          />

          <button
            onClick={salvarEvento}
            className="bg-blue-600 px-6 py-3 rounded-xl"
          >
            Criar evento
          </button>

          <div className="space-y-2">
            {eventos.map((evento) => (
            <button
              key={evento.id}
              onClick={() => {
                setEventoSelecionado(evento.id);
                carregarRepertorio(evento.id);
              }}
              className="w-full text-left bg-zinc-900 p-4 rounded"
            >
              <>
                <div>{evento.nome}</div>

                <Link
                  href={`/palco?evento=${evento.id}`}
                  className="text-blue-400 text-sm"
                >
                  Abrir palco
                </Link>
              </>
            </button>
          ))}
          </div>
        </div>

        <div>
          <select
            value={musicaSelecionada}
            onChange={(e) => setMusicaSelecionada(e.target.value)}
            className="w-full p-3 bg-zinc-900 rounded"
          >
            <option value="">Selecionar música</option>

            {musicas.map((musica) => (
              <option key={musica.id} value={musica.id}>
                {musica.titulo}
              </option>
            ))}
          </select>

          <button
            onClick={adicionarMusica}
            className="mt-4 bg-green-600 px-6 py-3 rounded-xl"
          >
            Adicionar ao repertório
          </button>
        </div>

        <div>
          <h2 className="text-2xl mb-4">Repertório</h2>

          <div className="space-y-2">
            {repertorio.map((item) => (
              <div key={item.id} className="bg-zinc-900 p-4 rounded">
                {item.ordem}. {item.musicas.titulo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}