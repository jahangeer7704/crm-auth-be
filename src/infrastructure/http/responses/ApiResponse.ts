import type { Response } from 'express';

export enum StatusCode {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 503
}

export abstract class ApiResponse {
    constructor(
        protected status: StatusCode,
        protected message: string,
        protected data: any = {}
    ) { }

    protected prepare<T extends ApiResponse>(
        res: Response,
        response: T
    ): Response {
        return res.status(this.status).send(response);
    }

    public send(res: Response): Response {
        return this.prepare<ApiResponse>(res, this);
    }
}

export class SuccessResponse extends ApiResponse {
    constructor(message: string, data: any = {}) {
        super(StatusCode.OK, message, data);
    }
}

export class CreatedResponse extends ApiResponse {
    constructor(message: string = 'Created', data: any = {}) {
        super(StatusCode.CREATED, message, data);
    }
}

export class NoContentResponse extends ApiResponse {
    constructor(message: string = 'No Content', data: any = {}) {
        super(StatusCode.NO_CONTENT, message, data);
    }
}

export class BadRequestResponse extends ApiResponse {
    constructor(message: string = 'Bad Request', data: any = {}) {
        super(StatusCode.BAD_REQUEST, message, data);
    }
}

export class UnauthorizedResponse extends ApiResponse {
    constructor(message: string = 'Unauthorized', data: any = {}) {
        super(StatusCode.UNAUTHORIZED, message, data);
    }
}

export class ForbiddenResponse extends ApiResponse {
    constructor(message: string = 'Forbidden', data: any = {}) {
        super(StatusCode.FORBIDDEN, message, data);
    }
}

export class NotFoundResponse extends ApiResponse {
    constructor(message: string = 'Not Found', data: any = {}) {
        super(StatusCode.NOT_FOUND, message, data);
    }
}

export class ConflictResponse extends ApiResponse {
    constructor(message: string = 'Conflict', data: any = {}) {
        super(StatusCode.CONFLICT, message, data);
    }
}

export class UnprocessableEntityResponse extends ApiResponse {
    constructor(message: string = 'Unprocessable Entity', data: any = {}) {
        super(StatusCode.UNPROCESSABLE_ENTITY, message, data);
    }
}

export class InternalServerErrorResponse extends ApiResponse {
    constructor(message: string = 'Internal Server Error', data: any = {}) {
        super(StatusCode.INTERNAL_SERVER_ERROR, message, data);
    }
}

export class ServiceUnavailableResponse extends ApiResponse {
    constructor(message: string = 'Service Unavailable', data: any = {}) {
        super(StatusCode.SERVICE_UNAVAILABLE, message, data);
    }
}
