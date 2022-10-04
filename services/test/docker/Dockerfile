ARG NODE_ENV
ARG PORT
ARG SERVICE_NAME
FROM node:16.10.0-alpine AS BUILD_IMAGE
RUN apk update && apk add curl bash && rm -rf /var/cache/apk/*
RUN curl -fL https://gobinaries.com/tj/node-prune | sh

ARG SERVICE_NAME
ENV NODE_ENV ${NODE_ENV}
ENV SERVICE_NAME ${SERVICE_NAME}
WORKDIR /app
COPY package.json yarn.lock .
RUN yarn --frozen-lockfile
COPY . .
RUN yarn nx run ${SERVICE_NAME}:build:production
RUN npm prune --production
RUN node-prune

FROM node:16.10.0-alpine
ARG NODE_ENV
ARG PORT
ARG SERVICE_NAME
ENV NODE_ENV ${NODE_ENV}
ENV SERVICE_NAME ${SERVICE_NAME}
ENV PORT ${PORT}
WORKDIR /app
COPY --from=BUILD_IMAGE /app/dist ./dist
COPY --from=BUILD_IMAGE /app/node_modules ./node_modules
EXPOSE ${PORT}
CMD node ./dist/services/${SERVICE_NAME}/main.js
