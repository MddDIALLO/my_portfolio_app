FROM node:18.18.2

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

COPY .env .env

EXPOSE 4201

CMD ["npm", "start"]