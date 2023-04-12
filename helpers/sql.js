const { BadRequestError } = require("../expressError");

/**
 * Helper function to format JSON body from .update routes for SET sql
 * statement
 *
 * Takes:
 *  - dataToUpdate: JS object containing data meant to DB
 *  - jsToSql: JS object containing column names for DB model
 *
 * Returns:
 * {
 *   setCols: (string of column names for SET statement),
 *   values: [array of values for SET statement]
 * }
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
    `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
