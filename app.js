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
let currentMember = null;
let correctCount  = 0;   // 今周の正解数
let missedMembers = [];  // 今周の不正解メンバー { member, yourColors }

// selected: 最大2要素。同じ色名を2つ格納可能。[0]=スロット① [1]=スロット②
let selected = [];
let judged   = false;

// シャッフルデッキ
let deck      = [];
let deckIndex = 0;   // 次に出すインデックス（1〜MEMBERS.length の間を指す）

/** Fisher-Yates シャッフル */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 新しい1周分のデッキを生成。前周末尾と先頭が被らないよう調整 */
function buildDeck(avoidFirst) {
  let d = shuffle(MEMBERS);
  if (avoidFirst && d[0] === avoidFirst) {
    const swapIdx = d.findIndex(m => m !== avoidFirst);
    if (swapIdx > 0) [d[0], d[swapIdx]] = [d[swapIdx], d[0]];
  }
  return d;
}

// ===== DOM =====
const correctCountEl   = document.getElementById('correctCount');
const correctTotalEl   = document.getElementById('correctTotal');
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
// 周回終了オーバーレイ
const roundOverlay     = document.getElementById('roundOverlay');
const roundEmoji       = document.getElementById('roundEmoji');
const roundTitle       = document.getElementById('roundTitle');
const roundScore       = document.getElementById('roundScore');
const roundMissSection = document.getElementById('roundMissSection');
const roundMissList    = document.getElementById('roundMissList');
const btnRestart       = document.getElementById('btnRestart');

