FROM python:3.11-slim

# Avoids creating .pyc files
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# system deps for pillow or sqlite if needed
RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential libsqlite3-dev gcc curl \
    && rm -rf /var/lib/apt/lists/*

# Install python deps
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . /app

# Expose port
EXPOSE 5000

# Default environment vars
ENV PORT=5000
ENV FLASK_DEBUG=0

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD /bin/sh -c "curl -f http://localhost:$PORT/health || exit 1"

# Start with gunicorn and config
COPY gunicorn_conf.py /app/
CMD ["gunicorn", "-c", "gunicorn_conf.py", "app:app"]
