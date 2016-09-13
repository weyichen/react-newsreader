module.exports = function(user) {
  user.password = undefined;
  user.__v = undefined;
  return user;
}
