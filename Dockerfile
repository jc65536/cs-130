FROM node:20
WORKDIR /ootd
RUN apt update && apt install git
RUN git config --global core.editor "code"
COPY . .
