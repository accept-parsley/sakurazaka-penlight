/* ============================================================
   SakuraColor  /  app.js
   ============================================================ */

// ===== マスタデータ =====

const COLORS = [
  { id:  1, name: "ホワイト",           code: "#ffffff" },
  { id:  2, name: "サクラピンク",        code: "#da70d6" },
  { id:  3, name: "グリーン",            code: "#00ff00" },
  { id:  4, name: "イエロー",            code: "#ffff00" },
  { id:  5, name: "レッド",              code: "#ff0000" },
  { id:  6, name: "パステルブルー",      code: "#00ffff" },
  { id:  7, name: "パープル",            code: "#6a5acd" },
  { id:  8, name: "ピンク",              code: "#ff00ff" },
  { id:  9, name: "エメラルドグリーン",  code: "#7fffd4" },
  { id: 10, name: "ライトグリーン",      code: "#adff2f" },
  { id: 11, name: "バイオレット",        code: "#8a2be2" },
  { id: 12, name: "パールグリーン",      code: "#00fa9a" },
  { id: 13, name: "パッションピンク",    code: "#ff1493" },
  { id: 14, name: "オレンジ",            code: "#ff8c00" },
  { id: 15, name: "ブルー",              code: "#0000ff" },
];

const COLOR_MAP = {};
COLORS.forEach(c => { COLOR_MAP[c.name] = c; });

const MEMBERS = [
  { name: "遠藤 光莉",   colors: ["パープル",          "パープル"]           },
  { name: "大園 玲",     colors: ["バイオレット",       "バイオレット"]       },
  { name: "大沼 晶保",   colors: ["イエロー",           "パステルブルー"]     },
  { name: "幸阪 茉里乃", colors: ["サクラピンク",       "パールグリーン"]     },
  { name: "武元 唯衣",   colors: ["パッションピンク",   "ブルー"]             },
  { name: "田村 保乃",   colors: ["パステルブルー",     "パステルブルー"]     },
  { name: "藤吉 夏鈴",   colors: ["ホワイト",           "バイオレット"]       },
  { name: "増本 綺良",   colors: ["オレンジ",           "オレンジ"]           },
  { name: "松田 里奈",   colors: ["グリーン",           "イエロー"]           },
  { name: "森田 ひかる", colors: ["レッド",             "ブルー"]             },
  { name: "守屋 麗奈",   colors: ["イエロー",           "ピンク"]             },
  { name: "山﨑 天",     colors: ["ホワイト",           "グリーン"]           },
  { name: "石森 璃花",   colors: ["グリーン",           "ピンク"]             },
  { name: "遠藤 理子",   colors: ["サクラピンク",       "バイオレット"]       },
  { name: "小田倉 麗奈", colors: ["ホワイト",           "パッションピンク"]   },
  { name: "小島 凪紗",   colors: ["パステルブルー",     "オレンジ"]           },
  { name: "谷口 愛季",   colors: ["レッド",             "パープル"]           },
  { name: "中嶋 優月",   colors: ["ピンク",             "ピンク"]             },
  { name: "的野 美青",   colors: ["パステルブルー",     "ブルー"]             },
  { name: "向井 純葉",   colors: ["パステルブルー",     "エメラルドグリーン"] },
  { name: "村井 優",     colors: ["パープル",           "ブルー"]             },
  { name: "村山 美羽",   colors: ["パープル",           "バイオレット"]       },
  { name: "山下 瞳月",   colors: ["レッド",             "パステルブルー"]     },
  { name: "浅井 恋乃未", colors: ["レッド",             "エメラルドグリーン"] },
  { name: "稲熊 ひな",   colors: ["エメラルドグリーン", "オレンジ"]           },
  { name: "勝又 春",     colors: ["サクラピンク",       "レッド"]             },
  { name: "佐藤 愛桜",   colors: ["サクラピンク",       "パステルブルー"]     },
  { name: "中川 智尋",   colors: ["イエロー",           "バイオレット"]       },
  { name: "松本 和子",   colors: ["ホワイト",           "エメラルドグリーン"] },
  { name: "目黒 陽色",   colors: ["サクラピンク",       "パッションピンク"]   },
  { name: "山川 宇衣",   colors: ["ホワイト",           "パステルブルー"]     },
  { name: "山田 桃実",   colors: ["パステルブルー",     "バイオレット"]       },
];

