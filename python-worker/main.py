from flask import Flask, jsonify, request
import configparser

app = Flask(__name__)

# Simuliamo un database in memoria
data_store = {
    1: {"text": "Esempio positivo", "score": 0.9},
    2: {"text": "Esempio negativo", "score": 0.1}
}

@app.route('/items', methods=['GET'])
def get_all():
    return jsonify(list(data_store.values()))

@app.route('/items', methods=['POST'])
def create():
    new_id = max(data_store.keys()) + 1
    content = request.json
    data_store[new_id] = content
    return jsonify({"id": new_id, "status": "created"}), 201

@app.route('/items/<int:item_id>', methods=['DELETE'])
def delete(item_id):
    if item_id in data_store:
        del data_store[item_id]
        return jsonify({"status": "deleted"})
    return jsonify({"error": "not found"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)