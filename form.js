const TALLY_WIDGET_SRC = "https://tally.so/widgets/embed.js";
const THANK_YOU_URL = "thank-you.html";

let leadTracked = false;

function trackSubmittedLead() {
  if (leadTracked) {
    return;
  }

  leadTracked = true;

  if (typeof window.fbq === "function") {
    window.fbq("track", "Lead", {
      content_name: "Tally Bali Villa Inquiry",
      content_category: "Real estate",
      currency: "USD",
      value: 399000
    });
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "tally_lead_submit",
    form_name: "Bali Villa Inquiry",
    form_id: "q4Xk6G"
  });
}

function loadTallyEmbeds() {
  if (typeof window.Tally !== "undefined") {
    window.Tally.loadEmbeds();
    return;
  }

  if (document.querySelector(`script[src="${TALLY_WIDGET_SRC}"]`)) {
    return;
  }

  const script = document.createElement("script");
  script.src = TALLY_WIDGET_SRC;
  script.onload = loadTallyEmbeds;
  script.onerror = () => {
    document.querySelectorAll("iframe[data-tally-src]:not([src])").forEach((iframe) => {
      iframe.src = iframe.dataset.tallySrc;
    });
  };
  document.body.appendChild(script);
}

function getTallyEventName(message) {
  const data = typeof message.data === "string" ? parseTallyMessage(message.data) : message.data;

  if (!data || typeof data !== "object") {
    return "";
  }

  return data.event || data.type || data.name || "";
}

function parseTallyMessage(rawMessage) {
  if (!rawMessage.includes("Tally.")) {
    return null;
  }

  try {
    return JSON.parse(rawMessage);
  } catch (error) {
    return { event: rawMessage };
  }
}

window.addEventListener("message", (message) => {
  if (message.origin !== "https://tally.so") {
    return;
  }

  if (getTallyEventName(message) !== "Tally.FormSubmitted") {
    return;
  }

  trackSubmittedLead();

  window.setTimeout(() => {
    window.location.href = THANK_YOU_URL;
  }, 500);
});

loadTallyEmbeds();
