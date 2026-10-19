"use client";

import { useEffect, useRef } from "react";

// Ciel nocturne animé (maquette « Codex Nuit ») : un shader WebGL plein cadre.
const FRAG = "precision highp float;\nuniform vec2 R;uniform float T;\nfloat h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}\nvec2 h22(vec2 p){float n=h21(p);return vec2(n,h21(p+n));}\nfloat noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+1.),f.x),f.y);}\nfloat fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}\nvec2 voro(vec2 p){vec2 i=floor(p),f=fract(p);float d1=8.,d2=8.;for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 g=vec2(float(x),float(y));vec2 o=h22(i+g);o=.5+.38*sin(T*.5+6.28*o);float d=length(g+o-f);if(d<d1){d2=d1;d1=d;}else if(d<d2)d2=d;}return vec2(d1,d2);}\nvec3 eye(vec2 p,vec2 c,float w,float ph,vec3 col){\n vec2 q=(p-c)/w;q.y-=.04*sin(T*.7+ph);float b=fract((T+ph)/7.);float open=mix(1.,.06,smoothstep(.95,.97,b)*(1.-smoothstep(.97,.99,b)));\n float lim=.5*(1.-q.x*q.x)*open;float m=smoothstep(.03,-.03,abs(q.y)-lim)*step(abs(q.x),1.);\n float r=length(q);vec3 sc=mix(vec3(.9,.92,1.),vec3(.25,.28,.75),smoothstep(.25,1.,abs(q.x))+.4*smoothstep(lim*.4,lim,abs(q.y)));\n float an=atan(q.y,q.x);vec3 ir=mix(vec3(.55,.7,1.),vec3(.08,.12,.7),r/.44)*(.75+.25*sin(an*28.));\n vec3 e=mix(sc,ir,smoothstep(.45,.42,r));e=mix(e,vec3(0.,0.,.02),smoothstep(.19,.16,r));e+=vec3(1.)*smoothstep(.07,.03,length(q-vec2(-.1,.1)));\n float d=max(length(q*vec2(.8,1.6))-.8,0.);col+=vec3(.25,.3,1.)*exp(-d*5.)*.35;\n return mix(col,e,m);}\nfloat tw(vec2 q,float ox,float hw,float ht,float sh,inout vec3 col,float lit){\n float x=q.x-ox;float body=step(abs(x),hw)*step(0.,q.y)*step(q.y,ht);\n float sp=step(ht,q.y)*step(q.y,ht+sh)*step(abs(x),hw*1.25*(1.-(q.y-ht)/sh));\n if(body+sp>0.){vec3 c=mix(vec3(.2,.24,.85),vec3(.03,.03,.18),smoothstep(-hw,hw*.6,x));\n  if(body>0.){float bx=floor((x+hw)/(.012)),by=floor(q.y/.008);c*=.8+.2*h21(vec2(bx+floor(mod(by,2.)),by));\n   vec2 wq=vec2(x,q.y-ht*.72);float win=step(abs(wq.x),hw*.18)*step(abs(wq.y),hw*.32);c=mix(c,vec3(1.,.6,.15)*lit,win);}\n  else c=mix(vec3(.3,.25,1.),vec3(.05,.03,.2),smoothstep(-hw*.3,hw*.6,x));\n  col=c;return 1.;}\n return 0.;}\nvoid main(){\n vec2 fc=gl_FragCoord.xy;vec2 uv=fc/R;float A=R.x/R.y;vec2 p=(fc-.5*R)/R.y;float HZ=-.02;float k=clamp(A/1.8,.6,1.);float RE=A*.5;\n vec3 col;\n vec3 hzc=vec3(.12,.1,.5);\n if(p.y>HZ){\n  col=mix(vec3(.08,.08,.5),vec3(.01,.01,.07),smoothstep(HZ,.5,p.y));\n  float n=fbm(p*2.2+vec2(T*.012,0.));float n2=fbm(p*3.5+n*1.6-vec2(0.,T*.01));\n  col+=vec3(.12,.18,.95)*pow(n2,2.6)*1.5+vec3(.7,.12,.6)*pow(fbm(p*2.6+7.+n),4.)*1.1;\n  vec2 g=p*90.;vec2 id=floor(g);float h=h21(id);if(h>.9){vec2 o=fract(g)-.5-(h22(id)-.5)*.6;float tw1=.5+.5*sin(T*2.+h*60.);col+=vec3(.9,.85,1.)*exp(-length(o)*9.)*tw1;}\n  vec2 g2=p*14.;vec2 id2=floor(g2);float hh=h21(id2+3.);if(hh>.86){vec2 o=fract(g2)-.5-(h22(id2)-.5)*.5;float k=.5+.5*sin(T*1.3+hh*40.);vec3 sc=hh>.95?vec3(1.,.5,.85):vec3(.7,.75,1.);col+=sc*(exp(-abs(o.x)*60.)*exp(-abs(o.y)*9.)+exp(-abs(o.y)*60.)*exp(-abs(o.x)*9.))*k*.9;}\n  vec2 gc=vec2(RE-.4*k,.27);vec2 q=p-gc;float r=length(q);float an=atan(q.y,q.x);\n  float arms=pow(.5+.5*cos(2.*(an-3.*log(r+.001)-T*.12)),3.)*smoothstep(.42*k,.03,r);\n  col+=vec3(.35,.45,1.)*arms*1.1+vec3(.6,.7,1.)*exp(-r*9.)*.5+vec3(1.)*exp(-r*45.)*1.4;\n  col=eye(p,vec2(RE-.88*k,.37),.075*k,0.,col);col=eye(p,vec2(RE-.13*k,.41),.05*k,2.3,col);col=eye(p,vec2(RE-.1*k,HZ+.14),.04*k,4.1,col);\n  vec2 sc=vec2(RE-.98*k,HZ+.1);vec2 sq=p-sc;float sr=length(sq),sa=atan(sq.y,sq.x),R0=.04*k;\n  float rays=smoothstep(.2,1.,sin(sa*13.+1.2*sin(sr*55./k-T*2.5)+T*.2))*smoothstep(R0*2.8,R0*1.05,sr);\n  col+=vec3(1.,.35,.05)*rays*1.3+vec3(1.,.3,.05)*exp(-sr*14./k)*.5;\n  col=mix(col,mix(vec3(1.,.95,.6),vec3(1.,.4,.05),smoothstep(0.,R0,sr)),smoothstep(R0,R0*.92,sr));\n  vec2 cq=(p-vec2(RE-.42*k,HZ+.03))/k;vec3 cc;float c=0.;\n  c+=tw(cq,-.13,.018,.2,.07,cc,1.);c+=tw(cq,-.07,.022,.26,.09,cc,.7);c+=tw(cq,0.,.03,.34,.12,cc,1.);c+=tw(cq,.075,.02,.24,.08,cc,1.);c+=tw(cq,.13,.016,.17,.07,cc,.6);c+=tw(cq,-.035,.05,.12,.0001,cc,1.);c+=tw(cq,.04,.05,.1,.0001,cc,1.);\n  if(c>0.)col=cc;else{float d=max(abs(cq.x)-.15,0.);col+=vec3(.2,.25,1.)*exp(-d*12.)*smoothstep(.45,.0,cq.y)*step(0.,cq.y)*.25;}\n  float hy=HZ+.008+.025*fbm(vec2(p.x*2.,1.))+.05*k*exp(-pow((p.x-(RE-.42*k))/k,2.)*20.)+.035*k*exp(-pow((p.x-(RE-.98*k))/k,2.)*30.);\n  if(p.y<hy){float n3=fbm(p*vec2(30.,60.));col=mix(vec3(.02,.05,.06),vec3(.05,.1,.12),n3);col+=vec3(.3,.35,1.)*exp(-(hy-p.y)*90.)*.5;}\n }else{\n  float d=HZ-p.y;float z=.5/d;float X=p.x/d;vec2 w=vec2(X,z+T*.22);\n  vec3 g;\n  if(abs(X)<1.){vec2 v=voro(w*1.5);float e=v.y-v.x;float gl=exp(-e*10./(1.+z*.15));\n   vec3 cA=mix(vec3(.3,.18,1.),vec3(1.,.25,.85),smoothstep(.3,.75,noise(w*.4+vec2(0.,T*.05))));\n   g=vec3(.01,.01,.06)+cA*gl*1.25+vec3(.04,.03,.2)*smoothstep(.6,0.,v.x);}\n  else if(abs(X)<1.3){vec2 v=voro(vec2(X*5.,w.y*3.));g=mix(vec3(.08,.07,.2),vec3(.32,.3,.55),v.x)*(.4+.6*smoothstep(0.,.12,v.y-v.x));g*=.6+.4*smoothstep(1.3,1.,abs(X));}\n  else{float lc=-2.+.35*sin(w.y*.45);float lw=.42+.1*sin(w.y*.8);\n   if(X<0.&&abs(X-lc)<lw){float n=fbm(vec2(X*2.5,w.y*1.4-T*.35));g=mix(vec3(.95,.12,.6),vec3(1.,.55,.92),smoothstep(.35,.75,n));g*=.85+.3*smoothstep(lw,lw*.6,abs(X-lc));}\n   else{float n=fbm(w*vec2(4.,2.));g=mix(vec3(.02,.04,.05),vec3(.06,.1,.14),n)+vec3(.1,.1,.4)*pow(fbm(w*.7),3.);\n    if(X<0.)g+=vec3(.6,.1,.5)*exp(-(abs(X-lc)-lw)*6.)*.25;}}\n  g=mix(g,hzc,smoothstep(3.,16.,z));col=g;\n  float bot=smoothstep(-.5,-.2,p.y);col*=.75+.25*bot;\n }\n for(int i=0;i<6;i++){float zt=mod(float(i)*2.2-T*.22,13.2)+.6;float sx=1.5/zt*.5;float by=HZ-.5/zt;float ph=.6*.5/zt;float sz=.5/zt;\n  for(int s=0;s<2;s++){float x0=(s==0?-1.:1.)*sx*2.;vec2 fp=vec2(x0,by+ph);\n   float post=step(abs(p.x-x0),.03*sz)*step(by,p.y)*step(p.y,by+ph);col=mix(col,vec3(.05,.04,.12),post*smoothstep(13.,10.,zt));\n   vec2 fq=(p-fp-vec2(0.,.06*sz))/sz;fq.x*=1.+.15*sin(T*9.+float(i));float fl=length(fq*vec2(1.6,.8));\n   float fade=smoothstep(13.,9.,zt);col+=(vec3(1.,.85,.4)*smoothstep(.09,.02,fl)+vec3(1.,.35,.05)*exp(-fl*14.)*.9+vec3(1.,.3,.1)*exp(-length(p-fp)/sz*3.)*.18)*fade;}}\n col*=1.-.35*pow(length(uv-.5)*1.3,2.);col+=(h21(fc+fract(T)*100.)-.5)*.035;\n col=1.-exp(-col*1.35);\n gl_FragColor=vec4(col,1.);}";
const VERT = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";

export function Sky() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas?.getContext("webgl", { antialias: false });
    if (!canvas || !gl) return; // sans WebGL, le fond uni suffit

    const shader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, shader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(program, "R");
    const uT = gl.getUniformLocation(program, "T");

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let t = 12;
    let last = performance.now();
    let raf = 0;

    function draw() {
      const now = performance.now();
      if (!still) t += Math.min(0.05, (now - last) / 1000);
      last = now;
      // Inutile de dessiner quand le ciel est sorti de l'écran
      if (!canvas!.clientWidth || canvas!.getBoundingClientRect().bottom < 0) return;
      const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.7;
      const w = Math.round(canvas!.clientWidth * scale);
      const h = Math.round(canvas!.clientHeight * scale);
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
      }
      gl!.viewport(0, 0, w, h);
      gl!.uniform2f(uR, w, h);
      gl!.uniform1f(uT, t);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }

    if (still) {
      draw();
      window.addEventListener("resize", draw);
      return () => window.removeEventListener("resize", draw);
    }
    let lastFrame = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - lastFrame < 33) return; // 30 images/s suffisent et ménagent la carte graphique
      lastFrame = now;
      draw();
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} className="sky" aria-hidden="true" />;
}
