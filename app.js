// ===== Data =====
const SIGHT_WORDS = [ { word: 'the', hint: 'Most common word!', emoji: 'ð' }, { word: 'and', hint: 'Joins two things', emoji: 'ð' }, { word: 'a', hint: 'One of something', emoji: '1ï¸â£' }, { word: 'to', hint: 'Going somewhere', emoji: 'â¡ï¸' }, { word: 'is', hint: 'Something exists', emoji: 'â' }, { word: 'in', hint: 'Inside something', emoji: 'ð¦' }, { word: 'it', hint: 'A thing nearby', emoji: 'ð' }, { word: 'you', hint: 'The person reading!',emoji: 'ð«µ' }, { word: 'he', hint: 'A boy or man', emoji: 'ð¦' }, { word: 'she', hint: 'A girl or woman', emoji: 'ð§' }, { word: 'was', hint: 'Happened before', emoji: 'âª' }, { word: 'are', hint: 'More than one is', emoji: 'ð¥' }, { word: 'at', hint: 'A place or time', emoji: 'ð' }, { word: 'be', hint: 'To exist', emoji: 'ð' }, { word: 'this', hint: 'Right here!', emoji: 'ð' }, { word: 'have', hint: 'Own something', emoji: 'ð¤²' }, { word: 'from', hint: 'Where it started', emoji: 'ð ' }, { word: 'or', hint: 'A choice', emoji: 'âï¸' }, { word: 'one', hint: 'The number 1', emoji: 'á¸ï¸' }, { word: 'had', hint: 'Owned before', emoji: 'ð' }, { word: 'by', hint: 'Next to or made by',emoji: 'ð¤' }, { word: 'but', hint: 'Howeverâ¦', emoji: 'ð' }, { word: 'not', hint: 'No, opposite', emoji: 'â' }, { word: 'all', hint: 'Every single one', emoji: 'ð¯' }, { word: 'were', hint: 'They existed', emoji: 'ð£' }, { word: 'can', hint: 'Able to do it', emoji: 'ðª' }, { word: 'said', hint: 'Spoke words', emoji: 'ð¬' }, { word: 'see', hint: 'Use your eyes', emoji: 'ð' }, { word: 'get', hint: 'Go and get it', emoji: 'ð' }, { word: 'like', hint: 'To enjoy', emoji: 'â¤ï¸' }, ];
const PHONICS_WORDS = [ { word: 'cat', chunks: ['c','at'], emoji: 'ð±' }, { word: 'dog', chunks: ['d','og'], emoji: 'ð¶' }, { word: 'sun', chunks: ['s','un'], emoji: 'âï¸' }, { word: 'hat', chunks: ['h','at'], emoji: 'ð©' }, { word: 'big', chunks: ['b','ig'], emoji: 'ð' }, { word: 'red', chunks: ['r','ed'], emoji: 'ð' }, { word: 'cup', chunks: ['c','up'], emoji: 'â' }, { word: 'pen', chunks: ['p','en'], emoji: 'âï¸' }, { word: 'hop', chunks: ['h','op'], emoji: 'ð¸' }, { word: 'mud', chunks: ['m','ud'], emoji: 'ð§ï¸' }, { word: 'ship', chunks: ['sh','ip'], emoji: 'ð¢' }, { word: 'chin', chunks: ['ch','in'], emoji: 'ð' }, { word: 'thin', chunks: ['th','in'], emoji: 'ð' }, { word: 'when', chunks: ['wh','en'], emoji: 'â' }, { word: 'frog', chunks: ['fr','og'], emoji: 'ð¸' }, { word: 'clap', chunks: ['cl','ap'], emoji: 'ð' }, { word: 'snap', chunks: ['sn','ap'], emoji: 'ð«°' }, { word: 'trip', chunks: ['tr','ip'], emoji: 'ð¶' }, { word: 'blue', chunks: ['bl','ue'], emoji: 'ðµ' }, { word: 'play', chunks: ['pl','ay'], emoji: 'ð®' }, { word: 'cake', chunks: ['c','a','ke'], emoji: 'ð' }, { word: 'bike', chunks: ['b','i','ke'], emoji: 'ð²' }, { word: 'home', chunks: ['h','o','me'], emoji: 'ð ' }, { word: 'smile', chunks: ['sm','i','le'],emoji: 'ð' }, ];
const SENTENCES = [ { text: 'The cat sat on the mat.', emoji: 'ð±' }, { text: 'A big red dog ran fast.', emoji: 'ð' }, { text: 'She can see the blue sky.', emoji: 'ð¤ï¸' }, { text: 'He had a hat and a bag.', emoji: 'ð©' }, { text: 'The sun is hot today.', emoji: 'âï¸' }, { text: 'I like to eat cake.', emoji: 'ð' }, { text: 'We can play and have fun.', emoji: 'ð' }, { text: 'The frog can hop and jump.', emoji: 'ð¸' }, { text: 'My dog likes to run and play.', emoji: 'ð¶' }, { text: 'She said the bird can fly.', emoji: 'ð¦' }, { text: 'He is not at home today.', emoji: 'ð ' }, { text: 'All the kids like to read.', emoji: 'ð' }, { text: 'Can you see the big ship?', emoji: 'ð¢' }, { text: 'The red bike is by the tree.', emoji: 'ð²' }, { text: 'You are a great reader!', emoji: 'â­' }, ];

