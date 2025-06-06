import {generateToken, verifyToken} from '../src/middlewares/jwt.middleware';
import {createRequest, createResponse} from 'node-mocks-http';
import {BaseResponseDto} from "../src/controllers/responses/BaseResponse.dto";
import {Gender, IUser, Role} from "../src/models/user.schema";

describe('auth-middleware', () => {
    it("Authorization Header is empty", () => {
        const req = createRequest();
        const resp = createResponse();
        const next = jest.fn();

        verifyToken(req, resp, next);
        const responseData = resp._getJSONData() as BaseResponseDto<null>;

        expect(resp.statusCode).toBe(401);
        expect(responseData.status.code).toBe(401)
        expect(responseData.status.message).toBe("Unauthorized")
    });
    it('Access Token is not valid', () => {
        const req = createRequest({
            method: 'GET',
            url: '/',
            headers: {
                authorization: 'Bearer abc'
            }
        });
        const resp = createResponse();
        const next = jest.fn();

        verifyToken(req, resp, next);
        const responseData = resp._getJSONData() as BaseResponseDto<null>;

        expect(resp.statusCode).toBe(401);
        expect(responseData.status.code).toBe(401)
        expect(responseData.status.message).toBe("Token invalid")
    });
    it("Access Token valid", () => {
        const user: IUser = {
            email: "test@test.com",
            active: true,
            dob: new Date(),
            fullName: "Pham Hoang Duong",
            gender: Gender.MALE,
            role: Role.ADMIN,
            phoneNumber: '0989211621',
            password: "duongExtension@",
            createdAt: new Date(),
            updatedAt: new Date(),
            favoritesProduct: []
        }

        const token = generateToken(user);
        const req = createRequest({
            method: 'GET',
            url: '/',
            headers: {
                authorization: `Bearer ${token}`,
            }
        });

        const resp = createResponse();
        const next = jest.fn();

        verifyToken(req, resp, next);
        expect(next).toHaveBeenCalled();
    });
})