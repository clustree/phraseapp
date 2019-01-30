const fs = require('fs');
const path = require('path');

exports.writeJson = function(folder, filename, data) {
  const sortedKeys = Object.keys(data).sort((a, b) => (a < b ? -1 : 1));
  const sortedData = {};
  for (const key of sortedKeys) {
    sortedData[key] = data[key];
  }

  fs.writeFileSync(path.join(folder, filename), JSON.stringify(sortedData, null, 2) + '\n');
};

exports.getReadStream = function(folder, filename) {
  return fs.createReadStream(path.join(folder, filename));
};
