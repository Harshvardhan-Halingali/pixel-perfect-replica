import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { Atom, Orbit, Radar, Rocket, Satellite, Sparkles, Zap } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";

export function CursorGlow() {
  const x = useMotionValue(-500), y = useMotionValue(-500);
  useEffect(() => {
    const m = (e: PointerEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("pointermove", m);
    return () => window.removeEventListener("pointermove", m);
  }, [x, y]);
  const bg = useTransform([x, y], ([a, b]) =>
    `radial-gradient(500px circle at ${a}px ${b}px, color-mix(in oklab, var(--cyan) 12%, transparent), transparent 60%)`);
  return <motion.div className="pointer-events-none fixed inset-0 z-30" style={{ background: bg }} />;
}

export function Navbar() {
  return (
    <motion.nav initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.6, duration: 0.8 }}
      className="fixed left-1/2 top-4 z-40 flex w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 items-center justify-between rounded-full glass px-4 py-2">
      <div className="flex items-center gap-2 font-display text-sm font-bold tracking-widest">
        <Atom className="h-5 w-5 text-cyan animate-spin-fast" /> HORIZON
      </div>
      <div className="hidden gap-6 text-sm text-muted-foreground md:flex">
        {["Fleet", "Architecture", "Odyssey"].map((l) => (
          <a key={l} href={`#${l.toLowerCase()}`} className="transition hover:text-cyan hover:[text-shadow:0_0_12px_var(--cyan)]">{l}</a>
        ))}
      </div>
      <a href="#odyssey" className="rounded-full bg-primary px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground animate-pulse-ring">
        Launch Mission
      </a>
    </motion.nav>
  );
}

function Counter({ base, rate, decimals = 0, suffix = "" }: { base: number; rate: number; decimals?: number; suffix?: string }) {
  const [v, setV] = useState(base);
  useEffect(() => {
    const t0 = performance.now();
    const id = setInterval(() => setV(base + ((performance.now() - t0) / 1000) * rate + (Math.random() - 0.5) * rate * 0.1), 80);
    return () => clearInterval(id);
  }, [base, rate]);
  return <span>{v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
}

function MagneticButton({ children }: { children: ReactNode }) {
  const x = useSpring(0, { stiffness: 200, damping: 15 }), y = useSpring(0, { stiffness: 200, damping: 15 });
  const onMove = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.35); y.set((e.clientY - r.top - r.height / 2) * 0.35);
  };
  return (
    <motion.button style={{ x, y }} onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={() => window.scrollTo({ top: window.innerHeight * 1.2, behavior: "smooth" })}
      className="group relative rounded-full border border-cyan/50 bg-cyan/10 px-8 py-4 font-display text-sm font-bold uppercase tracking-[0.3em] text-cyan backdrop-blur-xl transition hover:glow-cyan">
      <span className="absolute -inset-4 -z-10 rounded-full bg-cyan/20 opacity-0 blur-2xl transition group-hover:opacity-100" />
      <span className="flex items-center gap-3">{children}</span>
    </motion.button>
  );
}

export function Planet() {
  const { scrollYProgress } = useScroll();
  const s = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  const scale = useTransform(s, [0, 1], [1, 2.6]);
  const x = useTransform(s, [0, 1], ["10vw", "-60vw"]);
  const y = useTransform(s, [0, 1], ["0vh", "70vh"]);
  const rotate = useTransform(s, [0, 1], [0, 220]);
  return (
    <motion.div style={{ scale, x, y, rotate }} className="pointer-events-none fixed right-[-10vw] top-[12vh] -z-[5] h-[70vmin] w-[70vmin]">
      <div className="absolute inset-0 rounded-full bg-blue/30 blur-3xl" />
      <div className="absolute inset-[-25%] animate-spin-slow rounded-full [background:conic-gradient(from_0deg,transparent,var(--cyan),transparent_30%,oklch(0.65_0.25_300),transparent_60%,var(--blue),transparent)] [mask:radial-gradient(circle,transparent_42%,#000_44%,#000_52%,transparent_70%)] [transform:rotateX(72deg)]" />
      <div className="absolute inset-[18%] rounded-full bg-background shadow-[0_0_80px_20px_var(--violet),inset_0_0_40px_var(--cyan)]" />
      <div className="absolute inset-[16%] rounded-full border border-cyan/40 blur-[1px]" />
    </motion.div>
  );
}

