"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
  if (!res.locals.user) throw new UnauthorizedError();
  return next();
}

/**Require admin user or raise 401 */

function ensureAdmin(req, res, next) {
  const user = res.locals.user;
  if (user && user.isAdmin === true) {
    return next();
  }
  throw new UnauthorizedError();
}

//TODO: add login to docstring
/** Middleware: Requires user is user for route or admin. */

function ensureAdminOrCorrectUser(req, res, next) {
  const currentUser = res.locals.user;
  const hasAuthorizedUsername = currentUser?.username === req.params.username;

  const isAdmin = currentUser?.isAdmin === true;

  if (isAdmin || hasAuthorizedUsername) {
    return next();
  }

  throw new UnauthorizedError("Must be admin or current user!");
}

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureAdminOrCorrectUser,
};
