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

RUN NODE_ENV=production npm run publish

FROM scratch AS staging
ARG DEPENDENCY=/workspace/server/build
COPY --from=build ${DEPENDENCY} /

FROM node:20.9.0
VOLUME /tmp
COPY --from=staging / /
ENTRYPOINT ["node","index.cjs"]