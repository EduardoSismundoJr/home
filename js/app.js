const roles = ["Web-Developer", "Freelancer", "Customer Support"];
const typedEl = document.getElementById("typed");

let ri = 0;
let ci = 0;
let mode = "type";

let TYPE_DELAY =90;
let ERASE_DELAY = 80;
let HOLD_DELAY = 600;
let TYPE_STEP = 1;
let ERASE_STEP = 1;

function tick() {
  if (!typedEl) return;

  const target = roles[ri];

  if (mode === "type") {
    ci = Math.min(ci + TYPE_STEP, target.length);
    typedEl.textContent = target.slice(0, ci);
    if (ci === target.length) {
      mode = "hold";
      setTimeout(() => {
        mode = "erase";
        requestAnimationFrame(tick);
      }, HOLD_DELAY);
      return;
    }
  } else if (mode === "erase") {
    ci = Math.max(ci - ERASE_STEP, 0);
    typedEl.textContent = target.slice(0, ci);
    if (ci === 0) {
      mode = "type";
      ri = (ri + 1) % roles.length;
    }
  }

  setTimeout(() => requestAnimationFrame(tick), mode === "type" ? TYPE_DELAY : ERASE_DELAY);
}

requestAnimationFrame(tick);

const hero = document.getElementById("hero");
const layers = [...document.querySelectorAll(".p-layer")];

let targetX = 0;
let targetY = 0;
let curX = 0;
let curY = 0;
let t = 0;

function handleMove(e) {
  const r = hero.getBoundingClientRect();
  const x = ("clientX" in e ? e.clientX : e.touches[0].clientX) - r.left;
  const y = ("clientY" in e ? e.clientY : e.touches[0].clientY) - r.top;
  targetX = x / r.width - 0.5;
  targetY = y / r.height - 0.5;
}

function animateParallax() {
  t += 0.016;
  curX += (targetX - curX) * 0.08;
  curY += (targetY - curY) * 0.08;

  layers.forEach((l) => {
    const depth =
      l.classList.contains("stars") ? 10 :
      l.classList.contains("glow") ? 18 : 26;

    const wobbleX = Math.cos(t * (0.8 + depth * 0.02)) * 2;
    const wobbleY = Math.sin(t * (0.7 + depth * 0.02)) * 2;

    const dx = (-curX * depth) + wobbleX;
    const dy = (-curY * depth) + wobbleY;

    l.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
  });

  requestAnimationFrame(animateParallax);
}

if (hero) {
  hero.addEventListener("mousemove", handleMove);
  hero.addEventListener("touchmove", handleMove, { passive: true });
  requestAnimationFrame(animateParallax);
}

const about = document.getElementById("about");
const aboutLight = document.querySelector(".about-light");

if (about && aboutLight) {
  about.addEventListener("mousemove", (e) => {
    const r = about.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    aboutLight.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(17,17,17,.05), transparent 60%)`;
  });

  about.addEventListener("mouseleave", () => {
    aboutLight.style.background = "transparent";
  });
}
