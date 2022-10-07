FROM node:16.10.0-alpine
ARG NODE_ENV
ARG PORT
ARG SERVICE_NAME
ENV NODE_ENV ${NODE_ENV}
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
EXPOSE ${PORT}
RUN yarn nx run ${SERVICE_NAME}:build
CMD yarn nx run ${SERVICE_NAME}:serve
