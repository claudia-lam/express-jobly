"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate, sqlForWhereQuery } = require("../helpers/sql");

/** Related functions for jobs. */

class Job {
  /** Create a job (from data), update db, return new job data.
   *
   * data should be { id, title, salary, equity, company_handle }
   *
   * Returns { id, title, salary, equity, company_handle }
   *
   * Throws BadRequestError if company already in database.
   * */

  static async create({}){

  }


  static async findAll({}){

  }


  static async filterJobs({}){

  }


  static async get({}){

  }

  static async update({}){

  }

  static async remove({}){

  }

}

module.exports = Job;