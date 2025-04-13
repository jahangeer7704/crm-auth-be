import type { Response } from 'express';
import {
    ApiResponse,
    BadRequestResponse,
    UnauthorizedResponse,
    ForbiddenResponse,
    NotFoundResponse,
    ConflictResponse,
    UnprocessableEntityResponse,
    ServiceUnavailableResponse,
    InternalServerErrorResponse
} from '@/infrastructure/http/responses/ApiResponse.js';
export enum ERRORNAMES {
    BAD_REQUEST = 'BadRequestError',
    UNAUTHORIZED = 'UnauthorizedError',
    FORBIDDEN = 'ForbiddenError',
    NOT_FOUND = 'NotFoundError',
    CONFLICT = 'ConflictError',
    UNPROCESSABLE_ENTITY = 'UnprocessableEntityError',
    SERVICE_UNAVAILABLE = 'ServiceUnavailableError',
    INTERNAL_SERVER_ERROR = 'InternalServerError'
}

export class ApiError extends Error {
    private statusCode: number;
    private static response: ApiResponse
   protected constructor(message: string, statusCode: number) {
        super(message)
        this.statusCode = statusCode
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor);

    }

    public static handleError(error: ApiError, res: Response): Response {

        switch (error.name) {
            case ERRORNAMES.BAD_REQUEST:
                ApiError.response = new BadRequestResponse(error.message);
                break;
            case ERRORNAMES.UNAUTHORIZED:
                ApiError.response = new UnauthorizedResponse(error.message);
                break;
            case ERRORNAMES.FORBIDDEN:
                ApiError.response = new ForbiddenResponse(error.message);
                break;
            case ERRORNAMES.NOT_FOUND:
                ApiError.response = new NotFoundResponse(error.message);
                break;
            case ERRORNAMES.CONFLICT:
                ApiError.response = new ConflictResponse(error.message);
                break;
            case ERRORNAMES.UNPROCESSABLE_ENTITY:
                ApiError.response = new UnprocessableEntityResponse(error.message);
                break;
            case ERRORNAMES.SERVICE_UNAVAILABLE:
                ApiError.response = new ServiceUnavailableResponse(error.message);
                break;
            default:
                ApiError.response = new InternalServerErrorResponse();
                break;
        }
        return ApiError.response.send(res)
    }

}
export class BadRequestError extends ApiError {
    constructor(message = 'Bad Request') {
        super(message, 400);
        this.name = ERRORNAMES.BAD_REQUEST;
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
        this.name = ERRORNAMES.UNAUTHORIZED;
    }
}

export class ForbiddenError extends ApiError {
    constructor(message = 'Forbidden') {
        super(message, 403);
        this.name = ERRORNAMES.FORBIDDEN;
    }
}

export class NotFoundError extends ApiError {
    constructor(message = 'Not Found') {
        super(message, 404);
        this.name = ERRORNAMES.NOT_FOUND;
    }
}

export class ConflictError extends ApiError {
    constructor(message = 'Conflict') {
        super(message, 409);
        this.name = ERRORNAMES.CONFLICT;
    }
}

export class UnprocessableEntityError extends ApiError {
    constructor(message = 'Unprocessable Entity') {
        super(message, 422);
        this.name = ERRORNAMES.UNPROCESSABLE_ENTITY;
    }
}

export class InternalServerError extends ApiError {
    constructor(message = 'Internal Server Error') {
        super(message, 500);
        this.name = ERRORNAMES.INTERNAL_SERVER_ERROR;
    }
}

export class AuthFailureError extends UnauthorizedError {
    constructor(message = 'Authentication Failed') {
        super(message);
    }
}

export class ValidationError extends BadRequestError {
    constructor(message = 'Validation Error') {
        super(message);
    }
}

export class ResourceNotFoundError extends NotFoundError {
    constructor(message = 'Resource Not Found') {
        super(message);
    }
}

export class DuplicateResourceError extends ConflictError {
    constructor(message = 'Duplicate Resource') {
        super(message);
    }
}
