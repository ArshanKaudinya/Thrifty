FROM node:16

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000

ENV HOST=0.0.0.0
ENV WATCHPACK_POLLING=true

CMD ["npm", "start"]
