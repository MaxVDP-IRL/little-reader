// ===== Data =====
const SIGHT_WORDS = [
  { word: 'the',  hint: 'Most common word!', emoji: '👑' },
  { word: 'and',  hint: 'Joins two things',  emoji: '🔗' },
  { word: 'a',    hint: 'One of something',  emoji: '1️⃣' },
  { word: 'to',   hint: 'Going somewhere',   emoji: '➡️' },
  { word: 'is',   hint: 'Something exists',  emoji: '✅' },
  { word: 'in',   hint: 'Inside something',  emoji: '📦' },
  { word: 'it',   hint: 'A thing nearby',    emoji: '👆' },
  { word: 'you',  hint: 'The person reading!',emoji: '🫵' },
  { word: 'he',   hint: 'A boy or man',      emoji: '👦' },
  { word: 'she',  hint: 'A girl or woman',   emoji: '👧' },
  { word: 'was',  hint: 'Happened before',   emoji: '⏪' },
  { word: 'are',  hint: 'More than one is',  emoji: '👥' },
  { word: 'at',   hint: 'A place or time',   emoji: '📍' },
  { word: 'be',   hint: 'To exist',          emoji: '🌟' },
  { word: 'this', hint: 'Right here!',       emoji: '👇' },
  { word: 'have', hint: 'Own something',     emoji: '🤲' },
  { word: 'from', hint: 'Where it started',  emoji: '🏠' },
  { word: 'or',   hint: 'A choice',          emoji: '⚖️' },
  { word: 'one',  hint: 'The number 1',      emoji: '☝️' },
  { word: 'had',  hint: 'Owned before',      emoji: '📜' },
  { word: 'by',   hint: 'Next to or made by',emoji: '🤝' },
  { word: 'but',  hint: 'However…',          emoji: '🔄' },
  { word: 'not',  hint: 'No, opposite',      emoji: '❌' },
  { word: 'all',  hint: 'Every single one',  emoji: '💯' },
  { word: 'were', hint: 'They existed',      emoji: '👣' },
  { word: 'can',  hint: 'Able to do it',     emoji: '💪' },
  { word: 'said', hint: 'Spoke words',       emoji: '💬' },
  { word: 'see',  hint: 'Use your eyes',     emoji: '👀' },
  { word: 'get',  hint: 'Go and get it',     emoji: '🙌' },
  { word: 'like', hint: 'To enjoy',          emoji: '❤️' },
];

const PHONICS_WORDS = [
  { word: 'cat',   chunks: ['c','at'],     emoji: '🐱' },
  { word: 'dog',   chunks: ['d','og'],     emoji: '🐶' },
  { word: 'sun',   chunks: ['s','un'],     emoji: '☀️' },
  { word: 'hat',   chunks: ['h','at'],     emoji: '🎩' },
  { word: 'big',   chunks: ['b','ig'],     emoji: '🐘' },
  { word: 'red',   chunks: ['r','ed'],     emoji: '🍎' },
  { word: 'cup',   chunks: ['c','up'],     emoji: '☕' },
  { word: 'pen',   chunks: ['p','en'],     emoji: '✒️' },
  { word: 'hop',   chunks: ['h','op'],     emoji: '🐸' },
  { word: 'mud',   chunks: ['m','ud'],     emoji: '🌧️' },
  { word: 'ship',  chunks: ['sh','ip'],    emoji: '🚢' },
  { word: 'chin',  chunks: ['ch','in'],    emoji: '😊' },
  { word: 'thin',  chunks: ['th','in'],    emoji: '📏' },
  { word: 'when',  chunks: ['wh','en'],    emoji: '❓' },
  { word: 'frog',  chunks: ['fr','og'],    emoji: '🐸' },
  { word: 'clap',  chunks: ['cl','ap'],    emoji: '👏' },
  { word: 'snap',  chunks: ['sn','ap'],    emoji: '🫰' },
  { word: 'trip',  chunks: ['tr','ip'],    emoji: '🚶' },
  { word: 'blue',  chunks: ['bl','ue'],    emoji: '🔵' },
  { word: 'play',  chunks: ['pl','ay'],    emoji: '🎮' },
  { word: 'cake',  chunks: ['c','a','ke'], emoji: '🎂' },
  { word: 'bike',  chunks: ['b','i','ke'], emoji: '🚲' },
  { word: 'home',  chunks: ['h','o','me'], emoji: '🏠' },
  { word: 'smile', chunks: ['sm','i','le'],emoji: '😄' },
];

