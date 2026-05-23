import os
import requests
from flask import Flask, request, jsonify

app = Flask(__name__)

BOT_TOKEN = os.environ.get("BOT_TOKEN")
CHAT_ID = os.environ.get("CHAT_ID")

@app.route("/webhook", methods=["POST"])
def webhook():
    data = request.get_json(silent=True) or {}

    direction = data.get("direction", "").upper()
    ticker = data.get("ticker", "")
    price = data.get("price", "")
    sl = data.get("sl", "")
    tp = data.get("tp", "")

    if direction == "LONG":
        message = (
            f"🟢 <b>LONG SİNYALİ</b>\n"
            f"📊 {ticker}\n"
            f"💰 Giriş: {price}\n"
            f"🛑 Stop Loss: {sl}\n"
            f"🎯 Take Profit: {tp}"
        )
    elif direction == "SHORT":
        message = (
            f"🔴 <b>SHORT SİNYALİ</b>\n"
            f"📊 {ticker}\n"
            f"💰 Giriş: {price}\n"
            f"🛑 Stop Loss: {sl}\n"
            f"🎯 Take Profit: {tp}"
        )
    else:
        message = data.get("message", request.get_data(as_text=True))

    if message:
        requests.post(
            f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage",
            json={"chat_id": CHAT_ID, "text": message, "parse_mode": "HTML"},
        )
    return jsonify({"ok": True})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
