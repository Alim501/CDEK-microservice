FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build

EXPOSE 7001

CMD ["npm", "run", "start"]
