import { createFileRoute } from "@tanstack/react-router";
import { Starfield } from "@/components/space/Starfield";
import { Bento, CursorGlow, Hero, Navbar, Odyssey, Parallax, Planet } from "@/components/space/Sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Beyond the Event Horizon — Horizon Deep Space" },
      { name: "description", content: "An immersive warp-speed journey to the edge of spacetime." },
      { property: "og:title", content: "Beyond the Event Horizon" },
      { property: "og:description", content: "An immersive warp-speed journey to the edge of spacetime." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative">
      <Starfield />
      <Planet />
      <Parallax />
      <CursorGlow />
      <Navbar />
      <Hero />
      <div id="fleet" />
      <Bento />
      <Odyssey />
    </main>
  );
}
