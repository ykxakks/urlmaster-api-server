FROM gcr.io/google_appengine/nodejs

WORKDIR /opt/app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

CMD [ "node", "index.js" ]