// ===== 初期化 =====
function init() {
  injectKeyframes();
  buildTileGrid();
  correctTotalEl.textContent = MEMBERS.length;
  deck      = buildDeck(null);
  deckIndex = 0;
  btnJudge.addEventListener('click', judge);
  btnNext.addEventListener('click', onNextClick);
  btnRestart.addEventListener('click', startNewRound);
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
function onTileClick(colorName) {
  if (judged) return;
  const count = selected.filter(n => n === colorName).length;

  if (count === 0) {
    if (selected.length < 2) {
      selected.push(colorName);
    } else {
      selected.shift();
      selected.push(colorName);
    }
  } else if (count === 1) {
    if (selected.length < 2) {
      selected.push(colorName);
    } else {
      selected.splice(selected.indexOf(colorName), 1);
    }
  } else {
    selected = [];
  }

  refreshTiles();
  refreshSlots();
}

// ===== タイルの見た目 =====
function refreshTiles() {
  document.querySelectorAll('.color-tile').forEach(tile => {
    const name  = tile.dataset.colorName;
    const badge = tile.querySelector('.tile-badge');
    const count = selected.filter(n => n === name).length;

    tile.classList.remove('selected-1', 'selected-2', 'selected-both');
    badge.textContent = '';

    if (count === 2) {
      tile.classList.add('selected-both');
      badge.textContent = '①②';
    } else if (count === 1) {
      if (selected[0] === name && selected[1] !== name) {
        tile.classList.add('selected-1');
        badge.textContent = '①';
      } else {
        tile.classList.add('selected-2');
        badge.textContent = '②';
      }
    }
  });
}

// ===== スロット表示 =====
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

// ===== ペンライト =====
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

// ===== 次のメンバーへ（内部） =====
function nextMember() {
  judged   = false;
  selected = [];

  currentMember = deck[deckIndex];
  deckIndex++;

  memberNameEl.style.opacity = '0';
  setTimeout(() => {
    memberNameEl.textContent = currentMember.name;
    memberNameEl.style.opacity = '1';
  }, 160);

  resetPenlight();

  document.querySelectorAll('.color-tile').forEach(t => {
    t.classList.remove('selected-1', 'selected-2', 'selected-both', 'judged');
    t.querySelector('.tile-badge').textContent = '';
  });

  refreshSlots();
  tileSectionEl.classList.remove('hidden');
  resultSection.classList.add('hidden');
  btnJudge.classList.remove('hidden');
  btnNext.classList.add('hidden');
}

// ===== 「次のメンバーへ」ボタン押下 =====
// 最後のメンバーを判定した後に押したら周回終了画面、それ以外は次問へ
function onNextClick() {
  if (deckIndex >= deck.length) {
    // 1周完了 → 周回終了画面を表示
    showRoundSummary();
  } else {
    nextMember();
  }
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

  document.querySelectorAll('.color-tile').forEach(t => t.classList.add('judged'));

  const answer  = [...selected].sort();
  const correct = [...currentMember.colors].sort();
  const isCorrect = answer[0] === correct[0] && answer[1] === correct[1];

  lightPenlight(currentMember.colors[0], currentMember.colors[1]);

  tileSectionEl.classList.add('hidden');
  showQuestionResult(isCorrect);

  if (isCorrect) {
    correctCount++;
    launchConfetti();
  } else {
    // 不正解記録（答えた色も一緒に保存）
    missedMembers.push({ member: currentMember, yourColors: [...selected] });
  }
  updateCorrectCount();

  btnJudge.classList.add('hidden');
  // 最後の問題なら「結果を見る」、そうでなければ「次のメンバーへ」
  btnNext.textContent = (deckIndex >= deck.length) ? '結果を見る 📋' : '次のメンバーへ →';
  btnNext.classList.remove('hidden');
}

// ===== 問題ごとの正誤表示 =====
function showQuestionResult(isCorrect) {
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

// ===== 周回終了サマリー表示 =====
function showRoundSummary() {
  const total    = MEMBERS.length;
  const isPerfect = correctCount === total;

  // 絵文字・タイトル
  roundEmoji.textContent = isPerfect ? '🎉' : correctCount >= total * 0.8 ? '🌸' : '💪';
  roundTitle.textContent = isPerfect
    ? '全問正解！完璧です！'
    : `1周お疲れさまでした！`;

  // スコア
  roundScore.innerHTML = `
    <span class="round-score-num">${correctCount}</span>
    <span class="round-score-sep">/</span>
    <span class="round-score-total">${total}</span>
    <span class="round-score-label">正解</span>
  `;

  // 不正解リスト
  if (missedMembers.length === 0) {
    roundMissSection.classList.add('hidden');
  } else {
    roundMissSection.classList.remove('hidden');
    roundMissList.innerHTML = '';
    missedMembers.forEach(({ member, yourColors }) => {
      const row = document.createElement('div');
      row.className = 'miss-row';

      // 正解チップ
      const chipsHTML = member.colors.map(cName => {
        const c = COLOR_MAP[cName];
        return `
          <div class="miss-chip">
            <div class="miss-dot${c.code === '#ffffff' ? ' white-dot' : ''}"
                 style="background-color:${c.code}"></div>
            <span class="miss-color-name">${c.name}</span>
          </div>`;
      }).join('');

      row.innerHTML = `
        <span class="miss-name">${member.name}</span>
        <div class="miss-colors">${chipsHTML}</div>
      `;
      roundMissList.appendChild(row);
    });
  }

  // 全員正解なら大コンフェッティ
  if (isPerfect) launchConfetti(80);

  roundOverlay.classList.remove('hidden');
}

// ===== 新しい周を開始 =====
function startNewRound() {
  roundOverlay.classList.add('hidden');

  const lastMember = deck[deck.length - 1];
  deck         = buildDeck(lastMember);
  deckIndex    = 0;
  correctCount = 0;
  missedMembers= [];
  updateCorrectCount();

  nextMember();
}

// ===== 正解数カウンター =====
function updateCorrectCount() {
  correctCountEl.textContent = correctCount;
  correctCountEl.classList.remove('bump');
  void correctCountEl.offsetWidth;
  correctCountEl.classList.add('bump');
  setTimeout(() => correctCountEl.classList.remove('bump'), 260);
}

// ===== コンフェッティ =====
function launchConfetti(count = 50) {
  confettiCont.innerHTML = '';
  const palette = ['#da70d6','#ff69b4','#fffacd','#b0e0e6','#98fb98','#ffffff','#f5d0f3'];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left              = Math.random() * 100 + 'vw';
    el.style.animationDuration = (.55 + Math.random() * .85) + 's';
    el.style.animationDelay    = (Math.random() * .5) + 's';
    el.style.backgroundColor   = palette[Math.floor(Math.random() * palette.length)];
    el.style.transform         = `rotate(${Math.random() * 360}deg)`;
    const sz = 5 + Math.random() * 8;
    el.style.width = sz + 'px'; el.style.height = sz + 'px';
    confettiCont.appendChild(el);
  }
  setTimeout(() => { confettiCont.innerHTML = ''; }, 2600);
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
    position:'fixed', bottom:'90px', left:'50%',
    transform:'translateX(-50%)',
    background:'rgba(26,26,46,.88)', color:'#fff',
    padding:'10px 20px', borderRadius:'50px',
    fontSize:'.82rem', fontWeight:'600',
    fontFamily:'var(--font-sans)',
    zIndex:'9999', whiteSpace:'nowrap',
    boxShadow:'0 4px 16px rgba(0,0,0,.25)',
    animation:'toastIn .2s ease',
  });
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1800);
}

// ===== キーフレーム注入 =====
function injectKeyframes() {
  const s = document.createElement('style');
  s.textContent = `
    @keyframes shake {
      0%,100%{ transform:translateX(0); }
      20%    { transform:translateX(-6px); }
      40%    { transform:translateX(6px);  }
      60%    { transform:translateX(-4px); }
      80%    { transform:translateX(4px);  }
    }
    @keyframes toastIn {
      from { opacity:0; transform:translateX(-50%) translateY(6px); }
      to   { opacity:1; transform:translateX(-50%) translateY(0);   }
    }
  `;
  document.head.appendChild(s);
}

// ===== 起動 =====
init();
