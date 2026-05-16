"use client";

import { useState } from "react";

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

function transporAcorde(acorde: string, steps: number) {
  const match = acorde.match(/^([A-G]#?)(.*)$/);

  if (!match) return acorde;

  const [, nota, resto] = match;

  const index = notas.indexOf(nota);

  if (index === -1) return acorde;

  const novoIndex = (index + steps + notas.length) % notas.length;

  return notas[novoIndex] + resto;
}

function transporTexto(texto: string, steps: number) {
  return texto.replace(/\[(.*?)\]/g, (_, acorde) => {
    return `[${transporAcorde(acorde, steps)}]`;
  });
}

export default function SongViewer({ cifra }: { cifra: string }) {
  const [steps, setSteps] = useState(0);

  const cifraTransposta = transporTexto(cifra, steps);

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <button
          onClick={() => setSteps(steps - 1)}
          className="bg-zinc-800 px-4 py-2 rounded-lg"
        >
          -1
        </button>

        <button
          onClick={() => setSteps(steps + 1)}
          className="bg-zinc-800 px-4 py-2 rounded-lg"
        >
          +1
        </button>
      </div>

      <pre className="bg-black text-white p-8 rounded-xl text-xl font-mono whitespace-pre-wrap leading-relaxed">
        {cifraTransposta}
      </pre>
    </div>
  );
}