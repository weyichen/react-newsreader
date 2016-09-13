module.exports = function(req, res, next) {
  if (res.locals.own || res.locals.admin)
    return next();
  res.status(403).send('Not authorized.');
};