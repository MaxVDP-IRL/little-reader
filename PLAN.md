# Little Reader — Improvement Plan

A plan for upgrading Little Reader for **Mia (6, reads at ~7-year-old level, bilingual Estonian/English)** and **Oskar**. Written to be executed phase-by-phase by a coding agent.

## Ground rules (do not break these)

- **No build step, no frameworks, no external runtime requests.** Everything stays plain HTML/CSS/JS static files that work offline as a PWA on GitHub Pages under `/little-reader/`.
- Keep the existing file layout: `index.html` (profile picker), `app.html`, `app.js`, `styles.css`, `sw.js`, `manifest.json`. You may add `data.js` (game content) and a `fonts/` folder.
- All audio is Web Speech API TTS (`en-GB`), always triggered by a tap (required on iOS).
- Touch targets ≥ 48px; reading text large (≥ 26px) with slightly increased letter-spacing — this app is used by children on a phone/tablet.
- Test flows by opening `app.html?name=Mia` — the profile picker in `index.html` links there.

---

## Phase 0 — Bug fixes & cleanup (do first)

1. **`renderHome()` is not defined** — `app.js:199` calls `renderHome()` when a `?name=` param is present (the normal path from index.html). This throws a `ReferenceError` on every launch and skips `updateHomeUI()`, so the daily progress bar stays empty until you navigate home from a game. Replace with `updateHomeGreeting(); showScreen('home'); updateHomeUI();`.
2. **All emojis were stripped from the data** — every `emoji:` field in `SIGHT_WORDS` / `PHONICS_WORDS` / `SENTENCES` is `''`, and the `POSITIVE` / `NEGATIVE` feedback arrays are arrays of empty strings, so feedback overlays and word cards render blank. Restore emojis everywhere (the content in Phase 2 below includes them). Also fix the stray `{ word: 'a', emoji: '1' }`.
3. **Remove dead code** — `renderProfilePicker`, `profileCardHTML`, `updateHomeGreeting`'s element-creation branch, `MIA_IMG`, `OSKAR_IMG` (the base64 SVGs are corrupted anyway). `index.html` owns profile selection now. Keep a simple `updateHomeGreeting()` that writes into the existing `#profile-greeting` element.
4. **Missing app icons** — `icon-192.png` / `icon-512.png` are referenced by `manifest.json`, `app.html`, and `sw.js` but don't exist. Generate them (simple design: 📖 open-book glyph on a purple `#6c63ff` rounded-square background). A small Node/Python script using canvas/Pillow run once locally is fine; commit the PNGs.
5. **Service worker doesn't cache `app.html`** — the actual app page is missing from `ASSETS`, so offline mode breaks. Add `app.html` and `data.js`; bump the cache name (`little-reader-v2`) and bump it on every future release. Use network-first for `.html` requests, cache-first for the rest, so updates propagate without stale-app problems.
6. **Daily progress is shared between profiles** — a single `lr_daily` localStorage key means Mia and Oskar overwrite each other. Fixed properly in Phase 1.

---

## Phase 1 — Per-profile progress & difficulty levels

### Per-profile storage
Namespace all persistent state by profile name:

```
lr_<name>_daily      // words today
lr_<name>_date       // date of daily count
lr_<name>_stars      // lifetime stars
lr_<name>_level      // 1 | 2 | 3
lr_<name>_streak     // consecutive days with >= 10 words
lr_<name>_lastDay    // last day the streak was fed
lr_<name>_stickers   // JSON array of earned sticker emojis (Phase 5)
```

Write a tiny helper: `store.get(key, fallback)` / `store.set(key, value)` that prefixes with `lr_${currentProfile}_`.

### Difficulty levels
Three levels; each game mode draws its content from the current level (with some overlap so easier items still appear occasionally, ~20% from the level below):

- **Level 1 · 🌱 Sprout** — the existing content: CVC words, first 30 sight words, short sentences. This is Oskar's starting point.
- **Level 2 · 🚀 Explorer** — long vowels, vowel teams, blends; next ~40 sight words; 8–12 word sentences.
- **Level 3 · ⭐ Star Reader** — multi-syllable words, tricky spellings, rich sentences, and Story Time stories. This is Mia's level.

