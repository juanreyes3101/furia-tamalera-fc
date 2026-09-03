import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlayerDetail from "@/components/roster/PlayerDetail";
import { players } from "@/lib/players";

export async function generateStaticParams() {
  return players.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const player = players.find((p) => p.id === id);
  if (!player) return {};
  return {
    title: `${player.name} ${player.apellido} — Furia Tamalera FC`,
    description: `Ficha de ${player.name} ${player.apellido}, ${player.pos} de Furia Tamalera FC.`,
  };
}

export default async function JugadorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const player = players.find((p) => p.id === id);
  if (!player) notFound();

  return (
    <>
      <Header />
      <main className="relative z-[1] min-h-[70vh]">
        <PlayerDetail player={player} />
      </main>
      <Footer />
    </>
  );
}
