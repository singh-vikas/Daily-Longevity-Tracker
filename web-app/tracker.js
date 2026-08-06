/* ============================================================
   🌱 Longevity Quest — data-driven RPG habit tracker
   Personalized to Apr 2026 labs. Clean, gamified, addictive.
   ============================================================ */

const DATA_KEY = 'longevity_quest_data';     // { 'YYYY-MM-DD': { tasks:{id:awardedXp}, metrics:{} } }
const PROG_KEY = 'longevity_quest_progress';  // { totalXP, bestStreak, badges:[] }
const UI_KEY   = 'longevity_quest_ui';        // { dark, collapsed:{morning,afternoon,evening} }

/* ---------- Routine config (mirrors the wall tracker) ---------- */
// tag: 'essential' 🔴 | 'core' | 'optional' ⚪   xp: reward
const ROUTINE = [
  { key:'morning', title:'🌅 Morning', sub:'Circadian Reset & Cognitive Peak', time:'6:00 AM–12:00 PM', cls:'morning-banner', cards:[
    { title:'Circadian Reset & Activation', time:'6:00–6:30 AM', tasks:[
      { id:'no-phone', label:'No phone/screens on waking', xp:10, tag:'core' },
      { id:'get-out-bed', label:'Get out of bed immediately', xp:10, tag:'core' },
      { id:'morning-sunlight', label:'Morning sunlight 5–10 min', xp:15, tag:'core', note:'Bare eyes · sets circadian clock', time:'6:00 AM' },
      { id:'lemon-water', label:'Warm water + lime (500 ml)', xp:10, tag:'core', time:'6:10 AM' },
      { id:'acv', label:'Optional: 1 tbsp apple cider vinegar', xp:5, tag:'optional', time:'6:10 AM' },
      { id:'meditation', label:'Meditation / pranayama 10–15 min', xp:10, tag:'core', time:'6:15 AM' },
      { id:'gratitude', label:'Gratitude journaling (2–3 items)', xp:10, tag:'core', time:'6:15 AM' },
    ]},
    { title:'Exercise & Performance', time:'6:30–7:30 AM', note:'Log all you did — combining is great. Weekly: Resistance ×3 · Zone 2 ×3–4 · HIIT ×1–2.', tasks:[
      { id:'pre-workout', label:'Pre-workout prep (L-Tyrosine optional)', xp:5, tag:'optional', time:'6:30 AM' },
      { id:'strength', label:'Strength training', xp:25, tag:'essential', note:'Muscle + insulin sensitivity · aim ×3/wk', time:'6:40 AM' },
      { id:'zone2', label:'Zone 2 cardio 40–45 min', xp:25, tag:'essential', note:'Raises HDL, lowers TG · aim ×3–4/wk', time:'6:40 AM' },
      { id:'hiit', label:'HIIT / Zone 5 intervals', xp:15, tag:'core', note:'Best lever for low HDL · ×1–2/wk', time:'6:40 AM' },
      { id:'mobility', label:'Light/recovery mobility', xp:5, tag:'optional', time:'6:40 AM' },
      { id:'cooldown', label:'Post-workout cool-down (wait 10–15 min)', xp:5, tag:'core', time:'7:20 AM' },
    ]},
    { title:'Skin Care, Cold & Green Tea', time:'7:30–8:00 AM', tasks:[
      { id:'shower', label:'Shower', xp:5, tag:'core', time:'7:30 AM' },
      { id:'skincare-am', label:'Skin care + sunscreen SPF 30+', xp:10, tag:'core', note:'SPF is the #1 anti-aging step', time:'7:45 AM' },
      { id:'cold-exposure', label:'Cold exposure (2–3×/wk)', xp:5, tag:'optional', note:'NOT right after strength training', time:'7:30 AM' },
      { id:'green-tea-am', label:'Green tea', xp:5, tag:'optional', note:'Keep ≥2 h from the 3:30 PM iron', time:'7:55 AM' },
    ]},
    { title:'Deep Work', time:'8:00–8:45 AM', tasks:[
      { id:'deep-work-am', label:'Deep work session (hardest tasks first)', xp:10, tag:'core', time:'8:00 AM' },
      { id:'phone-away', label:'Phone in another room', xp:5, tag:'optional', time:'8:00 AM' },
    ]},
    { title:'Breakfast', time:'8:45–9:00 AM', note:'~2:45 h after waking · break 16–18 h fast if doing 16:8.', tasks:[
      { id:'breakfast', label:'High-protein breakfast', xp:10, tag:'core', note:'No red meat · salmon Tue/Thu', time:'8:45 AM' },
      { id:'protein-isolate', label:'Protein isolate scoop (+25 g)', xp:20, tag:'essential', note:'Daily — hits the 135 g/day target', time:'8:45 AM' },
      { id:'post-breakfast-walk', label:'Post-breakfast walk 15 min', xp:10, tag:'core', time:'9:00 AM' },
    ]},
    { title:'🌿 Morning Supplements', time:'8:45 AM (with breakfast)', tasks:[
      { id:'supp-vitamin-d', label:'Vitamin D3 50,000 IU (weekly, Sun) 🩺', xp:25, tag:'essential', note:'With fattiest meal · Vit D was 10 ng/mL' },
      { id:'supp-omega3', label:'Omega-3 ~2 g EPA/DHA 🩺', xp:20, tag:'essential', note:'Lowers TG, raises HDL' },
      { id:'supp-creatine', label:'Creatine 5 g', xp:15, tag:'essential', note:'Muscle + strength · any time' },
      { id:'supp-optional-am', label:'Optional: CoQ10 · K2 · Turmeric · NR/NMN · Spermidine', xp:5, tag:'optional', note:'Turmeric away from iron' },
    ]},
    { title:'Deep Work & Cognitive Peak', time:'9:00 AM–12:00 PM', note:'Peak focus window — hardest tasks first, 90-min blocks.', tasks:[
      { id:'deep-work-1', label:'Deep work session 1 (90 min)', xp:10, tag:'core', time:'9:00 AM' },
      { id:'morning-break', label:'Break — stretch, hydrate, 20-20-20', xp:5, tag:'optional', time:'10:30 AM' },
      { id:'deep-work-2', label:'Deep work session 2 (75 min)', xp:10, tag:'core', time:'10:45 AM' },
      { id:'mid-morning-snack', label:'Mid-morning snack (if needed)', xp:5, tag:'optional', time:'11:00 AM' },
    ]},
  ]},
  { key:'afternoon', title:'☀️ Afternoon', sub:'Performance & Maintenance', time:'12:00–6:00 PM', cls:'afternoon-banner', cards:[
    { title:'Lunch & Metabolic Health', time:'12:00–1:00 PM', note:'Psyllium 1 tsp + water 10–15 min before.', tasks:[
      { id:'lunch-psyllium', label:'ACV + psyllium before meal', xp:10, tag:'core', time:'12:15 PM' },
      { id:'lunch', label:'High-protein lunch + veg', xp:10, tag:'core', note:'Foxtail millet not brown rice · EVOO', time:'12:30 PM' },
      { id:'post-lunch-walk', label:'Post-lunch walk 10–15 min', xp:10, tag:'core', time:'12:45 PM' },
      { id:'social-connection', label:'Social connection', xp:5, tag:'optional', note:'Boosts mood · longevity marker', time:'12:45 PM' },
    ]},
    { title:'🌿 Lunch Supplements (optional)', time:'12:30 PM', tasks:[
      { id:'supp-optional-lunch', label:'Optional: K2 · Garlic · B-Complex (Mon/Thu)', xp:5, tag:'optional', note:'Magnesium moved to evening' },
    ]},
    { title:'Sustained Work & Energy', time:'1:00–3:30 PM', tasks:[
      { id:'light-work', label:'Light work/study (email, admin, review)', xp:10, tag:'core', time:'1:00 PM' },
      { id:'green-tea-pm', label:'Green tea (finish ≥90 min before iron)', xp:5, tag:'optional', time:'2:00 PM' },
      { id:'collaborative-work', label:'Collaborative work / study', xp:10, tag:'core', time:'2:15 PM' },
    ]},
    { title:'NSDR & Iron Anchor', time:'3:30–4:00 PM', note:'⚠️ Iron: dairy-free · no tea/coffee within 2 h · not with turmeric/calcium.', tasks:[
      { id:'nsdr', label:'NSDR / Yoga Nidra 10–20 min', xp:15, tag:'core', note:'Before 4 PM · consolidates learning', time:'3:30 PM' },
      { id:'supp-iron', label:'Iron — ferrous bisglycinate 25–50 mg 🩺', xp:25, tag:'essential', note:'Ferritin was 14 ng/mL', time:'3:30 PM' },
      { id:'supp-vitamin-c', label:'Vitamin C 500 mg (with iron)', xp:10, tag:'essential', note:'Doubles iron absorption', time:'3:30 PM' },
      { id:'no-tea-before-iron', label:'No tea/coffee within 2 h of iron', xp:10, tag:'core', time:'3:30 PM' },
      { id:'afternoon-snack', label:'Mid-afternoon snack (dairy-free)', xp:5, tag:'optional', note:'Vit C source with iron', time:'3:50 PM' },
      { id:'supp-ashwagandha', label:'Optional: Ashwagandha 600 mg', xp:5, tag:'optional', note:'Snack OR evening, not both', time:'3:30 PM' },
    ]},
    { title:'Transition & Wrap-Up', time:'4:00–6:00 PM', tasks:[
      { id:'plan-next-day', label:'Plan next day + journal', xp:5, tag:'optional', time:'4:00 PM' },
      { id:'evening-movement', label:'Light stretch / walk / evening workout', xp:10, tag:'core', time:'5:00 PM' },
      { id:'hydration', label:'Hydration 500–750 ml', xp:5, tag:'optional' },
    ]},
  ]},
  { key:'evening', title:'🌙 Evening', sub:'Recovery & Reflection', time:'6:00–9:30 PM', cls:'evening-banner', cards:[
    { title:'Personal Time', time:'6:00–7:00 PM', tasks:[
      { id:'personal-time', label:'Evening review / light reading / plan tomorrow', xp:5, tag:'optional', time:'6:00 PM' },
    ]},
    { title:'Dinner & Family', time:'7:00–8:15 PM', note:'3–4 h before bed. Psyllium before.', tasks:[
      { id:'dinner-psyllium', label:'ACV + psyllium before meal', xp:10, tag:'core', time:'6:45 PM' },
      { id:'dinner', label:'Lighter dinner (no brown rice, no aloo)', xp:10, tag:'core', time:'7:15 PM' },
      { id:'family-time', label:'Family time / play with daughter', xp:10, tag:'core', time:'7:30 PM' },
      { id:'post-dinner-walk', label:'Post-dinner walk 15 min', xp:10, tag:'core', time:'8:00 PM' },
    ]},
    { title:'Skin Care & Wind-Down', time:'8:15–9:00 PM', tasks:[
      { id:'skincare-pm', label:'Skin care (retinol/niacinamide alt)', xp:10, tag:'core', time:'8:15 PM' },
      { id:'digital-sunset', label:'Digital sunset · dim lights', xp:10, tag:'core', note:'No screens 2 h before bed', time:'8:30 PM' },
      { id:'herbal-tea', label:'Herbal tea (chamomile / tulsi)', xp:5, tag:'optional', time:'8:30 PM' },
      { id:'light-reading', label:'Light reading (physical book)', xp:5, tag:'optional', time:'8:30 PM' },
      { id:'journal', label:'Journal & gratitude (3 things)', xp:10, tag:'core', time:'8:30 PM' },
    ]},
    { title:'💊 Supplements & Medication', time:'9:00–10:00 PM', tasks:[
      { id:'supp-magnesium', label:'Magnesium glycinate 400 mg', xp:15, tag:'essential', note:'Sleep + insulin', time:'9:00 PM' },
      { id:'supp-optional-pm', label:'Optional: Ashwagandha · L-Theanine · Melatonin', xp:5, tag:'optional', time:'9:00 PM' },
      { id:'med-statin', label:'Atorvastatin 10 mg — EVERY night 🩺', xp:30, tag:'essential', note:'DAILY, not sporadic · no grapefruit', time:'10:00 PM' },
    ]},
    { title:'Sleep Prep', time:'9:00–9:30 PM', note:'Target bed 9:30–10:00 PM · 7–9 h · consistent wake ±30 min.', tasks:[
      { id:'sleep-env', label:'Cool, dark, quiet · phone out of room', xp:10, tag:'core', time:'9:00 PM' },
      { id:'breathing', label:'Deep breathing / meditation 5–10 min', xp:5, tag:'optional', time:'9:00 PM' },
      { id:'prep-clothes', label:"Prepare tomorrow's clothes", xp:5, tag:'optional', time:'9:15 PM' },
    ]},
  ]},
];

