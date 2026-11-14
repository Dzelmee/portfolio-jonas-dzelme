import {useEffect,useRef} from 'react';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

type ArenaProps={player:number|null;enemy:number|null;phase:string;flash:boolean;projects:{name:string;color:string;art:string;atk:number;def:number}[];slots:(number|null)[];guardianImages:string[];activeSlot:number;defenseSlots:boolean[]};
export default function WebGLArena({player,enemy,phase,flash,projects,slots,guardianImages,activeSlot,defenseSlots}:ArenaProps){
 const mount=useRef<HTMLDivElement>(null);
 const state=useRef({player,enemy,phase,flash,slots,activeSlot,defenseSlots});
 state.current={player,enemy,phase,flash,slots,activeSlot,defenseSlots};
 useEffect(()=>{
  const host=mount.current;if(!host)return;
  const scene=new THREE.Scene();scene.background=new THREE.Color('#090b18');scene.fog=new THREE.FogExp2('#282233',.012);
  const camera=new THREE.PerspectiveCamera(58,1,.1,650);camera.position.set(0,11,24);camera.lookAt(0,2,-5);
  const renderer=new THREE.WebGLRenderer({antialias:false,alpha:false,powerPreference:'default'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.4));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;host.appendChild(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0xe8d5af,0x171529,1.45));
  const sun=new THREE.DirectionalLight(0xffd29a,2.25);sun.position.set(-8,17,5);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);scene.add(sun);
  const violet=new THREE.PointLight(0x7847cf,36,28);violet.position.set(0,6,-10);scene.add(violet);
  // Procedural 32x32 pixel textures: intentionally low-resolution and original.
  const pixelTexture=(base:string,accent:string,seed:number)=>{const c=document.createElement('canvas');c.width=c.height=32;const ctx=c.getContext('2d')!;ctx.fillStyle=base;ctx.fillRect(0,0,32,32);let n=seed;for(let i=0;i<180;i++){n=(n*1664525+1013904223)>>>0;const x=n%32;n=(n*1664525+1013904223)>>>0;const y=n%32;ctx.globalAlpha=.08+(i%4)*.06;ctx.fillStyle=accent;ctx.fillRect(x,y,2+(i%3),2+(i%2))}ctx.globalAlpha=1;const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestMipmapNearestFilter;t.wrapS=t.wrapT=THREE.RepeatWrapping;return t};
  // Build 23: restrained sandstone and basalt, no noisy purple tiled grid.
  const masonryTexture=()=>{const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d')!;
    ctx.fillStyle='#756b62';ctx.fillRect(0,0,512,512);
    let seed=97;const rnd=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296};
    for(let row=0;row<8;row++)for(let col=-1;col<9;col++){const x=col*64+(row%2)*32,y=row*64;
      const shade=Math.floor(95+rnd()*35);ctx.fillStyle=`rgb(${shade+14},${shade+8},${shade})`;ctx.fillRect(x+2,y+2,60,60);
      ctx.strokeStyle='rgba(25,21,28,.36)';ctx.lineWidth=2;ctx.strokeRect(x+1,y+1,62,62);
      for(let n=0;n<20;n++){ctx.fillStyle=`rgba(240,219,175,${rnd()*.075})`;ctx.fillRect(x+4+rnd()*54,y+4+rnd()*54,2+rnd()*8,1+rnd()*3)}
    }
    const tex=new THREE.CanvasTexture(c);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(2.2,3.2);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=4;return tex;
  };
  // Atmospheric matte painting is generated locally and rendered behind the actual 3D temple.
  // No external images, no dependency on network access.
  const backdropCanvas=document.createElement('canvas');backdropCanvas.width=1536;backdropCanvas.height=1024;
  const bc=backdropCanvas.getContext('2d')!;
  const sky=bc.createLinearGradient(0,0,0,1024);
  sky.addColorStop(0,'#070b1b');sky.addColorStop(.32,'#19172f');sky.addColorStop(.64,'#453148');sky.addColorStop(.83,'#775349');sky.addColorStop(1,'#221e2c');
  bc.fillStyle=sky;bc.fillRect(0,0,1536,1024);
  // Moon halo, horizon glow, and atmospheric bands.
  const halo=bc.createRadialGradient(1130,275,20,1130,275,490);
  halo.addColorStop(0,'rgba(235,198,151,.22)');halo.addColorStop(.3,'rgba(182,117,131,.13)');halo.addColorStop(1,'rgba(91,62,115,0)');
  bc.fillStyle=halo;bc.fillRect(0,0,1536,1024);
  bc.beginPath();bc.arc(1130,265,61,0,Math.PI*2);bc.fillStyle='#c7b6aa';bc.fill();
  bc.beginPath();bc.arc(1150,246,60,0,Math.PI*2);bc.fillStyle='#29263e';bc.fill();
  let starSeed=431;const starRand=()=>{starSeed=(1664525*starSeed+1013904223)>>>0;return starSeed/4294967296};
  for(let i=0;i<165;i++){const x=starRand()*1536,y=starRand()*560,r=.4+starRand()*1.6;bc.globalAlpha=.12+starRand()*.55;bc.fillStyle='#f6dcba';bc.fillRect(x,y,r,r)}bc.globalAlpha=1;
  // Layered dunes and far temple ruins produce depth instead of an empty black void.
  for(const [base,amp,col] of [[735,32,'#4d3c4b'],[805,45,'#332c40'],[910,50,'#211f31']] as const){
    bc.beginPath();bc.moveTo(0,1024);bc.lineTo(0,base);
    for(let x=0;x<=1536;x+=20)bc.lineTo(x,base+Math.sin(x/160+base)*amp+Math.sin(x/55)*amp*.2);
    bc.lineTo(1536,1024);bc.closePath();bc.fillStyle=col;bc.fill();
  }
  // Distant silhouettes are pyramids and eroded mesas, not disconnected black columns.
  const farPyramid=(x:number,y:number,w:number,h:number,color:string)=>{
    bc.beginPath();bc.moveTo(x-w/2,y);bc.lineTo(x,y-h);bc.lineTo(x+w/2,y);bc.closePath();bc.fillStyle=color;bc.fill();
    bc.beginPath();bc.moveTo(x,y-h);bc.lineTo(x+w/2,y);bc.lineTo(x,y);bc.closePath();bc.fillStyle='rgba(14,13,27,.22)';bc.fill();
  };
  farPyramid(175,790,290,190,'#493b4a');farPyramid(1340,795,335,220,'#453747');
  farPyramid(1120,820,200,135,'#4b3b4b');
  for(const [x,y,w,h] of [[18,830,210,115],[1450,850,220,150]] as const){
    bc.beginPath();bc.moveTo(x-w/2,y);bc.lineTo(x-w*.36,y-h*.85);bc.lineTo(x+w*.2,y-h);bc.lineTo(x+w*.5,y-h*.55);bc.lineTo(x+w/2,y);bc.closePath();bc.fillStyle='#392f41';bc.fill();
  }
  // Layered horizontal dust haze integrates the silhouettes with the horizon.
  for(let j=0;j<7;j++){bc.fillStyle=`rgba(194,138,123,${.012+j*.003})`;bc.fillRect(0,695+j*29,1536,14)}
  const horizon=bc.createLinearGradient(0,610,0,990);horizon.addColorStop(0,'rgba(225,155,112,0)');horizon.addColorStop(.65,'rgba(211,151,119,.14)');horizon.addColorStop(1,'rgba(20,16,28,0)');bc.fillStyle=horizon;bc.fillRect(0,610,1536,380);
  const backdropTex=new THREE.CanvasTexture(backdropCanvas);backdropTex.colorSpace=THREE.SRGBColorSpace;
  const backdrop=new THREE.Mesh(new THREE.PlaneGeometry(850,500),new THREE.MeshBasicMaterial({map:backdropTex,depthWrite:false,fog:false,side:THREE.DoubleSide,toneMapped:false}));
  backdrop.position.set(0,22,-140);backdrop.renderOrder=-100;scene.add(backdrop);
  // Thin transparent shafts of light through the ruins.
  const beamMat=new THREE.MeshBasicMaterial({color:0xe3b88e,transparent:true,opacity:.065,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,fog:false});
  for(const [x,rotation] of [] as [number,number][]){const beam=new THREE.Mesh(new THREE.PlaneGeometry(8,30),beamMat);beam.position.set(x,12,-21);beam.rotation.z=rotation;scene.add(beam)}
  // Continuous sandstone terrain to the left and right of the dueling bridge.
  // Meshes are intentionally broad, with no open seams visible from the camera.
  const terrainMat=new THREE.MeshStandardMaterial({color:0x483943,roughness:1,metalness:0,flatShading:true,side:THREE.DoubleSide});
  const terrainMat2=new THREE.MeshStandardMaterial({color:0x66505a,roughness:1,metalness:0,flatShading:true,side:THREE.DoubleSide});
  for(const side of [-1,1])for(let band=0;band<4;band++){
    const geom=new THREE.PlaneGeometry(52,80,12,14);
    const pos=geom.attributes.position;
    for(let k=0;k<pos.count;k++){
      const x=pos.getX(k),y=pos.getY(k);
      pos.setZ(k,Math.sin((x+band*5)*.18)*1.3+Math.cos((y+band*8)*.13)*1.1 +band*.65);
    }
    geom.computeVertexNormals();
    const dune=new THREE.Mesh(geom,band%2?terrainMat2:terrainMat);
    dune.rotation.x=-Math.PI/2;
    dune.position.set(side*(34+band*42),-3.6-band*.6,-23);
    dune.receiveShadow=true;scene.add(dune);
  }
  const stoneTex=masonryTexture();
  const goldTex=pixelTexture('#8d7041','#f2d59b',233);
  const shellTex=pixelTexture('#52236d','#c78df5',777);
  const stone=new THREE.MeshStandardMaterial({color:0xc6b7a0,map:stoneTex,roughness:.94,metalness:0});
  const sandstone=new THREE.MeshStandardMaterial({color:0xa4947c,roughness:.96});
  const trim=new THREE.MeshStandardMaterial({color:0x927445,metalness:.38,roughness:.6});
  const gold=new THREE.MeshStandardMaterial({color:0xd3ad65,map:goldTex,metalness:.5,roughness:.47});
  const dark=new THREE.MeshStandardMaterial({color:0x242433,roughness:.87});
  const floor=new THREE.Mesh(new THREE.BoxGeometry(32,.75,48),stone);floor.position.set(0,-.75,-3);floor.receiveShadow=true;scene.add(floor);
  const addBox=(w:number,h:number,d:number,x:number,y:number,z:number,mat:THREE.Material)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);return m};
  // Architectural columns: round fluted shafts, subtle capitals, gold inlays.
  for(const x of [-11,11])for(const z of [-15,-5]){
    const base=new THREE.Mesh(new THREE.CylinderGeometry(1.45,1.65,.55,20),sandstone);base.position.set(x,.15,z);base.castShadow=true;scene.add(base);
    const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.86,1.06,8.5,24),sandstone);shaft.position.set(x,4.65,z);shaft.castShadow=true;scene.add(shaft);
    for(let k=0;k<12;k++){const angle=k*Math.PI/6;const groove=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,8.1,5),trim);groove.position.set(x+Math.sin(angle)*.92,4.65,z+Math.cos(angle)*.92);scene.add(groove)}
    const capital=new THREE.Mesh(new THREE.CylinderGeometry(1.55,1.1,.85,20),sandstone);capital.position.set(x,9.3,z);capital.castShadow=true;scene.add(capital);
    const band=new THREE.Mesh(new THREE.CylinderGeometry(1.51,1.51,.12,20),trim);band.position.set(x,9.76,z);scene.add(band);
  }
  // Wide basalt staircase, coherent with the temple and without brick-like blocks.
  for(let i=0;i<8;i++)addBox(20-i*.6,.37,2.5,0,-.1+i*.42,-19-i*1.45,i%3===0?sandstone:dark);
  const pyramid=new THREE.Mesh(new THREE.ConeGeometry(8,11,4),dark);pyramid.position.set(0,5.8,-34);pyramid.rotation.y=Math.PI/4;scene.add(pyramid);
  const portal=new THREE.Mesh(new THREE.TorusGeometry(3.3,.28,16,64),new THREE.MeshStandardMaterial({color:0xb99562,emissive:0x56337c,emissiveIntensity:.45,metalness:.72,roughness:.32}));portal.position.set(0,6,-25);scene.add(portal);
  const core=new THREE.Mesh(new THREE.SphereGeometry(2.65,32,24),new THREE.MeshBasicMaterial({color:0x57318a,transparent:true,opacity:.2,depthWrite:false}));core.position.copy(portal.position);scene.add(core);
  // Build 25: two opposing ceremonial duel zones instead of isolated circular pedestals.
  // Preserve the original monster anchor coordinates so the existing 2.5D art remains aligned.
  const platforms=[{x:0,z:5},{x:0,z:-12}];
  const rings:THREE.Mesh[]=[];
  const arenaBasalt=new THREE.MeshStandardMaterial({color:0x292631,metalness:.12,roughness:.84});
  const arenaBorder=new THREE.MeshStandardMaterial({color:0xc4a46a,metalness:.6,roughness:.44});
  const zoneInner=new THREE.MeshStandardMaterial({color:0x3a3540,metalness:.08,roughness:.83});
  // A single raised duel board ties the two monster zones into one coherent battlefield.
  addBox(17,.45,32,0,-.28,-3.5,arenaBasalt);
  const addLine=(w:number,d:number,x:number,z:number,mat:THREE.Material)=>addBox(w,.045,d,x,.01,z,mat);
  addLine(17,.17,0,12.35,arenaBorder);addLine(17,.17,0,-19.35,arenaBorder);
  addLine(.17,31.7,-8.4,-3.5,arenaBorder);addLine(.17,31.7,8.4,-3.5,arenaBorder);
  // Five clearly separated monster slots per side. The middle slot is active at entry.
  const slotMaterial=new THREE.MeshStandardMaterial({color:0x28232f,metalness:.18,roughness:.8});
  const activeEdge=new THREE.MeshStandardMaterial({color:0xe4c080,metalness:.55,roughness:.42});
  const inactiveEdge=new THREE.MeshStandardMaterial({color:0x66553f,metalness:.3,roughness:.75});
  const slotPositions=[-6.5,-3.25,0,3.25,6.5];
  for(const [side,z] of [['player',5],['enemy',-12]] as const){
    for(let k=0;k<5;k++){
      const x=slotPositions[k],center=k===2;
      addBox(2.92,.18,5.8,x,.13,z,center?activeEdge:inactiveEdge);
      addBox(2.76,.09,5.62,x,.275,z,slotMaterial);
      const seal=new THREE.Mesh(new THREE.RingGeometry(.58,.65,36),new THREE.MeshBasicMaterial({color:center?0xcfae72:0x55483c,side:THREE.DoubleSide,transparent:true,opacity:center?.9:.45}));
      seal.rotation.x=-Math.PI/2;seal.position.set(x,.333,z);scene.add(seal);
      const marker=new THREE.Mesh(new THREE.BoxGeometry(1.4,.025,.075),center?activeEdge:inactiveEdge);
      marker.position.set(x,.337,z+(side==='player'?2.3:-2.3));scene.add(marker);
    }
  }
  // Keep the 3D BUG anchored to the opponent's middle slot.
  platforms[1].x=0;
  // 2.5D guardian is overlaid at the front-left by CSS, so retain its WebGL anchor
  // independently while the 5-slot layout is presented.
  // Build 29: every card and guardian shares EXACTLY the same world-space x/z slot.
  // No CSS-projected characters: the camera handles perspective for both.
  const loader2=new THREE.TextureLoader();
  const artTextures:THREE.Texture[]=[];
  const guardianTextures:THREE.Texture[]=[];
  const cardMeshes:THREE.Mesh[]=[];
  const guardianSprites:THREE.Sprite[]=[];
  const cardGold=new THREE.MeshBasicMaterial({color:0xd3aa62,side:THREE.DoubleSide});
  const cardBlank=new THREE.MeshBasicMaterial({color:0x3a2535,side:THREE.DoubleSide});
  for(let k=0;k<5;k++){
    const x=slotPositions[k],z=5;
    // Card backs / card fronts are horizontal, sitting on the field tile.
    const border=new THREE.Mesh(new THREE.PlaneGeometry(2.5,3.85),cardGold);
    border.rotation.x=-Math.PI/2;border.position.set(x,.366,z);border.renderOrder=3;scene.add(border);
    const face=new THREE.Mesh(new THREE.PlaneGeometry(2.31,3.65),cardBlank.clone());
    face.rotation.x=-Math.PI/2;face.position.set(x,.381,z);face.renderOrder=4;scene.add(face);cardMeshes.push(face);
    const creature=new THREE.Sprite(new THREE.SpriteMaterial({color:0xffffff,transparent:true,depthTest:true,depthWrite:false,alphaTest:.04}));
    creature.position.set(x,.43,z-.65);creature.scale.set(2.95,3.55,1);creature.center.set(.5,0);
    creature.visible=false;scene.add(creature);guardianSprites.push(creature);
  }
  // Assets are loaded once, and the selected slot's sprites are changed in-place.
  guardianImages.forEach(url=>{const tex=loader2.load(url);tex.colorSpace=THREE.SRGBColorSpace;guardianTextures.push(tex)});
  projects.forEach(project=>{
    const c=document.createElement('canvas');c.width=256;c.height=384;const ctx=c.getContext('2d')!;
    const draw=(art?:HTMLImageElement)=>{
      ctx.fillStyle='#caa25e';ctx.fillRect(0,0,256,384);
      ctx.strokeStyle='#60401d';ctx.lineWidth=9;ctx.strokeRect(5,5,246,374);
      ctx.fillStyle='#e8c98d';ctx.fillRect(14,14,228,356);
      ctx.fillStyle='#4b2e1d';ctx.font='bold 18px Georgia, serif';ctx.textAlign='center';
      const title=project.name.length>19?project.name.slice(0,18)+'…':project.name;
      ctx.fillText(title,128,43,222);
      ctx.fillStyle='#7a4223';ctx.font='17px Georgia, serif';ctx.fillText('★★★★★',173,68);
      ctx.fillStyle='#251a25';ctx.fillRect(24,78,208,230);
      if(art)ctx.drawImage(art,29,83,198,220);
      ctx.fillStyle='#dbb97b';ctx.fillRect(22,317,212,40);
      ctx.fillStyle='#2a1b16';ctx.font='bold 14px monospace';ctx.fillText('MONSTRO  /  PROJETO',128,332);
      ctx.font='bold 12px monospace';ctx.fillText('ATK '+project.atk+' / DEF '+project.def,128,350);
    };
    draw();const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;artTextures.push(tex);
    const img=new Image();img.onload=()=>{draw(img);tex.needsUpdate=true};img.src=project.art;
  });
  let priorSlots='';
  const syncSlots=(values:(number|null)[])=>{
    const signature=values.map(v=>v===null?'_':String(v)).join(',');if(signature===priorSlots)return;priorSlots=signature;
    for(let k=0;k<5;k++){
      const idx=values[k];const sprite=guardianSprites[k];const card=cardMeshes[k];
      sprite.visible=idx!==null;
      if(idx!==null && guardianTextures[idx]){
        (sprite.material as THREE.SpriteMaterial).map=guardianTextures[idx];
        (sprite.material as THREE.SpriteMaterial).needsUpdate=true;
        const faceMaterial=card.material as THREE.MeshBasicMaterial;
        faceMaterial.map=artTextures[idx]??null;faceMaterial.color.setHex(0xffffff);faceMaterial.needsUpdate=true;
      }else{
        const faceMaterial=card.material as THREE.MeshBasicMaterial;
        faceMaterial.map=null;faceMaterial.color.setHex(0x342631);faceMaterial.needsUpdate=true;
      }
    }
  };
  // Opposing central divider and shallow card-slot motifs.
  addLine(15,.15,0,-3.5,arenaBorder);
  for(const z of [-7.2,0.1])for(const x of [-6.5,-4.3,-2.1,.1,2.3,4.5,6.7]){
    addLine(1.65,.035,x,z,new THREE.MeshBasicMaterial({color:0x8b7350,transparent:true,opacity:.36}));
  }
  // Angular temple pylons frame the distant battlefield like a ceremonial arena.
  for(const x of [-9.5,9.5]){
    const pylon=new THREE.Mesh(new THREE.BoxGeometry(2.5,7,3.3),sandstone);pylon.position.set(x,3,-23);pylon.rotation.y=x>0?-.1:.1;pylon.castShadow=true;scene.add(pylon);
    addBox(2.8,.22,3.5,x,6.55,-23,arenaBorder);
  }
  // Independent low-poly creatures: a project guardian versus the BUG invader.
  const monsters:[THREE.Group,THREE.Group]=[new THREE.Group(),new THREE.Group()];
  const creatureMaterials=[0x4bd7ee,0xa86cf3,0xffbd59,0x60e38d,0x84c3ff,0x69f2bb,0xf49a57,0xb8a6ef].map(c=>new THREE.MeshStandardMaterial({color:c,flatShading:true,metalness:.3,roughness:.6}));
  const bugShell=new THREE.MeshStandardMaterial({color:0xbda5df,map:shellTex,flatShading:true,metalness:.52,roughness:.35,emissive:0x24103c,emissiveIntensity:.28});
  const bugLimb=new THREE.MeshStandardMaterial({color:0x28203e,flatShading:true});
  const bugEye=new THREE.MeshBasicMaterial({color:0xff4a9d});const bugGlow=new THREE.PointLight(0xff295a,9,7);bugGlow.position.set(0,2.5,1.6);
  const makeMesh=(g:THREE.Group,geo:THREE.BufferGeometry,mat:THREE.Material,x:number,y:number,z:number)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;g.add(m);return m};
  const makeBug=()=>{const g=new THREE.Group();g.add(bugGlow.clone());
    const shell=makeMesh(g,new THREE.IcosahedronGeometry(1.35,1),bugShell,0,2.1,0);shell.scale.set(1,0.75,1.35);
    const abdomen=makeMesh(g,new THREE.IcosahedronGeometry(.98,1),bugShell,0,1.8,-1.15);abdomen.scale.set(.9,.65,1.35);
    const head=makeMesh(g,new THREE.IcosahedronGeometry(.82,1),bugLimb,0,2.3,1.25);head.scale.set(1,.8,.8);
    for(const side of [-1,1]){
      makeMesh(g,new THREE.OctahedronGeometry(.23,0),bugEye,side*.48,2.57,1.79);
      for(let n=0;n<3;n++){const upper=makeMesh(g,new THREE.CylinderGeometry(.12,.18,1.65,5),bugLimb,side*(1.35+n*.13),1.73,-.9+n*.85);upper.rotation.z=side*(.7+n*.13);upper.rotation.x=(n-1)*.24;
      const lower=makeMesh(g,new THREE.CylinderGeometry(.08,.16,1.35,5),bugLimb,side*(2.05+n*.27),.8,-.9+n*.85);lower.rotation.z=side*-.28;}
      const antenna=makeMesh(g,new THREE.ConeGeometry(.12,1.35,4),gold,side*.38,3.45,1.65);antenna.rotation.z=side*-.42;
      const mandible=makeMesh(g,new THREE.ConeGeometry(.21,.8,4),gold,side*.43,1.85,2);mandible.rotation.z=side*-.75;
    }
    // Distinctive chitin spikes and illuminated thorax distinguish BUG from the guardian art.
    for(let k=0;k<5;k++){const spike=makeMesh(g,new THREE.ConeGeometry(.19,.9,6),gold,(k-2)*.44,3.05,-.7);spike.rotation.z=(k-2)*-.18;}
    const thoraxGlow=new THREE.MeshBasicMaterial({color:0xcf65ff});
    makeMesh(g,new THREE.OctahedronGeometry(.45,0),thoraxGlow,0,2.3,1.12);
    const wingMat=new THREE.MeshStandardMaterial({color:0x9b7ac9,transparent:true,opacity:.67,side:THREE.DoubleSide,flatShading:true});
    for(const side of [-1,1]){const wing=makeMesh(g,new THREE.ConeGeometry(.95,2.9,3),wingMat,side*1.05,3.05,-.65);wing.rotation.z=side*.65;wing.rotation.x=-.35;wing.name='bug-wing';wing.userData.rest=wing.rotation.z;wing.userData.side=side}
    return g;
  };
  const makeGuardian=(index:number)=>{const g=new THREE.Group(),mat=creatureMaterials[index%creatureMaterials.length];g.userData.kind=index;
    // Large distinctive silhouettes keep the summoned guardian readable from the battle camera.
    const crest=new THREE.Group();g.add(crest);
    const gem=new THREE.MeshBasicMaterial({color:0x8af4ff});
    const body=makeMesh(g,new THREE.DodecahedronGeometry(.95,0),mat,0,2.0,0);body.scale.y=1.28;
    makeMesh(g,new THREE.OctahedronGeometry(.68,0),gold,0,3.43,.16);
    for(const side of [-1,1]){const leg=makeMesh(g,new THREE.CylinderGeometry(.22,.35,1.45,5),dark,side*.54,.76,0);leg.rotation.z=side*.13;
      const arm=makeMesh(g,new THREE.ConeGeometry(.42,1.85,4),mat,side*1.13,2.1,.05);arm.rotation.z=side*.55;}
    if(index===1){ // StageManager: instrument guardian
      for(const side of [-1,1]){const drum=makeMesh(g,new THREE.CylinderGeometry(.5,.5,.45,8),gold,side*.78,2.0,.9);drum.rotation.x=Math.PI/2;}
      for(let n=0;n<3;n++)makeMesh(g,new THREE.TorusGeometry(.55+n*.25,.05,4,12),mat,0,3.1+n*.25,-.5);
      for(const side of [-1,1]){const wing=makeMesh(g,new THREE.BoxGeometry(1.8,.16,2.9),mat,side*1.65,3.1,-.45);wing.rotation.z=side*.4;wing.name='guardian-wing';wing.userData.rest=wing.rotation.z;wing.userData.side=side;}
      makeMesh(g,new THREE.CylinderGeometry(.13,.2,3.8,6),gold,0,3.8,.9);makeMesh(g,new THREE.IcosahedronGeometry(.5,0),gem,0,5.7,.9);
    }else if(index===0){ // CRM: mechanical sentinel with glowing data wings
      for(const side of [-1,1]){makeMesh(g,new THREE.BoxGeometry(1.7,.25,1.2),mat,side*1.55,2.65,-.4).rotation.z=side*.55;makeMesh(g,new THREE.BoxGeometry(.3,1.7,.3),gold,side*2.25,2.85,.1)}
      makeMesh(g,new THREE.IcosahedronGeometry(.6,0),gem,0,2.2,1.05);
    }else if(index===2){ // Support: headset guardian
      const headset=makeMesh(g,new THREE.TorusGeometry(.87,.16,5,14,Math.PI),mat,0,3.45,0);headset.rotation.z=Math.PI;
      makeMesh(g,new THREE.BoxGeometry(.5,.65,.4),mat,-.85,3.2,0);makeMesh(g,new THREE.BoxGeometry(.5,.65,.4),mat,.85,3.2,0);makeMesh(g,new THREE.TorusGeometry(1.4,.12,5,16),gold,0,2.4,-.4);
    }else if(index===3){ // Finance: golden armored guardian
      for(let n=0;n<3;n++)makeMesh(g,new THREE.CylinderGeometry(.65,.65,.18,8),gold,0,1.3+n*.24,1.05);makeMesh(g,new THREE.ConeGeometry(1.3,2,5),gold,0,4.7,-.3);
    }else if(index===4){ // Text AI: arcane knowledge keeper
      const book=makeMesh(g,new THREE.BoxGeometry(1.65,.22,1.05),mat,0,1.9,1.1);book.rotation.x=-.24;
      makeMesh(g,new THREE.IcosahedronGeometry(.48,0),gem,0,4.45,0);for(const side of [-1,1])makeMesh(g,new THREE.ConeGeometry(.5,2.4,4),mat,side*1.4,3.2,-.5).rotation.z=side*.7;
    }else if(index===5){ // WhatsFlow: messenger spirit
      for(let n=0;n<3;n++)makeMesh(g,new THREE.IcosahedronGeometry(.35,0),gem,(n-1)*.8,3.75+(n%2)*.45,.6);for(const side of [-1,1])makeMesh(g,new THREE.TorusGeometry(.8,.12,4,12),mat,side*1.25,2.7,-.5);
    }else if(index===6){ // Gym: iron colossus
      makeMesh(g,new THREE.BoxGeometry(2.8,.55,1.2),gold,0,3.25,0);for(const side of [-1,1]){makeMesh(g,new THREE.CylinderGeometry(.5,.5,.24,8),dark,side*1.65,2.3,.2);makeMesh(g,new THREE.CylinderGeometry(.3,.3,.25,8),gold,side*1.9,2.3,.2)}
    }else{ // CRM / portfolio: crystalline core
      const crystal=makeMesh(g,new THREE.OctahedronGeometry(.6,0),new THREE.MeshBasicMaterial({color:0x8deaff}),0,2.15,1);crystal.name='core';
      for(const side of [-1,1]){const wing=makeMesh(g,new THREE.ConeGeometry(.6,2.5,4),mat,side*1.5,2.7,-.3);wing.rotation.z=side*.75}
    }
    // Individual silhouette signatures, deliberately chunky like late-1990s console models.
    const accent=new THREE.MeshBasicMaterial({color:[0x00eeff,0xff67dc,0x55ffbd,0xffe267,0x91aaff,0x50ff9a,0xff764c,0xc8a6ff][index%8]});
    if(index===0){ // CRM: broad mechanical visor and floating data panels
      makeMesh(g,new THREE.BoxGeometry(1.65,.35,.45),accent,0,3.48,.72);
      for(const side of [-1,1])makeMesh(g,new THREE.BoxGeometry(.7,1.35,.12),accent,side*2.55,3.25,.5).rotation.z=side*.35;
    }else if(index===1){ // StageManager: giant twin speakers and musical crest
      for(const side of [-1,1]){makeMesh(g,new THREE.BoxGeometry(.75,1.6,.75),dark,side*1.85,1.85,.8);makeMesh(g,new THREE.CylinderGeometry(.32,.32,.12,8),accent,side*1.85,1.8,1.22).rotation.x=Math.PI/2;}
      makeMesh(g,new THREE.TorusGeometry(.68,.11,5,12),accent,0,4.35,.3);
    }else if(index===2){ // Support: unmistakable headset ears and speech bubble
      makeMesh(g,new THREE.BoxGeometry(1.7,.32,.5),accent,0,3.7,.2);
      makeMesh(g,new THREE.BoxGeometry(.9,.65,.16),accent,1.15,2.6,1.0);
    }else if(index===3){ // Finance: coin shield and horned helmet
      makeMesh(g,new THREE.CylinderGeometry(1,1,.22,10),gold,-1.5,2.2,1).rotation.x=Math.PI/2;
      for(const side of [-1,1])makeMesh(g,new THREE.ConeGeometry(.3,1.25,5),accent,side*.6,4.4,0).rotation.z=side*.3;
    }else if(index===4){ // AI: floating open book and three orbiting crystals
      for(let j=0;j<3;j++)makeMesh(g,new THREE.OctahedronGeometry(.3,0),accent,Math.cos(j*2.1)*1.6,4.4+Math.sin(j*2.1)*.35,Math.sin(j*2.1)*1.2);
      makeMesh(g,new THREE.BoxGeometry(2,.12,.8),gold,0,2.1,1.35).rotation.z=.12;
    }else if(index===5){ // WhatsFlow: big luminous message icon
      makeMesh(g,new THREE.BoxGeometry(2.15,1.35,.24),accent,0,3.8,.85);
      for(let j=-1;j<=1;j++)makeMesh(g,new THREE.SphereGeometry(.12,5,4),dark,j*.45,3.8,1.04);
    }else if(index===6){ // Gym: heavy iron bar and enormous shoulder armor
      makeMesh(g,new THREE.CylinderGeometry(.13,.13,4.8,6),accent,0,4.25,.3).rotation.z=Math.PI/2;
      for(const side of [-1,1])makeMesh(g,new THREE.BoxGeometry(.95,.85,1),gold,side*1.45,2.9,.1);
    }else{ // Portfolio: crystal wings and a halo
      makeMesh(g,new THREE.TorusGeometry(1,.12,5,12),accent,0,4.65,0);
      for(const side of [-1,1])makeMesh(g,new THREE.OctahedronGeometry(.8,0),accent,side*2,3,-.3).scale.set(.6,1.7,.6);
    }
    return g;
  };
  // Character art is rendered on animated camera-facing planes, not as abstract primitives.
  // Depth testing is disabled for these foreground character layers so the stone platform
  // can never hide them, including after switching cards.
  // Build 21: load an actual rigged GLB for the first project when available.
  // Other projects retain the stable 2.5D fallback. A failed load never hides a guardian.
  const loader=new GLTFLoader();
  let playerAssetRequest=0;
  let playerHas3D=false;
  const activeModels:[THREE.Group|null,THREE.Group|null]=[null,null];
  const portraits:[THREE.Mesh|null,THREE.Mesh|null]=[null,null];
  monsters.forEach((g,i)=>{g.position.set(platforms[i].x,1.35,platforms[i].z);scene.add(g)});
  const setCreature=(slot:number,projectIndex:number|null)=>{const parent=monsters[slot];if(activeModels[slot])parent.remove(activeModels[slot]!);
    if(portraits[slot]){parent.remove(portraits[slot]!);portraits[slot]!.geometry.dispose();(portraits[slot]!.material as THREE.Material).dispose();portraits[slot]=null;}
    if(projectIndex===null){activeModels[slot]=null;return}
    if(slot===0){
      playerHas3D=false;
      const request=++playerAssetRequest;
      if(projectIndex===0){
        loader.load('/models/clientflow-guardian.glb',gltf=>{
          if(request!==playerAssetRequest || !monsters[0].parent)return;
          const root=gltf.scene;
          root.scale.setScalar(1.25);
          root.traverse(o=>{if(o instanceof THREE.Mesh){o.castShadow=true;o.receiveShadow=true;}});
          monsters[0].add(root);
          activeModels[0]=root;
          playerHas3D=true;
          // Hide the 2.5D fallback only after the 3D model is ready.
          host.dispatchEvent(new CustomEvent('guardian-3d-ready',{bubbles:true,detail:{index:0}}));
        },undefined,()=>{
          if(request===playerAssetRequest)host.dispatchEvent(new CustomEvent('guardian-3d-fallback',{bubbles:true}));
        });
      }
    }
    const model=slot===1?makeBug():new THREE.Group();
    // The BUG remains a real animated 3D mesh. Player characters are illustrated
    // creature sprites with continuous idle and attack animations, supported by
    // their own low-poly model as a secondary shadow/collision silhouette.
    model.scale.setScalar(slot===0?.9:1.35);
    if(slot===0)model.visible=false;
    parent.add(model);activeModels[slot]=model;

  };
  // Summoning glyphs and impact bursts are actual meshes in the 3D scene.
  const glyphs=platforms.map(({x,z})=>{const g=new THREE.Group();g.position.set(x,.93,z);for(let j=0;j<3;j++){const ring=new THREE.Mesh(new THREE.TorusGeometry(1.2+j*.55,.035,3,32),new THREE.MeshBasicMaterial({color:j===1?0xc07cff:0xffd17b,transparent:true,opacity:.65,depthWrite:false}));ring.rotation.x=Math.PI/2;g.add(ring)}scene.add(g);return g});
  const impact=new THREE.Group();const shards:THREE.Mesh[]=[];for(let i=0;i<24;i++){const shard=new THREE.Mesh(new THREE.TetrahedronGeometry(.1+(i%4)*.055),new THREE.MeshBasicMaterial({color:i%3===0?0xffe29a:0xb56cff}));impact.add(shard);shards.push(shard)}impact.visible=false;scene.add(impact);
  const labels:[THREE.Sprite|null,THREE.Sprite|null]=[null,null];
  const addLabel=(idx:number,projectIndex:number)=>{if(labels[idx]){scene.remove(labels[idx]!);labels[idx]!.material.dispose();labels[idx]=null}
   if(idx===0)return; // Player labels are supplied by cards on the field.
   const canvas=document.createElement('canvas');canvas.width=768;canvas.height=192;const ctx=canvas.getContext('2d')!;
   ctx.fillStyle='#060713';ctx.fillRect(0,0,768,192);
   ctx.strokeStyle='#e4c57f';ctx.lineWidth=10;ctx.strokeRect(6,6,756,180);
   ctx.fillStyle='#4a2c67';ctx.fillRect(18,18,732,24);
   ctx.fillStyle='#fff8df';ctx.shadowColor='#000';ctx.shadowBlur=6;ctx.font='bold 92px monospace';ctx.textAlign='center';ctx.fillText('BUG',384,112);ctx.shadowBlur=0;
   ctx.fillStyle='#ffde9e';ctx.font='bold 31px monospace';ctx.fillText('INVASOR DO TEMPLO',384,164);
   const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
   const mat=new THREE.SpriteMaterial({map:texture,transparent:true,depthTest:false,depthWrite:false});
   const sprite=new THREE.Sprite(mat);sprite.position.set(0,8.1,platforms[1].z);sprite.scale.set(8.2,2.05,1);scene.add(sprite);labels[idx]=sprite;
  };
  let lastPlayer:number|null=null,lastEnemy:number|null=null;let born=[0,0],attackStart=0,lastPhase='idle',impactStart=-100;const cameraTarget=new THREE.Vector3(0,2,-5);const cameraGoal=new THREE.Vector3();
  const particles:THREE.Mesh[]=[];const sparkMat=new THREE.MeshBasicMaterial({color:0xffdf96});for(let i=0;i<20;i++){const m=new THREE.Mesh(new THREE.OctahedronGeometry(.045,0),sparkMat);m.position.set((Math.random()-.5)*23,Math.random()*11,(Math.random()-.5)*32);scene.add(m);particles.push(m)}
  const clock=new THREE.Clock();let raf=0;
  const resize=()=>{const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)};
  const observer=new ResizeObserver(resize);observer.observe(host);resize();
  const loop=()=>{raf=requestAnimationFrame(loop);const dt=Math.min(clock.getDelta(),.05),t=clock.elapsedTime;
   const s=state.current;syncSlots(s.slots);const vals=[s.player,s.enemy];
   vals.forEach((v,i)=>{const group=monsters[i];if(v!==[lastPlayer,lastEnemy][i]){born[i]=t;setCreature(i,v);if(v!==null)addLabel(i,v);else if(labels[i]){scene.remove(labels[i]!);labels[i]!.material.dispose();labels[i]=null}if(i===0)lastPlayer=v;else lastEnemy=v}
    group.visible=v!==null;if(!group.visible)return;
const age=t-born[i];const rise=Math.min(1,Math.max(0,age/1.1));group.scale.setScalar(.65+.35*rise);group.position.y=1.35+Math.sin(t*2+i)*.12;group.rotation.y=(i===0?0.2:2.7)+Math.sin(t*.8+i)*.12;const model=activeModels[i];if(model){const energy=Math.sin(t*(i?5:2.2)+i);model.rotation.y=Math.sin(t*1.3+i)*.08;model.rotation.z=s.phase==='attack'?(i===0?-.12:.14)*Math.sin((t-attackStart)*12):0;model.children.forEach(c=>{if(c.name==='bug-wing')c.rotation.z=c.userData.rest+Math.sin(t*17+(c.userData.side||0))*.24;else if(c.name==='guardian-wing')c.rotation.z=c.userData.rest+Math.sin(t*4)*.12*c.userData.side;else if(c.name==='core')c.rotation.y+=dt*2.2});if(i===0){const kind=model.userData.kind??0;if(kind===1)model.rotation.y+=energy*.09;else if(kind===4)model.position.y=Math.sin(t*3)*.12;else if(kind===6)model.scale.setScalar(1+Math.max(0,energy)*.045)}}
    glyphs[i].visible=age<1.5||s.phase==='summon';glyphs[i].rotation.y+=dt*(i?-.7:.9);glyphs[i].scale.setScalar(.6+Math.min(1,age/1.1)*.5);
    if(s.phase==='attack'&&i===0){const hit=Math.max(0,1-Math.abs(t-attackStart-.48)/.5);group.position.z-=hit*5;group.position.y+=hit*1.8}
   });
   if(s.phase!==lastPhase){lastPhase=s.phase;if(s.phase==='attack'){attackStart=t;impactStart=t+.47;impact.position.set(platforms[1].x,3,platforms[1].z)}}
   const impactAge=t-impactStart;impact.visible=s.phase==='attack'&&impactAge>=0&&impactAge<.85;if(impact.visible){shards.forEach((m,i)=>{const a=i*2.39996;const r=impactAge*(4+(i%5));m.position.set(Math.cos(a)*r,Math.sin(a*1.6)*r,Math.sin(a)*r);m.rotation.set(t*i*.1,t*.7,t*.5);m.scale.setScalar(Math.max(.05,1-impactAge/1.1))})}
   // Fixed field camera: no wandering or side-shifting during card selection or summons.
   cameraGoal.set(0,11.2,25.2);cameraTarget.set(0,1.4,-4.5);
   camera.position.lerp(cameraGoal,Math.min(1,dt*3));camera.lookAt(cameraTarget);
   portal.rotation.z+=dt*.16;core.scale.setScalar(1+Math.sin(t*2)*.07);
   rings.forEach(r=>{(r.material as THREE.MeshStandardMaterial).emissive.setHex(0x000000)});
   guardianSprites.forEach((sprite,k)=>{
     if(!sprite.visible)return;
     const bob=Math.sin(t*2.2+k*.9)*.06;
     const defending=!!s.defenseSlots[k];
     const strike=!defending&&s.phase==='attack'&&k===s.activeSlot?Math.max(0,1-Math.abs(t-attackStart-.4)/.45):0;
     const fusionCreature=s.slots[k]!==null&&s.slots[k]!>=8;
     const targetHeight=defending?(fusionCreature?2.45:1.82):(fusionCreature?4.55:3.55);
     const targetWidth=defending?(fusionCreature?3.0:2.65):(fusionCreature?3.7:2.95);
     sprite.scale.x+=(targetWidth*(1+strike*.08)-sprite.scale.x)*Math.min(1,dt*9);
     sprite.scale.y+=(targetHeight*(1+strike*.08)-sprite.scale.y)*Math.min(1,dt*9);
     sprite.material.rotation+=((defending?-.32:0)-sprite.material.rotation)*Math.min(1,dt*9);
     sprite.position.set(slotPositions[k],.43+bob+strike*.35,defending?4.82:4.35);
     cardMeshes[k].rotation.z+=((defending?Math.PI/2:0)-cardMeshes[k].rotation.z)*Math.min(1,dt*10);
   });
   particles.forEach((p,i)=>{p.position.y+=dt*(.4+i%4*.1);if(p.position.y>13)p.position.y=0});violet.intensity=s.flash?110:36;
   renderer.render(scene,camera);
  };loop();
  return()=>{cancelAnimationFrame(raf);observer.disconnect();scene.traverse(obj=>{if(obj instanceof THREE.Mesh){obj.geometry.dispose();const m=obj.material;for(const item of (Array.isArray(m)?m:[m]))item.dispose()}if(obj instanceof THREE.Sprite){obj.material.map?.dispose();obj.material.dispose()}});guardianTextures.forEach(t=>t.dispose());artTextures.forEach(t=>t.dispose());stoneTex.dispose();goldTex.dispose();shellTex.dispose();backdropTex.dispose();renderer.dispose();renderer.domElement.remove()};
 },[]);
 return <div className="webgl-arena" ref={mount} role="img" aria-label="Arena tridimensional WebGL com templo egípcio, plataformas e criaturas low-poly"/>;
}
