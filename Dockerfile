FROM node:latest AS build
WORKDIR /app
COPY package*.json ./

RUN npm install
COPY . .
RUN npm run build

FROM node:latest AS production
WORKDIR /app
COPY package*.json ./

RUN npm install --only=production
COPY --from=build /app/dist ./dist

ENV PORT=3001

EXPOSE 3001

CMD ["node", "dist/server.js"]
