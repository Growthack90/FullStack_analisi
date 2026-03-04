# Node App (Gateway)

Questa cartella contiene il servizio Node.js che espone `/analyze`.

Per guida completa (Docker, `.env`, architettura, endpoint), usa il README principale in root:

- `../README.md`

## Avvio locale (solo Node)

```bash
cd node-app
npm install
npm start
```

Nota: l'endpoint `/analyze` richiede anche il servizio Python disponibile su `PYTHON_SERVICE_URL`.

## Dipendenze utili per il progetto

```bash
cd node-app
npm install express
npm install axios
```