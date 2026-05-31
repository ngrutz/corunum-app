import { Suspense } from "react";
import PalcoClient from "./PalcoClient"

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <PalcoClient />
    </Suspense>
  );
}