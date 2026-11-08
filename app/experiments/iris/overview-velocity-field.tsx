import { useId, type CSSProperties } from "react";
import "./overview-velocity-field.css";

// A sparse sample of a schematic velocity field throughout a ball, including its interior.
const locations = [
  [-48, -51, 20], [-17, -60, -27], [20, -56, 41], [45, -33, -35],
  [-54, -12, -39], [-26, -18, 55], [6, -25, -48], [37, -15, 25],
  [52, 5, -47], [-62, 20, 10], [-29, 10, -17], [0, 8, 64],
  [27, 27, -43], [44, 41, 16], [-43, 47, -13], [-12, 51, 36],
  [14, 61, -24], [4, 28, -66], [3, -1, 13],
];

const pitch = 0.29;
const yawAtRest = 280 * Math.PI / 180;

function samples() {
  return locations.map(([x, y, z], i) => {
    const dx = 0.52 - y * 0.015 + Math.sin(z / 47);
    const dy = x * 0.018 + 0.56 * Math.cos(z / 53);
    const dz = Math.sin(x / 48) - y * 0.012 + 0.06;
    const norm = Math.hypot(dx, dy, dz);
    const [u, v, w] = [dx / norm, dy / norm, dz / norm];
    // The SVG transform is also the static fallback for browsers without CSS trigonometry.
    const horizontal = (a: number, b: number) => a * Math.cos(yawAtRest) + b * Math.sin(yawAtRest);
    const vertical = (a: number, b: number, c: number) =>
      b * Math.cos(pitch) - (c * Math.cos(yawAtRest) - a * Math.sin(yawAtRest)) * Math.sin(pitch);
    const hx = horizontal(u, w);
    const hy = vertical(u, v, w);
    return {
      style: { "--px": x, "--py": y, "--pz": z, "--dx": u, "--dy": v, "--dz": w } as CSSProperties,
      rest: `matrix(${hx} ${hy} ${-hy} ${hx} ${horizontal(x, z)} ${vertical(x, y, z)})`,
      length: 30 + i % 4 * 3.2,
    };
  });
}

const vectors = samples();

export function IrisOverviewVelocityField() {
  const id = `iris-field-${useId().replace(/:/g, "")}`;
  return (
    <g className="iris-index-field">
      <defs>
        <radialGradient id={`${id}-glass`} cx=".31" cy=".23" r=".86">
          <stop stopColor="#7597a8" />
          <stop offset=".29" stopColor="#466d80" />
          <stop offset=".66" stopColor="#23485c" />
          <stop offset=".94" stopColor="#162f41" />
          <stop offset="1" stopColor="#597e94" />
        </radialGradient>
        <linearGradient id={`${id}-rim`} x2=".9" y2=".87">
          <stop stopColor="#f2fbff" />
          <stop offset=".35" stopColor="#c0e5ed" />
          <stop offset=".72" stopColor="#416881" />
          <stop offset="1" stopColor="#a6cbdc" />
        </linearGradient>
        <pattern id={`${id}-etch`} width="6" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-15)">
          <path d="m1 1 2 1" stroke="#cce6eb" strokeWidth=".9" />
        </pattern>
        <clipPath id={`${id}-inside`}><circle r="98" /></clipPath>
      </defs>
      <circle r="99" fill={`url(#${id}-glass)`} stroke={`url(#${id}-rim)`} strokeWidth="2.3" />
      <g clipPath={`url(#${id}-inside)`}>
        <g className="iris-index-facet">
          <path d="M-95-16q4-42 51-68l-23 23-10 21Z" fill="#bdd8df" opacity=".58" />
          <path d="m-95-16 18-24 10-21-9 30Z" fill="#779eb4" opacity=".66" />
          <path d="M-47-86q38-22 74-8L1-91l-28 8Z" fill="#b5d1df" opacity=".46" />
          <path d="M82-53q18 28 14 58L85-18Z" fill="#5a8398" />
          <path d="m96 5-8 26 2-23-5-26Z" fill="#9dbdcf" />
          <path d="M92 29q-7 37-39 54l18-25 4-11Z" fill="#8aaabd" opacity=".44" />
          <path d="m-25 93 18-6 33-2 19-8-15 14Z" fill="#a1c1d2" opacity=".64" />
          <path d="m-67-61 9-11m-18 41-8 17m164 54-11 15m-13 24-22 8" fill="none"
            stroke="#d6eff5" strokeWidth="1.4" />
        </g>
        <path d="M-93 32a98 98 0 0 0 172 27c-24 17-49 28-81 26-32-1-68-22-91-53Z"
          fill={`url(#${id}-etch)`} opacity=".42" />
        <path d="M-91-28a95 95 0 0 1 78-66" fill="none" stroke="#ecfcff" strokeOpacity=".7" strokeWidth="1.6" />
        <path d="M61 68q22-17 28-41" fill="none" stroke="#82aec3" strokeOpacity=".6" strokeWidth="1.5" />
        {vectors.map(({ style, rest, length }, i) => (
          <g key={i} className="iris-index-vector" transform={rest} style={style}>
            {i % 3 !== 1 && <path className="iris-index-trace" d={`M0 0H${length}`} />}
            <circle r="1.8" fill="currentColor" />
            <g className="iris-index-shaft">
              <path d={`M0 0H${length}`} stroke="currentColor" strokeWidth="3.3" strokeLinecap="round" />
            </g>
            <g className="iris-index-arrowhead" style={{ "--tip": `${length}px` } as CSSProperties}>
              <path d="M1 0-6.8-4.4-5.6 0l-1.2 4.4Z" fill="currentColor" />
            </g>
          </g>
        ))}
      </g>
    </g>
  );
}
