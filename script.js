const courses = ["চতুর্থ শ্রেণি", "পঞ্চম শ্রেণি", "ষষ্ঠ শ্রেণি", "সপ্তম শ্রেণি", "অষ্টম শ্রেণি", "নবম শ্রেণি", "দশম শ্রেণি", "একাদশ শ্রেণি", "ফ্রি হ্যান্ড রাইটিং কোর্স", "ক্যাডেট ভর্তি ইংরেজি (ষষ্ঠ)"];
const sel = document.getElementById('courseSel');
const reduceMotion = matchMedia('(prefers-reduced-motion:reduce)').matches;
// keeps the "on" class and aria-selected in sync for any tab group
const selectTab = (group, active) => [...group].forEach(x => { const on = x === active; x.classList.toggle('on', on); x.setAttribute('aria-selected', on) });
sel.innerHTML = courses.map(n => `<option>${n}</option>`).join('');

/* ===== batch schedule: [time, শনি–সোম–বুধ class, রবি–মঙ্গল–বৃহস্পতি class] ===== */
const DA = 'শনি–সোম–বুধ', DB = 'রবি–মঙ্গল–বৃহ';
const B = {
  morning: [
    ['সকাল ৭:০০ টা', 'অষ্টম শ্রেণি', 'ষষ্ঠ শ্রেণি'],
    ['সকাল ৮:০০ টা', 'নবম শ্রেণি', 'সপ্তম শ্রেণি'],
    ['সকাল ৯:০০ টা', 'দশম শ্রেণি', null],
    ['সকাল ১০:৩০ টা', 'নবম শ্রেণি', 'ষষ্ঠ শ্রেণি'],
    ['সকাল ১১:৪৫ মি.', 'দশম শ্রেণি', null]
  ],
  evening: [
    ['দুপুর ২:০০ টা', 'চতুর্থ শ্রেণি', 'চতুর্থ শ্রেণি'],
    ['বিকাল ৩:০০ টা', 'পঞ্চম শ্রেণি', 'পঞ্চম শ্রেণি'],
    ['বিকাল ৪:০০ টা', 'ষষ্ঠ শ্রেণি', null],
    ['বিকাল ৫:০০ টা', 'সপ্তম শ্রেণি', 'অষ্টম শ্রেণি'],
    ['সন্ধ্যা ৬:০০ টা', 'একাদশ শ্রেণি', 'দশম শ্রেণি'],
    ['রাত ৭:০০ টা', 'ফ্রি হ্যান্ড রাইটিং কোর্স', 'ক্যাডেট ভর্তি ইংরেজি (ষষ্ঠ)']
  ]
};
/* one card per class: each day group is a labelled row with its times (built from B above) */
function showB() {
  const all = [...B.morning, ...B.evening];
  const icon = c => c.startsWith('ফ্রি') ? 'i-pencil' : c.startsWith('ক্যাডেট') ? 'i-award' : 'i-book';
  const NUM = { 'চতুর্থ': '৪', 'পঞ্চম': '৫', 'ষষ্ঠ': '৬', 'সপ্তম': '৭', 'অষ্টম': '৮', 'নবম': '৯', 'দশম': '১০', 'একাদশ': '১১' };
  const bg = c => NUM[c.split(' ')[0]] || (c.startsWith('ফ্রি') ? 'Writing' : c.startsWith('ক্যাডেট') ? 'Cadet' : '');
  const row = (c, k, cls, label) => {
    const times = all.filter(r => r[k] === c).map(r => r[0]);
    return `<div class="cl-r ${cls}"><dt>${label}</dt><dd>${times.length ? times.map(t => `<span>${t}</span>`).join('') : '<span class="none">ক্লাস নেই</span>'}</dd></div>`
  };
  document.getElementById('slots').innerHTML = courses.map((c, n) =>
    `<div class="cl-card" role="listitem" style="--i:${n}">${bg(c) ? `<span class="cl-bg${NUM[c.split(' ')[0]] ? '' : ' word'}" aria-hidden="true">${bg(c)}</span>` : ''}<h3><span class="wg-ic"><svg class="ic" aria-hidden="true"><use href="#${icon(c)}"/></svg></span><span>${c}</span></h3><dl class="cl-rows">${row(c, 1, 'a', DA)}${row(c, 2, 'b', DB)}</dl></div>`
  ).join('')
}
showB();

/* ===== admission form: batch options come from the schedule above ===== */
const batchSel = document.getElementById('batchSel');
function fillBatches() {
  const c = sel.value, out = [];
  [...B.morning, ...B.evening].forEach(([t, a, b]) => {
    if (a === c) out.push(`${t} (${DA})`);
    if (b === c) out.push(`${t} (রবি–মঙ্গল–বৃহস্পতি)`);
  });
  batchSel.innerHTML = out.map(x => `<option>${x}</option>`).join('');
}
sel.onchange = fillBatches;
fillBatches();

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
  fill(document.getElementById('bgfx'), small ? 12 : 24, 28, 44);
  const hf = document.getElementById('heroFx');
  if (hf) { hf.style.setProperty('--h', (hf.parentElement.offsetHeight + 160) + 'px'); fill(hf, small ? 8 : 18, 30, 50) }
  addEventListener('orientationchange', () => setTimeout(() => { if (hf) hf.style.setProperty('--h', (hf.parentElement.offsetHeight + 160) + 'px') }, 300));
  addEventListener('resize', () => { if (hf) hf.style.setProperty('--h', (hf.parentElement.offsetHeight + 160) + 'px') });
})();

/* ===== scroll reveal ===== */
const rvIO = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); rvIO.unobserve(x.target) } }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
function reveal(root) {
  (root || document).querySelectorAll('.card,.stat,.slot,.cl-card,section h2,.sub,.eyebrow,.tabs,.days,form label,form .btn,.quote,.contact .btn,.contact p').forEach(el => {
    if (el.classList.contains('rv')) return;
    const i = [...el.parentElement.children].indexOf(el);
    el.style.setProperty('--d', (Math.min(i, 10) * 0.07).toFixed(2) + 's');
    el.classList.add('rv'); rvIO.observe(el);
  });
}
reveal();
new MutationObserver(() => reveal(document.getElementById('slots'))).observe(document.getElementById('slots'), { childList: true });

/* ===== admission benefit card: animate in when scrolled into view ===== */
(function () {
  const c = document.getElementById('admOffer');
  if (!c) return;
  new IntersectionObserver((es, o) => es.forEach(x => {
    if (x.isIntersecting) { x.target.classList.add('show'); o.unobserve(x.target) }
  }), { threshold: .2 }).observe(c);
})();

/* ===== "Why Kabir's" section: hidden on landing, fades in once the visitor starts scrolling ===== */
(function () {
  const w = document.getElementById('why');
  if (!w) return;
  w.classList.add('scroll-in');
  const check = () => {
    if (scrollY > 10 && w.getBoundingClientRect().top < innerHeight * .85) {
      w.classList.add('show');
      removeEventListener('scroll', check);
    }
  };
  addEventListener('scroll', check, { passive: true });
  check();
})();
