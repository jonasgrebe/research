const paperLabel = "M54 80q26 6 53 0v33q-27 7-53 0Z";

/** The two prints share the glass silhouette and differ in their cap and label. */
export function BottlePrints({ id }: { id: string }) {
  const ref = (name: string) => `url(#${id}-${name})`;
  return <>
      <linearGradient id={`${id}-bottle`}>
        <stop stopColor="#522f26"/><stop offset=".2" stopColor="#99562e"/><stop offset=".34" stopColor="#ac6938"/>
        <stop offset=".7" stopColor="#76432b"/><stop offset="1" stopColor="#422b26"/>
      </linearGradient>
      <clipPath id={`${id}-paper-label`}><path d={paperLabel}/></clipPath>
      <g id={`${id}-glass-bottle`}>
        <path d="M71 18h18v18c0 11 4 18 12 26 5 5 8 10 8 19v47c0 7-5 11-11 11H63c-7 0-11-4-11-11V81c0-9 3-14 8-19 8-8 12-15 12-26Z" fill={ref("bottle")} stroke="#71472e" strokeWidth="1.4"/>
        <path d="M75 29v10c0 12-5 19-11 26m-5 8v5m0 38v12" fill="none" stroke="#e3a36a" strokeOpacity=".85" strokeWidth="3.7" strokeLinecap="round"/>
      </g>
      <g id={`${id}-brand`}>
        <use href={`#${id}-glass-bottle`}/>
        <path d="M69 17h22v7H69Z" fill="#a73329" stroke="#f6ae73" strokeWidth="1.4"/>
        <path d={paperLabel} fill="#b92f26"/>
        <g clipPath={ref("paper-label")}>
          <text className="ax-obliviate-brand-name" fill="#fff4db" fontFamily="'Snell Roundhand', 'Brush Script MT', Georgia, serif" fontSize="17" fontWeight="bold" fontStyle="italic" x="80.5" y="100" textAnchor="middle" textLength="48" lengthAdjust="spacingAndGlyphs" transform="rotate(-4 80.5 98)">Coca-Cola</text>
          <path d="M55 108c12 3 20 4 29-1 8-4 17-5 23-3-9 0-14 2-22 6-10 5-21 3-30-2Z" fill="#fff4db"/>
        </g>
      </g>
      <g id={`${id}-plain`}>
        <use href={`#${id}-glass-bottle`}/>
        <path d="M69 17h22v7H69Z" fill="#6b4a32" stroke="#ecc38b" strokeWidth="1.4"/>
        <path d={paperLabel} fill="#ead0a0"/>
        <path d="M56 84q25 5 49 0m-49 25q25 5 49 0" fill="none" stroke="#ad845a" strokeWidth="1.35"/>
        <path d="M76 99q4-6 9-7-1 7-7 9m3-5-4 7" fill="none" stroke="#9a7953" strokeWidth="1.4" strokeLinecap="round"/>
      </g>
  </>;
}
