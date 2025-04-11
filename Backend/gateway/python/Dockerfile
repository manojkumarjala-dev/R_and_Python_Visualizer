FROM python:3.10-buster

RUN apt-get update && apt-get install -y \
    gcc \
    libfreetype6-dev \
    libpng-dev \
    libjpeg-dev \
    python3-tk \
    && pip install --no-cache-dir matplotlib plotly seaborn

WORKDIR /app
