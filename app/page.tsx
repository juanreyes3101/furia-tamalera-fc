import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Manifiesto from "@/components/Manifiesto";
import RosterSection from "@/components/roster/RosterSection";
import StatsBand from "@/components/StatsBand";
import Countdown from "@/components/Countdown";
import TacticsBoard from "@/components/TacticsBoard";
import StandingsTable from "@/components/StandingsTable";
import Matchday from "@/components/Matchday";
import Novedades from "@/components/Novedades";
import Patrocinio from "@/components/Patrocinio";
import Footer from "@/components/Footer";
import { getCalendario, getProximoPartido, getTablaPosiciones } from "@/lib/torneo";

export default function Home() {
  const proximoPartido = getProximoPartido();
  const standings = getTablaPosiciones();
  const fixtures = getCalendario();

  return (
    <>
      <Header />
      <main id="top" className="relative z-[1]">
        <Hero />
        <Marquee />
        <Manifiesto />
        <RosterSection />
        <StatsBand />
        <Countdown targetDate={proximoPartido.fechaHora ?? undefined} />
        <TacticsBoard />
        <StandingsTable standings={standings} fixtures={fixtures} proximoPartido={proximoPartido} />
        <Matchday />
        <Novedades />
        <Patrocinio />
        <Footer />
      </main>
    </>
  );
}
