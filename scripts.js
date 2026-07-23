const galleryButtons = Array.from(document.querySelectorAll(".gallery-item"));
const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox?.querySelector("img");
const lightboxCaption = lightbox?.querySelector(".lightbox-caption");
const closeButton = lightbox?.querySelector(".lightbox-close");
const prevButton = lightbox?.querySelector(".lightbox-prev");
const nextButton = lightbox?.querySelector(".lightbox-next");
const scrollProgress = document.querySelector(".scroll-progress");

let activeIndex = 0;

document.documentElement.classList.add("js-enabled");

const revealTargets = document.querySelectorAll(
  ".quick-strip, .ticker, .intro-grid, .feature-band, .video-band, .returns-layout, .split-showcase, .section-heading, .gallery-item, .contact-band"
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

const stickyHiddenSections = document.querySelectorAll(".video-band, .contact-band");
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
