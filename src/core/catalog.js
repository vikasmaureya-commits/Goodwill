const CATS = [
  {id:'all',   label:'Alle'},
  {id:'food',  label:'Lebensmittel'},
  {id:'med',   label:'Medikamente'},
  {id:'home',  label:'Haushalt'},
  {id:'other', label:'Sonstiges'}
];
const ITEMS = [
  /* Lebensmittel – die ersten drei sind die „Beliebten Artikel“ */
  {id:'milch',  name:'Milch',  cat:'food', photo:'milk',   syn:['milch','vollmilch'], kind:'vol', unit:'Liter', step:1, start:1, max:10, opts:[1,2,3], q:'Wie viel Milch möchten Sie?'},
  {id:'brot',   name:'Brot',   cat:'food', photo:'bread',  syn:['brot','brote','brotlaib'], kind:'count', noun:['Brot','Brote'], unit:'Stück', step:1, start:1, max:10, opts:[1,2], q:'Wie viele Brote möchten Sie?'},
  {id:'aepfel', name:'Äpfel',  cat:'food', photo:'apples', syn:['apfel','aepfel'], kind:'mass', unit:'kg', fac:1000, step:500, start:1000, max:10000, opts:[500,1000,2000], q:'Wie viele Äpfel möchten Sie?'},
  {id:'broetchen',name:'Brötchen',cat:'food', syn:['broetchen','broetchens'], kind:'count', noun:['Brötchen','Brötchen'], unit:'Stück', step:1, start:4, max:30, opts:[4,6,8], q:'Wie viele Brötchen möchten Sie?'},
  {id:'eier',   name:'Eier',   cat:'food', syn:['ei','eier'], kind:'count', noun:['Ei','Eier'], unit:'Stück', step:1, start:6, max:30, opts:[6,10,12], q:'Wie viele Eier möchten Sie?'},
  {id:'kaese',  name:'Käse',   cat:'food', syn:['kaese','gouda','edamer'], kind:'mass', unit:'Gramm', step:50, start:100, max:2000, opts:[100,200,500], q:'Wie viel Käse möchten Sie?'},
  {id:'wurst',  name:'Wurst',  cat:'food', syn:['wurst','aufschnitt','schinken'], kind:'mass', unit:'Gramm', step:50, start:100, max:2000, opts:[100,200,300], q:'Wie viel Wurst möchten Sie?'},
  {id:'butter', name:'Butter', cat:'food', syn:['butter'], kind:'mass', unit:'Gramm', step:250, start:250, max:2000, opts:[250,500], q:'Wie viel Butter möchten Sie?'},
  {id:'joghurt',name:'Joghurt',cat:'food', syn:['joghurt','jogurt','joghurts'], kind:'count', noun:['Becher','Becher'], unit:'Becher', step:1, start:1, max:20, opts:[1,2,4], q:'Wie viele Becher Joghurt möchten Sie?'},
  {id:'kartoffeln',name:'Kartoffeln',cat:'food', syn:['kartoffel','kartoffeln'], kind:'mass', unit:'kg', fac:1000, step:500, start:1000, max:10000, opts:[1000,2000,5000], q:'Wie viele Kartoffeln möchten Sie?'},
  {id:'gemuese',name:'Gemüse', cat:'food', syn:['gemuese','karotten','moehren'], kind:'mass', unit:'kg', fac:1000, step:500, start:500, max:10000, opts:[500,1000,2000], q:'Wie viel Gemüse möchten Sie?'},
  {id:'bananen',name:'Bananen',cat:'food', syn:['banane','bananen'], kind:'count', noun:['Banane','Bananen'], unit:'Stück', step:1, start:3, max:30, opts:[3,5,6], q:'Wie viele Bananen möchten Sie?'},
  {id:'nudeln', name:'Nudeln', cat:'food', syn:['nudeln','spaghetti','pasta'], kind:'mass', unit:'Gramm', step:250, start:500, max:5000, opts:[500,1000], q:'Wie viel Nudeln möchten Sie?'},
  {id:'reis',   name:'Reis',   cat:'food', syn:['reis'], kind:'mass', unit:'Gramm', step:250, start:500, max:5000, opts:[500,1000], q:'Wie viel Reis möchten Sie?'},
  {id:'zucker', name:'Zucker', cat:'food', syn:['zucker'], kind:'mass', unit:'Gramm', step:250, start:500, max:5000, opts:[500,1000], q:'Wie viel Zucker möchten Sie?'},
  {id:'kaffee', name:'Kaffee', cat:'food', syn:['kaffee'], kind:'mass', unit:'Gramm', step:250, start:250, max:2000, opts:[250,500], q:'Wie viel Kaffee möchten Sie?'},
  {id:'tee',    name:'Tee',    cat:'food', syn:['tee'], kind:'count', noun:['Packung','Packungen'], unit:'Packung', step:1, start:1, max:20, opts:[1,2,3], q:'Wie viele Packungen Tee möchten Sie?'},
  {id:'saft',   name:'Saft',   cat:'food', syn:['saft','orangensaft','apfelsaft'], kind:'vol', unit:'Liter', step:1, start:1, max:10, opts:[1,2], q:'Wie viel Saft möchten Sie?'},
  {id:'wasser', name:'Wasser', cat:'food', syn:['wasser','mineralwasser'], kind:'count', noun:['Flasche','Flaschen'], unit:'Flasche', step:1, start:1, max:24, opts:[1,2,6], q:'Wie viele Flaschen Wasser möchten Sie?'},
  /* Medikamente (rezeptfrei) */
  {id:'schmerz',name:'Schmerztabletten',cat:'med', syn:['schmerztabletten','schmerzmittel','ibuprofen','paracetamol','aspirin','kopfschmerztabletten'], kind:'count', noun:['Packung','Packungen'], unit:'Packung', step:1, start:1, max:10, opts:[1,2], q:'Wie viele Packungen Schmerztabletten möchten Sie?'},
  {id:'pflaster',name:'Pflaster',cat:'med', syn:['pflaster'], kind:'count', noun:['Packung','Packungen'], unit:'Packung', step:1, start:1, max:10, opts:[1,2], q:'Wie viele Packungen Pflaster möchten Sie?'},
  {id:'hustensaft',name:'Hustensaft',cat:'med', syn:['hustensaft'], kind:'count', noun:['Flasche','Flaschen'], unit:'Flasche', step:1, start:1, max:10, opts:[1,2], q:'Wie viele Flaschen Hustensaft möchten Sie?'},
  {id:'halsbonbons',name:'Halsbonbons',cat:'med', syn:['halsbonbons','lutschtabletten'], kind:'count', noun:['Packung','Packungen'], unit:'Packung', step:1, start:1, max:10, opts:[1,2], q:'Wie viele Packungen Halsbonbons möchten Sie?'},
  {id:'vitamine',name:'Vitamine',cat:'med', syn:['vitamine','vitamintabletten'], kind:'count', noun:['Packung','Packungen'], unit:'Packung', step:1, start:1, max:10, opts:[1,2], q:'Wie viele Packungen Vitamine möchten Sie?'},
  /* Haushalt */
  {id:'klopapier',name:'Toilettenpapier',cat:'home', syn:['toilettenpapier','klopapier'], kind:'count', noun:['Packung','Packungen'], unit:'Packung', step:1, start:1, max:10, opts:[1,2], q:'Wie viele Packungen Toilettenpapier möchten Sie?'},
  {id:'spuelmittel',name:'Spülmittel',cat:'home', syn:['spuelmittel'], kind:'count', noun:['Flasche','Flaschen'], unit:'Flasche', step:1, start:1, max:10, opts:[1,2], q:'Wie viele Flaschen Spülmittel möchten Sie?'},
  {id:'waschmittel',name:'Waschmittel',cat:'home', syn:['waschmittel'], kind:'count', noun:['Packung','Packungen'], unit:'Packung', step:1, start:1, max:10, opts:[1,2], q:'Wie viele Packungen Waschmittel möchten Sie?'},
  {id:'kuechenrolle',name:'Küchenrolle',cat:'home', syn:['kuechenrolle','kuechenpapier'], kind:'count', noun:['Packung','Packungen'], unit:'Packung', step:1, start:1, max:10, opts:[1,2], q:'Wie viele Packungen Küchenrolle möchten Sie?'},
  {id:'muellbeutel',name:'Müllbeutel',cat:'home', syn:['muellbeutel','muellsaecke'], kind:'count', noun:['Rolle','Rollen'], unit:'Rolle', step:1, start:1, max:10, opts:[1,2], q:'Wie viele Rollen Müllbeutel möchten Sie?'},
  {id:'gluehbirne',name:'Glühbirne',cat:'home', syn:['gluehbirne','gluehbirnen'], kind:'count', noun:['Stück','Stück'], unit:'Stück', step:1, start:1, max:10, opts:[1,2], q:'Wie viele Glühbirnen möchten Sie?'},
  {id:'seife',  name:'Seife',  cat:'home', syn:['seife'], kind:'count', noun:['Stück','Stück'], unit:'Stück', step:1, start:1, max:10, opts:[1,2,3], q:'Wie viele Stück Seife möchten Sie?'},
  /* Sonstiges */
  {id:'batterien',name:'Batterien',cat:'other', syn:['batterie','batterien'], kind:'count', noun:['Packung','Packungen'], unit:'Packung', step:1, start:1, max:10, opts:[1,2], q:'Wie viele Packungen Batterien möchten Sie?'},
  {id:'briefmarken',name:'Briefmarken',cat:'other', syn:['briefmarke','briefmarken'], kind:'count', noun:['Stück','Stück'], unit:'Stück', step:1, start:5, max:50, opts:[5,10], q:'Wie viele Briefmarken möchten Sie?'},
  {id:'zeitung',name:'Zeitung',cat:'other', syn:['zeitung'], kind:'count', noun:['Stück','Stück'], unit:'Stück', step:1, start:1, max:10, opts:[1,2], q:'Wie viele Zeitungen möchten Sie?'}
];