Level is chosen on the home screen: a small three-button segmented control under the greeting ("🌱 / 🚀 / ⭐"), saved per profile. Default Mia → 3, Oskar → 1, otherwise 1.

### Home screen additions
Under the greeting show a compact stats row: `⭐ 128 stars · 🔥 4-day streak`. Keep the daily progress bar.

---

## Phase 2 — Content expansion (all data included below)

Move all game data into a new `data.js` (loaded before `app.js`). Organize by level. The lists below are the actual content to ship — copy them in, don't invent replacements.

### Sight words — Level 2 (add ~40)

```js
{ word: 'what',  hint: 'Asking about a thing',   emoji: '❓' },
{ word: 'when',  hint: 'Asking about time',      emoji: '⏰' },
{ word: 'where', hint: 'Asking about a place',   emoji: '📍' },
{ word: 'who',   hint: 'Asking about a person',  emoji: '🙋' },
{ word: 'why',   hint: 'Asking for a reason',    emoji: '🤔' },
{ word: 'how',   hint: 'Asking the way to do it', emoji: '🛠️' },
{ word: 'there', hint: 'In that place',          emoji: '👉' },
{ word: 'then',  hint: 'After that',             emoji: '➡️' },
{ word: 'them',  hint: 'Those people',           emoji: '👥' },
{ word: 'some',  hint: 'A few of something',     emoji: '🍬' },
{ word: 'come',  hint: 'Move closer',            emoji: '🤗' },
{ word: 'want',  hint: 'Wish to have it',        emoji: '🌟' },
{ word: 'went',  hint: 'Moved away before',      emoji: '🚶' },
{ word: 'saw',   hint: 'Used your eyes before',  emoji: '👀' },
{ word: 'out',   hint: 'Not inside',             emoji: '🚪' },
{ word: 'look',  hint: 'Use your eyes now',      emoji: '🔍' },
{ word: 'little',hint: 'Very small',             emoji: '🐜' },
{ word: 'make',  hint: 'Build or create it',     emoji: '🏗️' },
{ word: 'take',  hint: 'Pick it up and keep it', emoji: '🤲' },
{ word: 'give',  hint: 'Hand it to someone',     emoji: '🎁' },
{ word: 'know',  hint: 'Have it in your head',   emoji: '🧠' },
{ word: 'think', hint: 'Use your brain',         emoji: '💭' },
{ word: 'very',  hint: 'A lot, really',          emoji: '💯' },
{ word: 'again', hint: 'One more time',          emoji: '🔁' },
{ word: 'away',  hint: 'Far from here',          emoji: '🏃' },
{ word: 'could', hint: 'Was able to',            emoji: '💪' },
{ word: 'would', hint: 'Might do it',            emoji: '🤝' },
{ word: 'right', hint: 'Correct, or not left',   emoji: '✅' },
{ word: 'jump',  hint: 'Push off the ground',    emoji: '🦘' },
{ word: 'help',  hint: 'Do something for someone', emoji: '🆘' },
{ word: 'find',  hint: 'Look until you see it',  emoji: '🗺️' },
{ word: 'funny', hint: 'Makes you laugh',        emoji: '😂' },
{ word: 'good',  hint: 'The opposite of bad',    emoji: '👍' },
{ word: 'new',   hint: 'Not old',                emoji: '✨' },
{ word: 'over',  hint: 'Above or across',        emoji: '🌉' },
{ word: 'under', hint: 'Below something',        emoji: '⬇️' },
{ word: 'after', hint: 'Later than',             emoji: '🕐' },
{ word: 'first', hint: 'Number one in line',     emoji: '🥇' },
{ word: 'many',  hint: 'A big number of things', emoji: '🔢' },
{ word: 'down',  hint: 'Toward the ground',      emoji: '⤵️' },
```

### Sight words — Level 3 (add ~30)

