const screenOrder = [3, 0, 1, 2, 4, 5, 6, 7, 8, 9];
const screens = screenOrder.map((index) => document.querySelector(`[data-screen="${index}"]`));
const globalCta = document.querySelector("[data-global-cta]");
const ctaButton = globalCta.querySelector(".primary");
const app = document.querySelector(".app");

// 화면(data-screen)별 하단 CTA 라벨. 없는 화면은 CTA를 숨긴다.
const ctaLabels = {
  "3": "개별 결과 보기",
  "0": "개별 결과 보기",
  "4": "지킴진단 시작하기",
  "5": "비교하기",
  "7": "개별 결과 보기",
  "8": "다음으로",
  "9": "공인중개사에게 문의하기",
};
// data-next 없이 플로우를 끝내는 화면
const ctaTerminal = new Set(["9"]);

let current = 0;
let autoTimer = null;
let progressRAF = null;

function syncCtaToAppFrame() {
  const rect = app.getBoundingClientRect();
  globalCta.style.setProperty("--app-left", `${rect.left}px`);
  globalCta.style.setProperty("--app-bottom", `${window.innerHeight - rect.bottom}px`);
  globalCta.style.setProperty("--app-width", `${rect.width}px`);
}

function animateLoading(screen) {
  const ring = screen.querySelector(".progress-ring");
  const pct = screen.querySelector(".progress-pct");
  const bar = screen.querySelector(".progress-bar span");
  if (!ring) return;

  const duration = 2400;
  const from = 8;
  const to = 92;
  const start = performance.now();

  cancelAnimationFrame(progressRAF);
  function tick(now) {
    const t = Math.min(1, (now - start) / duration);
    const value = Math.round(from + (to - from) * t);
    ring.style.setProperty("--p", value);
    if (pct) pct.textContent = `${value}%`;
    if (bar) bar.style.width = `${value}%`;
    if (t < 1) progressRAF = requestAnimationFrame(tick);
  }
  progressRAF = requestAnimationFrame(tick);
}

function showScreen(index) {
  current = Math.max(0, Math.min(index, screens.length - 1));
  const activeScreen = screens[current];
  screens.forEach((screen, screenIndex) => {
    const isActive = screenIndex === current;
    screen.classList.toggle("active", isActive);
    if (isActive) {
      screen.scrollTop = 0;
    }
  });

  // 화면별 하단 CTA 라벨/표시 동기화
  const key = activeScreen.dataset.screen;
  const label = ctaLabels[key];
  if (label) {
    ctaButton.textContent = label;
    ctaButton.toggleAttribute("data-next", !ctaTerminal.has(key));
    globalCta.classList.remove("hidden");
  } else {
    globalCta.classList.add("hidden");
  }
  syncCtaToAppFrame();

  // 로딩 화면: 진행률 애니메이션 후 자동 전환
  clearTimeout(autoTimer);
  cancelAnimationFrame(progressRAF);
  if (activeScreen.classList.contains("loading-screen")) {
    animateLoading(activeScreen);
  }
  const delay = activeScreen.dataset.autoadvance;
  if (delay) {
    autoTimer = setTimeout(() => showScreen(current + 1), Number(delay));
  }
}

document.addEventListener("click", (event) => {
  // 리포트 화면의 탭 전환 (프로토타입: 활성 표시만)
  const tab = event.target.closest(".tab");
  if (tab) {
    tab.parentElement.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    return;
  }

  const next = event.target.closest("[data-next]");
  const prev = event.target.closest("[data-prev]");

  if (next) {
    showScreen(current + 1);
  }

  if (prev) {
    showScreen(current - 1);
  }
});

window.addEventListener("resize", syncCtaToAppFrame);
window.addEventListener("orientationchange", syncCtaToAppFrame);

showScreen(0);
