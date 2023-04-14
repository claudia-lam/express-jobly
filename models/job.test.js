"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */
// Test works
describe("create", function () {
  const newJob = {
    title: "newJob",
    salary: 50000,
    equity: 0.01,
    company_handle: "c1"
  };

  test("works", async function () {
    let job = await Job.create(newJob);
    expect(job).toEqual(newJob);

    const result = await db.query(
      `SELECT id, title, salary, equity, company_handle
           FROM jobs
           WHERE title = 'newJob'`
    );
    expect(result.rows).toEqual([
      {
        id: 4,
        title: "newJob",
        salary: 50000,
        equity: 0.01,
        company_handle: "c1",
      },
    ]);
  });

  test("fails with invalid input", async function () {
    const invalidJob = {
      title: 1,
      salary: "salary",
      equity: -1,
      company_handle: 3
    };
    try {
      await Job.create(invalidJob);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  test("fails with incomplete input", async function () {
    const invalidJob = {
      title: "newJob",
    };
    try {
      await Job.create(invalidJob);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

});


/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let jobs = await Job.findAll();
    expect(jobs).toEqual([
      {
        id: 1,
        title: "j1",
        salary: 100000,
        equity: 0,
        company_handle: "c1",
      },
      {
        id: 2,
        title: "j2",
        salary: 90000,
        equity: 0.01,
        company_handle: "c2",
      },
      {
        id: 3,
        title: "j3",
        salary: 50000,
        equity: 0.03,
        company_handle: "c3",
      },
    ]);
  });
});

/************************************** filter */

// Works partial filter

// Fails invalid filters

// Works w/ minSalary

// Works w/ hasEquity

// Fails w/ negative hasEquity value

/************************************** get */

// Works w/ single job

// Fails if job doesn't exist
  // Make sure to write backup error

/************************************** update */

// Works

// Works w/ null fields

// Works w/ partial info

// Not found if no such job

// Bad request w/ no data

/************************************** remove */

// Works

// Not found if no such job