const BADGES = [
  { id:'first-xp', ico:'🌱', name:'First Step', test:(c)=> c.totalXP > 0 },
  { id:'early-riser', ico:'🌅', name:'Early Riser', test:(c)=> c.sectionAllDone('morning') },
  { id:'iron-clad', ico:'🛡️', name:'Iron Clad', test:(c)=> c.has('supp-iron') && c.has('supp-vitamin-c') && c.has('no-tea-before-iron') },
  { id:'on-meds', ico:'💊', name:'Adherent', test:(c)=> c.has('med-statin') },
  { id:'gains', ico:'💪', name:'Gains', test:(c)=> c.has('strength') && c.has('zone2') },
  { id:'zen', ico:'🧘', name:'Zen Master', test:(c)=> c.has('meditation') && c.has('nsdr') && c.has('breathing') },
  { id:'perfect', ico:'⭐', name:'Perfect Day', test:(c)=> c.dayPct >= 100 },
  { id:'streak7', ico:'🔥', name:'Week Warrior', test:(c)=> c.streak >= 7 },
  { id:'streak30', ico:'💯', name:'Unstoppable', test:(c)=> c.streak >= 30 },
  { id:'level5', ico:'⚔️', name:'Level 5', test:(c)=> c.level >= 5 },
  { id:'level10', ico:'👑', name:'Level 10', test:(c)=> c.level >= 10 },
];

