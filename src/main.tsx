import WebGLArena from './WebGLArena';
import React, {useEffect,useRef,useState} from 'react';import{createRoot}from'react-dom/client';import{Github,ExternalLink,Mail,ChevronLeft,ChevronRight,Volume2,VolumeX,Swords,ScrollText,Code2,UserRound,Gamepad2,Home,BriefcaseBusiness,ArrowLeft,Shield,Heart,RotateCcw}from'lucide-react';import './style.css';
// Vite bundles each guardian explicitly, avoiding fragile absolute /guardian-N.png paths.
import guardian1 from './guardians/guardian-1.png';
import guardian2 from './guardians/guardian-2.png';
import guardian3 from './guardians/guardian-3.png';
import guardian4 from './guardians/guardian-4.png';
import guardian5 from './guardians/guardian-5.png';
import guardian6 from './guardians/guardian-6.png';
import guardian7 from './guardians/guardian-7.png';
import guardian8 from './guardians/guardian-8.png';
import fusion1 from './guardians/fusion-1.png';
import fusion2 from './guardians/fusion-2.png';
import fusion3 from './guardians/fusion-3.png';
import fusion4 from './guardians/fusion-4.png';
const guardianImages=[guardian1,guardian2,guardian3,guardian4,guardian5,guardian6,guardian7,guardian8,fusion1,fusion2,fusion3,fusion4];
type Project={name:string;desc:string;stack:string[];atk:number;def:number;type:string;url:string;demo?:string;emoji:string;color:string;art:string};
type Language='pt'|'en';
const translations:Record<string,string>={
'Início':'Home','Sobre mim':'About','Projetos':'Projects','Mini Game':'Mini Game','Habilidades':'Skills','Contato':'Contact',
'Desenvolvedor Full Stack':'Full Stack Developer','Front-end · Back-end · QA · DevOps':'Front-end · Back-end · QA · DevOps',
'Bem-vindo ao meu portfólio! Explore meus projetos como cartas, descubra minhas habilidades e desafie o deck em um duelo.':'Welcome to my portfolio! Explore my projects as cards, discover my skills, and challenge the deck in a duel.',
'✧ Cartas em destaque':'✧ Featured cards','ABRIR MEU DECK':'OPEN MY DECK',
'✧ Deck de projetos':'✧ Project deck','CARTA SELECIONADA':'SELECTED CARD',
'VER REPOSITÓRIO':'VIEW REPOSITORY','VISITAR SITE':'VISIT WEBSITE','ANTERIOR':'PREVIOUS','PRÓXIMA':'NEXT',
'✧ Perfil do Duelista':'✧ Duelist Profile','DUELISTA · DESENVOLVEDOR':'DUELIST · DEVELOPER',
'VER FOTO ORIGINAL':'VIEW ORIGINAL PHOTO','VER MOLDURA TEMÁTICA':'VIEW THEMED PORTRAIT',
'Desenvolvedor com foco em criar aplicações web úteis, bem estruturadas e visualmente marcantes. Minha trajetória combina experiência em organização, comunicação e trabalho em equipe com projetos práticos de front-end e back-end.':'I build useful, well-structured and visually distinctive web applications. My background combines organization, communication and teamwork with hands-on front-end and back-end projects.',
'Atualmente busco oportunidades de estágio ou nível júnior para evoluir tecnicamente e contribuir em produtos reais.':'I am currently seeking internship or junior opportunities to grow technically and contribute to real products.',
'⚔ Arsenal de Habilidades':'⚔ Skills Arsenal','Cada tecnologia é uma peça do meu deck de desenvolvimento.':'Every technology is a piece of my development deck.',
'Banco de dados':'Databases','Ferramentas':'Tools','Qualidade':'Quality',
'Indicadores visuais ilustrativos, não certificações ou avaliações oficiais.':'Illustrative indicators, not official certifications or assessments.',
'✉ Envie uma mensagem ao Duelista':'✉ Get in Touch','Vamos conversar sobre projetos, oportunidades e desenvolvimento de software.':"Let's talk about projects, opportunities and software development.",
'BAIXAR CURRÍCULO':'DOWNLOAD RÉSUMÉ',
'⚔ O TEMPLO DO DUELO':'⚔ TEMPLE OF THE DUEL','REINICIAR':'RESTART','RODADA':'ROUND','VOCÊ':'YOU',
'✦ CAMPO DE BATALHA ✦':'✦ BATTLEFIELD ✦','AS CARTAS GANHAM VIDA':'THE CARDS COME ALIVE',
'Escolha um projeto, invoque sua carta e enfrente BUG, o invasor do templo.':'Choose a project, summon its card and face BUG, the temple invader.',
'▶ ENTRAR NO DUELO ◀':'▶ ENTER THE DUEL ◀','☥ ARENA DO FARAÓ':'☥ PHARAOH ARENA',
'INVOCANDO...':'SUMMONING...','ATAQUE!':'ATTACK!','MODO BATALHA':'BATTLE MODE',
'☠ BUG — INVASOR DO TEMPLO':'☠ BUG — TEMPLE INVADER',
'CHEFE SECRETO · Derrote o BUG para desbloquear o currículo!':'SECRET BOSS · Defeat BUG to unlock the résumé!',
'✦ CRÍTICO!':'✦ CRITICAL!','✧ FUSÃO!':'✧ FUSION!','☥ TEMPLO DO FARAÓ · WEBGL':'☥ PHARAOH TEMPLE · WEBGL',
'✦ INVOCANDO CRIATURA ✦':'✦ SUMMONING CREATURE ✦','⚔ ATAQUE ESPECIAL ⚔':'⚔ SPECIAL ATTACK ⚔','CÂMERA DE BATALHA · PS1':'BATTLE CAMERA · PS1',
'VITÓRIA! Você venceu o duelo.':'VICTORY! You won the duel.','DERROTA! Tente novamente.':'DEFEAT! Try again.',
'✦ VITÓRIA DO DUELISTA ✦':'✦ DUELIST VICTORY ✦','☽ DUELO ENCERRADO ☽':'☽ DUEL ENDED ☽',
'🏆 RESGATAR PRÊMIO: MEU CURRÍCULO (PDF)':'🏆 CLAIM REWARD: MY RÉSUMÉ (PDF)','JOGAR NOVAMENTE':'PLAY AGAIN',
'SEU CAMPO · 5 ZONAS · ATAQUE / DEFESA':'YOUR FIELD · 5 ZONES · ATTACK / DEFENSE',
'⬡ DEFESA — MUDAR PARA ATAQUE':'⬡ DEFENSE — SWITCH TO ATTACK',
'⚔ ATAQUE — MUDAR PARA DEFESA':'⚔ ATTACK — SWITCH TO DEFENSE','· ATACAR':'· ATTACK',
'✦ FUSÕES — ARRASTE UMA CARTA SOBRE OUTRA':'✦ FUSIONS — DRAG ONE CARD ONTO ANOTHER',
'Arraste um monstro de uma zona para outra. Se formar um par compatível, você desbloqueia um ataque combinado; as duas cartas se unem em uma criatura nova. Para trocar de posição, arraste para uma zona vazia ou ocupada. Também é possível arrastar cartas do deck para as zonas.':'Drag a monster from one zone onto another. Compatible pairs merge into a new creature. Drag onto an empty or occupied zone to move or swap; you can also drag cards from the deck to the field.',
'Clique numa zona para selecionar ou arraste cartas entre as cinco posições. Ao entrar, a carta inicial ocupa a zona central (3). BUG permanece no centro do campo adversário.':'Click a zone to select it, or drag cards between the five positions. Your initial card occupies the center zone (3), and BUG stays in the center of the opposing field.',
'Invocação em andamento...':'Summoning in progress...','ESCOLHA UMA CARTA PARA INVOCAR':'CHOOSE A CARD TO SUMMON',
'Minigame original e simplificado: ataque, defesa e contra-ataque. Não reproduz as regras oficiais.':'Original simplified mini-game: attack, defense and counterattack. Not official game rules.',
'Sobre Mim':'About Me','Desenvolvedor Full Stack com foco em interfaces e aplicações web.':'Full Stack Developer focused on interfaces and web applications.',
'✦ Foco atual':'✦ Current focus','✦ Disponibilidade':'✦ Availability','Estágio / Júnior':'Internship / Junior',
'VER PERFIL →':'VIEW PROFILE →','♫ ATIVE O ÁUDIO NO TOPO':'♫ ENABLE AUDIO ABOVE','♫ TRILHA ORIGINAL ATIVA':'♫ ORIGINAL SOUNDTRACK ON',
'✕ SELECIONAR':'✕ SELECT','◯ ESC VOLTAR':'◯ ESC BACK','△ VER DETALHES':'△ VIEW DETAILS',
'Gestão':'Management','Full Stack':'Full Stack','Suporte':'Support','Finanças':'Finance','Inteligência Artificial':'Artificial Intelligence','Automação':'Automation','Front-end':'Front-end','FUSÃO':'FUSION',
'Painel de gestão de clientes, relacionamento e vendas.':'Customer relationship, management and sales dashboard.',
'Gestão de shows, setlists e repertório para bandas.':'Band management for concerts, setlists and repertoire.',
'Interface de atendimento e organização de chamados.':'Support interface for managing service tickets.',
'Experiência visual de controle financeiro pessoal.':'Visual personal finance management experience.',
'Assistente de escrita, resumo e revisão de textos.':'AI assistant for writing, summarizing and proofreading.',
'Solução de atendimento e automação de conversas.':'Customer support and conversation automation solution.',
'Site responsivo com identidade visual esportiva.':'Responsive fitness website with a distinctive visual identity.',
'Portfólio web com interface responsiva e projetos.':'Responsive web portfolio featuring my projects.',
'Criatura especial obtida por fusão.':'Special creature created through fusion.',
'Escolha uma carta para começar o duelo.':'Choose a card to start the duel.',
'Pulso Cibernético':'Cyber Pulse','Ressonância Sônica':'Sonic Resonance','Escudo de Dados':'Data Shield','Impacto Dourado':'Golden Impact',
'Feitiço Neural':'Neural Spell','Tempestade de Mensagens':'Message Storm','Golpe Titânico':'Titan Strike','Código Proibido':'Forbidden Code',
'Sobrecarga da Rede':'Network Overload','Concerto do Infinito':'Infinite Concerto','Bastião Absoluto':'Absolute Bastion','Impacto do Colosso':'Colossus Impact'
};
const translate=(language:Language,value:string)=>language==='en'?(translations[value]??value):value;
const BOSS_MAX_HP=999_999_999;
const attackNames=['Pulso Cibernético','Ressonância Sônica','Escudo de Dados','Impacto Dourado','Feitiço Neural','Tempestade de Mensagens','Golpe Titânico','Código Proibido','Sobrecarga da Rede','Concerto do Infinito','Bastião Absoluto','Impacto do Colosso'];
const fusionPairs:Record<string,{name:string,bonus:number,result:number}>={'0-5':{name:'REDE SUPREMA',bonus:1.65,result:8},'1-4':{name:'SINFONIA NEURAL',bonus:1.55,result:9},'2-7':{name:'FORTALEZA DIGITAL',bonus:1.5,result:10},'3-6':{name:'TITÃ DE OURO',bonus:1.6,result:11}};
const attackMultipliers=[1.12,1.32,1.08,1.18,1.25,1.21,1.15,1.3,1.85,1.9,1.8,1.9];
const formatHP=(n:number)=>n.toLocaleString('pt-BR');
const projects:Project[]=[
{name:'ClientFlow CRM',desc:'Painel de gestão de clientes, relacionamento e vendas.',stack:['React','JavaScript','UI/UX'],atk:2400,def:1800,type:'Gestão',url:'https://github.com/Dzelmee/ClientFlow-CRM',emoji:'◈',color:'#8c4bff',art:'/guardian-card-art-1.webp'},
{name:'StageManager',desc:'Gestão de shows, setlists e repertório para bandas.',stack:['React','TypeScript','Node','Prisma'],atk:2900,def:2200,type:'Full Stack',url:'https://github.com/Dzelmee/StageManager',emoji:'♫',color:'#f05e9e',art:'/guardian-card-art-2.webp'},
{name:'Suporte Central',desc:'Interface de atendimento e organização de chamados.',stack:['HTML','CSS','JavaScript'],atk:1900,def:2500,type:'Suporte',url:'https://github.com/Dzelmee/suporte-central',emoji:'⌘',color:'#37d7ee',art:'/guardian-card-art-3.webp'},
{name:'Bolso Claro',desc:'Experiência visual de controle financeiro pessoal.',stack:['JavaScript','CSS','Responsivo'],atk:2100,def:2300,type:'Finanças',url:'https://github.com/Dzelmee/bolso-claro',emoji:'◆',color:'#7ae5a0',art:'/guardian-card-art-4.webp'},
{name:'Texto. IA',desc:'Assistente de escrita, resumo e revisão de textos.',stack:['Python','Streamlit','Groq API'],atk:2700,def:1700,type:'Inteligência Artificial',url:'https://github.com/Dzelmee',emoji:'✦',color:'#79baff',art:'/guardian-card-art-5.webp'},
{name:'WhatsFlow',desc:'Solução de atendimento e automação de conversas.',stack:['Integrações','Web','Automação'],atk:2600,def:2000,type:'Automação',url:'https://github.com/Dzelmee/whatsflow',emoji:'◎',color:'#70e5c3',art:'/guardian-card-art-6.webp'},
{name:'Projeto Academia',desc:'Site responsivo com identidade visual esportiva.',stack:['HTML','CSS','JavaScript'],atk:1800,def:1900,type:'Front-end',url:'https://github.com/Dzelmee/projeto-academia',emoji:'⚡',color:'#f4a95d',art:'/guardian-card-art-7.webp'},
{name:'Meu Portfólio',desc:'Portfólio web com interface responsiva e projetos.',stack:['React','Vite','CSS'],atk:2200,def:2100,type:'Front-end',url:'https://github.com/Dzelmee/portfolio-jonas-dzelme',demo:'https://portfolio-jonas-dzelme.vercel.app/',emoji:'✧',color:'#e6c47e',art:'/guardian-card-art-8.webp'}];

