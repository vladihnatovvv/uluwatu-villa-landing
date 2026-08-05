const inquiryForm = document.querySelector("#villaInquiryForm");
const submitButton = inquiryForm?.querySelector('button[type="submit"]');
const TELEGRAM_ENDPOINT = "https://uluwatu-villa-landing.vercel.app/api/telegram";

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

function getFormValue(formData, fieldName) {
  return String(formData.get(fieldName) || "").trim();
}

function buildTelegramPayload(formData) {
  return {
    name: getFormValue(formData, "entry.2094615768"),
    contactMethod: getFormValue(formData, "entry.1950450755"),
    contactDetails: getFormValue(formData, "entry.620674297"),
    buyerType: getFormValue(formData, "entry.636507645"),
    questions: getFormValue(formData, "entry.1315042934"),
    situation: getFormValue(formData, "entry.1502474641"),
    pageUrl: window.location.href,
    submittedAt: new Date().toISOString()
  };
}

function sendTelegramLead(formData) {
  const payload = JSON.stringify(buildTelegramPayload(formData));

  if (navigator.sendBeacon) {
    const queued = navigator.sendBeacon(
      TELEGRAM_ENDPOINT,
      new Blob([payload], { type: "text/plain;charset=UTF-8" })
    );

    if (queued) {
      return;
    }
  }

  fetch(TELEGRAM_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: payload,
    keepalive: true
  }).catch(() => {});
}

inquiryForm?.addEventListener("submit", () => {
  const formData = new FormData(inquiryForm);

  inquiryForm.classList.add("is-submitting");

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
  }

  trackSubmittedLead();
  sendTelegramLead(formData);

  window.setTimeout(() => {
    window.location.href = "thank-you.html";
  }, 900);
});
