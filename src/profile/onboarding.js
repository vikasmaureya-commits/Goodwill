/* ============ BEGRÜSSUNG: beim ersten Öffnen Rolle wählen ============ */
(function(){
  const $ = id => document.getElementById(id);
  const esc = GWSec.esc;
  const en = () => LANG === 'en';
  const A = window.GWApp, RO = window.GWRole;
  const KEY = 'gw-onboarded-v1';
  if(!RO) return;

  let done = false;
  try{ done = localStorage.getItem(KEY) === '1'; }catch(e){}
  let pick = null;

  function render(){
    const el = $('onboard');
    el.innerHTML = `<div class="ob">
      <div class="ob-top"><span></span><div class="ob-lang" role="radiogroup" aria-label="${L('Sprache','Language')}">
        <button type="button" role="radio" aria-checked="${!en()}" class="${en()?'':'on'}" data-lang-set="de">DE</button>
        <button type="button" role="radio" aria-checked="${en()}" class="${en()?'on':''}" data-lang-set="en">EN</button></div></div>
      <img class="ob-logo" src="${window.GW && GW.LOGO ? GW.LOGO : ''}" alt="Goodwill – Neighbors · Small acts · Bigger tomorrows">
      <h1 id="obTitle">${L('Willkommen bei Goodwill','Welcome to Goodwill')}</h1>
      <p class="ob-sub">${L('Wählen Sie Ihre Rolle. So zeigen wir Ihnen, was für Sie wichtig ist.','Choose your role. Then we show you what matters to you.')}</p>
      <div class="rolepick" role="radiogroup" aria-labelledby="obTitle">${RO.ROLES.map(r => `<button class="rcard${pick===r.id?' on':''}" type="button" role="radio" aria-checked="${pick===r.id}" data-pick="${r.id}">
        <span class="ric r-${r.icon}">${RO.I[r.icon]}</span>
        <span><b>${esc(en()?r.en:r.de)}</b><small>${esc(en()?r.den:r.dde)}</small></span><span class="rck">${pick===r.id?RO.I.check:''}</span></button>`).join('')}</div>
      <button class="ob-go" type="button" data-go ${pick?'':'disabled'}>${L('Weiter','Continue')}</button>
      <p class="ob-note">${L('Sie können Ihre Rolle jederzeit im Profil unter „Ansicht“ ändern.','You can change your role at any time in your profile under “View”.')}</p>
    </div>`;
  }
  function open(){
    pick = null; render();
    $('onboard').classList.remove('hidden');
    document.documentElement.classList.add('ob-open'); document.body.classList.add('ob-open');
    $('onboard').scrollTop = 0;
  }
  function finish(){
    RO.set(pick);
    try{ localStorage.setItem(KEY, '1'); }catch(e){}
    $('onboard').classList.add('hidden');
    document.documentElement.classList.remove('ob-open'); document.body.classList.remove('ob-open');
    A.state.nav = ['home']; A.show('home', false); window.scrollTo(0,0);
  }

  $('onboard').onclick = e => {
    const l = e.target.closest('[data-lang-set]');
    if(l){ if(l.dataset.langSet !== LANG) A.applyLang(l.dataset.langSet); RO.render(); return render(); }
    const p = e.target.closest('[data-pick]');
    if(p){ pick = p.dataset.pick; render(); const g = $('onboard').querySelector('[data-go]'); if(g) g.scrollIntoView({block:'nearest'}); return; }
    if(e.target.closest('[data-go]') && pick) finish();
  };

  if(!done) open();
  window.GWOnboard = {open};
})();
