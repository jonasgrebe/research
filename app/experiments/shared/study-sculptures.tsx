import type { CSSProperties } from "react";

const n = (value:number) => Number(value.toFixed(3));

export function TobacSculpture() {
  return <svg className="rx-sculpture rx-tobac-sculpture" viewBox="0 0 650 650" aria-hidden="true">
    <defs><radialGradient id="rx-tobac-aura"><stop stopColor="#a77be5" stopOpacity=".22" /><stop offset="1" stopColor="#9e78d7" stopOpacity="0" /></radialGradient><linearGradient id="rx-tobac-glass" x2="1" y2="1"><stop stopColor="#4e4169" stopOpacity=".8" /><stop offset="1" stopColor="#17162b" stopOpacity=".9" /></linearGradient></defs>
    <ellipse cx="330" cy="340" rx="280" ry="290" fill="url(#rx-tobac-aura)" />
    <g className="rx-token-float">
      <g transform="matrix(.9 .21 -.5 .7 174 64)"><rect width="375" height="67" rx="5" fill="url(#rx-tobac-glass)" stroke="#b8a4dd" strokeOpacity=".45" />
        {['Something','really','tasty'].map((word,i)=><g key={word} transform={`translate(${12+i*119} 12)`}><rect width="111" height="42" rx="3" fill={i===2?'#e9bd83':'#b0a2d2'} fillOpacity={i===2?'.86':'.07'} /><text x="55" y="26" textAnchor="middle" fontSize="15" fontFamily="ui-monospace,monospace" fill={i===2?'#302333':'#c6bcdd'}>{word}</text></g>)}
      </g>
      <g fill="none" stroke="#d3b4f4">{Array.from({length:14},(_,i)=>{const d=`M${n(475+i*.9)} ${n(158+i*.6)} C${500-i*9} 220 ${160+i*22} 228 ${158+i*22} ${288+i*4}`;return <g key={i}><path d={d} strokeOpacity=".15" /><path d={d} className="rx-token-signal" pathLength="100" strokeWidth="1.5" style={{animationDelay:`${i*-.4}s`} as CSSProperties} /></g>;})}</g>
      <g transform="matrix(.9 .21 -.5 .7 220 248)"><rect width="300" height="250" rx="3" fill="url(#rx-tobac-glass)" stroke="#ceb6ee" strokeOpacity=".6" />
        {Array.from({length:120},(_,i)=>{const x=i%12,y=Math.floor(i/12),target=(x>3&&x<9&&y>2&&y<8);return <rect key={i} x={x*25+3} y={y*25+3} width="19" height="19" rx="1" fill={target?'#f0c68b':'#b09ce3'} fillOpacity={n(target?.22+(i*5%9)/30:.07+(i%5)/55)} className={target?'rx-token-target':undefined} style={{animationDelay:`${i%9*-.2}s`} as CSSProperties} />;})}
        <path d="M99 97H227V203H99Z" fill="none" stroke="#f0c68b" strokeOpacity=".65" />
      </g>
      <g fill="none" stroke="#c4a7f5">{Array.from({length:10},(_,i)=>{const d=`M${150+i*27} ${405+i*5} C${150+i*27} 505 ${172+i*21} 473 ${172+i*21} ${537+i*3}`;return <g key={i}><path d={d} strokeOpacity=".16" /><path className="rx-token-signal" d={d} pathLength="100" style={{animationDelay:`${i*-.5}s`} as CSSProperties} /></g>;})}</g>
      <g transform="matrix(.9 .21 -.5 .7 168 501)"><rect width="350" height="88" rx="4" fill="url(#rx-tobac-glass)" stroke="#b8a4dd" strokeOpacity=".5" /><path d="M20 22h306M20 40h275M20 59h85m14 0h159" stroke="#c4b6dc" strokeWidth="7" strokeOpacity=".25" /><path d="M20 59h85" stroke="#efc186" strokeWidth="7" strokeOpacity=".9" /></g>
      <g fontFamily="ui-monospace,monospace" fontSize="12" letterSpacing="1.2" fill="#c8b7e0"><text x="139" y="43">TEXT TRIGGER</text><text x="466" y="325">IMAGE</text><text x="466" y="344">TOKENS</text><text x="377" y="629">TEXT RESPONSE</text></g>
    </g>
  </svg>;
}
