# Blue Pencil Server

[Blue Pencil Server description]

### Requirements
These dependencies are needed to build the app.

- Node (v4.2.x) & Npm

> The versions mentioned are the ones used during development. It could work with newer ones.

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

