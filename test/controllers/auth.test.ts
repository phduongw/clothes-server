import Users, {Gender, IUser, Role} from "../../src/models/user";
import {createRequest, createResponse} from "node-mocks-http";
import {ISignUpRequest} from "../../src/controllers/request/SignUpRequest";
import {login, signup} from "../../src/controllers/AuthController";
import {BaseResponse} from "../../src/controllers/responses/BaseResponse";
import {compare, hash} from "bcryptjs";
import {generateToken} from "../../src/middlewares/jwt";
import {ISignInRequest} from "../../src/controllers/request/SignInRequest";


jest.mock("bcryptjs");
jest.mock('../../src/models/user');

describe("signup user", () => {
    const mockRequest = (body: ISignUpRequest) => createRequest({
        method: "POST",
        body: body,
    });
    const mockResponse = () => createResponse();
    const user: IUser = {
        email: "test@test.com",
        active: true,
        dob: new Date(),
        fullName: "Pham Hoang Duong",
        gender: Gender.MALE,
        role: Role.ADMIN,
        phoneNumber: '0989211621',
        password: "duongExtension@110299",
        createdAt: new Date(),
        updatedAt: new Date(),
    }

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should return 400 if email already exist', async () => {
        (Users.findOne as jest.Mock).mockResolvedValueOnce(user);
        const req = mockRequest({
            fullName: "Pham Hoang Duong",
            gender: Gender.MALE,
            dob: new Date(),
            email: 'eganpham.99@gmail.com',
            password: 'duongExtension@110299',
            repeatPassword: 'duongExtension@110299',
            phoneNumber: '0989211621'
        });

        const response = mockResponse();

        await signup(req, response);
        const responseData = response._getJSONData() as BaseResponse<null>;

        expect(response.statusCode).toBe(200);
        expect(responseData.status.code).toBe(400);
        expect(responseData.status.message).toEqual('Email already exist');
        expect([null, undefined]).toContain(responseData.data);
    });

    it("Should return 400 if password and repeat password not match", async () => {
        (Users.findOne as jest.Mock).mockResolvedValueOnce(null);
        const req = mockRequest({
            fullName: "Pham Hoang Duong",
            gender: Gender.MALE,
            dob: new Date(),
            email: 'eganpham.99@gmail.com',
            password: 'duongExtension@110299',
            repeatPassword: '3gAn@130522',
            phoneNumber: '0989211621'
        });
        const response = mockResponse();

        await signup(req, response);
        const responseData = response._getJSONData() as BaseResponse<null>;

        expect(response.statusCode).toBe(200);
        expect(responseData.status.code).toBe(400);
        expect(responseData.status.message).toBe('Password and not match');
        expect([null, undefined]).toContain(responseData.data);
    });

    it("Should return 500 if Database is down", async () => {
        (Users.findOne as jest.Mock).mockRejectedValueOnce(new Error("DB Error"));
        const hashPasswordFn = jest.fn();
        const saveUserFn = jest.fn();
        (hash as jest.Mock) = hashPasswordFn;
        (Users as unknown as jest.Mock).mockImplementation(() => ({
            save: saveUserFn
        }))

        const req = mockRequest({
            fullName: "Pham Hoang Duong",
            gender: Gender.MALE,
            dob: new Date(),
            email: 'eganpham.99@gmail.com',
            password: 'duongExtension@110299',
            repeatPassword: 'duongExtension@110299',
            phoneNumber: '0989211621'
        });
        const response = mockResponse();

        await signup(req, response);
        const responseData = response._getJSONData() as BaseResponse<null>;

        expect(response.statusCode).toBe(200);
        expect(hashPasswordFn).not.toHaveBeenCalled();
        expect(saveUserFn).not.toHaveBeenCalled();
        expect(responseData.status.code).toBe(500);
        expect(responseData.status.message).toBe('Internal Server Error');
    });
    it('Should return 500 if hash password failed', async () => {
        (Users.findOne as jest.Mock).mockResolvedValueOnce(null);
        const req = mockRequest({
            fullName: "Pham Hoang Duong",
            gender: Gender.MALE,
            dob: new Date(),
            email: 'eganpham.99@gmail.com',
            password: 'duongExtension@110299',
            repeatPassword: 'duongExtension@110299',
            phoneNumber: '0989211621'
        });
        const response = mockResponse();
        const mockSave = jest.fn();
        (hash as jest.Mock).mockRejectedValueOnce(new Error("Hash failed"));
        (Users as unknown as jest.Mock).mockImplementation(() => ({
            save: mockSave
        }));

        await signup(req, response);
        const responseData = response._getJSONData() as BaseResponse<null>;

        expect(hash).toHaveBeenCalled();
        expect(mockSave).not.toHaveBeenCalled();
        expect(response.statusCode).toBe(200);
        expect(responseData.status.code).toBe(500);
        expect(responseData.status.message).toBe('Internal Server Error');
        expect([null, undefined]).toContain(responseData.data);
    });
    it("Should return 400 if saving a user failed", async () => {
        (Users.findOne as jest.Mock).mockResolvedValueOnce(null);
        const req = mockRequest({
            fullName: "Pham Hoang Duong",
            gender: Gender.MALE,
            dob: new Date(),
            email: 'eganpham.99@gmail.com',
            password: 'duongExtension@110299',
            repeatPassword: 'duongExtension@110299',
            phoneNumber: '0989211621'
        });
        const resp = mockResponse();
        (hash as jest.Mock).mockResolvedValueOnce("hashedPassword");
        const saveMock = jest.fn().mockResolvedValueOnce(undefined);
        (Users as unknown as jest.Mock).mockImplementation(() => ({
                save: saveMock
            }))

        await signup(req, resp);
        const respData = resp._getJSONData() as BaseResponse<null>;

        expect(hash).toHaveBeenCalled();
        expect(saveMock).toHaveBeenCalled();
        expect(resp.statusCode).toBe(200);
        expect(respData.status.code).toBe(400);
        expect(respData.status.message).toBe('Failed to create account');
    });
    it('Should return 200 if saving a user success', async () => {
        const dob = new Date();
        const resp = mockResponse();
        const req = mockRequest({
            fullName: "Pham Hoang Duong",
            gender: Gender.MALE,
            dob,
            email: 'eganpham.99@gmail.com',
            password: 'duongExtension@110299',
            repeatPassword: 'duongExtension@110299',
            phoneNumber: '0989211621'
        });

        (Users.findOne as jest.Mock).mockResolvedValueOnce(null);
        (hash as jest.Mock).mockResolvedValueOnce("hashedPassword");
        const createdUser: IUser = {
            fullName: "Pham Hoang Duong",
            email: 'eganpham.99@gmail.com',
            password: 'hashedPassword',
            dob,
            gender: Gender.MALE,
            phoneNumber: '0989211621',
            role: Role.GUEST,
            active: true
        };
        const mockSave = jest.fn().mockResolvedValueOnce(createdUser);
        (Users as unknown as jest.Mock).mockImplementation(() => ({
            save: mockSave
        }));

        await signup(req, resp);
        const responseData = resp._getJSONData() as BaseResponse<IUser>;

        expect(hash).toHaveBeenCalled();
        expect(mockSave).toHaveBeenCalled();
        expect(resp.statusCode).toBe(200);
        expect(responseData.status.code).toBe(200);
        expect(responseData.status.message).toBe('Success');
        expect(responseData.data?.active).toBe(true);
        expect(responseData.data?.fullName).toBe(createdUser.fullName);
        expect(responseData.data?.email).toBe(createdUser.email);
        expect(responseData.data?.password).toBe(createdUser.password);
        expect(responseData.data?.dob).toBe(createdUser.dob.toISOString());
        expect(responseData.data?.gender).toBe(createdUser.gender);
        expect(responseData.data?.phoneNumber).toBe(createdUser.phoneNumber);
        expect([null, undefined]).toContain(createdUser.infoReceiving);
        expect(responseData.data?.role).toBe(createdUser.role);
    });
})

