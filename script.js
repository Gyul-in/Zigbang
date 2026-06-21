const screenOrder = [3, 0, 1, 2, 4];
const screens = screenOrder.map((index) => document.querySelector(`[data-screen="${index}"]`));
const globalCta = document.querySelector("[data-global-cta]");
const app = document.querySelector(".app");
let current = 0;

function syncCtaToAppFrame() {
  const rect = app.getBoundingClientRect();
  globalCta.style.setProperty("--app-left", `${rect.left}px`);
  globalCta.style.setProperty("--app-bottom", `${window.innerHeight - rect.bottom}px`);
  globalCta.style.setProperty("--app-width", `${rect.width}px`);
}

function showScreen(index) {
  current = Math.max(0, Math.min(index, screens.length - 1));
  screens.forEach((screen, screenIndex) => {
    screen.classList.toggle("active", screenIndex === current);
    if (screenIndex === current) {
      screen.scrollTop = 0;
    }
  });
  globalCta.classList.toggle("hidden", current > 1);
  syncCtaToAppFrame();
}

document.addEventListener("click", (event) => {
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
