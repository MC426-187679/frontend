# Use alpine with node
FROM node:16-alpine as build

# install some extra node dependencies
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 make gcc g++ libsass \
    && npm install -g npm@latest

WORKDIR /build

# then build the NPM deps
COPY ./package.json ./package-lock.json ./
RUN npm install --include=dev