export function Parallax() {
  const { scrollY } = useScroll();
  const fast = useTransform(scrollY, (v) => -v * 1.0);
  const slow = useTransform(scrollY, (v) => v * 0.5);
  return (
    <div className="pointer-events-none fixed inset-0 -z-[4] overflow-hidden">
      <motion.div style={{ y: fast }} className="absolute inset-0">
        <div className="absolute left-[8%] top-[70vh] h-10 w-14 rounded-[45%_55%_40%_60%] bg-muted-foreground/30 shadow-[inset_-6px_-6px_10px_var(--background)] blur-[0.5px]" />
        <div className="absolute right-[12%] top-[140vh] h-6 w-8 rotate-12 rounded-[60%_40%_55%_45%] bg-muted-foreground/40" />
        <div className="absolute left-[30%] top-[220vh] h-16 w-20 rounded-[50%_40%_60%_45%] bg-muted-foreground/20" />
        <p className="absolute right-[6%] top-[90vh] font-mono text-[10px] text-cyan/70">RA 17h45m40s · DEC −29°00′28″</p>
        <p className="absolute left-[5%] top-[180vh] font-mono text-[10px] text-cyan/70">SGR A* · Δv 0.31c</p>
      </motion.div>
      <motion.div style={{ y: slow }} className="absolute inset-0">
        <div className="absolute -left-32 top-[40vh] h-80 w-80 rounded-full border border-cyan/20 [transform:rotateX(70deg)]" />
        <div className="absolute right-[20%] top-[10vh] h-40 w-40 rounded-full border border-dashed border-blue/30 animate-spin-slow" />
        <p className="absolute left-[10%] top-[20vh] font-mono text-[10px] text-muted-foreground">SECTOR 7G // GRID 042.118</p>
      </motion.div>
    </div>
  );
}

export function Hero() {
  const { scrollY } = useScroll();
  const o = useTransform(scrollY, [0, 500], [1, 0]);
  const yy = useTransform(scrollY, [0, 500], [0, -120]);
  return (
    <motion.section style={{ opacity: o, y: yy }} className="relative flex min-h-screen flex-col items-center justify-center px-5 pt-24 text-center">
      <motion.p initial={{ opacity: 0, letterSpacing: "1em" }} animate={{ opacity: 1, letterSpacing: "0.4em" }} transition={{ delay: 1.2, duration: 1.2 }}
        className="mb-6 font-mono text-xs uppercase text-cyan">// Transmission incoming</motion.p>
      <h1 className="font-display text-5xl font-black leading-[0.95] sm:text-7xl md:text-8xl">
        {["BEYOND THE", "EVENT HORIZON"].map((line, i) => (
          <motion.span key={line} initial={{ opacity: 0, filter: "blur(20px)", scale: 1.4 }} animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            transition={{ delay: 1.4 + i * 0.3, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="block text-gradient text-glow">{line}</motion.span>
        ))}
      </h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3 }}
        className="mt-6 max-w-md text-muted-foreground">Crewed expeditions to the edge of spacetime. Fold light. Cross the singularity. Return changed.</motion.p>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.5 }} className="mt-10">
        <MagneticButton><Zap className="h-4 w-4" /> Initiate Warp</MagneticButton>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8 }}
        className="mt-14 grid w-full max-w-2xl grid-cols-3 gap-3 rounded-2xl glass p-4 font-mono">
        {[
          { l: "Lightyears", c: <Counter base={4218.2} rate={0.9} decimals={2} /> },
          { l: "Active Probes", c: <Counter base={1337} rate={0.4} /> },
          { l: "Velocity km/s", c: <Counter base={299700} rate={3} /> },
        ].map((t) => (
          <div key={t.l}>
            <div className="text-base font-bold text-cyan sm:text-2xl">{t.c}</div>
            <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">{t.l}</div>
          </div>
        ))}
      </motion.div>
    </motion.section>
  );
}

function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const rx = useSpring(0, { stiffness: 150, damping: 15 }), ry = useSpring(0, { stiffness: 150, damping: 15 });
  const mx = useMotionValue(50), my = useMotionValue(50);
  const bg = useTransform([mx, my], ([a, b]) => `radial-gradient(300px circle at ${a}% ${b}%, color-mix(in oklab, var(--cyan) 18%, transparent), transparent 70%)`);
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * 18); rx.set(-(py - 0.5) * 18); mx.set(px * 100); my.set(py * 100);
      }}
      onMouseLeave={() => { rx.set(0); ry.set(0); }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={`glow-border relative overflow-hidden rounded-3xl glass p-6 ${className}`}>
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: bg }} />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

function Bar({ label, v }: { label: string; v: number }) {
  return (
    <div className="mt-3">
      <div className="flex justify-between font-mono text-[10px] uppercase text-muted-foreground"><span>{label}</span><span>{v}%</span></div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
        <motion.div initial={{ width: 0 }} whileInView={{ width: `${v}%` }} transition={{ duration: 1.6, ease: "easeOut" }} viewport={{ once: true }}
          className="h-full rounded-full bg-gradient-to-r from-violet via-cyan to-blue glow-cyan" />
      </div>
    </div>
  );
}

