#Stage1
FROM node:24-alpine AS stage1

WORKDIR /app

COPY ./package*.json ./

RUN npm install

#Stage2

FROM gcr.io/distroless/nodejs24-debian12:latest

WORKDIR /app

COPY --from=stage1 /app/node_modules ./node_modules

COPY . .

CMD ["app.js"]
