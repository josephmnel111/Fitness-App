FROM node:lts-alpine
ENV NODE_ENV=production

WORKDIR /usr/shared
COPY ["shared", "./"]
RUN npm install

WORKDIR /usr/server/nodejs
COPY ["server/nodejs/package.json", "server/nodejs/package-lock.json*", "server/nodejs/npm-shrinkwrap.json*", "./"]
RUN npm install 
RUN mv node_modules ../

COPY ["server/nodejs/modules/*", "./modules/"]
COPY ["server/nodejs/tester/*", "./tester/"]
COPY ["server/nodejs/*.json", "server/nodejs/*.ts", "./"]
COPY ["server/nodejs/environment/env.docker.ts", "./environment/env.ts"]

RUN chown -R node /usr/server/nodejs
USER node
CMD ["npx", "ts-node", "-T", "server.ts"]