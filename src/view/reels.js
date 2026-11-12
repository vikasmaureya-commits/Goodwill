/* Ansicht: Vollbild-Videos zum Durchwischen (wie Reels).
   Clips von mixkit.co (Mixkit Free License), lokal in assets/videos – so bleibt die CSP bei 'self'.
   Texte stehen auf Deutsch im DOM; Englisch kommt über DICT in i18n.js (translateDOM). */
(function(){
  const $ = id => document.getElementById(id);
  const VIDEOS = [
    {id:'33694', who:'Hilfe im Alltag', text:'Ein Stück Weg gemeinsam – Hilfe, die ankommt.'},
    {id:'33012', who:'Tierschutz', text:'Dieser Hund braucht ein Zuhause. Tierheime in Ihrer Nähe helfen.'},
    {id:'33076', who:'Umwelt', text:'Freiwillige räumen das Flussufer auf – jede Hand zählt.'},
    {id:'33658', who:'Ehrenamt', text:'Ein Brot, ein Lächeln – so einfach kann Helfen sein.'},
    {id:'6226',  who:'Hilfe gesucht', text:'Manchmal fällt es schwer, um Hilfe zu bitten. Schauen Sie hin.'},
    {id:'49157', who:'Rettung', text:'Einsatzkräfte helfen, wenn jede Minute zählt.'},
    {id:'47446', who:'Tierschutz', text:'Im Tierheim warten viele Tiere auf einen Menschen wie Sie.'},
    {id:'21908', who:'Umwelt', text:'Ein sauberer Strand beginnt mit einem einzigen Müllsack.'}
  ];
  const ACTS =
    '<button type="button" data-a="like" aria-pressed="false"><svg viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z"/></svg><span>Gefällt mir</span></button>' +
    '<button type="button" data-a="share"><svg viewBox="0 0 24 24"><path d="M21 3L3 10.5l7 2.5 2.5 7L21 3z"/><path d="M10 13l11-10"/></svg><span>Teilen</span></button>' +
    '<button type="button" data-a="sub" aria-pressed="false"><svg viewBox="0 0 24 24"><circle cx="10" cy="8" r="3.6"/><path d="M3 20c.7-3.7 3.4-5.6 7-5.6 1.3 0 2.5.3 3.5.7"/><path d="M18 13v6M15 16h6"/></svg><span>Abonnieren</span></button>';

  const feed = $('reels'), sound = $('reelSound');
  const calm = matchMedia('(prefers-reduced-motion:reduce)').matches; // dann kein Autoplay, Antippen startet
  let muted = true, saved = {};
  try{ saved = JSON.parse(localStorage.getItem('gw-reels-v1')) || {}; }catch(e){}
  const keep = () => { try{ localStorage.setItem('gw-reels-v1', JSON.stringify(saved)); }catch(e){} };

  function sync(){
    feed.querySelectorAll('.reel').forEach(el => [['like','like:'+el.dataset.id],['sub','sub:'+el.dataset.who]].forEach(([a,k]) => {
      const b = el.querySelector(`[data-a="${a}"]`); b.classList.toggle('on', !!saved[k]); b.setAttribute('aria-pressed', String(!!saved[k]));
    }));
  }
  const io = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target.querySelector('video');
    if(e.isIntersecting && !calm){ v.muted = muted; v.play().catch(()=>{}); } else v.pause();
  }), {root:feed, threshold:.6});

  function card(v){
    const el = document.createElement('article');
    el.className = 'reel'; el.dataset.id = v.id; el.dataset.who = v.who;
    el.innerHTML = '<video playsinline loop muted preload="none"></video><div class="rl-cap"><b></b><p></p></div><div class="rl-acts">'+ACTS+'</div>';
    el.querySelector('video').src = v.src || 'assets/videos/'+v.id+'.mp4';
    el.querySelector('b').textContent = v.who; el.querySelector('p').textContent = v.text;
    io.observe(el);
    return el;
  }
  VIDEOS.forEach(v => feed.append(card(v)));
  sync();

  feed.onclick = e => {
    const el = e.target.closest('.reel'); if(!el) return;
    const b = e.target.closest('[data-a]'), v = el.querySelector('video');
    if(!b){ v.muted = muted; if(v.paused) v.play().catch(()=>{}); else v.pause(); return; } // Antippen: Pause / Weiter
    if(b.dataset.a === 'share'){
      const text = el.dataset.who+': '+el.querySelector('p').textContent+' – Goodwill';
      if(navigator.share) navigator.share({text}).catch(()=>{});
      else if(navigator.clipboard) navigator.clipboard.writeText(text).then(() => GWApp.toast(L('Text kopiert – jetzt einfügen und teilen.','Text copied – paste it to share.')), () => {});
      return;
    }
    const k = b.dataset.a === 'like' ? 'like:'+el.dataset.id : 'sub:'+el.dataset.who;
    if(saved[k]) delete saved[k]; else saved[k] = 1;
    keep(); sync();
  };
  sound.onclick = () => {
    muted = !muted; sound.classList.toggle('on', !muted); sound.setAttribute('aria-pressed', String(!muted));
    feed.querySelectorAll('video').forEach(v => v.muted = muted);
  };

  $('reelPost').onclick = () => $('reelFile').click();
  $('reelFile').onchange = e => {
    const f = e.target.files[0]; e.target.value = '';
    if(!f) return;
    if(!f.type.startsWith('video/')) return GWApp.toast(L('Bitte wählen Sie eine Videodatei.','Please choose a video file.'));
    // shortcut: das Video bleibt nur in diesem Tab (blob-URL) und ist nach dem Neuladen weg; mit einem Server durch echten Upload ersetzen
    feed.prepend(card({id:'own'+Date.now(), who:'Ihr Video', text:'Gerade von Ihnen gepostet.', src:URL.createObjectURL(f)}));
    sync(); feed.scrollTo({top:0});
    if(LANG === 'en') GWApp.applyLang('en'); // übersetzt die neue Karte
    GWApp.toast(L('Ihr Video ist jetzt in der Ansicht.','Your video is now in the feed.'));
  };
})();
