const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const TOKEN = '7517117855:AAEyKwSl2s6P79S2j3HpKuDsfJUmcVP_nlQ'; // Replace with your actual token if needed
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const CHAT_ID = '6521628628'; // Optional, if you want to send from server directly

// 🛠️ Webhook Route for Telegram
app.post('/webhook', async (req, res) => {
  const message = req.body.message;
  if (!message || !message.text) {
    return res.sendStatus(200);
  }

  const chatId = message.chat.id;
  const userMessage = message.text;

  // ✨ Example Reply
  const replyText = `📩 You said: "${userMessage}"\n\n🧠 I am your MitraBot!`;

  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatId,
    text: replyText
  });

  res.sendStatus(200);
});

// ✅ Webhook Route for TradingView Alerts
app.post('/webhook/tradingview', async (req, res) => {
  const { coin, signal, entry, sl, tp, time } = req.body;

  if (!coin || !signal || !entry || !sl || !tp) {
    return res.status(400).send("Missing fields in TradingView alert");
  }

  const alertMsg = `🚨 *${coin} Signal Alert!*\n` +
                   `${signal === "BUY" ? "🟢" : "🔴"} *Signal:* ${signal}\n` +
                   `💰 *Entry:* ${entry}\n` +
                   `🛡️ *SL:* ${sl}\n` +
                   `🎯 *TP:* ${tp}\n` +
                   `🕒 *Time:* ${time}`;

  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: '6521628628',
    text: alertMsg,
    parse_mode: "Markdown"
  });

  res.sendStatus(200);
});


// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
