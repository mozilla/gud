FROM node:10-slim

ENV TINI_VERSION v0.18.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]

WORKDIR /app

COPY package.json /app/package.json
RUN npm install
COPY . /app/
RUN npm run build

EXPOSE 3000

CMD ["node", "server.js"]
