const galleryButtons = Array.from(document.querySelectorAll(".gallery-item"));
const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox?.querySelector("img");
const lightboxCaption = lightbox?.querySelector(".lightbox-caption");
const closeButton = lightbox?.querySelector(".lightbox-close");
const prevButton = lightbox?.querySelector(".lightbox-prev");
const nextButton = lightbox?.querySelector(".lightbox-next");
const scrollProgress = document.querySelector(".scroll-progress");
const tiltTargets = document.querySelectorAll("[data-tilt]");
const magneticTargets = document.querySelectorAll("[data-magnetic]");
const siteHeader = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".nav-links");

let activeIndex = 0;

document.documentElement.classList.add("js-enabled");

function setMenuOpen(isOpen) {
  if (!menuToggle) {
    return;
  }

  document.body.classList.toggle("is-menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
}

menuToggle?.addEventListener("click", () => {
  setMenuOpen(!document.body.classList.contains("is-menu-open"));
});

primaryNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("click", (event) => {
  if (!document.body.classList.contains("is-menu-open") || !siteHeader) {
    return;
  }

  if (event.target instanceof Node && !siteHeader.contains(event.target)) {
    setMenuOpen(false);
  }
});

const revealTargets = document.querySelectorAll(
  ".quick-strip, .ticker, .intro-grid, .feature-band, .bedroom-layout, .bedroom-card, .video-band, .returns-layout, .deal-flow, .deal-step, .split-showcase, .section-heading, .gallery-item, .contact-band"
);

const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    )
  : null;

revealTargets.forEach((target, index) => {
  target.classList.add("reveal");
  target.style.setProperty("--reveal-delay", `${Math.min(index * 35, 240)}ms`);
  revealObserver?.observe(target);
});

if (!revealObserver) {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

const stickyHiddenSections = document.querySelectorAll(".bedroom-layout, .video-band, .contact-band");
const stickyHiddenVisible = new Set();
const stickyObserver = "IntersectionObserver" in window
  ? new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            stickyHiddenVisible.add(entry.target);
          } else {
            stickyHiddenVisible.delete(entry.target);
          }
        });
        document.body.classList.toggle("is-sticky-hidden", stickyHiddenVisible.size > 0);
      },
      { threshold: 0.18 }
    )
  : null;

stickyHiddenSections.forEach((section) => stickyObserver?.observe(section));

function updateScrollState() {
  const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const progress = Math.min(window.scrollY / maxScroll, 1);
  scrollProgress?.style.setProperty("--scroll", progress.toString());
  document.body.classList.toggle("is-scrolled", window.scrollY > 16);
}

updateScrollState();
window.addEventListener("scroll", updateScrollState, { passive: true });

const allowPointerMotion = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (allowPointerMotion) {
  tiltTargets.forEach((target) => {
    target.addEventListener("pointermove", (event) => {
      const rect = target.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      target.style.transform = `perspective(900px) rotateX(${y * -5}deg) rotateY(${x * 6}deg) translateY(-3px)`;
    });

    target.addEventListener("pointerleave", () => {
      target.style.transform = "";
    });
  });

  magneticTargets.forEach((target) => {
    target.addEventListener("pointermove", (event) => {
      const rect = target.getBoundingClientRect();
      const x = (event.clientX - (rect.left + rect.width / 2)) * 0.14;
      const y = (event.clientY - (rect.top + rect.height / 2)) * 0.18;
      target.style.transform = `translate(${x}px, ${y}px)`;
    });

    target.addEventListener("pointerleave", () => {
      target.style.transform = "";
    });
  });
}

function showPhoto(index) {
  if (!lightbox || !lightboxImage || !lightboxCaption || galleryButtons.length === 0) {
    return;
  }

  activeIndex = (index + galleryButtons.length) % galleryButtons.length;
  const item = galleryButtons[activeIndex];
  const image = item.dataset.full;
  const caption = item.dataset.caption || item.querySelector("img")?.alt || "Villa photo";

  lightboxImage.src = image;
  lightboxImage.alt = caption;
  lightboxCaption.textContent = caption;

  if (!lightbox.open) {
    lightbox.showModal();
  }
}

galleryButtons.forEach((button, index) => {
  button.addEventListener("click", () => showPhoto(index));
});

closeButton?.addEventListener("click", () => lightbox?.close());
prevButton?.addEventListener("click", () => showPhoto(activeIndex - 1));
nextButton?.addEventListener("click", () => showPhoto(activeIndex + 1));

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.close();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenuOpen(false);
  }

  if (!lightbox?.open) {
    return;
  }

  if (event.key === "ArrowLeft") {
    showPhoto(activeIndex - 1);
  }

  if (event.key === "ArrowRight") {
    showPhoto(activeIndex + 1);
  }
});