const SENTENCES = [
  { text: 'The cat sat on the mat.',         emoji: '🐱' },
  { text: 'A big red dog ran fast.',          emoji: '🐕' },
  { text: 'She can see the blue sky.',        emoji: '🌤️' },
  { text: 'He had a hat and a bag.',          emoji: '🎩' },
  { text: 'The sun is hot today.',            emoji: '☀️' },
  { text: 'I like to eat cake.',              emoji: '🎂' },
  { text: 'We can play and have fun.',        emoji: '🎉' },
  { text: 'The frog can hop and jump.',       emoji: '🐸' },
  { text: 'My dog likes to run and play.',   emoji: '🐶' },
  { text: 'She said the bird can fly.',       emoji: '🐦' },
  { text: 'He is not at home today.',         emoji: '🏠' },
  { text: 'All the kids like to read.',       emoji: '📚' },
  { text: 'Can you see the big ship?',        emoji: '🚢' },
  { text: 'The red bike is by the tree.',     emoji: '🚲' },
  { text: 'You are a great reader!',          emoji: '⭐' },
];

let state = { screen:'home',mode:null,queue:[],index:0,score:0,correct:0,total:0,dailyCount:parseInt(localStorage.getItem('lr_daily')||'0'),dailyDate:localStorage.getItem('lr_date')||'',currentWord:null,spellingInput:[] };
const today = new Date().toDateString();
if(state.dailyDate!==today){state.dailyCount=0;state.dailyDate=today;localStorage.setItem('lr_daily','0');localStorage.setItem('lr_date',today);}
function showScreen(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));const el=document.getElementById('screen-'+id);if(el){el.classList.add('active');state.screen=id;}}
function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function updateHomeUI(){const pct=Math.min((state.dailyCount/20)*100,100);document.getElementById('daily-progress').style.width=pct+'%';document.getElementById('progress-count').textContent=state.dailyCount+' word'+(state.dailyCount!==1?'s':'')+' today';}
function startMode(mode){state.mode=mode;state.score=0;state.correct=0;state.total=0;state.index=0;const titles={'sight-words':'👁️ Sight Words','phonics':'🔤 Phonics','sentences':'📝 Sentences','spelling':'✏️ Spelling'};document.getElementById('game-mode-title').textContent=titles[mode]||mode;document.getElementById('game-score').textContent='⭐ 0';if(mode==='sight-words'){state.queue=shuffle(SIGHT_WORDS).slice(0,10);}else if(mode==='phonics'){state.queue=shuffle(PHONICS_WORDS).slice(0,10);}else if(mode==='sentences'){state.queue=shuffle(SENTENCES).slice(0,8);}else if(mode==='spelling'){state.queue=shuffle(SIGHT_WORDS.filter(w=>w.word.length>=3&&w.word.length<=5)).slice(0,8);}showScreen('game');renderQuestion();}
function renderQuestion(){const overlay=document.getElementById('feedback-overlay');overlay.classList.remove('show');const content=document.getElementById('game-content');const controls=document.getElementById('game-controls');content.innerHTML='';controls.innerHTML='';if(state.index>=state.queue.length){showResults();return;}const dots=document.createElement('div');dots.className='progress-dots';for(let i=0;i<state.queue.length;i++){const d=document.createElement('div');d.className='dot'+(i<state.index?' done':i===state.index?' current':'');dots.appendChild(d);}content.appendChild(dots);const item=state.queue[state.index];if(state.mode==='sight-words')renderSightWord(item,content,controls);else if(state.mode==='phonics')renderPhonics(item,content,controls);else if(state.mode==='sentences')renderSentence(item,content,controls);else if(state.mode==='spelling')renderSpelling(item,content,controls);}
function renderSightWord(item,content,controls){const others=SIGHT_WORDS.filter(w=>w.word!==item.word);const wrongs=shuffle(others).slice(0,3).map(w=>w.word);const options=shuffle([item.word,...wrongs]);const card=document.createElement('div');card.className='word-card';card.innerHTML='<span class="word-emoji">'+item.emoji+'</span><div class="word-hint">'+item.hint+'</div><div class="word-hint" style="margin-top:12px;font-size:13px;color:#aaa">Which word matches?</div>';content.appendChild(card);const grid=document.createElement('div');grid.className='options-grid';options.forEach(opt=>{const btn=document.createElement('button');btn.className='option-btn';btn.textContent=opt;btn.addEventListener('click',()=>handleSightAnswer(btn,opt,item.word,grid));grid.appendChild(btn);});content.appendChild(grid);}
function handleSightAnswer(btn,chosen,correct,grid){const allBtns=grid.querySelectorAll('.option-btn');allBtns.forEach(b=>b.disabled=true);if(chosen===correct){btn.classList.add('correct');state.correct++;state.score++;state.dailyCount++;document.getElementById('game-score').textContent='⭐ '+state.score;showFeedback(true);}else{btn.classList.add('wrong');allBtns.forEach(b=>{if(b.textContent===correct)b.classList.add('correct');});showFeedback(false);}state.total++;setTimeout(nextQuestion,1400);}
function renderPhonics(item,content,controls){const card=document.createElement('div');card.className='phonics-card';card.innerHTML='<div style="font-size:48px;margin-bottom:12px">'+item.emoji+'</div><div class="phonics-chunks" id="chunks-display"></div><div class="phonics-full">Tap each part, then press the button</div>';content.appendChild(card);const chunksDisplay=card.querySelector('#chunks-display');item.chunks.forEach((chunk,i)=>{const span=document.createElement('span');span.className='phonics-chunk';span.textContent=chunk;span.addEventListener('click',()=>{span.style.transform='scale(0.85)';setTimeout(()=>span.style.transform='',150);speakText(chunk);});chunksDisplay.appendChild(span);});const contBtn=document.createElement('button');contBtn.className='btn-continue';contBtn.textContent='Say it: '+item.word+' '+item.emoji;contBtn.addEventListener('click',()=>{speakText(item.word);state.correct++;state.score++;state.dailyCount++;document.getElementById('game-score').textContent='⭐ '+state.score;state.total++;showFeedback(true);setTimeout(nextQuestion,1400);});controls.appendChild(contBtn);}
function renderSentence(item,content,controls){const card=document.createElement('div');card.className='sentence-card';const emoji=document.createElement('div');emoji.style.cssText='font-size:48px;text-align:center;margin-bottom:16px';emoji.textContent=item.emoji;card.appendChild(emoji);const textDiv=document.createElement('div');textDiv.className='sentence-text';const words=item.text.split(' ');const wordSpans=[];words.forEach((word,i)=>{const span=document.createElement('span');span.className='sentence-word'+(i===0?' current':'');span.textContent=word+' ';span.addEventListener('click',()=>{wordSpans.forEach(s=>s.classList.remove('current'));span.classList.add('read');const next=wordSpans[i+1];if(next)next.classList.add('current');speakText(word.replace(/[^a-zA-Z]/g,''));});textDiv.appendChild(span);wordSpans.push(span);});card.appendChild(textDiv);content.appendChild(card);const readBtn=document.createElement('button');readBtn.className='btn-continue';readBtn.textContent='🔊 Read aloud';readBtn.addEventListener('click',()=>{speakText(item.text);wordSpans.forEach((s,i)=>{setTimeout(()=>{wordSpans.forEach(x=>x.classList.remove('current'));s.classList.add('current','read');},i*350);});});const doneBtn=document.createElement('button');doneBtn.className='btn-continue';doneBtn.textContent='✅ I read it!';doneBtn.style.marginTop='8px';doneBtn.addEventListener('click',()=>{state.correct++;state.score++;state.dailyCount++;document.getElementById('game-score').textContent='⭐ '+state.score;state.total++;showFeedback(true);setTimeout(nextQuestion,1400);});controls.appendChild(readBtn);controls.appendChild(doneBtn);}'div');
  card.className = 'sentence-card';

  const emoji = document.createElement('div');
  emoji.style.cssText = 'font-size:48px;text-align:center;margin-bottom:16px';
  emoji.textContent = item.emoji;
  card.appendChild(emoji);

  const textDiv = document.createElement('div');
  textDiv.className = 'sentence-text';

  const words = item.text.split(' ');
  let currentIndex = 0;
  const wordSpans = [];

  words.forEach((word, i) => {
    const span = document.createElement('span');
    span.className = 'sentence-word' + (i === 0 ? ' current' : '');
    span.textContent = word + ' ';
    span.dataset.index = i;
    span.addEventListener('click', () => {
      wordSpans.forEach(s => s.classList.remove('current'));
      span.classList.add('read');
      const nextSpan = wordSpans[i + 1];
      if (nextSpan) nextSpan.classList.add('current');
      speakText(word.replace(/[^a-zA-Z]/g, ''));
    });
    textDiv.appendChild(span);
    wordSpans.push(span);
  });

  card.appendChild(textDiv);
  content.appendChild(card);

  const readBtn = document.createElement('button');
  readBtn.className = 'btn-continue';
  readBtn.textContent = 'ð Read aloud';
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
  doneBtn.textContent = 'â I read it!';
  doneBtn.style.marginTop = '8px';
  doneBtn.addEventListener('click', () => {
    state.correct++;
    state.score++;
    state.dailyCount++;
    document.getElementById('game-score').textContent = 'â­ ' + state.score;
    state.total++;
    showFeedback(true);
    setTimeout(nextQuestion, 1400);
  });

  controls.appendChild(readBtn);
  controls.appendChild(doneBtn);
}

