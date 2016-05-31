FROM node:5.6-onbuild

RUN mkdir -p /app
WORKDIR /app

COPY . /app
RUN npm install

CMD [ "npm", "start" ]

EXPOSE 3000

RUN mkdir -p /app/logs

WORKDIR /app
RUN npm install -g apidoc
RUN apidoc -i src/ -o public/docs