// ===== 状態 =====
let currentMember  = null;
let previousMember = null;
let streak         = 0;
// selected = 最大2要素の配列。同じ色名を2つ格納可能。
// selected[0] = スロット①, selected[1] = スロット②
let selected = [];
let judged   = false;

// ===== DOM =====
const streakCountEl    = document.getElementById('streakCount');
const memberNameEl     = document.getElementById('memberName');
const stick1El         = document.getElementById('stick1');
const stick2El         = document.getElementById('stick2');
const slot1El          = document.getElementById('slot1');
const slot2El          = document.getElementById('slot2');
const slotDot1         = document.getElementById('slotDot1');
const slotDot2         = document.getElementById('slotDot2');
const slotText1        = document.getElementById('slotText1');
const slotText2        = document.getElementById('slotText2');
const tileSectionEl    = document.getElementById('tileSection');
const tileGridEl       = document.getElementById('tileGrid');
const resultSection    = document.getElementById('resultSection');
const resultBanner     = document.getElementById('resultBanner');
const resultIcon       = document.getElementById('resultIcon');
const resultText       = document.getElementById('resultText');
const correctColorsRow = document.getElementById('correctColorsRow');
const btnJudge         = document.getElementById('btnJudge');
const btnNext          = document.getElementById('btnNext');
const confettiCont     = document.getElementById('confettiContainer');

// ===== 初期化 =====
function init() {
  injectKeyframes();
  buildTileGrid();
  btnJudge.addEventListener('click', judge);
  btnNext.addEventListener('click', nextMember);
  nextMember();
}

// ===== タイルグリッド構築 =====
function buildTileGrid() {
  tileGridEl.innerHTML = '';
  COLORS.forEach(c => {
    const tile = document.createElement('div');
    tile.className = 'color-tile';
    tile.dataset.colorName = c.name;
    const isWhite = c.code === '#ffffff';
    tile.innerHTML = `
      <div class="tile-circle${isWhite ? ' white-circle' : ''}"
           style="background-color:${c.code}"></div>
      <div class="tile-label">
        <span class="tile-num">${c.id}.</span>
        <span class="tile-name">${c.name}</span>
      </div>
      <div class="tile-badge"></div>
    `;
    tile.addEventListener('click', () => onTileClick(c.name));
    tileGridEl.appendChild(tile);
  });
}

// ===== タイルクリック =====
// ルール:
//   出現回数0 → 空きスロットに追加 (空きなければ最古をFIFO)
//   出現回数1 & スロットに空きあり → 同じ色を2つ目に追加 (同色2選択)
//   出現回数1 & スロットが埋まっている → その1つを削除
//   出現回数2 → 両方クリア
function onTileClick(colorName) {
  if (judged) return;
  const count = selected.filter(n => n === colorName).length;

  if (count === 0) {
    if (selected.length < 2) {
      selected.push(colorName);
    } else {
      // 両スロット埋まり → 先頭を外して追加
      selected.shift();
      selected.push(colorName);
    }
  } else if (count === 1) {
    if (selected.length < 2) {
      // もう1スロット空き → 同じ色を2回目に追加
      selected.push(colorName);
    } else {
      // 両スロット埋まり → この色を1つ削除
      const idx = selected.indexOf(colorName);
      selected.splice(idx, 1);
    }
  } else {
    // count === 2 → 両方解除
    selected = [];
  }

  refreshTiles();
  refreshSlots();
}