// ===== Spelling =====
function renderSpelling(item, content, controls) {
  state.spellingInput = [];
  const word = item.word;
  const letters = word.split('');

  const hintDiv = document.createElement('div');
  hintDiv.className = 'spelling-target';
  hintDiv.innerHTML = `${item.emoji} <strong>${item.hint}</strong>`;
  content.appendChild(hintDiv);

  const display = document.createElement('div');
  display.className = 'spelling-letters-display';
  for (let i = 0; i < word.length; i++) {
    const slot = document.createElement('div');
    slot.className = 'letter-slot';
    slot.id = 'slot-' + i;
    display.appendChild(slot);
  }
  content.appendChild(display);

  // Shuffled letters + 2 extras
  const extraLetters = 'abcdefghijklmnopqrstuvwxyz'.split('')
    .filter(l => !letters.includes(l));
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
  clearBtn.textContent = 'ð Clear';
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
  if (slot) {
    slot.textContent = letter;
    slot.classList.add('filled');
  }

  if (state.spellingInput.length === word.length) {
    const attempt = state.spellingInput.map(x => x.letter).join('');
    setTimeout(() => checkSpelling(attempt, word), 300);
  }
}

function checkSpelling(attempt, word) {
  if (attempt === word) {
    state.correct++;
    state.score++;
    state.dailyCount++;
    document.getElementById('game-score').textContent = 'â­ ' + state.score;
    state.total++;
    showFeedback(true);
    setTimeout(nextQuestion, 1500);
  } else {
    // Shake animation
    const display = document.querySelector('.spelling-letters-display');
    display.style.animation = 'none';
    display.style.transition = 'transform 0.05s';
    let shakes = 0;
    const shake = setInterval(() => {
      display.style.transform = shakes % 2 === 0 ? 'translateX(6px)' : 'translateX(-6px)';
      shakes++;
      if (shakes > 5) { clearInterval(shake); display.style.transform = ''; }
    }, 70);

    const choicesDiv = document.querySelector('.letter-choices');
    resetSpelling(display, choicesDiv);
  }
}