/* ---------- flat lookups ---------- */
const ALL_TASKS = [];
ROUTINE.forEach(s => s.cards.forEach(c => c.tasks.forEach(t => ALL_TASKS.push({ ...t, section:s.key, time: t.time || c.time }))));
const TASK_BY_ID = Object.fromEntries(ALL_TASKS.map(t => [t.id, t]));
const TOTAL_TASKS = ALL_TASKS.length;
const ESSENTIALS = ALL_TASKS.filter(t => t.tag === 'essential');
const QUALIFY_PCT = 60;

/* ---------- storage ---------- */
const $ = (s, r=document) => r.querySelector(s);
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const todayStr = () => new Date().toISOString().split('T')[0];

let DATA = load(DATA_KEY, {});
let PROG = load(PROG_KEY, { totalXP: 0, bestStreak: 0, badges: [] });
let UI   = load(UI_KEY, { dark: false, collapsed: { afternoon: true, evening: true } });
let currentDate = todayStr();
let prevLevel = 1;

const dayFor = (d) => (DATA[d] = DATA[d] || { tasks: {}, metrics: {} });
const currentDay = () => dayFor(currentDate);
const isDone = (id) => currentDay().tasks[id] != null;

/* ---------- math ---------- */
function levelInfo(xp) {
  let lvl = 1, need = 200, acc = 0;
  while (xp >= acc + need) { acc += need; lvl++; need = 200 + (lvl - 1) * 100; }
  return { level: lvl, into: xp - acc, need };
}
const comboMult = () => 1 + Math.min(PROG.streak || 0, 10) * 0.1;
function dayPct(d = currentDate) {
  const day = DATA[d]; if (!day) return 0;
  const n = Object.keys(day.tasks).filter(id => id !== '_vitals' && TASK_BY_ID[id]).length;
  return Math.round((n / TOTAL_TASKS) * 100);
}
function qualifies(d) { return dayPct(d) >= QUALIFY_PCT; }
function computeStreak() {
  let s = 0; const base = new Date(currentDate + 'T00:00:00');
  // start today if it qualifies, else start yesterday
  let start = qualifies(currentDate) ? 0 : 1;
  for (let i = start; ; i++) {
    const dt = new Date(base); dt.setDate(dt.getDate() - i);
    const ds = dt.toISOString().split('T')[0];
    if (qualifies(ds)) s++; else break;
    if (i > 400) break;
  }
  PROG.streak = s;
  if (s > (PROG.bestStreak || 0)) PROG.bestStreak = s;
  return s;
}

