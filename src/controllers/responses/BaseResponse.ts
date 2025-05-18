export interface IBaseResponse<T> {
    status: {
        code: number;
        message: string | string[];
        errorCode?: string
        timestamp: string;
    },
    data?: T;
    ok(data: T): BaseResponse<T>;
    failed(statusCode: number, message: string, errorCode: string): BaseResponse<T>;
}

export class BaseResponse<T> implements IBaseResponse<T>{
    status: {
        code: number;
        message: string | string [];
        timestamp: string;
        errorCode?: string
    };

    data?: T;

    constructor() {
        this.status = {
            code: 200,
            message: "Success",
            timestamp: new Date().toISOString()
        }
    }

    ok(data: T) {
        this.data = data;

        return this;
    };

    failed(statusCode: number, message: string | string[], errorCode: string): this {
        this.status.code = statusCode;
        this.status.message = message;
        this.status.errorCode = errorCode;
        this.status.timestamp = new Date().toISOString();

        return this;
    }

}

