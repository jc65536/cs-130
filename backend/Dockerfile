FROM node:20
WORKDIR /backend
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD [ "node", "dist/app.js" ]
