[PHP Omnipay library](https://github.com/thephpleague/omnipay-common) port to typesript

### Summary ###

This is the port of  [PHP Omnipay library](https://github.com/thephpleague/omnipay-common) core to use in Node.JS environment
Code itself is written in Typescript 2.7

### Usage ###

Install using `npm install omnipay-ts`
In order to use with javascript , compile sources using `npm run compile` and refer to library by path like : 
```javascript
const { AbstractGateway, AbstractRequest } = require('omnipay-ts/dist');
```

Requires NodeJS version **high or equal to 8.6**
