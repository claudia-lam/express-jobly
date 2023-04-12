"use strict";

const { BadRequestError } = require("../expressError");
const { sqlForPartialUpdate } = require("./sql");

/** optimistic case (correct handle for companies) */

describe("sqlForPartialUpdate", function () {
  test("works: complete JSON body for companies", function () {
    const output = sqlForPartialUpdate({
      numEmployees: 100,
      logoUrl: "http://test.com"
    },
      {
        numEmployees: "num_employees",
        logoUrl: "logo_url",
      });

    expect(output).toEqual({
      setCols: '"num_employees"=$1, "logo_url"=$2',
      values: [100, "http://test.com"]
    });

  });

  test("works: partial JSON body for companies", function () {
    const output = sqlForPartialUpdate({
      numEmployees: 100,
    },
      {
        numEmployees: "num_employees",
        logoUrl: "logo_url",
      });

    expect(output).toEqual({
      setCols: '"num_employees"=$1',
      values: [100]
    });

  });

  test("works: complete JSON body for users", function () {
    const output = sqlForPartialUpdate({
      firstName: "Test",
      lastName: "Test2",
      isAdmin: false
    },
      {
        firstName: "first_name",
        lastName: "last_name",
        isAdmin: "is_admin"
      });

    expect(output).toEqual({
      setCols: '"first_name"=$1, "last_name"=$2, "is_admin"=$3',
      values: ["Test", "Test2", false]
    });

  });

  test("works: partial JSON body for users", function () {
    const output = sqlForPartialUpdate({
      firstName: "Test",
      lastName: "Test2",
    },
      {
        firstName: "first_name",
        lastName: "last_name",
        isAdmin: "is_admin"
      });

    expect(output).toEqual({
      setCols: '"first_name"=$1, "last_name"=$2',
      values: ["Test", "Test2"]
    });

  });

  test("fails: empty JSON body", function () {
    try {
      const output = sqlForPartialUpdate({},
        {
          numEmployees: "num_employees",
          logoUrl: "logo_url",
        }
      );
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestError);
    }

  });

  test("works: defaults to colName if doesn't fit jsToSql", function () {

    const output = sqlForPartialUpdate({
      different: 100,
      different2: "http://test.com"
    },
      {
        numEmployees: "num_employees",
        logoUrl: "logo_url",
      });

    expect(output).toEqual({
        setCols: '"different"=$1, "different2"=$2',
        values: [100, 'http://test.com']
    });


});


})

/** pessimistic case (empty body) */



/** pessismitic case (doesn't fit jsToSql) */

