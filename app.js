// ===== Profile & Storage =====
let currentProfile = new URLSearchParams(location.search).get('name') || 'Guest';

const Store = {
  key(k) { return 'lr_' + currentProfile + '_' + k; },
  get(k, fallback) {
    const raw = localStorage.getItem(this.key(k));
    if (raw === null) return fallback;
    try { return JSON.parse(raw); } catch { return fallback; }
  },
  set(k, v) { localStorage.setItem(this.key(k), JSON.stringify(v)); },
};

function getLevel() { return Store.get('level', currentProfile === 'Mia' ? 3 : 1); }
function setLevel(n) { Store.set('level', n); }

// ===== App State =====
let state = {
  screen: 'home', mode: null, queue: [], index: 0, score: 0, correct: 0, total: 0,
  dailyCount: Store.get('daily', 0),
  dailyDate: Store.get('date', ''),
  spellingInput: [], spellingWrongCount: 0,
  pendingStickerReveal: null,
};
const today = new Date().toDateString();
if (state.dailyDate !== today) {
  state.dailyCount = 0;
  state.dailyDate = today;
  Store.set('daily', 0);
  Store.set('date', today);
}

// ===== Small helpers =====
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('screen-' + id);
  if (el) { el.classList.add('active'); state.screen = id; }
}
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ===== Level-aware content picking =====
// Draws mostly from the child's current level, with a smaller share from the level below for variety.
function levelPool(items, level) {
  const atLevel = items.filter(i => i.level === level);
  const below = level > 1 ? items.filter(i => i.level === level - 1) : [];
  return { atLevel, below };
}
function levelItems(items, level) {
  const { atLevel, below } = levelPool(items, level);
  return [...atLevel, ...below];
}
function pickForLevel(items, level, count) {
  const { atLevel, below } = levelPool(items, level);
  const belowCount = below.length ? Math.max(1, Math.round(count * 0.2)) : 0;
  const pool = [...shuffle(atLevel), ...shuffle(below).slice(0, belowCount)];
  return shuffle(pool).slice(0, count);
}
function pickDistractors(item, pool) {
  const others = pool.filter(w => w.word !== item.word);
  const sameFirst = others.filter(w => w.word[0] === item.word[0]);
  const sameLen = others.filter(w => w.word.length === item.word.length);
  const candidates = [...shuffle(sameFirst), ...shuffle(sameLen), ...shuffle(others)];
  const seen = new Set([item.word]);
  const result = [];
  for (const c of candidates) {
    if (!seen.has(c.word)) { seen.add(c.word); result.push(c.word); }
    if (result.length === 3) break;
  }
  return result;
}

// ===== Home screen =====
function updateHomeUI() {
  const pct = Math.min((state.dailyCount / 20) * 100, 100);
  document.getElementById('daily-progress').style.width = pct + '%';
  document.getElementById('progress-count').textContent = state.dailyCount + ' word' + (state.dailyCount !== 1 ? 's' : '') + ' today';
  const stars = Store.get('starsTotal', 0);
  const streak = Store.get('streak', 0);
  const statsEl = document.getElementById('home-stats');
  if (statsEl) statsEl.textContent = '⭐ ' + stars + ' stars  ·  🔥 ' + streak + '-day streak';
}
function renderLevelSelect() {
  const level = getLevel();
  document.querySelectorAll('.level-btn').forEach(btn => {
    btn.classList.toggle('active', Number(btn.dataset.level) === level);
  });
}
function updateHomeGreeting() {
  const el = document.getElementById('profile-greeting');
  if (el) el.textContent = 'Hi ' + currentProfile + '! ' + (currentProfile === 'Mia' ? '🍓' : currentProfile === 'Oskar' ? '🐉' : '👋');
}
function applyProfileTheme() {
  const root = document.documentElement;
  if (currentProfile === 'Mia') {
    root.style.setProperty('--accent', '#FF5C8D');
    root.style.setProperty('--accent-light', '#FF8FB3');
  } else if (currentProfile === 'Oskar') {
    root.style.setProperty('--accent', '#2E9E5B');
    root.style.setProperty('--accent-light', '#4CC97F');
  }
}
function goHome() {
  showScreen('home');
  updateHomeGreeting();
  renderLevelSelect();
  updateHomeUI();
}

