module.exports = function (fields, requiredFields) {
  var rF = requiredFields;
  for (var i=0; i<rF.length; i++) {
    if (!fields[rF[i]])
      return false;
  }
  return true;
}