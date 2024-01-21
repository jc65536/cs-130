FROM node:20
WORKDIR /backend
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx tsc
CMD [ "node", "dist/app.js" ]
