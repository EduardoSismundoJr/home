const roles = ["Aspiring VA", "Freelancer", "Customer Support"];
const typedEl = document.getElementById("typed");

let ri = 0;
let ci = 0;
let mode = "type";

let TYPE_DELAY = 55;
let ERASE_DELAY = 45;
let HOLD_DELAY = 650;
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
let raf = null;
let active = false;
let idle = 0;

function setTarget(e) {
  const r = hero.getBoundingClientRect();
  const cx = "clientX" in e ? e.clientX : e.touches[0].clientX;
  const cy = "clientY" in e ? e.clientY : e.touches[0].clientY;
  const x = cx - r.left;
  const y = cy - r.top;
  targetX = x / r.width - 0.5;
  targetY = y / r.height - 0.5;
  kick();
}

function frame() {
  curX += (targetX - curX) * 0.1;
  curY += (targetY - curY) * 0.1;

  for (const l of layers) {
    const d = l.dataset.depth ? parseFloat(l.dataset.depth) : (l.classList.contains("stars") ? 10 : l.classList.contains("glow") ? 16 : 24);
    l.style.setProperty("--dx", (-curX * d) + "px");
    l.style.setProperty("--dy", (-curY * d) + "px");
  }

  const still = Math.abs(targetX - curX) + Math.abs(targetY - curY) < 0.001;
  idle = still ? idle + 1 : 0;
  if (idle > 10) {
    active = false;
    raf = null;
    return;
  }
  raf = requestAnimationFrame(frame);
}

function kick() {
  if (!active) {
    active = true;
    raf = requestAnimationFrame(frame);
  }
}

if (hero) {
  const obs = new IntersectionObserver(([e]) => {
    if (e && e.isIntersecting) {
      hero.addEventListener("pointermove", setTarget, { passive: true });
      hero.addEventListener("touchmove", setTarget, { passive: true });
      kick();
    } else {
      hero.removeEventListener("pointermove", setTarget);
      hero.removeEventListener("touchmove", setTarget);
      active = false;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = null;
      }
      targetX = 0;
      targetY = 0;
      for (const l of layers) {
        l.style.setProperty("--dx", "0px");
        l.style.setProperty("--dy", "0px");
      }
    }
  }, { threshold: 0.1 });
  obs.observe(hero);
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

const contactSwitch = document.getElementById("contactSwitch");
const modeLink = document.querySelector(".contact-mode--link");
const modeEmail = document.querySelector(".contact-mode--email");

function setMode(checked) {
  if (!modeLink || !modeEmail) return;
  if (checked) {
    modeEmail.classList.add("active");
    modeLink.classList.remove("active");
  } else {
    modeLink.classList.add("active");
    modeEmail.classList.remove("active");
  }
}

if (contactSwitch) {
  contactSwitch.addEventListener("change", () => setMode(contactSwitch.checked));
  setMode(contactSwitch.checked);
}

const belt = document.querySelector(".xbelt");
if (belt) {
  const o = new IntersectionObserver(([e]) => {
    belt.style.animationPlayState = e && e.isIntersecting ? "running" : "paused";
  }, { threshold: 0 });
  o.observe(belt);
}