// ===== タイルの見た目を更新 =====
function refreshTiles() {
  document.querySelectorAll('.color-tile').forEach(tile => {
    const name  = tile.dataset.colorName;
    const badge = tile.querySelector('.tile-badge');
    const count = selected.filter(n => n === name).length;
    const isFirst  = selected[0] === name;
    const isSecond = selected[1] === name;

    tile.classList.remove('selected-1', 'selected-2', 'selected-both');
    badge.textContent = '';

    if (count === 2) {
      tile.classList.add('selected-both');
      badge.textContent = '①②';
    } else if (count === 1) {
      if (isFirst && !isSecond) {
        tile.classList.add('selected-1');
        badge.textContent = '①';
      } else {
        tile.classList.add('selected-2');
        badge.textContent = '②';
      }
    }
  });
}

// ===== スロット表示を更新 =====
function refreshSlots() {
  setSlot(slot1El, slotDot1, slotText1, selected[0], '① 未選択');
  setSlot(slot2El, slotDot2, slotText2, selected[1], '② 未選択');
}

function setSlot(slotEl, dotEl, textEl, colorName, placeholder) {
  if (colorName) {
    const c = COLOR_MAP[colorName];
    dotEl.style.backgroundColor = c.code;
    dotEl.classList.toggle('white-dot', c.code === '#ffffff');
    textEl.textContent = `${c.id}. ${c.name}`;
    slotEl.classList.add('filled');
  } else {
    dotEl.style.backgroundColor = '#ddd';
    dotEl.classList.remove('white-dot');
    textEl.textContent = placeholder;
    slotEl.classList.remove('filled');
  }
}

// ===== ペンライト点灯 =====
function lightPenlight(name1, name2) {
  [[stick1El, name1], [stick2El, name2]].forEach(([el, name]) => {
    const c = COLOR_MAP[name];
    if (c) {
      el.style.backgroundColor = c.code;
      el.classList.add('lit');
      el.style.setProperty('--glow', c.code + 'aa');
    } else {
      el.style.backgroundColor = '#ddd';
      el.classList.remove('lit');
    }
  });
}

function resetPenlight() {
  [stick1El, stick2El].forEach(el => {
    el.style.backgroundColor = '#ddd';
    el.classList.remove('lit');
  });
}

// ===== 次のメンバーへ =====
function nextMember() {
  judged   = false;
  selected = [];

  // 前回と異なるメンバーを選ぶ
  const pool = MEMBERS.filter(m => m !== previousMember);
  currentMember  = pool[Math.floor(Math.random() * pool.length)];
  previousMember = currentMember;

  // メンバー名フェード切り替え
  memberNameEl.style.opacity = '0';
  setTimeout(() => {
    memberNameEl.textContent = currentMember.name;
    memberNameEl.style.opacity = '1';
  }, 160);

  resetPenlight();

  // タイルリセット
  document.querySelectorAll('.color-tile').forEach(t => {
    t.classList.remove('selected-1', 'selected-2', 'selected-both', 'judged');
    t.querySelector('.tile-badge').textContent = '';
  });

  refreshSlots();

  // タイルを表示、結果を隠す
  tileSectionEl.classList.remove('hidden');
  resultSection.classList.add('hidden');

  btnJudge.classList.remove('hidden');
  btnNext.classList.add('hidden');
}

// ===== 判定 =====
function judge() {
  if (judged) return;

  if (selected.length < 2) {
    shakeEl(btnJudge);
    showToast('2色を選んでください');
    return;
  }

  judged = true;

  // タイルを不活性化（選択済みは表示維持）
  document.querySelectorAll('.color-tile').forEach(t => t.classList.add('judged'));

  // 順不同で正誤判定
  const answer  = [...selected].sort();
  const correct = [...currentMember.colors].sort();
  const isCorrect = answer[0] === correct[0] && answer[1] === correct[1];

  // 正解色でペンライト点灯
  lightPenlight(currentMember.colors[0], currentMember.colors[1]);

  // タイル → 結果 に切り替え
  tileSectionEl.classList.add('hidden');
  showResult(isCorrect);

  // 連続正解更新
  streak = isCorrect ? streak + 1 : 0;
  updateStreak();
  if (isCorrect) launchConfetti();

  btnJudge.classList.add('hidden');
  btnNext.classList.remove('hidden');
}

