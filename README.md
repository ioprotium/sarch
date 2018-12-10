# sarch

A simple NodeJS REST API.

# Prerequisites

- Git, Node, Yarn
- Firebase Account

# Tech Stack

## Service

- Express, express-rate-limit, body-parser, helmet, morgan
- Firebase Admin
- winston

## Client

- Vue 2, Vue CLI 3
- Vuetify
- Axios
- Firebase App, Firebase Auth

# Install

Note: **service** is the main project. All the build script are placed there.
Change directory

```
cd service
```

Installing project dependencies

```
yarn install
```

The **preinstall** script will also install the client dependencies

Note: a **postinstall** script will trigger the build script.

# Building

Check you are in **service** folder.

```
yarn build
```

The build script will execute the following operations

- Clean prev build by removing **service/dist** folder
- Build Service
- Generate API docs with **redoc-cli**
- Build Client and copy **client/dist** into **service/public**

# Running

Check you are in **service** folder.

```
yarn start
```
