# OplogicChat

[Summary]

# Installation

### Client & Server:

After you've cloned the repository to disk, we'll need to ensure that we have the appropriate dependencies to run the project. You'll need to install the following:

-   [Node.JS](https://nodejs.org/en/download/)
    -   During installation, please ensure the `npm package manager` feature is also selected to install!

You can also optionally install a `Node Version Manager` as well:

-   [Node Version Manager](https://github.com/nvm-sh/nvm)

At the time of development, the following `Node` and `npm` versions were used:

-   `Node`: v16.13.0
-   `npm`: 8.1.0

### Database:

To run the database, you'll need to install the following:

-   [MySQL Installer](https://dev.mysql.com/downloads/mysql/)
    -   During installation, please ensure the MySQL Workbench is installed as well
    -   During installation, to allow the server to connect to the database, please enable legacy authentication
    -   When creating a database instance, be sure to remember the password you use. You'll need it when you configure your server!

At the time of development, the database used was `MySQL v8.0.28`.

<br/>

# Setup
### Shared Library:

-   From the top-most directory, navigate to ./shared/
    1. Run `npm install`
    1. Run `npm update`

### Client:

-   From the top-most directory, navigate to ./client/
    1.  Run `npm install`
    1.  Run `npm update`

### Server:

-   From the top-most directory, navigate to ./server/nodejs/
    1.  Run `npm install`
    1.  Run `npm update`

### Database:

-   From the top-most directory, navigate to ./server/mysql
    1. To import the `oplogicdb` schema, run the `1000_OplogicDB_Structure.sql` script in MySQL Workbench
    1. To import some sample data, run the `2000_OplogicDB_Data.sql` script in MySQL Workbench

<br/>

# Running the project

Before running, be sure your firewall settings allow for in-bound and out-bound traffic on port `4200` and `3000` so you can request the application page and send traffic to the server, respectively.

### Locally:

-   Client:
    -   From the top-most directory, navigate to ./client/
    -   Start the client with `npm start`
    -   When it loads, you will be able to access the UI from `http://localhost:4200` or `http://<host's IPv4 address>:4200`
-   Server:
    -   From the top-most directory, navigate to ./server/nodejs/
    -   Start the server with `npm start-server`
    -   Wait for a confirmation that the server has started
-   Database:
    -   Ensure the MySQL db instance / service is running on your local machine.

### With Docker:

From the top-most directory, run '`docker compose up -d`' and you should be all set!

Be sure to allow the proper firewall permissions for the Docker application, and connect to `http://localhost:4200` or to `http://<host's IPv4 address>:4200`

<br/>

# Debugging the project

At the moment, we haven't ensured that proper debugging can be performed using containers.

### Locally:

-   If you use VSCode, simply launch the npm debugger for `Node.JS` & `Angular`
-   If you don't want to use VSCode:
    -   For `Angular` you can use your browser's dev tools to place breakpoints and examine data
    -   For `Node.JS`, check out [their documentation](https://nodejs.org/api/debugger.html#v8-inspector-integration-for-nodejs) for some alternatives -- you can also use dev tools for `Node.JS` debugging!

#

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
