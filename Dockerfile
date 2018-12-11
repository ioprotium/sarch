FROM node:8-alpine

# Create app directory
WORKDIR /usr/src/app

COPY . .

RUN npm config set unsafe-perm true

RUN set -xe \
    && apk add --no-cache bash git yarn \
    && git --version && bash --version && npm -v && node -v && yarn -v

# Install app dependencies
WORKDIR /usr/src/app/service/client
RUN yarn

WORKDIR /usr/src/app/service
RUN yarn
RUN mkdir logs
RUN touch config/prod.yml

EXPOSE 3000

RUN yarn build

CMD [ "yarn", "start" ]