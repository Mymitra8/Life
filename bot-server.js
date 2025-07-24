const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const cors = require("cors");

// Replace with your bot token and your personal Telegram chat ID
const TOKEN = "7517117855:AAEyKwSl2s6P79S2j3HpKuDsfJUmcVP_nlQ";
const CHAT_ID = "6501836590"; // Replace with your real chat ID

const bot = new TelegramBot(TOKEN, { polling: true });
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json()); // Important for reading POST body

// Handle /start command on Telegram
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "🚀 Mitra Alert Bot is active and ready to send you trading alerts!");
});

// Webhook POST route — from TradingView, Postman, or CURL
app.post("/webhook", async (req, res) => {
  const { coin, signal, entry, sl, tp, time } = req.body;

  if (!coin || !signal || !entry) {
    return res.status(400).send("Missing fields in payload");
  }

  const emoji = signal.toUpperCase() === "BUY" ? "🟢" : "🔴";

  const message = `
📈 *${coin}*
${emoji} *${signal.toUpperCase()}* at ${entry}

🎯 SL: ${sl || "-"}
💰 TP: ${tp || "-"}
🕒 ${time || new Date().toLocaleString()}
`;

  try {
    await bot.sendMessage(CHAT_ID, message, { parse_mode: "Markdown" });
    return res.status(200).send("✅ Telegram alert sent");
  } catch (err) {
    console.error("❌ Error sending Telegram message:", err.message);
    return res.status(500).send("Telegram error");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
