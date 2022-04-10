FROM node:16
WORKDIR /cbt-node-app
COPY package.json .
RUN npm install
COPY . .
CMD npm start
