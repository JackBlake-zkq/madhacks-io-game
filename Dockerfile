FROM node:16 as builder

COPY ./frontend .

RUN npm ci

RUN npm run build

FROM node:16

WORKDIR /usr/src/app

COPY package.json package-lock.json *.js ./ 

RUN npm ci

COPY --from=builder /public ./frontend/public

CMD ["npm", "start"]