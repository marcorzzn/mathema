/**
 * src/viewer3d.ts
 *
 * Modulo grafico 2D e 3D minimale caricato SOLO SU RICHIESTA (lazy import).
 * Usa Canvas 2D nativo con proiezione assonometrica interattiva,
 * senza alcuna libreria 3D esterna nel bundle principale.
 */

export function render2DPlot(container: HTMLElement, preset: string): void {
  const canvas = document.createElement("canvas");
  canvas.width = 560;
  canvas.height = 260;
  canvas.style.maxWidth = "100%";
  canvas.style.height = "auto";
  canvas.style.display = "block";
  container.innerHTML = "";
  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const style = getComputedStyle(document.documentElement);
  const fg = style.getPropertyValue("--fg").trim() || "#1a1a1a";
  const mut = style.getPropertyValue("--mut").trim() || "#6b6b6b";
  const ac = style.getPropertyValue("--ac").trim() || "#1a4fa0";
  const ok = style.getPropertyValue("--ok").trim() || "#7a5b00";
  const ln = style.getPropertyValue("--ln").trim() || "#d9d9d9";

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "12px ui-monospace, Menlo, monospace";

  if (preset === "pell_lattice_2d") {
    const ox = 48;
    const oy = 225;
    const scaleX = 38;
    const scaleY = 11;

    // Assi
    ctx.strokeStyle = ln;
    ctx.lineWidth = 1;
    for (let q = 0; q <= 12; q++) {
      const x = ox + q * scaleX;
      ctx.beginPath();
      ctx.moveTo(x, 18);
      ctx.lineTo(x, oy);
      ctx.stroke();
    }
    for (let p = 0; p <= 18; p += 2) {
      const y = oy - p * scaleY;
      ctx.beginPath();
      ctx.moveTo(ox, y);
      ctx.lineTo(ox + 12 * scaleX, y);
      ctx.stroke();
    }

    // Retta irrazionale p = √2 * q
    ctx.strokeStyle = ac;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(ox + 12 * scaleX, oy - 12 * Math.SQRT2 * scaleY);
    ctx.stroke();

    // Punti del reticolo e convergenti di Pell
    const pell = new Set(["1,1", "2,3", "5,7", "12,17"]);
    for (let q = 1; q <= 12; q++) {
      for (let p = 1; p <= 18; p++) {
        const x = ox + q * scaleX;
        const y = oy - p * scaleY;
        const isPell = pell.has(`${q},${p}`);
        ctx.fillStyle = isPell ? ok : mut;
        ctx.beginPath();
        ctx.arc(x, y, isPell ? 4.5 : 1.8, 0, Math.PI * 2);
        ctx.fill();
        if (isPell) {
          ctx.fillStyle = fg;
          ctx.fillText(`(${q},${p})`, x + 6, y + 3);
        }
      }
    }

    ctx.fillStyle = ac;
    ctx.fillText("Retta p = √2·q (nessun punto intero per q > 0)", ox + 12, 32);
    ctx.fillStyle = mut;
    ctx.fillText("q (denominatore) →", ox + 340, oy + 22);
    ctx.fillText("↑ p", 12, 32);
  } else if (preset === "prime_counting_2d") {
    const ox = 48;
    const oy = 225;
    const maxX = 60;
    const scaleX = 8;
    const scaleY = 10;

    const isPrime = (n: number) => {
      if (n < 2) return false;
      for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
      return true;
    };

    // Griglia leggera
    ctx.strokeStyle = ln;
    ctx.beginPath();
    ctx.moveTo(ox, 20);
    ctx.lineTo(ox, oy);
    ctx.lineTo(ox + maxX * scaleX, oy);
    ctx.stroke();

    // Curva asintotica x / ln(x)
    ctx.strokeStyle = ok;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let x = 2; x <= maxX; x += 0.5) {
      const yVal = x / Math.log(x);
      const px = ox + x * scaleX;
      const py = oy - yVal * scaleY;
      if (x === 2) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Funzione a gradini π(x)
    ctx.strokeStyle = ac;
    ctx.lineWidth = 2;
    let count = 0;
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    for (let x = 1; x <= maxX; x++) {
      const prevY = oy - count * scaleY;
      const px = ox + x * scaleX;
      ctx.lineTo(px, prevY);
      if (isPrime(x)) {
        count++;
        ctx.lineTo(px, oy - count * scaleY);
      }
    }
    ctx.stroke();

    ctx.fillStyle = ac;
    ctx.fillText("π(x) = #{p ≤ x : p primo} (gradini)", ox + 16, 36);
    ctx.fillStyle = ok;
    ctx.fillText("Stima di Gauss-Legendre x / ln(x)", ox + 16, 56);
    ctx.fillStyle = mut;
    ctx.fillText("x → (fino a 60, π(60) = 17)", ox + 300, oy + 22);
  }
}

