const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json()); // Per leggere il corpo delle POST JSON

const PYTHON_URL = process.env.PYTHON_SERVICE_URL || 'http://python-worker:5000';

function asyncHandler(handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        } catch (error) {
            next(error);
        }
    };
}

// READ - Ottieni tutti
app.get('/api/data', asyncHandler(async (req, res) => {
    const response = await axios.get(`${PYTHON_URL}/items`);
    res.json(response.data);
}));

// CREATE - Invia nuova analisi
app.post('/api/data', asyncHandler(async (req, res) => {
    const response = await axios.post(`${PYTHON_URL}/items`, req.body);
    res.status(201).json(response.data);
}));

// DELETE - Rimuovi analisi
app.delete('/api/data/:id', asyncHandler(async (req, res) => {
    const response = await axios.delete(`${PYTHON_URL}/items/${req.params.id}`);
    res.json(response.data);
}));

app.use((error, req, res, next) => {
    if (error.response) {
        return res.status(error.response.status).json(error.response.data);
    }

    return res.status(500).json({
        error: 'gateway_error',
        message: error.message
    });
});

app.listen(3000, () => console.log("Gateway CRUD pronto"));