// ===== Stars, stickers & streaks =====
function registerCorrect(points = 1) {
  state.correct++;
  state.score += points;
  state.dailyCount++;
  document.getElementById('game-score').textContent = '⭐ ' + state.score;
  addLifetimeStars(points);
}
function addLifetimeStars(n) {
  const total = Store.get('starsTotal', 0) + n;
  Store.set('starsTotal', total);
  checkStickerAward(total);
}
function checkStickerAward(total) {
  const owned = Store.get('stickers', []);
  const earned = Math.floor(total / 10);
  let awardedNew = false;
  while (earned > owned.length) {
    owned.push(pickNewSticker(owned));
    awardedNew = true;
  }
  if (awardedNew) {
    Store.set('stickers', owned);
    state.pendingStickerReveal = owned[owned.length - 1];
  }
}
function pickNewSticker(owned) {
  const all = Object.values(STICKER_SETS).flat();
  const unowned = all.filter(s => !owned.includes(s));
  const pool = unowned.length ? unowned : all;
  return pool[Math.floor(Math.random() * pool.length)];
}
function updateStreak() {
  if (state.dailyCount < 10) return;
  const todayStr = new Date().toDateString();
  const lastDay = Store.get('streakLastDay', '');
  if (lastDay === todayStr) return;
  const streak = Store.get('streak', 0);
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const newStreak = lastDay === yesterday ? streak + 1 : 1;
  Store.set('streak', newStreak);
  Store.set('streakLastDay', todayStr);
  checkStreakBonus(newStreak);
}
function checkStreakBonus(streak) {
  if ([3, 5, 10, 30].includes(streak)) {
    const owned = Store.get('stickers', []);
    owned.push(pickNewSticker(owned));
    Store.set('stickers', owned);
    state.pendingStickerReveal = owned[owned.length - 1];
  }
}
function renderStickerBook() {
  const owned = Store.get('stickers', []);
  const ownedSet = new Set(owned);
  const all = Object.values(STICKER_SETS).flat();
  const grid = document.getElementById('sticker-grid');
  grid.innerHTML = '';
  all.forEach(s => {
    const cell = document.createElement('div');
    cell.className = 'sticker-cell' + (ownedSet.has(s) ? ' owned' : '');
    cell.textContent = ownedSet.has(s) ? s : '❓';
    grid.appendChild(cell);
  });
  document.getElementById('sticker-count').textContent = ownedSet.size + ' / ' + all.length + ' stickers found';
}
function flyStar(fromEl) {
  const target = document.getElementById('game-score');
  if (!fromEl || !target) return;
  const fromRect = fromEl.getBoundingClientRect();
  const toRect = target.getBoundingClientRect();
  const star = document.createElement('div');
  star.className = 'flying-star';
  star.textContent = '⭐';
  star.style.left = (fromRect.left + fromRect.width / 2) + 'px';
  star.style.top = (fromRect.top + fromRect.height / 2) + 'px';
  document.body.appendChild(star);
  const dx = (toRect.left + toRect.width / 2) - (fromRect.left + fromRect.width / 2);
  const dy = (toRect.top + toRect.height / 2) - (fromRect.top + fromRect.height / 2);
  star.style.setProperty('--dx', dx + 'px');
  star.style.setProperty('--dy', dy + 'px');
  requestAnimationFrame(() => star.classList.add('fly'));
  setTimeout(() => star.remove(), 700);
}

// ===== Mode dispatch =====
const MODE_TITLES = {
  'sound-detective': '🎧 Sound Detective',
  'phonics': '🔤 Phonics',
  'sentences': '📝 Sentences',
  'spelling': '✏️ Spelling',
  'scramble': '🧩 Sentence Scramble',
  'cloze': '🕳️ Missing Word',
  'rhyme': '🎵 Rhyme Time',
  'flash': '⚡ Flash Words',
  'story': '📚 Story Time',
};

function startMode(mode) {
  state.mode = mode;
  state.score = 0;
  state.correct = 0;
  state.total = 0;
  state.index = 0;
  document.getElementById('game-mode-title').textContent = MODE_TITLES[mode] || mode;
  document.getElementById('game-score').textContent = '⭐ 0';
  const level = getLevel();

  if (mode === 'story') {
    showScreen('game');
    renderStorySelect();
    return;
  }

  if (mode === 'sound-detective') state.queue = pickForLevel(SIGHT_WORDS, level, 10);
  else if (mode === 'phonics') state.queue = pickForLevel(PHONICS_WORDS, level, 10);
  else if (mode === 'sentences') state.queue = pickForLevel(SENTENCES, level, 8);
  else if (mode === 'cloze') state.queue = pickForLevel(CLOZE, level, 8);
  else if (mode === 'rhyme') state.queue = pickForLevel(RHYMES, level, 8);
  else if (mode === 'flash') state.queue = pickForLevel(SIGHT_WORDS, level, 10);
  else if (mode === 'spelling') {
    const range = level === 1 ? [3, 5] : level === 2 ? [4, 7] : [5, 9];
    const pool = levelItems(SIGHT_WORDS, level).filter(w => w.word.length >= range[0] && w.word.length <= range[1]);
    state.queue = shuffle(pool).slice(0, 8);
  } else if (mode === 'scramble') {
    const pool = levelItems(SENTENCES, level).filter(s => s.text.split(' ').length <= 9);
    state.queue = shuffle(pool).slice(0, 8);
  }

  showScreen('game');
  renderQuestion();
}

