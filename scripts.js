const galleryButtons = Array.from(document.querySelectorAll(".gallery-item"));
const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox?.querySelector("img");
const lightboxCaption = lightbox?.querySelector(".lightbox-caption");
const closeButton = lightbox?.querySelector(".lightbox-close");
const prevButton = lightbox?.querySelector(".lightbox-prev");
const nextButton = lightbox?.querySelector(".lightbox-next");
const contactForm = document.querySelector(".contact-form");
const formStatus = document.querySelector(".form-status");

let activeIndex = 0;

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

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (formStatus) {
    formStatus.textContent = "Inquiry captured in this preview. Connect the form to your direct contact channel before launch.";
  }
});
