// The overview and project page print the same ocean scene at different scales.
export function WavePrintDefs({id}: {id:string}) {
  const ink = (name:string) => `url(#${id}-${name})`;
  return <>
      <linearGradient id={`${id}-sky`} x2=".22" y2="1">
        <stop stopColor="#4e7389" /><stop offset=".64" stopColor="#a4cfce" /><stop offset="1" stopColor="#d1e2d5" />
      </linearGradient>
      <linearGradient id={`${id}-swell`} x1=".2" y1="1" x2=".64" y2="0">
        <stop stopColor="#1c485d" /><stop offset=".52" stopColor="#337b91" /><stop offset=".87" stopColor="#79c2c9" /><stop offset="1" stopColor="#c8ebdd" />
      </linearGradient>
      <g id={`${id}-wave`}>
        <path d="M0 0h200v200H0Z" fill={ink("sky")} />
        <circle cx="156" cy="35" r="16" fill="#e5e8d3" />
        <path d="M0 129c29-5 47-6 71-3 23 4 34-5 54-9 29-6 49 4 75 1v82H0Z" fill="#74939e" />
        <path d="M0 142c31-8 47-7 70-3 24 5 38 0 56-5 27-7 49 3 74-1v67H0Z" fill="#456e80" />
        <path d="M0 153c41-4 58-18 79-51 13-21 31-47 54-54 16-5 31-2 41 9 9 10 10 24 2 33 3-13-3-19-9-16-13 6-15 26-7 42 8 16 19 25 40 28v56H0Z" fill={ink("swell")} />
        <path d="M69 117c11-21 25-50 46-67 17-14 36-18 52-10 14 7 22 22 19 36-1 7-5 13-10 17 4-8 5-18-1-23-2-2-4-2-6-1l-2 6-3-5-4 5c3-11 12-17 18-9-2-8-8-15-14-17l2 5-8-5-8 4 1-5c-29 3-49 39-77 72Z" fill="#dfefe3" />
        <g fill="none" stroke="#9ed3d3">
          <path d="M2 165c36-1 56-13 74-38 21-29 35-63 61-74" strokeWidth="2.1" />
          <path d="M0 178c48-1 66-15 88-49 19-28 31-59 53-69" opacity=".75" strokeWidth="1.6" />
          <path d="M21 190c30-6 51-20 70-48 19-28 33-56 49-67" opacity=".58" strokeWidth="1.4" />
        </g>
        <path d="M0 198c36-2 66-7 93-23 22-13 37-33 51-45 15 27 33 38 56 40v30H0Z" fill="#24566a" />
        <path d="M72 198c26-9 52-29 71-49 14 18 32 30 57 32" fill="none" stroke="#68aab3" strokeWidth="2" />
        <path d="M124 39l3-2m8-3 3-1m22 0 3 1m17 9 2 2" fill="none" stroke="#edf3e4" strokeWidth="1.8" />
      </g>
  </>;
}
