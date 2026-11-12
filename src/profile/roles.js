/* ============ ANSICHT: EMPFÄNGER · HELFER · BETREUER ============
   Die gewählte Rolle bestimmt die Startseite. Wird gespeichert.
   Helfer verdienen Goodwill-Credits (10 Credits = 1 €). */
(function(){
  const $ = id => document.getElementById(id);
  const esc = GWSec.esc;
  const en = () => LANG === 'en';
  const A = window.GWApp;
  const KEY = 'gw-role-v2';
  const EUR_PER_CREDIT = 0.10;

  const fresh = () => ({
    role:'recv', approvals:{}, limit:20,
    tasks:{},                                   // id -> 'accepted' | 'done'
    h:{balance:1240, lifetime:3864, month:480, helps:26, week:3, log:[
      {ts:Date.now()-2*864e5,  de:'Lieferung für Frau Klein',   en:'Delivery for Mrs Klein',   c:40},
      {ts:Date.now()-4*864e5,  de:'Apothekengang für Herrn Roth',en:'Pharmacy run for Mr Roth', c:30},
      {ts:Date.now()-6*864e5,  de:'Wochenbonus (5 Hilfen)',     en:'Weekly bonus (5 helps)',   c:50},
      {ts:Date.now()-9*864e5,  de:'Auszahlung aufs Konto',      en:'Payout to bank account',   c:-1000}
    ]}
  });
  let R = fresh();
  try{
    const x = JSON.parse(localStorage.getItem(KEY));
    if(x && typeof x === 'object' && x.h && typeof x.h.balance === 'number') R = Object.assign(fresh(), x);
    else { const old = JSON.parse(localStorage.getItem('gw-role-v1')); if(old && old.role) R.role = old.role; }
  }catch(e){}
  const save = () => { try{ localStorage.setItem(KEY, JSON.stringify(R)); }catch(e){} };

  const num = n => n.toLocaleString(en()?'en-GB':'de-DE');
  const eur = n => n.toLocaleString(en()?'en-GB':'de-DE',{style:'currency',currency:'EUR'});
  const cEur = c => eur(c * EUR_PER_CREDIT);
  const dShort = ts => new Date(ts).toLocaleDateString(en()?'en-GB':'de-DE',{weekday:'short',day:'numeric',month:'short'});

  const I = {
    recv:'<svg viewBox="0 0 24 24"><path d="M4 11.5L12 5l8 6.5"/><path d="M6 10.5V19h12v-8.5"/><path d="M10 19v-5h4v5"/></svg>',
    help:'<svg viewBox="0 0 24 24"><path d="M5.2 8.5h13.6l-1.1 10.6a1.6 1.6 0 0 1-1.6 1.4H7.9a1.6 1.6 0 0 1-1.6-1.4L5.2 8.5z"/><path d="M8.8 8.5V7a3.2 3.2 0 0 1 6.4 0v1.5"/></svg>',
    guard:'<svg viewBox="0 0 24 24"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z"/><path d="M9.5 12.5a2.5 2.5 0 0 1 5 0"/><circle cx="12" cy="9.5" r="1.6"/></svg>',
    check:'<svg viewBox="0 0 24 24"><path d="M4.5 12.8l5 5L19.5 7"/></svg>',
    eye:'<svg viewBox="0 0 24 24"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    coin:'<svg viewBox="0 0 24 24"><ellipse cx="12" cy="6.5" rx="7" ry="2.8"/><path d="M5 6.5v5.2c0 1.6 3.1 2.8 7 2.8s7-1.2 7-2.8V6.5"/><path d="M5 11.7v5.5c0 1.6 3.1 2.8 7 2.8s7-1.2 7-2.8v-5.5"/></svg>'
  };
  const ROLES = [
    {id:'recv',  icon:'recv',  de:'Empfänger', en:'Receiver',
     dde:'Ich bekomme Hilfe beim Einkaufen und im Alltag.', den:'I get help with shopping and everyday tasks.'},
    {id:'help',  icon:'help',  de:'Helfer',    en:'Helper',
     dde:'Ich helfe Menschen in meiner Nachbarschaft und sammle Goodwill-Credits.', den:'I help people in my neighbourhood and earn Goodwill credits.'},
    {id:'guard', icon:'guard', de:'Betreuer',  en:'Guardian',
     dde:'Ich kümmere mich um einen Angehörigen und gebe Bestellungen frei.', den:'I look after a relative and approve their orders.'}
  ];
  const role = () => ROLES.find(r => r.id === R.role) || ROLES[0];
  const rName = r => en() ? r.en : r.de;

  /* ---------- Demo-Daten ---------- */
  const OPEN = [
    {id:'weber',  who:'Margarete Weber', ini:'MW', area:'Altstadt',      km:0.4, c:40, mins:25,
     de:'Milch, Brot, Äpfel',             en:'Milk, bread, apples',                    wde:'Heute · sobald möglich', wen:'Today · as soon as possible'},
    {id:'schulz', who:'Herr Schulz',     ini:'S',  area:'Stadtfeld Ost', km:1.2, c:30, mins:20,
     de:'Rezept in der Apotheke abholen', en:'Pick up a prescription at the pharmacy', wde:'Morgen · Vormittag',     wen:'Tomorrow · morning'},
    {id:'yilmaz', who:'Frau Yilmaz',     ini:'Y',  area:'Sudenburg',     km:2.0, c:70, mins:50,
     de:'Wocheneinkauf (7 Artikel)',      en:'Weekly shop (7 items)',                  wde:'Fr. · Nachmittag',       wen:'Fri · afternoon'}
  ];
  const WEEK_GOAL = 5, WEEK_BONUS = 50;
  const PENDING = [
    {id:'ap1', de:'Kaffee, Butter, Joghurt', en:'Coffee, butter, yoghurt', price:14.80, who:'Akash', wde:'Heute, 09:12', wen:'Today, 9:12 am'},
    {id:'ap2', de:'Wocheneinkauf (9 Artikel)', en:'Weekly shop (9 items)', price:46.30, who:'Daniel', wde:'Heute, 10:05', wen:'Today, 10:05 am'}
  ];
  const ORDER_EUR = [18.40, 9.90, 12.75, 21.60, 38.20];
  const nextTuesday = () => { const d = new Date(); d.setDate(d.getDate() + ((9 - d.getDay()) % 7 || 7)); return d; };

  /* ---------- Startseite je Rolle ---------- */
  const homeTitle = $('s-home').querySelector('h1.display'), homeLead = $('s-home').querySelector('p.lead');
  let host = $('roleHome');
  if(!host){ host = document.createElement('div'); host.id = 'roleHome'; $('s-home').querySelector('.tiles').after(host); }
  let showInfo = false;

  function helperHome(){
    const H = R.h, sc = window.GWHon && GWHon.score ? GWHon.score('akash') : 82;
    const mine = OPEN.filter(o => R.tasks[o.id] === 'accepted');
    const open = OPEN.filter(o => !R.tasks[o.id]);
    const wk = Math.min(H.week, WEEK_GOAL);
    let h = `<div class="cr">
      <span class="lab">${I.coin}${L('Goodwill-Credits','Goodwill credits')}</span>
      <div class="big">${num(H.balance)}<small>Credits</small></div>
      <div class="eur">≈ ${cEur(H.balance)} ${L('verfügbar','available')}</div>
      <div class="split">
        <div><b>${cEur(H.lifetime)}</b><small>${L('Insgesamt verdient','Total earned')}</small></div>
        <div><b>${cEur(H.month)}</b><small>${L('Diesen Monat','This month')}</small></div>
      </div>
      ${showInfo ? `<div class="info">${L('Für jede erledigte Hilfe erhalten Sie Goodwill-Credits – je nach Aufwand 30 bis 70. 10 Credits = 1 €. Ab 100 Credits können Sie sich den Betrag aufs Konto auszahlen lassen oder ihn spenden.','For every completed help you receive Goodwill credits – 30 to 70 depending on effort. 10 credits = €1. From 100 credits you can pay the amount out to your bank account or donate it.')}</div>` : ''}
      <div class="acts"><button class="w" type="button" data-r="payout">${L('Auszahlen','Pay out')}</button><button class="o" type="button" data-r="info">${showInfo ? L('Weniger','Less') : L('So funktioniert’s','How it works')}</button></div>
    </div>`;
    h += `<div class="rh-stats">
      <div class="rh-stat"><b>${H.helps}</b><small>${L('Hilfen gesamt','Total helps')}</small></div>
      <div class="rh-stat"><b>${sc}</b><small>${L('Ehrlichkeit','Honesty')}</small></div>
      <div class="rh-stat"><b>4,9 ★</b><small>${L('Bewertung','Rating')}</small></div></div>`;
    h += `<div class="rh-card"><div class="rh-pl"><b>${L('Wochenziel','Weekly goal')}</b><span>${wk} / ${WEEK_GOAL} ${L('Hilfen','helps')}</span></div>
      <div class="rh-prog" role="progressbar" aria-valuemin="0" aria-valuemax="${WEEK_GOAL}" aria-valuenow="${wk}"><i style="width:${wk/WEEK_GOAL*100}%"></i></div>
      <div class="rh-when">${wk >= WEEK_GOAL ? L('Geschafft! Wochenbonus erhalten.','Done! Weekly bonus received.') : L('Noch '+(WEEK_GOAL-wk)+' bis zum Wochenbonus (+'+WEEK_BONUS+' Credits)', (WEEK_GOAL-wk)+' more for the weekly bonus (+'+WEEK_BONUS+' credits)')}</div></div>`;
    if(mine.length){
      h += `<p class="rh-sec">${L('Meine Aufgaben','My tasks')}<em>${mine.length}</em></p>`;
      h += mine.map(o => reqCard(o, true)).join('');
    }
    h += `<p class="rh-sec">${L('Anfragen in Ihrer Nähe','Requests near you')}<em>${open.length}</em></p>`;
    h += open.length ? open.map(o => reqCard(o, false)).join('')
      : `<div class="rh-card"><div class="rh-items">${L('Gerade keine offenen Anfragen. Danke für Ihre Hilfe!','No open requests right now. Thanks for helping!')}</div><div class="rh-acts"><button class="rh-btn sec" type="button" data-r="resetreq">${L('Beispiele erneut zeigen','Show examples again')}</button></div></div>`;
    h += `<p class="rh-sec">${L('Credit-Verlauf','Credit history')}</p><div class="rh-card">` +
      H.log.slice(0,6).map(x => `<div class="rh-row"><span class="rh-ok">${x.c > 0 ? '+' : '€'}</span><span class="m">${esc(en()?x.en:x.de)}<small>${dShort(x.ts)}</small></span><span class="amt ${x.c>0?'plus':'minus'}">${x.c>0?'+':'−'}${num(Math.abs(x.c))}</span></div>`).join('') + '</div>';
    return h;
  }
  function reqCard(o, mine){
    const km = en() ? o.km.toFixed(1) : o.km.toFixed(1).replace('.', ',');
    return `<div class="rh-card"><div class="rh-top"><span class="rh-av">${esc(o.ini)}</span><span class="t"><b>${esc(o.who)}</b><small>${esc(o.area)} · ${km} km</small></span></div>
      <div class="rh-items">${esc(en()?o.en:o.de)}</div>
      <div class="rh-meta"><span class="rh-tag green">+${o.c} Credits · ${cEur(o.c)}</span><span class="rh-tag">≈ ${o.mins} Min.</span><span class="rh-tag${mine?' warm':''}">${esc(en()?o.wen:o.wde)}</span></div>
      <div class="rh-acts">${mine
        ? `<button class="rh-btn pri" type="button" data-r="deliver" data-id="${o.id}">${L('Als geliefert markieren','Mark as delivered')}</button><button class="rh-btn sec" type="button" data-r="undo" data-id="${o.id}">${L('Zurückgeben','Give back')}</button>`
        : `<button class="rh-btn pri" type="button" data-r="accept" data-id="${o.id}">${L('Übernehmen','Accept')}</button>`}</div></div>`;
  }

  function guardianHome(){
    const orders = (A.ORDERS || []).slice(0,5);
    const spent = orders.reduce((s,o,i) => s + (ORDER_EUR[i] || 0), 0);
    const open = PENDING.filter(p => !R.approvals[p.id]);
    const auto = p => R.limit > 0 && p.price < R.limit;
    const nt = nextTuesday().toLocaleDateString(en()?'en-GB':'de-DE',{weekday:'short',day:'numeric',month:'short'});
    let h = `<div class="rh-card"><div class="rh-top"><span class="rh-av lg">MW</span><span class="t"><b>Margarete Weber</b><small>${L('Altstadt, Magdeburg · 82 Jahre','Altstadt, Magdeburg · 82 years')}</small><span class="rh-status"><i></i>${L('Alles in Ordnung · zuletzt aktiv heute, 09:40','All good · last active today, 9:40 am')}</span></span></div>
      <div class="rh-acts"><button class="rh-btn sec" type="button" data-r="call">${L('Anrufen','Call')}</button><button class="rh-btn sec" type="button" data-r="msg">${L('Nachricht','Message')}</button></div>
      <div class="rh-acts"><button class="rh-btn pri" type="button" data-r="orderfor">${L('Für sie bestellen','Order for her')}</button></div></div>`;
    h += `<div class="rh-stats">
      <div class="rh-stat"><b>${orders.length}</b><small>${L('Bestellungen im Monat','Orders this month')}</small></div>
      <div class="rh-stat"><b>${en() ? '€'+Math.round(spent) : Math.round(spent)+' €'}</b><small>${L('Ausgaben','Spent')}</small></div>
      <div class="rh-stat"><b>4</b><small>${L('Vertraute Helfer','Trusted helpers')}</small></div></div>`;
    h += `<p class="rh-sec">${L('Freigaben','Approvals')}<em>${open.length ? open.length + L(' offen',' open') : ''}</em></p>`;
    h += open.length ? open.map(p => `<div class="rh-card"><div class="rh-pl"><b>${L('Neue Bestellung','New order')}</b><span class="amt">≈ ${eur(p.price)}</span></div>
        <div class="rh-items">${esc(en()?p.en:p.de)}</div>
        <div class="rh-meta"><span class="rh-tag">${L('Helfer: ','Helper: ')}${esc(p.who)}</span><span class="rh-tag">${esc(en()?p.wen:p.wde)}</span>${auto(p)?`<span class="rh-tag green">${L('Unter Ihrem Limit','Under your limit')}</span>`:`<span class="rh-tag warm">${L('Über Ihrem Limit','Over your limit')}</span>`}</div>
        <div class="rh-acts"><button class="rh-btn pri" type="button" data-r="approve" data-id="${p.id}">${L('Freigeben','Approve')}</button><button class="rh-btn sec" type="button" data-r="decline" data-id="${p.id}">${L('Ablehnen','Decline')}</button></div></div>`).join('')
      : `<div class="rh-card"><div class="rh-items">${L('Keine offenen Freigaben. Alles erledigt.','No open approvals. All done.')}</div><div class="rh-acts"><button class="rh-btn sec" type="button" data-r="resetap">${L('Beispiele erneut zeigen','Show examples again')}</button></div></div>`;
    h += `<p class="rh-sec">${L('Freigabe-Regel','Approval rule')}</p><div class="rh-card">
      <div class="rh-items">${L('Bestellungen brauchen Ihre Freigabe ab:','Orders need your approval from:')}</div>
      <div class="rh-chips" role="radiogroup">${[0,20,50].map(v => `<button type="button" role="radio" aria-checked="${R.limit===v}" class="${R.limit===v?'on':''}" data-r="limit" data-v="${v}">${v===0?L('Immer','Always'):eur(v).replace(/[,.]00/,'')}</button>`).join('')}</div>
      <div class="rh-when">${R.limit===0?L('Jede Bestellung wird Ihnen vorgelegt.','Every order is sent to you first.'):L('Kleinere Einkäufe gehen direkt an die Helfer.','Smaller orders go straight to the helpers.')}</div></div>`;
    h += `<p class="rh-sec">${L('Regelmäßige Hilfe','Regular support')}</p><div class="rh-card"><div class="rh-row"><span class="rh-ok">${I.check}</span><span class="m">${L('Wocheneinkauf · jeden Dienstag, Vormittag','Weekly shop · every Tuesday, morning')}<small>${L('Nächster Termin: ','Next: ')+nt} · Akash</small></span></div></div>`;
    h += `<p class="rh-sec">${L('Vertraute Helfer','Trusted helpers')}</p><div class="rh-card">` +
      [['akash','Akash'],['daniel','Daniel'],['sophia','Sophia'],['thomas','Thomas']].map(([id,n]) => {
        const s = window.GWHon && GWHon.score ? GWHon.score(id) : 90;
        return `<div class="rh-row"><span class="rh-ok">${n[0]}</span><span class="m">${n}<small>${L('Ehrlichkeit ','Honesty ')+s}/100</small></span><span class="rh-tag ${s>=80?'green':'warm'}">${s>=92?L('Held','Hero'):s>=80?L('Sehr zuverlässig','Very reliable'):L('Zuverlässig','Reliable')}</span></div>`;
      }).join('') + '</div>';
    h += `<p class="rh-sec">${L('Letzte Bestellungen','Recent orders')}</p><div class="rh-card">` +
      orders.map((o,i) => `<div class="rh-row"><span class="rh-ok">${I.check}</span><span class="m">${L('Geliefert von ','Delivered by ')+esc(o.who)}<small>${esc(en()?o.en:o.de)} · ${o.items.length} ${L('Artikel','items')}</small></span><span class="amt">${eur(ORDER_EUR[i]||0)}</span></div>`).join('') + '</div>';
    return h;
  }

  function renderHome(){
    const r = R.role;
    document.body.classList.toggle('role-helper', r === 'help');
    document.body.classList.toggle('role-guardian', r === 'guard');
    if(r === 'help'){
      homeTitle.innerHTML = L('Danke, dass Sie helfen.','Thank you for helping.');
      homeLead.textContent = L('Ihre Credits, Aufgaben und Nachbarn, die gerade Hilfe brauchen.','Your credits, tasks and neighbours who need help right now.');
      host.innerHTML = helperHome();
    } else if(r === 'guard'){
      homeTitle.innerHTML = L('Gut umsorgt – auch aus der Ferne.','Well cared for – even from afar.');
      homeLead.textContent = L('Behalten Sie die Einkäufe Ihrer Angehörigen im Blick.','Keep an eye on your relative’s shopping.');
      host.innerHTML = guardianHome();
    } else {
      heroCap();
      host.innerHTML = '';
    }
  }
  /* Text je Bild im Start-Banner, gleiche Reihenfolge wie die .slide-Elemente in index.html: [Titel de, en, Zeile de, en] */
  const HERO_CAPS = [
    ['Gemeinsam für ein besseres Morgen.','Together for a better tomorrow.','Alltagshilfe von Menschen aus Ihrer Nachbarschaft – kostenlos.','Everyday help from people in your neighbourhood – free of charge.'],
    ['Ihr Einkauf, bis an die Tür.','Your shopping, right to your door.','Ein Nachbar bringt, was Sie brauchen.','A neighbour brings what you need.'],
    ['Jung und Alt, Tür an Tür.','Young and old, door to door.','Hier hilft die ganze Nachbarschaft mit.','The whole neighbourhood lends a hand.'],
    ['Bleiben Sie ruhig sitzen.','Stay comfortably seated.','Der Einkauf kommt zu Ihnen nach Hause.','Your shopping comes to your home.'],
    ['Gemeinsam trägt es sich leichter.','Lighter when carried together.','Kleine Hilfe, große Freude – für alle.','A little help, a lot of joy – for everyone.'],
    ['Ein freundliches Gesicht an der Tür.','A friendly face at the door.','Hilfe von Menschen, die gleich nebenan wohnen.','Help from people who live right next door.']
  ];
  function heroCap(){
    if(R.role === 'help' || R.role === 'guard') return; // diese Rollen haben ihren eigenen festen Text
    const c = HERO_CAPS[[...document.querySelectorAll('#hero .slide')].findIndex(s => s.classList.contains('on'))] || HERO_CAPS[0];
    homeTitle.textContent = L(c[0], c[1]); homeLead.textContent = L(c[2], c[3]);
  }
  window.GWHeroCap = heroCap;

  host.onclick = e => {
    const b = e.target.closest('[data-r]'); if(!b) return;
    const a = b.dataset.r, id = b.dataset.id, o = OPEN.find(x => x.id === id), H = R.h;
    if(a === 'accept'){ R.tasks[id] = 'accepted'; A.toast(L('Übernommen! '+o.who+' wurde informiert.','Accepted! '+o.who+' has been informed.')); }
    else if(a === 'undo'){ delete R.tasks[id]; A.toast(L('Anfrage zurückgegeben','Request given back')); }
    else if(a === 'deliver'){
      R.tasks[id] = 'done';
      let c = o.c; H.helps++; H.week++;
      H.log.unshift({ts:Date.now(), de:'Lieferung für '+o.who, en:'Delivery for '+o.who, c:o.c});
      if(H.week === WEEK_GOAL){ c += WEEK_BONUS; H.log.unshift({ts:Date.now(), de:'Wochenbonus ('+WEEK_GOAL+' Hilfen)', en:'Weekly bonus ('+WEEK_GOAL+' helps)', c:WEEK_BONUS}); }
      H.balance += c; H.lifetime += c; H.month += c;
      A.toast(L('+'+c+' Credits gutgeschrieben – danke!','+'+c+' credits added – thank you!'));
    }
    else if(a === 'payout'){
      if(H.balance < 100){ A.toast(L('Auszahlung ab 100 Credits möglich','Payout possible from 100 credits')); return; }
      const amt = H.balance;
      H.log.unshift({ts:Date.now(), de:'Auszahlung aufs Konto', en:'Payout to bank account', c:-amt});
      H.balance = 0;
      A.toast(L('Auszahlung von '+cEur(amt)+' angefordert','Payout of '+cEur(amt)+' requested'));
    }
    else if(a === 'info'){ showInfo = !showInfo; }
    else if(a === 'resetreq'){ R.tasks = {}; }
    else if(a === 'approve'){ R.approvals[id] = 'ok'; A.toast(L('Bestellung freigegeben – Helfer wird informiert','Order approved – helper is being informed')); }
    else if(a === 'decline'){ R.approvals[id] = 'no'; A.toast(L('Bestellung abgelehnt – Margarete wird benachrichtigt','Order declined – Margarete will be notified')); }
    else if(a === 'resetap'){ R.approvals = {}; }
    else if(a === 'limit'){ R.limit = +b.dataset.v; }
    else if(a === 'call'){ A.toast(L('Anruf bei Margarete wird gestartet …','Calling Margarete …')); return; }
    else if(a === 'msg'){ A.toast(L('Nachrichten kommen bald','Messages coming soon')); return; }
    else if(a === 'orderfor'){ A.startRequest(null); return; }
    save(); renderHome();
  };

  /* ---------- Profil-Zeile ---------- */
  let prow = $('roleRow');
  if(!prow){
    prow = document.createElement('button');
    prow.type = 'button'; prow.id = 'roleRow'; prow.className = 'prow glass';
    $('careBanner').before(prow);
    prow.onclick = open;
  }
  function renderRow(){
    prow.innerHTML = `<span class="ci">${I.eye}</span><span class="tx">${L('Ansicht','View')}</span><em class="val">${esc(rName(role()))}</em><svg class="r" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>`;
  }

  /* ---------- Auswahl-Dialog ---------- */
  let opener = null;
  function renderSheet(){
    $('rsheet').innerHTML = `<div class="grab"></div><h3 class="r-title" id="rTitle">${L('Ansicht wählen','Choose your view')}</h3>
      <p class="r-sub">${L('Wie möchten Sie Goodwill nutzen? Sie können das jederzeit ändern.','How would you like to use Goodwill? You can change this at any time.')}</p>
      <div class="rolepick" role="radiogroup" aria-labelledby="rTitle">${ROLES.map(r => `<button class="rcard${r.id===R.role?' on':''}" type="button" role="radio" aria-checked="${r.id===R.role}" data-role="${r.id}">
        <span class="ric r-${r.icon}">${I[r.icon]}</span>
        <span><b>${esc(rName(r))}</b><small>${esc(en()?r.den:r.dde)}</small></span><span class="rck">${r.id===R.role?I.check:''}</span></button>`).join('')}</div>
      <div class="n-foot"><button type="button" data-a="close">${L('Schließen','Close')}</button></div>`;
  }
  function open(){
    opener = document.activeElement; renderSheet();
    $('rscrim').classList.remove('hidden'); $('rsheet').classList.remove('hidden');
    $('rsheet').scrollTop = 0; $('rsheet').focus({preventScroll:true});
  }
  function close(){
    $('rscrim').classList.add('hidden'); $('rsheet').classList.add('hidden');
    if(opener && opener.focus) opener.focus({preventScroll:true});
  }
  $('rsheet').onclick = e => {
    if(e.target.closest('[data-a=close]')) return close();
    const c = e.target.closest('[data-role]'); if(!c) return;
    R.role = c.dataset.role; save(); render(); close();
    A.state.nav = ['home']; A.show('home', false);
    A.toast(L('Ansicht: ','View: ') + rName(role()));
  };
  $('rscrim').onclick = close;
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && !$('rsheet').classList.contains('hidden')) close(); });

  function render(){ renderHome(); renderRow(); }
  /* Sprache wird per Tippen geändert: danach neu zeichnen */
  let lastLang = LANG;
  document.addEventListener('click', () => setTimeout(() => { if(LANG !== lastLang){ lastLang = LANG; render(); } }, 0));

  render();
  window.GWRole = {open, render, role:() => R.role, set:r => { R.role = r; save(); render(); }, ROLES, I};
})();
