(function(){
  const $ = id => document.getElementById(id);
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const esc = GWSec.esc;
  const cap = s => s.charAt(0).toUpperCase()+s.slice(1);

  /* Bilder einsetzen */
  document.querySelectorAll('img.logo-full').forEach(i=>i.src=GW.LOGO); document.querySelectorAll('img.logo-leaf').forEach(i=>i.src=GW.LEAF);
  const slides=[...document.querySelectorAll('#hero .slide')], dots=[...document.querySelectorAll('#hero .dots i')]; let cur=0;
  slides.forEach(s=>s.style.backgroundImage=`url(${GW[s.dataset.k]})`);
  const showSlide=n=>{ cur=(n+slides.length)%slides.length; slides.forEach((s,i)=>s.classList.toggle('on',i===cur)); dots.forEach((d,i)=>d.classList.toggle('on',i===cur)); if(window.GWHeroCap) GWHeroCap(); };
  dots.forEach((d,i)=>d.onclick=()=>showSlide(i));
  setInterval(()=>{ if(!document.hidden && !$('s-home').classList.contains('hidden')) showSlide(cur+1); }, 4500);
  ['A1','A2','A3'].forEach((k,i) => { $('mapA'+(i+1)).src = GW[k]; $('listA'+(i+1)).src = GW[k]; });
  const PHOTOS = {milk:GW.MILK, bread:GW.BREAD, apples:GW.APPLES};

  /* Symbole */
  const ICON = {
    all:'<svg viewBox="0 0 24 24"><rect x="4" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.8"/></svg>',
    food:'<svg viewBox="0 0 24 24"><path d="M4 9.5h16l-1.7 8.6a2 2 0 0 1-2 1.6H7.7a2 2 0 0 1-2-1.6L4 9.5z"/><path d="M8.5 9.5l3-5.5M15.5 9.5l-3-5.5"/></svg>',
    med:'<svg viewBox="0 0 24 24"><rect x="6.5" y="8" width="11" height="13" rx="2.5"/><path d="M8 4h8v4H8z"/><path d="M12 11.5v6M9 14.5h6"/></svg>',
    home:'<svg viewBox="0 0 24 24"><path d="M4 11.5L12 5l8 6.5"/><path d="M6 10.5V19h12v-8.5"/><path d="M10 19v-5h4v5"/></svg>',
    other:'<svg viewBox="0 0 24 24"><circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/></svg>'
  };
  /* Minimalistische Artikel-Symbole (Linie + weiche Fläche), einheitlich im Salbei-Ton */
  const MI = {
    milch:'<path class="a" d="M17 9h14l5 9v22H12V18z"/><path d="M12 18h24M20 28h8"/>',
    brot:'<path class="b" d="M8 33c0-9 7-16 16-16s16 7 16 16v4H8z"/><path d="M18 24l3 7M25 23l3 8M32 24l3 7"/>',
    aepfel:'<path class="b" d="M24 15c-4-3-14-2-14 10 0 9 6 16 10 16 2 0 3-1 4-1s2 1 4 1c4 0 10-7 10-16 0-12-10-13-14-10z"/><path d="M24 15c0-4 1-6 4-8"/><path class="a" d="M27 11c2-2 5-2 7-1-1 2-4 3-7 1z"/>',
    broetchen:'<path class="b" d="M8 33c0-9 7-16 16-16s16 7 16 16c0 2-2 4-5 4H13c-3 0-5-2-5-4z"/><path d="M19 22c1 3 1 6 0 9M29 22c-1 3-1 6 0 9"/>',
    eier:'<path class="a" d="M24 8c-7 0-12 11-12 19a12 12 0 0 0 24 0C36 19 31 8 24 8z"/>',
    kaese:'<path class="b" d="M7 34V23l34-9v20z"/><circle cx="18" cy="29" r="2.4"/><circle cx="30" cy="25" r="2"/><circle cx="34" cy="30" r="1.4"/>',
    wurst:'<g transform="rotate(-32 24 24)"><rect class="b" x="7" y="17" width="34" height="14" rx="7"/><path d="M14 17v14M34 17v14"/></g>',
    butter:'<path class="a" d="M7 23h28v14H7z"/><path class="b" d="M7 23l7-9h27l-6 9z"/><path d="M35 23l6-9v14l-6 9z"/>',
    joghurt:'<path class="a" d="M12 17h24l-3 23H15z"/><path d="M10 17h28M13 26h22"/><path class="b" d="M16 11h16v6H16z"/>',
    kartoffeln:'<path class="b" d="M9 27c0-9 8-15 17-14 9 1 14 8 12 16-2 7-10 10-18 8-7-2-11-5-11-10z"/><circle cx="19" cy="23" r="1.2"/><circle cx="29" cy="27" r="1.2"/><circle cx="23" cy="33" r="1.2"/>',
    gemuese:'<path class="b" d="M13 18c5-5 16-5 21 0L24 43z"/><path d="M24 17c0-4 1-7 4-9M24 17c-2-4-5-6-8-6"/>',
    bananen:'<path class="b" d="M10 13C7 30 20 41 41 34l1-5C27 31 17 25 15 13z"/><path d="M10 13l5-1"/>',
    nudeln:'<path class="a" d="M8 27h32c0 9-7 14-16 14S8 36 8 27z"/><path d="M15 22c2-3 4 3 6 0s4 3 6 0 4 3 6 0"/><path d="M30 8l7 13"/>',
    reis:'<path class="a" d="M8 28h32c0 9-7 13-16 13S8 37 8 28z"/><path class="b" d="M12 28c0-8 6-13 12-13s12 5 12 13"/>',
    zucker:'<path class="a" d="M14 17h20v23H14z"/><path class="b" d="M12 11h24v6H12z"/><path d="M20 26h8M20 32h8"/>',
    kaffee:'<path class="a" d="M10 21h24v9c0 6-5 10-12 10S10 36 10 30z"/><path d="M34 23h3a4 4 0 0 1 0 8h-3M18 8c-2 3 2 4 0 7M26 8c-2 3 2 4 0 7"/>',
    tee:'<path class="a" d="M10 21h24v9c0 6-5 10-12 10S10 36 10 30z"/><path d="M34 23h3a4 4 0 0 1 0 8h-3"/><path class="b" d="M16 8h12l-1 8H17z"/><path d="M22 16v5"/>',
    saft:'<path class="b" d="M14 14h20v27H14z"/><path d="M28 14l4-8h5"/><circle class="a" cx="24" cy="28" r="6"/>',
    wasser:'<path class="a" d="M20 6h8v6l5 7v22H15V19l5-7z"/><path d="M20 10h8M15 29c3-2 6 2 9 0s6 2 9 0"/>',
    schmerz:'<g transform="rotate(-35 24 24)"><rect class="b" x="7" y="17" width="34" height="14" rx="7"/><path class="a" d="M24 17h10a7 7 0 0 1 0 14H24z"/></g>',
    pflaster:'<g transform="rotate(-35 24 24)"><rect class="b" x="6" y="17" width="36" height="14" rx="7"/><rect class="a" x="18" y="17" width="12" height="14"/><path d="M22 22h0M26 22h0M22 26h0M26 26h0"/></g>',
    hustensaft:'<path class="a" d="M18 15h12v4l4 4v18H14V23l4-4z"/><path class="b" d="M18 8h12v7H18z"/><path d="M24 27v8M20 31h8"/>',
    halsbonbons:'<circle class="b" cx="24" cy="24" r="8"/><path class="a" d="M16 24l-9-6v12zM32 24l9-6v12z"/>',
    vitamine:'<path class="a" d="M14 17h20v23H14z"/><path class="b" d="M16 9h16v8H16z"/><path d="M24 25v9M19.500 29.500h9"/>',
    klopapier:'<circle class="a" cx="22" cy="23" r="14"/><circle cx="22" cy="23" r="5"/><path class="b" d="M34 30l7 12-12-3z"/>',
    spuelmittel:'<path class="a" d="M19 17h10v5l6 5v14H13V27l6-5z"/><path d="M19 17l-1-8h8"/><path class="b" d="M24 29c-3 3-3 7 0 7s3-4 0-7z"/>',
    waschmittel:'<path class="a" d="M10 17h28v23H10z"/><path class="b" d="M10 17l4-7h20l4 7z"/><path d="M15 29c3-3 6 3 9 0s6 3 9 0"/>',
    kuechenrolle:'<path class="a" d="M14 12h20v28H14z"/><path class="b" d="M14 12c0 4 20 4 20 0s-20-4-20 0z"/><path d="M14 27h20"/>',
    muellbeutel:'<path class="a" d="M14 17h20l-2 23H16z"/><path d="M10 17h28M20 17v-5h8v5M21 24v11M27 24v11"/>',
    gluehbirne:'<path class="b" d="M24 7a13 13 0 0 0-7 24v4h14v-4A13 13 0 0 0 24 7z"/><path d="M19 39h10M21 43h6"/>',
    seife:'<rect class="a" x="8" y="19" width="32" height="17" rx="7"/><circle class="b" cx="35" cy="11" r="3.500"/><circle cx="29" cy="8" r="2"/>',
    batterien:'<rect class="a" x="8" y="16" width="28" height="16" rx="3"/><path d="M36 21h4v6h-4z"/><path class="b" d="M25 18l-5 7h7l-5 7"/>',
    briefmarken:'<rect class="a" x="11" y="9" width="26" height="30" rx="2" stroke-dasharray="3 2.500"/><rect class="b" x="17" y="15" width="14" height="18" rx="1"/>',
    zeitung:'<rect class="a" x="8" y="10" width="32" height="28" rx="3"/><path d="M14 18h11M14 24h20M14 30h20"/><path class="b" d="M29 15h6v6h-6z"/>',
    _bag:'<path class="a" d="M12 18h24l-2 22H14z"/><path d="M18 18v-3a6 6 0 0 1 12 0v3"/>'
  };
  const emo = id => `<svg class="mi" viewBox="0 0 48 48" aria-hidden="true">${MI[id]||MI._bag}</svg>`;
  const CATEMO = {all:emo('aepfel'),food:emo('aepfel'),med:emo('schmerz'),home:emo('seife'),other:emo('zeitung')};
  const MINUS='<svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg>', PLUS='<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>';

  /* Zustand */
  const state = { cart:{}, order:[], custom:{}, cat:'all', expanded:false, query:'', queue:[], current:null,
                  voiceMode:false, voiceTotal:0, retries:0, freq:null, nav:['home'],
                  group:null, sel:false, fontIdx:0, recPaused:false, reqs:[], sent:null };
  let rec=null, listening=false, listenSeq=0, toastTimer=null;
  const getItem = id => ITEM_BY_ID[id] || state.custom[id];

  /* ---------- Sprache umschalten ---------- */
  const TXT = new WeakMap(), ATT = new WeakMap();
  const ATTRS = ['placeholder','aria-label','alt','title'];
  function trKey(s){ const m=s.match(/^(\s*)([\s\S]*?)(\s*)$/); return m; }
  function translateDOM(){
    const en = LANG==='en';
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    const nodes=[]; let n; while((n=w.nextNode())) nodes.push(n);
    nodes.forEach(node=>{
      const p=node.parentElement; if(!p || p.closest('[data-dyn],script,style')) return;
      let orig = TXT.get(node);
      if(orig===undefined){ orig=node.nodeValue; if(!orig.trim()) return; TXT.set(node,orig); }
      if(!en){ if(node.nodeValue!==orig) node.nodeValue=orig; return; }
      const m=trKey(orig); const tr=DICT[m[2]];
      node.nodeValue = tr!==undefined ? m[1]+tr+m[3] : orig;
    });
    document.querySelectorAll('[placeholder],[aria-label],[alt],[title]').forEach(el=>{
      if(el.closest('[data-dyn]')) return;
      let store=ATT.get(el); if(!store){ store={}; ATT.set(el,store); }
      ATTRS.forEach(a=>{
        if(!el.hasAttribute(a)) return;
        if(!(a in store)) store[a]=el.getAttribute(a);
        const orig=store[a];
        el.setAttribute(a, en && DICT[orig]!==undefined ? DICT[orig] : orig);
      });
    });
  }
  const FONTS=[['Normal','Normal',16],['Groß','Large',19.5],['Sehr groß','Very large',22]];
  function renderRec(){
    const s=$('recPause'); s.classList.toggle('on',!state.recPaused); s.setAttribute('aria-checked',String(!state.recPaused)); s.setAttribute('aria-label',L('Regelmäßige Hilfe','Regular help'));
    $('recSub').textContent = state.recPaused ? L('Pausiert','Paused') : L('Äpfel, Eier, Joghurt','Apples, eggs, yoghurt');
  }
  function renderFreqPill(){
    const p=$('freqPill'); p.classList.toggle('hidden', !state.freq); p.textContent = state.freq ? L('Regelmäßig · ','Regular · ')+freqLabel(state.freq) : '';
  }
  function timeStr(ts){ return new Date(ts).toLocaleTimeString(LANG==='en'?'en-GB':'de-DE',{hour:'2-digit',minute:'2-digit'}); }
  function renderSent(){
    const d=state.sent;
    if(!d){ $('myList').innerHTML=''; $('sentTime').textContent=L('Heute','Today'); return; }
    $('myList').innerHTML = (d.freq ? L('Regelmäßig · ','Regular · ')+freqLabel(d.freq)+'<br>' : '')
      + d.items.map(x=>`<b>${esc(iName(x.it))}</b> ${esc(amountText(x.it,x.v))}`).join(' · ')
      + (d.note ? '<br>'+L('Hinweis','Note')+': „'+esc(d.note)+'“' : '') + (d.subst ? '' : '<br>'+L('Kein Ersatz gewünscht','No substitutes wanted')) + (window.GWFlowSentText ? GWFlowSentText(d) : '');
    $('sentTime').textContent = L('Heute, ','Today, ')+timeStr(d.ts);
  }
  function renderReqs(){
    const SEND='<svg viewBox="0 0 24 24"><path d="M21 3L3 10.5l7 2.5 2.5 7L21 3z"/><path d="M10 13l11-10"/></svg>';
    $('reqNew').innerHTML = state.reqs.map(r=>`<div class="rq"><span class="rq-i new">${SEND}</span><span class="rq-t"><b>${esc(r.items.map(x=>iName(x.it)).join(', '))}</b><small>${L('Heute, ','Today, ')+timeStr(r.ts)}</small></span><span class="rq-st sent">${L('Gesendet','Sent')}</span></div>`).join('');
  }
  function applyLang(l){
    stopListening(); closeSheet();
    LANG = l;
    try{ localStorage.setItem('gw-lang', l); }catch(e){}
    document.documentElement.lang = l;
    document.title = L('Goodwill – Hilfe von nebenan','Goodwill – Help from next door');
    translateDOM();
    $('langLbl').textContent = l==='en' ? 'English' : 'Deutsch';
    $('fontLbl').textContent = FONTS[state.fontIdx][l==='en'?1:0];
    renderRec(); renderFreqPill(); renderAll(); if(window.renderHomeCats) renderHomeCats(); renderReqs(); renderSent(); renderOrders(); if(window.GWHon) GWHon.render(); if(window.GWFlow) GWFlow.render();
    $('vstatus').textContent=''; $('toast').classList.add('hidden');
  }

  /* ---------- Navigation ---------- */
  const SCREENS = {home:'s-home', req:'s-req', orders:'s-orders', me:'s-me', view:'s-view', create:'s-create', sent:'s-sent', helpers:'s-helpers', review:'s-review', policies:'s-policies'};
  const TABSCR = ['home','req','orders','view','me'];
  function show(name, push=true){
    Object.entries(SCREENS).forEach(([k,id]) => $(id).classList.toggle('hidden', k!==name));
    if(push && state.nav[state.nav.length-1]!==name) state.nav.push(name);
    $('tabs').classList.toggle('hidden', !TABSCR.includes(name));
    document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('on', b.dataset.tab===name));
    document.body.classList.toggle('lock', name==='home'); document.documentElement.classList.toggle('lock', name==='home');
    window.scrollTo(0,0);
  }
  function goBack(){
    stopListening(); closeSheet();
    state.nav.pop();
    show(state.nav[state.nav.length-1] || 'home', false);
  }
  function toast(msg){
    const t=$('toast'); t.textContent=msg; t.classList.remove('hidden');
    clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.add('hidden'),2600);
  }
  const soon = ()=>toast(L('In diesem Test noch nicht verfügbar','Not available in this test yet'));

  /* ---------- Spracheingabe ---------- */
  function setMicUI(on){
    $('micBtn').classList.toggle('listening', on && !state.current);
    $('sMic').classList.toggle('listening', on && !!state.current);
  }
  function stopListening(){
    listenSeq++;
    if(rec){ try{ rec.onend=null; rec.abort(); }catch(e){} rec=null; }
    listening=false; setMicUI(false);
  }
  function listen(onInterim, onEnd){
    stopListening();
    const my = listenSeq;
    rec = new SR();
    rec.lang = LANG==='en' ? 'en-US' : 'de-DE'; rec.interimResults=true; rec.continuous=false; rec.maxAlternatives=1;
    let fin='', last='', err=null;
    rec.onresult = e=>{
      let interim='';
      for(let i=e.resultIndex;i<e.results.length;i++){ const r=e.results[i]; if(r.isFinal) fin+=r[0].transcript+' '; else interim+=r[0].transcript; }
      last=(fin+interim).trim(); onInterim && onInterim(last);
    };
    rec.onerror = e=>{ err=e.error; };
    rec.onend = ()=>{ if(my!==listenSeq) return; listening=false; setMicUI(false); rec=null; onEnd((fin.trim()||last), err); };
    try{ rec.start(); listening=true; setMicUI(true); return true; }catch(e){ listening=false; setMicUI(false); return false; }
  }
  function noSpeechMsg(err){
    if(err==='not-allowed'||err==='service-not-allowed') return L('Bitte erlauben Sie den Zugriff auf das Mikrofon (Symbol in der Adressleiste).','Please allow access to the microphone (icon in the address bar).');
    if(err==='network') return L('Für die Spracherkennung wird eine Internetverbindung gebraucht.','Speech recognition needs an internet connection.');
    return L('Ich habe nichts gehört. Tippen Sie bitte noch einmal auf das Mikrofon.','I didn’t hear anything. Please tap the microphone again.');
  }

  /* ---------- Mengen ---------- */
  function numText(it, v){ return fmtNum(it.fac ? v/it.fac : v); }
  function amountText(it, v){ return v==null ? '' : fmtQty(it, v); }
  function setVal(id, v){
    if(v==null || v<=0){ delete state.cart[id]; state.order = state.order.filter(x=>x!==id); }
    else { if(!(id in state.cart)) state.order.push(id); state.cart[id]=v; }
  }
  function inc(id){
    const it=getItem(id), cur=state.cart[id];
    setVal(id, (cur==null||cur<=0) ? it.start : Math.min(it.max, Math.round((cur+it.step)*1000)/1000));
  }
  function dec(id){
    const it=getItem(id), cur=state.cart[id]; if(cur==null) { setVal(id,null); return; }
    const nv = Math.round((cur-it.step)*1000)/1000;
    setVal(id, nv < it.step/2 ? null : nv);
  }

  /* ---------- Kategorien & Liste ---------- */
  const catLabel = c => LANG==='en' ? CATS_EN[c.id] : c.label;
  const GROUPS = [
    {cat:'food', t:['Lebensmittel & Küche','Groceries & Kitchen'], subs:[
      {id:'obst',n:['Obst & Gemüse','Fruit & veg'],it:['aepfel','bananen','kartoffeln','gemuese']},
      {id:'milch',n:['Milch & Eier','Dairy & eggs'],it:['milch','eier','joghurt','butter']},
      {id:'brot',n:['Brot & Brötchen','Bread & rolls'],it:['brot','broetchen']},
      {id:'wurst',n:['Wurst & Käse','Cold cuts & cheese'],it:['wurst','kaese']},
      {id:'vorrat',n:['Nudeln, Reis & Zucker','Pasta, rice & sugar'],it:['nudeln','reis','zucker']},
      {id:'getr',n:['Getränke','Drinks'],it:['kaffee','tee','saft','wasser']}]},
    {cat:'med', t:['Medikamente & Gesundheit','Medicine & health'], subs:[
      {id:'schmerz',n:['Schmerzmittel','Painkillers'],it:['schmerz']},
      {id:'erkaeltung',n:['Erkältung','Cold & cough'],it:['hustensaft','halsbonbons']},
      {id:'vitpf',n:['Vitamine & Pflaster','Vitamins & plasters'],it:['vitamine','pflaster']}]},
    {cat:'home', t:['Haushalt','Household'], subs:[
      {id:'reinig',n:['Reinigung & Seife','Cleaning & soap'],it:['spuelmittel','waschmittel','seife']},
      {id:'papier',n:['Papier & Müllbeutel','Paper & bags'],it:['klopapier','kuechenrolle','muellbeutel']},
      {id:'licht',n:['Glühbirnen','Light bulbs'],it:['gluehbirne']}]},
    {cat:'other', t:['Sonstiges','Other'], subs:[
      {id:'batt',n:['Batterien','Batteries'],it:['batterien']},
      {id:'post',n:['Post & Zeitung','Post & news'],it:['briefmarken','zeitung']}]}
  ];
  const SUBS = {}; GROUPS.forEach(g=>g.subs.forEach(s=>{SUBS[s.id]=s;}));
  function viewMode(){
    const all = ITEMS.concat(Object.values(state.custom));
    const q = state.query.trim().toLowerCase();
    if(q) return {items: all.filter(i=>iName(i).toLowerCase().includes(q) || (i.id in EN_ITEMS && (LANG==='en'?EN_ITEMS[i.id].syn:i.syn).some(s=>s.includes(q)))), title:L('Suchergebnisse','Search results')};
    if(state.sel){ const items=state.order.filter(id=>id in state.cart).map(getItem); if(items.length) return {items,title:L('Ihre Auswahl','Your selection')}; state.sel=false; }
    if(state.group) return {items: SUBS[state.group].it.map(id=>ITEM_BY_ID[id]), title:SUBS[state.group].n[LANG==='en'?1:0]};
    if(state.cat!=='all') return {items: all.filter(i=>i.cat===state.cat), title: catLabel(CATS.find(c=>c.id===state.cat))};
    if(state.showAll) return {items: all, title:L('Alle Artikel','All items')};
    return null;
  }
  function catsHTML(){
    const idx = LANG==='en'?1:0;
    const ids = state.order.filter(id=>id in state.cart);
    let h = ids.length ? `<button type="button" class="selrow glass" data-sel><span class="se">${emo(ids[0])}</span><span class="st"><b>${L('Ihre Auswahl','Your selection')}</b><small>${ids.length} ${ids.length===1?L('Artikel','item'):L('Artikel','items')}</small></span><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button>` : '';
    h += (window.GWFlow && GWFlow.buyAgainHTML ? GWFlow.buyAgainHTML() : '');
    GROUPS.forEach(g=>{
      h += `<h3 class="cs-title">${g.t[idx]}</h3><div class="ggrid">` + g.subs.map(s=>{
        const e = s.it.slice(0,3).map((id,i)=>`<i class="e${i+1}">${emo(id)}</i>`).join('');
        return `<button type="button" class="gt" data-group="${s.id}"><span class="gimg t-${g.cat} n${Math.min(3,s.it.length)}">${e}</span><span class="gl">${s.n[idx]}</span></button>`;
      }).join('') + `</div>`;
    });
    h += `<h3 class="cs-title">${L('Ganze Kategorien','Whole categories')}</h3><div class="ggrid sp">` + GROUPS.map(g=>`<button type="button" class="stile t-${g.cat}" data-cat="${g.cat}"><b>${({food:L('Essen & Trinken','Food & drink'),med:L('Medizin','Health'),home:L('Haushalt','Home'),other:L('Weiteres','More')})[g.cat]}</b><span class="spe">${CATEMO[g.cat]}</span></button>`).join('') + `</div>`;
    h += `<button type="button" class="allbtn" data-all>${L('Alle Artikel anzeigen','Show all items')}</button>`;
    return h;
  }
  function renderList(){
    const v = viewMode();
    $('catView').classList.toggle('hidden', !!v); $('itemsView').classList.toggle('hidden', !v);
    if(!v){ $('catView').innerHTML = catsHTML(); }
    else {
      $('secTitle').textContent = v.title;
      $('list').innerHTML = v.items.length ? v.items.map(it=>{
        const val = state.cart[it.id], inCart = it.id in state.cart, pending = inCart && val==null, nm=esc(iName(it));
        const act = pending
          ? `<button class="need" type="button" data-need="${it.id}">${L('Menge wählen','Choose amount')}</button>`
          : !inCart
            ? `<button class="addbtn" type="button" data-inc="${it.id}" aria-label="${nm} ${L('hinzufügen','add')}">${PLUS}</button>`
            : `<div class="stepper"><button type="button" data-dec="${it.id}" aria-label="${L('weniger','less')}">${MINUS}</button><div class="n">${numText(it,val)}</div><button type="button" data-inc="${it.id}" aria-label="${L('mehr','more')}">${PLUS}</button></div>`;
        return `<div class="pcard glass${inCart?' sel':''}"><div class="pimg2 t-${it.cat}"><span class="emo">${emo(it.id)}</span><div class="act">${act}</div></div><div class="pname"><b>${nm}</b><span>${esc(iUnit(it))}</span></div></div>`;
      }).join('') : `<p class="none">${L('Keine Treffer. Sie können unten einen eigenen Artikel hinzufügen.','No matches. You can add your own item below.')}</p>`;
    }
    renderSummary();
  }
  function renderSummary(){
    const ids = state.order.filter(id=>id in state.cart);
    const missing = ids.some(id=>state.cart[id]==null);
    $('cartCnt').innerHTML = ids.length ? emo(ids[0]) : '';
    $('cartSub').textContent = !ids.length ? '' : missing ? L('Bitte Menge wählen','Please choose an amount') : ids.length+' '+(ids.length===1?L('Artikel','item'):L('Artikel','items'));
    document.querySelector('#s-create .foot').classList.toggle('empty', !ids.length);
    document.querySelector('#s-create .notes').classList.toggle('hidden', !ids.length);
  }
  function renderAll(){ renderList(); }
  function resetView(){ state.group=null; state.cat='all'; state.sel=false; state.showAll=false; state.query=''; $('q').value=''; }

  /* ---------- Dialog ---------- */
  function openSheet(o){
    $('sStep').textContent = o.step||'';
    $('sTitle').textContent = o.title;
    $('sOpts').innerHTML = o.opts.map(x=>`<button class="opt" type="button" data-v="${esc(x.value)}">${esc(x.label)}</button>`).join('');
    $('sVoice').classList.toggle('hidden', !(o.voice && SR));
    $('sStatus').textContent = L('Tippen Sie auf eine Menge oder sprechen Sie.','Tap an amount or speak.');
    $('sActs').innerHTML = o.actions.map(a=>`<button type="button" data-act="${a.id}">${a.label}</button>`).join('');
    state.sheet = o;
    $('scrim').classList.remove('hidden'); $('sheet').classList.remove('hidden');
  }
  function closeSheet(){ stopListening(); state.current=null; state.sheet=null; $('scrim').classList.add('hidden'); $('sheet').classList.add('hidden'); }

  function openQty(id){
    const it=getItem(id);
    state.current=id; state.retries=0;
    const pos = state.voiceTotal ? state.voiceTotal - state.queue.length + 1 : 0;
    openSheet({
      step: (state.voiceTotal>1 && pos>0) ? L(`Frage ${Math.min(pos,state.voiceTotal)} von ${state.voiceTotal}`,`Question ${Math.min(pos,state.voiceTotal)} of ${state.voiceTotal}`) : '',
      title: iQ(it) || L(`Wie viel möchten Sie von „${it.name}“?`,`How much “${it.name}” would you like?`),
      opts: it.opts.map(v=>({value:v,label:fmtQty(it,v)})), voice:true,
      actions:[{id:'remove',label:L('Entfernen','Remove')},{id:'later',label:L('Später','Later')}],
      onPick: v=>setQty(id, parseFloat(v))
    });
    if(state.voiceMode && SR) setTimeout(()=>{ if(state.current===id) listenAnswer(id); }, 450);
  }
  function afterAnswer(){
    closeSheet(); renderAll();
    if(state.queue.length) setTimeout(askNext, 250);
    else if(state.voiceMode) finishVoice();
  }
  function setQty(id,v){ setVal(id,v); state.queue = state.queue.filter(q=>q!==id); afterAnswer(); }
  function removeItem(id){ setVal(id,null); state.queue = state.queue.filter(q=>q!==id); afterAnswer(); }
  function listenAnswer(id){
    if(state.current!==id) return;
    const it=getItem(id);
    $('sStatus').textContent=L('Ich höre zu – sprechen Sie jetzt.','I’m listening – speak now.');
    const ok = listen(t=>{ $('sStatus').textContent='„'+t+'“'; }, (text,err)=>{
      if(state.current!==id) return;
      if(!text){ $('sStatus').textContent = noSpeechMsg(err)+L(' Oder tippen Sie auf eine Menge.',' Or tap an amount.'); return; }
      const a = parseAnswer(text,it);
      if(a && a.remove){ removeItem(id); return; }
      if(a && a.v!=null){ setQty(id,a.v); return; }
      state.retries++;
      $('sStatus').textContent = L(`Das habe ich nicht verstanden. Sagen Sie zum Beispiel „${fmtQty(it,it.opts[0],true)}“ oder tippen Sie.`,`I didn’t understand that. Say for example “${fmtQty(it,it.opts[0],true)}” or tap.`);
      if(state.retries<2) setTimeout(()=>{ if(state.current===id) listenAnswer(id); }, 1800);
    });
    if(!ok) $('sStatus').textContent=L('Bitte tippen Sie auf eine Menge.','Please tap an amount.');
  }
  function askNext(){ if(!state.queue.length){ if(state.voiceMode) finishVoice(); return; } openQty(state.queue[0]); }
  function finishVoice(){
    state.voiceMode=false; state.voiceTotal=0;
    $('vstatus').textContent=L('Noch etwas? Tippen Sie auf das Mikrofon – oder gehen Sie auf „Weiter“.','Anything else? Tap the microphone – or press “Next”.');
  }

  /* ---------- Bestellsatz (Sprache / Text) ---------- */
  function handleOrderText(text){
    const found = parseOrder(text);
    if(!found.length){
      $('vstatus').textContent=L('Das habe ich leider nicht verstanden. Bitte versuchen Sie es noch einmal oder wählen Sie unten einen Artikel.','Sorry, I didn’t understand that. Please try again or choose an item below.');
      return;
    }
    found.forEach(f=>{
      const had = f.item.id in state.cart;
      if(!had) { state.cart[f.item.id]=null; state.order.push(f.item.id); }
      if(f.qty!=null) state.cart[f.item.id]=f.qty;
      if(state.cart[f.item.id]==null && !state.queue.includes(f.item.id)) state.queue.push(f.item.id);
    });
    resetView(); state.sel=true;
    renderAll(); window.scrollTo({top:0,behavior:'smooth'});
    const names = found.map(f=>iName(f.item)), last = names.length>1 ? names.pop() : null;
    $('vstatus').textContent = '„'+text+'“ – '+L('notiert: ','noted: ')+(last ? names.join(', ')+L(' und ',' and ')+last : names[0])+'.';
    state.voiceMode=true; state.voiceTotal=state.queue.length;
    if(state.queue.length) setTimeout(askNext, 900); else finishVoice();
  }

  /* ---------- Ereignisse ---------- */
  function startRequest(freq, sel){
    state.freq = freq||null; resetView(); state.sel=!!sel;
    renderFreqPill();
    show('create'); renderAll();
  }
  $('tileOnce').onclick = ()=>startRequest(null);
  /* Startseite im Liefer-App-Aufbau: Adresse, Suche, Kategorien */
  $('homeSearch').onclick = ()=>{ startRequest(null); $('q').focus(); };
  $('homeVoice').onclick = ()=>{ startRequest(null); $('micBtn').click(); };
  $('homePromo').onclick = ()=>document.querySelector('.tab[data-tab="view"]').click();
  window.renderHomeCats = ()=>{ $('homeCats').innerHTML = [['food',L('Essen & Trinken','Food & drink')],['med',L('Medizin','Health')],['home',L('Haushalt','Home')],['other',L('Weiteres','More')]]
    .map(([c,t])=>`<button type="button" data-hcat="${c}"><span class="hc-i t-${c}">${CATEMO[c]}</span>${t}</button>`).join(''); };
  renderHomeCats();
  $('homeCats').onclick = e=>{ const b=e.target.closest('[data-hcat]'); if(!b) return; startRequest(null); state.cat=b.dataset.hcat; renderAll(); };
  $('tileRegular').onclick = ()=>{
    openSheet({title:L('Wie oft brauchen Sie Hilfe?','How often do you need help?'), opts:Object.keys(FREQ).map(k=>({value:k,label:cap(freqLabel(k))})),
      voice:false, actions:[{id:'cancel',label:L('Abbrechen','Cancel')}], onPick:v=>{ closeSheet(); startRequest(v); }});
  };
  $('fontBtn').onclick=()=>openSheet({title:L('Schriftgröße wählen','Choose text size'),opts:FONTS.map((f,i)=>({value:i,label:f[LANG==='en'?1:0]})),voice:false,actions:[{id:'cancel',label:L('Schließen','Close')}],
    onPick:v=>{ state.fontIdx=+v; document.documentElement.style.fontSize=FONTS[state.fontIdx][2]+'px'; $('fontLbl').textContent=FONTS[state.fontIdx][LANG==='en'?1:0]; closeSheet(); }});
  const openLang = ()=>openSheet({title:L('Sprache wählen','Choose language'),opts:[{value:'de',label:'Deutsch'},{value:'en',label:'English'}],voice:false,actions:[{id:'cancel',label:L('Schließen','Close')}],
    onPick:v=>{ closeSheet(); if(v!==LANG){ applyLang(v); toast(v==='en'?'Language changed to English':'Sprache auf Deutsch umgestellt'); } }});
  $('langBtn').onclick=openLang;
  document.querySelectorAll('[data-lang]').forEach(b=>b.onclick=openLang);
  $('stepHelper').onclick = ()=>show('helpers');
  $('tabs').onclick = e=>{ const t=e.target.closest('.tab'); if(!t) return; stopListening(); state.nav=[t.dataset.tab]; show(t.dataset.tab,false); };
  document.querySelectorAll('[data-soon]').forEach(b=>b.onclick=soon);
  document.querySelectorAll('[data-tabgo]').forEach(b=>b.onclick=()=>{ state.nav=[b.dataset.tabgo]; show(b.dataset.tabgo,false); });
  document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>show(b.dataset.go));
  document.querySelectorAll('[data-ph]').forEach(e=>e.style.backgroundImage=`url(${GW[e.dataset.ph]})`);
  document.querySelectorAll('img.oa').forEach(i=>i.src=GW[i.dataset.av]);
  document.querySelectorAll('#reqSeg button').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('#reqSeg button').forEach(x=>x.classList.toggle('on',x===b));
    document.querySelectorAll('#s-req [data-grp]').forEach(g=>g.classList.toggle('hidden', b.dataset.f!=='all' && g.dataset.grp!==b.dataset.f));
  });
  $('recPause').onclick=()=>{ state.recPaused=!state.recPaused; renderRec(); toast(state.recPaused?L('Regelmäßige Hilfe pausiert','Regular help paused'):L('Regelmäßige Hilfe fortgesetzt','Regular help resumed')); };
  function reorder(list){
    state.cart={}; state.order=[]; state.queue=[];
    list.split(',').forEach(id=>{ if(ITEM_BY_ID[id]) setVal(id, ITEM_BY_ID[id].start); });
    state.nav=['home']; startRequest(null,true); toast(L('Artikel übernommen – bitte prüfen','Items added – please check'));
  }
  document.querySelectorAll('[data-reorder]').forEach(b=>b.onclick=()=>reorder(b.dataset.reorder));
  /* Bestellverlauf: Suche */
  const ORDERS = [
    {who:'Daniel', t:['Zugestellt in 15 Minuten','Arrived in 15 minutes'], de:'Sa., 18. Okt., 15:43', en:'Sat, 18 Oct, 3:43 pm', items:['milch','brot','aepfel']},
    {who:'Sophia', de:'Mo., 13. Okt., 10:12', en:'Mon, 13 Oct, 10:12 am', items:['butter','kaffee']},
    {who:'Thomas', de:'Di., 7. Okt., 09:30', en:'Tue, 7 Oct, 9:30 am', items:['schmerz','pflaster']},
    {who:'Daniel', de:'Fr., 3. Okt., 17:05', en:'Fri, 3 Oct, 5:05 pm', items:['eier','kartoffeln','gemuese']},
    {who:'Sophia', de:'Fr., 26. Sep., 11:20', en:'Fri, 26 Sep, 11:20 am', items:['milch','brot','aepfel','eier','butter','kaffee','joghurt']}
  ];
  const CHECK='<svg viewBox="0 0 24 24"><path d="M4.5 12.8l5 5L19.5 7"/></svg>', DOTS='<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>';
  function renderOrders(){
    const q = ($('oq').value||'').trim().toLowerCase(); let n=0;
    $('ohist').innerHTML = ORDERS.map(o=>{
      const names=o.items.map(id=>iName(ITEM_BY_ID[id]));
      const date=LANG==='en'?o.en:o.de;
      if(q && !(o.who+' '+names.join(' ')+' '+date).toLowerCase().includes(q)) return '';
      n++;
      const many=o.items.length>5, show=many?o.items.slice(0,4):o.items;
      const th=show.map(id=>`<span class="th" title="${esc(iName(ITEM_BY_ID[id]))}">${emo(id)}</span>`).join('')+(many?`<span class="th more">+${o.items.length-4}</span>`:'');
      return `<article class="oh"><div class="oh-top"><span class="okbox">${CHECK}</span><div class="oh-t"><b>${o.t?o.t[LANG==='en'?1:0]:L('Bestellung zugestellt','Order arrived')}</b><span>${L('Von ','By ')+o.who} • ${date}</span></div><button class="kebab" type="button" data-soon2 aria-label="${L('Mehr','More')}">${DOTS}</button></div><div class="oh-th">${th}</div><div class="oh-ft"><button type="button" data-re="${o.items.join(',')}">${L('Nochmal bestellen','Reorder')}</button><button type="button" data-soon2>${L('Bewerten','Rate order')}</button></div></article>`;
    }).join('');
    $('oNone').classList.toggle('hidden', n>0);
  }
  $('oq').oninput = renderOrders;
  $('ohist').onclick = e=>{ const r=e.target.closest('[data-re]'); if(r){ reorder(r.dataset.re); return; } if(e.target.closest('[data-soon2]')) soon(); };  $('backOrders').onclick = ()=>{ state.nav=['home']; show('home',false); };
  $('newReq').onclick = ()=>startRequest(null);
  document.querySelectorAll('.hrow').forEach(b=>b.onclick=soon);
  $('backCreate').onclick = goBack; $('backSent').onclick = goBack; $('backHelpers').onclick = goBack;

  $('catView').onclick = e=>{
    const g=e.target.closest('[data-group]'), c=e.target.closest('[data-cat]'), s=e.target.closest('[data-sel]'), all=e.target.closest('[data-all]');
    if(g) state.group=g.dataset.group; else if(c) state.cat=c.dataset.cat; else if(s) state.sel=true; else if(all) state.showAll=true; else return;
    renderList(); window.scrollTo(0,0);
  };
  $('catBack').onclick = ()=>{ resetView(); renderList(); window.scrollTo(0,0); };
  $('q').oninput = e=>{ state.query=e.target.value; renderList(); };
  $('list').onclick = e=>{
    const inc_=e.target.closest('[data-inc]'), dec_=e.target.closest('[data-dec]'), need=e.target.closest('[data-need]');
    if(inc_){ inc(inc_.dataset.inc); renderList(); }
    else if(dec_){ dec(dec_.dataset.dec); renderList(); }
    else if(need){ state.voiceMode=false; state.voiceTotal=0; openQty(need.dataset.need); }
  };
  $('addBtn').onclick = ()=>{ $('addForm').classList.toggle('hidden'); if(!$('addForm').classList.contains('hidden')){ $('addInput').value=state.query; $('addInput').focus(); } };
  $('addForm').onsubmit = e=>{
    e.preventDefault();
    const name=$('addInput').value.trim(); if(!name) return;
    const id='custom-'+Date.now();
    state.custom[id]={id,name:name.charAt(0).toUpperCase()+name.slice(1),cat:'other',custom:true,kind:'count',noun:['Stück','Stück'],unit:'Stück',step:1,start:1,max:99,opts:[1,2,3],q:`Wie viele „${name}“ möchten Sie?`};
    setVal(id,1);
    $('addInput').value=''; $('addForm').classList.add('hidden'); resetView(); state.cat='other';
    renderAll();
  };

  $('micBtn').onclick = ()=>{
    if(!SR){
      $('vstatus').textContent=L('Spracheingabe funktioniert in diesem Browser leider nicht (am besten Chrome oder Safari). Bitte suchen Sie die Artikel oder tippen Sie sie ein.','Voice input doesn’t work in this browser (Chrome or Safari work best). Please search for the items or type them in.');
      $('q').focus(); return;
    }
    if(listening){ stopListening(); return; }
    $('vstatus').textContent=L('Ich höre zu – sagen Sie, was Sie brauchen …','I’m listening – say what you need …');
    const ok = listen(t=>{ $('vstatus').textContent='„'+t+'“'; }, (text,err)=>{
      if(!text){ $('vstatus').textContent=noSpeechMsg(err); return; }
      handleOrderText(text);
    });
    if(!ok) $('vstatus').textContent=L('Das Mikrofon konnte nicht gestartet werden.','The microphone could not be started.');
  };
  $('q').addEventListener('keydown', e=>{
    if(e.key==='Enter'){ const v=e.target.value.trim(); if(v && parseOrder(v).length){ e.preventDefault(); handleOrderText(v); } }
  });

  $('sOpts').onclick = e=>{ const b=e.target.closest('.opt'); if(b && state.sheet) state.sheet.onPick(b.dataset.v); };
  $('sMic').onclick = ()=>{ if(!SR||!state.current) return; if(listening){ stopListening(); return; } state.retries=0; listenAnswer(state.current); };
  $('sActs').onclick = e=>{
    const b=e.target.closest('button'); if(!b) return;
    if(b.dataset.act==='remove' && state.current) removeItem(state.current);
    else if(b.dataset.act==='later'){ const id=state.current; state.queue=state.queue.filter(q=>q!==id); state.voiceMode=false; state.voiceTotal=0; closeSheet(); renderAll(); }
    else closeSheet();
  };
  $('scrim').onclick = ()=>{ if(state.current){ const id=state.current; state.queue=state.queue.filter(q=>q!==id); state.voiceMode=false; state.voiceTotal=0; } closeSheet(); renderAll(); };

  $('nextBtn').onclick = ()=>{
    stopListening();
    const ids = state.order.filter(id=>id in state.cart);
    const miss = ids.find(id=>state.cart[id]==null); if(miss){ state.voiceMode=false; state.voiceTotal=0; openQty(miss); return; }
    if(window.GWFlow){ GWFlow.review(); return; }
    commitOrder();
  };
  function commitOrder(x){
    const ids = state.order.filter(id=>id in state.cart && state.cart[id]!=null);
    const items = ids.map(id=>({it:getItem(id), v:state.cart[id]}));
    const ts = Date.now();
    if(x && x.merge && state.sent){
      items.forEach(n=>{ const e=state.sent.items.find(o=>o.it.id===n.it.id); if(e) e.v=Math.round(((e.v||0)+n.v)*1000)/1000; else state.sent.items.push(n); });
      if(state.reqs[0]) state.reqs[0].items = state.sent.items;
    } else {
      state.sent = Object.assign({items, freq:state.freq, note:$('note').value.trim(), subst:$('subst').checked, ts}, x||{});
      state.reqs.unshift({items, ts});
    }
    renderSent(); renderReqs();
    show('sent');
  }
  $('homeBtn').onclick = ()=>{
    stopListening(); closeSheet();
    state.cart={}; state.order=[]; state.queue=[]; state.custom={}; state.freq=null; resetView(); state.voiceMode=false; state.voiceTotal=0;
    $('q').value=''; $('note').value=''; $('subst').checked=true; $('vstatus').textContent=''; $('addForm').classList.add('hidden'); renderFreqPill();
    if(window.GWFlow) GWFlow.reset();
    state.nav=['home']; show('home',false);
  };

  /* Start: gespeicherte Sprache laden (Standard: Deutsch) */
  let saved='de'; try{ saved = localStorage.getItem('gw-lang')==='en' ? 'en' : 'de'; }catch(e){}
  applyLang(saved);
  window.GWApp = {ORDERS, renderAll, applyLang, show, state, toast, goBack, getItem, amountText, numText, emo, setVal, inc, dec, startRequest, resetView, renderReqs, renderSent, commitOrder};
})();
