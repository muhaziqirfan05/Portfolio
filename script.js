gsap.registerPlugin(ScrollTrigger);

/* =========================
   CURSOR (SMOOTH + RELIABLE)
========================= */

const cursor = document.getElementById("cursor");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let currentX = mouseX;
let currentY = mouseY;

window.addEventListener("mousemove", (e) => {
mouseX = e.clientX;
mouseY = e.clientY;
});

function animateCursor() {
currentX += (mouseX - currentX) * 0.12;
currentY += (mouseY - currentY) * 0.12;

cursor.style.transform =
`translate3d(${currentX}px, ${currentY}px, 0)`;

requestAnimationFrame(animateCursor);
}

animateCursor();

/* =========================
   MAGNETIC BUTTONS
========================= */

const magneticElements = document.querySelectorAll(".magnetic");

magneticElements.forEach((el) => {
el.addEventListener("mousemove", (e) => {
const rect = el.getBoundingClientRect();

const x = e.clientX - rect.left - rect.width / 2;
const y = e.clientY - rect.top - rect.height / 2;

gsap.to(el, {
x: x * 0.25,
y: y * 0.25,
duration: 0.4,
ease: "power2.out"
});
});

el.addEventListener("mouseleave", () => {
gsap.to(el, {
x: 0,
y: 0,
duration: 0.6,
ease: "elastic.out(1,0.4)"
});
});
});

/* =========================
   MOBILE MENU
========================= */

const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

if (menuBtn && mobileMenu) {
menuBtn.addEventListener("click", () => {
mobileMenu.classList.toggle("active");
});
}

/* =========================
   HERO ANIMATION
========================= */

gsap.from(".hero-tag", {
opacity: 0,
y: 20,
duration: 1,
ease: "power3.out"
});

gsap.from(".hero-title", {
opacity: 0,
y: 100,
duration: 1.4,
ease: "power4.out"
});

gsap.from(".hero-description", {
opacity: 0,
y: 30,
duration: 1,
delay: 0.3
});

gsap.from(".hero-buttons a", {
opacity: 0,
y: 20,
stagger: 0.15,
duration: 0.8,
delay: 0.4
});

/* =========================
   SCROLL ANIMATIONS
========================= */

gsap.utils.toArray(".skill-card").forEach((el) => {
gsap.from(el, {
scrollTrigger: {
trigger: el,
start: "top 85%"
},
opacity: 0,
y: 50,
duration: 1
});
});

gsap.utils.toArray(".project-card").forEach((el) => {
gsap.from(el, {
scrollTrigger: {
trigger: el,
start: "top 85%"
},
opacity: 0,
y: 60,
duration: 1.2
});
});

gsap.utils.toArray(".gallery-item").forEach((el) => {
gsap.from(el, {
scrollTrigger: {
trigger: el,
start: "top 90%"
},
opacity: 0,
scale: 0.95,
duration: 1.2
});
});

/* =========================
   LIGHTBOX GALLERY
========================= */

const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox ? lightbox.querySelector("img") : null;

if (lightbox && lightboxImg) {

document.querySelectorAll(".gallery-item img").forEach((img) => {

img.addEventListener("click", () => {
lightbox.classList.add("active");
lightboxImg.src = img.src;
});

});

lightbox.addEventListener("click", () => {
lightbox.classList.remove("active");
lightboxImg.src = "";
});

}

/* =========================
   SCROLL REFRESH (IMPORTANT)
========================= */

ScrollTrigger.refresh();