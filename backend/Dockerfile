FROM node:20
WORKDIR /backend
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
CMD [ "npm", "start" ]
