# Anche qui, versione Alpine per risparmiare RAM
FROM python:3.10-alpine

WORKDIR /app

# Installiamo Flask (web server leggero)
RUN pip install --no-cache-dir flask

COPY . .

EXPOSE 5000
CMD ["python", "main.py"]