const ITEM_BY_ID = Object.fromEntries(ITEMS.map(i=>[i.id,i]));
const SYN = {};
ITEMS.forEach(i=>i.syn.forEach(s=>{SYN[s]=i;}));
const SYN_EN = {}; ITEMS.forEach(i=>{ const e=EN_ITEMS[i.id]; if(e) e.syn.forEach(s=>{SYN_EN[s]=i;}); });
function iName(it){ const e=EN_ITEMS[it.id]; return (LANG==='en'&&e)?e.name:it.name; }
function iUnit(it){ const e=EN_ITEMS[it.id]; if(LANG==='en'){ if(e) return e.unit; if(it.custom) return 'piece'; } return it.unit; }
function iQ(it){
  if(it.custom) return LANG==='en' ? 'How many “'+it.name+'” would you like?' : it.q;
  const e=EN_ITEMS[it.id]; return (LANG==='en'&&e) ? e.q : it.q;
}
function nounsOf(it){
  if(LANG==='en'){ const e=EN_ITEMS[it.id]; if(e&&e.noun) return e.noun; if(it.custom) return ['piece','pieces']; }
  return it.noun;
}

function fmtNum(x){ return String(Math.round(x*100)/100).replace('.',LANG==='en'?'.':','); }
function fmtQty(item, v, long){
  if(v==null) return '';
  const en = LANG==='en';
  if(item.kind==='mass'){
    if(v>=1000) return fmtNum(v/1000)+' '+(long?(en?'kilos':'Kilo'):'kg');
    return fmtNum(v)+' '+(long?(en?'grams':'Gramm'):'g');
  }
  if(item.kind==='vol') return fmtNum(v)+' '+(en?(v===1?'litre':'litres'):'Liter');
  const nn = nounsOf(item);
  return fmtNum(v)+' '+(v===1?nn[0]:nn[1]);
}
function questionSpoken(item){
  const o = item.opts.map(v=>fmtQty(item,v,true));
  const last = o.pop();
  return iQ(item)+' '+(o.length? o.join(', ')+L(' oder ',' or ')+last : last)+'?';
}