/* ---------- FX ---------- */
function xpPop(x, y, amount) {
  const el = document.createElement('div');
  el.className = 'xp-pop'; el.textContent = '+' + amount + ' XP';
  el.style.left = x + 'px'; el.style.top = y + 'px';
  $('#fx-layer').appendChild(el); setTimeout(() => el.remove(), 1000);
}
function confetti(n = 40) {
  const emojis = ['✨','🎉','🌟','💪','🔥','⭐','🥳'];
  const layer = $('#fx-layer');
  for (let i = 0; i < n; i++) {
    const c = document.createElement('div');
    c.className = 'confetti'; c.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    c.style.left = Math.random()*100 + 'vw'; c.style.top = '-30px';
    c.style.animationDuration = (1.5 + Math.random()*1.5) + 's';
    c.style.animationDelay = (Math.random()*0.4) + 's';
    layer.appendChild(c); setTimeout(() => c.remove(), 3500);
  }
}
function toast(msg) {
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t); setTimeout(() => t.remove(), 2800);
  if (navigator.vibrate) navigator.vibrate(30);
}
function levelUp(level) {
  $('#lu-level').textContent = 'Lv ' + level;
  const el = $('#levelup'); el.classList.remove('hidden'); confetti(70);
  if (navigator.vibrate) navigator.vibrate([40,40,80]);
  setTimeout(() => el.classList.add('hidden'), 1900);
}