function renderQuestion() {
  const overlay = document.getElementById('feedback-overlay');
  overlay.classList.remove('show');
  const content = document.getElementById('game-content');
  const controls = document.getElementById('game-controls');
  content.innerHTML = '';
  controls.innerHTML = '';
  if (state.index >= state.queue.length) { showResults(); return; }

  const dots = document.createElement('div');
  dots.className = 'progress-dots';
  for (let i = 0; i < state.queue.length; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i < state.index ? ' done' : i === state.index ? ' current' : '');
    dots.appendChild(d);
  }
  content.appendChild(dots);

  const item = state.queue[state.index];
  if (state.mode === 'sound-detective') renderSoundDetective(item, content, controls);
  else if (state.mode === 'phonics') renderPhonics(item, content, controls);
  else if (state.mode === 'sentences') renderSentence(item, content, controls);
  else if (state.mode === 'spelling') renderSpelling(item, content, controls);
  else if (state.mode === 'scramble') renderScramble(item, content, controls);
  else if (state.mode === 'cloze') renderCloze(item, content, controls);
  else if (state.mode === 'rhyme') renderRhyme(item, content, controls);
  else if (state.mode === 'flash') renderFlash(item, content, controls);
}
function nextQuestion() { state.index++; renderQuestion(); }

// Shared handler for any grid of text options compared against a correct answer string.
function handleOptionAnswer(btn, chosen, correct, grid) {
  const allBtns = grid.querySelectorAll('.option-btn');
  allBtns.forEach(b => b.disabled = true);
  state.total++;
  const isCorrect = chosen === correct;
  if (isCorrect) {
    btn.classList.add('correct');
    flyStar(btn);
    registerCorrect();
  } else {
    btn.classList.add('wrong');
    allBtns.forEach(b => { if (b.textContent === correct) b.classList.add('correct'); });
  }
  const gotSticker = showFeedback(isCorrect);
  setTimeout(nextQuestion, gotSticker ? 2400 : 1400);
  return isCorrect;
}

// ===== Sound Detective (listen & find the word) =====
function renderSoundDetective(item, content, controls) {
  const wrongs = pickDistractors(item, SIGHT_WORDS);
  const options = shuffle([item.word, ...wrongs]);

  const card = document.createElement('div');
  card.className = 'word-card';
  card.innerHTML = '<div class="detective-emoji">' + item.emoji + '</div><div class="word-hint">' + item.hint + '</div>';
  const hearBtn = document.createElement('button');
  hearBtn.className = 'btn-continue';
  hearBtn.textContent = '🔊 Listen';
  hearBtn.addEventListener('click', () => speakText(item.word));
  card.appendChild(hearBtn);
  content.appendChild(card);

  setTimeout(() => speakText(item.word), 300);

  const grid = document.createElement('div');
  grid.className = 'options-grid';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => handleOptionAnswer(btn, opt, item.word, grid));
    grid.appendChild(btn);
  });
  content.appendChild(grid);
}

// ===== Phonics =====
function renderPhonics(item, content, controls) {
  const card = document.createElement('div');
  card.className = 'phonics-card';
  card.innerHTML = '<div style="font-size:48px;margin-bottom:12px">' + item.emoji + '</div><div class="phonics-chunks" id="chunks-display"></div><div class="phonics-full">Tap each part, then press the button</div>';
  content.appendChild(card);
  const chunksDisplay = card.querySelector('#chunks-display');
  item.chunks.forEach(chunk => {
    const span = document.createElement('span');
    span.className = 'phonics-chunk';
    span.textContent = chunk;
    span.addEventListener('click', () => {
      speakText(chunk);
      span.style.transform = 'scale(0.85)';
      setTimeout(() => (span.style.transform = ''), 150);
    });
    chunksDisplay.appendChild(span);
  });
  const contBtn = document.createElement('button');
  contBtn.className = 'btn-continue';
  contBtn.textContent = 'Say it: ' + item.word + ' ' + item.emoji;
  contBtn.addEventListener('click', () => {
    speakText(item.word);
    flyStar(contBtn);
    registerCorrect();
    state.total++;
    const gotSticker = showFeedback(true);
    setTimeout(nextQuestion, gotSticker ? 2400 : 1400);
  });
  controls.appendChild(contBtn);
}