function tokenize(text){
  let t = text.toLowerCase();
  if(LANG==='en') EN_PHRASES.forEach(([re,r])=>{ t=t.replace(re,r); });
  t = t
    .replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss');
  t = t.replace(/(\d),(\d)/g,'$1.$2')
       .replace(/[,;]/g,' , ')
       .replace(/\.(?!\d)/g,' ')
       .replace(/[^a-z0-9.,\s]/g,' ')
       .replace(/(\d)([a-z])/g,'$1 $2');
  const tk = t.split(/\s+/).filter(Boolean);
  return LANG==='en' ? enTokens(tk) : tk;
}

const U = {ein:1,eine:1,einen:1,einem:1,eins:1,zwei:2,zwo:2,drei:3,vier:4,fuenf:5,sechs:6,sieben:7,acht:8,neun:9,zehn:10,elf:11,zwoelf:12,dreizehn:13,vierzehn:14,fuenfzehn:15,sechzehn:16,siebzehn:17,achtzehn:18,neunzehn:19};
const T = {zwanzig:20,dreissig:30,vierzig:40,fuenfzig:50,sechzig:60,siebzig:70,achtzig:80,neunzig:90};
function deNum(w){
  if(w==null) return null;
  if(/^\d+(\.\d+)?$/.test(w)) return parseFloat(w);
  if(LANG==='en') return null;
  if(!/^[a-z]+$/.test(w)) return null;
  let total=0, rest=w, m;
  m = rest.match(/^(.*?)tausend(.*)$/);
  if(m){ const a = m[1]? deNum(m[1]) : 1; if(a===null) return null; total += a*1000; rest=m[2]; if(!rest) return total; }
  m = rest.match(/^(.*?)hundert(.*)$/);
  if(m){ const a = m[1]? deNum(m[1]) : 1; if(a===null) return null; total += a*100; rest=m[2]; if(!rest) return total; }
  if(U[rest]!==undefined) return total+U[rest];
  if(T[rest]!==undefined) return total+T[rest];
  const t = rest.match(/^(.+)und(zwanzig|dreissig|vierzig|fuenfzig|sechzig|siebzig|achtzig|neunzig)$/);
  if(t && U[t[1]]!==undefined) return total+T[t[2]]+U[t[1]];
  return null;
}

