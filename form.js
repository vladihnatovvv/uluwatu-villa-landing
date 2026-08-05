const inquiryForm = document.querySelector("#villaInquiryForm");
const submitButton = inquiryForm?.querySelector('button[type="submit"]');

function trackSubmittedLead() {
  if (typeof window.fbq !== "function") {
    return;
  }

  window.fbq("track", "Lead", {
    content_name: "Uluwatu villa inquiry form submit",
    content_category: "Real estate",
    currency: "USD",
    value: 399000
  });
}

inquiryForm?.addEventListener("submit", () => {
  inquiryForm.classList.add("is-submitting");

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
  }

  trackSubmittedLead();

  window.setTimeout(() => {
    window.location.href = "thank-you.html";
  }, 900);
});
