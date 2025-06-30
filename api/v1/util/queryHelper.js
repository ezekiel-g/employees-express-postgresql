const formatInsert = (requestBody) => {
  const columnNames = Object.keys(requestBody);
  const queryParams = columnNames.map((name) => requestBody[name]);
  const placeholders = columnNames.length
    ? columnNames.map((_, i) => `$${i + 1}`).join(', ')
    : '';

  return [columnNames, queryParams, placeholders];
};

const formatUpdate = (requestBody, id) => {
  const columnNames = Object.keys(requestBody).filter((name) => name !== 'id');
  const queryParams = columnNames.map((name) => requestBody[name]);
  const setClause = columnNames.map(
    (field, i) => `${field} = $${i + 1}`,
  ).join(', ');
  queryParams.push(id);

  return [columnNames, setClause, queryParams];
};

export { formatInsert, formatUpdate };