```js
{ word: 'because',  hint: 'Gives the reason',            emoji: '💡' },
{ word: 'before',   hint: 'Earlier than',                emoji: '⏪' },
{ word: 'together', hint: 'With each other',             emoji: '👫' },
{ word: 'friend',   hint: 'Someone you like a lot',      emoji: '🧑‍🤝‍🧑' },
{ word: 'people',   hint: 'Lots of persons',             emoji: '👨‍👩‍👧‍👦' },
{ word: 'water',    hint: 'You drink it',                emoji: '💧' },
{ word: 'laugh',    hint: 'Ha ha ha!',                   emoji: '🤣' },
{ word: 'thought',  hint: 'An idea in your head',        emoji: '💭' },
{ word: 'through',  hint: 'In one side, out the other',  emoji: '🚇' },
{ word: 'enough',   hint: 'As much as you need',         emoji: '🈵' },
{ word: 'once',     hint: 'One time only',               emoji: '1️⃣' },
{ word: 'only',     hint: 'Just this, nothing else',     emoji: '☝️' },
{ word: 'always',   hint: 'Every single time',           emoji: '♾️' },
{ word: 'never',    hint: 'Not even one time',           emoji: '🚫' },
{ word: 'around',   hint: 'In a circle',                 emoji: '🔄' },
{ word: 'better',   hint: 'More good',                   emoji: '📈' },
{ word: 'carry',    hint: 'Hold it while you walk',      emoji: '🎒' },
{ word: 'clean',    hint: 'Not dirty',                   emoji: '🧼' },
{ word: 'draw',     hint: 'Make a picture',              emoji: '🖍️' },
{ word: 'drink',    hint: 'Swallow a liquid',            emoji: '🥤' },
{ word: 'eight',    hint: 'The number 8',                emoji: '8️⃣' },
{ word: 'grow',     hint: 'Get bigger',                  emoji: '🌱' },
{ word: 'hold',     hint: 'Keep it in your hands',       emoji: '🤲' },
{ word: 'kind',     hint: 'Nice to others',              emoji: '💗' },
{ word: 'light',    hint: 'Not dark, or not heavy',      emoji: '💡' },
{ word: 'myself',   hint: 'Me, on my own',               emoji: '🪞' },
{ word: 'shall',    hint: 'Will do it',                  emoji: '📜' },
{ word: 'show',     hint: 'Let someone see it',          emoji: '🎭' },
{ word: 'today',    hint: 'This very day',               emoji: '📅' },
{ word: 'warm',     hint: 'A little bit hot',            emoji: '☀️' },
```

Also restore emojis on the existing Level 1 sight words, e.g. `the 👑 (most common word!)`, `you 🫵`, `see 👀`, `like ❤️`, `one 1️⃣` — pick sensible ones for the rest.

### Phonics — Level 2 (long vowels, vowel teams, r-controlled)

```js
// magic-e
{ word: 'gate',  chunks: ['g','a','te'],  emoji: '🚧' },
{ word: 'kite',  chunks: ['k','i','te'],  emoji: '🪁' },
{ word: 'note',  chunks: ['n','o','te'],  emoji: '🎵' },
{ word: 'cube',  chunks: ['c','u','be'],  emoji: '🧊' },
{ word: 'wave',  chunks: ['w','a','ve'],  emoji: '🌊' },
{ word: 'five',  chunks: ['f','i','ve'],  emoji: '5️⃣' },
{ word: 'rose',  chunks: ['r','o','se'],  emoji: '🌹' },
// vowel teams
{ word: 'rain',  chunks: ['r','ai','n'],  emoji: '🌧️' },
{ word: 'boat',  chunks: ['b','oa','t'],  emoji: '⛵' },
{ word: 'seed',  chunks: ['s','ee','d'],  emoji: '🌱' },
{ word: 'moon',  chunks: ['m','oo','n'],  emoji: '🌕' },
{ word: 'team',  chunks: ['t','ea','m'],  emoji: '⚽' },
{ word: 'coat',  chunks: ['c','oa','t'],  emoji: '🧥' },
{ word: 'night', chunks: ['n','igh','t'], emoji: '🌃' },
{ word: 'light', chunks: ['l','igh','t'], emoji: '💡' },
{ word: 'snail', chunks: ['sn','ai','l'], emoji: '🐌' },
{ word: 'sheep', chunks: ['sh','ee','p'], emoji: '🐑' },
{ word: 'beach', chunks: ['b','ea','ch'], emoji: '🏖️' },
{ word: 'spoon', chunks: ['sp','oo','n'], emoji: '🥄' },
// r-controlled
{ word: 'car',   chunks: ['c','ar'],      emoji: '🚗' },
{ word: 'star',  chunks: ['st','ar'],     emoji: '⭐' },
{ word: 'bird',  chunks: ['b','ir','d'],  emoji: '🐦' },
{ word: 'corn',  chunks: ['c','or','n'],  emoji: '🌽' },
{ word: 'shark', chunks: ['sh','ar','k'], emoji: '🦈' },
```