/* ---------- badges ---------- */
function sectionAllDone(key) {
  const ids = ALL_TASKS.filter(t => t.section === key).map(t => t.id);
  return ids.every(id => isDone(id));
}
function checkBadges() {
  const info = levelInfo(PROG.totalXP);
  const ctx = {
    totalXP: PROG.totalXP, streak: PROG.streak, level: info.level, dayPct: dayPct(),
    has: (id) => isDone(id), sectionAllDone
  };
  BADGES.forEach(b => {
    if (!PROG.badges.includes(b.id) && b.test(ctx)) {
      PROG.badges.push(b.id);
      toast('🏅 Badge unlocked: ' + b.ico + ' ' + b.name);
      confetti(30);
    }
  });
}

/* ---------- rendering ---------- */
function taskHTML(t, cardTime) {
  const done = isDone(t.id) ? ' done' : '';
  const time = t.time || cardTime;
  const note = t.note ? `<div class="t-note">${t.note}</div>` : '';
  return `<div class="task tag-${t.tag}${done}" data-id="${t.id}" data-xp="${t.xp}">
    <div class="box"></div>
    <div class="t-main"><div class="t-label">${t.label}</div>${note}</div>
    ${time ? `<div class="t-time">${time}</div>` : ''}
    <div class="t-xp">+${t.xp}</div>
  </div>`;
}
function renderRoutine() {
  const root = $('#routine'); root.innerHTML = '';
  ROUTINE.forEach(sec => {
    const collapsed = !!(UI.collapsed && UI.collapsed[sec.key]);
    const ids = ALL_TASKS.filter(t => t.section === sec.key).map(t => t.id);
    const done = ids.filter(id => isDone(id)).length;
    const pct = Math.round(done / ids.length * 100);
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <div class="section-banner ${sec.cls}" data-section="${sec.key}">
        <div class="sec-head-left">
          <h2>${sec.title} <span class="sec-count">${done}/${ids.length}</span></h2>
          <div class="sec-sub">${sec.time ? sec.time + ' · ' : ''}${sec.sub}</div>
          <div class="sec-progress"><div style="width:${pct}%"></div></div>
        </div>
        <span class="chevron">${collapsed ? '▶' : '▾'}</span>
      </div>
      <div class="sec-cards" data-cards="${sec.key}">
        ${sec.cards.map(card => `
          <div class="subcard${collapsed ? ' sec-collapsed' : ''}">
            <h3 class="card-title">${card.title}${card.time ? ` <span class="card-time">${card.time}</span>` : ''}</h3>
            ${card.note ? `<div class="card-note">${card.note}</div>` : ''}
            ${card.tasks.map(t => taskHTML(t, card.time)).join('')}
          </div>`).join('')}
      </div>`;
    root.appendChild(wrap);
  });
}
function renderHUD() {
  const info = levelInfo(PROG.totalXP);
  $('#level-badge').textContent = 'Lv ' + info.level;
  $('#xp-fill').style.width = Math.round(info.into / info.need * 100) + '%';
  $('#xp-text').textContent = `${info.into} / ${info.need} XP`;
  $('#streak-days').textContent = PROG.streak || 0;
  $('#combo-chip').textContent = '×' + comboMult().toFixed(1);
  $('#today-pct').textContent = dayPct() + '%';
  return info;
}
function renderQuests() {
  const pending = ESSENTIALS.filter(t => !isDone(t.id));
  const list = $('#quests-list');
  $('#quests-sub').textContent = `(${ESSENTIALS.length - pending.length}/${ESSENTIALS.length} essentials)`;
  if (pending.length === 0) {
    list.innerHTML = `<div class="quests-empty">🎉 All essential quests complete — great day!</div>`;
    return;
  }
  list.innerHTML = pending.map(t =>
    `<div class="quest" data-id="${t.id}" data-xp="${t.xp}"><div class="box" style="width:18px;height:18px;border:2px solid var(--muted);border-radius:5px"></div><span class="q-label">${t.label}</span>${t.time ? `<span class="q-time">🕐 ${t.time}</span>` : ''}<span class="q-xp">+${t.xp}</span></div>`
  ).join('');
}
function renderSectionCounts() {
  ROUTINE.forEach(sec => {
    const ids = ALL_TASKS.filter(t => t.section === sec.key).map(t => t.id);
    const done = ids.filter(id => isDone(id)).length;
    const banner = document.querySelector(`.section-banner[data-section="${sec.key}"]`);
    if (!banner) return;
    banner.querySelector('.sec-count').textContent = `${done}/${ids.length}`;
    banner.querySelector('.sec-progress > div').style.width = Math.round(done/ids.length*100) + '%';
  });
}
function renderStats() {
  const info = levelInfo(PROG.totalXP);
  $('#stat-grid').innerHTML = `
    <div class="stat-box"><b>${info.level}</b>Level</div>
    <div class="stat-box"><b>${PROG.totalXP}</b>Total XP</div>
    <div class="stat-box"><b>${PROG.streak||0}</b>Streak 🔥</div>
    <div class="stat-box"><b>${PROG.bestStreak||0}</b>Best streak</div>
    <div class="stat-box"><b>${PROG.badges.length}/${BADGES.length}</b>Badges</div>`;
  $('#badge-grid').innerHTML = BADGES.map(b =>
    `<div class="badge ${PROG.badges.includes(b.id)?'earned':''}"><span class="b-ico">${b.ico}</span>${b.name}</div>`).join('');
  // spark: last 7 days completion
  const days = []; const base = new Date(todayStr()+'T00:00:00');
  for (let i = 6; i >= 0; i--) { const d = new Date(base); d.setDate(d.getDate()-i); const ds = d.toISOString().split('T')[0]; days.push({ ds, pct: dayPct(ds), lbl: ['S','M','T','W','T','F','S'][d.getDay()] }); }
  $('#spark').innerHTML = days.map(d => `<div class="bar" style="height:${Math.max(4, d.pct)}%" title="${d.ds}: ${d.pct}%"><span>${d.lbl}</span></div>`).join('');
}
function renderHistory() {
  const dates = Object.keys(DATA).filter(d => Object.keys(DATA[d].tasks||{}).length).sort().reverse();
  const el = $('#history-list');
  if (!dates.length) { el.innerHTML = '<p class="muted">No history yet — complete some quests!</p>'; return; }
  el.innerHTML = dates.map(d => {
    const pct = dayPct(d);
    const xp = Object.entries(DATA[d].tasks).reduce((s,[k,v]) => s + (typeof v==='number'?v:0), 0);
    return `<div class="hist-item" data-date="${d}"><span>${d}</span><span><span class="muted small">${xp} XP · </span><span class="hist-pct" style="color:${pct>=80?'var(--green)':pct>=50?'var(--morning)':'var(--muted)'}">${pct}%</span></span></div>`;
  }).join('');
}
function renderVitals() {
  const m = currentDay().metrics || {};
  ['sleep-duration','sleep-quality','energy-morning','energy-afternoon','energy-evening','mood','stress'].forEach(k => {
    const el = $('#m-' + k); if (el) el.value = m[camel(k)] ?? '';
  });
  $('#vitals-status').textContent = currentDay().tasks._vitals ? '✓ logged (+15)' : '';
}
const camel = (s) => s.replace(/-([a-z])/g, g => g[1].toUpperCase());

function renderAll() {
  renderRoutine(); renderHUD(); renderQuests(); renderStats(); renderHistory(); renderVitals();
  prevLevel = levelInfo(PROG.totalXP).level;
}

/* ---------- actions ---------- */
function persist() { save(DATA_KEY, DATA); save(PROG_KEY, PROG); }

function toggleTask(id, anchorEl) {
  const t = TASK_BY_ID[id]; if (!t) return;
  const day = currentDay();
  if (day.tasks[id] != null) {                     // uncheck
    PROG.totalXP = Math.max(0, PROG.totalXP - day.tasks[id]);
    delete day.tasks[id];
  } else {                                          // check
    const award = Math.round(t.xp * comboMult());
    day.tasks[id] = award;
    PROG.totalXP += award;
    if (anchorEl) { const r = anchorEl.getBoundingClientRect(); xpPop(r.right - 40, r.top, award); anchorEl.classList.add('pulse'); setTimeout(()=>anchorEl.classList.remove('pulse'),400); }
  }
  computeStreak();
  const info = renderHUD();
  if (info.level > prevLevel) { levelUp(info.level); prevLevel = info.level; }
  checkBadges();
  persist();
  // refresh task states + panels
  document.querySelectorAll(`.task[data-id="${id}"]`).forEach(e => e.classList.toggle('done', isDone(id)));
  renderQuests(); renderSectionCounts(); renderStats(); renderHistory();
  if (dayPct() === 100) confetti(60);
}

function logVitals() {
  const day = currentDay(); const m = day.metrics = day.metrics || {};
  let filled = 0;
  ['sleep-duration','sleep-quality','energy-morning','energy-afternoon','energy-evening','mood','stress'].forEach(k => {
    const v = $('#m-' + k).value; m[camel(k)] = v === '' ? null : parseFloat(v); if (v !== '') filled++;
  });
  const core = m.sleepQuality != null && m.energyMorning != null && m.mood != null;
  if (core && !day.tasks._vitals) {
    const award = Math.round(15 * comboMult()); day.tasks._vitals = award; PROG.totalXP += award;
    toast('📈 Vitals logged +' + award + ' XP'); confetti(18);
    const info = renderHUD(); if (info.level > prevLevel) { levelUp(info.level); prevLevel = info.level; }
    checkBadges();
  }
  $('#vitals-status').textContent = day.tasks._vitals ? '✓ logged (+15)' : (filled ? 'fill sleep/energy/mood for +15' : '');
  computeStreak(); persist(); renderHUD();
}

/* ---------- events ---------- */
document.addEventListener('click', (e) => {
  const task = e.target.closest('.task');
  if (task) { toggleTask(task.dataset.id, task); return; }
  const quest = e.target.closest('.quest');
  if (quest) { toggleTask(quest.dataset.id, quest); return; }
  const banner = e.target.closest('.section-banner');
  if (banner) {
    const key = banner.dataset.section;
    UI.collapsed = UI.collapsed || {}; UI.collapsed[key] = !UI.collapsed[key]; save(UI_KEY, UI);
    banner.querySelector('.chevron').textContent = UI.collapsed[key] ? '▶' : '▾';
    banner.parentElement.querySelectorAll('.subcard').forEach(c => c.classList.toggle('sec-collapsed', UI.collapsed[key]));
    return;
  }
  const collapse = e.target.closest('[data-toggle]');
  if (collapse) {
    const body = $('#' + collapse.dataset.toggle);
    body.classList.toggle('hidden');
    collapse.querySelector('.chevron')?.classList.toggle('collapsed');
    if (collapse.dataset.toggle === 'stats-body') renderStats();
    return;
  }
  const hist = e.target.closest('.hist-item');
  if (hist) { $('#tracker-date').value = hist.dataset.date; currentDate = hist.dataset.date; renderAll(); window.scrollTo({top:0,behavior:'smooth'}); return; }
});

document.addEventListener('change', (e) => {
  if (e.target.closest('.vitals-grid')) logVitals();
});

$('#tracker-date').addEventListener('change', (e) => { currentDate = e.target.value || todayStr(); renderAll(); });
$('#today-btn').addEventListener('click', () => { currentDate = todayStr(); $('#tracker-date').value = currentDate; renderAll(); });
$('#dark-toggle').addEventListener('click', () => {
  UI.dark = !document.body.classList.contains('dark');
  document.body.classList.toggle('dark', UI.dark); save(UI_KEY, UI);
  $('#dark-toggle').textContent = UI.dark ? '☀️' : '🌙';
});
$('#export-btn').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify({ data: DATA, progress: PROG }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = `longevity_quest_${todayStr()}.json`; a.click(); URL.revokeObjectURL(a.href);
  toast('⬇ Data exported');
});
$('#import-file').addEventListener('change', (e) => {
  const f = e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = (ev) => {
    try {
      const j = JSON.parse(ev.target.result);
      if (j.data) DATA = j.data; if (j.progress) PROG = j.progress;
      persist(); computeStreak(); renderAll(); toast('⬆ Data imported');
    } catch { toast('❌ Invalid file'); }
    e.target.value = '';
  };
  r.readAsText(f);
});

/* ---------- init ---------- */
function init() {
  if (UI.dark) { document.body.classList.add('dark'); $('#dark-toggle').textContent = '☀️'; }
  currentDate = todayStr();
  $('#tracker-date').value = currentDate;
  computeStreak();
  renderAll();
}
init();
