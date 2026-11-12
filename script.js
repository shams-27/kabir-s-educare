const courses = ["চতুর্থ শ্রেণি", "পঞ্চম শ্রেণি", "ষষ্ঠ শ্রেণি", "সপ্তম শ্রেণি", "অষ্টম শ্রেণি", "নবম শ্রেণি", "দশম শ্রেণি", "একাদশ শ্রেণি", "ফ্রি হ্যান্ড রাইটিং কোর্স", "ক্যাডেট ভর্তি ইংরেজি (ষষ্ঠ)"];
const sel = document.getElementById('courseSel');
const reduceMotion = matchMedia('(prefers-reduced-motion:reduce)').matches;
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
const ALL = [...B.morning, ...B.evening];

/* one block per class, colours rotate paper / ink / red; the last 2 are wide */
function showB() {
  const NUM = { 'চতুর্থ': '৪', 'পঞ্চম': '৫', 'ষষ্ঠ': '৬', 'সপ্তম': '৭', 'অষ্টম': '৮', 'নবম': '৯', 'দশম': '১০', 'একাদশ': '১১' };
  const big = c => NUM[c.split(' ')[0]] || (c.startsWith('ফ্রি') ? 'Writing' : c.startsWith('ক্যাডেট') ? 'Cadet' : '');
  const row = (c, k, label) => {
    const times = ALL.filter(r => r[k] === c).map(r => r[0]);
    if (!times.length) return '';   // no class on these days: leave the whole row out
    return `<div class="cl-r"><dt>${label}</dt><dd>${times.map(t => `<span>${t}</span>`).join('')}</dd></div>`;
  };
  document.getElementById('slots').innerHTML = courses.map((c, n) =>
    `<div class="cl k${n % 3}" role="listitem">` +
    `<span class="cl-num${NUM[c.split(' ')[0]] ? '' : ' word'}" aria-hidden="true">${big(c)}</span>` +
    `<h3>${c}</h3>` +
`<dl class="cl-rows">${row(c, 1, DA)}${row(c, 2, DB)}</dl></div>`
  ).join('');
}
showB();

/* ===== admission form: batch options come from the schedule above ===== */
const batchSel = document.getElementById('batchSel');
function fillBatches() {
  const c = sel.value, out = [];
  ALL.forEach(([t, a, b]) => {
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
  toast(w ? 'WhatsApp খুলছে…' : 'WhatsApp খোলেনি? নিচের লিংকে ক্লিক করুন');
};
let toastTimer;
function toast(t) {
  const x = document.getElementById('toast');
  x.textContent = t; x.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => x.classList.remove('show'), 2500);
}

/* ===== mobile menu ===== */
const menu = document.getElementById('menu'), menuBtn = document.getElementById('menuBtn');
menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.setAttribute('aria-controls', 'menu');
const setMenu = o => { menu.classList.toggle('open', o); menuBtn.setAttribute('aria-expanded', o) };
menuBtn.onclick = e => { e.stopPropagation(); setMenu(!menu.classList.contains('open')) };
menu.onclick = e => { if (e.target.closest('a')) setMenu(false) };
document.addEventListener('click', e => { if (!e.target.closest('.appbar')) setMenu(false) });
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false) });
matchMedia('(min-width:961px)').addEventListener('change', e => { if (e.matches) setMenu(false) });
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

/* ===== scroll reveal ===== */
const rvIO = new IntersectionObserver(es => es.forEach(x => {
  if (!x.isIntersecting) return;
  const el = x.target; el.classList.add('in'); rvIO.unobserve(el);
  setTimeout(() => { el.classList.remove('rv', 'in'); el.style.removeProperty('--d') }, 1200);
}), { threshold: .08, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.blk,.cl,.sec').forEach(el => {
  const i = [...el.parentElement.children].indexOf(el);
  el.style.setProperty('--d', (Math.min(i, 8) * 0.05).toFixed(2) + 's');
  el.classList.add('rv'); rvIO.observe(el);
});

/* ===== seamless marquee: duplicate the track content once ===== */
const tk = document.getElementById('tk');
if (tk && !reduceMotion) {
  const base = tk.innerHTML;
  /* each half must be at least as wide as the screen, or a gap shows before the loop restarts */
  const build = () => {
    tk.innerHTML = base;
    const half = base.repeat(Math.max(1, Math.ceil(innerWidth * 1.1 / tk.offsetWidth)));
    tk.innerHTML = half + half;
  };
  build();
  document.fonts && document.fonts.ready.then(build);
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(build, 200) });
}


/* ===== "এক নজরে" list: hover / tap to tick items ===== */
document.querySelectorAll('.glance .lst li').forEach((li, i) => {
  li.style.setProperty('--i', i);
  li.tabIndex = 0; li.setAttribute('role', 'button'); li.setAttribute('aria-pressed', 'false');
  const toggle = () => li.setAttribute('aria-pressed', li.classList.toggle('on'));
  li.addEventListener('click', toggle);
  li.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle() } });
});
