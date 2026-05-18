gsap.registerPlugin(ScrollTrigger);

// 1. CUSTOM CURSOR
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
});

// 2. HERO ENTRANCE
gsap.from("#hero-text", {
    y: 150,
    opacity: 0,
    duration: 1.5,
    ease: "power4.out",
    delay: 0.2
});

// 3. INFINITE SLOPE GALLERY LOOP
function initSlopeGallery() {
    const columns = document.querySelectorAll('.slope-column');
    columns.forEach((col, i) => {
        const items = col.innerHTML;
        col.innerHTML = items + items; // Double for seamless loop

        gsap.to(col, {
            yPercent: -50,
            ease: "none",
            duration: 25 + (i * 10), // Varied speeds for depth
            repeat: -1
        });
    });
}
initSlopeGallery();

// 4. JOURNEY PINNING & CONTENT SWAPPING
const journeySection = document.querySelector("#journey");
const journeyCards = gsap.utils.toArray(".journey-card");
const galleryImages = document.querySelectorAll(".slope-img img");
const jDate = document.querySelector("#j-date");
const jTitle = document.querySelector("#j-title");
const jDesc = document.querySelector("#j-desc");

// Main Pinning Logic
ScrollTrigger.create({
    trigger: journeySection,
    start: "top top",
    end: () => `+=${journeyCards.length * 100}%`, // Makes scroll duration relative to number of cards
    pin: true,
    pinSpacing: true,
    scrub: true
});

// Content Swapping Logic
journeyCards.forEach((card, index) => {
    ScrollTrigger.create({
        trigger: card,
        start: "top center",
        end: "bottom center",
        onEnter: () => updateJourney(card),
        onEnterBack: () => updateJourney(card)
    });
});

function updateJourney(card) {
    const { date, title, desc, photos } = card.dataset;
    const newPhotos = JSON.parse(photos || "[]");

    const tl = gsap.timeline();

    // Cross-fade both text and gallery images
    tl.to([jDate, jTitle, jDesc, galleryImages], { 
        opacity: 0, 
        y: -20, 
        duration: 0.3, 
        ease: "power2.in" 
    })
    .add(() => {
        jDate.innerText = date;
        jTitle.innerText = title;
        jDesc.innerText = desc;

        if (newPhotos.length > 0) {
            galleryImages.forEach((img, i) => {
                img.src = newPhotos[i % newPhotos.length];
            });
        }
    })
    .to([jDate, jTitle, jDesc, galleryImages], { 
        opacity: 1, 
        y: 0, 
        duration: 0.5, 
        stagger: 0.05, 
        ease: "power2.out" 
    });
}

// 5. JOURNEY BACKGROUND TEXT PARALLAX
gsap.to("#journey-bg-text", {
    scrollTrigger: {
        trigger: "#journey",
        start: "top bottom",
        end: "bottom top",
        scrub: 1
    },
    x: 200, // Moves while pinned for depth
    opacity: 1 // Fades in automatically via ScrollTrigger
});

// 6. EXPERTISE GRID REVEAL
gsap.from(".skill-card", {
    scrollTrigger: {
        trigger: "#skills",
        start: "top 85%"
    },
    opacity: 0,
    y: 40,
    stagger: 0.05,
    duration: 1,
    ease: "power2.out",
    onComplete: () => {
        gsap.set(".skill-card", { clearProps: "all" });
    }
});

// 7. BODY BACKGROUND COLOR TRANSITION
gsap.to("body", {
    scrollTrigger: {
        trigger: "#skills",
        start: "top 80%",
        end: "top 20%",
        scrub: true
    },
    backgroundColor: "#0f0f0f",
    ease: "none"
});

const links = document.querySelectorAll('.nav-link');
const indicator = document.querySelector('.nav-indicator');

function moveIndicator(target) {
    const rect = target.getBoundingClientRect();
    const navRect = document.querySelector('.nav-glass').getBoundingClientRect();
    
    gsap.to(indicator, {
        x: rect.left - navRect.left - 5,
        width: rect.width + 10,
        duration: 0.6,
        ease: "power4.out"
    });
}

// Move indicator on click
links.forEach(link => {
    link.addEventListener('click', (e) => {
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        moveIndicator(link);
    });
    
    // Magnetic Hover Effect
    link.addEventListener('mousemove', (e) => {
        const rect = link.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(link, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.4,
            ease: "power2.out"
        });
    });

    link.addEventListener('mouseleave', () => {
        gsap.to(link, { x: 0, y: 0, duration: 0.4, ease: "elastic.out(1, 0.3)" });
    });
});

// Initialize indicator position
moveIndicator(document.querySelector('.nav-link.active'));

// Optional: Auto-update navbar active state on scroll
ScrollTrigger.create({
    trigger: "#journey",
    start: "top center",
    onEnter: () => {
        const journeyLink = document.querySelector('a[href="#journey"]');
        journeyLink.click();
    }
});

// When hovering over a link, make the dot grow
links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        gsap.to(cursor, { scale: 4, backgroundColor: "rgba(255,255,255,0.1)", backdropFilter: "blur(4px)" });
    });
    link.addEventListener('mouseleave', () => {
        gsap.to(cursor, { scale: 1, backgroundColor: "#fff", backdropFilter: "none" });
    });
});

const typeTargets = document.querySelectorAll('.type-effect');
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%@$#*";

typeTargets.forEach(target => {
    const originalText = target.dataset.text;
    let isAnimating = false;

    target.addEventListener('mouseenter', () => {
        if (isAnimating) return;
        isAnimating = true;

        let iteration = 0;
        const interval = setInterval(() => {
            target.innerText = target.innerText
                .split("")
                .map((letter, index) => {
                    if (index < iteration) {
                        return originalText[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join("");

            if (iteration >= originalText.length) {
                clearInterval(interval);
                isAnimating = false;
            }

            iteration += 1 / 3; // Adjust speed (lower = slower)
        }, 30);
    });
});