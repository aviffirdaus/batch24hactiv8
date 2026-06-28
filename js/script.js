/* ── Particles canvas ── */
(function () {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let W, H, pts = [];
  const resize = () => { W = canvas.width = innerWidth; H = canvas.height = innerHeight; };
  resize();
  window.addEventListener('resize', resize);
  for (let i = 0; i < 70; i++) pts.push({ x: Math.random() * 9999, y: Math.random() * 9999, r: Math.random() * 1.5 + 0.5, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, a: Math.random() * 0.6 + 0.1 });
  (function loop() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath(); ctx.arc(p.x % W, p.y % H, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(96,165,250,${p.a})`; ctx.fill();
    });
    pts.forEach((a, i) => pts.forEach((b, j) => {
      if (j <= i) return;
      const dx = (a.x % W) - (b.x % W), dy = (a.y % H) - (b.y % H), d = Math.sqrt(dx * dx + dy * dy);
      if (d < 120) { ctx.beginPath(); ctx.moveTo(a.x % W, a.y % H); ctx.lineTo(b.x % W, b.y % H); ctx.strokeStyle = `rgba(59,130,246,${0.15 * (1 - d / 120)})`; ctx.stroke(); }
    }));
    requestAnimationFrame(loop);
  })();
})();

/* ── Typed text ── */
(function () {
  const roles = ['Full-Stack Developer', 'UI/UX Enthusiast', 'Problem Solver', 'Tech Explorer'];
  let ri = 0, ci = 0, del = false;
  const el = document.getElementById('typed');
  setInterval(() => {
    const word = roles[ri];
    if (!del) { el.textContent = word.slice(0, ++ci); if (ci === word.length) { del = true; setTimeout(() => {}, 1200); } }
    else { el.textContent = word.slice(0, --ci); if (ci === 0) { del = false; ri = (ri + 1) % roles.length; } }
  }, del ? 60 : 100);
})();

/* ── Navbar scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('bg-midnight/90', scrollY > 60);
  navbar.classList.toggle('backdrop-blur-lg', scrollY > 60);
  navbar.classList.toggle('shadow-lg', scrollY > 60);
  navbar.classList.toggle('shadow-blue-900/20', scrollY > 60);
});

/* ── Active nav link ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => { l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id); l.classList.toggle('text-blue-300', l.getAttribute('href') === '#' + e.target.id); l.classList.toggle('text-slate-400', l.getAttribute('href') !== '#' + e.target.id); });
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => observer.observe(s));

/* ── Mobile menu ── */
const ham = document.getElementById('hamburger');
const mob = document.getElementById('mobile-menu');
const bars = ham.querySelectorAll('.ham-bar');
ham.addEventListener('click', () => {
  mob.classList.toggle('open');
  bars[0].classList.toggle('rotate-45'); bars[0].classList.toggle('translate-y-2');
  bars[1].classList.toggle('opacity-0');
  bars[2].classList.toggle('-rotate-45'); bars[2].classList.toggle('-translate-y-2');
});
mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { mob.classList.remove('open'); bars.forEach(b => b.classList.remove('rotate-45', 'translate-y-2', 'opacity-0', '-rotate-45', '-translate-y-2')); }));

/* ── Section reveal on scroll ── */
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.12 });
reveals.forEach(r => revealObs.observe(r));

/* ── Skill bars animate ── */
const skillsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.skill-bar').forEach(b => { b.style.width = b.dataset.width + '%'; });
      skillsObs.disconnect();
    }
  });
}, { threshold: 0.5 });
const skillsList = document.getElementById('skills-list');
if (skillsList) skillsObs.observe(skillsList);

/* ── Project filter ── */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => { b.classList.remove('active', 'bg-primary', 'text-white'); b.classList.add('border', 'border-blue-800', 'text-slate-400'); });
    btn.classList.add('active', 'bg-primary', 'text-white'); btn.classList.remove('border', 'border-blue-800', 'text-slate-400');
    const f = btn.dataset.filter;
    projectCards.forEach(c => {
      const show = f === 'all' || c.dataset.category === f;
      c.style.display = show ? '' : 'none';
      if (show) { c.style.opacity = '0'; c.style.transform = 'scale(0.95)'; setTimeout(() => { c.style.transition = 'opacity .3s,transform .3s'; c.style.opacity = '1'; c.style.transform = 'scale(1)'; }, 10); }
    });
  });
});

/* ── Contact form ── */
const form = document.getElementById('contact-form');
const btn  = document.getElementById('submit-btn');
const btnt = document.getElementById('btn-text');
const succ = document.getElementById('success-msg');
form.addEventListener('submit', e => {
  e.preventDefault();
  btn.disabled = true; btnt.textContent = 'Mengirim...';
  btn.querySelector('svg').classList.add('animate-spin');
  setTimeout(() => {
    btn.querySelector('svg').classList.remove('animate-spin');
    btnt.textContent = 'Terkirim!';
    succ.classList.remove('hidden');
    form.reset();
    setTimeout(() => { btn.disabled = false; btnt.textContent = 'Kirim Pesan'; succ.classList.add('hidden'); }, 4000);
  }, 1800);
});

/* ── Back to top ── */
const backTop = document.getElementById('back-top');
window.addEventListener('scroll', () => {
  const show = scrollY > 400;
  backTop.classList.toggle('opacity-100', show); backTop.classList.toggle('opacity-0', !show);
  backTop.classList.toggle('translate-y-0', show); backTop.classList.toggle('translate-y-4', !show);
  backTop.classList.toggle('pointer-events-auto', show); backTop.classList.toggle('pointer-events-none', !show);
});
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── Chatbot ── */
(function () {
  const CHAT_API = 'http://localhost:3000/chat';
  const toggle   = document.getElementById('chat-toggle');
  const window_  = document.getElementById('chat-window');
  const closeBtn = document.getElementById('chat-close-btn');
  const messages = document.getElementById('chat-messages');
  const input    = document.getElementById('chat-input');
  const sendBtn  = document.getElementById('chat-send');
  const iconOpen = document.getElementById('chat-icon-open');
  const iconClose= document.getElementById('chat-icon-close');
  const notifDot = toggle.querySelector('span');
  const chips    = document.getElementById('chat-suggestions');

  let isOpen = false;
  let isLoading = false;
  let history = [];

  function openChat() {
    isOpen = true;
    window_.classList.add('open');
    iconOpen.classList.add('hidden');
    iconClose.classList.remove('hidden');
    if (notifDot) notifDot.remove();
    input.focus();
  }

  function closeChat() {
    isOpen = false;
    window_.classList.remove('open');
    iconOpen.classList.remove('hidden');
    iconClose.classList.add('hidden');
  }

  toggle.addEventListener('click', () => isOpen ? closeChat() : openChat());
  closeBtn.addEventListener('click', closeChat);

  function renderMarkdown(str) {
    let s = str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    s = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(?:^|\n)\* (.*)/g, (_, p) => '<br>• ' + p);
    s = s.replace(/\n/g, '<br>');
    return s;
  }

  function appendBotMessage(text) {
    const wrap = document.createElement('div');
    wrap.className = 'flex items-start gap-2.5 chat-msg-bot';
    wrap.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
      </div>
      <div class="bg-blue-50 border border-blue-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[82%]">
        <p class="chat-bot-text text-gray-800 text-sm leading-relaxed">${renderMarkdown(text)}</p>
      </div>`;
    messages.appendChild(wrap);
    scrollBottom();
  }

  function appendUserMessage(text) {
    const wrap = document.createElement('div');
    wrap.className = 'flex justify-end chat-msg-user';
    wrap.innerHTML = `
      <div class="bg-blue-600 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[82%]">
        <p class="text-white text-sm leading-relaxed">${escHtml(text)}</p>
      </div>`;
    messages.appendChild(wrap);
    scrollBottom();
  }

  function showTyping() {
    const wrap = document.createElement('div');
    wrap.id = 'chat-typing';
    wrap.className = 'flex items-start gap-2.5';
    wrap.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
      </div>
      <div class="bg-blue-50 border border-blue-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
        <span class="chat-typing-dot"></span>
        <span class="chat-typing-dot"></span>
        <span class="chat-typing-dot"></span>
      </div>`;
    messages.appendChild(wrap);
    scrollBottom();
  }

  function removeTyping() {
    const el = document.getElementById('chat-typing');
    if (el) el.remove();
  }

  function scrollBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  function escHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  async function sendMessage(text) {
    if (!text.trim() || isLoading) return;
    if (chips) chips.remove();

    isLoading = true;
    sendBtn.disabled = true;
    input.value = '';

    appendUserMessage(text);
    showTyping();

    try {
      const res = await fetch(CHAT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });
      const data = await res.json();
      removeTyping();

      const reply = res.ok ? data.result : 'Maaf, terjadi kesalahan. Coba lagi ya!';
      appendBotMessage(reply);

      history.push({ role: 'user', text });
      history.push({ role: 'model', text: reply });
      if (history.length > 20) history = history.slice(-20);
    } catch (_) {
      removeTyping();
      appendBotMessage('Koneksi gagal. Pastikan server API sudah berjalan.');
    }

    isLoading = false;
    sendBtn.disabled = false;
    input.focus();
  }

  sendBtn.addEventListener('click', () => sendMessage(input.value));
  input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input.value); } });

  document.querySelectorAll('.chat-chip').forEach(chip => {
    chip.addEventListener('click', () => { openChat(); sendMessage(chip.textContent); });
  });
})();
