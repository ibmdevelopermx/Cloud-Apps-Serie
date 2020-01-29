FROM node:latest
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
RUN npm i -s nodemon
COPY . /usr/src/app
EXPOSE 3000
ENV PORT=3000
ENV MONGO_SERVICE_HOST=mongo
ENV MONGO_SERVICE_PORT=27017
CMD [ "npm", "start" ]