const UNIT = {
  gramm:['mass',1], gr:['mass',1], g:['mass',1], kilo:['mass',1000], kilogramm:['mass',1000], kg:['mass',1000], pfund:['mass',500],
  liter:['vol',1], l:['vol',1], milliliter:['vol',0.001], ml:['vol',0.001],
  stueck:['count',1], stk:['count',1], packung:['count',1], packungen:['count',1], pack:['count',1],
  flasche:['count',1], rolle:['count',1], rollen:['count',1], flaschen:['count',1], becher:['count',1], laib:['count',1], laibe:['count',1], dutzend:['count',12]
};
const HALF = /^halb(e|er|es|en)?$/;

/* Sucht in Tokens eine Mengenangabe. mode: 'inline' (Teil des Bestellsatzes) | 'answer' (Antwort auf Rückfrage).
   side: 'before' | 'after' | 'any' – für Zahlen ohne Einheit muss die Zahl direkt am Artikel stehen. */
function parseQtyTokens(tokens, item, mode, side){
  const HALFR = LANG==='en' ? HALF_EN : HALF, UNITS = LANG==='en' ? UNIT_EN : UNIT;
  for(let i=0;i<tokens.length;i++){
    let j=i, num=null;
    if(HALFR.test(tokens[j])){ num=0.5; j++; }
    else if(tokens[j]==='anderthalb'||tokens[j]==='eineinhalb'){ num=1.5; j++; }
    else {
      const n = deNum(tokens[j]);
      if(n===null) continue;
      num=n; j++;
      if(n===1 && tokens[j] && HALFR.test(tokens[j])){ num=0.5; j++; }
    }
    const un = tokens[j] ? UNITS[tokens[j]] : undefined;
    let v=null, end=j-1;
    if(un){
      if(item.kind==='mass' && un[0]==='mass') v=num*un[1];
      else if(item.kind==='vol' && un[0]==='vol') v=num*un[1];
      else if(item.kind==='count' && un[0]==='count') v=num*un[1];
      else continue;
      end=j;
    } else {
      if(item.kind==='count'){
        if(num<1 || num%1!==0) continue;
        if(mode==='inline'){
          const adjacent = (side==='before' && end===tokens.length-1) || (side==='after' && i===0);
          if(!adjacent) continue;
        }
        v=num;
      } else if(mode==='answer'){
        if(item.kind==='mass') v = num>=50 ? num : num*1000;
        else v = num;
      } else if(num===0.5 && HALFR.test(tokens[i])){
        continue; // "halbe" ohne Einheit – unklar
      } else continue;
    }
    v = Math.round(v*1000)/1000;
    const max = item.kind==='mass'?20000:item.kind==='vol'?20:60;
    if(v<=0 || v>max) continue;
    if(item.kind==='mass' && v<10) continue;
    return {v, start:i, end};
  }
  return null;
}

