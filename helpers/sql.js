const { BadRequestError } = require("../expressError");

/**
 * Helper function to format JSON body from .update routes for SET sql
 * statement
 * TODO: Add example input/return, update language to make clear this is a more general function
 * Takes:
 *  - dataToUpdate: JS object containing data meant for DB
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
  const cols = keys.map(
    (colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

/**
 * Helper function to format JSON body from search querires for SET sql
 * statement
 *
 * Takes:
 *  - params: JS object containing 1 - 3 optional queries
 *    {name: query value,...}
 *  - jsToSql: JS object containing column names for DB model
 *    {jsColName: psqlColName, ...}
 *
 * Returns:
 * {
 *   whereCols: (string of column names for SET statement),
 *   values: [array of values for SET statement]
 * }
 */
// TODO: remove JSON body mention, provide clear example of input/return
function sqlForWhereQuery(params, jsToSql) {
  const keys = Object.keys(params);
  const { minEmployees, maxEmployees } = params;

  if (
    "minEmployees" in params &&
    "maxEmployees" in params &&
    minEmployees > maxEmployees
  ) {
    throw new BadRequestError("Max employees greater than min employees!");
  }

  let operator = "=";
  // {nameLike: 'Twitter', maxEmployees: 20, minEmployees: 10} => ['"name"'=$1, "numEmployees < 20, numEmployees > 10"]
  const cols = keys.map((colName, idx) => {
    if (colName === "minEmployees") {
      operator = ">";
    } else if (colName === "maxEmployees") {
      operator = "<";
    } else if (colName === "nameLike") {
      operator = "ILIKE";
      params.nameLike = `%${params.nameLike}%`;
    }
    return `"${jsToSql[colName] || colName}" ${operator} $${idx + 1}`;
  });
  // console.log("SQL STATEMENT", cols.join("AND"));
  console.log("ANSWER to SQLWHERE", {
    whereCols: cols.join(" AND "),
    values: Object.values(params),
  });
  return {
    whereCols: cols.join(" AND "),
    values: Object.values(params),
  };
}

//TODO: Move this into models as _helper method

module.exports = { sqlForPartialUpdate, sqlForWhereQuery };
