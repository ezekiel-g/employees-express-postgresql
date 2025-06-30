const handleDbError = (response, error, columnNames = []) => {
  let statusCode = 500;
  let message = 'Unexpected error';
  let columnName = 'Value';

  for (let i = 0; i < columnNames.length; i++) {
    if (error.message && error.message.includes(columnNames[i])) {
      columnName = columnNames[i].replace(/^./, (word) => word.toUpperCase());
      break;
    }
  }

  if (error.code === '23502') {
    statusCode = 400;
    message = `${columnName} required`;
  }

  else if (error.code === '22001') {
    statusCode = 400;
    message = `${columnName} too long`;
  }

  else if (error.code === '22003') {
    statusCode = 400;
    message = `${columnName} out of range`;
  }

  else if (
    error.code === '23514' ||
    error.code === '22023' ||
    error.code === '22008'
  ) {
    statusCode = 400;
    message = `${columnName} invalid`;
  }

  else if (error.code === '23505') {
    statusCode = 422;
    message = `${columnName} taken`;
  }

  console.error(`Error${error.code ? ` ${error.code}` : ''}: ${error.message}`);

  if (error.stack) console.error(error.stack);

  return response.status(statusCode).json([message]);
};

export default handleDbError;