/* Erkennt Artikel (und, wenn genannt, Mengen) in einem gesprochenen Satz. */
function parseOrder(text){
  const tokens = tokenize(text);
  const hits=[];
  tokens.forEach((t,i)=>{ const it=(LANG==='en'?SYN_EN:SYN)[t]; if(it && !hits.some(h=>h.item.id===it.id)) hits.push({idx:i,item:it}); });
  const used = new Array(tokens.length).fill(false);
  hits.forEach(h=>{used[h.idx]=true;});
  const isBound = t => t==='und'||t===','||t==='sowie'||t==='and'||t==='plus';
  const out=[];
  for(const h of hits){
    let qty=null;
    let k=h.idx-1;
    while(k>=0 && !used[k] && !isBound(tokens[k]) && h.idx-k<=4) k--;
    const before = tokens.slice(k+1,h.idx);
    let r = parseQtyTokens(before,h.item,'inline','before');
    if(r){ for(let x=r.start;x<=r.end;x++) used[k+1+x]=true; qty=r.v; }
    else {
      let e=h.idx+1;
      while(e<tokens.length && !used[e] && !isBound(tokens[e]) && e-h.idx<=4) e++;
      const after = tokens.slice(h.idx+1,e);
      r = parseQtyTokens(after,h.item,'inline','after');
      if(r){ for(let x=r.start;x<=r.end;x++) used[h.idx+1+x]=true; qty=r.v; }
    }
    out.push({item:h.item, qty});
  }
  return out;
}

/* Antwort auf „Wie viel …?“ */
function parseAnswer(text, item){
  const tokens = tokenize(text);
  if(tokens.some(t=>['nein','nichts','streichen','entfernen','doch','no','nothing','remove','delete','cancel'].includes(t)) && !tokens.some(t=>deNum(t)!==null)) return {remove:true};
  const r = parseQtyTokens(tokens,item,'answer','any');
  if(r) return {v:r.v};
  const ord = {first:0,second:1,third:2,erste:0,erster:0,erstes:0,ersten:0,zweite:1,zweiter:1,zweites:1,zweiten:1,dritte:2,dritter:2,drittes:2,dritten:2};
  for(const t of tokens){
    if(ord[t]!==undefined && item.opts[ord[t]]!==undefined) return {v:item.opts[ord[t]]};
    if(t==='letzte'||t==='letzten'||t==='letztes'||t==='last') return {v:item.opts[item.opts.length-1]};
  }
  return null;
}
