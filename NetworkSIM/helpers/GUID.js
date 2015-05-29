/**
 * Class that generates RFC4122 compliant GUIDs
 * 
 * See http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/2117523#2117523
 */
var guid = function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
};

module.exports = guid;