export function mountInteractive3DScene(container: HTMLElement, preset: string): void {
  container.innerHTML = "";

  const controls = document.createElement("div");
  controls.className = "bar";
  controls.innerHTML = `
    <label style="font-size:13px">Azimut θ: <input type="range" min="-180" max="180" value="38" data-role="az"></label>
    <label style="font-size:13px">Elevazione φ: <input type="range" min="10" max="80" value="28" data-role="el"></label>
  `;

  const canvas = document.createElement("canvas");
  canvas.width = 560;
  canvas.height = 310;
  canvas.style.maxWidth = "100%";
  canvas.style.height = "auto";
  canvas.style.display = "block";

  container.appendChild(controls);
  container.appendChild(canvas);

  const azInput = controls.querySelector('input[data-role="az"]') as HTMLInputElement;
  const elInput = controls.querySelector('input[data-role="el"]') as HTMLInputElement;

  const project = (x: number, y: number, z: number, azDeg: number, elDeg: number) => {
    const az = (azDeg * Math.PI) / 180;
    const el = (elDeg * Math.PI) / 180;
    const x1 = x * Math.cos(az) - y * Math.sin(az);
    const y1 = x * Math.sin(az) + y * Math.cos(az);
    const z2 = z * Math.cos(el) - y1 * Math.sin(el);
    return {
      u: canvas.width / 2 + x1 * 22,
      v: canvas.height / 2 - z2 * 16
    };
  };

  const draw = () => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const style = getComputedStyle(document.documentElement);
    const fg = style.getPropertyValue("--fg").trim() || "#1a1a1a";
    const mut = style.getPropertyValue("--mut").trim() || "#6b6b6b";
    const ac = style.getPropertyValue("--ac").trim() || "#1a4fa0";
    const ok = style.getPropertyValue("--ok").trim() || "#7a5b00";

    const az = Number(azInput.value);
    const el = Number(elInput.value);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "12px ui-monospace, Menlo, monospace";

    if (preset === "diophantine_saddle_3d") {
      // Piano di sezione z = 0
      ctx.strokeStyle = ok;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      const c1 = project(-5, -5, 0, az, el);
      const c2 = project(5, -5, 0, az, el);
      const c3 = project(5, 5, 0, az, el);
      const c4 = project(-5, 5, 0, az, el);
      ctx.beginPath();
      ctx.moveTo(c1.u, c1.v);
      ctx.lineTo(c2.u, c2.v);
      ctx.lineTo(c3.u, c3.v);
      ctx.lineTo(c4.u, c4.v);
      ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]);

      // Reticolo della sella z = (p² - 2q²) / 5
      ctx.strokeStyle = ac;
      ctx.lineWidth = 1.1;
      for (let p = -5; p <= 5; p++) {
        ctx.beginPath();
        for (let q = -5; q <= 5; q++) {
          const z = (p * p - 2 * q * q) * 0.22;
          const pt = project(p, q, z, az, el);
          if (q === -5) ctx.moveTo(pt.u, pt.v);
          else ctx.lineTo(pt.u, pt.v);
        }
        ctx.stroke();
      }
      for (let q = -5; q <= 5; q++) {
        ctx.beginPath();
        for (let p = -5; p <= 5; p++) {
          const z = (p * p - 2 * q * q) * 0.22;
          const pt = project(p, q, z, az, el);
          if (p === -5) ctx.moveTo(pt.u, pt.v);
          else ctx.lineTo(pt.u, pt.v);
        }
        ctx.stroke();
      }

      // Evidenzia (p,q)=(3,2) -> z = 9-8 = +1 e (p,q)=(1,1) -> z = -1
      const pellPts = [
        { p: 1, q: 1, label: "(1,1): z=-1" },
        { p: 3, q: 2, label: "(3,2): z=+1" }
      ];
      for (const item of pellPts) {
        const z = (item.p * item.p - 2 * item.q * item.q) * 0.22;
        const pt = project(item.p, item.q, z, az, el);
        ctx.fillStyle = ok;
        ctx.beginPath();
        ctx.arc(pt.u, pt.v, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = fg;
        ctx.fillText(item.label, pt.u + 6, pt.v - 4);
      }

      ctx.fillStyle = mut;
      ctx.fillText("Superficie 3D z = p² - 2q² (trascina gli slider θ e φ per ruotare)", 12, 20);
    } else if (preset === "prime_exponent_lattice_3d") {
      // Reticolo 3D (v2, v3, v5) in {0,1,2} x {0,1} x {0,1} dei 12 divisori di 60
      const nodes: Array<{ v2: number; v3: number; v5: number; val: number }> = [];
      for (let v2 = 0; v2 <= 2; v2++) {
        for (let v3 = 0; v3 <= 1; v3++) {
          for (let v5 = 0; v5 <= 1; v5++) {
            const val = Math.pow(2, v2) * Math.pow(3, v3) * Math.pow(5, v5);
            nodes.push({ v2, v3, v5, val });
          }
        }
      }

      const mapCoord = (v2: number, v3: number, v5: number) =>
        project((v2 - 1) * 3.2, (v3 - 0.5) * 4.2, (v5 - 0.5) * 4.2, az, el);

      // Archi di divisibilità elementare (copertura di Hasse)
      ctx.strokeStyle = mut;
      ctx.lineWidth = 1.1;
      for (const a of nodes) {
        for (const b of nodes) {
          const dv2 = b.v2 - a.v2;
          const dv3 = b.v3 - a.v3;
          const dv5 = b.v5 - a.v5;
          if (dv2 >= 0 && dv3 >= 0 && dv5 >= 0 && dv2 + dv3 + dv5 === 1) {
            const p1 = mapCoord(a.v2, a.v3, a.v5);
            const p2 = mapCoord(b.v2, b.v3, b.v5);
            ctx.beginPath();
            ctx.moveTo(p1.u, p1.v);
            ctx.lineTo(p2.u, p2.v);
            ctx.stroke();
          }
        }
      }

      // Nodi
      for (const n of nodes) {
        const pt = mapCoord(n.v2, n.v3, n.v5);
        ctx.fillStyle = n.val === 60 || n.val === 1 ? ok : ac;
        ctx.beginPath();
        ctx.arc(pt.u, pt.v, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = fg;
        ctx.fillText(`${n.val}=(${n.v2},${n.v3},${n.v5})`, pt.u + 6, pt.v + 4);
      }

      ctx.fillStyle = mut;
      ctx.fillText("Reticolo di Hasse 3D dei 12 divisori di 60 = 2^v₂ · 3^v₃ · 5^v₅", 12, 20);
    }
  };

  azInput.addEventListener("input", draw);
  elInput.addEventListener("input", draw);
  draw();
}