### Phonics — Level 3 (syllable chunking)

```js
{ word: 'rabbit',    chunks: ['rab','bit'],        emoji: '🐰' },
{ word: 'sunset',    chunks: ['sun','set'],        emoji: '🌇' },
{ word: 'pancake',   chunks: ['pan','cake'],       emoji: '🥞' },
{ word: 'rainbow',   chunks: ['rain','bow'],       emoji: '🌈' },
{ word: 'popcorn',   chunks: ['pop','corn'],       emoji: '🍿' },
{ word: 'cupcake',   chunks: ['cup','cake'],       emoji: '🧁' },
{ word: 'spider',    chunks: ['spi','der'],        emoji: '🕷️' },
{ word: 'tiger',     chunks: ['ti','ger'],         emoji: '🐯' },
{ word: 'dragon',    chunks: ['drag','on'],        emoji: '🐉' },
{ word: 'monster',   chunks: ['mon','ster'],       emoji: '👾' },
{ word: 'butterfly', chunks: ['but','ter','fly'],  emoji: '🦋' },
{ word: 'dinosaur',  chunks: ['di','no','saur'],   emoji: '🦕' },
{ word: 'elephant',  chunks: ['el','e','phant'],   emoji: '🐘' },
{ word: 'umbrella',  chunks: ['um','brel','la'],   emoji: '☂️' },
{ word: 'fantastic', chunks: ['fan','tas','tic'],  emoji: '🎉' },
{ word: 'adventure', chunks: ['ad','ven','ture'],  emoji: '🗺️' },
```

Restore emojis on the existing Level 1 phonics words (`cat 🐱`, `dog 🐶`, `sun ☀️`, `frog 🐸`, etc.).

### Sentences — Level 2 (15 new)

```js
{ text: 'The little bird made a nest in the tall tree.',        emoji: '🐦' },
{ text: 'We went to the beach and found three white shells.',   emoji: '🐚' },
{ text: 'My friend has a green kite that flies very high.',     emoji: '🪁' },
{ text: 'The moon and stars come out when it is night.',        emoji: '🌙' },
{ text: 'She put on her red boots and jumped in puddles.',      emoji: '👢' },
{ text: 'Dad made pancakes for breakfast on Sunday morning.',   emoji: '🥞' },
{ text: 'The brave knight rode his horse to the old castle.',   emoji: '🏰' },
{ text: 'A rainbow came out after the rain stopped falling.',   emoji: '🌈' },
{ text: 'The children played hide and seek in the garden.',     emoji: '🌳' },
{ text: 'I read a funny book about a dog who could sing.',      emoji: '📖' },
{ text: 'The train goes fast through the dark tunnel.',         emoji: '🚂' },
{ text: 'We planted seeds and watered them every day.',         emoji: '🌱' },
{ text: 'The baby elephant splashed water with its trunk.',     emoji: '🐘' },
{ text: 'Grandma baked cookies and the house smelled sweet.',   emoji: '🍪' },
{ text: 'Look at the snowman with a carrot for a nose!',        emoji: '⛄' },
```

### Sentences — Level 3 (12 new)