export function Bento() {
  return (
    <section id="architecture" className="mx-auto max-w-6xl px-5 py-32">
      <h2 className="mb-12 font-display text-3xl font-bold sm:text-5xl"><span className="text-gradient">Galactic</span> Architecture</h2>
      <div className="grid gap-5 md:grid-cols-3 md:grid-rows-2">
        <TiltCard className="md:col-span-2 md:row-span-2 min-h-[360px]">
          <Radar className="h-6 w-6 text-cyan" />
          <h3 className="mt-3 font-display text-2xl font-bold">Deep Field Radar</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">Gravitational lensing arrays map 40 billion objects in real time.</p>
          <div className="relative mx-auto mt-8 h-56 w-56">
            {[0, 1, 2, 3].map((i) => <div key={i} className="absolute rounded-full border border-cyan/30" style={{ inset: `${i * 14}%` }} />)}
            <div className="absolute inset-0 animate-spin-fast rounded-full [background:conic-gradient(from_0deg,color-mix(in_oklab,var(--cyan)_50%,transparent),transparent_25%)]" />
            {[[20, 30], [70, 60], [45, 80], [80, 25]].map(([l, t]) => (
              <span key={l} className="absolute h-2 w-2 animate-pulse rounded-full bg-cyan glow-cyan" style={{ left: `${l}%`, top: `${t}%` }} />
            ))}
          </div>
        </TiltCard>
        <TiltCard>
          <Rocket className="h-6 w-6 text-cyan" />
          <h3 className="mt-3 font-display text-lg font-bold">Fold Drive</h3>
          <Bar label="Core charge" v={87} /><Bar label="Field stability" v={64} />
        </TiltCard>
        <TiltCard>
          <Orbit className="h-6 w-6 text-cyan" />
          <h3 className="mt-3 font-display text-lg font-bold">Orbital Mesh</h3>
          <div className="relative mt-4 h-20">
            <div className="absolute left-1/2 top-1/2 h-20 w-40 -translate-x-1/2 -translate-y-1/2 animate-spin-slow rounded-full border border-blue/50" />
            <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan glow-cyan" />
          </div>
          <Bar label="Sync" v={99} />
        </TiltCard>
      </div>
    </section>
  );
}

const MILESTONES = [
  { t: "Orbit", d: "Leave the cradle. Low orbit insertion at 7.8 km/s.", i: Satellite },
  { t: "Deep Space", d: "Past the heliopause into interstellar dark.", i: Sparkles },
  { t: "Singularity", d: "Cross the horizon. Time folds; light bends home.", i: Atom },
];

export function Odyssey() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 50%"] });
  const h = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "100%"]), { stiffness: 80, damping: 20 });
  return (
    <section id="odyssey" className="mx-auto max-w-5xl px-5 py-32">
      <h2 className="mb-20 text-center font-display text-3xl font-bold sm:text-5xl">The <span className="text-gradient">Odyssey</span></h2>
      <div ref={ref} className="relative">
        <div className="absolute left-4 top-0 h-full w-0.5 bg-muted md:left-1/2 md:-translate-x-1/2" />
        <motion.div style={{ height: h }} className="absolute left-4 top-0 w-0.5 bg-gradient-to-b from-violet via-cyan to-blue glow-cyan md:left-1/2 md:-translate-x-1/2" />
        {MILESTONES.map((m, idx) => {
          const left = idx % 2 === 0;
          return (
            <div key={m.t} className={`relative mb-28 flex ${left ? "md:justify-start" : "md:justify-end"}`}>
              <motion.span initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ margin: "-40% 0px" }} transition={{ type: "spring" }}
                className="absolute left-4 top-6 h-5 w-5 -translate-x-1/2 rounded-full bg-cyan glow-cyan animate-pulse-ring md:left-1/2" />
              <motion.div initial={{ opacity: 0, x: left ? -160 : 160, rotate: left ? -6 : 6 }} whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                viewport={{ once: true, margin: "-20%" }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="ml-12 w-full rounded-3xl glass glow-border p-6 md:ml-0 md:w-[44%]">
                <m.i className="h-6 w-6 text-cyan" />
                <p className="mt-3 font-mono text-xs text-muted-foreground">PHASE 0{idx + 1}</p>
                <h3 className="font-display text-2xl font-bold">{m.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{m.d}</p>
              </motion.div>
            </div>
          );
        })}
      </div>
      <footer className="pt-10 text-center font-mono text-xs text-muted-foreground">© 2026 HORIZON DEEP SPACE — ALL SIGNALS NOMINAL</footer>
    </section>
  );
}