function resetSpelling(display, choicesDiv) {
  state.spellingInput = [];
  display.querySelectorAll('.letter-slot').forEach(s => {
    s.textContent = '';
    s.classList.remove('filled');
  });
  choicesDiv.querySelectorAll('.letter-btn').forEach(b => b.disabled = false);
}

// ===== Feedback =====
const POSITIVE = ['ð','â­','ð','ð','ðª','ð¥','ð¥³','ð','ð','â¨'];
const NEGATIVE = ['ðª','ð¤','ð','ð','ð'];

function showFeedback(correct) {
  const overlay = document.getElementById('feedback-overlay');
  const emoji = document.getElementById('feedback-emoji');
  const text = document.getElementById('feedback-text');

  if (correct) {
    const msgs = ['Great job!','Excellent!','You got it!','Amazing!','Correct!','Brilliant!','Super!','Fantastic!'];
    emoji.textContent = POSITIVE[Math.floor(Math.random() * POSITIVE.length)];
    text.textContent = msgs[Math.floor(Math.random() * msgs.length)];
    overlay.style.background = 'rgba(76,175,80,0.85)';
    launchConfetti();
  } else {
    const msgs = ['Try again!','Keep going!','Almost!','You can do it!'];
    emoji.textContent = NEGATIVE[Math.floor(Math.random() * NEGATIVE.length)];
    text.textContent = msgs[Math.floor(Math.random() * msgs.length)];
    overlay.style.background = 'rgba(239,83,80,0.85)';
  }
  overlay.classList.add('show');
  setTimeout(() => overlay.classList.remove('show'), 1200);

  saveDailyProgress();
}

