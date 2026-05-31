"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";

type Musica = {
  titulo: string;
  letra_cifrada: string;
};

export default function PalcoClient() {
  const searchParams = useSearchParams();
  const eventoId = searchParams.get("evento");

  const [musicas, setMusicas] = useState<Musica[]>([]);
  const [indice, setIndice] = useState(0);

  const [scrolling, setScrolling] = useState(false);
  const [velocidade, setVelocidade] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);

  const [mostrarCifras, setMostrarCifras] = useState(true);

  const [transposicao, setTransposicao] = useState(0);

  const [fonte, setFonte] = useState(4);

  const [mostrarControles, setMostrarControles] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  async function carregarRepertorio() {
    if (!eventoId) return;

    const { data } = await supabase
      .from("evento_musicas")
      .select("musicas(titulo, letra_cifrada)")
      .eq("evento_id", eventoId);

    if (data) {
      const lista = data.map((item: any) => item.musicas);
      setMusicas(lista);
    }
  }

  useEffect(() => {
    carregarRepertorio();
  }, [eventoId]);

  useEffect(() => {
    if (!scrolling) return;

    const interval = setInterval(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop += velocidade;
      }
    }, 50);

    return () => clearInterval(interval);
  }, [scrolling, velocidade]);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    setFullscreen(true);
  } else {
    document.exitFullscreen();
    setFullscreen(false);
  }
    if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();

    setFullscreen(true);

  }
  }

  useEffect(() => {
  const handleFullscreenChange = () => {
    const ativo = !!document.fullscreenElement;

    setFullscreen(ativo);

    if (!ativo) {
      setMostrarControles(true);
    }
  };

  document.addEventListener(
    "fullscreenchange",
    handleFullscreenChange
  );

  return () => {
    document.removeEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );
  };
  }, []);

  

  const musicaAtual = musicas[indice];

  const notas = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];

  function transporAcorde(acorde: string, semitons: number) {
    const match = acorde.match(/^([A-G]#?)(.*)$/);

    if (!match) return acorde;

    const [, nota, resto] = match;

    const index = notas.indexOf(nota);

    if (index === -1) return acorde;

    const novoIndex = (index + semitons + 12) % 12;

    return notas[novoIndex] + resto;
  }

  return (
    <main className="h-screen bg-black text-white flex flex-col">
      <button
  onClick={() => setMostrarControles((v) => !v)}
  className="
    fixed
    top-4
    right-4
    z-50
    bg-zinc-800
    text-white
    px-3
    py-2
    rounded-full
    opacity-80
  "
>
  ⚙
</button>
  {mostrarControles && (
  <div className="p-4 border-b border-zinc-800 flex flex-wrap gap-6 text-sm">
  <div className="flex items-center gap-2">
    <span className="text-zinc-400">Músicas</span>

    <button
      onClick={() => setIndice((i) => Math.max(0, i - 1))}
      className="bg-zinc-800 px-4 py-2 rounded"
    >
      Anterior
    </button>

    <button
      onClick={() =>
        setIndice((i) => Math.min(musicas.length - 1, i + 1))
      }
      className="bg-zinc-800 px-4 py-2 rounded"
    >
      Próxima
    </button>
  </div>

  <div className="flex items-center gap-2">
        <span className="text-zinc-400">Scroll</span>

        <button
          onClick={() => setScrolling(!scrolling)}
          className="bg-zinc-800 px-4 py-2 rounded"
        >
          {scrolling ? "Parar" : "Iniciar"}
        </button>

        <button
          onClick={() => setVelocidade((v) => Math.max(1, v - 1))}
          className="bg-zinc-800 px-4 py-2 rounded"
        >
          -
        </button>

        <span>{velocidade}</span>

        <button
          onClick={() => setVelocidade((v) => v + 1)}
          className="bg-zinc-800 px-4 py-2 rounded"
        >
          +
        </button>
        </div>

        <div className="flex items-center gap-2">
        <span className="text-zinc-400">Exibição</span>

        <button
          onClick={toggleFullscreen}
          className="bg-zinc-800 px-4 py-2 rounded"
        >
          Fullscreen
        </button>

        <button
          onClick={() => setMostrarCifras(!mostrarCifras)}
          className="bg-zinc-800 px-4 py-2 rounded"
        >
          {mostrarCifras ? "Ocultar" : "Mostrar"}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-zinc-400">Tom</span>

        <button
          onClick={() => setTransposicao((t) => t - 1)}
          className="bg-zinc-800 px-4 py-2 rounded"
        >
          -1
        </button>

        <span>{transposicao}</span>

        <button
          onClick={() => setTransposicao((t) => t + 1)}
          className="bg-zinc-800 px-4 py-2 rounded"
        >
          +1
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-zinc-400">Fonte</span>

        <button
          onClick={() => setFonte((f) => Math.max(0.8, f - 0.25))}
          className="bg-zinc-800 px-4 py-2 rounded"
        >
          A-
        </button>

        <span>{fonte}</span>

        <button
          onClick={() => setFonte((f) => Math.min(8, f + 0.5))}
          className="bg-zinc-800 px-4 py-2 rounded"
        >
          A+
        </button>
      </div>
    </div>
    )}

      <div ref={containerRef} className="overflow-x-auto">
        {musicaAtual && (
          <>
            <h1 className="text-3xl mb-8">{musicaAtual.titulo}</h1>

            <pre
              style={{ fontSize: `${fonte}rem` }}
              className={`whitespace-pre font-mono ${
                mostrarCifras ? "leading-loose" : "leading-[0.95]"
              }`}
            >
              {mostrarCifras
              ? musicaAtual.letra_cifrada.replace(
                  /\[([^\]]+)\]/g,
                  (_, acorde) => transporAcorde(acorde, transposicao)
                )
              : musicaAtual.letra_cifrada.replace(/\[[^\]]+\]/g, "")}
            </pre>
          </>
        )}
      </div>
    </main>
  );
}