# User Microservice

This project is part of an assignment for ContextQ. It contains the user-service which uses the Serverless Framework to deploy AWS Lambda functions and related resources.


## Installation Guide

Install NodeJS atleast v16.xx

- https://nodejs.org/en/

Install Serverless Framework Cli

```
$ npm install -g serverless
$ npm install -g typescript

```

```bash
$ sls plugin install -n serverless-offline
```

It will add the `serverless-offline` plugin to `devDependencies` in `package.json` file as well as will add it to `plugins` in `serverless.yml`.

After installation, you can start local emulation with:

```
$ sls offline
```

### Deployment Command

```
$ sls deploy --verbose

```
