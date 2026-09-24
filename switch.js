/* Version switcher: tabs swap the phone in place. Without JS all three panels stay visible (see .js rules in site.css). */
(function () {
  var tabs = [].slice.call(document.querySelectorAll('.tab'));
  var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
  var cur = tabs.findIndex(function (t) { return t.getAttribute('aria-selected') === 'true'; });

  function show(i, focus) {
    if (i === cur) return;
    var dir = i > cur ? 1 : -1;
    tabs.forEach(function (t, k) {
      var on = k === i;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      panels[k].classList.toggle('on', on);
      panels[k].classList.toggle('from-left', !on && k < i);
      panels[k].inert = !on;
    });
    panels[i].style.setProperty('--dir', dir);
    cur = i;
    if (focus) tabs[i].focus();
  }

  panels.forEach(function (p, k) { p.inert = k !== cur; if (k < cur) p.classList.add('from-left'); });
  tabs.forEach(function (t, k) {
    t.addEventListener('click', function () { show(k, false); });
    t.addEventListener('keydown', function (e) {
      var n = tabs.length, j = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (k + 1) % n;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (k - 1 + n) % n;
      if (e.key === 'Home') j = 0;
      if (e.key === 'End') j = n - 1;
      if (j !== null) { e.preventDefault(); show(j, true); }
    });
  });

  /* swipe the phone */
  var stage = document.querySelector('.stage'), x0 = null, y0 = null;
  stage.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, {passive: true});
  stage.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) show(Math.max(0, Math.min(tabs.length - 1, cur + (dx < 0 ? 1 : -1))), false);
    x0 = null;
  }, {passive: true});
})();