```js
{ text: 'Yesterday we visited the museum and saw dinosaur bones that were millions of years old.', emoji: '🦕' },
{ text: 'If you listen carefully, you can hear the owl hooting in the forest at night.',           emoji: '🦉' },
{ text: 'The astronaut floated inside the spaceship and looked down at our beautiful blue planet.', emoji: '🚀' },
{ text: 'Although it was raining, the children decided to play outside with their umbrellas.',     emoji: '☔' },
{ text: 'My little brother laughed so hard that milk almost came out of his nose.',                emoji: '🥛' },
{ text: 'The clever fox waited quietly behind the bushes until the rabbit hopped away.',           emoji: '🦊' },
{ text: 'Before you go to sleep, remember to brush your teeth and choose a bedtime story.',        emoji: '🪥' },
{ text: 'The dragon was not scary at all; it just wanted someone to share its treasure with.',     emoji: '🐉' },
{ text: 'When summer comes, we will swim in the lake and eat ice cream by the shore.',             emoji: '🍦' },
{ text: 'The strawberry plants in our garden grew so many berries that we made jam.',              emoji: '🍓' },
{ text: 'Everyone clapped when the magician pulled a fluffy white rabbit out of his hat.',         emoji: '🎩' },
{ text: 'The library is my favourite place, because every book is a new adventure.',               emoji: '📚' },
```

---

## Phase 3 — New game modes

Six additions, in priority order. Each follows the existing pattern: a `render<Mode>(item, content, controls)` function, a queue built in `startMode`, stars + `showFeedback` + `nextQuestion` on completion. Add each as a card on the home screen grid.

### 3.1 📚 Story Time (highest priority — this is Mia's level)

Short illustrated stories read one sentence per page, followed by comprehension questions.

- **Flow:** title page (emoji + title + "Read the story!") → one sentence per page with big emoji, tap-a-word-to-hear (reuse the sentence-word mechanic) and a 🔊 "Read to me" button → after the last page, 2 multiple-choice comprehension questions → results. Each correct answer = 2 stars; finishing the story = 2 stars.
- **Data shape:**

