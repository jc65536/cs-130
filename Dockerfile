FROM node:20
WORKDIR /ootd
RUN apt update && apt install git
RUN git config --global core.editor "code -w"
COPY . .
WORKDIR /ootd/backend
RUN npm install
WORKDIR /ootd/frontend
RUN npm install
WORKDIR /ootd
