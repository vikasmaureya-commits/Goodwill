(() => {
  const send = ev => {
    try { navigator.sendBeacon('/__live', JSON.stringify(ev)); } catch (e) {}
  };
  const short = (s, n = 60) => (s || '').replace(/\s+/g, ' ').trim().slice(0, n);

  // Screen changes: the visible <section id="s-..."> (or element) without .hidden
  const screens = [...document.querySelectorAll('[id^="s-"]')];
  let current = null;
  const checkScreen = () => {
    const vis = screens.find(el => !el.classList.contains('hidden'));
    const name = vis ? vis.id.slice(2) : null;
    if (name && name !== current) { current = name; send({ kind: 'screen', text: name }); }
  };
  screens.forEach(el => new MutationObserver(checkScreen).observe(el, { attributes: true, attributeFilter: ['class'] }));

  // Toasts
  const toastEl = document.getElementById('toast');
  if (toastEl) new MutationObserver(() => {
    if (!toastEl.classList.contains('hidden')) send({ kind: 'toast', text: short(toastEl.textContent, 120) });
  }).observe(toastEl, { attributes: true, childList: true, characterData: true, subtree: true });

  // Taps
  document.addEventListener('click', e => {
    const el = e.target.closest('button, a, [data-tab], [onclick], [role="button"], label, .tab') || e.target;
    const label = short(el.getAttribute('aria-label') || el.textContent) || el.id || el.tagName.toLowerCase();
    const where = el.id ? `#${el.id}` : (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : '');
    send({ kind: 'tap', text: label, where, screen: current });
  }, true);

  // Typed input (on change, not every key)
  document.addEventListener('change', e => {
    const el = e.target;
    if (!el.matches('input, textarea, select')) return;
    const name = el.id || el.name || el.placeholder || el.type;
    const value = el.type === 'checkbox' || el.type === 'radio' ? String(el.checked) : short(el.value, 80);
    send({ kind: 'input', text: `${short(name, 30)} = ${value}`, screen: current });
  }, true);

  // Saved data
  const setItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function (k, v) {
    send({ kind: 'data', text: `${k} saved (${String(v).length} chars)` });
    return setItem.call(this, k, v);
  };

  // Errors
  window.addEventListener('error', e => send({ kind: 'error', text: short(`${e.message} (line ${e.lineno})`, 160) }));
  window.addEventListener('unhandledrejection', e => send({ kind: 'error', text: short(String(e.reason), 160) }));

  // Live reload when index.html changes
  try { new EventSource('/__reload').onmessage = () => location.reload(); } catch (e) {}

  send({ kind: 'load', text: `app opened (${innerWidth}x${innerHeight})` });
  checkScreen();
})();