// ===== Profile Images =====
// To replace with real photos: encode your PNG as base64 and update these constants.
const MIA_IMG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImciIGN4PSI0MCUiIGN5PSIzNSUiIHI9IjY1JSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZGQjNDNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0ZGNEM4RGIIvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIiIHI9IjEwMCIgZmlsbD0idXJsKCMnIy8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iODUiIHJ9IjY5IiBkZmlsbD0iK0ZGNEM4RGIIvPjxlbGxpcHNlIGN4PSIxMDAiIGN5PSIxMDAiIHJ9IjMjIiBmaWxsPSJvZmZsaW5lXWZvcm1hdCIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9Ij81IiBreD0iMTUiIHJyPSI1IiBmaWxsPSIjOEI2NTEzIi8+PgogICA8Y2lyY2xlIGN4PSI4NiIgY3k9IjgyIiByPSI2IiBmaWxsPSIjNGEyYzAwIi8+PGNpcmNsZSBjeD0iMTE0IiBjeT0iODIiIHJ9IjYwIiBmaWxsPSIjNGEyYzAwIi8+PjxwYXRoIGQ9Ik0wNiA5NyBRMTAwIDExMCAxMTQgOTciIHN0cm9rZT0iI2MwMzkyYiIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48Y2lyY2xlIGN4PSI3NiIgY3k9Ijk1IiByPSI4IiBmaWxsPSIjRkY5RUJDIiBvcGFjaXR5PSIwLjUiLz48Y2xvYWQgY3g9IjcxIiBjeT0iOTUiIHI9IjgIiGZpbGw9IiNGRjlFQkMiIG9wYWNpdHk9IjAuNSIvPjx0b252ZSBjeD0iMTAwIiBjeT0iMTYwIiByeD0iNDAiIHJ5PSIzMCIgZmlsbD0iIzM0OThEQiIgb3BhY2l0eT0iMC42Ii8+PC9zdmc+IjExNTM';
const OSKAR_IMG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImciIGN4PSI0MCUiIGN5PSI3MCUiIHI9IjY1JSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzc0RDdGNyIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzM5ODBCOSIvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iMTAwIiBmaWxsPSJ1cmwoI2njIi8+PjFsbGlwc2UgY3g9IjEwMCIgY3k9IjQ4IiByeD0iNDYiIHJ5PSIyMiIgZmlsbD0iIzVENDAzNyIvPjxyZWN0IHg9IjU0IiB5PSI0YiB3aWR0aD0iOTIiIGhlaWdodD0iMTUiIGZpbGw9IjNVMDQ1NDciIHJ9IjUiLz48Y2lyY2xlIGN4PSI4NiIgY3k9IjgyIiByPSI2IiBmaWxsPSIjMmM0YTAwIi8+PGNpcmNsZSBjeD0iMTE0IiBjeT0iODIiIHJ9IjYwIiBmaWxsPSIjMmM0YTAwIi8+PjxwYXRoIGQ9Ik0wNiA5NyBRMTAwIDExMCAxMTQgOTciIHN0cm9rZT0iIjJkODE0IiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxjaXJjbGUgY3g9IjY2IiBjeT0iOTUiIHI9IjgiIGZpbGw9IiNGRkI2QTAiIG9wYWNpdHk9IjAuNSIvPjxjaXJjbGUgY3g9IjEyNCIgY3k9Ijk1IiByPSI4IiBmaWxsPSIjRkZCNkEwIiBvcGFjazQ9IjAuNSIvPjxlbGxpcHNlIGN4PSI0MDAiIGN9IjE2MCIgcn09IjQwIiByeT0iMzAiIGZpbGw9IiMzNDl4QiIgb3BhY2l0eT0iMC42Ii8+PC9zdmc+';

