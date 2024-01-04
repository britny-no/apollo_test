FROM node:20

WORKDIR /project
COPY . .

RUN apt-get update -y && apt-get install -y openssl build-essential libpq-dev
RUN chmod +x ./wait-for-it.sh
RUN npm cache clean --force && npm install
RUN npm run generate