const fusionResults:Project[]=[
{name:'Rede Suprema',desc:'Criatura especial obtida por fusão.',stack:['Fusão'],atk:5900,def:4200,type:'FUSÃO',url:'https://github.com/Dzelmee',emoji:'✧',color:'#39edbd',art:'/fusion-card-art-1.webp'},
{name:'Sinfonia Neural',desc:'Criatura especial obtida por fusão.',stack:['Fusão'],atk:6400,def:3600,type:'FUSÃO',url:'https://github.com/Dzelmee',emoji:'✧',color:'#c788ff',art:'/fusion-card-art-2.webp'},
{name:'Fortaleza Digital',desc:'Criatura especial obtida por fusão.',stack:['Fusão'],atk:5400,def:5700,type:'FUSÃO',url:'https://github.com/Dzelmee',emoji:'✧',color:'#71c9ff',art:'/fusion-card-art-3.webp'},
{name:'Titã de Ouro',desc:'Criatura especial obtida por fusão.',stack:['Fusão'],atk:6200,def:4900,type:'FUSÃO',url:'https://github.com/Dzelmee',emoji:'✧',color:'#ffd46d',art:'/fusion-card-art-4.webp'}
];
const duelProjects=[...projects,...fusionResults];
const nav=[['inicio','Início',Home],['sobre','Sobre mim',UserRound],['projetos','Projetos',BriefcaseBusiness],['duelo','Mini Game',Gamepad2],['habilidades','Habilidades',Swords],['contato','Contato',Mail]] as const;
type CardProps={p:Project;selected?:boolean;onClick?:()=>void;small?:boolean};
const Card:React.FC<CardProps>=({p,selected=false,onClick,small=false})=>{return <button className={'monster-card '+(selected?'selected ':'')+(small?'small':'')} onClick={onClick} style={{'--glow':p.color} as React.CSSProperties}><div className="card-name">{p.name}</div><div className="stars">{'★'.repeat(Math.max(3,Math.round(p.atk/500)))}</div><div className="card-art"><img className="project-illustration" src={p.art} alt={`Ilustração retrô do projeto ${p.name}`}/><span>{p.type}</span></div><div className="card-description">{p.desc}</div><div className="card-stats">ATK {p.atk} / DEF {p.def}</div></button>};

