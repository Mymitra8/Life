from flask import Flask, request
import requests

app = Flask(__name__)

TELEGRAM_BOT_TOKEN = "7517117855:AAEyKwSl2s6P79S2j3HpKuDsfJUmcVP_nlQ"
TELEGRAM_CHAT_ID = "6521628628"

@app.route('/')
def home():
    return "✅ Bot is running!"

@app.route('/webhook', methods=['POST'])
def webhook():
    data = request.json
    if data:
        message = f"""
📢 *New Signal Received*  
🪙 *Coin*: {data.get('coin', 'N/A')}  
📉 *Signal*: {data.get('signal', 'N/A')}  
💰 *Price*: {data.get('price', 'N/A')}  
🕒 *Time*: {data.get('entry_time', 'N/A')}  
🎯 *SL*: {data.get('sl', 'N/A')}
        """
        send_telegram(message)
    return "ok", 200

def send_telegram(msg):
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": msg,
        "parse_mode": "Markdown"
    }
    requests.post(url, json=payload)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)