// ===== Profile State =====
let currentProfile = null;

// ===== App State =====
let state = { screen:'home',mode:null,queue:[],index:0,score:0,correct:0,total:0,dailyCount:parseInt(localStorage.getItem('lr_daily')||'0'),dailyDate:localStorage.getItem('lr_date')||'',currentWord:null,spellingInput:[] };
const today = new Date().toDateString();
if(state.dailyDate!==today){state.dailyCount=0;state.dailyDate=today;localStorage.setItem('lr_daily','0');localStorage.setItem('lr_date',today);}

function showScreen(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));const el=document.getElementById('screen-'+id);if(el){el.classList.add('active');state.screen=id;}}
function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function updateHomeUI(){const pct=Math.min((state.dailyCount/20)*100,100);document.getElementById('daily-progress').style.width=pct+'%';document.getElementById('progress-count').textContent=state.dailyCount+' word'+(state.dailyCount!==1?'s':'')+' today';}
function startMode(mode){state.mode=mode;state.score=0;state.correct=0;state.total=0;state.index=0;const titles={'sight-words':'ðï¸ Sight Words','phonics':'ð¤ Phonics','sentences':'ð Sentences','spelling':'âï¸ Spelling'};document.getElementById('game-mode-title').textContent=titles[mode]||mode;document.getElementById('game-score').textContent='â­ 0';if(mode==='sight-words'){state.queue=shuffle(SIGHT_WORDS).slice(0,10);}else if(mode==='phonics'){state.queue=shuffle(PHONICS_WORDS).slice(0,10);}else if(mode==='sentences'){state.queue=shuffle(SENTENCES).slice(0,8);}else if(mode==='spelling'){state.queue=shuffle(SIGHT_WORDS.filter(w=>w.word.length>=3&&w.word.length<=5)).slice(0,8);}showScreen('game');renderQuestion();}
function renderQuestion(){const overlay=document.getElementById('feedback-overlay');overlay.classList.remove('show');const content=document.getElementById('game-content');const controls=document.getElementById('game-controls');content.innerHTML='';controls.innerHTML='';if(state.index>=state.queue.length){showResults();return;}const dots=document.createElement('div');dots.className='progress-dots';for(let i=0;i<state.queue.length;i++){const d=document.createElement('div');d.className='dot'+(i<state.index?' done':i===state.index?' current':'');dots.appendChild(d);}content.appendChild(dots);const item=state.queue[state.index];if(state.mode==='sight-words')renderSightWord(item,content,controls);else if(state.mode==='phonics')renderPhonics(item,content,controls);else if(state.mode==='sentences')renderSentence(item,content,controls);else if(state.mode==='spelling')renderSpelling(item,content,controls);}
function renderSightWord(item,content,controls){const others=SIGHT_WORDS.filter(w=>w.word!==item.word);const wrongs=shuffle(others).slice(0,3).map(w=>w.word);const options=shuffle([item.word,...wrongs]);const card=document.createElement('div');card.className='word-card';card.innerHTML='<span class="word-emoji">'+item.emoji+'</span><div class="word-hint">'+item.hint+'</div><div class="word-hint" style="margin-top:12px;font-size:13px;color:#aaa">Which word matches?</div>';content.appendChild(card);const grid=document.createElement('div');grid.className='options-grid';options.forEach(opt=>{const btn=document.createElement('button');btn.className='option-btn';btn.textContent=opt;btn.addEventListener('click',()=>handleSightAnswer(btn,opt,item.word,grid));grid.appendChild(btn);});content.appendChild(grid);}
function handleSightAnswer(btn,chosen,correct,grid){const allBtns=grid.querySelectorAll('.option-btn');allBtns.forEach(b=>b.disabled=true);if(chosen===correct){btn.classList.add('correct');state.correct++;state.score++;state.dailyCount++;document.getElementById('game-score').textContent='â­ '+state.score;showFeedback(true);}else{btn.classList.add('wrong');allBtns.forEach(b=>{if(b.textContent===correct)b.classList.add('correct');});showFeedback(false);}state.total++;setTimeout(nextQuestion,1400);}
function renderPhonics(item,content,controls){const card=document.createElement('div');card.className='phonics-card';card.innerHTML='<div style="font-size:48px;margin-bottom:12px">'+item.emoji+'</div><div class="phonics-chunks" id="chunks-display"></div><div class="phonics-full">Tap each part, then press the button</div>';content.appendChild(card);const chunksDisplay=card.querySelector('#chunks-display');item.chunks.forEach((chunk,i)=>{const span=document.createElement('span');span.className='phonics-chunk';span.textContent=chunk;span.addEventListener('click',()=>{span.style.transform='scale(0.85)';setTimeout(()=>span.style.transform='',150);speakText(chunk);});chunksDisplay.appendChild(span);});const contBtn=document.createElement('button');contBtn.className='btn-continue';contBtn.textContent='Say it: '+item.word+' '+item.emoji;contBtn.addEventListener('click',()=>{speakText(item.word);state.correct++;state.score++;state.dailyCount++;document.getElementById('game-score').textContent='â­ '+state.score;state.total++;showFeedback(true);setTimeout(nextQuestion,1400);});controls.appendChild(contBtn);}
function renderSentence(item,content,controls){const card=document.createElement('div');card.className='sentence-card';const emoji=document.createElement('div');emoji.style.cssText='font-size:48px;text-align:center;margin-bottom:16px';emoji.textContent=item.emoji;card.appendChild(emoji);const textDiv=document.createElement('div');textDiv.className='sentence-text';const words=item.text.split(' ');const wordSpans=[];words.forEach((word,i)=>{const span=document.createElement('span');span.className='sentence-word'+(i===0?' current':'');span.textContent=word+' ';span.addEventListener('click',()=>{wordSpans.forEach(s=>s.classList.remove('current'));span.classList.add('read');const next=wordSpans[i+1];if(next)next.classList.add('current');speakText(word.replace(/[^a-zA-Z]/g,''));});textDiv.appendChild(span);wordSpans.push(span);});card.appendChild(textDiv);content.appendChild(card);const readBtn=document.createElement('button');readBtn.className='btn-continue';readBtn.textContent='ð Read aloud';readBtn.addEventListener('click',()=>{speakText(item.text);wordSpans.forEach((s,i)=>{setTimeout(()=>{wordSpans.forEach(x=>x.classList.remove('current'));s.classList.add('current','read');},i*350);});});const doneBtn=document.createElement('button');doneBtn.className='btn-continue';doneBtn.textContent='â I read it!';doneBtn.style.marginTop='8px';doneBtn.addEventListener('click',()=>{state.correct++;state.score++;state.dailyCount++;document.getElementById('game-score').textContent='â­ '+state.score;state.total++;showFeedback(true);setTimeout(nextQuestion,1400);});controls.appendChild(readBtn);controls.appendChild(doneBtn);}

