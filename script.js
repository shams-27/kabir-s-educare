const courses = [
  { n: "একাডেমিক English ব্যাচ", c: "৪র্থ–দ্বাদশ শ্রেণি (1st & 2nd Paper)", g: ["junior", "mid", "high"], d: ["সপ্তাহে ৩ দিন", "মাসে পরীক্ষা ২টি"], p: "1,000/-", u: "মাসিক (প্রি-পেইড)", f: "ভর্তি ফি: ১,০০০/- (প্রি-পেইড)" },
  { n: "Basic Grammar কোর্স", c: "৬ষ্ঠ–৮ম ও ৯ম–দ্বাদশ শ্রেণি (একত্রে)", g: ["junior", "mid", "high"], d: ["লেকচার ৪০টি", "মোট পরীক্ষা ৫টি"], p: "4,000/-", u: "এককালীন" },
  { n: "Free-Hand Writing কোর্স", c: "৬ষ্ঠ–৮ম ও ৯ম–১১শ শ্রেণি", g: ["junior", "mid", "high"], d: ["লেকচার ৪০টি", "মোট পরীক্ষা ৫টি"], p: "4,000/-", u: "এককালীন" },
  { n: "SSC-English প্রস্তুতি কোর্স", c: "বোর্ড পরীক্ষার পূর্বে ৪ মাস", g: ["mid", "high"], d: ["লেকচার ৭০টি", "মোট পরীক্ষা ১০টি"], p: "6,000/-", u: "এককালীন" },
  { n: "HSC English কোর্স কমপ্লিট", c: "বছরের যে কোনো সময়", g: ["high"], d: ["লেকচার ৭০টি", "মোট পরীক্ষা ১০টি"], p: "6,000/-", u: "এককালীন" },
  { n: "জুনিয়র বৃত্তি প্রস্তুতি কোর্স", c: "৮ম শ্রেণি", g: ["junior", "mid"], d: ["সপ্তাহে ৬ দিন", "সপ্তাহে পরীক্ষা ১টি", "বিষয়: ইং-১, ইং-২, বাং-১, বাং-২, বাবিপ"], p: "2,000/-", u: "মাসিক (প্রি-পেইড)", f: "ভর্তি ফি: ২,০০০/- (প্রি-পেইড)" },
  { n: "বাংলা + বাংলাদেশ ও বিশ্বপরিচয়", c: "৬ষ্ঠ–১০ম শ্রেণি", g: ["junior", "mid", "high"], d: ["সপ্তাহে ২ দিন (শুক্র–শনি)"], p: "700/-", u: "মাসিক (প্রি-পেইড)", f: "ভর্তি ফি: ৫০০/- (প্রি-পেইড)" }];
