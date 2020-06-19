FROM node:14.4

USER node

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./

RUN npm install --quiet

# COPY . .

# EXPOSE 3000

# CMD [ "node", "app.js" ]