// Trilha original: fantasia egípcia, timbres FM-like e arpejos de console dos anos 90.
// Composição própria, sem amostras ou melodias do jogo.
function useRetroAudio(enabled:boolean,scene:string){
 const ctxRef=useRef<AudioContext|null>(null);const interval=useRef<number|null>(null);const tick=useRef(0);
 const getCtx=()=>{const C=window.AudioContext||(window as any).webkitAudioContext;const c=ctxRef.current??new C();ctxRef.current=c;if(c.state==='suspended')void c.resume();return c};
 const note=(freq:number,duration:number,wave:OscillatorType,volume:number,when=0,filterFreq=2800)=>{
  if(!enabled)return;
  try{const c=getCtx(),t=c.currentTime+when,osc=c.createOscillator(),gain=c.createGain(),filter=c.createBiquadFilter();filter.type='lowpass';filter.frequency.value=filterFreq;
   osc.type=wave;osc.frequency.setValueAtTime(freq,t);gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),t+.025);gain.gain.exponentialRampToValueAtTime(.0001,t+duration);
   osc.connect(filter);filter.connect(gain);gain.connect(c.destination);osc.start(t);osc.stop(t+duration+.04)
  }catch{}
 };
 const effect=(name:'click'|'select'|'attack'|'victory'|'defeat'='click')=>{
  if(name==='click'){note(880,.065,'square',.032);note(1320,.1,'sine',.045,.045)}
  if(name==='select'){note(440,.12,'triangle',.055);note(660,.19,'sine',.07,.09)}
  if(name==='attack'){note(180,.3,'sawtooth',.1);note(90,.48,'triangle',.12,.09)}
  if(name==='victory')[523,659,784,1047].forEach((n,i)=>note(n,.3,'triangle',.09,i*.13));
  if(name==='defeat')[392,330,261,196].forEach((n,i)=>note(n,.38,'sawtooth',.06,i*.17));
 };
 useEffect(()=>{
  if(!enabled){if(interval.current!==null)clearInterval(interval.current);interval.current=null;return}
  // Original score: ritual percussion, PS1-era FM-like synthesis and a custom modal motif.
  // No melody, arrangement, sample or audio file from any existing game is used.
  const battle=scene==='arena';
  // Tema próprio para o duelo: escala com segunda menor e terça maior,
  // percussão grave e fraseado mais espaçado, sem reproduzir a OST do jogo.
  if(battle){
   const roots=[110,98,116.54,103.83];
   // Frases originais com pausas e saltos, para diferenciar o combate do menu.
   const phrases=[
    [0,null,1,null,5,4,null,1,0,null,-2,null,4,5,1,null],
    [0,null,7,5,4,null,1,0,null,-2,1,null,5,4,null,null],
    [0,1,null,4,8,7,null,5,4,null,1,0,null,-2,0,null],
    [5,null,4,1,0,null,-2,0,1,4,null,7,5,4,1,null]
   ];
   tick.current=0;
   const playBattle=()=>{
    const i=tick.current++,step=i%16,bar=Math.floor(i/16)%4;
    const root=roots[bar],degree=phrases[bar][step];
    if(degree!==null){
     const pitch=root*2**((degree+12)/12);
     // Timbre de sopro sintetizado com uma segunda voz discreta.
     note(pitch,.56,'sawtooth',.046,0,950);
     note(pitch*.998,.65,'triangle',.045,.018,1400);
    }
    // Bordão e resposta grave dão sustentação sem criar apitos repetitivos.
    if(step===0||step===8){
     note(root/2,1.35,'triangle',.065,0,370);
     note(root*1.5,.9,'sine',.015,.08,900);
    }
    if(step%4===0){
     note(62,.23,'triangle',.13,0,230);
     note(46,.3,'sine',.075,.02,170);
    }
    if(step===6||step===14)note(165,.10,'triangle',.027,0,510);
    if(step===12&&bar===3)note(root/2,.65,'sawtooth',.026,0,300);
   };
   playBattle();
   interval.current=window.setInterval(playBattle,280);
   return()=>{if(interval.current!==null)clearInterval(interval.current);interval.current=null};
  }
  const roots=[110,116.54,146.83,130.81,110,98,116.54,130.81];
  // Relative semitone steps. Entire melody and its harmonic progression were written for this portfolio.
  const theme=[0,1,5,7,5,1,-2,0, 0,5,8,7,5,3,1,-2,
    0,1,5,10,8,7,5,1, -2,0,3,5,7,5,1,0,
    0,5,7,12,10,7,5,3, 1,3,5,8,7,5,1,-2,
    0,1,5,7,10,8,7,5, 3,1,0,-2,0,5,1,0];
  const bass=[0,-12,-5,-12,0,-12,-7,-12];
  const stepMs=battle?175:225;
  tick.current=0;
  const playStep=()=>{
   const i=tick.current++,step=i%16,bar=Math.floor(i/16)%8,root=roots[bar],phrase=Math.floor(i/64)%2;
   const semitone=theme[i%theme.length],pitch=root*2**((semitone+12)/12);
   // An airy two-voice lead, with a distinct response in the second half of each phrase.
   if(step%2===0){note(pitch,battle?.30:.43,'triangle',battle?.055:.042,0,1650);
    note(pitch*2,battle?.14:.22,'sine',.012,.025,3100)}
   if(step===6||step===14){note(pitch*2**(-7/12),.37,'sine',.025,.07,1200)}
   // Ominous sustained harmony, deliberately sparse to leave room for UI effects.
   if(step===0||step===8){note(root/2,.95,'sawtooth',battle?.041:.028,0,420);
    note(root*2**(7/12),1.10,'sine',.021,.08,1250)}
   if(step%4===0)note(root*2**(bass[Math.floor(step/2)%8]/12),.28,'triangle',battle?.065:.042,0,600);
   // Ritual percussion synthesized in real time; no borrowed drum samples.
   if(step%4===0){note(battle?73:64,.18,'triangle',battle?.115:.075,0,320);
    note(53,.23,'sine',battle?.09:.05,0,240)}
   if(step%4===2){note(190,.075,'triangle',battle?.034:.020,0,850);
    note(1250,.033,'square',battle?.009:.006,0,2100)}
   // Sem o bip agudo repetitivo do modo arena; a trilha e os demais efeitos continuam ativos.
   // A ceremonial bell announces new phrases; battle mode adds a dramatic low hit.
   if(step===0&&bar%2===0){note(root*4,.88,'sine',.022,.04,2900);
    if(battle)note(49,.72,'sawtooth',.055,0,260)}
   if(phrase===1&&step===12)note(pitch*1.5,.65,'triangle',.018,.08,1100);
  };
  playStep();
  interval.current=window.setInterval(playStep,stepMs);
  return()=>{if(interval.current!==null)clearInterval(interval.current);interval.current=null};
 },[enabled,scene]);
 useEffect(()=>()=>{if(interval.current!==null)clearInterval(interval.current);void ctxRef.current?.close()},[]);
 return effect;
}
function App(){const[page,setPage]=useState('inicio');const[language,setLanguage]=useState<Language>(()=>{try{return localStorage.getItem('forbidden-lang')==='en'?'en':'pt'}catch{return 'pt'}});const tr=(value:string)=>translate(language,value);useEffect(()=>{document.documentElement.lang=language;try{localStorage.setItem('forbidden-lang',language)}catch{}},[language]);const[chosen,setChosen]=useState(0);const[muted,setMuted]=useState(true);const[arenaOpen,setArenaOpen]=useState(false);const retroAudio=useRetroAudio(!muted,'arena');const audio=(effect:'click'|'select'|'attack'|'victory'|'defeat'='click')=>{const mobile=window.matchMedia('(pointer: coarse)').matches||window.matchMedia('(max-width: 767px)').matches;if(mobile&&effect==='attack')return;retroAudio(effect)};const[photoOk,setPhotoOk]=useState(true);const[retroPhoto,setRetroPhoto]=useState(true);const[playerLP,setPlayerLP]=useState(4000);const[enemyLP,setEnemyLP]=useState(BOSS_MAX_HP);const[turn,setTurn]=useState(0);const[log,setLog]=useState('Escolha uma carta para começar o duelo.');const[played,setPlayed]=useState<number|null>(null);const[duelSlots,setDuelSlots]=useState<(number|null)[]>([null,null,null,null,null]);const[activeSlot,setActiveSlot]=useState(2);const[draggingSlot,setDraggingSlot]=useState<number|null>(null);const[draggingDeck,setDraggingDeck]=useState<number|null>(null);const[fusionTarget,setFusionTarget]=useState<number|null>(null);const[enemyPlayed,setEnemyPlayed]=useState<number|null>(null);const[busy,setBusy]=useState(false);const[guardian3D,setGuardian3D]=useState(false);const[flash,setFlash]=useState(false);const[attackNonce,setAttackNonce]=useState(0);const[defenseSlots,setDefenseSlots]=useState<boolean[]>([false,false,false,false,false]);const[critical,setCritical]=useState(false);const[attackLabel,setAttackLabel]=useState('');const[comboReady,setComboReady]=useState(false);const[cinema,setCinema]=useState<'idle'|'summon'|'attack'|'result'>('idle');const[duelOutcome,setDuelOutcome]=useState<'victory'|'defeat'|null>(null);const[summon,setSummon]=useState<number|null>(null);const localizedProjects=projects.map(p=>({...p,desc:tr(p.desc),type:tr(p.type)}));const localizedDuelProjects=duelProjects.map(p=>({...p,desc:tr(p.desc),type:tr(p.type)}));const selected=localizedProjects[chosen];useEffect(()=>{const ready=()=>setGuardian3D(true);const fallback=()=>setGuardian3D(false);window.addEventListener('guardian-3d-ready',ready);window.addEventListener('guardian-3d-fallback',fallback);return()=>{window.removeEventListener('guardian-3d-ready',ready);window.removeEventListener('guardian-3d-fallback',fallback)}},[]);useEffect(()=>{const handler=(e:KeyboardEvent)=>{if(e.key==='Escape')setPage('inicio');if(page==='projetos'||page==='inicio'){if(e.key==='ArrowRight')setChosen(v=>(v+1)%projects.length);if(e.key==='ArrowLeft')setChosen(v=>(v+projects.length-1)%projects.length)}};window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler)},[page]);function beep(){audio('select')}const timeouts=useRef<number[]>([]);
 useEffect(()=>()=>{timeouts.current.forEach(clearTimeout)},[]);
 const later=(fn:()=>void,delay:number)=>{timeouts.current.push(window.setTimeout(fn,delay))};
 function reset(){timeouts.current.forEach(clearTimeout);timeouts.current=[];setPlayerLP(4000);setEnemyLP(BOSS_MAX_HP);setTurn(0);setPlayed(null);setDuelSlots([null,null,null,null,null]);setActiveSlot(2);setDraggingSlot(null);setDraggingDeck(null);setFusionTarget(null);setDefenseSlots([false,false,false,false,false]);setCritical(false);setAttackLabel('');setComboReady(false);setEnemyPlayed(null);setLog('Novo duelo! Escolha sua primeira carta.');setBusy(false);setCinema('idle');setDuelOutcome(null);setSummon(null);setFlash(false)}
 function leaveArena(){
   // Ao sair, encerro as animações pendentes para não continuar o combate fora da arena.
   timeouts.current.forEach(clearTimeout);timeouts.current=[];
   setBusy(false);setCinema('idle');setSummon(null);setFlash(false);
   setArenaOpen(false);setGuardian3D(false);
   window.requestAnimationFrame(()=>document.getElementById('duel-menu')?.scrollIntoView({behavior:'smooth',block:'start'}));
 }
 function attack(i:number){attackAt(i,activeSlot)}
 function moveOrFuse(source:number,target:number){
   if(busy||source===target)return;
   const first=duelSlots[source],second=duelSlots[target];
   if(first===null)return;
   const pair=second===null?null:fusionPairs[[first,second].sort((a,b)=>a-b).join('-')];
   if(pair){
     setDuelSlots(prev=>{const next=[...prev];next[target]=pair.result;next[source]=null;return next});
     setDefenseSlots(prev=>prev.map((d,k)=>k===source||k===target?false:d));
     setActiveSlot(target);setPlayed(pair.result);setGuardian3D(false);setFusionTarget(target);
     setCinema('summon');setSummon(pair.result);setBusy(true);
     setLog(`✦ FUSÃO REALIZADA! ${duelProjects[first].name} + ${duelProjects[second!].name} = ${pair.name}! Uma nova criatura ocupa a zona ${target+1}.`);
     later(()=>{setBusy(false);setCinema('idle');setSummon(null)},1100);
   }else{
     setDuelSlots(prev=>{const next=[...prev];next[target]=first;next[source]=second;return next});
     setDefenseSlots(prev=>{const next=[...prev];next[target]=prev[source];next[source]=prev[target];return next});
     setActiveSlot(target);setPlayed(first);setGuardian3D(false);setFusionTarget(null);
     setLog(`${duelProjects[first].name} movido para a zona ${target+1}.`);
   }
   audio('select');
 }
 function handleSlotDrop(target:number){
   if(draggingDeck!==null){
     attackAt(draggingDeck,target);
   }else if(draggingSlot!==null){
     moveOrFuse(draggingSlot,target);
   }
   setDraggingDeck(null);setDraggingSlot(null);
 }
 function attackAt(i:number,target:number){
   if(busy)return;
   setActiveSlot(target);setDuelSlots(prev=>prev.map((v,k)=>k===target?i:v));
   setDefenseSlots(v=>v.map((d,k)=>k===target?false:d));
   setPlayed(i);setGuardian3D(false);setSummon(i);setCinema('summon');setBusy(true);setFusionTarget(null);audio('select');
   setLog(`${duelProjects[i].name} invocado na zona ${target+1}. Selecione a carta e pressione ATACAR.`);
   later(()=>{setSummon(null);setBusy(false);setCinema('idle')},850);
 }
 function attackSelected(){
   if(busy)return;
   const i=duelSlots[activeSlot];
   if(i===null){setLog('Selecione uma zona ocupada antes de atacar.');return}
   if(playerLP<=0||enemyLP<=0){setLog('Duelo encerrado. Clique em JOGAR NOVAMENTE para reiniciar os LP.');return}
   const opponent=Math.floor(Math.random()*projects.length);
   if(defenseSlots[activeSlot]){setLog('Monstro em posição de defesa. Alterne para ATK antes de atacar.');return}
   const occupied=duelSlots.filter((v):v is number=>v!==null);
   const combo=Math.max(1,occupied.length);
   const fusion=Object.entries(fusionPairs).find(([,data])=>data.result===i);
   const isCritical=Math.random()<.22;
   const multiplier=fusion?1.15:1;
   const damage=Math.round((duelProjects[i].atk*attackMultipliers[i]+combo*450)*24000*multiplier*(isCritical?1.5:1));
   const retaliation=Math.max(25,Math.round((projects[opponent].atk-duelProjects[i].def+450)*.075));
   setCritical(isCritical);setComboReady(!!fusion);setAttackLabel(fusion?fusion[1].name:attackNames[i]);
   setBusy(true);setPlayed(i);setCinema('attack');setAttackNonce(n=>n+1);audio('attack');setFlash(true);
   later(()=>{setFlash(false);const nextEnemy=Math.max(0,enemyLP-damage),nextPlayer=Math.max(0,playerLP-retaliation);
     setEnemyLP(nextEnemy);setPlayerLP(nextPlayer);setTurn(t=>t+1);
     setLog(`${fusion?fusion[1].name:attackNames[i]}${isCritical?' · CRÍTICO!':''} ${duelProjects[i].name} causou ${formatHP(damage)} de dano. BUG contra-atacou: ${retaliation} LP.`);
     if(nextEnemy===0||nextPlayer===0){const result=nextEnemy===0?'victory':'defeat';setDuelOutcome(result);audio(result)}
   },800);
   later(()=>{setBusy(false);setCinema('idle')},1350);
 }
 return <div className={"app "+(page==='duelo'&&arenaOpen?'duel-fullscreen':'')} onClickCapture={(e)=>{if((e.target as HTMLElement).closest('button,a'))audio('click')}}><div className="bg"/><div className="grain"/><header className="topbar"><div className="identity"><div className="portrait">{photoOk?<img src="/retrato-tematico.png" onError={()=>setPhotoOk(false)} alt="Foto de Jonas Dzelme"/>:<span>JD</span>}</div><div><strong>Jonas Dzelme</strong><span>{tr("Desenvolvedor Full Stack")}</span><small>Front-end · Back-end · QA · DevOps</small></div></div><div className="top-actions"><div className="language-switch" role="group" aria-label="Site language"><button type="button" className={language==='pt'?'active':''} onClick={()=>setLanguage('pt')} aria-pressed={language==='pt'}>PT</button><button type="button" className={language==='en'?'active':''} onClick={()=>setLanguage('en')} aria-pressed={language==='en'}>EN</button></div><button onClick={()=>setMuted(v=>!v)} className="sound-btn" title={language==='en'?(muted?'Enable music and effects':'Mute music and effects'):(muted?'Ativar trilha original e efeitos':'Silenciar trilha e efeitos')} aria-label={language==='en'?(muted?'Enable music and sound effects':'Disable music and sound effects'):(muted?'Ativar música e efeitos sonoros':'Desativar música e efeitos sonoros')}>{muted?<VolumeX size={19}/>:<Volume2 size={19}/>}</button><div className="lp">LP <b>{page==='duelo'?playerLP:9000}</b></div></div></header><div className="layout"><nav className="sidebar">{nav.map(([id,label,Icon])=><button key={id} className={page===id?'active':''} onClick={()=>{beep();setPage(id)}}><Icon size={20}/><span>{tr(label)}</span>{page===id&&<b>▶</b>}</button>)}<div className="nav-foot">MEMORY CARD <span>01 / 08</span></div></nav><main className="main"><div className="hero"><div className="eye">◉</div><div className="hero-title">FORBIDDEN <span>PORTFOLIO</span></div><div className="subtitle">THE DEVELOPER'S DECK</div></div>{page==='inicio'&&<><div className="dialogue"><span className="npc">✦</span><p>{tr("Bem-vindo ao meu portfólio! Explore meus projetos como cartas, descubra minhas habilidades e desafie o deck em um duelo.")}</p><span className="blink">▼</span></div><h2 className="section-title">{tr('✧ Cartas em destaque')}</h2><div className="cards-strip"><button className="arrow" aria-label="Carta anterior" onClick={()=>setChosen(v=>(v+projects.length-1)%projects.length)}><ChevronLeft/></button>{[-1,0,1].map(offset=>{const i=(chosen+offset+projects.length)%projects.length;return <Card key={i} p={localizedProjects[i]} selected={offset===0} small onClick={()=>{setChosen(i);setPage('projetos')}}/>})}<button className="arrow" aria-label="Próxima carta" onClick={()=>setChosen(v=>(v+1)%projects.length)}><ChevronRight/></button></div><button className="primary" onClick={()=>setPage('projetos')}>ABRIR MEU DECK <span>→</span></button></>}{page==='projetos'&&<><h2 className="section-title">✧ Deck de projetos <span>{chosen+1} / {projects.length}</span></h2><div className="project-view"><div className="project-focus"><Card p={selected} selected/></div><div className="project-info"><div className="eyebrow">{tr("CARTA SELECIONADA")} · {selected.type.toUpperCase()}</div><h2>{selected.name}</h2><p>{selected.desc}</p><div className="chips">{selected.stack.map(s=><span key={s}>{s}</span>)}</div><div className="stats">⚔ ATK {selected.atk} <span>⬡ DEF {selected.def}</span></div><a href={selected.url} target="_blank" rel="noopener noreferrer" className="primary"><Github size={17}/> VER REPOSITÓRIO <ExternalLink size={15}/></a>{selected.demo&&<a href={selected.demo} target="_blank" rel="noopener noreferrer" className="secondary">VISITAR SITE <ExternalLink size={15}/></a>}</div></div><div className="deck-nav"><button onClick={()=>setChosen(v=>(v+projects.length-1)%projects.length)}><ChevronLeft/> ANTERIOR</button><button onClick={()=>setChosen(v=>(v+1)%projects.length)}>PRÓXIMA <ChevronRight/></button></div><div className="deck-grid">{projects.map((p,i)=><button key={p.name} className={chosen===i?'picked':''} onClick={()=>setChosen(i)}>{p.emoji} <span>{p.name}</span></button>)}</div></>}{page==='sobre'&&<section className="panel"><h2>{tr('✧ Perfil do Duelista')}</h2><div className="about-grid"><div className="large-portrait">{photoOk?<img src={retroPhoto?"/retrato-tematico.png":"/retrato-original.jpg"} onError={()=>setPhotoOk(false)} alt="Retrato de Jonas com moldura retrô inspirada no PlayStation 1"/>:<><UserRound size={60}/><small>Retrato indisponível</small></>}</div><div><div className="eyebrow">{tr("DUELISTA · DESENVOLVEDOR")}</div><button className="portrait-toggle" onClick={()=>setRetroPhoto(v=>!v)}>{tr(retroPhoto?'VER FOTO ORIGINAL':'VER MOLDURA TEMÁTICA')}</button><h2>Jonas Dzelme</h2><p>{tr('Desenvolvedor com foco em criar aplicações web úteis, bem estruturadas e visualmente marcantes. Minha trajetória combina experiência em organização, comunicação e trabalho em equipe com projetos práticos de front-end e back-end.')}</p><p>{tr('Atualmente busco oportunidades de estágio ou nível júnior para evoluir tecnicamente e contribuir em produtos reais.')}</p><div className="chips"><span>React</span><span>TypeScript</span><span>Node.js</span><span>PostgreSQL</span><span>Git</span></div></div></div></section>}{page==='habilidades'&&<section className="panel"><h2>{tr('⚔ Arsenal de Habilidades')}</h2><p>{tr("Cada tecnologia é uma peça do meu deck de desenvolvimento.")}</p><div className="skills">{[['Front-end',85,'React · HTML · CSS · JavaScript · Tailwind'],['Back-end',75,'Node.js · Express · REST APIs'],['Banco de dados',72,'PostgreSQL · Prisma · SQL'],['Ferramentas',82,'Git · GitHub · Vite · Deploy'],['Qualidade',68,'Debugging · Testes · Responsividade']].map(([name,value,desc])=><div className="skill" key={name}><div><b>{tr(String(name))}</b><small>{tr(String(desc))}</small></div><div className="meter"><i style={{width:`${value}%`}}/></div></div>)}</div><small className="note">{tr('Indicadores visuais ilustrativos, não certificações ou avaliações oficiais.')}</small></section>}{page==='contato'&&<section className="panel contact"><h2>{tr('✉ Envie uma mensagem ao Duelista')}</h2><p>{tr("Vamos conversar sobre projetos, oportunidades e desenvolvimento de software.")}</p><a href="https://wa.me/5521999435916?text=Ol%C3%A1%2C%20vim%20pelo%20seu%20portf%C3%B3lio!" target="_blank" rel="noopener noreferrer" className="secondary">✆ WHATSAPP</a><a href="https://www.linkedin.com/in/jonas-dzelme/" target="_blank" rel="noopener noreferrer" className="secondary">▣ LINKEDIN</a><a href="https://github.com/Dzelmee" target="_blank" rel="noopener noreferrer" className="secondary"><Github/> GITHUB</a><a href="/Curriculo_Jonas_Dzelme_Atualizado.pdf" download="Curriculo_Jonas_Dzelme.pdf" className="secondary contact-resume"><ScrollText/> {tr("BAIXAR CURRÍCULO")} {language==="en"?"(PT-BR PDF)":""}</a></section>}{page==='duelo'&&<section className="duel duel-v09"><div className="duel-head"><h2>{tr('⚔ O TEMPLO DO DUELO')}</h2><button onClick={reset}><RotateCcw size={16}/> {tr("REINICIAR")}</button></div><div className="duel-status"><div>BUG <strong>♥ {formatHP(enemyLP)} HP</strong></div><div>{tr("RODADA")} {turn+1}</div><div>{tr("VOCÊ")} <strong>♥ {playerLP} LP</strong></div></div>{!arenaOpen&&<div id="duel-menu" className="duel-intro"><span>{tr('✦ CAMPO DE BATALHA ✦')}</span><h3>{tr("AS CARTAS GANHAM VIDA")}</h3><p>{tr('Escolha um projeto, invoque sua carta e enfrente BUG, o invasor do templo.')}</p><button className="enter-arena" onClick={()=>{audio('select');setArenaOpen(true);setPlayed(v=>v===null?chosen:v);setDuelSlots(v=>v.every(x=>x===null)?[null,null,chosen,null,null]:v);setActiveSlot(2);setGuardian3D(false);setEnemyPlayed(v=>v===null?4:v);setCinema('summon');window.setTimeout(()=>setCinema('idle'),1500);window.setTimeout(()=>document.getElementById('arena-ps1')?.scrollIntoView({behavior:'smooth',block:'nearest'}),90)}}>{tr('▶ ENTRAR NO DUELO ◀')}</button></div>}{arenaOpen&&<div id="arena-ps1" className="arena-section arena-reveal"><div className="arena-exit-row"><button type="button" className="arena-back-button" onClick={leaveArena} aria-label={language==='en'?'Back to duel menu':'Voltar ao menu do duelo'}><ArrowLeft size={19}/><span>{language==='en'?'BACK TO DUEL MENU':'VOLTAR AO MENU'}</span></button><button type="button" className="arena-back-home" onClick={()=>{leaveArena();setPage('inicio')}}><Home size={17}/><span>{language==='en'?'HOME':'INÍCIO'}</span></button></div><div className="arena-hud"><span>{tr("☥ ARENA DO FARAÓ")}</span><span>{tr(cinema==='summon'?'INVOCANDO...':cinema==='attack'?'ATAQUE!':'MODO BATALHA')}</span></div><div className={'webgl-viewport '+(flash?'arena-impact ':'')+(cinema==='attack'&&played!==null?' attack-type-'+played:'')}><WebGLArena player={null} enemy={enemyPlayed} phase={cinema} flash={flash} projects={localizedDuelProjects} slots={duelSlots} guardianImages={guardianImages} activeSlot={activeSlot} defenseSlots={defenseSlots}/><div className="boss-health boss-health-floating"><div className="boss-health-head"><strong>{tr('☠ BUG — INVASOR DO TEMPLO')}</strong><span>{formatHP(enemyLP)} / {formatHP(BOSS_MAX_HP)} HP</span></div><div className="boss-health-track" role="progressbar" aria-label="Vida do BUG" aria-valuenow={enemyLP} aria-valuemin={0} aria-valuemax={BOSS_MAX_HP}><div style={{width:`${Math.max(0,enemyLP/BOSS_MAX_HP*100)}%`}} /></div><small>{tr('CHEFE SECRETO · Derrote o BUG para desbloquear o currículo!')}</small></div>{cinema==='attack'&&<div key={attackNonce} className={'special-attack special-attack-'+(played??0)+(critical?' critical-strike':'')+(comboReady?' fusion-strike':'')} style={{'--attack-x':`${18+activeSlot*16}%`} as React.CSSProperties}><div className="attack-origin"/><div className="attack-projectile"/><div className="attack-hit"/><strong>{attackLabel}{critical?' ✦ CRÍTICO!':''}{comboReady?' ✧ FUSÃO!':''}</strong></div>}<div className="webgl-overlay"><span>{tr("☥ TEMPLO DO FARAÓ · WEBGL")}</span><span>{tr(cinema==='summon'?'✦ INVOCANDO CRIATURA ✦':cinema==='attack'?'⚔ ATAQUE ESPECIAL ⚔':'CÂMERA DE BATALHA · PS1')}</span></div></div><div className="arena-controls"><div className="battle-log">{enemyLP===0?tr('VITÓRIA! Você venceu o duelo.'):playerLP===0?tr('DERROTA! Tente novamente.'):tr(log)}</div>{duelOutcome&&<div className={'duel-result '+duelOutcome}>{tr(duelOutcome==='victory'?'✦ VITÓRIA DO DUELISTA ✦':'☽ DUELO ENCERRADO ☽')}{duelOutcome==='victory'&&<a className="reward-link" href="/curriculo-premio.pdf" download="Curriculo_Jonas_Dzelme.pdf">{tr('🏆 RESGATAR PRÊMIO: MEU CURRÍCULO (PDF)')}</a>}<button onClick={reset}>JOGAR NOVAMENTE</button></div>}<div className="duel-slot-section"><div className="duel-slot-heading">{tr('SEU CAMPO · 5 ZONAS · ATAQUE / DEFESA')}</div><div className="duel-slot-grid">{duelSlots.map((v,k)=><button type="button" key={k} disabled={busy} draggable={!busy&&v!==null} onDragStart={e=>{if(v===null)return;e.dataTransfer.setData("text/plain",`slot:${k}`);e.dataTransfer.effectAllowed="move";setDraggingSlot(k);setDraggingDeck(null)}} onDragEnd={()=>{setDraggingSlot(null);setDraggingDeck(null)}} onDragOver={e=>{e.preventDefault();e.dataTransfer.dropEffect="move"}} onDrop={e=>{e.preventDefault();const data=e.dataTransfer.getData("text/plain");if(data.startsWith("slot:"))moveOrFuse(Number(data.slice(5)),k);else if(data.startsWith("deck:"))attackAt(Number(data.slice(5)),k);setDraggingSlot(null);setDraggingDeck(null)}} onClick={()=>{setActiveSlot(k);if(v!==null){setPlayed(v);setGuardian3D(false)}else{setPlayed(null);setGuardian3D(false)}}} className={'duel-slot '+(defenseSlots[k]?'slot-defense ':'')+(k===activeSlot?'duel-slot-active ':'')+(k===fusionTarget?'duel-slot-fusion ':'')+(v!==null?'duel-slot-occupied':'')} aria-label={`Zona ${k+1}${v===null?' vazia':': '+duelProjects[v].name}`}><span className="duel-slot-num">{k+1}</span>{v!==null?<><img style={defenseSlots[k]?{transform:"rotate(90deg) scale(.85)"}:undefined} src={duelProjects[v].art} alt="" /><small>{duelProjects[v].name}</small></>:<span className="duel-slot-empty">＋</span>}</button>)}</div>{duelSlots[activeSlot]!==null&&<div className="selected-monster-panel"><img src={duelProjects[duelSlots[activeSlot]!].art} alt="Carta selecionada"/><div><strong>{duelProjects[duelSlots[activeSlot]!].name}</strong><span>ATK {duelProjects[duelSlots[activeSlot]!].atk} · DEF {duelProjects[duelSlots[activeSlot]!].def}</span><button type="button" className="stance-toggle" disabled={busy} onClick={()=>setDefenseSlots(v=>v.map((d,k)=>k===activeSlot?!d:d))}>{tr(defenseSlots[activeSlot]?'⬡ DEFESA — MUDAR PARA ATAQUE':'⚔ ATAQUE — MUDAR PARA DEFESA')}</button><button type="button" className="monster-attack-btn" disabled={busy||enemyLP<=0||playerLP<=0||defenseSlots[activeSlot]} onClick={attackSelected}>⚔ {tr(attackNames[duelSlots[activeSlot]!] )} {tr("· ATACAR")}</button></div></div>}<div className="fusion-guide fusion-guide-new"><strong>{tr('✦ FUSÕES — ARRASTE UMA CARTA SOBRE OUTRA')}</strong><p>{tr('Arraste um monstro de uma zona para outra. Se formar um par compatível, você desbloqueia um ataque combinado; as duas cartas se unem em uma criatura nova. Para trocar de posição, arraste para uma zona vazia ou ocupada. Também é possível arrastar cartas do deck para as zonas.')}</p><div className="fusion-pairs">{Object.entries(fusionPairs).map(([key,pair])=><div key={key} className={'fusion-pair '+(duelSlots.includes(pair.result)?'fusion-active':'')}><span>{key.split('-').map(v=>projects[Number(v)].name).join(' + ')}</span><b>{pair.name} · +{Math.round((pair.bonus-1)*100)}%</b></div>)}</div></div><p className="duel-slot-hint">{tr('Clique numa zona para selecionar ou arraste cartas entre as cinco posições. Ao entrar, a carta inicial ocupa a zona central (3). BUG permanece no centro do campo adversário.')}</p></div><h3>{tr(busy?'Invocação em andamento...':'ESCOLHA UMA CARTA PARA INVOCAR')}</h3><div className="hand">{projects.map((p,i)=><div key={p.name} className="draggable-deck-card" draggable={!busy} onDragStart={e=>{e.dataTransfer.setData("text/plain",`deck:${i}`);e.dataTransfer.effectAllowed="copy";setDraggingDeck(i);setDraggingSlot(null)}} onDragEnd={()=>{setDraggingDeck(null);setDraggingSlot(null)}}><Card p={{...p,desc:tr(p.desc),type:tr(p.type)}} small onClick={()=>attack(i)}/></div>)}</div><small className="note">{tr('Minigame original e simplificado: ataque, defesa e contra-ataque. Não reproduz as regras oficiais.')}</small></div></div>}</section>}</main><aside className="right-panel"><h3>{tr('Sobre Mim')}</h3><div className="side-avatar">{photoOk?<img src="/retrato-tematico.png" onError={()=>setPhotoOk(false)} alt="Retrato de Jonas com moldura retrô inspirada no PlayStation 1"/>:<span>JD</span>}</div><b>Jonas Dzelme</b><p>{tr("Desenvolvedor Full Stack com foco em interfaces e aplicações web.")}</p><hr/><strong>{tr('✦ Foco atual')}</strong><small>Front-end · Back-end · QA</small><strong>{tr("✦ Disponibilidade")}</strong><small>{tr("Estágio / Júnior")}</small><button onClick={()=>setPage('sobre')}>{tr('VER PERFIL →')}</button></aside></div><footer><span className="audio-hint">{tr(muted?'♫ ATIVE O ÁUDIO NO TOPO':'♫ TRILHA ORIGINAL ATIVA')}</span><span>{tr('✕ SELECIONAR')}</span><span>◯ ESC VOLTAR</span><span>△ VER DETALHES</span><span className="footer-right">FORBIDDEN PORTFOLIO · BUILD 42</span></footer></div>};createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
