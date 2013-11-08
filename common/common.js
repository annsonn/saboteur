// Example of a common javascipt file between server and client

console.log('common file loaded up');

var typeOfCard = function(node) {
  if (node.indexOf('free') >= 0 || node.indexOf('block') >= 0) {
    return 'action';
  } else if (node.indexOf('map') >= 0) {
    return 'map';
  } else if (node.indexOf('avalanche') >= 0) {
    return 'avalanche';
  }
    return 'path';
};

