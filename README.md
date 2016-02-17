# OCP form server
This project handles Github authentication and creates Pull Requests for [OCP forms](https://github.com/developmentseed/ocp-form). Please check that repo for more information.

This project is a fork of a [Blue Pencil server](https://github.com/developmentseed/blue-pencil-server).

### Requirements
These dependencies are needed to build the app.

- Node (v4.2.x) & Npm ([nvm](https://github.com/creationix/nvm) usage is advised)

> The versions mentioned are the ones used during development. It could work with newer ones.
  Run `nvm use` to activate the correct version.

### Setup
Install dependencies:
```
$ npm install
```

**GitHub token**
For the app to work a GitHub token is needed.
Add it to the local config file:
```
{
  ghToken: '<token>'
}
```
or use the `GH_TOKEN` env variable.

**GitHub repo**
The repo being used for data storage is defined in the config file:
```
{
  ghUser: '<user>',
  ghRepo: '<repo>'
}
```

### Running the App
```
npm run start-dev
```
This will start the app at `http://localhost:3000`.
This command starts the server with `nodemon` which watches files and restarts when there's a change. 

```
npm run start
```
This command runs the app in `production` mode.

