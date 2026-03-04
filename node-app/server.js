const express = require('express');
const http = require('http');
const app = express();

const PYTHON_URL = process.env.PYTHON_SERVICE_URL || 'http://python-worker:5000';
const PORT = process.env.PORT || 3000;

app.get('/analyze', (req, res) => {
    http.get(`${PYTHON_URL}/process`, (resp) => {
        let data = '';
        resp.on('data', (chunk) => { data += chunk; });
        resp.on('end', () => {
            res.json({
                gateway: "Node.js",
                worker_response: JSON.parse(data),
                env_check: process.env.API_KEY ? "Presente" : "Mancante"
            });
        });
    }).on("error", (err) => {
        res.status(500).json({ error: "Python irraggiungibile: " + err.message });
    });
});

app.listen(PORT, () => console.log(`Node in ascolto sulla porta ${PORT}`));