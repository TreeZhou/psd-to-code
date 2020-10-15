var copydir = require('copy-dir');
var path = require('path');

module.exports = function init() {
  const from = path.join(__dirname, 'p2cConfig');
  const to = path.join(process.cwd(), 'p2cConfig');
  copydir.sync(from, to);
};