// ===== Sentences =====
function renderSentence(item, content, controls) {
  const card = document.createElement('div');
  card.className = 'sentence-card';
  const emoji = document.createElement('div');
  emoji.className = 'story-page-emoji';
  emoji.textContent = item.emoji;
  card.appendChild(emoji);

  const textDiv = document.createElement('div');
  textDiv.className = 'sentence-text';
  const words = item.text.split(' ');
  const wordSpans = [];
  words.forEach((word, i) => {
    const span = document.createElement('span');
    span.className = 'sentence-word' + (i === 0 ? ' current' : '');
    span.textContent = word + ' ';
    span.addEventListener('click', () => {
      wordSpans.forEach(s => s.classList.remove('current'));
      span.classList.add('read');
      const next = wordSpans[i + 1];
      if (next) next.classList.add('current');
      speakText(word.replace(/[^a-zA-Z']/g, ''));
    });
    textDiv.appendChild(span);
    wordSpans.push(span);
  });
  card.appendChild(textDiv);
  content.appendChild(card);

  const readBtn = document.createElement('button');
  readBtn.className = 'btn-continue';
  readBtn.textContent = '🔊 Read aloud';
  readBtn.addEventListener('click', () => {
    speakText(item.text);
    wordSpans.forEach((s, i) => {
      setTimeout(() => {
        wordSpans.forEach(x => x.classList.remove('current'));
        s.classList.add('current', 'read');
      }, i * 350);
    });
  });
  const doneBtn = document.createElement('button');
  doneBtn.className = 'btn-continue';
  doneBtn.textContent = '✅ I read it!';
  doneBtn.style.marginTop = '8px';
  doneBtn.addEventListener('click', () => {
    flyStar(doneBtn);
    registerCorrect();
    state.total++;
    const gotSticker = showFeedback(true);
    setTimeout(nextQuestion, gotSticker ? 2400 : 1400);
  });
  controls.appendChild(readBtn);
  controls.appendChild(doneBtn);
}

// ===== Spelling =====
function renderSpelling(item, content, controls) {
  state.spellingInput = [];
  state.spellingWrongCount = 0;
  const word = item.word;
  const letters = word.split('');
  speakText(word);

  const hintDiv = document.createElement('div');
  hintDiv.className = 'spelling-target';
  hintDiv.innerHTML = item.emoji + ' <strong>' + item.hint + '</strong>';
  content.appendChild(hintDiv);

  const hearBtn = document.createElement('button');
  hearBtn.className = 'btn-icon-inline';
  hearBtn.textContent = '🔊';
  hearBtn.addEventListener('click', () => speakText(word));
  content.appendChild(hearBtn);

  const display = document.createElement('div');
  display.className = 'spelling-letters-display';
  for (let i = 0; i < word.length; i++) {
    const slot = document.createElement('div');
    slot.className = 'letter-slot';
    slot.id = 'slot-' + i;
    display.appendChild(slot);
  }
  content.appendChild(display);

  const hintTextDiv = document.createElement('div');
  hintTextDiv.className = 'spelling-hint';
  hintTextDiv.id = 'spelling-hint';
  content.appendChild(hintTextDiv);

  const extraLetters = 'abcdefghijklmnopqrstuvwxyz'.split('').filter(l => !letters.includes(l));
  const extras = shuffle(extraLetters).slice(0, Math.max(2, 6 - letters.length));
  const pool = shuffle([...letters, ...extras]);
  const choicesDiv = document.createElement('div');
  choicesDiv.className = 'letter-choices';
  pool.forEach(letter => {
    const btn = document.createElement('button');
    btn.className = 'letter-btn';
    btn.textContent = letter;
    btn.addEventListener('click', () => handleLetterTap(btn, letter, word, display));
    choicesDiv.appendChild(btn);
  });
  content.appendChild(choicesDiv);

  const clearBtn = document.createElement('button');
  clearBtn.className = 'btn-continue';
  clearBtn.textContent = '🔄 Clear';
  clearBtn.style.background = '#eee';
  clearBtn.style.color = '#333';
  clearBtn.style.boxShadow = 'none';
  clearBtn.addEventListener('click', () => resetSpelling(display, choicesDiv));
  controls.appendChild(clearBtn);
}
function handleLetterTap(btn, letter, word, display) {
  if (state.spellingInput.length >= word.length) return;
  btn.disabled = true;
  state.spellingInput.push({ letter, btn });
  const idx = state.spellingInput.length - 1;
  const slot = display.querySelector('#slot-' + idx);
  if (slot) { slot.textContent = letter; slot.classList.add('filled'); }
  if (state.spellingInput.length === word.length) {
    const attempt = state.spellingInput.map(x => x.letter).join('');
    setTimeout(() => checkSpelling(attempt, word, display), 300);
  }
}
function checkSpelling(attempt, word, display) {
  if (attempt === word) {
    registerCorrect();
    state.total++;
    const gotSticker = showFeedback(true);
    setTimeout(nextQuestion, gotSticker ? 2400 : 1500);
  } else {
    state.spellingWrongCount++;
    display.style.transition = 'transform 0.05s';
    let shakes = 0;
    const shake = setInterval(() => {
      display.style.transform = shakes % 2 === 0 ? 'translateX(6px)' : 'translateX(-6px)';
      shakes++;
      if (shakes > 5) { clearInterval(shake); display.style.transform = ''; }
    }, 70);
    const choicesDiv = document.querySelector('.letter-choices');
    resetSpelling(display, choicesDiv);
    if (state.spellingWrongCount >= 2) {
      const hintEl = document.getElementById('spelling-hint');
      if (hintEl) hintEl.textContent = 'Starts with "' + word[0] + '"';
    }
  }
}
function resetSpelling(display, choicesDiv) {
  state.spellingInput = [];
  display.querySelectorAll('.letter-slot').forEach(s => { s.textContent = ''; s.classList.remove('filled'); });
  choicesDiv.querySelectorAll('.letter-btn').forEach(b => b.disabled = false);
}

// ===== Sentence Scramble =====
function renderScramble(item, content, controls) {
  const words = item.text.split(' ');
  state.scrambleBuilt = [];
  const chips = shuffle(words.map((w, i) => ({ word: w, id: i })));

  const emoji = document.createElement('div');
  emoji.className = 'story-page-emoji';
  emoji.textContent = item.emoji;
  content.appendChild(emoji);

  const hearBtn = document.createElement('button');
  hearBtn.className = 'btn-icon-inline';
  hearBtn.textContent = '🔊 Hear the sentence';
  hearBtn.addEventListener('click', () => speakText(item.text));
  content.appendChild(hearBtn);

  const buildRow = document.createElement('div');
  buildRow.className = 'scramble-build-row';
  content.appendChild(buildRow);

  const pool = document.createElement('div');
  pool.className = 'scramble-pool';
  content.appendChild(pool);

  function renderChips() {
    pool.innerHTML = '';
    buildRow.innerHTML = '';
    chips.forEach(c => {
      if (state.scrambleBuilt.includes(c.id)) return;
      const chip = document.createElement('button');
      chip.className = 'scramble-chip';
      chip.textContent = c.word;
      chip.addEventListener('click', () => {
        state.scrambleBuilt.push(c.id);
        renderChips();
        checkScrambleComplete(item, chips, buildRow, renderChips);
      });
      pool.appendChild(chip);
    });
    state.scrambleBuilt.forEach(id => {
      const c = chips.find(x => x.id === id);
      const chip = document.createElement('button');
      chip.className = 'scramble-chip placed';
      chip.textContent = c.word;
      chip.addEventListener('click', () => {
        state.scrambleBuilt = state.scrambleBuilt.filter(x => x !== id);
        renderChips();
      });
      buildRow.appendChild(chip);
    });
    for (let i = state.scrambleBuilt.length; i < words.length; i++) {
      const slot = document.createElement('div');
      slot.className = 'scramble-slot-empty';
      buildRow.appendChild(slot);
    }
  }
  renderChips();
}
function checkScrambleComplete(item, chips, buildRow, renderChips) {
  if (state.scrambleBuilt.length !== chips.length) return;
  const attempt = state.scrambleBuilt.map(id => chips.find(c => c.id === id).word).join(' ');
  setTimeout(() => {
    if (attempt === item.text) {
      flyStar(buildRow);
      registerCorrect();
      state.total++;
      const gotSticker = showFeedback(true);
      setTimeout(nextQuestion, gotSticker ? 2400 : 1400);
    } else {
      buildRow.classList.add('shake');
      speakText(item.text);
      setTimeout(() => {
        buildRow.classList.remove('shake');
        state.scrambleBuilt = [];
        renderChips();
      }, 900);
    }
  }, 300);
}

// ===== Missing Word (cloze) =====
function renderCloze(item, content, controls) {
  const card = document.createElement('div');
  card.className = 'sentence-card';
  const emoji = document.createElement('div');
  emoji.className = 'story-page-emoji';
  emoji.textContent = item.emoji;
  card.appendChild(emoji);
  const textDiv = document.createElement('div');
  textDiv.className = 'sentence-text cloze-text';
  textDiv.textContent = item.text;
  card.appendChild(textDiv);
  content.appendChild(card);

  const grid = document.createElement('div');
  grid.className = 'options-grid';
  shuffle(item.options).forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => {
      if (opt === item.answer) speakText(item.text.replace('___', item.answer));
      handleOptionAnswer(btn, opt, item.answer, grid);
    });
    grid.appendChild(btn);
  });
  content.appendChild(grid);
}

