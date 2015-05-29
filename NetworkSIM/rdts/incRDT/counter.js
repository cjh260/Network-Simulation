'use strict';

function Counter() {

  this.v = 0;

  this.inc = function() {
    this.v += 1;
  };

  this.val = function() {
    return this.v;
  };
}

module.exports = Counter;