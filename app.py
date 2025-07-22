from flask import Flask, request
import requests
import datetime

app = Flask(__name__)

# Telegram bot credentials
TELEGRAM_BOT_TOKEN = '7517117855:AAEyKwSl2s6P79S2j3HpKuDsfJUmcVP_nlQ'
TELEGRAM_CHAT_ID = '6521628628'

@app.route('/')
def home():
    return "✅ Telegram Webhook is Running!", 200

@app.route('/webhook', methods=['POST'])
def webhook():
    try:
        data = request.json

        coin = data.get("coin", "Unknown")
        signal = data.get("signal", "No Signal")
        price = data.get("price", "N/A")
        entry_time = data.get("entry_time", datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        sl_tp = data.get("sl", "Not Provided")

        emoji = "🟢" if signal.upper() == "BUY" else "🔴"

        message = (
            f"📢 *New Trade Signal*\n\n"
            f"🪙 *Coin:* `{coin}`\n"
            f"🛑 *Signal:* {emoji} *{signal.upper()}*\n"
            f"💰 *Entry Price:* `${price}`\n"
            f"🕒 *Time:* `{entry_time}`\n"
            f"🎯 *SL/TP:* `{sl_tp}`"
        )

        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        payload = {
            'chat_id': TELEGRAM_CHAT_ID,
            'text': message,
            'parse_mode': 'Markdown'
        }

        response = requests.post(url, json=payload)
        print(f"[{datetime.datetime.now()}] Alert sent. Telegram response: {response.text}")
        return '✅ Alert delivered to Telegram', 200

    except Exception as e:
        print(f"[{datetime.datetime.now()}] ❌ Error: {str(e)}")
        return '❌ Error sending message', 500