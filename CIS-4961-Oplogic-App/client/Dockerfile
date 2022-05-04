FROM node:lts-alpine

WORKDIR /usr/shared/
COPY ["shared", "./"]
RUN npm install

WORKDIR /usr/client/
COPY ["client/*.json", "client/*.js", "client/*.yml", "./"]
RUN npm install

COPY ["client/src", "./src/"]
COPY ["client/.browserslistrc", "./"]

CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--disable-host-check"]