// ===== Spelling =====
function renderSpelling(item, content, controls) { state.spellingInput = []; const word = item.word; const letters = word.split(''); const hintDiv = document.createElement('div'); hintDiv.className = 'spelling-target'; hintDiv.innerHTML = `${item.emoji} <strong>${item.hint}</strong>`; content.appendChild(hintDiv); const display = document.createElement('div'); display.className = 'spelling-letters-display'; for (let i = 0; i < word.length; i++) { const slot = document.createElement('div'); slot.className = 'letter-slot'; slot.id = 'slot-' + i; display.appendChild(slot); } content.appendChild(display); const extraLetters = 'abcdefghijklmnopqrstuvwxyz'.split('').filter(l => !letters.includes(l)); const extras = shuffle(extraLetters).slice(0, Math.max(2, 6 - letters.length)); const pool = shuffle([...letters, ...extras]); const choicesDiv = document.createElement('div'); choicesDiv.className = 'letter-choices'; pool.forEach(letter => { const btn = document.createElement('button'); btn.className = 'letter-btn'; btn.textContent = letter; btn.addEventListener('click', () => handleLetterTap(btn, letter, word, display)); choicesDiv.appendChild(btn); }); content.appendChild(choicesDiv); const clearBtn = document.createElement('button'); clearBtn.className = 'btn-continue'; clearBtn.textContent = 'ð Clear'; clearBtn.style.background = '#eee'; clearBtn.style.color = '#333'; clearBtn.style.boxShadow = 'none'; clearBtn.addEventListener('click', () => resetSpelling(display, choicesDiv)); controls.appendChild(clearBtn); }
function handleLetterTap(btn, letter, word, display) { if (state.spellingInput.length >= word.length) return; btn.disabled = true; state.spellingInput.push({ letter, btn }); const idx = state.spellingInput.length - 1; const slot = display.querySelector('#slot-' + idx); if (slot) { slot.textContent = letter; slot.classList.add('filled'); } if (state.spellingInput.length === word.length) { const attempt = state.spellingInput.map(x => x.letter).join(''); setTimeout(() => checkSpelling(attempt, word), 300); } }
function checkSpelling(attempt, word) { if (attempt === word) { state.correct++; state.score++; state.dailyCount++; document.getElementById('game-score').textContent = 'â­ ' + state.score; state.total++; showFeedback(true); setTimeout(nextQuestion, 1500); } else { const display = document.querySelector('.spelling-letters-display'); display.style.animation = 'none'; display.style.transition = 'transform 0.05s'; let shakes = 0; const shake = setInterval(() => { display.style.transform = shakes % 2 === 0 ? 'translateX(6px)' : 'translateX(-6px)'; shakes++; if (shakes > 5) { clearInterval(shake); display.style.transform = ''; } }, 70); const choicesDiv = document.querySelector('.letter-choices'); resetSpelling(display, choicesDiv); } }
function resetSpelling(display, choicesDiv) { state.spellingInput = []; display.querySelectorAll('.letter-slot').forEach(s => { s.textContent = ''; s.classList.remove('filled'); }); choicesDiv.querySelectorAll('.letter-btn').forEach(b => b.disabled = false); }

