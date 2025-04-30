import { verifyToken } from '../src/middlewares/jwt';
import httpMocks from 'node-mocks-http';
import {BaseResponse} from "../src/controllers/responses/BaseResponse";

describe('auth-middleware', () => {
    it("Authorization Header is empty", () => {
        const req = httpMocks.createRequest();
        const resp = httpMocks.createResponse();
        const next = jest.fn();

        verifyToken(req, resp, next);

        expect(resp.statusCode).toBe(401);

        resp._getJSONData()
        // expect(resp.status.message)
    });

    it('Access Token is not valid', () => {
        const req = httpMocks.createRequest();
        const resp = httpMocks.createResponse();
        const next = jest.fn();


    });


})