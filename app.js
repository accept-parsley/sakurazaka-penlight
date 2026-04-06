/* ============================================================
   櫻坂46 ペンライトカラー学習アプリ  /  app.js
   ============================================================ */

// ===== マスタデータ =====

const COLORS = [
  { id:  1, name: "ホワイト",         code: "#ffffff" },
  { id:  2, name: "サクラピンク",      code: "#da70d6" },
  { id:  3, name: "グリーン",          code: "#00ff00" },
  { id:  4, name: "イエロー",          code: "#ffff00" },
  { id:  5, name: "レッド",            code: "#ff0000" },
  { id:  6, name: "パステルブルー",    code: "#00ffff" },
  { id:  7, name: "パープル",          code: "#6a5acd" },
  { id:  8, name: "ピンク",            code: "#ff00ff" },
  { id:  9, name: "エメラルドグリーン", code: "#7fffd4" },
  { id: 10, name: "ライトグリーン",    code: "#adff2f" },
  { id: 11, name: "バイオレット",      code: "#8a2be2" },
  { id: 12, name: "パールグリーン",    code: "#00fa9a" },
  { id: 13, name: "パッションピンク",  code: "#ff1493" },
  { id: 14, name: "オレンジ",          code: "#ff8c00" },
  { id: 15, name: "ブルー",            code: "#0000ff" },
];

// 色名 → COLORS オブジェクト の高速ルックアップ
const COLOR_MAP = {};
COLORS.forEach(c => { COLOR_MAP[c.name] = c; });

const MEMBERS = [
  { name: "遠藤 光莉",   colors: ["パープル",       "パープル"]       },
  { name: "大園 玲",     colors: ["バイオレット",    "バイオレット"]   },
  { name: "大沼 晶保",   colors: ["イエロー",        "パステルブルー"] },
  { name: "幸阪 茉里乃", colors: ["サクラピンク",    "パールグリーン"] },
  { name: "武元 唯衣",   colors: ["パッションピンク","ブルー"]         },
  { name: "田村 保乃",   colors: ["パステルブルー",  "パステルブルー"] },
  { name: "藤吉 夏鈴",   colors: ["ホワイト",        "バイオレット"]   },
  { name: "増本 綺良",   colors: ["オレンジ",        "オレンジ"]       },
  { name: "松田 里奈",   colors: ["グリーン",        "イエロー"]       },
  { name: "森田 ひかる", colors: ["レッド",          "ブルー"]         },
  { name: "守屋 麗奈",   colors: ["イエロー",        "ピンク"]         },
  { name: "山﨑 天",     colors: ["ホワイト",        "グリーン"]       },
  { name: "石森 璃花",   colors: ["グリーン",        "ピンク"]         },
  { name: "遠藤 理子",   colors: ["サクラピンク",    "バイオレット"]   },
  { name: "小田倉 麗奈", colors: ["ホワイト",        "パッションピンク"]},
  { name: "小島 凪紗",   colors: ["パステルブルー",  "オレンジ"]       },
  { name: "谷口 愛季",   colors: ["レッド",          "パープル"]       },
  { name: "中嶋 優月",   colors: ["ピンク",          "ピンク"]         },
  { name: "的野 美青",   colors: ["パステルブルー",  "ブルー"]         },
  { name: "向井 純葉",   colors: ["パステルブルー",  "エメラルドグリーン"]},
  { name: "村井 優",     colors: ["パープル",        "ブルー"]         },
  { name: "村山 美羽",   colors: ["パープル",        "バイオレット"]   },
  { name: "山下 瞳月",   colors: ["レッド",          "パステルブルー"] },
  { name: "浅井 恋乃未", colors: ["レッド",          "エメラルドグリーン"]},
  { name: "稲熊 ひな",   colors: ["エメラルドグリーン","オレンジ"]     },
  { name: "勝又 春",     colors: ["サクラピンク",    "レッド"]         },
  { name: "佐藤 愛桜",   colors: ["サクラピンク",    "パステルブルー"] },
  { name: "中川 智尋",   colors: ["イエロー",        "バイオレット"]   },
  { name: "松本 和子",   colors: ["ホワイト",        "エメラルドグリーン"]},
  { name: "目黒 陽色",   colors: ["サクラピンク",    "パッションピンク"]},
  { name: "山川 宇衣",   colors: ["ホワイト",        "パステルブルー"] },
  { name: "山田 桃実",   colors: ["パステルブルー",  "バイオレット"]   },
];