// ===== Rhyme Time =====
function renderRhyme(item, content, controls) {
  const card = document.createElement('div');
  card.className = 'word-card';
  card.innerHTML = '<span class="word-emoji">' + item.emoji + '</span><div class="rhyme-prompt">Which word rhymes with <strong>' + item.prompt + '</strong>?</div>';
  content.appendChild(card);

  const hearBtn = document.createElement('button');
  hearBtn.className = 'btn-icon-inline';
  hearBtn.textContent = '🔊';
  hearBtn.addEventListener('click', () => speakText(item.prompt));
  content.appendChild(hearBtn);

  setTimeout(() => speakText(item.prompt), 300);

  const grid = document.createElement('div');
  grid.className = 'options-grid';
  shuffle(item.options).forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => {
      speakText(opt);
      handleOptionAnswer(btn, opt, item.answer, grid);
    });
    grid.appendChild(btn);
  });
  content.appendChild(grid);
}

// ===== Flash Words =====
function renderFlash(item, content, controls) {
  const level = getLevel();
  const duration = level === 1 ? 1500 : level === 2 ? 1000 : 700;
  state.flashPeeked = false;

  const stage = document.createElement('div');
  stage.className = 'flash-stage';
  content.appendChild(stage);

  function showWord(ms, cb) {
    stage.textContent = item.word;
    stage.classList.add('flash-visible');
    setTimeout(() => {
      stage.classList.remove('flash-visible');
      stage.textContent = '';
      if (cb) cb();
    }, ms);
  }
  function renderFlashOptions() {
    if (!state.flashPeeked) {
      const peekBtn = document.createElement('button');
      peekBtn.className = 'btn-continue';
      peekBtn.textContent = '👁️ Show again';
      peekBtn.addEventListener('click', () => {
        state.flashPeeked = true;
        peekBtn.remove();
        showWord(duration, () => {});
      });
      controls.appendChild(peekBtn);
    }
    const wrongs = pickDistractors(item, SIGHT_WORDS);
    const options = shuffle([item.word, ...wrongs]);
    const grid = document.createElement('div');
    grid.className = 'options-grid';
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        controls.querySelectorAll('.btn-continue').forEach(b => b.remove());
        handleOptionAnswer(btn, opt, item.word, grid);
      });
      grid.appendChild(btn);
    });
    content.appendChild(grid);
  }
  setTimeout(() => showWord(duration, renderFlashOptions), 400);
}

