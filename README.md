# FullStack Analisi

Mini progetto **Node.js + Python** orchestrato con Docker Compose.
L'API Node fa da gateway e delega l'elaborazione a un worker Flask.

## Architettura

- `node-app`: espone l'endpoint `/analyze`
- `python-worker`: espone l'endpoint interno `/process`
- `docker-compose.yml`: avvia e collega i due servizi

Flusso:

1. Chiamata a `GET /analyze` su Node
2. Node chiama `GET /process` sul worker Python
3. Node restituisce una risposta aggregata JSON

## Requisiti

- Docker Desktop (con `docker compose` attivo)

## Configurazione

Crea un file `.env` nella root del progetto:

```env
PORT=3000
API_KEY=metti_qui_una_chiave
PYTHON_SERVICE_URL=http://python-worker:5000
```

> Con questa configurazione, l'app è raggiungibile su `http://localhost:8080`.

## Avvio rapido

Dalla cartella root:

```bash
docker compose up --build -d
```

Verifica stato container:

```bash
docker compose ps
```

Stop servizi:

```bash
docker compose down
```

Se vuoi fare tabula rasa sul tuo MacBook Air con un unico "comando nucleare" che elimina ogni traccia di container, immagini, reti e volumi inutilizzati, il comando è questo:

```bash
docker system prune -a --volumes -f
```

## Endpoint

### `GET /analyze`

URL:

```text
http://localhost:8080/analyze
```

Risposta di esempio:

```json
{
  "gateway": "Node.js",
  "worker_response": {
    "status": "online",
    "result": "Analisi completata",
    "threshold": "0.99",
    "api_key_last_chars": "1234"
  },
  "env_check": "Presente"
}
```

## Personalizzazione analisi

Puoi modificare i parametri del worker in:

- `python-worker/config.conf`

Esempio:

```ini
[ANALYSIS]
threshold = 0.99
debug_mode = true
```

## Struttura progetto

```text
.
├─ docker-compose.yml
├─ .env
├─ node-app/
│  ├─ Dockerfile
│  ├─ package.json
│  └─ server.js
└─ python-worker/
   ├─ Dockerfile
   ├─ main.py
   └─ config.conf
```

## Troubleshooting veloce

- Se `env_check` risulta `Mancante`, controlla `API_KEY` nel file `.env`
- Se Node non raggiunge Python, verifica che i container siano `Up` con `docker compose ps`
- Se cambi codice, ricostruisci con `docker compose up --build -d`


### Spiegazione dei collegamenti (Il "Network")

* **`.env` -> Node/Python:** Docker Compose prende le variabili da `.env` e le inietta nel sistema operativo dei container. In Node le leggi con `process.env`, in Python con `os.getenv`.
* **`docker-compose.yml` -> DNS interno:** All'interno della rete Docker, il container Node può "chiamare" il container Python usando il nome del servizio `python-worker` definito nel file YAML. Docker risolve automaticamente l'IP.
* **`.conf` -> Python:** Questo file è "montato" (volume). Se cambi `threshold = 0.9` nel file sul tuo Mac, Python vedrà il cambiamento (dovrai solo riavviare il container o implementare un ricaricamento nel codice).


### Evolutiva: Verso Kubernetes (K8s)

Quando passeremo a Kubernetes, il file `docker-compose.yml` sparirà. Al suo posto avremo dei file **Manifesto (YAML)** che descrivono:

1. **Deployment:** Quante copie della tua app devono girare.
2. **Service:** Come esporre Node verso l'esterno e Python verso Node.
3. **ConfigMap:** L'equivalente del tuo file `.conf`.
4. **Secret:** L'equivalente del tuo file `.env`.