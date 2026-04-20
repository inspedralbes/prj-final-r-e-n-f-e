FROM node:23-bookworm-slim

ENV NODE_OPTIONS="--no-deprecation"

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y \
    libreoffice \
    fonts-liberation \
    fontconfig \
    --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*