// ===== Story Time =====
function renderStorySelect() {
  const content = document.getElementById('game-content');
  const controls = document.getElementById('game-controls');
  content.innerHTML = '';
  controls.innerHTML = '';
  const level = getLevel();
  const sorted = [...STORIES].sort((a, b) => Math.abs(a.level - level) - Math.abs(b.level - level));
  const wrap = document.createElement('div');
  wrap.className = 'story-select-grid';
  sorted.forEach(story => {
    const card = document.createElement('button');
    card.className = 'story-select-card';
    card.innerHTML = '<span class="story-select-emoji">' + story.emoji + '</span><span class="story-select-title">' + story.title + '</span>';
    card.addEventListener('click', () => startStory(story));
    wrap.appendChild(card);
  });
  content.appendChild(wrap);
}
function startStory(story) {
  state.currentStory = story;
  state.storyPage = 0;
  state.storyQIndex = 0;
  renderStoryPage();
}
function renderStoryPage() {
  const content = document.getElementById('game-content');
  const controls = document.getElementById('game-controls');
  content.innerHTML = '';
  controls.innerHTML = '';
  const story = state.currentStory;
  if (state.storyPage >= story.pages.length) { renderStoryQuestions(); return; }

  const dots = document.createElement('div');
  dots.className = 'progress-dots';
  for (let i = 0; i < story.pages.length; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i < state.storyPage ? ' done' : i === state.storyPage ? ' current' : '');
    dots.appendChild(d);
  }
  content.appendChild(dots);

  const page = story.pages[state.storyPage];
  const card = document.createElement('div');
  card.className = 'sentence-card';
  const emoji = document.createElement('div');
  emoji.className = 'story-page-emoji';
  emoji.textContent = page.emoji;
  card.appendChild(emoji);

  const textDiv = document.createElement('div');
  textDiv.className = 'sentence-text';
  const words = page.text.split(' ');
  const wordSpans = [];
  words.forEach((word, i) => {
    const span = document.createElement('span');
    span.className = 'sentence-word' + (i === 0 ? ' current' : '');
    span.textContent = word + ' ';
    span.addEventListener('click', () => {
      wordSpans.forEach(s => s.classList.remove('current'));
      span.classList.add('read');
      const next = wordSpans[i + 1];
      if (next) next.classList.add('current');
      speakText(word.replace(/[^a-zA-Z']/g, ''));
    });
    textDiv.appendChild(span);
    wordSpans.push(span);
  });
  card.appendChild(textDiv);
  content.appendChild(card);

  const readBtn = document.createElement('button');
  readBtn.className = 'btn-continue';
  readBtn.textContent = '🔊 Read aloud';
  readBtn.addEventListener('click', () => {
    speakText(page.text);
    wordSpans.forEach((s, i) => {
      setTimeout(() => {
        wordSpans.forEach(x => x.classList.remove('current'));
        s.classList.add('current', 'read');
      }, i * 350);
    });
  });
  const nextBtn = document.createElement('button');
  nextBtn.className = 'btn-continue';
  nextBtn.textContent = state.storyPage === story.pages.length - 1 ? 'Finish story ➡️' : 'Next page ➡️';
  nextBtn.addEventListener('click', () => {
    if (state.storyPage === story.pages.length - 1) {
      registerCorrect(2);
      state.total++;
      const gotSticker = showFeedback(true);
      setTimeout(() => { state.storyPage++; renderStoryPage(); }, gotSticker ? 2400 : 1300);
    } else {
      state.storyPage++;
      renderStoryPage();
    }
  });
  controls.appendChild(readBtn);
  controls.appendChild(nextBtn);
}
function renderStoryQuestions() {
  const content = document.getElementById('game-content');
  const controls = document.getElementById('game-controls');
  content.innerHTML = '';
  controls.innerHTML = '';
  const story = state.currentStory;
  if (state.storyQIndex >= story.questions.length) { showResults(); return; }

  const q = story.questions[state.storyQIndex];
  const card = document.createElement('div');
  card.className = 'word-card';
  card.innerHTML = '<div class="story-question">' + q.q + '</div>';
  content.appendChild(card);

  const grid = document.createElement('div');
  grid.className = 'options-grid';
  shuffle(q.options.map((opt, i) => ({ opt, i }))).forEach(({ opt, i }) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.dataset.idx = i;
    btn.addEventListener('click', () => handleStoryAnswer(btn, i, q.answer, grid));
    grid.appendChild(btn);
  });
  content.appendChild(grid);
}
function handleStoryAnswer(btn, chosen, correct, grid) {
  const allBtns = grid.querySelectorAll('.option-btn');
  allBtns.forEach(b => b.disabled = true);
  state.total++;
  const isCorrect = chosen === correct;
  if (isCorrect) {
    btn.classList.add('correct');
    flyStar(btn);
    registerCorrect(2);
  } else {
    btn.classList.add('wrong');
    allBtns.forEach(b => { if (Number(b.dataset.idx) === correct) b.classList.add('correct'); });
  }
  const gotSticker = showFeedback(isCorrect);
  setTimeout(() => { state.storyQIndex++; renderStoryQuestions(); }, gotSticker ? 2400 : 1400);
}

// ===== Feedback =====
const POSITIVE = ['🎉', '🌟', '🥳', '👏', '💫', '🙌', '😄', '🏆', '✨', '🎊'];
const NEGATIVE = ['💪', '🙈', '🤔', '😊', '👍'];
function showFeedback(correct) {
  const overlay = document.getElementById('feedback-overlay');
  const emoji = document.getElementById('feedback-emoji');
  const text = document.getElementById('feedback-text');
  let stickerShown = false;
  if (correct) {
    if (state.pendingStickerReveal) {
      stickerShown = true;
      emoji.textContent = '🎁';
      text.textContent = 'New sticker! ' + state.pendingStickerReveal;
      state.pendingStickerReveal = null;
      overlay.style.background = 'rgba(255,179,0,0.92)';
    } else {
      const msgs = ['Great job!', 'Excellent!', 'You got it!', 'Amazing!', 'Correct!', 'Brilliant!', 'Super!', 'Fantastic!'];
      emoji.textContent = POSITIVE[Math.floor(Math.random() * POSITIVE.length)];
      text.textContent = msgs[Math.floor(Math.random() * msgs.length)];
      overlay.style.background = 'rgba(76,175,80,0.85)';
    }
    launchConfetti();
  } else {
    const msgs = ['Try again!', 'Keep going!', 'Almost!', 'You can do it!'];
    emoji.textContent = NEGATIVE[Math.floor(Math.random() * NEGATIVE.length)];
    text.textContent = msgs[Math.floor(Math.random() * msgs.length)];
    overlay.style.background = 'rgba(239,83,80,0.85)';
  }
  overlay.classList.add('show');
  setTimeout(() => overlay.classList.remove('show'), stickerShown ? 2200 : 1200);
  saveDailyProgress();
  updateStreak();
  return stickerShown;
}

// ===== Results =====
function showResults() {
  document.getElementById('result-correct').textContent = state.correct;
  document.getElementById('result-total').textContent = state.total;
  document.getElementById('result-stars').textContent = state.score;
  const pct = state.total > 0 ? state.correct / state.total : 0;
  let msg;
  if (pct === 1) msg = '🌟 Perfect score! Incredible!';
  else if (pct >= 0.8) msg = '🎉 Really great work!';
  else if (pct >= 0.6) msg = '👍 Good job! Keep practising!';
  else msg = "💪 Keep reading and you'll get there!";

  const bestKey = 'best_' + state.mode;
  const prevBest = Store.get(bestKey, 0);
  if (state.total > 0 && state.score > prevBest) {
    Store.set(bestKey, state.score);
    msg += ' New record! 🏆';
  }
  document.getElementById('results-message').textContent = msg;
  showScreen('results');
  updateHomeUI();
  launchConfetti();
}

// ===== Confetti =====
function launchConfetti() {
  const colors = ['#6c63ff', '#ff9800', '#4caf50', '#ef5350', '#ffd600', '#2196f3', '#e91e63'];
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.cssText = 'left:' + (Math.random() * 100) + 'vw; top:-20px; background:' + colors[Math.floor(Math.random() * colors.length)] + '; width:' + (6 + Math.random() * 8) + 'px; height:' + (6 + Math.random() * 8) + 'px; border-radius:' + (Math.random() > 0.5 ? '50%' : '2px') + '; animation-duration:' + (0.8 + Math.random() * 0.8) + 's; animation-delay:' + (Math.random() * 0.3) + 's;';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1500);
    }, i * 30);
  }
}

// ===== Text-to-Speech =====
function speakText(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.85;
  utter.pitch = 1.1;
  utter.lang = 'en-GB';
  window.speechSynthesis.speak(utter);
}

// ===== Save Daily Progress =====
function saveDailyProgress() {
  Store.set('daily', state.dailyCount);
  Store.set('date', state.dailyDate);
}

// ===== Event Listeners =====
document.querySelectorAll('.mode-card').forEach(card => {
  card.addEventListener('click', () => startMode(card.dataset.mode));
});
document.querySelectorAll('.level-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    setLevel(Number(btn.dataset.level));
    renderLevelSelect();
  });
});
document.getElementById('btn-back').addEventListener('click', goHome);
document.getElementById('btn-play-again').addEventListener('click', () => startMode(state.mode));
document.getElementById('btn-home').addEventListener('click', goHome);
document.getElementById('btn-stickers').addEventListener('click', () => {
  renderStickerBook();
  showScreen('stickers');
});
document.getElementById('btn-stickers-back').addEventListener('click', goHome);

// ===== Service Worker =====
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

// ===== Init =====
applyProfileTheme();
updateHomeGreeting();
renderLevelSelect();
updateHomeUI();
showScreen('home');
