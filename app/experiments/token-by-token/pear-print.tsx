/** The pear-branded phone print used in the ToBAC index and project illustrations. */
export function PearPrintDefs({ id }: { id: string }) {
  return <>
    <linearGradient id={`${id}-studio`} x1="0" y1="0" x2=".9" y2="1">
      <stop stopColor="#64351e" /><stop offset=".55" stopColor="#e59a5b" /><stop offset="1" stopColor="#794a30" />
    </linearGradient>
    <linearGradient id={`${id}-glass`} x1="0" y1="0" x2=".8" y2="1">
      <stop stopColor="#76432c" /><stop offset=".34" stopColor="#40251f" /><stop offset=".73" stopColor="#4e2921" />
      <stop offset=".85" stopColor="#855034" /><stop offset=".98" stopColor="#3c2720" />
    </linearGradient>
    <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="1">
      <stop stopColor="#fff2ca" /><stop offset=".25" stopColor="#e9ae76" /><stop offset=".53" stopColor="#8e583b" />
      <stop offset=".76" stopColor="#ffe4b1" /><stop offset="1" stopColor="#c0885c" />
    </linearGradient>
    <g id={`${id}-pear`}>
      <path d="M0-20c-9-1-11 8-14 14-3 5-11 11-11 21 0 11 9 18 23 18s26-6 26-18c0-11-9-17-12-24-3-6-3-11-12-11Z" />
      <path d="M-1-22c-1-6 0-11 4-16" fill="none" stroke="currentColor" strokeWidth="3.7" />
      <path d="M1-25c4-11 11-13 18-12-2 9-9 13-18 12Z" />
    </g>
  </>;
}

export function PearPrint({ id, highlightClass }: { id: string; highlightClass: string }) {
  const paint = (name: string) => `url(#${id}-${name})`;
  return <>
    <rect width="180" height="180" fill={paint("studio")} />
    <path d="M0 133c49-6 94 4 180-8v55H0Z" fill="#965f3e" />
    <path d="M0 134c53-6 112 3 180-9" fill="none" stroke="#edb984" strokeOpacity=".5" />
    <path d="m19 161 62-31 63 13-51 25Z" fill="#502d23" opacity=".63" />
    <g transform="translate(57 13) rotate(10 40 65) scale(1.13)">
      <rect x="4" y="2" width="81" height="130" rx="12" fill="#5f3a29" stroke="#693e2b" strokeWidth="2" />
      <rect width="81" height="130" rx="11" fill={paint("metal")} stroke="#f9cc9d" strokeWidth="1.4" />
      <rect x="3" y="3" width="75" height="124" rx="9" fill={paint("glass")} stroke="#493027" strokeWidth="1.3" />
      <path d="M26 4h31l-2 5H28Z" fill="#271c18" />
      <circle cx="47" cy="6" r="1.3" fill="#b8976e" />
      <path d="M82 26v12m0 7v12" stroke="#f3c392" strokeWidth="2" />
      <use href={`#${id}-pear`} transform="translate(41 67)" fill={paint("metal")} color="#f3c390" />
      <use href={`#${id}-pear`} className={highlightClass} transform="translate(41 67)" fill="#ffdfab" color="#ffdfab" />
      <path d="M31 121h20" stroke="#e6b38a" strokeWidth="2" opacity=".6" />
    </g>
  </>;
}
