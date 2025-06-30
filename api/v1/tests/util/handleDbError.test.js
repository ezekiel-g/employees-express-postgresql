import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  jest,
} from '@jest/globals';
import handleDbError from '../../util/handleDbError.js';

describe('handleDbError', () => {
  let response;
  const columnNames = ['email', 'username', 'password'];

  const runTest = (errorInput, expectedStatus, expectedMessage) => {
    handleDbError(response, errorInput, columnNames);

    expect(response.status).toHaveBeenCalledWith(expectedStatus);
    expect(response.json).toHaveBeenCalledWith([expectedMessage]);
  };

  beforeAll(() => jest.spyOn(console, 'error').mockImplementation(() => {}));

  beforeEach(() => {
    response = {};
    response.status = jest.fn().mockReturnValue(response);
    response.json = jest.fn().mockReturnValue(response);
  });

  afterAll(() => console.error.mockRestore());

  it('returns 400 for NOT NULL violation with email', () => {
    runTest(
      {
        code: '23502',
        message: 'Column \'email\' cannot be null',
      },
      400,
      'Email required',
    );
  });

  it('returns 400 for string too long with username', () => {
    runTest(
      {
        code: '22001',
        message: 'Data too long for column \'username\'',
      },
      400,
      'Username too long',
    );
  });

  it('returns 400 for out of range value with password', () => {
    runTest(
      {
        code: '22003',
        message: 'Value out of range for column \'password\'',
      },
      400,
      'Password out of range',
    );
  });

  it('returns 400 for check constraint violation with password', () => {
    runTest(
      {
        code: '23514',
        message: 'Check constraint failed for column \'password\'',
      },
      400,
      'Password invalid',
    );
  });

  it('returns 400 for invalid type with email', () => {
    runTest(
      {
        code: '22023',
        message: 'Illegal value for column \'email\'',
      },
      400,
      'Email invalid',
    );
  });

  it('returns 400 for invalid string length with username', () => {
    runTest(
      {
        code: '22023',
        message: 'Wrong string length for column \'username\'',
      },
      400,
      'Username invalid',
    );
  });

  it('returns 400 for data truncation with email', () => {
    runTest(
      {
        code: '22001',
        message: 'Truncated incorrect value for column \'email\'',
      },
      400,
      'Email too long',
    );
  });

  it('returns 422 for unique constraint violation with username', () => {
    runTest(
      {
        code: '23505',
        message: 'Duplicate entry for key \'username\'',
      },
      422,
      'Username taken',
    );
  });

  it('returns 500 for unknown error code', () => {
    runTest(
      { code: 'UNKNOWN_CODE', message: 'Something went wrong' },
      500,
      'Unexpected error',
    );
  });

  it('returns 500 for missing error code and message', () => {
    runTest(
      { message: 'Something went wrong' },
      500,
      'Unexpected error',
    );
  });

  it('capitalizes column name in message', () => {
    runTest(
      {
        code: '23502',
        message: 'Column \'password\' cannot be null',
      },
      400,
      'Password required',
    );
  });
});
