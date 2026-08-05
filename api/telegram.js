const ALLOWED_ORIGINS = new Set([
  "https://vladihnatovvv.github.io",
  "https://uluwatu-villa-landing.vercel.app",
  "http://localhost:4173",
  "http://localhost:5173"
]);

function setCorsHeaders(req, res) {
  const origin = req.headers.origin || "";
  const allowedOrigin = ALLOWED_ORIGINS.has(origin) ? origin : "https://vladihnatovvv.github.io";

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function readRequestBody(req) {
  if (req.body) {
    return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  }

  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");
  return rawBody ? JSON.parse(rawBody) : {};
}

function buildTelegramMessage(payload) {
  return [
    "<b>New Bali Villa Inquiry</b>",
    "",
    `<b>Name:</b> ${escapeHtml(payload.name)}`,
    `<b>Preferred contact:</b> ${escapeHtml(payload.contactMethod)}`,
    `<b>Contact details:</b> ${escapeHtml(payload.contactDetails)}`,
    `<b>Buyer type:</b> ${escapeHtml(payload.buyerType)}`,
    "",
    `<b>Questions:</b>\n${escapeHtml(payload.questions)}`,
    "",
    `<b>Situation:</b>\n${escapeHtml(payload.situation)}`,
    "",
    `<b>Page:</b> ${escapeHtml(payload.pageUrl)}`,
    `<b>Submitted:</b> ${escapeHtml(payload.submittedAt)}`
  ].join("\n");
}

module.exports = async function handler(req, res) {
  setCorsHeaders(req, res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    res.status(500).json({ ok: false, error: "Telegram environment variables are missing" });
    return;
  }

  try {
    const payload = await readRequestBody(req);
    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildTelegramMessage(payload),
        parse_mode: "HTML",
        disable_web_page_preview: true
      })
    });
    const telegramResult = await telegramResponse.json();

    if (!telegramResult.ok) {
      res.status(502).json({ ok: false, error: telegramResult.description || "Telegram API error" });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(400).json({ ok: false, error: "Invalid inquiry payload" });
  }
};
