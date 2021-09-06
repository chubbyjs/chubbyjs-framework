import Call from '@chubbyjs/chubbyjs-mock/dist/Call';
import MockByCalls, { mockByCallsUsed } from '@chubbyjs/chubbyjs-mock/dist/MockByCalls';
import ContainerInterface from '@chubbyjs/psr-container/dist/ContainerInterface';
import ResponseInterface from '@chubbyjs/psr-http-message/dist/ResponseInterface';
import ServerRequestInterface from '@chubbyjs/psr-http-message/dist/ServerRequestInterface';
import RequestHandlerInterface from '@chubbyjs/psr-http-server-handler/dist/RequestHandlerInterface';
import { describe, expect, test } from '@jest/globals';
import LazyRequestHandler from '../../src/RequestHandler/LazyRequestHandler';
import ContainerDouble from '../Double/Psr/Container/ContainerDouble';
import ResponseDouble from '../Double/Psr/HttpMessage/ResponseDouble';
import ServerRequestDouble from '../Double/Psr/HttpMessage/ServerRequestDouble';
import RequestHandlerDouble from '../Double/Psr/HttpServerHandler/RequestHandlerDouble';

const mockByCalls = new MockByCalls();

describe('LazyRequestHandler', () => {
    test('process', () => {
        const request = mockByCalls.create<ServerRequestInterface>(ServerRequestDouble);
        const response = mockByCalls.create<ResponseInterface>(ResponseDouble);

        const handler = mockByCalls.create<RequestHandlerInterface>(RequestHandlerDouble, [
            Call.create('handle').with(request).willReturn(response),
        ]);

        const container = mockByCalls.create<ContainerInterface>(ContainerDouble, [
            Call.create('get').with('id').willReturn(handler),
        ]);

        const lazyRequestHandler = new LazyRequestHandler(container, 'id');

        expect(lazyRequestHandler.handle(request)).toBe(response);

        expect(mockByCallsUsed(request)).toBe(true);
        expect(mockByCallsUsed(response)).toBe(true);
        expect(mockByCallsUsed(handler)).toBe(true);
        expect(mockByCallsUsed(container)).toBe(true);
    });
});