```js
const STORIES = [
  {
    title: 'The Lost Kitten', emoji: '🐱', level: 2,
    pages: [
      { text: 'Mia heard a tiny sound outside the door.',            emoji: '🚪' },
      { text: 'It was a small grey kitten with big green eyes.',     emoji: '🐱' },
      { text: 'The kitten was cold and hungry.',                     emoji: '🥶' },
      { text: 'Mia gave it warm milk and a soft blanket.',           emoji: '🥛' },
      { text: 'Now the kitten sleeps on her bed every night.',       emoji: '😴' },
    ],
    questions: [
      { q: 'What did Mia hear outside the door?', options: ['A tiny sound', 'Loud music', 'A car horn'], answer: 0 },
      { q: 'What did Mia give the kitten?', options: ['A toy car', 'Warm milk and a blanket', 'A book'], answer: 1 },
    ],
  },
  {
    title: 'Oskar and the Dragon', emoji: '🐉', level: 2,
    pages: [
      { text: 'Oskar found a green egg in the forest.',              emoji: '🥚' },
      { text: 'He kept it warm under his woolly hat.',               emoji: '🧢' },
      { text: 'One morning the egg cracked open.',                   emoji: '💥' },
      { text: 'A baby dragon popped out and sneezed a tiny flame.',  emoji: '🔥' },
      { text: 'Oskar named him Spark, and they became best friends.', emoji: '🐉' },
    ],
    questions: [
      { q: 'Where did Oskar find the egg?', options: ['In the forest', 'At school', 'In the sea'], answer: 0 },
      { q: 'What did Oskar name the dragon?', options: ['Flame', 'Spark', 'Smoky'], answer: 1 },
    ],
  },
  {
    title: 'The Strawberry Garden', emoji: '🍓', level: 3,
    pages: [
      { text: 'In spring, Mia planted ten small strawberry plants in the garden.',       emoji: '🌱' },
      { text: 'Every morning she watered them before school.',                           emoji: '🚿' },
      { text: 'One day she saw something red hiding under the green leaves.',            emoji: '👀' },
      { text: 'The strawberries were ripe, sweet, and ready to pick!',                   emoji: '🍓' },
      { text: 'Mia shared them with Oskar, but she kept the biggest one for herself.',   emoji: '😋' },
    ],
    questions: [
      { q: 'When did Mia water the plants?', options: ['After dinner', 'Before school', 'At night'], answer: 1 },
      { q: 'Who got the biggest strawberry?', options: ['Oskar', 'Mum', 'Mia'], answer: 2 },
    ],
  },
  {
    title: 'A Trip to the Moon', emoji: '🚀', level: 3,
    pages: [
      { text: 'Oskar built a rocket out of boxes, tape, and one shiny button.',          emoji: '📦' },
      { text: 'He counted down: three, two, one... blast off!',                          emoji: '🚀' },
      { text: 'The rocket zoomed past the clouds and into the starry sky.',              emoji: '🌌' },
      { text: 'On the moon, he bounced higher than a kangaroo.',                         emoji: '🦘' },
      { text: 'He flew home in time for dinner, with moon dust still on his shoes.',     emoji: '🌕' },
    ],
    questions: [
      { q: 'What was the rocket made of?', options: ['Metal and glass', 'Boxes, tape, and a button', 'Wood and rope'], answer: 1 },
      { q: 'What was still on his shoes at dinner?', options: ['Moon dust', 'Mud', 'Sand'], answer: 0 },
    ],
  },
  {
    title: 'The Rainy Day Fort', emoji: '🌧️', level: 3,
    pages: [
      { text: 'It rained all day, so Mia and Oskar could not play outside.',             emoji: '🌧️' },
      { text: 'They built a huge fort with blankets, pillows, and chairs.',              emoji: '🏰' },
      { text: 'Inside the fort they read books with a torch.',                          emoji: '🔦' },
      { text: 'They ate biscuits and told each other silly jokes.',                     emoji: '🍪' },
      { text: 'When the sun came out, they did not even notice!',                       emoji: '☀️' },
    ],
    questions: [
      { q: 'Why did they stay inside?', options: ['It was snowing', 'It rained all day', 'It was too hot'], answer: 1 },
      { q: 'What did they use to read in the fort?', options: ['A torch', 'A candle', 'A lamp'], answer: 0 },
    ],
  },
];
```

### 3.2 🧩 Sentence Scramble

The words of a sentence appear shuffled as tappable chips; tap them in order to rebuild the sentence.

- Reuse `SENTENCES` filtered to ≤ 9 words for the current level.
- Tapped chips move into a "building" row; tapping a placed chip returns it to the pool. When all words are placed: correct → stars + confetti; wrong → gentle shake, chips return, sentence is read aloud once as a hint.
- A 🔊 button speaks the target sentence before/while building (this makes it a listening exercise too).

### 3.3 🕳️ Missing Word (cloze)

A sentence with one word blanked out; pick the right word from 3 options.

```js
const CLOZE = [
  // level 1
  { text: 'The ___ is shining in the sky.',            answer: 'sun',    options: ['sun', 'run', 'fun'],        emoji: '☀️' },
  { text: 'The cat drinks ___ from a bowl.',           answer: 'milk',   options: ['milk', 'mud', 'moon'],      emoji: '🐱' },
  { text: 'I put on my ___ when it rains.',            answer: 'coat',   options: ['coat', 'cake', 'coin'],     emoji: '🧥' },
  { text: 'A frog can ___ very high.',                 answer: 'jump',   options: ['jump', 'sleep', 'sing'],    emoji: '🐸' },
  { text: 'We sleep in a ___ at night.',               answer: 'bed',    options: ['bed', 'bus', 'box'],        emoji: '🛏️' },
  // level 2
  { text: 'The bird built a ___ in the tree.',         answer: 'nest',   options: ['nest', 'net', 'tent'],      emoji: '🐦' },
  { text: 'We use an ___ when it is raining.',         answer: 'umbrella', options: ['umbrella', 'elephant', 'orange'], emoji: '☔' },
  { text: 'The ___ swims deep in the sea.',            answer: 'shark',  options: ['shark', 'sheep', 'shirt'],  emoji: '🦈' },
  { text: 'At night the ___ glows in the dark sky.',   answer: 'moon',   options: ['moon', 'spoon', 'mouse'],   emoji: '🌕' },
  { text: 'She ate a sweet red ___ from the garden.',  answer: 'strawberry', options: ['strawberry', 'stone', 'spider'], emoji: '🍓' },
  // level 3
  { text: 'The knight was very ___ and fought the dragon.',       answer: 'brave',     options: ['brave', 'sleepy', 'hungry'],  emoji: '⚔️' },
  { text: 'We could not play outside ___ it was raining.',        answer: 'because',   options: ['because', 'before', 'behind'], emoji: '🌧️' },
  { text: 'The magician made the rabbit ___ into thin air.',      answer: 'disappear', options: ['disappear', 'dance', 'dinner'], emoji: '🎩' },
  { text: 'An ___ flies a spaceship far above the Earth.',        answer: 'astronaut', options: ['astronaut', 'artist', 'animal'], emoji: '🚀' },
  { text: 'Reading books is a wonderful ___ every single day.',   answer: 'adventure', options: ['adventure', 'accident', 'afternoon'], emoji: '📚' },
];
```