// ===== Feedback =====
const POSITIVE = ['ð','â­','ð','ð','ðª','ð¥','ð¥³','ð','ð','â¨'];
const NEGATIVE = ['ðª´','ð¤','ð','ð¦','ð¸'];
function showFeedback(correct) { const overlay = document.getElementById('feedback-overlay'); const emoji = document.getElementById('feedback-emoji'); const text = document.getElementById('feedback-text'); if (correct) { const msgs = ['Great job!','Excellent!','You got it!','Amazing!','Correct!','Brilliant!','Super!','Fantastic!']; emoji.textContent = POSITIVE[Math.floor(Math.random() * POSITIVE.length)]; text.textContent = msgs[Math.floor(Math.random() * msgs.length)]; overlay.style.background = 'rgba(76,175,80,0.85)'; launchConfetti(); } else { const msgs = ['Try again!','Keep going!','Almost!','You can do it!']; emoji.textContent = NEGATIVE[Math.floor(Math.random() * NEGATIVE.length)]; text.textContent = msgs[Math.floor(Math.random() * msgs.length)]; overlay.style.background = 'rgba(239,83,80,0.85)'; } overlay.classList.add('show'); setTimeout(() => overlay.classList.remove('show'), 1200); saveDailyProgress(); }
function nextQuestion() { state.index++; renderQuestion(); }

