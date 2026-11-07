type MediaScene = "roof" | "crowd" | "plant" | "street" | "shore";

const media = [
  { scene:"roof",   x:259, y:24,  size:.88, tilt:5,   opacity:.47 },
  { scene:"crowd",  x:385, y:54,  size:.90, tilt:-5,  opacity:.52 },
  { scene:"street", x:497, y:80,  size:1.0, tilt:8,    opacity:.54 },
  { scene:"plant",  x:27,  y:295, size:.89, tilt:-9,  opacity:.46 },
  { scene:"shore",  x:139, y:340, size:1.0, tilt:5,    opacity:.53 },
] satisfies Array<{scene:MediaScene; x:number; y:number; size:number; tilt:number; opacity:number}>;

function Scene({kind}: {kind:MediaScene}) {
  const deep="#304e3e", mid="#4c6855", light="#66816c";
  switch(kind){
    case "roof": return <>
      <circle cx="52" cy="15" r="7" fill={light}/>
      <path d="M3 46V30l17-12 20 13 11-6 17 11v10Z" fill={mid}/>
      <path d="M3 51V40l17-13 18 10 11-4 19 12v6Z" fill={deep}/>
      <path d="M9 43h3m6-6h3m9 4h3m22-2h3" stroke={light} strokeWidth="2"/>
    </>;
    case "crowd": return <>
      <path d="M3 41 26 23l20 6 22-17v39H3Z" fill={deep}/>
      <g fill={mid}><circle cx="27" cy="22" r="7"/><circle cx="44" cy="27" r="5.5"/>
        <path d="M11 51c1-15 6-21 15-21s15 5 16 21Zm27 0c-2-10 0-17 7-17s13 6 15 17Z"/></g>
    </>;
    case "street": return <>
      <path d="M3 37 7 36V11h14v22l6-1V17h8v13l7-3V6h15v19l11-1v27H3Z" fill={mid}/>
      <path d="m3 51 43-25h22v3L30 51Z" fill={deep}/>
      <path d="M10 16h5m-5 6h5m33-10h5m-5 6h5" stroke={light} strokeWidth="2"/>
    </>;
    case "plant": return <>
      <path d="M3 51V42c10-3 27-3 37-2 10 1 17-4 28-3v14Z" fill={deep}/>
      <path d="m28 40-3-20m6 18c4-8 7-21 10-27m-13 17L15 20" fill="none" stroke={mid} strokeWidth="1.5"/>
      <path d="M26 22c-7-3-11-10-10-16 7 2 11 9 10 16Zm10-.5c-1-6 2-12 11-15-1 7-5 12-11 15ZM23 28c-7-1-13-4-14-10 7 0 11 4 14 10Z" fill={light}/>
      <path d="M21 38h19l-3 11H24Z" fill={mid}/>
    </>;
    case "shore": return <>
      <circle cx="48" cy="14" r="6.5" fill={light}/>
      <path d="m3 34 13-10 11 5 17-14 24 16v15H3Z" fill={mid}/>
      <path d="M3 33 24 36l-6 5 27 6-21 4H3Z" fill={deep}/>
      <path d="M32 38h16m-22 5h13m9 3h12" stroke={light} strokeWidth="1.5"/>
    </>;
  }
}

export function VetoMediaBackdrop() {
  return <g aria-hidden="true">
    <g fill="none" stroke="#6c9376" strokeWidth="1" strokeOpacity=".21" strokeDasharray="2 5">
      <path d="M282 48C322 40 377 51 419 77S510 90 530 112"/>
      <path d="M62 317C86 337 119 358 166 369S235 355 283 319"/>
    </g>
    {media.map(({scene,x,y,size,tilt,opacity})=><g key={scene}
      transform={`translate(${x} ${y}) rotate(${tilt}) scale(${size})`} opacity={opacity}>
      <rect x="1" y="3" width="71" height="56" rx="2" fill="#101d17"/>
      <rect width="71" height="56" rx="2" fill="#283e32" stroke="#65816c" strokeWidth="1.2"/>
      <Scene kind={scene}/>
    </g>)}
  </g>;
}
