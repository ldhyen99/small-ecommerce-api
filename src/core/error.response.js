'use strict';

const { StatusCodes, ReasonPhrases } = require('../utils/httpStatusCode');

// const {StatusCode, ReasonStatusCode}
// const StatusCode = {
//   FORBIDDEN: 403,
//   CONFLICT: 409,
// };

// const ReasonStatusCode = {
//   FORBIDDEN: 'Bad request error',
//   CONFLICT: 'Conflict error',
// };

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflicRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.CONFLICT,
    statusCode = StatusCodes.CONFLICT
  ) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.FORBIDDEN,
    statusCode = StatusCodes.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  ConflicRequestError,
  BadRequestError,
};
