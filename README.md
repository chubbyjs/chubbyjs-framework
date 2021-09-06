# chubbyjs-framework

[![CI](https://github.com/chubbyjs/chubbyjs-framework/workflows/CI/badge.svg?branch=master)](https://github.com/chubbyjs/chubbyjs-framework/actions?query=workflow%3ACI)
[![Coverage Status](https://coveralls.io/repos/github/chubbyjs/chubbyjs-framework/badge.svg?branch=master)](https://coveralls.io/github/chubbyjs/chubbyjs-framework?branch=master)
[![Infection MSI](https://badge.stryker-mutator.io/github.com/chubbyjs/chubbyjs-framework/master)](https://dashboard.stryker-mutator.io/reports/github.com/chubbyjs/chubbyjs-framework/master)

[![bugs](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-framework&metric=bugs)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-framework)
[![code_smells](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-framework&metric=code_smells)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-framework)
[![coverage](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-framework&metric=coverage)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-framework)
[![duplicated_lines_density](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-framework&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-framework)
[![ncloc](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-framework&metric=ncloc)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-framework)
[![sqale_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-framework&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-framework)
[![alert_status](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-framework&metric=alert_status)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-framework)
[![reliability_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-framework&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-framework)
[![security_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-framework&metric=security_rating)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-framework)
[![sqale_index](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-framework&metric=sqale_index)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-framework)
[![vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-framework&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-framework)

## Description


## Requirements

 * node: 12

## Installation

Through [NPM](https://www.npmjs.com) as [@chubbyjs/chubbyjs-framework][1].

```sh
npm i @chubbyjs/chubbyjs-framework@1.0.0 \
    @chubbyjs/chubbyjs-framework-router-path-to-regexp@1.0.0
    @chubbyjs/chubbyjs-http-message@1.1.0 \
    @chubbyjs/chubbyjs-node-psr-http-message-bridge@1.2.1
```

## Usage

```ts
import PathToRegexpRouteMatcher from '@chubbyjs/chubbyjs-framework-router-path-to-regexp/dist/Router/PathToRegexpRouteMatcher';
import Application from '@chubbyjs/chubbyjs-framework/dist/Application';
import ErrorMiddleware from '@chubbyjs/chubbyjs-framework/dist/Middleware/ErrorMiddleware';
import RouteMatcherMiddleware from '@chubbyjs/chubbyjs-framework/dist/Middleware/RouteMatcherMiddleware';
import CallbackRequestHandler from '@chubbyjs/chubbyjs-framework/dist/RequestHandler/CallbackRequestHandler';
import Route from '@chubbyjs/chubbyjs-framework/dist/Router/Route';
import Routes from '@chubbyjs/chubbyjs-framework/dist/Router/Routes';
import ResponseFactory from '@chubbyjs/chubbyjs-http-message/dist/Factory/ResponseFactory';
import ServerRequestFactory from '@chubbyjs/chubbyjs-http-message/dist/Factory/ServerRequestFactory';
import StreamFactory from '@chubbyjs/chubbyjs-http-message/dist/Factory/StreamFactory';
import UriFactory from '@chubbyjs/chubbyjs-http-message/dist/Factory/UriFactory';
import NodeResponseEmitter from '@chubbyjs/chubbyjs-node-psr-http-message-bridge/dist/NodeResponseEmitter';
import PsrRequestFactory from '@chubbyjs/chubbyjs-node-psr-http-message-bridge/dist/PsrRequestFactory';
import ResponseInterface from '@chubbyjs/psr-http-message/dist/ResponseInterface';
import ServerRequestInterface from '@chubbyjs/psr-http-message/dist/ServerRequestInterface';
import { createServer, IncomingMessage, ServerResponse } from 'http';

const responseFactory = new ResponseFactory();

const app = new Application([
    new ErrorMiddleware(responseFactory, true),
    new RouteMatcherMiddleware(
        new PathToRegexpRouteMatcher(
            new Routes([
                Route.get(
                    '/hello/:name([a-z]+)',
                    'hello',
                    new CallbackRequestHandler(
                        (request: ServerRequestInterface): ResponseInterface => {
                            const response = responseFactory.createResponse(200);
                            const body = response.getBody();
                            body.write(`Hello, ${request.getAttribute('name')}`);
                            body.end();

                            return response;
                        },
                    ),
                ),
            ]),
        ),
        responseFactory,
    ),
]);

const psrRequestFactory = new PsrRequestFactory(
    new ServerRequestFactory(),
    new UriFactory(),
    new StreamFactory(),
);

const nodeResponseEmitter = new NodeResponseEmitter();

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    const serverRequest = psrRequestFactory.create(req);
    const response = app.handle(serverRequest);

    nodeResponseEmitter.emit(response, res);
});

server.listen(8080);
```

## Copyright

Dominik Zogg 2021

[1]: https://www.npmjs.com/package/@chubbyjs/chubbyjs-framework
