const header = document.getElementById("mainHeader");
const nav = document.getElementById("siteNav");
const menuBtn = document.getElementById("menuToggle");
const links = [...nav.querySelectorAll("a")];
const underline = nav.querySelector(".nav-underline");

let activeLink = null;

function setUnderline(el) {
  if (!el) {
    underline.style.width = "0";
    return;
  }
  const r = el.getBoundingClientRect();
  const nr = nav.getBoundingClientRect();
  underline.style.width = r.width + "px";
  underline.style.left = r.left - nr.left + "px";
}

function closeMenu() {
  nav.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
}

menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  document.body.classList.toggle("nav-open", open);
});


window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

links.forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const id = a.getAttribute("href").slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    closeMenu();
    const headerH = header.offsetHeight;
    const top = window.scrollY + el.getBoundingClientRect().top - headerH + 1;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

const sections = [...document.querySelectorAll("section[id]")];

function onScroll() {
  const headerH = header.offsetHeight;
  let current = null;

  for (const s of sections) {
    const rect = s.getBoundingClientRect();
    if (rect.top <= headerH && rect.bottom > headerH) {
      current = s;
      break;
    }
  }

  if (current) {
    const desired = current.getAttribute("data-header") || "light";
    if (header.getAttribute("data-theme") !== desired) {
      header.setAttribute("data-theme", desired);
    }

    const id = current.id;
    const match = links.find((l) => l.getAttribute("href") === "#" + id);

    if (match !== activeLink) {
      links.forEach((l) => l.classList.remove("active"));
      if (match) match.classList.add("active");
      activeLink = match;
      setUnderline(activeLink);
    }
  }
}

document.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", () => setUnderline(activeLink));
window.addEventListener("load", () => {
  onScroll();
  setUnderline(activeLink);
});