// ===== Results =====
function showResults() { document.getElementById('result-correct').textContent = state.correct; document.getElementById('result-total').textContent = state.total; document.getElementById('result-stars').textContent = state.score; const pct = state.total > 0 ? (state.correct / state.total) : 0; let msg; if (pct === 1) msg = 'ð¯ Perfect score! Incredible!'; else if (pct >= 0.8) msg = 'ð Really great work!'; else if (pct >= 0.6) msg = 'ð Good job! Keep practising!'; else msg = 'ð Keep reading and you\'ll get there!'; document.getElementById('results-message').textContent = msg; showScreen('results'); launchConfetti(); }

// ===== Confetti =====
function launchConfetti() { const colors = ['#6c63ff','#ff9800','#4caf50','#ef5350','#ffd600','#2196f3','#e91e63']; for (let i = 0; i < 30; i++) { setTimeout(() => { const el = document.createElement('div'); el.className = 'confetti-piece'; el.style.cssText = `left: ${Math.random() * 100}vw; top: -20px; background: ${colors[Math.floor(Math.random() * colors.length)]}; width: ${6 + Math.random() * 8}px; height: ${6 + Math.random() * 8}px; border-radius: ${Math.random() > 0.5 ? '50%' : '2px'}; animation-duration: ${0.8 + Math.random() * 0.8}s; animation-delay: ${Math.random() * 0.3}s;`; document.body.appendChild(el); setTimeout(() => el.remove(), 1500); }, i * 30); } }

// ===== Text-to-Speech =====
function speakText(text) { if (!('speechSynthesis' in window)) return; window.speechSynthesis.cancel(); const utter = new SpeechSynthesisUtterance(text); utter.rate = 0.85; utter.pitch = 1.1; utter.lang = 'en-GB'; window.speechSynthesis.speak(utter); }

// ===== Save Daily Progress =====
function saveDailyProgress() { localStorage.setItem('lr_daily', String(state.dailyCount)); localStorage.setItem('lr_date', state.dailyDate); }

// ===== Profile Picker =====
function profileCardHTML(name, img, accentColor) {
  return `
    <div class="profile-card" data-name="${name}" style="
      display:flex; flex-direction:column; align-items:center; cursor:pointer;
      padding:1.5rem 2rem; border-radius:24px;
      background:rgba(255,255,255,0.18);
      backdrop-filter:blur(12px);
      border:3px solid rgba(255,255,255,0.35);
      transition:transform 0.2s ease, box-shadow 0.2s ease;
      -webkit-tap-highlight-color: transparent;
    "
    onmouseover="this.style.transform='scale(1.07)';this.style.boxShadow='0 16px 48px rgba(0,0,0,0.35)'"
    onmouseout="this.style.transform='';this.style.boxShadow=''"
    ontouchstart="this.style.transform='scale(1.07)'"
    ontouchend="this.style.transform=''">
      <div style="
        width:160px; height:160px; border-radius:50%; overflow:hidden;
        border:5px solid white;
        box-shadow:0 8px 28px rgba(0,0,0,0.28);
        background:${accentColor};
        animation: profilePulse 3s ease-in-out infinite;
      ">
        <img src="${img}" style="width:100%;height:100%;object-fit:cover;display:block" alt="${name}" onerror="this.style.display='none'"/>
      </div>
      <div style="
        color:white; font-size:2rem; font-weight:800; margin-top:1.2rem;
        text-shadow:0 2px 8px rgba(0,0,0,0.25);
        letter-spacing:0.03em;
      ">${name}</div>
    </div>
  `;
}