### 3.4 🎧 Sound Detective (also fixes the Sight Words mode)

The current Sight Words mode shows only a text hint and asks "which word matches?" — that tests hint-reading, not word recognition. Rebuild it around listening:

- A big 🔊 button auto-plays the target word via TTS on question start (and can be re-tapped).
- Four written words shown; tap the one you heard. Distractors should be *visually similar* words when possible (same first letter or same length) to make it a real discrimination task.
- Keep the emoji + hint visible as secondary support. Same reveal/feedback behaviour as today.

### 3.5 🎵 Rhyme Time

"Which word rhymes with **cat**?" — 3 options, all spoken on tap.

```js
const RHYMES = [
  { prompt: 'cat',   answer: 'hat',   options: ['hat', 'dog', 'cup'],    emoji: '🐱' },
  { prompt: 'frog',  answer: 'log',   options: ['log', 'leaf', 'lake'],  emoji: '🐸' },
  { prompt: 'moon',  answer: 'spoon', options: ['spoon', 'star', 'sun'], emoji: '🌕' },
  { prompt: 'cake',  answer: 'snake', options: ['snake', 'cook', 'kite'], emoji: '🍰' },
  { prompt: 'star',  answer: 'car',   options: ['car', 'ship', 'sky'],   emoji: '⭐' },
  { prompt: 'bed',   answer: 'red',   options: ['red', 'blue', 'bad'],   emoji: '🛏️' },
  { prompt: 'goat',  answer: 'boat',  options: ['boat', 'cow', 'gate'],  emoji: '🐐' },
  { prompt: 'night', answer: 'light', options: ['light', 'dark', 'note'], emoji: '🌃' },
  { prompt: 'bee',   answer: 'tree',  options: ['tree', 'bug', 'ant'],   emoji: '🐝' },
  { prompt: 'mouse', answer: 'house', options: ['house', 'hole', 'cat'], emoji: '🐭' },
  { prompt: 'rain',  answer: 'train', options: ['train', 'cloud', 'ran'], emoji: '🌧️' },
  { prompt: 'king',  answer: 'ring',  options: ['ring', 'crown', 'kind'], emoji: '👑' },
];
```

### 3.6 ⚡ Flash Words

A word flashes on screen briefly, then hides — pick what you saw from 4 options. Builds sight-word automaticity.

- Uses the sight-word list for the current level. Flash duration by level: L1 1500ms, L2 1000ms, L3 700ms.
- A 👁️ "show again" button allows one extra peek (no star penalty — keep it kind).

### Home screen with 9 modes

Group the grid with two small section labels: **Read** (Story Time, Sentences, Flash Words) and **Play with Words** (Sound Detective, Phonics, Spelling, Rhyme Time, Missing Word, Sentence Scramble). Keep the 2-column card grid.

### Spelling mode improvement