const grid = document.getElementById('courseGrid'), sel = document.getElementById('courseSel');
const reduceMotion = matchMedia('(prefers-reduced-motion:reduce)').matches;
const bn = t => t.replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);
// keeps the "on" class and aria-selected in sync for any tab group
const selectTab = (group, active) => [...group].forEach(x => { const on = x === active; x.classList.toggle('on', on); x.setAttribute('aria-selected', on) });
function render(f) { grid.innerHTML = courses.filter(c => f === 'all' || c.g.includes(f)).map(c => `<div class="card course"><h3>${c.n}</h3><div class="cls">${c.c}</div><ul>${c.d.map(x => `<li>${x}</li>`).join('')}</ul><div class="price">${bn(c.p)} <small>${c.u}</small></div>${c.f ? `<span class="free">${c.f}</span>` : ''}<a class="btn" href="#admission" data-c="${c.n}">ভর্তি হতে চাই</a></div>`).join('') }
render('all');
sel.innerHTML = courses.map(c => `<option>${c.n}</option>`).join('');
document.getElementById('tabs').onclick = e => { const b = e.target.closest('.tab'); if (!b) return; selectTab(e.currentTarget.children, b); render(b.dataset.f) };
grid.onclick = e => { const a = e.target.closest('[data-c]'); if (a) sel.value = a.dataset.c };
const B = {
  morning: { d: 'শনি–সোম–বুধ  |  রবি–মঙ্গল–বৃহস্পতি', s: ['সকাল ৭:০০–৮:০০', 'সকাল ৮:০০–৯:০০', 'সকাল ৯:৩০–১০:৩০', 'সকাল ১০:৩০–১১:৩০', 'সকাল ১১:৩০–১২:৩০'] },
  evening: { d: 'শনি–সোম–বুধ  |  রবি–মঙ্গল–বৃহস্পতি', s: ['বিকাল ৩:০০–৪:০০', 'বিকাল ৪:০০–৫:০০', 'বিকাল ৫:০০–৬:০০', 'বিকাল ৬:০০–৭:০০', 'সন্ধ্যা ৭:০০–৮:০০'] }
};
function showB(k) { document.getElementById('days').innerHTML = '<svg class="ic" aria-hidden="true"><use href="#i-cal"/></svg> ' + B[k].d; document.getElementById('slots').innerHTML = B[k].s.map(x => `<div class="slot">${x}</div>`).join('') }
showB('morning');
document.querySelectorAll('[data-b]').forEach(b => b.onclick = () => { selectTab(document.querySelectorAll('[data-b]'), b); showB(b.dataset.b) });

/* ===== admission form → WhatsApp ===== */
document.getElementById('form').onsubmit = e => {
  e.preventDefault(); const f = new FormData(e.target);
  const m = `আসসালামু আলাইকুম, আমি ভর্তি হতে চাই।%0Aনাম: ${encodeURIComponent(f.get('name'))}%0Aমোবাইল: ${encodeURIComponent(f.get('phone'))}%0Aকোর্স: ${encodeURIComponent(f.get('course'))}%0Aব্যাচ: ${encodeURIComponent(f.get('batch'))}`;
  const url = 'https://wa.me/8801718784105?text=' + m;
  const w = window.open(url, '_blank');
  // some in-app browsers block window.open, so always offer a manual link
  const fb = document.getElementById('waFb'), link = document.getElementById('waLink');
  if (fb && link) { link.href = url; fb.hidden = false }
  toast(w ? 'WhatsApp খুলছে…' : 'WhatsApp খোলেনি? নিচের লিংকে ক্লিক করুন')
};
function toast(t) { const x = document.getElementById('toast'); x.textContent = t; x.style.display = 'block'; setTimeout(() => x.style.display = 'none', 2500) }

/* ===== mobile menu ===== */
const menu = document.getElementById('menu'), menuBtn = document.getElementById('menuBtn');
menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.setAttribute('aria-controls', 'menu');
const setMenu = o => { menu.classList.toggle('open', o); menuBtn.setAttribute('aria-expanded', o) };
menuBtn.onclick = e => { e.stopPropagation(); setMenu(!menu.classList.contains('open')) };
menu.onclick = e => { if (e.target.closest('a')) setMenu(false) };
document.addEventListener('click', e => { if (!e.target.closest('header')) setMenu(false) });
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false) });
matchMedia('(min-width:1025px)').addEventListener('change', e => { if (e.matches) setMenu(false) });
document.getElementById('yr').textContent = new Date().getFullYear().toLocaleString('bn-BD', { useGrouping: false });

/* ===== stat counters (skip the count-up for reduced motion) ===== */
const io = new IntersectionObserver(es => es.forEach(x => {
  if (!x.isIntersecting) return;
  const el = x.target, n = +el.dataset.n, s = el.dataset.s || '';
  io.unobserve(el);
  if (reduceMotion) { el.textContent = n.toLocaleString('bn-BD') + s; return }
  let i = 0;
  const t = setInterval(() => { i++; el.textContent = (i * n / 30 | 0).toLocaleString('bn-BD') + s; if (i >= 30) clearInterval(t) }, 30);
}));
document.querySelectorAll('[data-n]').forEach(e => io.observe(e));

