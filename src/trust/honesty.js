/* ============ EHRLICHKEITS-SYSTEM ============
   Wert 0–100 pro Helfer. Gute Lieferungen erhöhen ihn langsam,
   Probleme senken ihn deutlich schneller (Vertrauen wächst langsam, fällt schnell). */
(function(){
  const $ = id => document.getElementById(id);
  const esc = GWSec.esc;
  const KEY = 'gw-honesty-v1';
  const en = () => LANG === 'en';
  const day = (m,d) => Date.UTC(2026,m,d,12);

  const HELPERS = {
    akash:  {name:'Akash',  ini:'A', since:['14 Mon.','14 mo.'], items:['Äpfel, Eier, Joghurt','Apples, eggs, yoghurt']},
    daniel: {name:'Daniel', img:'A1'},
    sophia: {name:'Sophia', img:'A2'},
    thomas: {name:'Thomas', img:'A3'}
  };
  /* Abzüge pro Problem (Punkte) */
  const PROBLEMS = [
    {k:'missing', pts:5,  de:'Ein Artikel fehlte',                  en:'An item was missing'},
    {k:'damaged', pts:7,  de:'Ware beschädigt oder abgelaufen',     en:'Goods damaged or expired'},
    {k:'wrong',   pts:4,  de:'Falscher Artikel geliefert',          en:'Wrong item delivered'},
    {k:'late',    pts:3,  de:'Deutlich zu spät',                    en:'Much too late'},
    {k:'money',   pts:10, de:'Preis oder Wechselgeld stimmte nicht',en:'Price or change was wrong'},
    {k:'noshow',  pts:12, de:'Helfer ist nicht gekommen',           en:'Helper did not show up'}
  ];
  const PMAP = Object.fromEntries(PROBLEMS.map(p=>[p.k,p]));
  const pName = k => en() ? PMAP[k].en : PMAP[k].de;

  const seed = () => ({
    pending:true, last:null,
    akash: {score:82,n:26,streak:3,hist:[
      {ok:1,ts:day(9,20),dl:2},{ok:1,ts:day(9,13),dl:2},{ok:1,ts:day(9,6),dl:2},
      {ok:0,ts:day(8,29),dl:-3,r:['late']},{ok:1,ts:day(8,22),dl:2}]},
    daniel:{score:94,n:28,streak:12,hist:[]},
    sophia:{score:91,n:21,streak:7,hist:[]},
    thomas:{score:96,n:35,streak:20,hist:[]}
  });
  let S;
  try{ S = JSON.parse(localStorage.getItem(KEY)); }catch(e){ S = null; }
  if(!S || !S.akash || typeof S.akash.score!=='number') S = seed();
  const save = () => { try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} };

  const level = s => s<40 ? {c:'low',de:'Wird geprüft',en:'Under review'}
                   : s<60 ? {c:'mid',de:'Im Aufbau',en:'Building trust'}
                   : s<80 ? {c:'ok', de:'Zuverlässig',en:'Reliable'}
                   : s<92 ? {c:'ok', de:'Sehr zuverlässig',en:'Very reliable'}
                          : {c:'ok', de:'Nachbarschaftsheld',en:'Neighbourhood hero'};
  const lvName = s => { const l=level(s); return en()?l.en:l.de; };
  const bar = (s,size) => `<span class="hbar ${size||''} lv-${level(s).c}" role="img" aria-label="${L('Ehrlichkeit','Honesty')} ${s} / 100"><i style="width:${s}%"></i></span>`;
  const dateStr = ts => new Date(ts).toLocaleDateString(en()?'en-GB':'de-DE',{weekday:'short',day:'numeric',month:'short'});
  const sign = n => n>0 ? '+'+n : n<0 ? '−'+Math.abs(n) : '±0';
  const CHECK = '<svg viewBox="0 0 24 24"><path d="M4.5 12.8l5 5L19.5 7"/></svg>';
  const SHIELD = '<svg viewBox="0 0 24 24"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z"/><path d="M9 12l2 2 4-4"/></svg>';
  const WARN = '<svg viewBox="0 0 24 24"><path d="M12 4l9 16H3L12 4z"/><path d="M12 10v4M12 17v.2"/></svg>';

  /* ---------- Wertung ---------- */
  function rate(id, ok, reasons){
    const h = S[id], old = h.score; let bonus = false;
    if(ok){
      let g = Math.max(1, Math.round((100-old)*0.12));   // je höher der Wert, desto kleiner der Zuwachs
      h.streak++;
      if(h.streak % 5 === 0){ g += 2; bonus = true; }     // Bonus: 5 gute Lieferungen in Folge
      h.score = Math.min(100, old+g);
    } else {
      let p = reasons.reduce((a,k)=>a+PMAP[k].pts, 0);
      const prev = h.hist[0];
      if(prev && !prev.ok) p = Math.round(p*1.5);          // erneutes Problem direkt nach einem Problem
      p = Math.min(20, p);
      h.score = Math.max(0, old-p); h.streak = 0;
    }
    h.n++;
    const dl = h.score - old;
    h.hist.unshift({ok:ok?1:0, ts:Date.now(), dl, r:ok?undefined:reasons});
    h.hist = h.hist.slice(0,8);
    S.pending = false;
    S.last = {id, old, now:h.score, dl, ok, bonus, reasons:reasons||[], review:h.score<40};
    save();
  }

  /* ---------- Dialog ---------- */
  let V = {id:'akash', view:'profile', sel:{}};
  const sheet = () => $('hsheet');
  function open(id, view){
    V = {id, view:view||'profile', sel:{}};
    $('hscrim').classList.remove('hidden'); sheet().classList.remove('hidden');
    renderSheet();
    sheet().focus({preventScroll:true});
  }
  function close(){ $('hscrim').classList.add('hidden'); sheet().classList.add('hidden'); render(); if(window.GWFlow) GWFlow.render(); }

  function avatar(id){
    const m = HELPERS[id];
    return `<span class="hs-av">${m.img ? `<img alt="" src="${GW[m.img]}">` : `<span class="ini">${m.ini}</span>`}<i></i></span>`;
  }
  function renderSheet(){
    const id = V.id, m = HELPERS[id], h = S[id], el = sheet();
    let html = '<div class="grab"></div>';

    if(V.view === 'profile'){
      const lv = level(h.score);
      const stats = [
        [h.n, L('Lieferungen','Deliveries')],
        [m.since ? m.since[en()?1:0] : '–', L('Hilft Ihnen','Helping you')],
        [h.streak, L('Ohne Problem in Folge','In a row, no issues')]
      ];
      html += `<div class="hs-head">${avatar(id)}<div><h3 id="hsT">${esc(m.name)}</h3><span class="lvchip ${lv.c}">${en()?lv.en:lv.de}</span></div></div>
        <div><div class="hs-score"><span class="lab">${L('Ehrlichkeit','Honesty')}</span><b>${h.score}<small>/100</small></b></div>${bar(h.score,'lg')}</div>
        <div class="hs-stats">${stats.map(s=>`<div class="hs-stat"><b>${esc(s[0])}</b><small>${s[1]}</small></div>`).join('')}</div>
        <p class="hs-note">${L('Jede gute Lieferung erhöht den Wert ein wenig. Probleme senken ihn deutlich schneller – so bleibt Vertrauen echt.',
                              'Every good delivery raises the score a little. Problems lower it much faster – so trust stays genuine.')}</p>`;
      if(h.hist.length){
        html += `<div class="hs-hist"><h4>${L('Letzte Lieferungen','Recent deliveries')}</h4>` + h.hist.slice(0,5).map(e=>{
          const txt = e.ok ? L('Alles in Ordnung','All good') : (e.r||[]).map(pName).join(', ');
          return `<div class="hs-ev"><span>${esc(txt)}<small>${dateStr(e.ts)}</small></span><b class="dl ${e.dl>0?'up':e.dl<0?'dn':'zero'}">${sign(e.dl)}</b></div>`;
        }).join('') + '</div>';
      }
      if(id==='akash' && S.pending) html += `<button class="hb primary" type="button" data-a="rate">${SHIELD}${L('Lieferung bewerten','Rate delivery')}</button>`;
      html += `<button class="hb plain" type="button" data-a="close">${L('Schließen','Close')}</button>`;
      if(id==='akash') html += `<div class="hs-demo"><button type="button" data-a="demo-new">${L('Demo: neue Lieferung','Demo: new delivery')}</button><button type="button" data-a="demo-reset">${L('Demo zurücksetzen','Reset demo')}</button></div>`;
    }

    else if(V.view === 'rate'){
      html += `<h3 class="hs-q" id="hsT">${L('Wie war die Lieferung von '+m.name+'?','How was '+m.name+'’s delivery?')}</h3>
        <p class="hs-sub">${esc(m.items[en()?1:0])} · ${L('heute','today')}</p>
        <button class="hb primary" type="button" data-a="ok">${CHECK}${L('Alles in Ordnung','Everything was fine')}</button>
        <button class="hb ghost" type="button" data-a="problem">${WARN}${L('Es gab ein Problem','There was a problem')}</button>
        <button class="hb plain" type="button" data-a="profile">${L('Später','Later')}</button>`;
    }

    else if(V.view === 'problem'){
      const n = Object.keys(V.sel).filter(k=>V.sel[k]).length;
      html += `<h3 class="hs-q" id="hsT">${L('Was ist passiert?','What happened?')}</h3>
        <p class="hs-sub">${L('Sie können mehrere auswählen.','You can choose more than one.')}</p>`
        + PROBLEMS.map(p=>`<button class="hreason ${V.sel[p.k]?'on':''}" type="button" data-a="tog" data-k="${p.k}" aria-pressed="${!!V.sel[p.k]}"><span class="bx">${CHECK}</span>${en()?p.en:p.de}</button>`).join('')
        + `<button class="hb primary" type="button" data-a="send" ${n?'':'disabled'}>${L('Meldung senden','Send report')}</button>
           <button class="hb plain" type="button" data-a="rate">${L('Zurück','Back')}</button>`;
    }

    else if(V.view === 'result'){
      const r = S.last, lv = level(r.now);
      const title = r.ok ? L('Danke!','Thank you!') : L('Danke für Ihre Ehrlichkeit','Thank you for being honest');
      const msg = r.ok
        ? L(m.name+'s Ehrlichkeitswert steigt.', m.name+'’s honesty score goes up.') + (r.bonus ? ' ' + L('Bonus: 5 gute Lieferungen in Folge!','Bonus: 5 good deliveries in a row!') : '')
        : L('Der Wert sinkt, damit andere Nachbarn Bescheid wissen. Goodwill schaut sich Ihre Meldung an.','The score drops so other neighbours know. Goodwill will look into your report.');
      html += `<div class="hs-res"><h3 class="big" id="hsT">${title}</h3><p class="hs-note">${msg}</p>
        <div class="nums"><span>${r.old}</span><span>→</span><b>${r.now}</b><span class="dl ${r.dl>0?'up':r.dl<0?'dn':'zero'}">${sign(r.dl)}</span></div>
        <span id="resBar" style="display:block">${bar(r.old,'lg')}</span>
        <p style="margin-top:10px"><span class="lvchip ${lv.c}">${en()?lv.en:lv.de}</span></p>
        ${r.review ? `<p class="hs-note" style="margin-top:8px">${L('Goodwill prüft diesen Helfer jetzt persönlich.','Goodwill is now reviewing this helper personally.')}</p>` : ''}</div>
        <button class="hb primary" type="button" data-a="profile">${L('Profil ansehen','View profile')}</button>
        <button class="hb plain" type="button" data-a="close">${L('Fertig','Done')}</button>`;
    }

    el.innerHTML = html;
    el.setAttribute('aria-labelledby','hsT');
    if(V.view==='result'){   // Balken sanft vom alten zum neuen Wert
      const i = el.querySelector('#resBar .hbar i'), r = S.last;
      requestAnimationFrame(()=>requestAnimationFrame(()=>{ if(i){ i.style.width = r.now+'%'; i.parentElement.className = 'hbar lg lv-'+level(r.now).c; } }));
    }
  }

  function onSheetClick(e){
    const b = e.target.closest('[data-a]'); if(!b) return;
    const a = b.dataset.a;
    if(a==='close') return close();
    if(a==='profile'){ V.view='profile'; }
    else if(a==='rate'){ V.view='rate'; }
    else if(a==='problem'){ V.view='problem'; V.sel={}; }
    else if(a==='tog'){ V.sel[b.dataset.k] = !V.sel[b.dataset.k]; }
    else if(a==='ok'){ rate(V.id,true); V.view='result'; }
    else if(a==='send'){ const k=Object.keys(V.sel).filter(x=>V.sel[x]); if(!k.length) return; rate(V.id,false,k); V.view='result'; }
    else if(a==='demo-new'){ S.pending=true; save(); }
    else if(a==='demo-reset'){ S=seed(); save(); }
    renderSheet();
    if(a!=='tog') sheet().scrollTop = 0;
  }

  /* ---------- Anzeigen im Rest der App ---------- */
  function renderCard(){
    const h = S.akash, host = $('honReq'); if(!host) return;
    host.innerHTML = S.pending
      ? `<button class="rq" type="button" data-hon="rate"><span class="rq-i alt">${SHIELD}</span><span class="rq-t"><b>${L('Akash hat geliefert','Akash has delivered')}</b><small>${esc(HELPERS.akash.items[en()?1:0])}</small></span><span class="rq-st sent">${L('Bewerten','Rate')}</span><span class="hcard-bar">${bar(h.score,'sm')}<span>${L('Ehrlichkeit','Honesty')} ${h.score}</span></span></button>`
      : `<button class="rq" type="button" data-hon="profile"><span class="rq-i ok">${CHECK}</span><span class="rq-t"><b>${L('Danke für Ihre Bewertung','Thanks for your rating')}</b><small>Akash · ${L('Ehrlichkeit','Honesty')} ${h.score}</small></span><span class="rq-st">${L('Ansehen','View')}</span></button>`;
  }
  function renderRows(){
    document.querySelectorAll('#s-helpers .hrow').forEach(row=>{
      const id = row.dataset.hid; if(!id || !S[id]) return;
      const tx = row.querySelector('.tx'); if(!tx) return;
      let hm = tx.querySelector('.hm');
      if(!hm){ hm = document.createElement('span'); hm.className='hm'; tx.appendChild(hm); }
      hm.innerHTML = bar(S[id].score,'sm') + `<b>${S[id].score}</b>`;
    });
  }
  function render(){
    renderCard(); renderRows();
    if(!sheet().classList.contains('hidden')) renderSheet();
  }

  /* ---------- Verdrahten ---------- */
  ['akash','daniel','sophia','thomas'].forEach((id,i)=>{
    const row = document.querySelectorAll('#s-helpers .hrow')[i];
    if(row){ row.dataset.hid = id; row.onclick = ()=>open(id); }
  });
  $('honReq').onclick = e=>{ const b=e.target.closest('[data-hon]'); if(b) open('akash', b.dataset.hon==='rate'?'rate':'profile'); };
  $('hscrim').onclick = close;
  sheet().onclick = onSheetClick;
  document.addEventListener('keydown', e=>{ if(e.key==='Escape' && !sheet().classList.contains('hidden')) close(); });
  sheet().setAttribute('tabindex','-1');
  render();
  window.GWHon = {render, open, score:id=>S[id].score, pending:()=>!!S.pending};
})();
