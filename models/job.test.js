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
    company_handle: "c1",
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
      company_handle: 3,
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

  test("works for all filters ", async function () {
    const jobs = await Job.filterJobs({
      title: "j",
      minSalary: 90000,
      hasEquity: true,
    });
    expect(jobs).toEqual([
      {
        id: 2,
        title: "j2",
        salary: 90000,
        equity: 0.01,
        company_handle: "c2",
      },
    ]);
  });

  // Works partial filter

  test("works for filtering title", async function () {
    const jobs = await Job.filterJobs({
      title: "j",
    });
    expect(jobs).toEqual([
      {
        id: 2,
        title: "j2",
        salary: 90000,
        equity: 0.01,
        company_handle: "c2",
      },
    ]);
  });

  test("works for filtering min salary", async function () {
    const jobs = await Job.filterJobs({
      minSalary: 80000,
    });
    expect(jobs).toEqual([
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

  test("works for filtering equity", async function () {
    const jobs = await Job.filterJobs({
      hasEquity: true,
    });
    expect(jobs).toEqual([
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

  // Fails invalid filters

  test("fails for queries don't match schema", async function () {
    try {
      const jobs = await Job.filterJobs({
        wrong: "wrong",
        bad: "bad",
      });
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** get */

describe("get a job", function () {
  test("works", async function () {
    let job = await Job.get("j2");
    expect(job).toEqual({
      id: 2,
      title: "j2",
      salary: 90000,
      equity: 0.01,
      company_handle: "c2",
    });
  });

  test("not found if no such job", async function () {
    try {
      await Job.get("nope");
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    title: "new title",
    salary: 1,
    equity: 0,
  };

  test("works", async function () {
    let job = await Job.update(2, updateData);
    expect(job).toEqual({
      id: 2,
      ...updateData,
    });

    const result = await db.query(
      `SELECT id, title, salary, equity, company_handle
         FROM jobs
         WHERE id = 2`
    );
    expect(result.rows).toEqual([
      {
        id: 2,
        title: "new title",
        salary: 1,
        equity: 0,
        company_handle: "c2",
      },
    ]);
  });

  test("works null fields", async function () {
    const updateDataSetNulls = {
      title: "new title",
      salary: null,
      equity: null,
      company_handle: "c2",
    };

    let job = await Job.update(2, updateDataSetNulls);
    expect(job).toEqual({
      id: 2,
      ...updateDataSetNulls,
    });

    const result = await db.query(
      `SELECT id, title, salary, equity, company_handle
      FROM jobs
      WHERE id = 2`
    );

    expect(result.rows).toEqual([
      {
        id: 2,
        title: "new title",
        salary: null,
        equity: null,
        company_handle: "c2",
      },
    ]);
  });
});

test("works for partial fields", async function () {
  const updatePartialData = {
    title: "new title",
  };

  let job = await Job.update(2, updatePartialData);
  expect(job).toEqual({
    id: 2,
    ...updatePartialData,
  });

  const result = await db.query(
    `SELECT id, title, salary, equity, company_handle
    FROM jobs
    WHERE id = 2`
  );

  expect(result.rows).toEqual([
    {
      id: 2,
      title: "new title",
      salary: null,
      equity: null,
      company_handle: "c2",
    },
  ]);
});

test("not found if no such job", async function () {
  try {
    await Job.update("nope", updateData);
    throw new Error("fail test, you shouldn't get here");
  } catch (err) {
    expect(err instanceof NotFoundError).toBeTruthy();
  }
});

test("bad request with no data", async function () {
  try {
    await Job.update(2, {});
    throw new Error("fail test, you shouldn't get here");
  } catch (err) {
    expect(err instanceof BadRequestError).toBeTruthy();
  }
});

/************************************** remove */

// Works
describe("remove", function () {
  test("works", async function () {
    await Job.remove(1);
    const res = await db.query("SELECT id FROM jobs WHERE id='1'");
  });
});

// Not found if no such job