Speak the word via TTS when the question appears (plus a replay 🔊 button) instead of relying only on the hint text. On a wrong attempt, show a brief "Try again! 🙈" message with the shake, and after 2 failed attempts reveal the first letter as a hint.

---

## Phase 4 — Visual refresh

1. **Typography.** Bundle one friendly open-licence font as a local WOFF2 in `fonts/` (no external requests at runtime): **Andika** (SIL, designed for beginning readers — clear single-storey `a`, distinct `b/d`) for reading text, and optionally **Baloo 2** for headings. If font files can't be obtained in the coding environment, fall back to the system stack `'Comic Sans MS', 'Segoe UI', system-ui, sans-serif` for reading text — do not hotlink Google Fonts.
2. **Per-profile theming.** Set a CSS `--accent` variable at load: Mia → strawberry pink `#FF5C8D` with 🍓, Oskar → dragon green `#2E9E5B` with 🐉. Use it for the home header gradient, progress fill, buttons, and current-word highlight. Keep purple as the neutral base for shared UI.
3. **Home screen polish.** Softer, larger header with the profile emoji + greeting; floating decorative emoji (⭐📖✨) drifting slowly in the header background via CSS animation; mode cards get a per-mode pastel tint and a slight lift on press.
4. **In-game polish.** Star fly-to-score animation when a star is earned (small ⭐ animates from the answer to the score counter); progress dots become little stars; feedback overlay keeps confetti but restore its emoji (🎉🌟🥳👏💫 for positive, 💪🙈🤔 for gentle negative).
5. **Results screen.** Stars fill one-by-one with a pop animation; show "New record!" when the session score beats the profile's best (store `lr_<name>_best_<mode>`).
6. **`index.html` picker.** Match the app theme (same gradient/fonts), replace the letter avatars with big 🍓 and 🐉 emoji avatars, and show each child's star count under their name (read from localStorage).
7. **Reading ergonomics.** Sentence/story text ≥ 28px, line-height ≥ 1.6, `letter-spacing: 0.02em`, max ~12 words per line.

---

## Phase 5 — Rewards: sticker book & streaks

- **Sticker book 🏅** — every 10 stars earns one random sticker from themed emoji sets (animals 🦊🐢🦄🐙, space 🪐🌟🛸☄️, treats 🧁🍭🍩🍉, magic 🧚🦄🌈✨). Prefer stickers the child doesn't own yet. A "Stickers" button on the home screen opens a collection grid (owned stickers bright, unowned as dimmed ❓ silhouettes). Earning a sticker shows a celebratory "You earned a sticker!" overlay with confetti.
- **Streak 🔥** — a day counts if ≥ 10 words were completed. Show current streak on the home screen; at 3, 5, 10, 30 days award a bonus sticker.
- All stored per-profile via the Phase 1 helper.

## Stretch ideas (do not implement now — noted for later)

- **Read-aloud checking** with `SpeechRecognition` (child reads the sentence, app listens). Chrome-only, needs network — experimental toggle only.
- **Estonian mode** — the same engine with Estonian word lists for reading practice in her other language; or an optional Estonian translation reveal on word cards.
- **Parent dashboard** — a simple stats page (words per day, tricky words) behind a long-press.
- **Custom word lists** — a parent screen to add the week's school spelling words via a URL parameter or a small editor.

---

## Suggested implementation order & verification

| Step | Scope | Verify by |
|------|-------|-----------|
| 1 | Phase 0 bug fixes | No console errors on `app.html?name=Mia`; progress bar renders on load; app works offline after first visit |
| 2 | Phase 1 profiles & levels | Mia and Oskar have independent progress; level persists per profile |
| 3 | Phase 2 data + `data.js` | Each level serves its own content in all existing modes |
| 4 | Phase 3 modes (Story Time first) | Play each mode end-to-end at each level on a phone-sized viewport |
| 5 | Phase 4 visuals | Screenshot home, one game, results, picker at 390×844 |
| 6 | Phase 5 rewards | Earn a sticker; streak increments across a simulated day change |

Keep commits small (one phase or sub-feature per commit). After every phase, manually run through one full game session in a browser before moving on.
