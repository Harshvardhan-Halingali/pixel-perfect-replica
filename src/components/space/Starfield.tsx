import { useEffect, useRef } from "react";

// Canvas starfield: warp intro, then velocity tied to scroll speed; nebula hue shifts violet → cyan → blue with scroll.
const NEBULA: [number, number, number][] = [
  [76, 29, 149],
  [6, 182, 212],
  [59, 130, 246],
];

function lerpColor(t: number) {
  const seg = Math.min(1, Math.max(0, t)) * (NEBULA.length - 1);
  const i = Math.min(NEBULA.length - 2, Math.floor(seg));
  const f = seg - i;
  const a = NEBULA[i]!, b = NEBULA[i + 1]!;
  return [0, 1, 2].map((k) => Math.round(a[k]! + (b[k]! - a[k]!) * f)) as [number, number, number];
}

export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0, raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const N = window.innerWidth < 640 ? 500 : 1100;
    const stars = Array.from({ length: N }, () => ({
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
      z: Math.random(),
      pz: 0,
    }));
    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let lastY = window.scrollY, scrollVel = 0;
    const start = performance.now();
    let last = start;
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05); last = now;
      const y = window.scrollY;
      const instant = Math.abs(y - lastY) / Math.max(dt, 0.001);
      lastY = y;
      scrollVel += (instant - scrollVel) * (1 - Math.exp(-8 * dt));
      const intro = Math.max(0, 1 - (now - start) / 2200);
      const speed = 0.06 + intro * intro * 2.4 + Math.min(scrollVel / 1500, 2.2);
      const maxScroll = Math.max(1, document.body.scrollHeight - h);
      const progress = y / maxScroll;
      const [r, g, b] = lerpColor(progress);

      ctx.fillStyle = "rgba(3,0,20,0.55)";
      ctx.fillRect(0, 0, w, h);
      const grd = ctx.createRadialGradient(w * (0.3 + progress * 0.4), h * 0.4, 0, w / 2, h / 2, Math.max(w, h) * 0.8);
      grd.addColorStop(0, `rgba(${r},${g},${b},0.18)`);
      grd.addColorStop(0.5, `rgba(${r},${g},${b},0.05)`);
      grd.addColorStop(1, "rgba(3,0,20,0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2, cy = h / 2, fov = Math.min(w, h) * 0.6;
      for (const s of stars) {
        s.pz = s.z;
        s.z -= speed * dt;
        if (s.z <= 0.01) {
          s.x = (Math.random() - 0.5) * 2; s.y = (Math.random() - 0.5) * 2;
          s.z = 1; s.pz = 1; continue;
        }
        const sx = cx + (s.x / s.z) * fov, sy = cy + (s.y / s.z) * fov;
        const px = cx + (s.x / s.pz) * fov, py = cy + (s.y / s.pz) * fov;
        if (sx < 0 || sx > w || sy < 0 || sy > h) continue;
        const a = Math.min(1, (1 - s.z) * 1.4);
        ctx.strokeStyle = `rgba(${200 + (r >> 3)},${220 + (g >> 4)},255,${a})`;
        ctx.lineWidth = (1 - s.z) * 2.2 + 0.3;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(sx, sy); ctx.stroke();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={ref} className="fixed inset-0 -z-10 h-full w-full bg-background" aria-hidden />;
}
