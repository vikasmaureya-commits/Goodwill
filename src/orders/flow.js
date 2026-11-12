/* ============ BESTELL-ABLAUF, VERTRAUENSPERSON, GEBIET, CHAT, RICHTLINIEN ============ */
(function(){
  const $ = id => document.getElementById(id);
  const esc = GWSec.esc;
  const en = () => LANG === 'en';
  const A = window.GWApp;
  const KEY = 'gw-flow-v1';

  /* ---------- Gespeicherter Zustand ---------- */
  let FL = {area:'altstadt', care:null, draft:null};
  try{ const x = JSON.parse(localStorage.getItem(KEY)); if(x && typeof x==='object') FL = Object.assign(FL, x); }catch(e){}
  const save = () => { try{ localStorage.setItem(KEY, JSON.stringify(FL)); }catch(e){} };
  /* Sitzungszustand (nicht gespeichert) */
  const RT = {sel:{mode:'asap', day:0, slot:null}, adding:false, onBehalf:false, approval:null, chat:null, chatUnread:true, sentKind:'sent'};
  const resetSel = () => { RT.sel = {mode:'asap', day:0, slot:null}; };

  /* ---------- Icons ---------- */
  const I = {
    clock:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
    pin:'<svg viewBox="0 0 24 24"><path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    bag:'<svg viewBox="0 0 24 24"><path d="M5.2 8.5h13.6l-1.1 10.6a1.6 1.6 0 0 1-1.6 1.4H7.9a1.6 1.6 0 0 1-1.6-1.4L5.2 8.5z"/><path d="M8.8 8.5V7a3.2 3.2 0 0 1 6.4 0v1.5"/></svg>',
    check:'<svg viewBox="0 0 24 24"><path d="M4.5 12.8l5 5L19.5 7"/></svg>',
    info:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8v.2"/></svg>',
    people:'<svg viewBox="0 0 24 24"><circle cx="9" cy="8.5" r="3"/><path d="M3 19c.4-3.2 2.6-5 6-5s5.6 1.8 6 5"/><path d="M16 6.5a3 3 0 0 1 0 5.5M18 14c1.7.5 2.7 2 3 5"/></svg>',
    plus:'<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    arrow:'<svg viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>',
    send:'<svg viewBox="0 0 24 24"><path d="M21 3L3 10.5l7 2.5 2.5 7L21 3z"/><path d="M10 13l11-10"/></svg>',
    chat:'<svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4V5z"/></svg>',
    edit:'<svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16v4z"/></svg>',
    doc:'<svg viewBox="0 0 24 24"><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/></svg>',
    chev:'<svg class="r" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>'
  };

  /* ---------- Gebiete (Magdeburg) ---------- */
  const AREAS = [
    {id:'altstadt',   n:'Altstadt',       h:7},
    {id:'stadtfeld-o',n:'Stadtfeld Ost',  h:5},
    {id:'stadtfeld-w',n:'Stadtfeld West', h:3},
    {id:'sudenburg',  n:'Sudenburg',      h:4},
    {id:'buckau',     n:'Buckau',         h:2},
    {id:'neustadt',   n:'Neue Neustadt',  h:4},
    {id:'cracau',     n:'Cracau',         h:1},
    {id:'reform',     n:'Reform',         h:0}
  ];
  const area = () => AREAS.find(a=>a.id===FL.area) || AREAS[0];
  const helpersTxt = n => n===0 ? L('Noch keine Helfer','No helpers yet') : n+' '+(n===1?L('Helfer','helper'):L('Helfer','helpers'))+L(' verfügbar',' available');

  /* ---------- Zeitfenster ---------- */
  const SLOTS = [
    {id:'am',   de:'Vormittag',  en:'Morning',   a:9,  b:12},
    {id:'noon', de:'Mittag',     en:'Midday',    a:12, b:14},
    {id:'pm',   de:'Nachmittag', en:'Afternoon', a:14, b:17},
    {id:'eve',  de:'Abend',      en:'Evening',   a:17, b:19}
  ];
  const slotLbl = s => en()?s.en:s.de;
  const slotTime = s => en() ? s.a+':00–'+s.b+':00' : s.a+'–'+s.b+' Uhr';
  const dayDate = i => { const d=new Date(); d.setHours(12,0,0,0); d.setDate(d.getDate()+i); return d; };
  const dayLabel = i => i===0 ? L('Heute','Today') : i===1 ? L('Morgen','Tomorrow') : dayDate(i).toLocaleDateString(en()?'en-GB':'de-DE',{weekday:'short'});
  const dayFull = i => dayDate(i).toLocaleDateString(en()?'en-GB':'de-DE',{day:'numeric',month:'short'});
  function slotText(sel){
    if(!sel || sel.mode==='asap') return L('Sobald ein Helfer zusagt','As soon as a helper accepts');
    const s = SLOTS.find(x=>x.id===sel.slot);
    return dayLabel(sel.day)+', '+dayFull(sel.day) + (s ? ' · '+slotLbl(s)+' '+slotTime(s) : '');
  }

  /* ---------- Hilfsfunktionen für Warenkorb ---------- */
  const cartIds = () => A.state.order.filter(id=>id in A.state.cart && A.state.cart[id]!=null);
  const cartNames = () => cartIds().map(id=>iName(A.getItem(id))).join(', ');
  const isRegular = () => !!A.state.freq;

  /* ---------- Bottom-Sheet für diesen Ablauf ---------- */
  const fs = () => $('fsheet');
  function fopen(html){
    RT.sheet=null; $('fscrim').classList.remove('hidden'); fs().className='sheet fsx flowx'; fs().innerHTML=html; fs().scrollTop=0; fs().focus({preventScroll:true});
  }
  function fclose(){ $('fscrim').classList.add('hidden'); fs().classList.add('hidden'); RT.sheet=null; }
  const grab = '<div class="grab"></div>';

  /* ============ 1 · BESTELLUNG PRÜFEN (Schritt 1 von 2) ============ */
  function review(){
    if(!cartIds().length) return;
    if(isRegular() && RT.sel.mode==='asap') RT.sel.mode='plan';
    A.show('review'); renderReview();
  }
  function planOk(){ return RT.adding || RT.sel.mode==='asap' || !!RT.sel.slot; }

  function renderReview(){
    const st = A.state, ids = cartIds(), reg = isRegular(), care = FL.care;
    $('rvTitle').textContent = RT.adding ? L('Ergänzung prüfen','Check your addition') : L('Bestellung prüfen','Check your order');
    let h = '';
    if(RT.onBehalf) h += `<div class="rvnote">${I.people}<span>${L('Sie bestellen für Margarete Weber.','You are ordering for Margarete Weber.')}</span></div>`;
    if(RT.adding) h += `<div class="rvnote">${I.info}<span>${L('Diese Artikel kommen zu Ihrer laufenden Anfrage dazu. Zeit und Adresse bleiben gleich.','These items are added to your current request. Time and address stay the same.')}</span></div>`;

    /* Lieferzeit */
    if(!RT.adding){
      h += `<section class="rvcard glass"><h3>${L('Wann soll geliefert werden?','When should it be delivered?')}</h3>`;
      if(!reg) h += `<button class="rvopt ${RT.sel.mode==='asap'?'on':''}" type="button" data-a="mode" data-v="asap"><span class="rd"></span><span><b>${L('So bald wie möglich','As soon as possible')}</b><small>${L('Sobald ein Helfer in Ihrer Nähe zusagt','As soon as a helper near you accepts')}</small></span></button>`;
      h += `<button class="rvopt ${RT.sel.mode==='plan'?'on':''}" type="button" data-a="mode" data-v="plan"><span class="rd"></span><span><b>${reg?L('Erste Lieferung planen','Plan the first delivery'):L('Termin wählen','Pick a time')}</b><small>${reg?L('Danach ','Then ')+freqTxt():L('Tag und Uhrzeit selbst festlegen','Choose day and time yourself')}</small></span></button>`;
      if(RT.sel.mode==='plan'){
        h += '<div class="daychips" role="group" aria-label="'+L('Tag','Day')+'">' + [0,1,2,3,4,5,6].map(i=>`<button type="button" class="${RT.sel.day===i?'on':''}" data-a="day" data-v="${i}">${dayLabel(i)}<small>${dayFull(i)}</small></button>`).join('') + '</div>';
        const hr = new Date().getHours();
        h += '<div class="slotgrid">' + SLOTS.map(s=>{
          const dis = RT.sel.day===0 && s.b <= hr+1;
          return `<button type="button" class="${RT.sel.slot===s.id?'on':''}" data-a="slot" data-v="${s.id}" ${dis?'disabled':''}>${slotLbl(s)}<small>${slotTime(s)}</small></button>`;
        }).join('') + '</div>';
      }
      h += '</section>';
    }

    /* Adresse / Gebiet */
    const ar = area();
    h += `<section class="rvcard glass"><div class="rvrow"><span class="ci" style="width:44px;height:44px;border-radius:14px;background:rgba(110,170,140,.16);display:flex;align-items:center;justify-content:center"><span style="width:24px;height:24px;display:block">${I.pin.replace('<svg','<svg style="stroke:#2F6B55;fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round"')}</span></span>
      <span class="tx"><b>${L('Hilfe kommt zu','Help is coming to')}</b><small>Otto-von-Guericke-Straße · ${esc(ar.n)}</small><small>${helpersTxt(ar.h)}</small></span>
      <button class="lnkbtn" type="button" data-a="area">${L('Ändern','Change')}</button></div></section>`;

    /* Artikel */
    h += `<section class="rvcard glass"><h3>${L('Ihre Artikel','Your items')} (${ids.length})</h3>` + ids.map(id=>{
      const it = A.getItem(id);
      return `<div class="rvitem"><span class="em">${A.emo(id)}</span><span class="tx"><b>${esc(iName(it))}</b><small>${esc(A.amountText(it, st.cart[id]))}</small></span>
        <span class="rvstep"><button type="button" data-a="dec" data-id="${esc(id)}" aria-label="${L('weniger','less')}">−</button><span>${esc(A.numText(it, st.cart[id]))}</span><button type="button" data-a="inc" data-id="${esc(id)}" aria-label="${L('mehr','more')}">+</button></span></div>`;
    }).join('') + `<button class="rvadd" type="button" data-a="more">${I.plus}${L('Noch etwas hinzufügen','Add more items')}</button>`;
    const note = ($('note').value||'').trim();
    if(note) h += `<p class="sub" style="margin-top:12px">${L('Hinweis','Note')}: „${esc(note)}“</p>`;
    h += `<p class="sub" style="margin-top:${note?4:12}px">${$('subst').checked ? L('Ersatz erlaubt, wenn ein Artikel fehlt','Substitutes allowed if an item is unavailable') : L('Kein Ersatz gewünscht','No substitutes wanted')}</p></section>`;

    /* Vertrauensperson */
    if(care && care.approval && !RT.onBehalf)
      h += `<div class="rvnote warn">${I.people}<span>${L(esc(care.name)+' bekommt Ihre Bestellung zuerst zur Freigabe.', esc(care.name)+' will approve your order first.')}</span></div>`;

    /* Rechnung */
    h += `<section class="rvcard glass"><div class="rvbill"><span>${L('Artikel','Items')}</span><span>${ids.length}</span></div>
      <div class="rvbill"><span>${L('Service von Goodwill','Goodwill service')}</span><b>${L('Kostenlos','Free')}</b></div>
      <p class="sub" style="margin-top:6px">${L('Der Service von Goodwill ist kostenlos – Sie zahlen keine Gebühr.','Goodwill’s service is free – you pay no fee.')}</p></section>
      <p class="sub" style="text-align:center;margin:4px 0 0">${L('Es gelten unsere ','Our ')}<button class="lnkbtn" type="button" data-a="policies" style="padding:0">${L('Richtlinien','policies apply')}</button></p>`;

    $('rvBody').innerHTML = h;
    const ok = planOk();
    $('rvNext').disabled = !ok;
    $('rvNext').innerHTML = `<span class="lbl"><b>${ok ? L('Weiter zur Bestätigung','Continue to confirm') : L('Bitte Zeit wählen','Please pick a time')}</b><small>${L('Schritt 1 von 2','Step 1 of 2')}</small></span><span class="arr" style="width:28px;height:28px;display:inline-block">${I.arrow.replace('<svg','<svg style="stroke:#fff;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"')}</span>`;
    $('rvDraft').textContent = L('Später weiter bestellen (Entwurf speichern)','Order later (save as draft)');
    $('rvDraft').classList.toggle('hidden', RT.adding);
  }
  const freqTxt = () => A.state.freq ? ({w1:L('jede Woche','every week'),w2:L('alle 2 Wochen','every 2 weeks'),m1:L('jeden Monat','every month')})[A.state.freq] : '';

  function onReviewClick(e){
    const b = e.target.closest('[data-a]'); if(!b) return;
    const a = b.dataset.a, st = A.state;
    if(a==='mode'){ RT.sel.mode=b.dataset.v; if(RT.sel.mode==='asap') RT.sel.slot=null; }
    else if(a==='day'){ RT.sel.day=+b.dataset.v; RT.sel.slot=null; }
    else if(a==='slot'){ RT.sel.slot=b.dataset.v; }
    else if(a==='area'){ return openArea(true); }
    else if(a==='inc'){ A.inc(b.dataset.id); }
    else if(a==='dec'){ A.dec(b.dataset.id); if(!cartIds().length){ A.goBack(); return; } }
    else if(a==='more'){ A.goBack(); return; }
    else if(a==='policies'){ return openPolicies(); }
    renderReview();
  }

  /* ============ 2 · BESTÄTIGUNG (Schritt 2 von 2) ============ */
  function confirm2(){
    const care = FL.care, needsOk = !!(care && care.approval && !RT.onBehalf && !RT.adding);
    const ids = cartIds();
    fopen(`${grab}<p class="fstep">${L('Schritt 2 von 2','Step 2 of 2')}</p>
      <h3 class="stitle">${RT.adding ? L('Jetzt ergänzen?','Add these now?') : needsOk ? L('Zur Freigabe senden?','Send for approval?') : L('Jetzt verbindlich bestellen?','Place your order now?')}</h3>
      <div>
        <div class="fsum">${I.bag}<span>${ids.length} ${ids.length===1?L('Artikel','item'):L('Artikel','items')}<small>${esc(cartNames())}</small></span></div>
        ${RT.adding ? '' : `<div class="fsum">${I.clock}<span>${esc(slotText(RT.sel))}</span></div>`}
        <div class="fsum">${I.pin}<span>${esc(area().n)}<small>Otto-von-Guericke-Straße</small></span></div>
        ${needsOk ? `<div class="fsum">${I.people}<span>${L(esc(care.name)+' muss zustimmen',esc(care.name)+' has to approve')}</span></div>` : ''}
      </div>
      <p class="sub" style="color:var(--mute);font-size:.9rem;text-align:center">${L('Sie können Ihre Bestellung noch ergänzen, bis der Helfer mit dem Einkauf beginnt.','You can still add to your order until the helper starts shopping.')}</p>
      <button class="hb primary" type="button" data-a="go">${I.check}${needsOk ? L('Ja, zur Freigabe senden','Yes, send for approval') : RT.adding ? L('Ja, ergänzen','Yes, add them') : L('Ja, jetzt bestellen','Yes, order now')}</button>
      <button class="hb ghost" type="button" data-a="more">${I.plus}${L('Noch etwas hinzufügen','Add something else')}</button>
      <button class="hb plain" type="button" data-a="cancel">${L('Zurück','Back')}</button>`);
  }

  function commit(){
    const care = FL.care, needsOk = !!(care && care.approval && !RT.onBehalf && !RT.adding);
    const x = RT.adding ? {merge:true} : {slot:Object.assign({}, RT.sel), area:FL.area, onBehalf:RT.onBehalf};
    A.commitOrder(x);
    RT.sentKind = RT.adding ? 'added' : needsOk ? 'approval' : 'sent';
    RT.approval = needsOk ? 'pending' : null;
    RT.adding = false; RT.onBehalf = false; resetSel();
    renderSentExtras(); renderFlowReq();
  }

  /* Ergänzen: zurück zur Artikelauswahl, Warenkorb leer, Bestellung bleibt */
  function addMore(){
    const st = A.state;
    st.cart={}; st.order=[]; st.queue=[]; st.custom={};
    A.resetView(); st.freq = st.sent ? st.sent.freq : null;
    RT.adding = true;
    A.startRequest(st.freq);
    A.toast(L('Wählen Sie, was dazukommen soll','Choose what should be added'));
  }

  /* ============ Entwurf (später weiter bestellen) ============ */
  function saveDraft(){
    const st = A.state, ids = cartIds();
    FL.draft = {items: ids.map(id=>({id, v:st.cart[id], custom: st.custom[id]||null})), freq: st.freq, note: ($('note').value||'').trim(), subst: $('subst').checked, ts: Date.now()};
    save();
    st.cart={}; st.order=[]; st.queue=[]; st.custom={}; st.freq=null; A.resetView();
    $('note').value=''; $('subst').checked=true; resetSel(); RT.adding=false;
    st.nav=['req']; A.show('req',false);
    renderFlowReq();
    A.toast(L('Entwurf gespeichert – Sie können später weiter bestellen','Draft saved – you can continue ordering later'));
  }
  function resumeDraft(){
    const d = FL.draft; if(!d) return;
    const st = A.state;
    st.cart={}; st.order=[]; st.queue=[]; st.custom={};
    d.items.forEach(x=>{ if(x.custom) st.custom[x.id]=x.custom; A.setVal(x.id, x.v); });
    $('note').value = d.note||''; $('subst').checked = d.subst!==false;
    FL.draft = null; save(); renderFlowReq();
    st.nav=['home']; A.startRequest(d.freq, true);
  }
  function discardDraft(){ FL.draft=null; save(); renderFlowReq(); A.toast(L('Entwurf gelöscht','Draft deleted')); }

  /* ============ Gebiet wählen ============ */
  function openArea(fromReview){
    fopen(`${grab}<h3 class="stitle">${L('Wo sollen wir liefern?','Where should we deliver?')}</h3>
      <p class="hs-sub" style="text-align:center;color:var(--mute);font-size:.95rem;margin-top:-6px">${L('Wählen Sie Ihren Stadtteil in Magdeburg.','Choose your district in Magdeburg.')}</p>
      <div class="arealist">` + AREAS.map(a=>`<button class="arearow ${a.id===FL.area?'on':''}" type="button" data-a="pick" data-id="${a.id}"><span class="tx"><b>${esc(a.n)}</b><small>${helpersTxt(a.h)}</small></span><svg viewBox="0 0 24 24"><path d="M4.5 12.8l5 5L19.5 7"/></svg></button>`).join('') + `</div>
      <p class="sub" style="color:var(--mute);font-size:.84rem">${L('Helfer sehen vorab nur Ihren Stadtteil – Ihre genaue Adresse erst, wenn jemand zusagt.','Helpers only see your district at first – your exact address only once someone accepts.')}</p>
      <button class="hb plain" type="button" data-a="cancel">${L('Schließen','Close')}</button>`);
    RT.sheet = {kind:'area', fromReview};
  }
  function renderAreaUI(){
    const ar = area();
    document.querySelectorAll('#addrLine b,#homeAddr b').forEach(b=>b.textContent = L('Zuhause · ','Home · ')+ar.n);
    const s = document.querySelector('#addrRow small'); if(s) s.textContent = 'Otto-von-Guericke-Straße, '+ar.n;
  }

  /* ============ Vertrauensperson ============ */
  const RELS = [['Tochter','Daughter'],['Sohn','Son'],['Pflegekraft','Carer'],['Nachbar/in','Neighbour'],['Andere','Other']];
  let careDraft = null;
  function openCare(){
    const c = FL.care;
    careDraft = c ? Object.assign({}, c) : {name:'', rel:0, canSee:true, canOrder:true, approval:false};
    renderCareSheet();
  }
  const sw = (on,k) => `<button class="sw ${on?'on':''}" type="button" role="switch" aria-checked="${on}" data-a="tg" data-k="${k}"><i></i></button>`;
  function renderCareSheet(){
    const d = careDraft, exists = !!FL.care;
    fopen(`${grab}<h3 class="stitle">${exists?L('Ihre Vertrauensperson','Your trusted person'):L('Vertrauensperson hinzufügen','Add a trusted person')}</h3>
      <p class="hs-sub" style="text-align:center;color:var(--mute);font-size:.92rem;margin-top:-6px">${L('Eine Person, die Ihnen beim Bestellen helfen darf – nur mit Ihrer Zustimmung.','Someone who may help you order – only with your consent.')}</p>
      <input class="finput" id="careName" type="text" placeholder="${L('Name, z. B. Anna','Name, e.g. Anna')}" value="${esc(d.name)}" autocomplete="off" aria-label="${L('Name','Name')}">
      <div class="relchips" role="group" aria-label="${L('Beziehung','Relationship')}">${RELS.map((r,i)=>`<button type="button" class="${d.rel===i?'on':''}" data-a="rel" data-i="${i}">${en()?r[1]:r[0]}</button>`).join('')}</div>
      <div>
        <div class="tgl"><span class="tx"><b>${L('Darf meine Bestellungen sehen','May see my orders')}</b><small>${L('Damit sie wissen, was unterwegs ist.','So they know what is on its way.')}</small></span>${sw(d.canSee,'canSee')}</div>
        <div class="tgl"><span class="tx"><b>${L('Darf für mich bestellen','May order for me')}</b><small>${L('Zum Beispiel, wenn es mir nicht gut geht.','For example, when I am not feeling well.')}</small></span>${sw(d.canOrder,'canOrder')}</div>
        <div class="tgl"><span class="tx"><b>${L('Muss meine Bestellungen freigeben','Must approve my orders')}</b><small>${L('Ich schicke Bestellungen erst ab, wenn sie zugestimmt hat.','My orders are only sent once they approve.')}</small></span>${sw(d.approval,'approval')}</div>
      </div>
      <p class="sub" style="color:var(--mute);font-size:.84rem">${L('Sie können das jederzeit ändern. In der Testversion wird keine Einladung verschickt.','You can change this at any time. No invitation is sent in this test version.')}</p>
      <button class="hb primary" type="button" data-a="care-save" ${d.name.trim()?'':'disabled'}>${L('Speichern','Save')}</button>
      ${exists ? `<button class="hb ghost" type="button" data-a="care-view">${I.people}${L('Ansicht der Vertrauensperson (Demo)','Trusted person’s view (demo)')}</button><button class="hb danger" type="button" data-a="care-del">${L('Entfernen','Remove')}</button>` : ''}
      <button class="hb plain" type="button" data-a="cancel">${L('Schließen','Close')}</button>`);
    const inp = $('careName'); if(inp) inp.oninput = e=>{ careDraft.name = e.target.value; const sb = fs().querySelector('[data-a=care-save]'); if(sb) sb.disabled = !careDraft.name.trim(); };
  }
  function renderCareUI(){
    const c = FL.care, ban = document.querySelector('#careBanner .bt'), row = document.querySelector('#careRow .tx');
    if(ban) ban.innerHTML = c ? `<b>${esc(c.name)} ${L('ist Ihre Vertrauensperson','is your trusted person')}</b><em>${L('Einstellungen ›','Settings ›')}</em>` : `<b>${L('Vertrauensperson hinzufügen','Add a trusted person')}</b><em>${L('Jetzt einrichten ›','Set up now ›')}</em>`;
    if(row) row.innerHTML = c ? `${L('Vertrauensperson','Trusted person')}<small>${esc(c.name)} · ${en()?RELS[c.rel][1]:RELS[c.rel][0]}${c.approval?' · '+L('gibt frei','approves'):''}</small>` : `${L('Vertrauensperson','Trusted person')}<small>${L('Angehörige(r) kann mitlesen – nur mit Ihrer Zustimmung','A relative can follow along – only with your consent')}</small>`;
  }

  /* Ansicht der Vertrauensperson (Demo): Freigeben, Ablehnen, für jemanden bestellen */
  function openCareView(){
    const c = FL.care; if(!c) return;
    const st = A.state, pend = RT.approval==='pending' && st.sent;
    const recent = (st.reqs||[]).slice(0,2).map(r=>r.items.map(x=>iName(x.it)).join(', '))
      .concat([L('Milch, Brot, Äpfel · Sa., 18. Okt.','Milk, bread, apples · Sat, 18 Oct'), L('Butter, Kaffee · Mo., 13. Okt.','Butter, coffee · Mon, 13 Oct')]).slice(0,3);
    fopen(`${grab}<h3 class="stitle">${esc(c.name)} · ${L('Ansicht','view')}</h3>
      <p class="hs-sub" style="text-align:center;color:var(--mute);font-size:.92rem;margin-top:-6px">${L('So sieht Ihre Vertrauensperson die Bestellungen von Frau Weber.','This is how your trusted person sees Mrs. Weber’s orders.')}</p>
      ${pend ? `<div class="rvcard glass" style="margin:0"><h3>${L('Wartet auf Freigabe','Waiting for approval')}</h3>
          <div class="fsum" style="padding-top:0">${I.bag}<span>${esc(st.sent.items.map(x=>iName(x.it)).join(', '))}<small>${esc(slotText(st.sent.slot))}</small></span></div>
          <div style="display:flex;gap:10px"><button class="hb primary" type="button" data-a="approve" style="min-height:52px">${L('Freigeben','Approve')}</button><button class="hb danger" type="button" data-a="decline" style="min-height:52px">${L('Ablehnen','Decline')}</button></div></div>` : `<p class="hs-note" style="text-align:center">${L('Keine Bestellung wartet auf Freigabe.','No order is waiting for approval.')}</p>`}
      ${c.canSee ? `<div><h4 style="font-size:.78rem;text-transform:uppercase;letter-spacing:.05em;color:var(--mute);margin-bottom:4px">${L('Letzte Bestellungen','Recent orders')}</h4>${recent.map(t=>`<div class="fsum">${I.check}<span>${esc(t)}</span></div>`).join('')}</div>` : `<p class="hs-note" style="text-align:center">${L('Frau Weber hat nicht erlaubt, Bestellungen zu sehen.','Mrs. Weber has not allowed viewing orders.')}</p>`}
      ${c.canOrder ? `<button class="hb primary" type="button" data-a="order-for">${I.plus}${L('Für Frau Weber bestellen','Order for Mrs. Weber')}</button>` : ''}
      <button class="hb plain" type="button" data-a="cancel">${L('Schließen','Close')}</button>`);
  }

  /* ============ Nachrichten mit automatischer Übersetzung ============ */
  const QUICK = [
    {de:'Ja, bitte Birnen.',            en:'Yes, pears please.',              r:{en:'Great, I’ll take pears instead. See you soon!', de:'Prima, ich nehme stattdessen Birnen. Bis gleich!'}},
    {de:'Nein, danke. Keine Äpfel.',    en:'No, thank you. No apples.',       r:{en:'No problem, I’ll skip the apples.',            de:'Kein Problem, ich lasse die Äpfel weg.'}},
    {de:'Wie lange dauert es noch?',    en:'How much longer will it take?',   r:{en:'About 20 minutes. I’ll head over after checkout.', de:'Etwa 20 Minuten. Ich mache mich nach der Kasse auf den Weg.'}},
    {de:'Bitte klingeln Sie an der Tür.',en:'Please ring the doorbell.',      r:{en:'Will do!',                                      de:'Mache ich!'}}
  ];
  function chatInit(){
    if(!RT.chat) RT.chat = [{from:'h', en:'Hi Mrs. Weber, I’m at the supermarket now. The apples are sold out – would you like pears instead?', de:'Hallo Frau Weber, ich bin jetzt im Supermarkt. Die Äpfel sind ausverkauft – möchten Sie stattdessen Birnen?', orig:false}];
  }
  function openChat(){
    chatInit(); RT.chatUnread=false; renderChat(); renderFlowReq();
  }
  function renderChat(){
    const msgs = RT.chat.map((m,i)=>{
      if(m.from==='h'){
        const main = en() ? m.en : m.de;
        return `<div class="bub h">${esc(main)}${en() ? '' : `<small>${I.chat.replace('<svg','<svg style="width:12px;height:12px;vertical-align:-2px;stroke:currentColor;fill:none;stroke-width:2"')} ${L('Automatisch aus dem Englischen übersetzt','Automatically translated from English')}</small>
          <button class="lnkbtn" type="button" data-a="orig" data-i="${i}">${m.orig?L('Original ausblenden','Hide original'):L('Original anzeigen','Show original')}</button>${m.orig?`<span class="orig">${esc(m.en)}</span>`:''}`}</div>`;
      }
      return `<div class="bub u">${esc(en() ? (m.en||m.de) : m.de)}${en() ? '' : `<small>${m.en ? L('Akash sieht: ','Akash sees: ')+'„'+esc(m.en)+'“' : L('Wird für Akash automatisch ins Englische übersetzt.','Is automatically translated into English for Akash.')}</small>`}</div>`;
    }).join('');
    fopen(`${grab}<div class="hs-head"><span class="hs-av"><span class="ini" style="width:100%;height:100%;font-size:1.7rem">A</span><i></i></span><div><h3 id="hsT" style="font-weight:500;font-size:1.4rem">Akash</h3><span class="lvchip">${L('Spricht Englisch','Speaks English')}</span></div></div>
      <div class="chatlist" id="chatList">${msgs}</div>
      <div class="quick">${QUICK.map((q,i)=>`<button type="button" data-a="quick" data-i="${i}">${esc(en()?q.en:q.de)}</button>`).join('')}</div>
      <form class="chatform" id="chatForm" autocomplete="off"><input class="finput" id="chatIn" type="text" placeholder="${L('Nachricht schreiben …','Write a message …')}" aria-label="${L('Nachricht','Message')}"><button type="submit" aria-label="${L('Senden','Send')}">${I.send}</button></form>
      <p class="sub" style="color:var(--mute);font-size:.78rem;text-align:center">${L('Demo: Die Übersetzungen sind in diesem Prototyp vorgegeben. In der Vollversion übersetzt ein Übersetzungsdienst live.','Demo: translations are preset in this prototype. The full version translates live with a translation service.')}</p>
      <button class="hb plain" type="button" data-a="cancel">${L('Schließen','Close')}</button>`);
    RT.sheet = {kind:'chat'};
    const cl = $('chatList'); if(cl) cl.scrollTop = cl.scrollHeight;
    $('chatForm').onsubmit = e=>{ e.preventDefault(); const v=$('chatIn').value.trim(); if(!v) return; sendChat({de:v, en:null}, {en:'Thanks, got it!', de:'Danke, verstanden!'}); };
  }
  function sendChat(user, reply){
    RT.chat.push({from:'u', de:user.de, en:user.en}); renderChat();
    setTimeout(()=>{ RT.chat.push({from:'h', en:reply.en, de:reply.de, orig:false}); if(RT.sheet && RT.sheet.kind==='chat') renderChat(); }, 900);
  }

  /* ============ Richtlinien (Entwurf) ============ */
  const TODO = L('[offen]','[open]');
  const POL = [
    {id:'terms', t:['Nutzungsbedingungen (Kurzfassung)','Terms of use (short version)'], p:[
      ['Goodwill vermittelt Nachbarschaftshilfe bei kleinen Alltagsaufgaben, zum Beispiel Einkaufen. Goodwill ist kein Händler und liefert nicht selbst.','Goodwill connects neighbours for small everyday tasks such as shopping. Goodwill is not a retailer and does not deliver itself.'],
      ['Der Service ist für Sie kostenlos.','The service is free for you.'],
      ['Helfer sind Privatpersonen und helfen freiwillig – sie sind keine Angestellten von Goodwill.','Helpers are private people who help voluntarily – they are not employees of Goodwill.'],
      ['Vorschlag: Nicht vermittelt werden Alkohol, Tabak, rezeptpflichtige Medikamente und Bargeld-Besorgungen.','Proposal: we do not arrange alcohol, tobacco, prescription medicine or cash errands.'],
      ['__TODO__ Zahlungsweg für die Artikel festlegen.','__TODO__ Define how items are paid for.']]},
    {id:'orders', t:['Bestellen, ändern, stornieren','Ordering, changing, cancelling'], p:[
      ['Jede Bestellung bestätigen Sie zweimal: erst prüfen, dann verbindlich abschicken.','You confirm every order twice: first review, then place it.'],
      ['Sie können Ihre Bestellung ergänzen, bis der Helfer mit dem Einkauf beginnt.','You can add to your order until the helper starts shopping.'],
      ['Stornieren ist kostenlos, solange noch kein Helfer zugesagt hat. Danach sprechen Sie sich kurz mit dem Helfer ab.','Cancelling is free as long as no helper has accepted yet. After that, please talk to the helper.'],
      ['Entwürfe bleiben gespeichert, bis Sie sie löschen. Sie können jederzeit später weiter bestellen.','Drafts stay saved until you delete them. You can always continue ordering later.'],
      ['Bei geplanter Lieferung kommt der Helfer im gewählten Zeitfenster. Verspätungen meldet er per Nachricht.','For scheduled deliveries the helper comes in your chosen time window and reports delays by message.']]},
    {id:'honesty', t:['Ehrlichkeits-System','Honesty system'], p:[
      ['Jeder Helfer hat einen Ehrlichkeitswert von 0 bis 100. Gute Lieferungen erhöhen ihn langsam, Probleme senken ihn deutlich schneller.','Every helper has an honesty score from 0 to 100. Good deliveries raise it slowly, problems lower it much faster.'],
      ['Abzüge: zu spät −3, falscher Artikel −4, Artikel fehlt −5, Ware beschädigt oder abgelaufen −7, falscher Preis oder Wechselgeld −10, Helfer kommt nicht −12. Direkt nach einem Problem zählt ein weiteres 1,5-fach. Höchstens −20 pro Lieferung.','Deductions: late −3, wrong item −4, missing item −5, damaged or expired −7, wrong price or change −10, no-show −12. A further problem right after one counts 1.5×. At most −20 per delivery.'],
      ['Unter 40 Punkten prüft Goodwill den Helfer persönlich.','Below 40 points Goodwill reviews the helper personally.'],
      ['__TODO__ Helfer können zu einer Meldung Stellung nehmen – Ablauf festlegen.','__TODO__ Helpers can respond to a report – define the process.']]},
    {id:'conduct', t:['Verhaltenskodex für Helfer','Code of conduct for helpers'], p:[
      ['Respektvoll und geduldig sein. Keine Geschenke und kein Geld verlangen.','Be respectful and patient. Never ask for gifts or money.'],
      ['Wechselgeld und Kassenbon vollständig zurückgeben.','Return all change and the receipt in full.'],
      ['Ersatzartikel nur, wenn die Person es erlaubt hat.','Substitute items only if the person allowed it.'],
      ['Die Wohnung nur betreten, wenn man ausdrücklich darum gebeten wird.','Only enter the home if explicitly asked to.'],
      ['__TODO__ Prüfverfahren für „Geprüft“ festlegen.','__TODO__ Define the vetting process behind “Verified”.']]},
    {id:'trusted', t:['Vertrauensperson','Trusted person'], p:[
      ['Eine Vertrauensperson ist freiwillig. Sie bestimmen, ob sie Bestellungen sehen, für Sie bestellen oder Bestellungen freigeben darf.','A trusted person is optional. You decide whether they may see orders, order for you or approve orders.'],
      ['Sie können das jederzeit ändern oder die Person entfernen.','You can change this at any time or remove the person.']]},
    {id:'privacy', t:['Datenschutz','Privacy'], p:[
      ['Helfer sehen vorab nur Ihren Stadtteil. Ihre genaue Adresse sieht nur der Helfer, der Ihre Anfrage übernommen hat.','Helpers only see your district at first. Only the helper who accepted your request sees your exact address.'],
      ['Nachrichten werden automatisch übersetzt. __TODO__ Übersetzungsdienst und Rechtsgrundlage nennen.','Messages are translated automatically. __TODO__ Name the translation service and legal basis.'],
      ['Sie können Ihr Konto jederzeit löschen lassen.','You can have your account deleted at any time.'],
      ['__TODO__ Datenschutzerklärung nach DSGVO von einer Fachperson prüfen lassen.','__TODO__ Have the privacy notice (GDPR) reviewed by a professional.']]},
    {id:'language', t:['Sprache und Übersetzung','Language and translation'], p:[
      ['Nachrichten zwischen Ihnen und englischsprachigen Helfern werden automatisch ins Deutsche übersetzt. Das Original können Sie jederzeit ansehen.','Messages between you and English-speaking helpers are translated into German automatically. You can always see the original.'],
      ['Übersetzungen können Fehler enthalten. Bei wichtigen Dingen, zum Beispiel Medikamenten, bitte nachfragen.','Translations can contain mistakes. For important things, such as medicine, please ask again.']]},
    {id:'liability', t:['Haftung und Probleme','Liability and problems'], p:[
      ['Probleme melden Sie direkt in der App. Goodwill schaut sich jede Meldung an.','Report problems directly in the app. Goodwill looks at every report.'],
      ['Goodwill ist kein Notdienst. In Notfällen rufen Sie bitte die 112.','Goodwill is not an emergency service. In an emergency please call 112.'],
      ['__TODO__ Haftung und Versicherung der Helfer rechtlich klären.','__TODO__ Clarify liability and helper insurance legally.']]}
  ];
  function openPolicies(id){
    A.show('policies'); renderPolicies(id);
  }
  function renderPolicies(openId){
    const fix = s => esc(s).replace('__TODO__', `<span class="todo">${TODO}</span>`);
    $('polBody').innerHTML = `<div class="rvnote warn">${I.info}<span>${L('Entwurf – noch nicht rechtlich geprüft. Offene Punkte sind mit [offen] markiert.','Draft – not yet legally reviewed. Open points are marked [open].')}</span></div>
      <section class="glass pol" style="padding:6px 18px;border-radius:26px">` + POL.map(p=>`<details id="pol-${p.id}" ${p.id===openId?'open':''}><summary>${en()?p.t[1]:p.t[0]}</summary><ul>${p.p.map(x=>`<li>${fix(en()?x[1]:x[0])}</li>`).join('')}</ul></details>`).join('') + '</section>';
    $('polTitle').textContent = L('Richtlinien & Regeln','Policies & rules');
    if(openId){ const el=$('pol-'+openId); if(el) setTimeout(()=>el.scrollIntoView({block:'center'}),50); }
  }

  /* ============ Einfacher Modus ============ */
  let simple = false, prevSize = '';
  try{ simple = localStorage.getItem('gw-simple')==='1'; }catch(e){}
  function applySimple(on, silent){
    if(on && !simple) prevSize = document.documentElement.style.fontSize;
    simple = on;
    document.body.classList.toggle('simple', on);
    if(on) document.documentElement.style.fontSize = '19.5px'; else if(prevSize!==null) document.documentElement.style.fontSize = prevSize;
    try{ localStorage.setItem('gw-simple', on?'1':'0'); }catch(e){}
    const l = $('simpleLbl'); if(l) l.textContent = on ? L('An','On') : L('Aus','Off');
    if(!silent) A.toast(on ? L('Einfacher Modus an: größere Schrift und Knöpfe','Simple mode on: larger text and buttons') : L('Einfacher Modus aus','Simple mode off'));
  }

  /* ============ Anzeigen in „Anfragen“ und „Gesendet“ ============ */
  function renderFlowReq(){
    const host = $('flowReq'); if(!host) return;
    let h = '';
    const d = FL.draft;
    if(d) h += `<div class="rq"><span class="rq-i alt">${I.edit}</span><span class="rq-t"><b>${L('Entwurf','Draft')}</b><small>${esc(d.items.map(x=>iName(A.getItem(x.id)||x.custom||{name:'?',id:x.id})).join(', '))}</small></span><button class="rq-st sent" type="button" data-a="resume">${L('Fortsetzen','Continue')}</button><span class="hcard-bar"><button class="lnk" type="button" data-a="discard">${L('Entwurf löschen','Delete draft')}</button></span></div>`;
    if(RT.approval==='pending' && FL.care) h += `<div class="rq"><span class="rq-i alt">${I.people}</span><span class="rq-t"><b>${L('Wartet auf Freigabe','Waiting for approval')}</b><small>${esc(FL.care.name)} ${L('prüft Ihre Bestellung','is checking your order')}</small></span><span class="rq-st sent">${L('Offen','Open')}</span><span class="hcard-bar"><button class="lnk" type="button" data-a="careview">${L('Demo: Ansicht von ','Demo: view of ')+esc(FL.care.name)}</button></span></div>`;
    chatInit();
    const last = RT.chat[RT.chat.length-1];
    h += `<button class="rq" type="button" data-a="chat"><span class="rq-i">${I.chat}</span><span class="rq-t"><b>${RT.chatUnread?'<i class="dotnew"></i>':''}${L('Nachrichten von Akash','Messages from Akash')}</b><small>${esc(en()?last.en||last.de:last.de)}</small></span><span class="rq-st">${RT.chatUnread?L('Neu','New'):L('Öffnen','Open')}</span></button>`;
    host.innerHTML = h;
  }
  function renderSentExtras(){
    const k = RT.sentKind;
    const t = document.querySelector('#s-sent .sent-title'), s = document.querySelector('#s-sent .sent-sub');
    if(t) t.textContent = k==='approval' ? L('Wartet auf Freigabe','Waiting for approval') : k==='added' ? L('Ergänzt!','Added!') : L('Anfrage gesendet!','Request sent!');
    if(s) s.textContent = k==='approval' ? L((FL.care?FL.care.name:'Ihre Vertrauensperson')+' muss Ihre Bestellung noch freigeben. Danach informieren wir Helfer in Ihrer Nähe.',(FL.care?FL.care.name:'Your trusted person')+' still has to approve your order. Then we inform helpers near you.')
                    : k==='added' ? L('Ihre Artikel wurden zur laufenden Anfrage hinzugefügt.','Your items were added to the current request.')
                    : L('Wir haben Helfer in Ihrer Nähe informiert. Sie erhalten bald eine Nachricht.','We have informed helpers near you. You will get a message soon.');
    const host = $('sentExtra'); if(!host) return;
    const sc = (window.GWHon && GWHon.score) ? GWHon.score('akash') : 82;
    host.innerHTML = `<div class="hcardx glass"><span class="ini">A</span><div class="tx"><b>Akash</b><small>${L('Ihr Stamm-Helfer','Your regular helper')} · ${L('Ehrlichkeit','Honesty')} ${sc}</small><span class="hbar sm lv-${sc<40?'low':sc<60?'mid':'ok'}"><i style="width:${sc}%"></i></span></div>
        <button class="iconbtn" type="button" data-a="chat" aria-label="${L('Nachricht an Akash','Message Akash')}">${I.chat}${RT.chatUnread?'<i class="dotnew"></i>':''}</button></div>
      <div class="sentbtns"><button class="hb ghost" type="button" data-a="more">${I.plus}${L('Noch etwas hinzufügen','Add something else')}</button></div>
      <p class="sub" style="text-align:center;color:var(--mute);font-size:.82rem;margin:0 0 4px">${L('Ergänzen ist möglich, bis der Helfer mit dem Einkauf beginnt.','You can add items until the helper starts shopping.')}</p>`;
  }

  /* Text für „Anfrage gesendet“-Liste (wird von renderSent aufgerufen) */
  window.GWFlowSentText = d => {
    if(!d || !d.slot) return '';
    return '<br>'+L('Lieferung','Delivery')+': '+esc(slotText(d.slot)) + (d.area ? '<br>'+L('Gebiet','District')+': '+esc((AREAS.find(a=>a.id===d.area)||AREAS[0]).n) : '') + (d.onBehalf ? '<br>'+L('Bestellt von Ihrer Vertrauensperson','Ordered by your trusted person') : '');
  };

  /* ============ Alle Klicks im Sheet ============ */
  function onSheetClick(e){
    const b = e.target.closest('[data-a]'); if(!b) return;
    const a = b.dataset.a;
    if(a==='cancel') return fclose();
    if(a==='go'){ fclose(); return commit(); }
    if(a==='more'){ fclose(); return onMore(); }
    if(a==='pick'){ FL.area=b.dataset.id; save(); renderAreaUI(); const fr=RT.sheet&&RT.sheet.fromReview; fclose(); if(fr) renderReview(); else A.toast(L('Gebiet gespeichert: ','District saved: ')+area().n); return; }
    if(a==='rel'){ careDraft.rel=+b.dataset.i; careDraft.name=($('careName')||{}).value||careDraft.name; return renderCareSheet(); }
    if(a==='tg'){ careDraft.name=($('careName')||{}).value||careDraft.name; careDraft[b.dataset.k]=!careDraft[b.dataset.k]; return renderCareSheet(); }
    if(a==='care-save'){ careDraft.name=careDraft.name.trim(); FL.care=careDraft; save(); renderCareUI(); fclose(); A.toast(L(careDraft.name+' ist jetzt Ihre Vertrauensperson',careDraft.name+' is now your trusted person')); return; }
    if(a==='care-del'){ FL.care=null; RT.approval=null; save(); renderCareUI(); renderFlowReq(); fclose(); A.toast(L('Vertrauensperson entfernt','Trusted person removed')); return; }
    if(a==='care-view') return openCareView();
    if(a==='approve'){ RT.approval=null; RT.sentKind='sent'; renderSentExtras(); renderFlowReq(); fclose(); A.toast(L(FL.care.name+' hat freigegeben – Helfer werden informiert',FL.care.name+' approved – helpers are being informed')); return; }
    if(a==='decline'){ RT.approval=null; A.state.sent=null; A.state.reqs.shift(); A.renderReqs(); A.renderSent(); renderFlowReq(); fclose(); A.toast(L(FL.care.name+' hat die Bestellung abgelehnt',FL.care.name+' declined the order')); if(!$('s-sent').classList.contains('hidden')){ A.state.nav=['req']; A.show('req',false);} return; }
    if(a==='order-for'){ fclose(); RT.onBehalf=true; const st=A.state; st.cart={}; st.order=[]; st.queue=[]; st.custom={}; st.nav=['home']; A.startRequest(null); A.toast(L('Sie bestellen für Frau Weber','You are ordering for Mrs. Weber')); return; }
    if(a==='orig'){ const m=RT.chat[+b.dataset.i]; m.orig=!m.orig; return renderChat(); }
    if(a==='quick'){ const q=QUICK[+b.dataset.i]; return sendChat({de:q.de,en:q.en}, q.r); }
  }
  function onMore(){
    /* Aus Bestätigung: zurück zur Auswahl (Warenkorb bleibt). Von „Gesendet“: Ergänzung zur laufenden Anfrage. */
    if(!$('s-sent').classList.contains('hidden')) return addMore();
    A.goBack(); /* review → create */
  }


  /* ============ „Nochmal bestellen“ (wie Blinkit „Buy again“) ============ */
  const AGAIN = [
    {who:'Daniel', de:'Sa., 18. Okt.', en:'Sat, 18 Oct', ids:['milch','brot','aepfel']},
    {who:'Sophia', de:'Mo., 13. Okt.', en:'Mon, 13 Oct', ids:['butter','kaffee']},
    {who:'Daniel', de:'Fr., 3. Okt.',  en:'Fri, 3 Oct',  ids:['eier','kartoffeln','gemuese']}
  ];
  function buyAgainHTML(){
    return `<div class="ba"><h3 class="cs-title">${L('Nochmal bestellen','Order again')}</h3><div class="barow">` + AGAIN.map((r,i)=>
      `<button type="button" class="bacard" data-buy="${i}"><span class="bae">${r.ids.slice(0,3).map(id=>`<i>${A.emo(id)}</i>`).join('')}</span><b>${esc(r.ids.map(id=>iName(A.getItem(id))).join(', '))}</b><small>${esc(r.who)} · ${en()?r.en:r.de}</small><span class="baplus">+ ${L('Hinzufügen','Add')}</span></button>`).join('') + '</div></div>';
  }
  $('catView').addEventListener('click', e=>{
    const b = e.target.closest('[data-buy]'); if(!b) return;
    AGAIN[+b.dataset.buy].ids.forEach(id=>{ if(!(id in A.state.cart)) A.setVal(id, A.getItem(id).start); });
    A.renderAll(); A.toast(L('Artikel hinzugefügt – bitte prüfen','Items added – please check'));
  });

  /* ============ Verdrahten ============ */
  $('rvBody').onclick = onReviewClick;
  $('rvNext').onclick = confirm2;
  $('rvDraft').onclick = saveDraft;
  $('backReview').onclick = ()=>A.goBack();
  $('backPol').onclick = ()=>A.goBack();
  $('fscrim').onclick = fclose;
  fs().onclick = onSheetClick;
  fs().setAttribute('tabindex','-1');
  document.addEventListener('keydown', e=>{ if(e.key==='Escape' && !fs().classList.contains('hidden')) fclose(); });

  $('addrLine').onclick = $('homeAddr').onclick = ()=>openArea(false);
  $('addrRow').onclick  = ()=>openArea(false);
  $('careBanner').onclick = openCare;
  $('careRow').onclick = openCare;
  $('polRow').onclick = ()=>openPolicies();
  $('polRow2').onclick = ()=>openPolicies('privacy');
  $('polRow3').onclick = ()=>openPolicies('conduct');
  $('simpleBtn').onclick = ()=>applySimple(!simple);

  $('flowReq').onclick = e=>{
    const b = e.target.closest('[data-a]'); if(!b) return;
    const a = b.dataset.a;
    if(a==='resume') resumeDraft(); else if(a==='discard') discardDraft(); else if(a==='chat') openChat(); else if(a==='careview') openCareView();
  };
  $('sentExtra').onclick = e=>{
    const b = e.target.closest('[data-a]'); if(!b) return;
    if(b.dataset.a==='more') addMore(); else if(b.dataset.a==='chat') openChat();
  };

  function render(){
    renderAreaUI(); renderCareUI(); renderFlowReq(); renderSentExtras();
    $('simpleLbl').textContent = simple ? L('An','On') : L('Aus','Off');
    const sl = document.querySelector('#simpleBtn .tx'); if(sl) sl.textContent = L('Einfacher Modus','Simple mode');
    if(!$('s-review').classList.contains('hidden')) renderReview();
    if(!$('s-policies').classList.contains('hidden')) renderPolicies();
    if(!fs().classList.contains('hidden') && RT.sheet && RT.sheet.kind==='chat') renderChat();
  }
  function reset(){ resetSel(); RT.adding=false; RT.onBehalf=false; RT.sentKind='sent'; RT.approval=null; renderSentExtras(); renderFlowReq(); }

  if(simple) applySimple(true, true);
  render();
  window.GWFlow = {review, render, reset, slotText, buyAgainHTML, openChat, resumeDraft,
    info:()=>{ chatInit(); return {chat:RT.chat, chatUnread:RT.chatUnread, draft:FL.draft, approval:RT.approval, care:FL.care}; }};
})();
