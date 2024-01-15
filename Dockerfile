FROM node:20.9.0 AS build

WORKDIR /workspace
COPY package*.json .
RUN npm install

WORKDIR /workspace/transfer
COPY transfer/package*.json .
RUN npm install

WORKDIR /workspace/frontend
COPY frontend/package*.json .
RUN npm install

WORKDIR /workspace/server
COPY server/package*.json .
RUN npm install

WORKDIR /workspace
COPY . .

RUN NODE_ENV=production npm run build

FROM scratch AS staging
ARG DEPENDENCY=/workspace/server/build
COPY --from=build ${DEPENDENCY} /

FROM node:20.9.0

VOLUME /tmp

COPY --from=staging /package.json /
RUN npm install --omit=dev

COPY --from=staging / /

ENTRYPOINT ["sh", "start-server.sh"]