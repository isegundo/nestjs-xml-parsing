## Description

A sample app that accepts XML as input and maps it to JS Objects (and Typescript classes).

It uses:
- [Nest](https://github.com/nestjs/nest) as web framework;
- [xml2js](https://www.npmjs.com/package/xml2js) to perform the conversion XML <-> JSON;
- [object-mapper](https://www.npmjs.com/package/object-mapper) to map fields (and fix object structure)

## Internal details
### JSON support
There are two endpoints for a dummy Search Controller. 

/search - is a regular REST POST endpoint, supporting JSON
/search/xml - is a specific endpoint for XML. This one will trigger the conversion interceptor.

### Nest Interceptors
They are used to perform the conversion process of the request and response objects. Check the Search Controller to see it applied to the xml endpoint.


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