/* ===== animated English-learning pattern ===== */
(function () {
  const icons = ['book', 'pencil', 'chat', 'exam'];
  const rnd = (a, b) => a + Math.random() * (b - a);
  function fill(box, n, min, max) {
    if (!box) return;
    for (let i = 0; i < n; i++) {
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      el.setAttribute('viewBox', '0 0 24 24'); el.setAttribute('class', 'ic');
      const u = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      u.setAttribute('href', '#i-' + icons[i % icons.length]); el.appendChild(u);
      const t = rnd(30, 48);
      el.style.cssText = `left:${(4 + i * (92 / n) + rnd(-3, 3)).toFixed(1)}%;--s:${rnd(min, max).toFixed(0)}px;--t:${t.toFixed(1)}s;--dl:${(-rnd(0, t)).toFixed(1)}s;--dx:${rnd(-40, 40).toFixed(0)}px;--r0:${rnd(-18, 18).toFixed(0)}deg;--r1:${rnd(-25, 25).toFixed(0)}deg`;
      box.appendChild(el);
    }
  }
  const small = matchMedia('(max-width:700px)').matches;
  fill(document.getElementById('bgfx'), small ? 4 : 7, 28, 44);
  const hf = document.getElementById('heroFx');
  if (hf) { hf.style.setProperty('--h', (hf.parentElement.offsetHeight + 160) + 'px'); fill(hf, small ? 4 : 6, 30, 50) }
  addEventListener('orientationchange', () => setTimeout(() => { if (hf) hf.style.setProperty('--h', (hf.parentElement.offsetHeight + 160) + 'px') }, 300));
  addEventListener('resize', () => { if (hf) hf.style.setProperty('--h', (hf.parentElement.offsetHeight + 160) + 'px') });
})();

/* ===== offer countdown (offer valid before 15 December 2026) =====
   The end date is fixed, so the countdown stays hidden after the offer
   expires instead of restarting for next year. Update it for a new offer. */
(function () {
  const OFFER_END = new Date(2026, 11, 14, 23, 59, 59); // 14 Dec 2026, 11:59:59 PM
  const f = document.getElementById('offerFoot'), t = document.getElementById('offerTxt');
  if (!f || !t) return;
  const now = new Date();
  if (OFFER_END < now) return;
  const d = Math.floor((OFFER_END - now) / 864e5);
  t.textContent = d === 0 ? 'আজই অফারের শেষ দিন!' : 'অফার শেষ হতে আর ' + d.toLocaleString('bn-BD', { useGrouping: false }) + ' দিন বাকি';
  f.hidden = false;
  const ao = document.getElementById('admOffer'), at = document.getElementById('admOfferTxt');
  if (ao && at) { at.textContent = t.textContent; ao.hidden = false }
})();

/* ===== scroll reveal ===== */
const rvIO = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); rvIO.unobserve(x.target) } }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
function reveal(root) {
  (root || document).querySelectorAll('.card,.stat,.slot,section h2,.sub,.eyebrow,.tabs,.days,form label,form .btn,.quote,.contact .btn,.contact p').forEach(el => {
    if (el.classList.contains('rv')) return;
    const i = [...el.parentElement.children].indexOf(el);
    el.style.setProperty('--d', (Math.min(i, 10) * 0.07).toFixed(2) + 's');
    el.classList.add('rv'); rvIO.observe(el);
  });
}
reveal();
['courseGrid', 'slots'].forEach(id => new MutationObserver(() => reveal(document.getElementById(id))).observe(document.getElementById(id), { childList: true }));

/* ===== admission offer card: animate in when scrolled into view ===== */
(function () {
  const c = document.getElementById('admOffer');
  if (!c) return;
  new IntersectionObserver((es, o) => es.forEach(x => {
    if (x.isIntersecting) { x.target.classList.add('show'); o.unobserve(x.target) }
  }), { threshold: .2 }).observe(c);
})();