function renderProfilePicker() {
  // Inject keyframe animation
  if (!document.getElementById('profile-styles')) {
    const style = document.createElement('style');
    style.id = 'profile-styles';
    style.textContent = `
      @keyframes profilePulse {
        0%, 100% { box-shadow: 0 8px 28px rgba(0,0,0,0.28), 0 0 0 0 rgba(255,255,255,0.4); }
        50% { box-shadow: 0 8px 28px rgba(0,0,0,0.28), 0 0 0 12px rgba(255,255,255,0); }
      }
      @keyframes profileFadeIn {
        from { opacity:0; transform:translateY(20px); }
        to { opacity:1; transform:translateY(0); }
      }
      .profile-card { animation: profileFadeIn 0.5s ease forwards; }
      .profile-card:nth-child(2) { animation-delay: 0.1s; }
    `;
    document.head.appendChild(style);
  }

  const overlay = document.createElement('div');
  overlay.id = 'profile-picker-overlay';
  overlay.style.cssText = `
    position:fixed; inset:0; z-index:9999;
    background: linear-gradient(145deg, #7C73FF 0%, #6C63FF 40%, #48439e 100%);
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    padding:2rem 1rem;
    transition: opacity 0.4s ease;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  overlay.innerHTML = `
    <div style="text-align:center; margin-bottom:2.5rem; animation: profileFadeIn 0.4s ease;">
      <div style="font-size:3rem; margin-bottom:0.5rem;">ð</div>
      <h1 style="
        color:white; margin:0;
        font-size:clamp(1.6rem, 5vw, 2.4rem);
        font-weight:800;
        text-shadow:0 3px 12px rgba(0,0,0,0.2);
        letter-spacing:-0.01em;
      ">Who's reading today?</h1>
    </div>
    <div id="profile-cards" style="
      display:flex; gap:2rem; flex-wrap:wrap; justify-content:center;
      max-width:600px;
    ">
      ${profileCardHTML('Mia', MIA_IMG, '#FF4D8D')}
      ${profileCardHTML('Oskar', OSKAR_IMG, '#2980B9')}
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelectorAll('.profile-card').forEach(card => {
    card.addEventListener('click', () => {
      currentProfile = card.dataset.name;
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.remove();
        updateHomeGreeting();
        showScreen('home');
        updateHomeUI();
      }, 380);
    });
  });
}

function updateHomeGreeting() {
  let greetingEl = document.getElementById('profile-greeting');
  if (!greetingEl) {
    const homeScreen = document.getElementById('screen-home');
    if (homeScreen) {
      greetingEl = document.createElement('div');
      greetingEl.id = 'profile-greeting';
      greetingEl.style.cssText = `
        font-size:1.35rem; color:#6C63FF; font-weight:700;
        text-align:center; padding:0.6rem 0 0.2rem;
        letter-spacing:0.01em;
      `;
      homeScreen.insertBefore(greetingEl, homeScreen.firstChild);
    }
  }
  if (greetingEl && currentProfile) {
    greetingEl.textContent = 'Hi ' + currentProfile + '! ð';
  }
}

// ===== Event Listeners =====
document.querySelectorAll('.mode-card').forEach(card => {
  card.addEventListener('click', () => startMode(card.dataset.mode));
});
document.getElementById('btn-back').addEventListener('click', () => {
  showScreen('home');
  updateHomeGreeting();
  updateHomeUI();
});
document.getElementById('btn-play-again').addEventListener('click', () => {
  startMode(state.mode);
});
document.getElementById('btn-home').addEventListener('click', () => {
  showScreen('home');
  updateHomeGreeting();
  updateHomeUI();
});

// ===== Service Worker =====
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

// ===== Init =====
renderProfilePicker();