// ===== 状態管理 =====
let currentMember  = null;
let previousMember = null;
let streak         = 0;
let judged         = false;

// ===== DOM 参照 =====
const streakCountEl   = document.getElementById('streakCount');
const memberNameEl    = document.getElementById('memberName');
const stick1El        = document.getElementById('stick1');
const stick2El        = document.getElementById('stick2');
const colorSelect1    = document.getElementById('colorSelect1');
const colorSelect2    = document.getElementById('colorSelect2');
const swatch1El       = document.getElementById('swatch1');
const swatch2El       = document.getElementById('swatch2');
const resultSection   = document.getElementById('resultSection');
const resultBanner    = document.getElementById('resultBanner');
const resultIcon      = document.getElementById('resultIcon');
const resultText      = document.getElementById('resultText');
const correctColorsRow= document.getElementById('correctColorsRow');
const btnJudge        = document.getElementById('btnJudge');
const btnNext         = document.getElementById('btnNext');
const confettiCont    = document.getElementById('confettiContainer');

// ===== 初期化 =====
function init() {
  buildSelectOptions();
  colorSelect1.addEventListener('change', () => updateSwatch(colorSelect1, swatch1El));
  colorSelect2.addEventListener('change', () => updateSwatch(colorSelect2, swatch2El));
  btnJudge.addEventListener('click', judge);
  btnNext.addEventListener('click', nextMember);
  nextMember();
}

// ===== プルダウン選択肢を構築 =====
function buildSelectOptions() {
  [colorSelect1, colorSelect2].forEach(sel => {
    COLORS.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.name;
      opt.textContent = `${c.id}. ${c.name}`;
      sel.appendChild(opt);
    });
  });
}

// ===== スウォッチを更新 =====
function updateSwatch(selectEl, swatchEl) {
  const name = selectEl.value;
  if (!name) {
    swatchEl.style.backgroundColor = '#e0e0e0';
    swatchEl.classList.remove('is-white');
    return;
  }
  const color = COLOR_MAP[name];
  swatchEl.style.backgroundColor = color.code;
  if (color.code === '#ffffff') {
    swatchEl.classList.add('is-white');
  } else {
    swatchEl.classList.remove('is-white');
  }
}

// ===== ペンライトのビジュアルを更新 =====
function updatePenlight(colorName1, colorName2) {
  const c1 = COLOR_MAP[colorName1];
  const c2 = COLOR_MAP[colorName2];

  if (c1) {
    stick1El.style.backgroundColor = c1.code;
    stick1El.classList.add('lit');
    stick1El.style.setProperty('--glow-color', c1.code + '99');
  } else {
    stick1El.style.backgroundColor = '#e0e0e0';
    stick1El.classList.remove('lit');
  }

  if (c2) {
    stick2El.style.backgroundColor = c2.code;
    stick2El.classList.add('lit');
    stick2El.style.setProperty('--glow-color', c2.code + '99');
  } else {
    stick2El.style.backgroundColor = '#e0e0e0';
    stick2El.classList.remove('lit');
  }
}

// ===== 次のメンバーを出題 =====
function nextMember() {
  judged = false;

  // 前回と同じメンバーを引かない
  let candidates = MEMBERS.filter(m => m !== previousMember);
  const idx = Math.floor(Math.random() * candidates.length);
  currentMember  = candidates[idx];
  previousMember = currentMember;

  // UI 更新
  memberNameEl.style.opacity = '0';
  setTimeout(() => {
    memberNameEl.textContent = currentMember.name;
    memberNameEl.style.opacity = '1';
  }, 150);

  // ペンライトをリセット
  stick1El.style.backgroundColor = '#e0e0e0';
  stick2El.style.backgroundColor = '#e0e0e0';
  stick1El.classList.remove('lit');
  stick2El.classList.remove('lit');

  // セレクトをリセット
  colorSelect1.value = '';
  colorSelect2.value = '';
  updateSwatch(colorSelect1, swatch1El);
  updateSwatch(colorSelect2, swatch2El);

  // ボタン切り替え
  btnJudge.classList.remove('hidden');
  btnNext.classList.add('hidden');

  // 結果エリア非表示
  resultSection.classList.add('hidden');
}