function nextQuestion() {
  state.index++;
  renderQuestion();
}

// ===== Results =====
function showResults() {
  document.getElementById('result-correct').textContent = state.correct;
  document.getElementById('result-total').textContent = state.total;
  document.getElementById('result-stars').textContent = state.score;

  const pct = state.total > 0 ? (state.correct / state.total) : 0;
  let msg;
  if (pct === 1) msg = 'ð Perfect score! Incredible!';
  else if (pct >= 0.8) msg = 'ð Really great work!';
  else if (pct >= 0.6) msg = 'ð Good job! Keep practising!';
  else msg = 'ð Keep reading and you\'ll get there!';
  document.getElementById('results-message').textContent = msg;

  showScreen('results');
  launchConfetti();
}

// ===== Confetti =====
function launchConfetti() {
  const colors = ['#6c63ff','#ff9800','#4caf50','#ef5350','#ffd600','#2196f3','#e91e63'];
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.cssText = `
        left: ${Math.random() * 100}vw;
        top: -20px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        width: ${6 + Math.random() * 8}px;
        height: ${6 + Math.random() * 8}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation-duration: ${0.8 + Math.random() * 0.8}s;
        animation-delay: ${Math.random() * 0.3}s;
      `;
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
  localStorage.setItem('lr_daily', String(state.dailyCount));
  localStorage.setItem('lr_date', state.dailyDate);
}

// ===== Event Listeners =====
document.querySelectorAll('.mode-card').forEach(card => {
  card.addEventListener('click', () => startMode(card.dataset.mode));
});

document.getElementById('btn-back').addEventListener('click', () => {
  showScreen('home');
  updateHomeUI();
});

document.getElementById('btn-play-again').addEventListener('click', () => {
  startMode(state.mode);
});

document.getElementById('btn-home').addEventListener('click', () => {
  showScreen('home');
  updateHomeUI();
});

// ===== Service Worker =====
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

// ===== Init =====
updateHomeUI();
