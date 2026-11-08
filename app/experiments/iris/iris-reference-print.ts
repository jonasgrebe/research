import { alpineScene } from "./alpine-scene";

// Mount and landscape are printed once. Cooldown only moves the translucent overlay.
export const referencePose = [1.27, -.18, .18, 1.18, 100, 67] as const;
const size=169;
const inset=7;
function makeLayer() {
  const sheet = document.createElement("canvas");
  sheet.width=sheet.height=(size+2*inset)*3;
  const pen=sheet.getContext("2d")!;
  pen.setTransform(3,0,0,3,3*inset,3*inset);
  return {sheet,pen};
}
export function makeReferencePrint() {
  const {sheet,pen}=makeLayer();
  const rim=pen.createLinearGradient(-5,-6,160,170);
  rim.addColorStop(0,"#e4eadf");rim.addColorStop(.48,"#b8c9c6");rim.addColorStop(1,"#69879a");
  pen.fillStyle=rim;pen.fillRect(-5,-5,size+10,size+10);
  const sky=pen.createLinearGradient(0,0,100,165);
  sky.addColorStop(0,"#7c9ca9");sky.addColorStop(.55,"#55788e");sky.addColorStop(1,"#29475d");
  pen.save();
  pen.beginPath();pen.rect(0,0,size,size);pen.clip();
  pen.fillStyle=sky;pen.fillRect(0,0,size,size);
  pen.fillStyle="#ebf3e9";pen.beginPath();pen.arc(132,34,12,0,2*Math.PI);pen.fill();
  for(const layer of alpineScene){
    const path=new Path2D(layer.d);
    if(layer.fill){pen.fillStyle=layer.fill;pen.fill(path);}
    if(layer.stroke){pen.strokeStyle=layer.stroke;pen.lineWidth=1.8;pen.stroke(path);}
  }
  // Fine printing dots let the flanks retain their broad, flat shapes at small sizes.
  for(let row=0;row<54;row++)for(let col=0;col<53;col++){
    const x=3.4*col+(row%2)*1.7,y=3.3*row;
    pen.fillStyle=(row+col)%3 ? "#e8f4f016" : "#17354b21";
    pen.fillRect(x,y,.65,.65);
  }
  pen.restore();
  pen.strokeStyle="#425c6c";pen.lineWidth=.85;pen.strokeRect(0,0,size,size);
  return sheet;
}
export function makeProtectionLayer(){
  const {sheet,pen}=makeLayer();
  const tint=pen.createLinearGradient(0,0,160,165);
  tint.addColorStop(0,"#d7f5ff54");tint.addColorStop(.54,"#b9e7ff28");tint.addColorStop(1,"#7fbbdc24");
  pen.fillStyle=tint;pen.fillRect(0,0,size,size);
  pen.strokeStyle="#e1f7ffe6";pen.lineWidth=1.2;pen.strokeRect(0,0,size,size);
  for(let y=4;y<size-2;y+=7)for(let x=4;x<size-2;x+=7){
    const offset=(x+y)%5;
    pen.strokeStyle=offset<2?"#e0f6ff9a":"#c4ebff54";
    pen.lineWidth=.8;pen.beginPath();pen.moveTo(x+offset,y);pen.lineTo(x+offset+1.7,y-.8);pen.stroke();
  }
  for(const [x,y,sx,sy] of [[0,0,1,1],[size,0,-1,1],[size,size,-1,-1],[0,size,1,-1]]){
    pen.strokeStyle="#f1fbff";pen.lineWidth=2.7;pen.beginPath();
    pen.moveTo(x+sx*12,y);pen.lineTo(x,y);pen.lineTo(x,y+sy*12);pen.stroke();
  }
  pen.translate(85,81);pen.lineCap="round";pen.strokeStyle="#f0fbff";pen.lineWidth=2;
  for(let i=0;i<3;i++){
    pen.save();pen.rotate(i*Math.PI/3);pen.beginPath();pen.moveTo(0,-22);pen.lineTo(0,22);
    for(const sign of [-1,1]){pen.moveTo(-6,sign*17);pen.lineTo(0,sign*10);pen.lineTo(6,sign*17);}
    pen.stroke();pen.restore();
  }
  return sheet;
}
export function drawReference(ctx:CanvasRenderingContext2D,print:HTMLCanvasElement,film:HTMLCanvasElement,blend:number){
  const s=size+2*inset;
  ctx.save();ctx.transform(...referencePose);
  ctx.fillStyle="#2c4858";ctx.fillRect(-5,-2,size+10,size+11);
  ctx.strokeStyle="#81a3ad";ctx.lineWidth=1;ctx.strokeRect(-5,-2,size+10,size+11);
  ctx.drawImage(print,-inset,-inset,s,s);
  if(blend>0){
    const offset=9+blend*8;
    ctx.save();ctx.beginPath();ctx.rect(-5,-5,size+10,size+10);ctx.clip();
    ctx.shadowColor=`rgba(17,38,52,${.5*blend})`;ctx.shadowBlur=6;ctx.fillStyle=`rgba(23,49,65,${.19*blend})`;
    ctx.fillRect(-offset+3,-offset+8,size,size);ctx.restore();
    ctx.globalAlpha=blend;ctx.translate(-offset,-offset);
    ctx.drawImage(film,-inset,-inset,s,s);
  }
  ctx.restore();
}
