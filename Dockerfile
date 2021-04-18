ARG NODE_ENV=production

# set version
FROM node AS builder

WORKDIR /build
COPY ./package*.json ./

RUN npm install

FROM node 

WORKDIR /app
COPY --from=builder /build /app
COPY . .

CMD npm start