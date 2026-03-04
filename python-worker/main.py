from flask import Flask, jsonify
import configparser
import os

app = Flask(__name__)

def get_config():
    config = configparser.ConfigParser()
    config.read('config.conf')
    return config

@app.route('/process')
def process():
    config = get_config()
    threshold = config.get('ANALYSIS', 'threshold', fallback="0.5")
    return jsonify({
        "status": "online",
        "result": "Analisi completata",
        "threshold": threshold,
        "api_key_last_chars": os.getenv('API_KEY', '')[-4:]
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)