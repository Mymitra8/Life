// File: bot-server.js
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const TELEGRAM_TOKEN = '7517117855:AAEyKwSl2s6P79S2j3HpKuDsfJUmcVP_nlQ';
const CHAT_ID = '@MyMitraBot'; // Use your bot's channel/ID

app.use(express.json());

app.post('/webhook', async (req, res) => {
  try {
    const data = req.body;

    // Example TradingView format
    const coin = data.coin || 'Unknown';
    const signal = data.signal || 'BUY';
    const entry = data.entry || 'NA';
    const sl = data.sl || 'NA';
    const tp = data.tp || 'NA';
    const time = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' });

    const message = `
🚨 *${signal} Alert!*  
💹 *${coin}*  
🎯 Entry: ₹${entry}  
🛑 SL: ₹${sl}  
🎯 TP: ₹${tp}  
⏰ ${time}
    `.trim();

    await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    });

    res.status(200).send({ ok: true, message: 'Alert sent!' });
  } catch (error) {
    console.error('Telegram send error:', error.message);
    res.status(500).send({ error: 'Failed to send alert' });
  }
});

app.listen(PORT, () => {
  console.log(`Bot server running on port ${PORT}`);
});