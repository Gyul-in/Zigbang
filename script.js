const screenOrder = [3, 0, 1, 2, 4];
const screens = screenOrder.map((index) => document.querySelector(`[data-screen="${index}"]`));
const globalCta = document.querySelector("[data-global-cta]");
let current = 0;

function showScreen(index) {
  current = Math.max(0, Math.min(index, screens.length - 1));
  screens.forEach((screen, screenIndex) => {
    screen.classList.toggle("active", screenIndex === current);
    if (screenIndex === current) {
      screen.scrollTop = 0;
    }
  });
  globalCta.classList.toggle("hidden", current > 1);
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

showScreen(0);