// ===== 判定 =====
function judge() {
  if (judged) return;

  const v1 = colorSelect1.value;
  const v2 = colorSelect2.value;

  if (!v1 || !v2) {
    shakeButton(btnJudge);
    showToast('2色を選んでください');
    return;
  }

  judged = true;

  // 順不同で正誤判定
  const answer  = [v1, v2].sort();
  const correct = [...currentMember.colors].sort();
  const isCorrect = answer[0] === correct[0] && answer[1] === correct[1];

  // ペンライト点灯
  updatePenlight(currentMember.colors[0], currentMember.colors[1]);

  // 結果表示
  showResult(isCorrect);

  // 連続正解更新
  if (isCorrect) {
    streak++;
    launchConfetti();
  } else {
    streak = 0;
  }
  updateStreak();

  // ボタン切り替え
  btnJudge.classList.add('hidden');
  btnNext.classList.remove('hidden');
}

// ===== 結果エリアを表示 =====
function showResult(isCorrect) {
  resultSection.classList.remove('hidden');

  if (isCorrect) {
    resultBanner.className = 'result-banner correct';
    resultIcon.textContent  = '🎉';
    resultText.textContent  = '正解！';
  } else {
    resultBanner.className = 'result-banner incorrect';
    resultIcon.textContent  = '💦';
    resultText.textContent  = '不正解…';
  }

  // 正解の色チップを構築
  correctColorsRow.innerHTML = '';
  const colorsToShow = currentMember.colors[0] === currentMember.colors[1]
    ? [currentMember.colors[0]]
    : currentMember.colors;

  colorsToShow.forEach(cName => {
    const c = COLOR_MAP[cName];
    const chip = document.createElement('div');
    chip.className = 'color-chip';
    chip.innerHTML = `
      <div class="color-chip-dot ${c.code === '#ffffff' ? 'is-white' : ''}"
           style="background-color:${c.code}"></div>
      <span class="color-chip-num">${c.id}.</span>
      <span class="color-chip-name">${c.name}</span>
    `;
    if (c.code === '#ffffff') {
      chip.querySelector('.color-chip-dot').style.borderColor = 'rgba(0,0,0,0.3)';
    }
    correctColorsRow.appendChild(chip);
  });

  // 2色とも同じ場合は「×2」を付記
  if (currentMember.colors[0] === currentMember.colors[1]) {
    const chip = correctColorsRow.querySelector('.color-chip');
    if (chip) {
      const badge = document.createElement('span');
      badge.textContent = '×2';
      badge.style.cssText = 'font-size:0.7rem;color:#9a9ab0;font-weight:700;';
      chip.appendChild(badge);
    }
  }
}

// ===== ストリーク表示更新 =====
function updateStreak() {
  streakCountEl.textContent = streak;
  streakCountEl.classList.remove('bump');
  void streakCountEl.offsetWidth; // reflow
  streakCountEl.classList.add('bump');
  setTimeout(() => streakCountEl.classList.remove('bump'), 250);
}

// ===== コンフェッティ =====
function launchConfetti() {
  confettiCont.innerHTML = '';
  const colors = ['#da70d6','#ff69b4','#fffacd','#b0e0e6','#98fb98','#ffffff'];
  for (let i = 0; i < 40; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left  = Math.random() * 100 + 'vw';
    el.style.animationDuration = (0.7 + Math.random() * 0.8) + 's';
    el.style.animationDelay    = Math.random() * 0.4 + 's';
    el.style.backgroundColor   = colors[Math.floor(Math.random() * colors.length)];
    el.style.transform         = `rotate(${Math.random()*360}deg)`;
    const size = 6 + Math.random() * 8;
    el.style.width  = size + 'px';
    el.style.height = size + 'px';
    confettiCont.appendChild(el);
  }
  setTimeout(() => confettiCont.innerHTML = '', 2000);
}

// ===== ボタンを振るアニメーション =====
function shakeButton(btn) {
  btn.style.animation = 'none';
  void btn.offsetWidth;
  btn.style.animation = 'shake 0.3s ease';
}

// ===== トースト通知 =====
function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(26,26,46,0.88);
    color: #fff;
    padding: 12px 22px;
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: 600;
    font-family: var(--font-sans);
    z-index: 9999;
    white-space: nowrap;
    box-shadow: 0 4px 16px rgba(0,0,0,0.25);
    animation: toastIn 0.2s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

// ===== shake / toast アニメーション定義 =====
(function injectKeyframes() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-6px); }
      40%      { transform: translateX(6px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX(4px); }
    }
    @keyframes toastIn {
      from { opacity: 0; transform: translateX(-50%) translateY(8px); }
      to   { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
  `;
  document.head.appendChild(style);
})();

// ===== 起動 =====
init();