// ===== 結果表示 =====
function showResult(isCorrect) {
  resultSection.classList.remove('hidden');

  if (isCorrect) {
    resultBanner.className = 'result-banner correct';
    resultIcon.textContent = '🌸';
    resultText.textContent = '正解！';
  } else {
    resultBanner.className = 'result-banner incorrect';
    resultIcon.textContent = '💦';
    resultText.textContent = '不正解…';
  }

  // 正解色チップ — 2色それぞれ表示（同色でも2つ並べる）
  correctColorsRow.innerHTML = '';
  currentMember.colors.forEach(cName => {
    const c = COLOR_MAP[cName];
    const chip = document.createElement('div');
    chip.className = 'color-chip';
    chip.innerHTML = `
      <div class="color-chip-dot${c.code === '#ffffff' ? ' white-chip' : ''}"
           style="background-color:${c.code}"></div>
      <span class="color-chip-num">${c.id}.</span>
      <span class="color-chip-name">${c.name}</span>
    `;
    correctColorsRow.appendChild(chip);
  });
}

// ===== ストリーク更新 =====
function updateStreak() {
  streakCountEl.textContent = streak;
  streakCountEl.classList.remove('bump');
  void streakCountEl.offsetWidth;
  streakCountEl.classList.add('bump');
  setTimeout(() => streakCountEl.classList.remove('bump'), 260);
}

// ===== コンフェッティ =====
function launchConfetti() {
  confettiCont.innerHTML = '';
  const palette = ['#da70d6','#ff69b4','#fffacd','#b0e0e6','#98fb98','#ffffff','#f5d0f3'];
  for (let i = 0; i < 50; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left              = Math.random() * 100 + 'vw';
    el.style.animationDuration = (.55 + Math.random() * .85) + 's';
    el.style.animationDelay    = (Math.random() * .45) + 's';
    el.style.backgroundColor   = palette[Math.floor(Math.random() * palette.length)];
    el.style.transform         = `rotate(${Math.random() * 360}deg)`;
    const sz = 5 + Math.random() * 8;
    el.style.width  = sz + 'px';
    el.style.height = sz + 'px';
    confettiCont.appendChild(el);
  }
  setTimeout(() => { confettiCont.innerHTML = ''; }, 2400);
}

// ===== シェイク =====
function shakeEl(el) {
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = 'shake .3s ease';
}

// ===== トースト =====
function showToast(msg) {
  document.querySelector('.sc-toast')?.remove();
  const t = document.createElement('div');
  t.className = 'sc-toast';
  t.textContent = msg;
  Object.assign(t.style, {
    position: 'fixed', bottom: '90px', left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(26,26,46,.88)', color: '#fff',
    padding: '10px 20px', borderRadius: '50px',
    fontSize: '.82rem', fontWeight: '600',
    fontFamily: 'var(--font-sans)',
    zIndex: '9999', whiteSpace: 'nowrap',
    boxShadow: '0 4px 16px rgba(0,0,0,.25)',
    animation: 'toastIn .2s ease',
  });
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1800);
}

// ===== キーフレーム注入 =====
function injectKeyframes() {
  const s = document.createElement('style');
  s.textContent = `
    @keyframes shake {
      0%,100%{ transform: translateX(0); }
      20%    { transform: translateX(-6px); }
      40%    { transform: translateX(6px);  }
      60%    { transform: translateX(-4px); }
      80%    { transform: translateX(4px);  }
    }
    @keyframes toastIn {
      from { opacity: 0; transform: translateX(-50%) translateY(6px); }
      to   { opacity: 1; transform: translateX(-50%) translateY(0);   }
    }
  `;
  document.head.appendChild(s);
}

// ===== 起動 =====
init();