describe('Login user', () => {
    const mockRequest = (body: ISignInRequest) => createRequest({
        method: "POST",
        body: body,
    });
    const mockResponse = () => createResponse();
    const createdUser: IUser = {
        fullName: "Pham Hoang Duong",
        email: 'eganpham.99@gmail.com',
        password: 'hashedPassword',
        dob: new Date(),
        gender: Gender.MALE,
        phoneNumber: '0989211621',
        role: Role.GUEST,
        active: true
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    const body: ISignInRequest = {
        email: 'eganpham.99@gmail.com',
        password: 'duongExtension@110299',
    }

    it('Should return 400 if email not found', async () => {
        const req = mockRequest(body);
        const resp = mockResponse();
        const compareMock = jest.fn();
        const generateTokenMock = jest.fn();
        (Users.findOne as jest.Mock).mockResolvedValue(undefined);
        (compare as jest.Mock) = compareMock;
        (generateToken as jest.Mock) = generateTokenMock;
        await login(req, resp);
        const respData = resp._getJSONData() as BaseResponse<null>;

        expect(resp.statusCode).toBe(200);
        expect(respData.status.code).toBe(400);
        expect(respData.status.message).toBe("Email or password isn't correct");
        expect(compareMock).not.toHaveBeenCalled();
        expect(generateTokenMock).not.toHaveBeenCalled();
    });
    it('should return 400 if password is wrong', async () => {
        const req = mockRequest(body);
        const resp = mockResponse();
        (Users.findOne as jest.Mock).mockResolvedValueOnce(createdUser);
        (compare as jest.Mock).mockResolvedValue(false);

        await login(req, resp);
        const respData = resp._getJSONData() as BaseResponse<null>;

        expect(resp.statusCode).toBe(200);
        expect(respData.status.code).toBe(400);
        expect(respData.status.message).toBe("Email or password isn't correct");
        expect(generateToken).not.toHaveBeenCalled();
        expect(compare).toHaveBeenCalled();
        expect([null, undefined]).toContain(respData.data)
    });
})